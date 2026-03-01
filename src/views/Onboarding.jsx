import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '../services/supabaseClient';
import Button from '../components/Button';
import './Onboarding.css';

const Onboarding = ({ onComplete }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    const email = user?.primaryEmailAddress?.emailAddress || '';
    // Bypass temporário da restrição de domínio para permitir testes com contas Microsoft pessoais
    const isTecB2 = true; // email.endsWith('@tecb2.com.br');

    useEffect(() => {
        // Domain restriction check (Currently bypassed)
        if (!isTecB2 && email) {
            setError('Acesso restrito. Apenas contas @tecb2.com.br podem acessar a academia.');
        }
    }, [email, isTecB2]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isTecB2) return;

        if (department.trim()) {
            try {
                // Insert profile into database
                const { error: sbError } = await supabase
                    .from('user_profiles')
                    .upsert({
                        user_id: user.id,
                        name: user.fullName || user.firstName,
                        email: email,
                        department: department
                    });

                if (sbError) throw sbError;
                onComplete(department);
            } catch (err) {
                console.error("Erro ao salvar perfil:", err);
                setError("Ocorreu um erro ao salvar seu setor. Tente novamente.");
            }
        }
    };

    if (error) {
        return (
            <div className="onboarding-view error-state fade-in">
                <h2>Acesso Negado 🛑</h2>
                <p>{error}</p>
                <p className="email-display">Tentativa com: <strong>{email}</strong></p>
                <Button variant="secondary" onClick={() => signOut()}>
                    Sair e tentar com outra conta
                </Button>
            </div>
        );
    }

    return (
        <div className="onboarding-view fade-in">
            <div className="onboarding-header">
                <h2>Bem-vindo, {user?.firstName}! 👋</h2>
                <p>Para personalizar seus treinamentos, precisamos saber de qual área você é.</p>
            </div>

            <form className="onboarding-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="department">Qual o seu Setor na TEC-B2?</label>
                    <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        className="gamified-input"
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
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={!department}>
                    Acessar Academy 🚀
                </Button>
            </form>
        </div>
    );
};

export default Onboarding;
