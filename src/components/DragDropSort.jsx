import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Button from './Button';
import './DragDropSort.css';

const DragDropSort = ({ instruction, steps, onComplete }) => {
    const [items, setItems] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    // Initialize items with a shuffled version of the correct steps
    useEffect(() => {
        // Deep copy to avoid mutating original props, and add original index
        const initialItems = steps.map((step, index) => ({
            id: `step-${index}`,
            content: step,
            correctIndex: index
        }));

        // Shuffle logic (Fisher-Yates)
        const shuffled = [...initialItems];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setItems(shuffled);
    }, [steps]);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Reorder items array
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        setItems(reorderedItems);
        setHasChecked(false); // Reset check status upon new movement
    };

    const handleCheckOrder = () => {
        // Validation: Verify if the sorted index matches the original correctIndex
        const isOrderCorrect = items.every((item, index) => item.correctIndex === index);

        setIsCorrect(isOrderCorrect);
        setHasChecked(true);

        if (isOrderCorrect) {
            // Wait a sec to show success state before proceeding completely
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    };

    return (
        <div className="drag-drop-container">
            <h3 className="drag-instruction">{instruction || "Arraste e solte as caixas para ordená-las corretamente."}</h3>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list">
                    {(provided) => (
                        <div
                            className="droppable-area"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''} ${hasChecked && item.correctIndex === index ? 'correct-pos' : ''} ${hasChecked && item.correctIndex !== index && !isCorrect ? 'wrong-pos' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={provided.draggableProps.style}
                                        >
                                            <span className="drag-handle">☰</span>
                                            <span className="item-content">{item.content}</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {hasChecked && !isCorrect && (
                <div className="feedback-message error">
                    A ordem ainda não está correta. Tente novamente!
                </div>
            )}

            {hasChecked && isCorrect && (
                <div className="feedback-message success">
                    Excelente! Ordem correta.
                </div>
            )}

            <div className="action-area">
                <Button
                    variant="primary"
                    onClick={handleCheckOrder}
                    disabled={isCorrect} // Disable button once correct
                >
                    {isCorrect ? 'Validado ✔️' : 'Verificar Ordem'}
                </Button>
            </div>
        </div>
    );
};

export default DragDropSort;
