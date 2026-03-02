import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { courseService } from '../services/courseService';
import Button from '../components/Button';
import './AdminDashboard.css';

const AdminDashboard = ({ onViewChange }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setCourses(data || []);
            } catch (err) {
                console.error("Erro carregando cursos para admin:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllCourses();
    }, []);

    const handleCreateCourse = () => {
        onViewChange('course-builder', { courseId: null });
    };

    const handleEditCourse = (id) => {
        onViewChange('course-builder', { courseId: id });
    };

    const handleDeleteCourse = async (id, title) => {
        if (window.confirm(`Tem absoluta certeza que deseja EXCLUIR o curso "${title}"?\nEssa ação não pode ser desfeita.`)) {
            try {
                await courseService.deleteCourse(id);
                setCourses(courses.filter(c => c.id !== id));
            } catch (err) {
                console.error("Erro ao deletar curso:", err);
                alert("Erro ao excluir o curso. Verifique o console.");
            }
        }
    };

    if (isLoading) return <div className="loading-screen">Carregando painel de administração...</div>;

    return (
        <div className="admin-dashboard fade-in">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Painel de Cursos</h1>
                    <p className="admin-subtitle">Gerencie, crie e publique trinamentos na TEC-B2 Academy.</p>
                </div>
                <Button variant="primary" onClick={handleCreateCourse}>+ Novo Curso</Button>
            </div>

            <div className="admin-course-list glass-panel">
                {courses.length === 0 ? (
                    <div className="empty-state">Nenhum curso cadastrado ainda.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Curso</th>
                                <th>Departamentos</th>
                                <th>Módulos</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="course-cell-title">
                                            <span className="course-table-icon">{course.icon}</span>
                                            {course.title}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tags">
                                            {course.departments?.map(d => <span key={d} className="tag-dept">{d}</span>)}
                                        </div>
                                    </td>
                                    <td>{course.modules?.length || 0} módulos</td>
                                    <td>
                                        <span className={`status-badge ${course.status === 'Published' ? 'status-published' : 'status-draft'}`}>
                                            {course.status === 'Published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="secondary" onClick={() => handleEditCourse(course.id)} className="edit-btn">Editar</Button>
                                        <button className="del-btn" style={{ marginLeft: '10px', padding: '0.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteCourse(course.id, course.title)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
