import { SignIn } from '@clerk/clerk-react';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome-view fade-in">
            <div className="welcome-header">
                <h1 className="welcome-title">TEC-B2 Academy</h1>
                <p className="welcome-subtitle">
                    Sua plataforma corporativa de excelência e desenvolvimento contínuo.
                    Faça login ou crie sua conta com seu e-mail corporativo.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '1rem' }}>
                <SignIn routing="hash" forceRedirectUrl="/" />
            </div>
        </div>
    );
};

export default Welcome;
