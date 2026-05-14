import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from './services/supabaseClient';
import Welcome from './views/Welcome';
import Onboarding from './views/Onboarding';
import MemberArea from './views/MemberArea';
import MaterialViewer from './views/MaterialViewer';
import Training from './views/Training';
import Result from './views/Result';
import AdminSettings from './views/AdminSettings';
import CourseBuilder from './views/CourseBuilder';
import Campaigns from './views/Campaigns';
import Audits from './views/Audits';
import Topbar from './components/Topbar';
import SideDrawer from './components/SideDrawer';
import './App.css';

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentView, setCurrentView] = useState('home');

  // App Global State
  const [department, setDepartment] = useState('');
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [adminEditCourseId, setAdminEditCourseId] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [realRole, setRealRole] = useState(null);
  const [effectiveRole, setEffectiveRole] = useState(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Results & Tracking
  const [recentResult, setRecentResult] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedCourses: []
  });

  // Carregar dados do usuário do Supabase
  useEffect(() => {
    async function fetchUserData() {
      if (isSignedIn && user) {
        setIsFetchingData(true);
        try {
          const [profileResponse, progressResponse] = await Promise.all([
            supabase
              .from('user_profiles')
              .select('department, role')
              .eq('user_id', user.id)
              .single(),
            supabase
              .from('course_progress')
              .select('course_id')
              .eq('user_id', user.id)
              .gte('percentage', 70)
          ]);

          if (profileResponse.data) {
            setDepartment(profileResponse.data.department);
            const userRole = profileResponse.data.role || 'colaborador';
            setRealRole(userRole);
            setEffectiveRole(userRole);
          }

          if (progressResponse.data && progressResponse.data.length > 0) {
            const courseIds = progressResponse.data.map(log => log.course_id);
            setUserProgress({ completedCourses: courseIds });
          }

        } catch (error) {
          console.error("Erro carregando dados do Supabase:", error);
        } finally {
          setIsFetchingData(false);
        }
      } else {
        setDepartment('');
        setRealRole(null);
        setEffectiveRole(null);
        setUserProgress({ completedCourses: [] });
      }
    }

    fetchUserData();
  }, [isSignedIn, user]);

  const handleOnboardingComplete = (selectedDept) => {
    setDepartment(selectedDept);
  };

  const handleStartCourse = (courseId) => {
    setActiveCourseId(courseId);
    setCurrentView('training');
  };

  const [activeMaterialId, setActiveMaterialId] = useState(null);

  // Abrir visualizador de material (Canva embed)
  const handleViewMaterial = (materialId) => {
    setActiveMaterialId(materialId);
    setCurrentView('material-viewer');
  };

  const handleCompleteTraining = (resultData) => {
    setRecentResult({ ...resultData, courseId: activeCourseId });

    const passPercentage = Math.round((resultData.score / resultData.totalQuestions) * 100) || 0;

    if (passPercentage >= 90) {
      setUserProgress(prev => {
        const newProgress = {
          ...prev,
          completedCourses: prev.completedCourses.includes(activeCourseId)
            ? prev.completedCourses
            : [...prev.completedCourses, activeCourseId]
        };
        return newProgress;
      });
    }

    setCurrentView('result');
  };

  const handleBackToHome = () => {
    setActiveCourseId(null);
    setRecentResult(null);
    setCurrentView('home');
  };

  const handleRetryCourse = () => {
    setRecentResult(null);
    setCurrentView('training');
  };

  const handleAdminViewChange = (view, data = {}) => {
    if (view === 'course-builder') {
      setAdminEditCourseId(data.courseId);
    }
    setCurrentView(view);
  };

  // Tracking modules and materials progress locally for prototype
  const [completedMaterials, setCompletedMaterials] = useState(() => {
    const saved = localStorage.getItem('completedMaterials');
    return saved ? JSON.parse(saved) : [];
  });
  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem('completedModules');
    return saved ? JSON.parse(saved) : [];
  });

  const handleMaterialComplete = (materialId, moduleId, isLastInModule) => {
    if (!completedMaterials.includes(materialId)) {
      const newMats = [...completedMaterials, materialId];
      setCompletedMaterials(newMats);
      localStorage.setItem('completedMaterials', JSON.stringify(newMats));
    }
    if (isLastInModule && !completedModules.includes(moduleId)) {
      const newMods = [...completedModules, moduleId];
      setCompletedModules(newMods);
      localStorage.setItem('completedModules', JSON.stringify(newMods));
    }
  };

  // Drawer toggle
  const handleMenuToggle = () => {
    setDrawerOpen(prev => !prev);
  };

  // Navegação pelo drawer
  const handleDrawerNavigate = (view) => {
    setCurrentView(view);
  };

  // Loading screen
  if (!isLoaded) {
    return <div className="loading-screen">Carregando TEC-B2 Academy...</div>;
  }

  // 1. Não autenticado → Landing Page
  if (!isSignedIn) {
    return (
      <div className="app-container-centered">
        <Welcome />
      </div>
    );
  }

  // 1.5 Verificando dados no banco
  if (isFetchingData) {
    return (
      <div className="loading-screen">
        Sincronizando perfil corporativo...
      </div>
    );
  }

  // 2. Autenticado sem departamento → Onboarding
  if (!department) {
    return (
      <div className="app-container-centered">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // 3. Autenticado e onboarded → Layout Hotmart
  const userData = {
    name: user.fullName || user.firstName,
    department: department,
    role: effectiveRole,
    email: user.primaryEmailAddress?.emailAddress
  };

  // Verificar se está em modo imersivo (builder ou material viewer)
  const isBuilderMode = currentView === 'course-builder';
  const isImmersiveMode = isBuilderMode || currentView === 'material-viewer';

  return (
    <div className={`app-layout-hotmart ${isImmersiveMode ? 'builder-mode' : ''}`}>
      {/* Drawer lateral (abre pelo hamburger) */}
      {!isImmersiveMode && (
        <SideDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          role={effectiveRole}
          onNavigate={handleDrawerNavigate}
          currentView={currentView}
        />
      )}

      {/* Topbar visível em todas as views exceto builder/viewer */}
      {!isImmersiveMode && (
        <Topbar 
          onMenuToggle={handleMenuToggle} 
          realRole={realRole}
          effectiveRole={effectiveRole}
          onRoleChange={setEffectiveRole}
        />
      )}

      <main className={`app-main ${isImmersiveMode ? 'full-bleed' : ''}`}>
        {/* Home — MemberArea estilo Hotmart */}
        {currentView === 'home' && (
          <MemberArea
            user={userData}
            progress={userProgress}
            onStartCourse={handleStartCourse}
            onViewMaterial={handleViewMaterial}
            completedModules={completedModules}
            role={effectiveRole}
          />
        )}

        {/* Campanhas — Feed de postagens (Comunidades) */}
        {currentView === 'campaigns' && effectiveRole === 'admin' && (
          <Campaigns user={userData} />
        )}

        {/* Auditorias — Gestão e IA (admin only) */}
        {currentView === 'audits' && effectiveRole === 'admin' && (
          <Audits user={userData} />
        )}

        {/* Material Viewer — embed Canva com sidebar */}
        {currentView === 'material-viewer' && (
          <div className="viewer-fullscreen-wrapper">
            <Topbar 
              onMenuToggle={handleMenuToggle} 
              realRole={realRole}
              effectiveRole={effectiveRole}
              onRoleChange={setEffectiveRole}
            />
            <MaterialViewer
              materialId={activeMaterialId}
              onBack={handleBackToHome}
              completedMaterials={completedMaterials}
              onComplete={handleMaterialComplete}
              completedModules={completedModules}
              role={effectiveRole}
            />
          </div>
        )}

        {/* Treinamento em andamento */}
        {currentView === 'training' && activeCourseId && (
          <div className="training-container">
            <Training
              courseId={activeCourseId}
              onComplete={handleCompleteTraining}
              onAbort={handleBackToHome}
            />
          </div>
        )}

        {/* Resultado do treinamento */}
        {currentView === 'result' && recentResult && (
          <div className="training-container">
            <Result
              user={userData}
              courseId={recentResult.courseId}
              score={recentResult.score}
              totalQuestions={recentResult.totalQuestions}
              allAnswers={recentResult.allAnswers}
              onToHome={handleBackToHome}
              onRetry={handleRetryCourse}
            />
          </div>
        )}

        {/* Admin Settings — Painel estilo Hotmart (admin only) */}
        {currentView === 'admin-settings' && effectiveRole === 'admin' && (
          <AdminSettings
            onViewChange={handleAdminViewChange}
            onBack={handleBackToHome}
          />
        )}

        {/* Course Builder — fullscreen */}
        {currentView === 'course-builder' && (
          <CourseBuilder
            courseId={adminEditCourseId}
            onViewChange={handleAdminViewChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
