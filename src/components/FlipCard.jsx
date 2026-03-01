import { useState } from 'react';
import './FlipCard.css';

const FlipCard = ({ cards }) => {
    const [flippedIndex, setFlippedIndex] = useState(null);

    const handleFlip = (index) => {
        setFlippedIndex(flippedIndex === index ? null : index);
    };

    return (
        <div className="flipcards-container">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`flip-card ${flippedIndex === index ? 'flipped' : ''}`}
                    onClick={() => handleFlip(index)}
                >
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <h3>{card.front}</h3>
                            <p className="click-hint">Clique para revelar</p>
                        </div>
                        <div className="flip-card-back">
                            <p>{card.back}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FlipCard;
