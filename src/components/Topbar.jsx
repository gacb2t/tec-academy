import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import './Topbar.css';

/**
 * Topbar — Barra de navegação superior estilo Hotmart
 * Hamburger menu (futuro drawer), logo TEC-B2, busca, notificações, avatar do usuário
 */
const Topbar = ({ onMenuToggle, realRole, effectiveRole, onRoleChange }) => {
    const { user } = useUser();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);

    // Fechar busca ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="topbar" id="topbar">
            <div className="topbar-left">
                <button
                    className="topbar-menu-btn"
                    onClick={onMenuToggle}
                    aria-label="Menu"
                    id="menu-toggle-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div className="topbar-brand" id="topbar-brand">
                    <span className="topbar-logo">Tec-B2</span>
                </div>
            </div>

            <div className="topbar-right">
                {/* View As Selector */}
                {realRole === 'admin' && (
                    <div className="topbar-view-as">
                        <select
                            value={effectiveRole || 'colaborador'}
                            onChange={(e) => onRoleChange(e.target.value)}
                            className="view-as-select"
                            id="view-as-select"
                        >
                            <option value="admin">Ver como: Administrador</option>
                            <option value="gestor">Ver como: Gestor</option>
                            <option value="colaborador">Ver como: Colaborador</option>
                        </select>
                    </div>
                )}

                {/* Busca */}
                <div className={`topbar-search-wrapper ${searchOpen ? 'open' : ''}`} ref={searchRef}>
                    <button
                        className="topbar-icon-btn"
                        onClick={() => setSearchOpen(!searchOpen)}
                        aria-label="Buscar"
                        id="search-toggle-btn"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                    {searchOpen && (
                        <div className="topbar-search-dropdown">
                            <input
                                type="text"
                                placeholder="Buscar conteúdo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="topbar-search-input"
                                id="topbar-search-input"
                            />
                        </div>
                    )}
                </div>

                {/* Notificações */}
                <button className="topbar-icon-btn" aria-label="Notificações" id="notifications-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <span className="topbar-notification-dot"></span>
                </button>

                {/* Avatar Clerk */}
                <div className="topbar-avatar" id="topbar-avatar">
                    <UserButton
                        appearance={{
                            elements: {
                                userButtonAvatarBox: "topbar-avatar-box"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
