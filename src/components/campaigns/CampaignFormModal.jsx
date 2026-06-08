import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, Image as ImageIcon, Video, Mic, StopCircle, X } from 'lucide-react';
import { campaignService } from '../../services/campaignService';

// Extract the form body to prevent the overlay (blur filter) from re-rendering on every keystroke
const CampaignFormBody = ({ initialData, user, onClose, onSave }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDepartments, setNewDepartments] = useState(['Todos']);
  const [newGoalType, setNewGoalType] = useState('');
  const [newGoalValue, setNewGoalValue] = useState('');
  const [newGoalObjective, setNewGoalObjective] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('R$');
  const [newGoalReward, setNewGoalReward] = useState('');
  const [newGoalRewardType, setNewGoalRewardType] = useState('Pontos');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  
  const [criteriaList, setCriteriaList] = useState([{ id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos', criteriaType: 'Recorrente' }]);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const richTextRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setNewTitle(initialData.title || '');
      setNewDepartments(initialData.departments || ['Todos']);
      setNewGoalType(initialData.super_goal_type || '');
      setNewGoalValue(initialData.super_goal_value || '');
      setNewGoalObjective(initialData.super_goal_objective || '');
      setNewGoalReward(initialData.super_goal_reward || '');
      setNewGoalRewardType(initialData.super_goal_reward_type || 'Pontos');
      setNewGoalUnit(initialData.super_goal_unit || 'R$');
      setNewStartDate(initialData.start_date || '');
      setNewEndDate(initialData.end_date || '');
      setCriteriaList(initialData.criteria && initialData.criteria.length > 0 ? initialData.criteria : [{ id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos', criteriaType: 'Recorrente' }]);
      setAttachments([]);
      setTimeout(() => {
        if (richTextRef.current) {
          richTextRef.current.innerHTML = initialData.content || '';
        }
      }, 100);
    } else {
      setNewTitle('');
      setNewDepartments(['Todos']);
      setNewGoalType('');
      setNewGoalValue('');
      setNewGoalObjective('');
      setNewGoalReward('');
      setNewGoalRewardType('Pontos');
      setNewGoalUnit('R$');
      setNewStartDate('');
      setNewEndDate('');
      setCriteriaList([{ id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos', criteriaType: 'Recorrente' }]);
      setAttachments([]);
      if (richTextRef.current) richTextRef.current.innerHTML = '';
    }
  }, [initialData]);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
    if (richTextRef.current) richTextRef.current.focus();
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioBlob.name = "audio.webm";
          setAttachments(prev => [...prev, { id: Date.now(), type: 'audio', url: audioUrl, file: audioBlob }]);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        alert("Erro ao acessar microfone. Verifique as permissões.");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.src = ev.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) scaleSize = MAX_WIDTH / img.width;
        
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          blob.name = file.name;
          const url = URL.createObjectURL(blob);
          setAttachments(prev => [...prev, { id: Date.now(), type: 'image', url, file: blob }]);
        }, 'image/webp', 0.8);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachments(prev => [...prev, { id: Date.now(), type: 'video', url, file }]);
    e.target.value = null;
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const addCriteria = () => {
    setCriteriaList([...criteriaList, { id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos', criteriaType: 'Recorrente' }]);
  };

  const updateCriteria = (id, field, value) => {
    setCriteriaList(criteriaList.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const removeCriteria = (id) => {
    if (criteriaList.length === 1) return;
    setCriteriaList(criteriaList.filter(c => c.id !== id));
  };

  const handlePublish = async () => {
    if (!newTitle) {
      alert("O nome da campanha é obrigatório.");
      return;
    }
    try {
      let finalHtml = richTextRef.current ? richTextRef.current.innerHTML : '';
      
      for (const att of attachments) {
        if (att.file) {
          const publicUrl = await campaignService.uploadMedia(att.file);
          if (att.type === 'image') finalHtml += `<br/><img src="${publicUrl}" style="max-width:100%; border-radius:8px;" />`;
          else if (att.type === 'video') finalHtml += `<br/><video src="${publicUrl}" controls style="max-width:100%; border-radius:8px;"></video>`;
          else if (att.type === 'audio') finalHtml += `<br/><audio src="${publicUrl}" controls></audio>`;
        }
      }

      const campaignData = {
        title: newTitle,
        content: finalHtml,
        author_id: user?.id,
        author_name: user?.name || user?.fullName || 'Admin',
        start_date: newStartDate || null,
        end_date: newEndDate || null,
        departments: newDepartments,
        criteria: criteriaList,
        super_goal_type: newGoalType || null,
        super_goal_value: newGoalValue ? Number(newGoalValue) : 0,
        super_goal_objective: newGoalObjective || null,
        super_goal_reward: newGoalReward ? Number(newGoalReward) : 0,
        super_goal_reward_type: newGoalRewardType,
        super_goal_unit: newGoalUnit || 'R$',
        is_active: true
      };

      await onSave(initialData ? initialData.id : null, campaignData);
    } catch (err) {
      alert("Erro ao publicar: " + err.message);
    }
  };

  return (
    <div className="campaign-modal-content">
      <div className="modal-header">
        <h2>{initialData ? 'Editar Campanha' : 'Criar Nova Campanha'}</h2>
        <button className="close-modal-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body scrollable-y">
        <div className="form-group">
          <label>Nome da Campanha</label>
          <input type="text" placeholder="Ex: Aquece Verão ☀️" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Descrição da Campanha</label>
          <div className="rich-text-wrapper">
            <div className="rich-text-toolbar">
              <div className="toolbar-group">
                <button type="button" onClick={() => handleFormat('bold')}><Bold size={16} /></button>
                <button type="button" onClick={() => handleFormat('italic')}><Italic size={16} /></button>
                <button type="button" onClick={() => handleFormat('underline')}><Underline size={16} /></button>
                <button type="button" onClick={() => handleFormat('insertUnorderedList')}><List size={16} /></button>
              </div>
              <div className="toolbar-separator"></div>
              <div className="toolbar-group">
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageUpload} />
                <button type="button" onClick={() => fileInputRef.current.click()} title="Inserir Imagem">
                  <ImageIcon size={16} />
                </button>
                <input type="file" accept="video/*" style={{ display: 'none' }} ref={videoInputRef} onChange={handleVideoUpload} />
                <button type="button" onClick={() => videoInputRef.current.click()} title="Inserir Vídeo">
                  <Video size={16} />
                </button>
                <button type="button" onClick={handleToggleRecording} className={isRecording ? 'recording-active' : ''} title="Gravar Áudio (Whatsapp)">
                  {isRecording ? <StopCircle size={16} color="#FF4D6D" /> : <Mic size={16} />}
                  {isRecording && <span className="recording-pulse">Gravando...</span>}
                </button>
              </div>
            </div>
            <div className="rich-text-content">
              <div className="rich-textarea" contentEditable suppressContentEditableWarning={true} placeholder="Descreva os detalhes da campanha, insira formatação e mídias..." ref={richTextRef}></div>
              {attachments.length > 0 && (
                <div className="attachments-preview-area">
                  {attachments.map(att => (
                    <div key={att.id} className="attachment-item">
                      <button type="button" className="remove-att-btn" onClick={() => removeAttachment(att.id)}>
                        <X size={14} />
                      </button>
                      {att.type === 'image' && <img src={att.url} alt="anexo" />}
                      {att.type === 'video' && <video src={att.url} controls />}
                      {att.type === 'audio' && <audio src={att.url} controls />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Critérios da Campanha (Objetivos ➔ Prêmio de Resgates)</label>
          <div className="criteria-table-wrapper">
            <div className="criteria-table-header" style={{ display: 'grid', gridTemplateColumns: '1fr 60px 2fr 100px 40px', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '8px' }}>
              <div className="crit-col-type">Regra (Única/Recorrente)</div>
              <div className="crit-col-qty">Qtd.</div>
              <div className="crit-col-obj">Objetivo/Produto</div>
              <div className="crit-col-rew">Prêmio (pts)</div>
              <div className="crit-col-action"></div>
            </div>
            {criteriaList.map((crit) => (
              <div className="criteria-table-row" key={crit.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 2fr 100px 40px', gap: '8px', alignItems: 'center' }}>
                <div className="crit-col-type">
                  <select value={crit.criteriaType || 'Recorrente'} onChange={(e) => updateCriteria(crit.id, 'criteriaType', e.target.value)}>
                    <option value="Recorrente">Recorrente</option>
                    <option value="Única">Única</option>
                  </select>
                </div>
                <div className="crit-col-qty">
                  <input type="number" value={crit.qty} min="1" onChange={(e) => updateCriteria(crit.id, 'qty', e.target.value)} />
                </div>
                <div className="crit-col-obj">
                  <input type="text" value={crit.objective} placeholder="Ex: Fibra..." onChange={(e) => updateCriteria(crit.id, 'objective', e.target.value)} />
                </div>
                <div className="crit-col-rew">
                  <input type="number" value={crit.reward} min="0" onChange={(e) => updateCriteria(crit.id, 'reward', e.target.value)} />
                </div>
                <div className="crit-col-action">
                  <button type="button" className="remove-crit-btn" onClick={() => removeCriteria(crit.id)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            <div className="add-criteria-row">
              <button type="button" className="add-crit-btn" onClick={addCriteria}>+ Adicionar Regra / Produto</button>
            </div>
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group half">
            <label>Tipo de Super Meta<div className="optional-text-block">(opcional)</div></label>
            <select value={newGoalType} onChange={(e) => setNewGoalType(e.target.value)}>
              <option value="">Nenhuma</option>
              <option value="Global">Global</option>
              <option value="Departamento">Departamento</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
          <div className="form-group half">
            <label>Objetivo da Super Meta<div className="optional-text-block">(opcional)</div></label>
            <input type="text" placeholder="Ex: Vendas de Fibra" value={newGoalObjective} onChange={(e) => setNewGoalObjective(e.target.value)} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group half">
            <label>Alvo da Super Meta<div className="optional-text-block">(opcional)</div></label>
            <div className="input-group-merged">
              <select style={{width: 'auto', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0 12px'}} value={newGoalUnit} onChange={(e) => setNewGoalUnit(e.target.value)}>
                <option value="R$">R$</option>
                <option value="Unidades">Unid.</option>
              </select>
              <input type="number" placeholder="Valor/Qtd" value={newGoalValue} onChange={(e) => setNewGoalValue(e.target.value)} style={{border: 'none', flex: 1}} />
            </div>
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group half">
            <label>Prêmio da Super Meta (em Pontos)</label>
            <input type="number" placeholder="Quantidade de Pontos" value={newGoalReward} onChange={(e) => setNewGoalReward(e.target.value)} />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group half">
            <label className="label-inline-optional">Início da Campanha<span className="optional-text-inline">(opcional)</span></label>
            <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} />
          </div>
          <div className="form-group half">
            <label className="label-inline-optional">Final da Campanha<span className="optional-text-inline">(opcional)</span></label>
            <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={handlePublish}>Publicar Campanha</button>
      </div>
    </div>
  );
};

const CampaignFormModal = ({ isOpen, onClose, initialData, user, onSave }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="campaign-modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 999 }}></div>
      <div className="campaign-modal-wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'center' }}>
          <CampaignFormBody 
            initialData={initialData}
            user={user}
            onClose={onClose}
            onSave={onSave}
          />
        </div>
      </div>
    </>
  );
};

export default CampaignFormModal;
