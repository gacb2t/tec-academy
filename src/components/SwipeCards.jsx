import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import './SwipeCards.css';

const SwipeCards = ({ cards, instruction, onComplete, onNextStep }) => {
    // Reverse the array so [0] is drawn last (on top)
    const [stack, setStack] = useState([...cards].reverse());
    const [results, setResults] = useState([]);
    const [attempts, setAttempts] = useState(1);

    React.useEffect(() => {
        if (results.length === cards.length) {
            handleFinish();
        }
    }, [results, cards.length]);

    const handleAnswer = (direction, isCorrect) => {
        const isRightSwipe = direction === 'right'; // Verdade
        const earnedPoint = isRightSwipe === isCorrect;

        setResults(prev => [...prev, earnedPoint]);
        setStack(prev => prev.slice(0, prev.length - 1));
    };

    const handleFinish = () => {
        const correctCount = results.filter(r => r).length;
        const passed = correctCount === cards.length;
        if (passed) {
            onComplete(true, `Acertou ${correctCount} de ${cards.length} no Swipe`, attempts);
        }
    };

    const handleRetry = () => {
        setAttempts(prev => prev + 1);
        setStack([...cards].reverse());
        setResults([]);
    };

    const handleContinue = () => {
        if (onNextStep) onNextStep();
    }

    return (
        <div className="swipecards-container slide-enter">
            {instruction && <p className="swipecards-instruction">{instruction}</p>}

            <div className="tindercards-wrapper">
                {stack.length > 0 ? (
                    <>
                        <div className="cards-stack">
                            <AnimatePresence>
                                {stack.map((card, index) => {
                                    const isTop = index === stack.length - 1;
                                    const offset = (stack.length - 1) - index;
                                    const scale = 1 - (offset * 0.05);
                                    const translateY = offset * -10;

                                    return (
                                        <motion.div
                                            key={card.text} // Use unique text or id
                                            className={`swipe-card-custom ${isTop ? 'top-card' : ''}`}
                                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                            animate={{ scale, opacity: 1, y: translateY }}
                                            exit={{ x: results[results.length] ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }}
                                            style={{ zIndex: index }}
                                            drag={isTop ? "x" : false}
                                            dragConstraints={{ left: 0, right: 0 }}
                                            onDragEnd={(e, { offset }) => {
                                                if (offset.x > 100) {
                                                    // Swiped Right -> Verdade
                                                    handleAnswer('right', card.correctIsRight);
                                                } else if (offset.x < -100) {
                                                    // Swiped Left -> Mito
                                                    handleAnswer('left', card.correctIsRight);
                                                }
                                            }}
                                            whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
                                        >
                                            <div className="swipecard-inner">
                                                <h3>{card.text}</h3>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        <div className="swipe-actions">
                            <button
                                className="swipe-btn mito-btn"
                                onClick={() => handleAnswer('left', stack[stack.length - 1].correctIsRight)}
                            >
                                👈 MITO
                            </button>
                            <button
                                className="swipe-btn verdade-btn"
                                onClick={() => handleAnswer('right', stack[stack.length - 1].correctIsRight)}
                            >
                                VERDADE 👉
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="swipecards-end">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{results.filter(r => r).length === cards.length ? '🎉' : '⚠️'}</div>
                        <h3>{results.filter(r => r).length === cards.length ? 'Você concluiu as Cartas!' : 'Atenção ao Risco!'}</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Total de Acertos: {results.filter(r => r).length} de {cards.length}</p>

                        {results.filter(r => r).length === cards.length ? (
                            <Button variant="success" onClick={handleContinue}>Continuar Etapa</Button>
                        ) : (
                            <Button variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={handleRetry}>🔁 Refazer Cartas</Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwipeCards;
