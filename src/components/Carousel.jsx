import { useState } from 'react';
import Button from './Button';
import './Carousel.css';

const Carousel = ({ slides, onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    return (
        <div className="carousel-container">
            <div className="carousel-progress">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`carousel-dot ${idx === currentSlide ? 'active' : ''} ${idx < currentSlide ? 'completed' : ''}`}
                    />
                ))}
            </div>

            <div className="carousel-slide slide-enter" key={currentSlide}>
                {slides[currentSlide].image && (
                    <div className="carousel-image-wrapper">
                        <img src={slides[currentSlide].image} alt="Slide Visual" className="carousel-image" />
                    </div>
                )}

                <h3 className="carousel-title">{slides[currentSlide].title}</h3>

                <div className="carousel-text">
                    <p dangerouslySetInnerHTML={{ __html: slides[currentSlide].text }} />
                </div>
            </div>

            <div className="carousel-controls">
                <button
                    className="carousel-nav-btn prev"
                    onClick={handlePrev}
                    disabled={currentSlide === 0}
                >
                    ← Anterior
                </button>

                <Button onClick={handleNext} variant="primary">
                    {currentSlide < slides.length - 1 ? 'Próximo →' : 'Concluir Leitura ➡️'}
                </Button>
            </div>
        </div>
    );
};

export default Carousel;
