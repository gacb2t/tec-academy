import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { courseService } from '../services/courseService';
import Button from '../components/Button';
import { coursesData } from '../data/coursesData';
import { ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ onViewChange }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const { data, error } = await supabase.from('courses').select('*').order('order_index', { ascending: true });
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

    const handleMoveUp = async (index) => {
        if (index === 0) return;
        const items = Array.from(courses);
        const temp = items[index];
        items[index] = items[index - 1];
        items[index - 1] = temp;

        setCourses(items);
        saveOrder(items);
    };

    const handleMoveDown = async (index) => {
        if (index === courses.length - 1) return;
        const items = Array.from(courses);
        const temp = items[index];
        items[index] = items[index + 1];
        items[index + 1] = temp;

        setCourses(items);
        saveOrder(items);
    };

    const saveOrder = async (items) => {
        const orderedPayload = items.map((course, i) => ({
            id: course.id,
            order_index: i
        }));

        try {
            await courseService.updateCourseOrder(orderedPayload);
        } catch (error) {
            console.error("Failed to update course order on server:", error);
            alert("Erro ao salvar a nova ordem no servidor.");
        }
    };

    if (isLoading) return <div className="loading-screen">Carregando painel de administração...</div>;

    const handleMigrateLegacyData = async () => {
        if (!window.confirm("Isso irá importar os 3 cursos da main para o banco de dados. Tem certeza?")) return;

        try {
            for (const legacyCourse of coursesData) {
                const newSteps = legacyCourse.modules.map((mod, index) => {
                    return {
                        id: `step_${Date.now()}_${index}`,
                        title: mod.title || `Página ${index + 1}`,
                        blocks: [{
                            ...mod,
                            _id: `blk_${Date.now()}_${index}`,
                        }]
                    };
                });

                const coursePayload = {
                    title: legacyCourse.title,
                    description: legacyCourse.description,
                    duration: legacyCourse.duration,
                    icon: legacyCourse.icon,
                    departments: legacyCourse.departments || ['Todos'],
                    status: 'Published',
                    modules: newSteps
                };

                await courseService.saveCourse(coursePayload);
            }
            alert("Migração concluída com sucesso! Recarregue a página.");
        } catch (error) {
            console.error("Erro na migração:", error);
            alert("Erro na migração. Verifique o console.");
        }
    };

    return (
        <div className="admin-dashboard fade-in">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Painel de Cursos</h1>
                    <p className="admin-subtitle">Gerencie, crie e publique treinamentos na TEC-B2 Academy.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="primary" onClick={handleCreateCourse}>+ Novo Curso</Button>
                </div>
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
                            {courses.map((course, index) => (
                                <tr key={course.id}>
                                    <td>
                                        <div className="course-cell-title">
                                            <div className="order-controls">
                                                <button
                                                    className="order-btn"
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                    title="Mover para cima"
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    className="order-btn"
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === courses.length - 1}
                                                    title="Mover para baixo"
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>
                                            <span className="course-table-icon">{course.icon}</span>
                                            <span className="course-name-text" title={course.title}>{course.title}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tags" title={course.departments?.join(', ')}>
                                            {course.departments?.slice(0, 2).map(d => <span key={d} className="tag-dept">{d}</span>)}
                                            {course.departments?.length > 2 && (
                                                <span className="tag-dept tag-more">+{course.departments.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{course.modules?.length || 0} módulos</td>
                                    <td>
                                        <span className={`status-badge ${course.status === 'Published' ? 'status-published' : 'status-draft'}`}>
                                            {course.status === 'Published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <button className="icon-btn-edit" onClick={() => handleEditCourse(course.id)} title="Editar curso">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="icon-btn-delete" onClick={() => handleDeleteCourse(course.id, course.title)} title="Excluir curso">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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
