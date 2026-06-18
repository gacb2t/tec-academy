import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-view fade-in">
            <div className="welcome-background-glow"></div>
            
            <div className="welcome-content">
                <div className="welcome-header">
                    <div className="logo-container">
                        <div className="logo-icon"></div>
                        <h1 className="welcome-title">TEC-B2 Academy</h1>
                    </div>
                    <p className="welcome-subtitle">
                        Sua plataforma corporativa de excelência e desenvolvimento contínuo.
                        Faça login ou crie sua conta com seu e-mail corporativo.
                    </p>
                </div>

                <div className="clerk-container">
                    <SignIn 
                        routing="hash" 
                        forceRedirectUrl="/" 
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorPrimary: '#6C63FF',
                                colorBackground: 'transparent',
                                colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                                colorInputText: '#ffffff',
                                borderRadius: '12px',
                            },
                            elements: {
                                card: 'glass-clerk-card',
                                headerTitle: 'clerk-header-title',
                                headerSubtitle: 'clerk-header-subtitle',
                                socialButtonsBlockButton: 'clerk-social-btn',
                                formButtonPrimary: 'clerk-primary-btn',
                                footerActionLink: 'clerk-footer-link',
                                formFieldInput: 'clerk-input'
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Welcome;
