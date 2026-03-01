import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import './AvatarBalloons.css';

const AvatarBalloons = ({ balloons, instruction, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 3 stages of avatar
    const avatarStages = [
        '/avatars/baby_avatar_stage_1.png',
        '/avatars/baby_avatar_stage_2.png',
        '/avatars/baby_avatar_stage_3.png'
    ];

    // Determine the current image based on progress percentage
    const progressSegment = Math.floor((currentIndex / balloons.length) * avatarStages.length);
    const safeSegment = Math.min(progressSegment, avatarStages.length - 1);
    const currentAvatarUrl = avatarStages[safeSegment];

    const currentBalloon = balloons[currentIndex];

    const handleNext = () => {
        if (currentIndex < balloons.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="avatar-balloons-container slide-enter">
            {instruction && <p className="avatar-instruction">{instruction}</p>}

            <div className="avatar-dialog-scene">
                {/* Left side: Avatar reflecting maturity */}
                <div className="avatar-column">
                    <motion.div
                        className="avatar-center"
                        key={currentAvatarUrl} // force re-animation when image changes
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <img src={currentAvatarUrl} alt="Mentor Avatar" />
                    </motion.div>
                    <div className="avatar-stage-label">
                        Mentor Evolução Nível {safeSegment + 1}
                    </div>
                </div>

                {/* Right side: Speech Bubble */}
                <div className="speech-column">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="speech-bubble"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="speech-header">
                                <span className="speech-icon">{currentBalloon.icon}</span>
                                <h3>{currentBalloon.title}</h3>
                            </div>
                            <div className="speech-content">
                                <p>{currentBalloon.content}</p>
                            </div>
                            <div className="speech-footer">
                                <span className="step-counter">Princípio {currentIndex + 1} de {balloons.length}</span>
                                <Button onClick={handleNext} variant="primary">
                                    {currentIndex === balloons.length - 1 ? 'Concluir Mentoria ✔️' : 'Próximo ➡️'}
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AvatarBalloons;
