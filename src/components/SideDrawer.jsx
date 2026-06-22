import { useClerk } from "@clerk/clerk-react";
import './SideDrawer.css';

/**
 * SideDrawer — Menu lateral que abre pelo hamburger na Topbar
 * Exibe navegação principal + botão de Configurações (admin only)
 */
const SideDrawer = ({ isOpen, onClose, role, onNavigate, currentView }) => {
    const { signOut } = useClerk();

    const isAdmin = role === 'admin';

    const handleNav = (view) => {
        onNavigate(view);
        onClose();
    };

    return (
        <>
            {/* Overlay escuro atrás do drawer */}
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                id="drawer-overlay"
            />

            {/* Drawer lateral */}
            <aside className={`side-drawer ${isOpen ? 'open' : ''}`} id="side-drawer">
                {/* Header do drawer */}
                <div className="drawer-header">
                    <img src="/logo-tec.svg" alt="Tec-B2" className="drawer-logo-img" style={{ height: '28px', width: 'auto' }} />
                    <button className="drawer-close-btn" onClick={onClose} aria-label="Fechar menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Navegação principal */}
                <nav className="drawer-nav">
                    <button
                        className={`drawer-nav-item ${currentView === 'home' ? 'active' : ''}`}
                        onClick={() => handleNav('home')}
                        id="drawer-nav-home"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>Início</span>
                    </button>

                    {isAdmin && (
                        <>
                            <button
                                className={`drawer-nav-item ${currentView === 'campaigns' ? 'active' : ''}`}
                                onClick={() => handleNav('campaigns')}
                                id="drawer-nav-campaigns"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                                <span>Campanhas</span>
                            </button>

                            <button
                                className={`drawer-nav-item ${currentView === 'marketplace' ? 'active' : ''}`}
                                onClick={() => handleNav('marketplace')}
                                id="drawer-nav-marketplace"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 12 20 22 4 22 4 12" />
                                    <rect x="2" y="7" width="20" height="5" />
                                    <line x1="12" y1="22" x2="12" y2="7" />
                                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                                </svg>
                                <span>Marketplace</span>
                            </button>

                            <button
                                className={`drawer-nav-item ${currentView === 'audits' ? 'active' : ''}`}
                                onClick={() => handleNav('audits')}
                                id="drawer-nav-audits"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Auditorias</span>
                            </button>

                            <button
                                className={`drawer-nav-item ${currentView === 'candidates' ? 'active' : ''}`}
                                onClick={() => handleNav('candidates')}
                                id="drawer-nav-candidates"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Candidatos</span>
                            </button>
                        </>
                    )}

                    {/* Separador admin */}
                    {isAdmin && (
                        <>
                            <div className="drawer-separator">
                                <span>Administração</span>
                            </div>

                            <button
                                className={`drawer-nav-item ${currentView === 'admin-settings' ? 'active' : ''}`}
                                onClick={() => handleNav('admin-settings')}
                                id="drawer-nav-settings"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Configurações</span>
                            </button>
                        </>
                    )}
                </nav>

                {/* Footer do drawer */}
                <div className="drawer-footer">
                    <button
                        className="drawer-nav-item drawer-logout"
                        onClick={() => signOut()}
                        id="drawer-logout-btn"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SideDrawer;
