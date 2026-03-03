import { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import './HomeDashboard.css';

const HomeDashboard = ({ user, progress, onStartCourse, onRestartCourse }) => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await courseService.getAvailableCourses(user.department);
                setAvailableCourses(courses);
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [user.department]);

    // Filter completed courses to ensure we only count active, existing courses
    const validCompletedCourses = progress.completedCourses.filter(courseId =>
        availableCourses.some(c => c.id === courseId)
    );
    const completedCount = validCompletedCourses.length;

    // Calculate general progress percentage based on courses available relative to this user.
    const overallPercentage = availableCourses.length > 0
        ? Math.round((completedCount / availableCourses.length) * 100)
        : 0;

    if (isLoading) {
        return <div className="loading-screen" style={{ height: '100%', minHeight: '300px' }}>Carregando treinamentos...</div>;
    }

    return (
        <div className="home-dashboard fade-in">
            <div className="dashboard-hero">
                <div className="hero-text">
                    <h1>Olá, {user.name.split(' ')[0]} 👋</h1>
                    <p>Pronto para subir de nível? Continue sua jornada de aprendizado na TEC-B2.</p>
                </div>

                <div className="hero-stats">
                    <div className="stat-box">
                        <span className="stat-value">{completedCount} / {availableCourses.length}</span>
                        <span className="stat-label">Cursos Concluídos</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">{overallPercentage}%</span>
                        <span className="stat-label">Taxa Acadêmica</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">Meus Treinamentos</h2>
                <div className="courses-list">
                    {/* Render pending courses first */}
                    {availableCourses
                        .filter(course => !progress.completedCourses.includes(course.id))
                        .map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isCompleted={false}
                                isInProgress={progress.inProgressCourses?.includes(course.id)}
                                onStart={onStartCourse}
                                onRestart={onRestartCourse}
                            />
                        ))}
                    {/* Render completed courses last */}
                    {availableCourses
                        .filter(course => progress.completedCourses.includes(course.id))
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isCompleted={true}
                                onStart={onStartCourse}
                                onRestart={onRestartCourse}
                            />
                        ))}
                </div>
            </div>

            {/* Certificados / Achievements Area for Gamification */}
            <div className="dashboard-section achievements-section">
                <h2 className="section-title">Minhas Conquistas 🏆</h2>
                {completedCount === 0 ? (
                    <p className="no-achievements">Você ainda não tem certificados. Complete um treinamento para ganhar seu primeiro selo!</p>
                ) : (
                    <div className="badges-grid">
                        {availableCourses
                            .filter(c => progress.completedCourses.includes(c.id))
                            .map(c => (
                                <div key={c.id} className="badge-item">
                                    <span className="badge-icon">{c.icon}</span>
                                    <span className="badge-name">{c.title}</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeDashboard;
