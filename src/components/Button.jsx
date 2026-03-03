import './Button.css';

const Button = ({ children, onClick, variant = 'primary', disabled = false, fullWidth = false, className = '', style = {} }) => {
    const baseClass = `gamified-btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`;

    return (
        <button
            className={baseClass}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            <span className="btn-content">{children}</span>
            <div className="btn-glow"></div>
        </button>
    );
};

export default Button;
