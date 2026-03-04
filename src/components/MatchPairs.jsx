import { useState, useEffect } from 'react';
import './MatchPairs.css';

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const MatchPairs = ({ title, instruction, pairs, onComplete, onNextStep }) => {
    const [leftItems] = useState(pairs.map((p) => p.left));
    const [rightItems, setRightItems] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [matches, setMatches] = useState({}); // { left: right }
    const [wrongPair, setWrongPair] = useState(null);
    const [completed, setCompleted] = useState(false);
    const [attempts, setAttempts] = useState(1); // at least 1 attempt

    useEffect(() => {
        setRightItems(shuffle(pairs.map((p) => p.right)));
    }, [pairs]);

    const correctMap = Object.fromEntries(pairs.map((p) => [p.left, p.right]));
    const matchedRights = Object.values(matches);

    const handleLeftClick = (item) => {
        if (Object.keys(matches).includes(item)) return;
        setSelectedLeft(item);
        setWrongPair(null);
    };

    const handleRightClick = (item) => {
        if (matchedRights.includes(item)) return;
        if (!selectedLeft) return;

        setSelectedRight(item);

        const isCorrect = correctMap[selectedLeft] === item;

        if (isCorrect) {
            const newMatches = { ...matches, [selectedLeft]: item };
            setMatches(newMatches);
            setSelectedLeft(null);
            setSelectedRight(null);

            if (Object.keys(newMatches).length === pairs.length) {
                setCompleted(true);
                onComplete && onComplete(attempts);
            }
        } else {
            setWrongPair({ left: selectedLeft, right: item });
            setAttempts(prev => prev + 1);
            setTimeout(() => {
                setWrongPair(null);
                setSelectedLeft(null);
                setSelectedRight(null);
            }, 700);
        }
    };

    const getLeftState = (item) => {
        if (matches[item]) return 'matched';
        if (wrongPair?.left === item) return 'wrong';
        if (selectedLeft === item) return 'selected';
        return '';
    };

    const getRightState = (item) => {
        if (matchedRights.includes(item)) return 'matched';
        if (wrongPair?.right === item) return 'wrong';
        if (selectedRight === item) return 'selected';
        return '';
    };

    return (
        <div className="match-pairs-container">
            <h3 className="match-pairs-title">{title}</h3>
            {instruction && <p className="match-pairs-instruction">{instruction}</p>}

            {!completed ? (
                <div className="match-pairs-board">
                    <div className="match-pairs-column left-column">
                        <span className="column-label">🎯 Propósito</span>
                        {leftItems.map((item) => (
                            <button
                                key={item}
                                className={`match-card left-card ${getLeftState(item)}`}
                                onClick={() => handleLeftClick(item)}
                                disabled={!!matches[item]}
                            >
                                {item}
                                {matches[item] && <span className="match-connector">→ {matches[item]}</span>}
                            </button>
                        ))}
                    </div>

                    <div className="match-pairs-divider">
                        <span>🔗</span>
                    </div>

                    <div className="match-pairs-column right-column">
                        <span className="column-label">🛠️ Ferramenta</span>
                        {rightItems.map((item) => (
                            <button
                                key={item}
                                className={`match-card right-card ${getRightState(item)}`}
                                onClick={() => handleRightClick(item)}
                                disabled={matchedRights.includes(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="match-pairs-success">
                    <div className="success-icon">🎉</div>
                    <h4>Perfeito! Você combinou todas as ferramentas!</h4>
                    <ul className="match-summary">
                        {pairs.map((p) => (
                            <li key={p.left}>
                                <span className="summary-left">{p.left}</span>
                                <span className="summary-arrow">→</span>
                                <span className="summary-right">{p.right}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="match-pairs-next-btn" onClick={onNextStep}>
                        Próxima Etapa →
                    </button>
                </div>
            )}

            {!completed && (
                <p className="match-pairs-hint">
                    {selectedLeft
                        ? `"${selectedLeft}" selecionado — escolha a ferramenta correspondente →`
                        : 'Clique em um propósito para começar'}
                </p>
            )}
        </div>
    );
};

export default MatchPairs;
