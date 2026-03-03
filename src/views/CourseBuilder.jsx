import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, X, Plus, Save, ArrowLeft, Settings, Layers, Image, Type, PlaySquare, HelpCircle, AlignLeft, Trash2, AlertTriangle, Edit3, List, GitCommit, Globe, MessageCircle, GripHorizontal, MoveVertical } from 'lucide-react';
import Button from '../components/Button';
import { supabase } from '../services/supabaseClient';
import './CourseBuilder.css';

const MODULE_TEMPLATES = [
    { type: 'content', title: 'Texto/HTML Simples', icon: <AlignLeft size={18} />, defaultContent: 'Insira o texto descritivo aqui...' },
    { type: 'video', title: 'Vídeo (YouTube)', icon: <PlaySquare size={18} />, defaultVideoId: '', requireDelay: 0 },
    { type: 'quiz', title: 'Questionário', icon: <HelpCircle size={18} />, defaultQuestion: 'Sua pergunta aqui.', allowMultiple: false, defaultOptions: [{ id: `opt_${Date.now()}`, text: 'Opção 1', isCorrect: true }] },
    { type: 'myth_truth', title: 'Mito ou Verdade', icon: <AlertTriangle size={18} />, defaultQuestion: 'Afirmação...', defaultIsTruth: true, defaultExplanation: 'Explicação do porquê...' },
    { type: 'open_question', title: 'Questão Descritiva', icon: <Type size={18} />, defaultContext: '', defaultQuestion: 'O que você achou disso?' },
    { type: 'advanced_form', title: 'Formulário / Landing Page', icon: <Edit3 size={18} />, defaultTitle: 'Solicitação de Acesso', defaultFields: [{ id: `fld_${Date.now()}`, label: 'Seu Email Corporativo', type: 'text', required: true }] },
    { type: 'carousel', title: 'Carrossel de Slides', icon: <Image size={18} />, defaultSlides: [{ id: `sld_${Date.now()}`, title: 'Slide 1', text: '' }] },
    { type: 'image_content', title: 'Imagem + Texto', icon: <Image size={18} />, defaultImageSrc: '', defaultContent: 'Descreva a imagem aqui...' },
    { type: 'scenario', title: 'Simulador (Cenário)', icon: <HelpCircle size={18} />, defaultContext: 'Você depara-se com um problema...', defaultQuestion: 'O que você faz?', defaultOptions: [{ id: `opt_${Date.now()}`, text: 'Ação 1', isCorrect: true }] },
    { type: 'accordion', title: 'Acordeão', icon: <List size={18} />, defaultInstruction: 'Clique nos itens para ler as regras.', defaultItems: [{ id: `acc_${Date.now()}`, icon: '📌', title: 'Item 1', content: 'Descrição do item...' }] },
    { type: 'timeline', title: 'Linha do Tempo', icon: <GitCommit size={18} />, defaultInstruction: 'Acompanhe a ordem:', defaultSteps: [{ id: `tml_${Date.now()}`, title: 'Passo 1', description: 'O que acontece aqui', imageUrl: '' }] },
    { type: 'webhook_form', title: 'Formulário Automático', icon: <Globe size={18} />, defaultInstruction: 'Preencha os dados abaixo:', defaultWebhookUrl: 'https://hook.us2.make.com/...' },
    { type: 'avatar_balloons', title: 'Balões Interativos', icon: <MessageCircle size={18} />, defaultInstruction: 'Avance os cards para interagir.', defaultAvatarUrl: '', defaultBalloons: [{ id: `bal_${Date.now()}`, icon: '💡', title: 'Princípio 1', content: 'Descrição...' }] },
    { type: 'swipecards', title: 'Cartões Deslizantes', icon: <GripHorizontal size={18} />, defaultInstruction: 'Arraste as cartas para responder.', defaultCards: [{ id: `swp_${Date.now()}`, text: 'Afirmação...', correctIsRight: true, explanation: 'Justificativa...' }] },
    { type: 'drag_drop_sort', title: 'Desafio de Ordenação', icon: <MoveVertical size={18} />, defaultInstruction: 'Ordene do MAIOR para o MENOR:', defaultStepsList: ['Item A', 'Item B', 'Item C'] },
];

