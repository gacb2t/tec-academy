import { SignIn, SignUp } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useState, useEffect } from 'react';
import './Welcome.css';

const Welcome = () => {
    const [isSignUp, setIsSignUp] = useState(
        window.location.hash.includes('sign-up') || window.location.hash.includes('verify-email-address')
    );

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.includes('sign-up') || hash.includes('verify-email-address')) {
                setIsSignUp(true);
            } else if (hash.includes('sign-in')) {
                setIsSignUp(false);
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const clerkAppearance = {
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
            formFieldInput: 'clerk-input',
            formFieldOptional: 'clerk-form-optional'
        }
    };

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
                    {isSignUp ? (
                        <SignUp 
                            routing="hash" 
                            signInUrl="/#sign-in"
                            forceRedirectUrl="/" 
                            appearance={clerkAppearance}
                        />
                    ) : (
                        <SignIn 
                            routing="hash" 
                            signUpUrl="/#sign-up"
                            forceRedirectUrl="/" 
                            appearance={clerkAppearance}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Welcome;
