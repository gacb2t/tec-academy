import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import './Sidebar.css';

const DepartmentSettings = ({ currentDept, onUpdate }) => {
    const { user } = useUser();
    const [dept, setDept] = useState(currentDept);
    const [status, setStatus] = useState('idle'); // idle, saving, success, error

    const handleSave = async () => {
        setStatus('saving');
        try {
            const { error: sbError } = await supabase
                .from('user_profiles')
                .update({ department: dept })
                .eq('user_id', user.id);

            if (sbError) throw sbError;

            onUpdate(dept);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error("Erro ao atualizar setor:", err);
            setStatus('error');
        }
    };

    return (
        <div className="clerk-custom-page" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.5rem' }}>Setor Corporativo</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Mantenha seu setor atualizado para receber as trilhas de treinamento corretas da TEC-B2.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
                <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="department-select"
                >
                    <option value="" disabled>Selecione seu setor...</option>
                    <option value="Time Hunter">Time Hunter</option>
                    <option value="Time Farm">Time Farm</option>
                    <option value="Time NOQ">Time NOQ</option>
                    <option value="Suporte ao Cliente">Suporte ao Cliente</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Backoffice">Backoffice</option>
                    <option value="RH">RH</option>
                    <option value="Tecnologia">Tecnologia</option>
                </select>

                <button
                    onClick={handleSave}
                    disabled={status === 'saving'}
                    style={{
                        padding: '0.75rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    {status === 'saving' ? 'Salvando...' : 'Salvar Alteração'}
                </button>

                {status === 'success' && <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>✅ Setor atualizado!</p>}
                {status === 'error' && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>❌ Erro ao salvar.</p>}
            </div>
        </div>
    );
};


const Sidebar = ({ currentView, onViewChange, department, onDepartmentChange }) => {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <aside className="app-sidebar">
            <div className="sidebar-brand">
                <div className="logo-brand">TEC-B2</div>
                <span className="brand-subtitle">Academy</span>
            </div>

            <div className="sidebar-user">
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "custom-avatar-box"
                        }
                    }}
                >
                    <UserButton.UserProfilePage
                        label="Setor / Área"
                        url="department"
                        labelIcon={<span style={{ fontSize: '1rem', marginLeft: '2px' }}>🏢</span>}
                    >
                        <DepartmentSettings currentDept={department} onUpdate={onDepartmentChange} />
                    </UserButton.UserProfilePage>
                </UserButton>
                <div className="user-info-text">
                    <span className="user-name">{user?.firstName || 'Usuário'}</span>
                    <span className="user-email">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => onViewChange('home')}
                >
                    <span className="nav-icon">📊</span>
                    Dashboard
                </button>
                <button
                    className="nav-item"
                    onClick={() => alert("Em breve: Central de ajuda ou outros links corporativos.")}
                >
                    <span className="nav-icon">💡</span>
                    Ajuda
                </button>

                {/* Hardcoded Admin check for MVP */}
                {['gac.b2t@gmail.com', 'guilherme@tecb2.com.br', 'di.guimaraes@tecb2.com.br', 'ane.caroline@tecb2.com.br'].includes(user?.primaryEmailAddress?.emailAddress) && (

                    <>
                        <button
                            className={`nav-item ${currentView === 'rh' ? 'active' : ''}`}
                            onClick={() => onViewChange('rh')}
                            style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}
                        >
                            <span className="nav-icon">👥</span>
                            RH
                        </button>
                        <button
                            className={`nav-item ${currentView === 'admin' ? 'active' : ''}`}
                            onClick={() => onViewChange('admin')}
                        >
                            <span className="nav-icon">⚙️</span>
                            Administração
                        </button>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={() => signOut()}>
                    <span className="nav-icon">🚪</span>
                    Sair
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
