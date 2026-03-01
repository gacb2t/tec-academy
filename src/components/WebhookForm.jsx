import { useState } from 'react';
import Button from './Button';
import './WebhookForm.css';

const WebhookForm = ({ instruction, webhookUrl, onComplete }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailPrefix, setEmailPrefix] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !emailPrefix) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        const email = `${emailPrefix.trim()}@tecb2.com.br`;

        const payload = {
            eventName: 'cadastroEmailNovoColab',
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            requestedEmail: email
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            // Proceed even if it fails CORS, just visual completion for the user
        } catch (error) {
            console.error('Webhook error:', error);
        }

        setLoading(false);
        setSubmitted(true);
        setTimeout(() => {
            onComplete(true, payload);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="webhook-form-container slide-enter" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: 'var(--success-color)' }}>Solicitação Enviada!</h3>
                <p>O seu e-mail corporativo está sendo gerado pelo nosso time tecnológico.</p>
            </div>
        );
    }

    return (
        <div className="webhook-form-container slide-enter">
            {instruction && <p className="form-instruction">{instruction}</p>}

            <form onSubmit={handleSubmit} className="webhook-form">
                <div className="form-group">
                    <label>Nome</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ex: Fernanda"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Sobrenome</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ex: Mendes"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Preferência de E-mail</label>
                    <div className="email-input-wrapper">
                        <input
                            type="text"
                            value={emailPrefix}
                            onChange={(e) => setEmailPrefix(e.target.value)}
                            placeholder="fernanda.mendes"
                            required
                            className="email-prefix"
                        />
                        <span className="email-domain">@tecb2.com.br</span>
                    </div>
                </div>

                <div className="module-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Enviando...' : 'Solicitar E-mail 🚀'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default WebhookForm;
