import React, { useState } from 'react';
import { 
  Image as ImageIcon, Video, Mic, Radio, ChevronDown, 
  MessageSquare, Plus, CheckCircle, Trash2, StopCircle,
  Megaphone, ShoppingCart, Trophy, Gift,
  Pin, MoreVertical, Eye, Paperclip, X,
  Bold, Italic, Underline, List
} from 'lucide-react';
import './Campaigns.css';

const Campaigns = ({ user }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'TEC-B2 ACADEMY',
      title: 'Aquece Verão ☀️',
      content: 'Vamos começar a temporada de vendas de verão! A meta é atingir R$ 30.000 em vendas de produtos Vivo Empresa.',
      timestamp: 'Há 12 horas',
      views: '1.2k',
      progress: 25,
      currentValue: 'R$ 2.500',
      targetValue: 'R$ 10.000',
      likes: 12,
      claps: 4,
    }
  ]);
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'gestor';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal States
  const [criteriaList, setCriteriaList] = useState([
    { id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos' }
  ]);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const richTextRef = React.useRef(null);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
    if (richTextRef.current) richTextRef.current.focus();
  };

  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  // --- AUDIO RECORDING ---
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
          setAttachments(prev => [...prev, { id: Date.now(), type: 'audio', url: audioUrl, file: audioBlob }]);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        alert("Erro ao acessar microfone. Verifique as permissões.");
      }
    }
  };

  // --- IMAGE & VIDEO UPLOAD (WITH COMPRESSION) ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Compressor Canvas Simples para máxima compactação sem perder resolução visual absurda
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
          const url = URL.createObjectURL(blob);
          setAttachments(prev => [...prev, { id: Date.now(), type: 'image', url, file: blob }]);
        }, 'image/webp', 0.8); // WebP para ótima compressão
      };
    };
    reader.readAsDataURL(file);
    e.target.value = null; // reset
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Para vídeo no frontend apenas pegamos o blob, a compactação ideal será no server via FFmpeg se necessário
    const url = URL.createObjectURL(file);
    setAttachments(prev => [...prev, { id: Date.now(), type: 'video', url, file }]);
    e.target.value = null;
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  // --- CRITERIA ACTIONS ---
  const addCriteria = () => {
    setCriteriaList([...criteriaList, { id: Date.now(), qty: 1, objective: '', reward: 0, rewardType: 'Pontos' }]);
  };

  const updateCriteria = (id, field, value) => {
    setCriteriaList(criteriaList.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const removeCriteria = (id) => {
    if (criteriaList.length === 1) return; // manter ao menos um
    setCriteriaList(criteriaList.filter(c => c.id !== id));
  };

  return (
    <div className="campaigns-container">
      {/* Top Header */}
      <header className="campaigns-top-header">
        <div className="campaigns-title-group">
          <h1>
            <span className="hashtag">#</span> Comunidade TEC-B2
          </h1>
          <span className="campaigns-count">{posts.length} publicação</span>
        </div>
        
        <div className="header-actions">
          <div className="status-badge-small">
            <CheckCircle size={14} /> Aberta
          </div>
          
          <div className="header-user-actions">
            <button className="icon-btn-subtle"><Eye size={18} /></button>
            {isAdminOrManager && (
              <button className="new-campaign-btn" onClick={handleCreatePost}>
                <Plus size={16} />
                <span>Nova Campanha</span>
              </button>
            )}
            <button className="icon-btn-subtle"><MoreVertical size={18} /></button>
          </div>
        </div>
      </header>

      <div className="campaigns-main-wrapper">
        {/* Metrics Row */}
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-icon bg-green">
              <Megaphone size={18} color="#00D4AA" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Campanhas Ativas</span>
              <span className="metric-value">0</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon bg-purple">
              <ShoppingCart size={18} color="#b388ff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Vendas Totais em Campanhas</span>
              <span className="metric-value">R$ 0,00</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon bg-pink">
              <Trophy size={18} color="#ff4d6d" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Pontuação Acumulada</span>
              <span className="metric-value">0 pts</span>
            </div>
          </div>

          <button className="marketplace-btn">
            <div className="marketplace-icon-wrapper">
              <Gift size={20} color="#b388ff" />
            </div>
            <div className="marketplace-info">
              <span className="marketplace-title">Resgatar Pontuação</span>
              <span className="marketplace-subtitle">Acesse o Marketplace</span>
            </div>
          </button>
        </div>

        <div className="campaigns-content">

        {/* Filters Area */}
        <div className="filters-section">
          <h3>Todas as Campanhas</h3>
          <div className="filters-controls">
            <button className="filter-dropdown">
              Campanhas Ativas <ChevronDown size={14} />
            </button>
            <button className="filter-dropdown">
              Ordenar <ChevronDown size={14} />
            </button>
            <button className="filter-tab active">Minhas Campanhas</button>
            <button className="filter-tab">Novas</button>
          </div>
        </div>

        {/* Feed / Empty State */}
        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <MessageSquare size={40} />
              <div className="plus-badge">
                <Plus size={16} color="#000" />
              </div>
            </div>
            <h3>Sem campanhas, ainda...</h3>
            <p>Nenhuma campanha foi publicada até o momento.</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map(post => (
              <div key={post.id} className="post-card-v2">
                
                {/* Header */}
                <div className="post-header-v2">
                  <div className="post-author-group">
                    <div className="user-avatar-small">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="post-meta">
                      <span className="post-author">{post.author}</span>
                      <span className="post-time">{post.timestamp}</span>
                    </div>
                  </div>
                  <div className="post-header-actions">
                    <button className="icon-btn-subtle"><Pin size={18} /></button>
                    <button className="icon-btn-subtle"><MoreVertical size={18} /></button>
                  </div>
                </div>
                
                {/* Body */}
                <div className="post-body-v2">
                  <h4 className="post-title">{post.title}</h4>
                  <p>{post.content}</p>
                  
                  {post.progress !== undefined && (
                    <div className="campaign-progress-box">
                      <div className="progress-texts">
                        <span className="progress-status">Meta: {post.progress}% atingida - {post.currentValue} / {post.targetValue}</span>
                        <div className="medal-icon">🥉</div>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${post.progress}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Reactions */}
                <div className="post-footer-v2">
                  <div className="post-views">
                    <Eye size={16} /> <span>{post.views} Visualizações</span>
                  </div>
                  
                  <div className="post-reactions">
                    <div className="reaction-chip">❤️ {post.likes}</div>
                    <div className="reaction-chip">👏 {post.claps}</div>
                    <div className="reaction-chip">👍 0</div>
                    <div className="reaction-chip">🙏 0</div>
                    <div className="reaction-chip">🎉 0</div>
                    
                    <button className="register-sale-btn-blue">
                      Registrar Venda
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="post-comment-section">
                  <div className="comment-input-row">
                    <div className="user-avatar-small">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="comment-input-wrapper">
                      <input type="text" placeholder={`Deixe um comentário para ${post.author}. Use @ para mencionar.`} />
                      <div className="comment-input-icons">
                        <button className="icon-btn-subtle"><ImageIcon size={16} /></button>
                        <button className="icon-btn-subtle"><Paperclip size={16} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="comment-suggestions-chips">
                    <span className="comment-chip">Parabéns! 👏</span>
                    <span className="comment-chip">Bom trabalho!</span>
                    <span className="comment-chip">Valeu por compartilhar!</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        </div>
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="campaign-modal-overlay">
          <div className="campaign-modal-content">
            <div className="modal-header">
              <h2>Criar Nova Campanha</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body scrollable-y">
              <div className="form-group">
                <label>Nome da Campanha</label>
                <input type="text" placeholder="Ex: Aquece Verão ☀️" />
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
                    <div 
                      className="rich-textarea" 
                      contentEditable 
                      suppressContentEditableWarning={true}
                      placeholder="Descreva os detalhes da campanha, insira formatação e mídias..."
                      ref={richTextRef}
                    ></div>
                    
                    {/* Attachments Preview */}
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
                  <div className="criteria-table-header">
                    <div className="crit-col-qty">Qtd.</div>
                    <div className="crit-col-obj">Objetivo/Produto</div>
                    <div className="crit-col-rew">Recompensa por item</div>
                    <div className="crit-col-type">Tipo Recompensa</div>
                    <div className="crit-col-action"></div>
                  </div>
                  {criteriaList.map((crit) => (
                    <div className="criteria-table-row" key={crit.id}>
                      <div className="crit-col-qty">
                        <input type="number" value={crit.qty} min="1" onChange={(e) => updateCriteria(crit.id, 'qty', e.target.value)} />
                      </div>
                      <div className="crit-col-obj">
                        <input type="text" value={crit.objective} placeholder="Ex: Banda Larga / Fidelidade" onChange={(e) => updateCriteria(crit.id, 'objective', e.target.value)} />
                      </div>
                      <div className="crit-col-rew">
                        <input type="number" value={crit.reward} min="0" onChange={(e) => updateCriteria(crit.id, 'reward', e.target.value)} />
                      </div>
                      <div className="crit-col-type">
                        <select value={crit.rewardType} onChange={(e) => updateCriteria(crit.id, 'rewardType', e.target.value)}>
                          <option value="Cupom">Cupom</option>
                          <option value="Pontos">Pontos</option>
                          <option value="R$">R$</option>
                        </select>
                      </div>
                      <div className="crit-col-action">
                        <button type="button" className="icon-btn-subtle text-danger" onClick={() => removeCriteria(crit.id)} disabled={criteriaList.length === 1}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="add-criteria-btn" onClick={addCriteria}>
                    <Plus size={16} /> Adicionar novo critério
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Departamentos Participantes</label>
                <select>
                  <option value="Todos">Todos os Departamentos</option>
                  <option value="Time Hunter">Time Hunter</option>
                  <option value="Time Farm">Time Farm</option>
                  <option value="Time NOQ">Time NOQ</option>
                  <option value="Suporte ao Cliente">Suporte ao Cliente</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Backoffice">Backoffice</option>
                </select>
              </div>

              <div className="form-row-2">
                <div className="form-group half">
                  <label>
                    Tipo de Super Meta
                    <div className="optional-text-block">(opcional)</div>
                  </label>
                  <select>
                    <option value="">Nenhuma</option>
                    <option value="Global">Global</option>
                    <option value="Time">Time</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>
                    Super Meta
                    <div className="optional-text-block">(opcional)</div>
                  </label>
                  <div className="input-group-merged">
                    <input type="number" placeholder="Valor" />
                    <select className="unit-select">
                      <option value="R$">R$</option>
                      <option value="Pontos">Pontos</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group half">
                  <label>Início da Campanha</label>
                  <input type="date" />
                </div>
                <div className="form-group half">
                  <label className="label-inline-optional">
                    Final da Campanha
                    <span className="optional-text-inline">(opcional)</span>
                  </label>
                  <input type="date" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="btn-primary" onClick={() => setIsModalOpen(false)}>Publicar Campanha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
