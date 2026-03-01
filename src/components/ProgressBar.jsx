import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    return (
        <div className="progress-container">
            <div className="progress-infos">
                <span className="progress-label">Progresso do Treinamento</span>
                <span className="progress-count">{current} / {total}</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="progress-glow"></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
