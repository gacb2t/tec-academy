import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from './services/supabaseClient';
import Welcome from './views/Welcome';
import Onboarding from './views/Onboarding';
import HomeDashboard from './views/HomeDashboard';
import Training from './views/Training';
import Result from './views/Result';
import AdminDashboard from './views/AdminDashboard';
import CourseBuilder from './views/CourseBuilder';
import RHDashboard from './views/RHDashboard';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentView, setCurrentView] = useState('home');

  // App Global State
  const [department, setDepartment] = useState('');
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [adminEditCourseId, setAdminEditCourseId] = useState(null); // Added for the Admin Builder
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Results & Tracking
  const [recentResult, setRecentResult] = useState(null);
  const [userProgress, setUserProgress] = useState({
    completedCourses: [],
    inProgressCourses: []
  });

  // Load user specific data from Supabase on mount or authentication
  useEffect(() => {
    async function fetchUserData() {
      if (isSignedIn && user) {
        setIsFetchingData(true);
        try {
          // 1. Fetch Department from Profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('department')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            setDepartment(profile.department);
          }

          // 2. Fetch Completed Courses
          // We look for courses where the user achieved 70% or more
          const { data: progressLogs } = await supabase
            .from('course_progress')
            .select('course_id')
            .eq('user_id', user.id)
            .gte('percentage', 70);

          if (progressLogs && progressLogs.length > 0) {
            const courseIds = progressLogs.map(log => log.course_id);
            setUserProgress(prev => ({ ...prev, completedCourses: courseIds }));
          }

          // 3. Fetch In-Progress Courses (started but not completed)
          const { data: inProgressLogs } = await supabase
            .from('course_progress')
            .select('course_id')
            .eq('user_id', user.id)
            .gt('current_step', 0)
            .lt('percentage', 70);

          if (inProgressLogs && inProgressLogs.length > 0) {
            const inProgressIds = inProgressLogs.map(log => log.course_id);
            setUserProgress(prev => ({ ...prev, inProgressCourses: inProgressIds }));
          }

        } catch (error) {
          console.error("Erro carregando dados do Supabase:", error);
        } finally {
          setIsFetchingData(false);
        }
      } else {
        // Reset state if logged out
        setDepartment('');
        setUserProgress({ completedCourses: [], inProgressCourses: [] });
      }
    }

    fetchUserData();
  }, [isSignedIn, user]);

  const handleOnboardingComplete = (selectedDept) => {
    // Already saved to DB inside Onboarding component, just update local React state
    setDepartment(selectedDept);
  };

  const handleStartCourse = (courseId) => {
    setActiveCourseId(courseId);
    setCurrentView('training');
  };

  const handleCompleteTraining = (resultData) => {
    setRecentResult({ ...resultData, courseId: activeCourseId });

    const passPercentage = Math.round((resultData.score / resultData.totalQuestions) * 100) || 0;

    // Award Badge locally for instant feedback (DB is handled in Result.jsx)
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

  const handleRestartCourse = async (courseId) => {
    // Delete progress from DB so Training starts from step 0
    await supabase
      .from('course_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    // Remove from local progress state
    setUserProgress(prev => ({
      completedCourses: prev.completedCourses.filter(id => id !== courseId),
      inProgressCourses: (prev.inProgressCourses || []).filter(id => id !== courseId)
    }));

    setActiveCourseId(courseId);
    setCurrentView('training');
  };

  const handleAdminViewChange = (view, data = {}) => {
    if (view === 'course-builder') {
      setAdminEditCourseId(data.courseId);
    }
    setCurrentView(view);
  };

  if (!isLoaded) {
    return <div className="loading-screen">Carregando TEC-B2 Academy...</div>;
  }

  // 1. Not signed in? Show Landing Page (Welcome)
  if (!isSignedIn) {
    return (
      <div className="app-container-centered">
        <Welcome />
      </div>
    );
  }

  // 1.5 Still checking the database for department?
  if (isFetchingData) {
    return (
      <div className="loading-screen">
        Sincronizando perfil corporativo...
      </div>
    );
  }

  // 2. Signed in, but no department selected? Show Onboarding
  if (!department) {
    return (
      <div className="app-container-centered">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // 3. Authenticated and Onboarded: Show the Corporate Dashboard Layout
  const userData = {
    name: user.fullName || user.firstName,
    department: department,
    email: user.primaryEmailAddress?.emailAddress
  };

  return (
    <div className={`app-layout ${currentView === 'course-builder' ? 'builder-mode' : ''}`}>
      {currentView !== 'course-builder' && (
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          department={department}
          onDepartmentChange={setDepartment}
        />
      )}

      <main className={`app-main-content ${currentView === 'course-builder' ? 'full-bleed' : ''}`}>
        <div className={`content-wrapper ${currentView === 'course-builder' || currentView === 'rh' ? 'full-bleed' : 'glass-panel'}`}>
          {currentView === 'home' && (
            <HomeDashboard user={userData} progress={userProgress} onStartCourse={handleStartCourse} onRestartCourse={handleRestartCourse} />
          )}

          {currentView === 'training' && activeCourseId && (
            <Training
              courseId={activeCourseId}
              onComplete={handleCompleteTraining}
              onAbort={handleBackToHome}
            />
          )}

          {currentView === 'result' && recentResult && (
            <Result
              user={userData}
              courseId={recentResult.courseId}
              score={recentResult.score}
              totalQuestions={recentResult.totalQuestions}
              allAnswers={recentResult.allAnswers}
              onToHome={handleBackToHome}
              onRetry={handleRetryCourse}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard
              onViewChange={handleAdminViewChange}
            />
          )}

          {currentView === 'rh' && (
            <RHDashboard />
          )}

          {currentView === 'course-builder' && (
            <CourseBuilder
              courseId={adminEditCourseId}
              onViewChange={handleAdminViewChange}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
