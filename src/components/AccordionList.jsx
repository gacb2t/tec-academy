import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import './AccordionList.css';

const AccordionList = ({ items, instruction, onComplete }) => {
    const [openIndex, setOpenIndex] = useState(0); // auto-open the first one
    const [readItems, setReadItems] = useState([0]); // track what is currently unlocked
    const [checkedItems, setCheckedItems] = useState([]); // track what has been marked as 'lido'

    useEffect(() => {
        // Just for re-renders and debugging if needed
    }, [checkedItems]);

    const isUnlocked = (idx) => readItems.includes(idx);
    const isChecked = (idx) => checkedItems.includes(idx);

    const toggleItem = (index) => {
        if (!isUnlocked(index)) return; // Locked
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCheckItem = (e, index) => {
        e.stopPropagation();

        if (!checkedItems.includes(index)) {
            setCheckedItems(prev => [...prev, index]);
        }

        // Unlock and auto-open the next one if it exists
        if (index + 1 < items.length) {
            if (!readItems.includes(index + 1)) {
                setReadItems(prev => [...prev, index + 1]);
            }
            setOpenIndex(index + 1);
        } else {
            setOpenIndex(null); // Just close the last one
        }
    };

    const allChecked = checkedItems.length === items.length;

    return (
        <div className="accordion-container slide-enter">
            {instruction && <p className="accordion-instruction">{instruction}</p>}

            <div className="accordion-wrapper">
                {items.map((item, index) => {
                    const unlocked = isUnlocked(index);
                    const checked = isChecked(index);
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={`accordion-item ${isOpen ? 'open' : ''} ${!unlocked ? 'locked' : ''} ${checked ? 'checked-item' : ''}`}
                            onClick={() => toggleItem(index)}
                        >
                            <div className="accordion-header">
                                <h3 className="accordion-title">
                                    <span className="accordion-number" style={{ opacity: unlocked ? 1 : 0.5 }}>{index + 1}.</span>
                                    {item.icon && <span className="accordion-item-icon">{item.icon}</span>}
                                    <span style={{ opacity: unlocked ? 1 : 0.5 }}>{item.title}</span>
                                </h3>
                                <div className="accordion-indicators">
                                    {checked && <CheckCircle2 size={24} className="status-icon text-accent" />}
                                    {!unlocked && <Circle size={24} className="status-icon text-muted" />}
                                    <span className="accordion-chevron">
                                        {isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="accordion-body expanded"
                                    >
                                        <div className="accordion-content">
                                            <p>{item.content}</p>

                                            {!checked && (
                                                <div className="accordion-action" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-start' }}>
                                                    <Button onClick={(e) => handleCheckItem(e, index)} variant="secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                                                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Marcar como lido e avançar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <div className="module-actions" style={{ justifyContent: 'center', marginTop: '2.5rem' }}>
                <Button onClick={onComplete} variant="primary" disabled={!allChecked}>
                    {allChecked ? 'Continuar Treinamento ➡️' : `Leia ${items.length - checkedItems.length} item(ns) pendente(s)`}
                </Button>
            </div>
        </div>
    );
};

export default AccordionList;
