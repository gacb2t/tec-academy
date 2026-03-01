import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import Button from '../components/Button';
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

            <div className="welcome-login-box">
                <SignUpButton mode="modal" forceRedirectUrl="/">
                    <Button variant="primary" fullWidth className="microsoft-btn">
                        Fazer Cadastro / Entrar
                    </Button>
                </SignUpButton>
                <div style={{ marginTop: '1rem' }}>
                    <SignInButton mode="modal" forceRedirectUrl="/">
                        <Button variant="secondary" fullWidth className="microsoft-btn">
                            Já tenho conta
                        </Button>
                    </SignInButton>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