const CourseBuilder = ({ courseId, onViewChange }) => {
    const [status, setStatus] = useState('idle');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('15 min');
    const [icon, setIcon] = useState('📚');
    const [departments, setDepartments] = useState(['Todos']);
    const [courseStatus, setCourseStatus] = useState('Draft');

    const AVAILABLE_DEPARTMENTS = ['Todos', 'Vendas', 'RH', 'Suporte', 'Mecânica', 'Administrativo', 'Diretoria'];

    const handleDepartmentToggle = (dept) => {
        if (dept === 'Todos') {
            setDepartments(['Todos']);
        } else {
            let newDepts = departments.filter(d => d !== 'Todos');
            if (newDepts.includes(dept)) {
                newDepts = newDepts.filter(d => d !== dept);
            } else {
                newDepts.push(dept);
            }
            if (newDepts.length === 0) newDepts = ['Todos'];
            setDepartments(newDepts);
        }
    };

    const [steps, setSteps] = useState([]);
    const [activeStepId, setActiveStepId] = useState(null);
    const [activeBlockId, setActiveBlockId] = useState(null);
    const [leftTab, setLeftTab] = useState('steps'); // 'steps' | 'settings'

    useEffect(() => {
        if (courseId) {
            loadExistingCourse(courseId);
        } else {
            const initialStep = { id: `step_${Date.now()}`, title: '1. Boas Vindas', blocks: [] };
            setSteps([initialStep]);
            setActiveStepId(initialStep.id);
        }
    }, [courseId]);

    const loadExistingCourse = async (id) => {
        setStatus('loading');
        try {
            const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
            if (error) throw error;

            setTitle(data.title || '');
            setDescription(data.description || '');
            setDuration(data.duration || '15 min');
            setIcon(data.icon || '📚');
            setDepartments(data.departments || []);
            setCourseStatus(data.status || 'Draft');

            const loadedModules = data.modules || [];
            let migratedSteps = [];

            if (loadedModules.length > 0 && !loadedModules[0].blocks && loadedModules[0].type) {
                // Old flat structure migration
                migratedSteps = loadedModules.map((mod, index) => ({
                    id: `step_${Date.now()}_${index}`,
                    title: mod.title || `Etapa ${index + 1}`,
                    blocks: [{ ...mod, _id: `blk_${Date.now()}_${index}` }]
                }));
            } else if (loadedModules.length > 0) {
                // Already new steps structure
                migratedSteps = loadedModules.map((step, index) => ({
                    ...step,
                    id: step.id || `step_${Date.now()}_${index}`,
                    blocks: (step.blocks || []).map((b, bIdx) => ({
                        ...b,
                        _id: b._id || `blk_${Date.now()}_${index}_${bIdx}`
                    }))
                }));
            } else {
                migratedSteps = [{ id: `step_${Date.now()}`, title: '1. Início', blocks: [] }];
            }

            setSteps(migratedSteps);
            setActiveStepId(migratedSteps[0]?.id || null);
            setStatus('idle');
        } catch (err) {
            console.error("Erro carregando curso:", err);
            setStatus('error');
        }
    };

    const handleSave = async () => {
        setStatus('saving');
        try {
            const payload = {
                title, description, duration, icon, departments, status: courseStatus,
                modules: steps // we map `steps` to the JSONB `modules` column
            };

            if (courseId) {
                const { error } = await supabase.from('courses').update(payload).eq('id', courseId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('courses').insert([payload]);
                if (error) throw error;
            }
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === 'step') {
            const items = Array.from(steps);
            const [reordered] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reordered);
            setSteps(items);
        } else if (type === 'block') {
            const activeStepIndex = steps.findIndex(s => s.id === activeStepId);
            if (activeStepIndex === -1) return;

            const newSteps = [...steps];
            const blocks = Array.from(newSteps[activeStepIndex].blocks);
            const [reordered] = blocks.splice(source.index, 1);
            blocks.splice(destination.index, 0, reordered);
            newSteps[activeStepIndex].blocks = blocks;
            setSteps(newSteps);
        }
    };

    // --- STEP ACTIONS ---
    const handleAddStep = () => {
        const newStep = { id: `step_${Date.now()}`, title: `Nova Etapa`, blocks: [] };
        setSteps([...steps, newStep]);
        setActiveStepId(newStep.id);
        setActiveBlockId(null);
    };

    const handleRemoveStep = (e, idToRemove) => {
        e.stopPropagation();
        const filtered = steps.filter(s => s.id !== idToRemove);
        setSteps(filtered);
        if (activeStepId === idToRemove) {
            setActiveStepId(filtered[0]?.id || null);
            setActiveBlockId(null);
        }
    };

    const handleStepTitleChange = (id, newTitle) => {
        setSteps(steps.map(s => s.id === id ? { ...s, title: newTitle } : s));
    };

    // --- BLOCK ACTIONS ---
    const handleAddBlock = (template) => {
        if (!activeStepId) return;
        const newBlock = {
            ...template,
            _id: `blk_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            content: template.defaultContent,
            slides: template.defaultSlides,
            videoId: template.defaultVideoId,
            requireDelay: template.requireDelay,
            question: template.defaultQuestion,
            options: template.defaultOptions,
            context: template.defaultContext
        };
        // Clean defaults mapping
        Object.keys(newBlock).forEach(k => { if (k.startsWith('default')) delete newBlock[k]; });

        setSteps(steps.map(s => s.id === activeStepId ? { ...s, blocks: [...s.blocks, newBlock] } : s));
        setActiveBlockId(newBlock._id);
    };

    const handleRemoveBlock = (e, blockIdToRemove) => {
        e.stopPropagation();
        setSteps(steps.map(s => s.id === activeStepId ? { ...s, blocks: s.blocks.filter(b => b._id !== blockIdToRemove) } : s));
        if (activeBlockId === blockIdToRemove) setActiveBlockId(null);
    };

    const updateActiveBlock = (updates) => {
        setSteps(steps.map(s => {
            if (s.id === activeStepId) {
                return { ...s, blocks: s.blocks.map(b => b._id === activeBlockId ? { ...b, ...updates } : b) };
            }
            return s;
        }));
    };

    const activeStepIndex = steps.findIndex(s => s.id === activeStepId);
    const activeStep = steps[activeStepIndex];
    const activeBlock = activeStep?.blocks.find(b => b._id === activeBlockId);

    const renderBlockProperties = () => {
        if (!activeBlock) return null;

        return (
            <div className="properties-editor fade-in">
                <div className="prop-header">
                    <Button variant="outline" size="small" onClick={() => setActiveBlockId(null)}>← Ajuda / Elementos</Button>
                    <h4>Propriedades do Elemento</h4>
                </div>

                <div className="prop-type-badge">{activeBlock.type.toUpperCase()}</div>

                <div className="prop-group">
                    <label>Título Informativo</label>
                    <input className="clean-input" value={activeBlock.title || ''} onChange={e => updateActiveBlock({ title: e.target.value })} />
                </div>

                {activeBlock.type === 'content' && (
                    <div className="prop-group">
                        <label>Conteúdo HTML/Texto</label>
                        <textarea className="clean-input" rows="6" value={activeBlock.content || ''} onChange={e => updateActiveBlock({ content: e.target.value })} />
                    </div>
                )}

                {activeBlock.type === 'image_content' && (
                    <>
                        <div className="prop-group">
                            <label>URL da Imagem</label>
                            <input className="clean-input" value={activeBlock.imageSrc || ''} onChange={e => updateActiveBlock({ imageSrc: e.target.value })} placeholder="URL da imagem (ex: /images/courses/img.png)" />
                        </div>
                        <div className="prop-group">
                            <label>Conteúdo HTML/Texto (Abaixo da Imagem)</label>
                            <textarea className="clean-input" rows="6" value={activeBlock.content || ''} onChange={e => updateActiveBlock({ content: e.target.value })} />
                        </div>
                    </>
                )}

                {activeBlock.type === 'scenario' && (
                    <>
                        <div className="prop-group">
                            <label>Contexto (Descreva o Cenário)</label>
                            <textarea className="clean-input" rows="3" value={activeBlock.context || ''} onChange={e => updateActiveBlock({ context: e.target.value })} />
                        </div>
                        <div className="prop-group">
                            <label>Pergunta Final (Ação do Player)</label>
                            <textarea className="clean-input" rows="2" value={activeBlock.question || ''} onChange={e => updateActiveBlock({ question: e.target.value })} />
                        </div>
                        <div className="prop-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Ações / Opções
                                <span className="add-opt-btn" onClick={() => {
                                    const newOpts = [...(activeBlock.options || []), { id: `opt_${Date.now()}`, text: 'Nova Ação', isCorrect: false }];
                                    updateActiveBlock({ options: newOpts });
                                }}>+ Adicionar Ação</span>
                            </label>

                            <div className="options-list">
                                {(activeBlock.options || []).map((opt) => (
                                    <div key={opt.id} className="option-edit-row">
                                        <input
                                            type="radio"
                                            name={`scenario_correct_${activeBlock._id}`}
                                            checked={opt.isCorrect}
                                            onChange={() => {
                                                const updated = activeBlock.options.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                                                updateActiveBlock({ options: updated });
                                            }}
                                            title="Marcar como ação correta"
                                        />
                                        <input className="clean-input" value={opt.text} onChange={e => {
                                            const updated = activeBlock.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o);
                                            updateActiveBlock({ options: updated });
                                        }} placeholder="Descrição da ação..." />
                                        <button className="del-btn" onClick={() => updateActiveBlock({ options: activeBlock.options.filter(o => o.id !== opt.id) })} title="Remover Ação"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeBlock.type === 'video' && (
                    <>
                        <div className="prop-group">
                            <label>ID do Vídeo (Código YouTube)</label>
                            <input className="clean-input" value={activeBlock.videoId || ''} onChange={e => updateActiveBlock({ videoId: e.target.value })} placeholder="Ex: dQw4w9WgXcQ" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Pegue apenas os caracteres finais do link após "v=". Ex: youtube.com/watch?v=<b>XXX</b></span>
                        </div>
                        <div className="prop-group">
                            <label>Tempo Mínimo (Segundos)</label>
                            <input type="number" className="clean-input" value={activeBlock.requireDelay || 0} onChange={e => updateActiveBlock({ requireDelay: parseInt(e.target.value) || 0 })} placeholder="0 para não obrigar bloqueio" />
                        </div>
                    </>
                )}

                {activeBlock.type === 'quiz' && (
                    <>
                        <div className="prop-group">
                            <label>Pergunta Principal</label>
                            <textarea className="clean-input" rows="3" value={activeBlock.question || ''} onChange={e => updateActiveBlock({ question: e.target.value })} />
                        </div>

                        <div className="prop-group-inline">
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: '1rem 0' }}>
                                <input type="checkbox" checked={activeBlock.allowMultiple || false} onChange={e => updateActiveBlock({ allowMultiple: e.target.checked })} />
                                Permitir Múltipla Escolha (Várias certas)
                            </label>
                        </div>

                        <div className="prop-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Alternativas
                                <span className="add-opt-btn" onClick={() => {
                                    const newOpts = [...(activeBlock.options || []), { id: `opt_${Date.now()}`, text: 'Nova Alternativa', isCorrect: false }];
                                    updateActiveBlock({ options: newOpts });
                                }}>+ Adicionar Opção</span>
                            </label>

                            <div className="options-list">
                                {(activeBlock.options || []).map((opt) => (
                                    <div key={opt.id} className="option-edit-row">
                                        <input
                                            type={activeBlock.allowMultiple ? "checkbox" : "radio"}
                                            name={`quiz_correct_${activeBlock._id}`}
                                            checked={opt.isCorrect}
                                            onChange={() => {
                                                if (activeBlock.allowMultiple) {
                                                    const updated = activeBlock.options.map(o => o.id === opt.id ? { ...o, isCorrect: !o.isCorrect } : o);
                                                    updateActiveBlock({ options: updated });
                                                } else {
                                                    const updated = activeBlock.options.map(o => ({ ...o, isCorrect: o.id === opt.id }));
                                                    updateActiveBlock({ options: updated });
                                                }
                                            }}
                                            title="Marcar como alternativa correta"
                                        />
                                        <input className="clean-input" value={opt.text} onChange={e => {
                                            const updated = activeBlock.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o);
                                            updateActiveBlock({ options: updated });
                                        }} placeholder="Texto da opção..." />
                                        <button className="del-btn" onClick={() => updateActiveBlock({ options: activeBlock.options.filter(o => o.id !== opt.id) })} title="Remover Alternativa"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeBlock.type === 'myth_truth' && (
                    <>
                        <div className="prop-group">
                            <label>Afirmação (Mito ou Verdade?)</label>
                            <textarea className="clean-input" rows="3" value={activeBlock.question || ''} onChange={e => updateActiveBlock({ question: e.target.value })} />
                        </div>

                        <div className="prop-group">
                            <label>Resposta Correta</label>
                            <select className="clean-input" style={{ marginBottom: '1rem' }} value={activeBlock.defaultIsTruth ? 'true' : 'false'} onChange={e => updateActiveBlock({ defaultIsTruth: e.target.value === 'true' })}>
                                <option value="true">✅ É Verdade</option>
                                <option value="false">❌ É Mito / Fake</option>
                            </select>
                        </div>

                        <div className="prop-group">
                            <label>Explicação (Mostrada após responder)</label>
                            <textarea className="clean-input" rows="3" value={activeBlock.defaultExplanation || ''} onChange={e => updateActiveBlock({ defaultExplanation: e.target.value })} />
                        </div>
                    </>
                )}

                {activeBlock.type === 'advanced_form' && (
                    <>
                        <div className="prop-group">
                            <label>Título do Formulário</label>
                            <input className="clean-input" value={activeBlock.defaultTitle || ''} onChange={e => updateActiveBlock({ defaultTitle: e.target.value })} />
                        </div>

                        <div className="prop-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                Campos de Preenchimento
                                <span className="add-opt-btn" onClick={() => {
                                    const newFields = [...(activeBlock.defaultFields || []), { id: `fld_${Date.now()}`, label: 'Novo Campo', type: 'text', required: false }];
                                    updateActiveBlock({ defaultFields: newFields });
                                }}>+ Campo</span>
                            </label>

                            <div className="options-list">
                                {(activeBlock.defaultFields || []).map((field) => (
                                    <div key={field.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <input className="clean-input" style={{ flex: 1, padding: '0.25rem 0' }} value={field.label} onChange={e => {
                                                const updated = activeBlock.defaultFields.map(f => f.id === field.id ? { ...f, label: e.target.value } : f);
                                                updateActiveBlock({ defaultFields: updated });
                                            }} placeholder="Nome do Campo (Ex: RG)" />
                                            <button className="del-btn" onClick={() => updateActiveBlock({ defaultFields: activeBlock.defaultFields.filter(f => f.id !== field.id) })}><X size={14} /></button>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <select className="clean-input" style={{ padding: '0.25rem', width: 'auto' }} value={field.type} onChange={e => {
                                                const updated = activeBlock.defaultFields.map(f => f.id === field.id ? { ...f, type: e.target.value } : f);
                                                updateActiveBlock({ defaultFields: updated });
                                            }}>
                                                <option value="text">Texto Curto</option>
                                                <option value="textarea">Texto Longo</option>
                                                <option value="number">Número</option>
                                                <option value="email">Email</option>
                                                <option value="date">Data</option>
                                            </select>
                                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', margin: 0 }}>
                                                <input type="checkbox" checked={field.required} onChange={e => {
                                                    const updated = activeBlock.defaultFields.map(f => f.id === field.id ? { ...f, required: e.target.checked } : f);
                                                    updateActiveBlock({ defaultFields: updated });
                                                }} /> Obrigatório
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeBlock.type === 'open_question' && (
                    <>
                        <div className="prop-group">
                            <label>Instrução / Contexto</label>
                            <textarea className="clean-input" rows="3" value={activeBlock.context || ''} onChange={e => updateActiveBlock({ context: e.target.value })} />
                        </div>
                        <div className="prop-group">
                            <label>Pergunta (Input Text)</label>
                            <input className="clean-input" value={activeBlock.question || ''} onChange={e => updateActiveBlock({ question: e.target.value })} />
                        </div>
                    </>
                )}

                {activeBlock.type === 'webhook_form' && (
                    <>
                        <div className="prop-group">
                            <label>Instrução / Contexto</label>
                            <textarea className="clean-input" rows="2" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />
                        </div>
                        <div className="prop-group">
                            <label>URL do Webhook (ex: Make/Zapier)</label>
                            <input className="clean-input" value={activeBlock.defaultWebhookUrl || ''} onChange={e => updateActiveBlock({ defaultWebhookUrl: e.target.value })} placeholder="https://hook.us2.make.com/..." />
                        </div>
                    </>
                )}

                {activeBlock.type === 'accordion' && (
                    <div className="prop-group">
                        <div className="prop-group" style={{ marginBottom: '1rem' }}>
                            <label>Instrução Geral</label>
                            <input className="clean-input" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />
                        </div>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Itens do Acordeão
                            <span className="add-opt-btn" onClick={() => {
                                const newItems = [...(activeBlock.defaultItems || []), { id: `acc_${Date.now()}`, icon: '📌', title: 'Novo Item', content: '' }];
                                updateActiveBlock({ defaultItems: newItems });
                            }}>+ Item</span>
                        </label>
                        <div className="options-list">
                            {(activeBlock.defaultItems || []).map((item, index) => (
                                <div key={item.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ITEM {index + 1}</span>
                                        <button className="del-btn" onClick={() => updateActiveBlock({ defaultItems: activeBlock.defaultItems.filter(i => i.id !== item.id) })}><X size={14} /></button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input className="clean-input" style={{ padding: '0.5rem', width: '60px', textAlign: 'center' }} value={item.icon} onChange={e => {
                                            const updated = activeBlock.defaultItems.map(i => i.id === item.id ? { ...i, icon: e.target.value } : i);
                                            updateActiveBlock({ defaultItems: updated });
                                        }} placeholder="Ícone" />
                                        <input className="clean-input" style={{ padding: '0.5rem', flex: 1 }} value={item.title} onChange={e => {
                                            const updated = activeBlock.defaultItems.map(i => i.id === item.id ? { ...i, title: e.target.value } : i);
                                            updateActiveBlock({ defaultItems: updated });
                                        }} placeholder="Título do Item" />
                                    </div>
                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={item.content} onChange={e => {
                                        const updated = activeBlock.defaultItems.map(i => i.id === item.id ? { ...i, content: e.target.value } : i);
                                        updateActiveBlock({ defaultItems: updated });
                                    }} placeholder="Conteúdo do texto explicativo..." />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeBlock.type === 'timeline' && (
                    <div className="prop-group">
                        <div className="prop-group" style={{ marginBottom: '1rem' }}>
                            <label>Contexto / Instrução</label>
                            <input className="clean-input" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />
                        </div>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Passos da Linha do Tempo
                            <span className="add-opt-btn" onClick={() => {
                                const newSteps = [...(activeBlock.defaultSteps || []), { id: `tml_${Date.now()}`, title: 'Novo Passo', description: '', imageUrl: '' }];
                                updateActiveBlock({ defaultSteps: newSteps });
                            }}>+ Passo</span>
                        </label>
                        <div className="options-list">
                            {(activeBlock.defaultSteps || []).map((step, index) => (
                                <div key={step.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid var(--accent)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PASSO {index + 1}</span>
                                        <button className="del-btn" onClick={() => updateActiveBlock({ defaultSteps: activeBlock.defaultSteps.filter(s => s.id !== step.id) })}><X size={14} /></button>
                                    </div>
                                    <input className="clean-input" style={{ padding: '0.5rem' }} value={step.title} onChange={e => {
                                        const updated = activeBlock.defaultSteps.map(s => s.id === step.id ? { ...s, title: e.target.value } : s);
                                        updateActiveBlock({ defaultSteps: updated });
                                    }} placeholder="Título do Passo" />
                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={step.description} onChange={e => {
                                        const updated = activeBlock.defaultSteps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s);
                                        updateActiveBlock({ defaultSteps: updated });
                                    }} placeholder="Descrição do que acontece..." />
                                    <input className="clean-input" style={{ padding: '0.5rem' }} value={step.imageUrl || ''} onChange={e => {
                                        const updated = activeBlock.defaultSteps.map(s => s.id === step.id ? { ...s, imageUrl: e.target.value } : s);
                                        updateActiveBlock({ defaultSteps: updated });
                                    }} placeholder="URL da Imagem de Fundo (Opcional)" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeBlock.type === 'avatar_balloons' && (
                    <div className="prop-group">
                        <div className="prop-group" style={{ marginBottom: '1rem' }}>
                            <label>Contexto / Instrução</label>
                            <input className="clean-input" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />

                            <label style={{ marginTop: '1rem' }}>URL do Avatar (Imagem)</label>
                            <input className="clean-input" value={activeBlock.defaultAvatarUrl || ''} onChange={e => updateActiveBlock({ defaultAvatarUrl: e.target.value })} placeholder="Deixe em branco para o padrão..." />
                        </div>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Balões de Fala
                            <span className="add-opt-btn" onClick={() => {
                                const newBalloons = [...(activeBlock.defaultBalloons || []), { id: `bal_${Date.now()}`, icon: '💬', title: 'Novo Balão', content: '' }];
                                updateActiveBlock({ defaultBalloons: newBalloons });
                            }}>+ Balão</span>
                        </label>
                        <div className="options-list">
                            {(activeBlock.defaultBalloons || []).map((balloon, index) => (
                                <div key={balloon.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid #8b5cf6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>BALÃO {index + 1}</span>
                                        <button className="del-btn" onClick={() => updateActiveBlock({ defaultBalloons: activeBlock.defaultBalloons.filter(b => b.id !== balloon.id) })}><X size={14} /></button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input className="clean-input" style={{ padding: '0.5rem', width: '60px', textAlign: 'center' }} value={balloon.icon} onChange={e => {
                                            const updated = activeBlock.defaultBalloons.map(b => b.id === balloon.id ? { ...b, icon: e.target.value } : b);
                                            updateActiveBlock({ defaultBalloons: updated });
                                        }} placeholder="Ícone" />
                                        <input className="clean-input" style={{ padding: '0.5rem', flex: 1 }} value={balloon.title} onChange={e => {
                                            const updated = activeBlock.defaultBalloons.map(b => b.id === balloon.id ? { ...b, title: e.target.value } : b);
                                            updateActiveBlock({ defaultBalloons: updated });
                                        }} placeholder="Título Menor" />
                                    </div>
                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={balloon.content} onChange={e => {
                                        const updated = activeBlock.defaultBalloons.map(b => b.id === balloon.id ? { ...b, content: e.target.value } : b);
                                        updateActiveBlock({ defaultBalloons: updated });
                                    }} placeholder="Texto longo falado..." />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeBlock.type === 'swipecards' && (
                    <div className="prop-group">
                        <div className="prop-group" style={{ marginBottom: '1rem' }}>
                            <label>Instrução Inicial</label>
                            <input className="clean-input" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />
                        </div>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Cartas (Deslizar Dir/Esq)
                            <span className="add-opt-btn" onClick={() => {
                                const newCards = [...(activeBlock.defaultCards || []), { id: `swp_${Date.now()}`, text: 'Nova carta...', correctIsRight: true, explanation: '' }];
                                updateActiveBlock({ defaultCards: newCards });
                            }}>+ Carta</span>
                        </label>
                        <div className="options-list">
                            {(activeBlock.defaultCards || []).map((card, index) => (
                                <div key={card.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid #f59e0b' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CARTA {index + 1}</span>
                                        <button className="del-btn" onClick={() => updateActiveBlock({ defaultCards: activeBlock.defaultCards.filter(c => c.id !== card.id) })}><X size={14} /></button>
                                    </div>
                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={card.text} onChange={e => {
                                        const updated = activeBlock.defaultCards.map(c => c.id === card.id ? { ...c, text: e.target.value } : c);
                                        updateActiveBlock({ defaultCards: updated });
                                    }} placeholder="Texto/Afirmação da carta..." />

                                    <select className="clean-input" style={{ padding: '0.5rem' }} value={card.correctIsRight ? 'true' : 'false'} onChange={e => {
                                        const updated = activeBlock.defaultCards.map(c => c.id === card.id ? { ...c, correctIsRight: e.target.value === 'true' } : c);
                                        updateActiveBlock({ defaultCards: updated });
                                    }}>
                                        <option value="true">Gabarito: 👉 Direita (Verdade)</option>
                                        <option value="false">Gabarito: 👈 Esquerda (Mito)</option>
                                    </select>

                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={card.explanation || ''} onChange={e => {
                                        const updated = activeBlock.defaultCards.map(c => c.id === card.id ? { ...c, explanation: e.target.value } : c);
                                        updateActiveBlock({ defaultCards: updated });
                                    }} placeholder="Explicação/Feedback..." />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeBlock.type === 'drag_drop_sort' && (
                    <div className="prop-group">
                        <div className="prop-group" style={{ marginBottom: '1rem' }}>
                            <label>Instrução do Desafio</label>
                            <input className="clean-input" value={activeBlock.defaultInstruction || ''} onChange={e => updateActiveBlock({ defaultInstruction: e.target.value })} />
                            <div className="warning-box" style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.5rem' }}>A ordem que você definir aqui será considerada o gabarito.</div>
                        </div>
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Itens a Ordenar
                            <span className="add-opt-btn" onClick={() => {
                                const newSteps = [...(activeBlock.defaultStepsList || []), 'Novo item...'];
                                updateActiveBlock({ defaultStepsList: newSteps });
                            }}>+ Item</span>
                        </label>
                        <div className="options-list">
                            {(activeBlock.defaultStepsList || []).map((stepTxt, index) => (
                                <div key={`dd_${index}`} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>POSIÇÃO CORRETA {index + 1}</span>
                                        <button className="del-btn" onClick={() => {
                                            const updated = [...activeBlock.defaultStepsList];
                                            updated.splice(index, 1);
                                            updateActiveBlock({ defaultStepsList: updated });
                                        }}><X size={14} /></button>
                                    </div>
                                    <textarea className="clean-input" rows="2" style={{ padding: '0.5rem' }} value={stepTxt} onChange={e => {
                                        const updated = [...activeBlock.defaultStepsList];
                                        updated[index] = e.target.value;
                                        updateActiveBlock({ defaultStepsList: updated });
                                    }} placeholder="Texto..." />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeBlock.type === 'carousel' && (
                    <div className="prop-group">
                        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                            Slides do Carrossel
                            <span className="add-opt-btn" onClick={() => {
                                const newSlides = [...(activeBlock.slides || []), { id: `sld_${Date.now()}`, title: 'Novo Slide', text: '' }];
                                updateActiveBlock({ slides: newSlides });
                            }}>+ Slide</span>
                        </label>

                        <div className="options-list">
                            {(activeBlock.slides || []).map((slide, index) => (
                                <div key={slide.id} className="option-edit-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderLeft: '3px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SLIDE {index + 1}</span>
                                        <button className="del-btn" onClick={() => updateActiveBlock({ slides: activeBlock.slides.filter(s => s.id !== slide.id) })} title="Remover Slide"><X size={14} /></button>
                                    </div>
                                    <input className="clean-input" style={{ padding: '0.5rem' }} value={slide.title} onChange={e => {
                                        const updated = activeBlock.slides.map(s => s.id === slide.id ? { ...s, title: e.target.value } : s);
                                        updateActiveBlock({ slides: updated });
                                    }} placeholder="Título do Slide" />
                                    <input className="clean-input" style={{ padding: '0.5rem' }} value={slide.image || ''} onChange={e => {
                                        const updated = activeBlock.slides.map(s => s.id === slide.id ? { ...s, image: e.target.value } : s);
                                        updateActiveBlock({ slides: updated });
                                    }} placeholder="URL da Imagem (Ex: https://.../img.jpg)" />
                                    <textarea className="clean-input" rows="3" style={{ padding: '0.5rem', resize: 'vertical' }} value={slide.text} onChange={e => {
                                        const updated = activeBlock.slides.map(s => s.id === slide.id ? { ...s, text: e.target.value } : s);
                                        updateActiveBlock({ slides: updated });
                                    }} placeholder="Texto/Conteúdo do slide..." />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (status === 'loading') return <div className="loading-screen">Carregando Construtor Inlead Style...</div>;

    return (
        <div className="advanced-builder fade-in">
            <div className="builder-topbar">
                <div className="topbar-left">
                    <Button variant="ghost" className="btn-icon" onClick={() => onViewChange('admin')}><ArrowLeft size={18} /></Button>
                    <div className="course-title-edit">
                        <input className="naked-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do Curso..." />
                    </div>
                </div>

                <div className="topbar-right">
                    <select className="status-select" value={courseStatus} onChange={e => setCourseStatus(e.target.value)}>
                        <option value="Draft">Rascunho (Oculto)</option>
                        <option value="Published">Publicado</option>
                    </select>
                    <Button variant="primary" onClick={handleSave} disabled={status === 'saving'}>
                        {status === 'saving' ? 'Salvando...' : <><Save size={16} style={{ marginRight: '6px' }} /> Salvar Treinamento</>}
                    </Button>
                    {status === 'success' && <span className="save-success-msg">Salvo!</span>}
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="builder-workspace">

                    {/* LEFT COL: Steps & Settings */}
                    <aside className="builder-left-col">
                        <div className="left-tabs">
                            <button className={leftTab === 'steps' ? 'active' : ''} onClick={() => setLeftTab('steps')}><Layers size={16} /> Fluxo (Etapas)</button>
                            <button className={leftTab === 'settings' ? 'active' : ''} onClick={() => setLeftTab('settings')}><Settings size={16} /> Propriedades</button>
                        </div>

                        <div className="left-content custom-scroll">
                            {leftTab === 'settings' && (
                                <div className="global-settings fade-in">
                                    <div className="prop-group">
                                        <label>Ícone Visível (Emoji)</label>
                                        <input className="clean-input" value={icon} onChange={e => setIcon(e.target.value)} />
                                    </div>
                                    <div className="prop-group">
                                        <label>Descrição do Curso</label>
                                        <textarea className="clean-input" rows="4" value={description} onChange={e => setDescription(e.target.value)} />
                                    </div>
                                    <div className="prop-group">
                                        <label>Duração (Texto)</label>
                                        <input className="clean-input" value={duration} onChange={e => setDuration(e.target.value)} />
                                    </div>
                                    <div className="prop-group">
                                        <label>Liberado para Setores</label>
                                        <div className="department-checkboxes" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                            {AVAILABLE_DEPARTMENTS.map(dept => (
                                                <label key={dept} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={departments.includes(dept)}
                                                        onChange={() => handleDepartmentToggle(dept)}
                                                    />
                                                    {dept}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {leftTab === 'steps' && (
                                <div className="steps-manager fade-in">
                                    <Droppable droppableId="steps-list" type="step">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="steps-list">
                                                {steps.map((step, index) => (
                                                    <Draggable key={step.id} draggableId={step.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`step-item ${activeStepId === step.id ? 'active' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                onClick={() => { setActiveStepId(step.id); setActiveBlockId(null); }}
                                                            >
                                                                <div className="step-drag-handle" {...provided.dragHandleProps}><GripVertical size={14} /></div>
                                                                <div className="step-info">
                                                                    <span className="step-num">{index + 1}.</span>
                                                                    <span className="step-title-display">{step.title}</span>
                                                                </div>
                                                                {steps.length > 1 && (
                                                                    <button className="del-step-btn" onClick={(e) => handleRemoveStep(e, step.id)}><X size={14} /></button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                    <button className="add-step-btn" onClick={handleAddStep}><Plus size={16} /> Adicionar Etapa de Design</button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* CENTER COL: Canvas */}
                    <main className="builder-center-col">
                        <div className="canvas-wrapper custom-scroll">
                            {activeStep ? (
                                <div className="canvas-page">
                                    <input
                                        className="canvas-step-title"
                                        value={activeStep.title}
                                        onChange={e => handleStepTitleChange(activeStep.id, e.target.value)}
                                        placeholder="Título desta etapa de tela..."
                                    />

                                    <Droppable droppableId={`blocks-${activeStep.id}`} type="block">
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className={`blocks-canvas ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}>
                                                {activeStep.blocks.map((block, index) => (
                                                    <Draggable key={block._id} draggableId={block._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`canvas-block-item ${activeBlockId === block._id ? 'selected' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                                                onClick={(e) => { e.stopPropagation(); setActiveBlockId(block._id); }}
                                                            >
                                                                <div className="block-drag-handle" {...provided.dragHandleProps}><GripVertical size={16} /></div>

                                                                <div className="block-preview-content">
                                                                    <div className="bp-header">
                                                                        <div className="block-badge">{block.type}</div>
                                                                        <button className="del-blk-btn" onClick={(e) => handleRemoveBlock(e, block._id)}><Trash2 size={16} /></button>
                                                                    </div>
                                                                    <div className="block-preview-title">{block.title}</div>
                                                                    {block.type === 'content' && <div className="preview-hint" dangerouslySetInnerHTML={{ __html: String(block.content).substring(0, 100) }} />}
                                                                    {block.type === 'quiz' && <div className="preview-hint">"{block.question}" • {block.allowMultiple ? 'Múltiplas opções' : 'Opção única'}</div>}
                                                                    {block.type === 'video' && <div className="preview-hint">🎥 Youtube Video: {block.videoId || '???'}</div>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}

                                                {/* Canvas Add Help */}
                                                <div className="add-block-placeholder" onClick={() => setActiveBlockId(null)}>
                                                    + Adicionar Novo Componente Visual Abaixo
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ) : (
                                <div className="empty-state">Nenhuma etapa. Clique em 'Nova Etapa' à esquerda.</div>
                            )}
                        </div>
                    </main>

                    {/* RIGHT COL: Properties or Palette */}
                    <aside className="builder-right-col custom-scroll">
                        {activeBlockId && activeBlock ? (
                            renderBlockProperties()
                        ) : (
                            <div className="palette-container fade-in">
                                <h4>Elementos Gráficos</h4>
                                <p className="palette-desc">Clique para Inserir Módulo na {activeStep?.title || 'EtapaAtual'}.</p>
                                <div className="palette-grid">
                                    {MODULE_TEMPLATES.map(t => (
                                        <div key={t.type} className={`palette-btn ${!activeStepId ? 'disabled' : ''}`} onClick={() => handleAddBlock(t)}>
                                            <span className="p-icon">{t.icon}</span>
                                            <span className="p-name">{t.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                </div>
            </DragDropContext>
        </div>
    );
};

export default CourseBuilder;
