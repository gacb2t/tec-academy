import './Button.css';

const Button = ({ children, onClick, variant = 'primary', disabled = false, fullWidth = false, className = '' }) => {
    const baseClass = `gamified-btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`;

    return (
        <button
            className={baseClass}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="btn-content">{children}</span>
            <div className="btn-glow"></div>
        </button>
    );
};

export default Button;
