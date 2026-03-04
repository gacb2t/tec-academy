import './TextImagePanel.css';

/**
 * TextImagePanel
 * Renders a section with formatted HTML text alongside an image icon.
 * Props:
 *   content      — HTML string (title + paragraphs/lists)
 *   imageSrc     — path to image
 *   imagePosition — 'left' | 'right' (default: 'right')
 *   imageSize    — 'sm' (160px) | 'md' (220px) | 'lg' (280px) (default: 'md')
 */
const TextImagePanel = ({ content, imageSrc, imagePosition = 'right', imageSize = 'md', imageAlt = '' }) => {
    const sizeMap = { sm: 160, md: 220, lg: 280 };
    const px = sizeMap[imageSize] || 220;

    const imageEl = imageSrc ? (
        <div className="tip-image-wrapper" style={{ flex: `0 0 ${px}px`, maxWidth: `${px}px` }}>
            <img
                src={imageSrc}
                alt={imageAlt}
                className="tip-image"
                style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'cover' }}
            />
        </div>
    ) : null;

    return (
        <div className={`text-image-panel tip-${imagePosition}`}>
            {imagePosition === 'left' && imageEl}
            <div
                className="tip-text"
                dangerouslySetInnerHTML={{ __html: content }}
            />
            {imagePosition === 'right' && imageEl}
        </div>
    );
};

export default TextImagePanel;
