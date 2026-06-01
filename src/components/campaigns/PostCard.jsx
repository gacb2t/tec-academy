import React, { useState } from 'react';
import { MessageSquare, Eye, Pin, MoreVertical } from 'lucide-react';
import { campaignService } from '../../services/campaignService';

const PostCard = ({ 
  post, 
  user, 
  isAdminOrManager, 
  onTogglePin, 
  onEdit, 
  onDelete, 
  onSaleClick 
}) => {
  const [commentText, setCommentText] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  
  // Local state for optimistic updates
  const [likes, setLikes] = useState((post.campaign_interactions || []).filter(i => i.interaction_type === 'like').length);
  const [claps, setClaps] = useState((post.campaign_interactions || []).filter(i => i.interaction_type === 'clap').length);
  const [userLiked, setUserLiked] = useState((post.campaign_interactions || []).some(i => i.interaction_type === 'like' && i.user_id === user?.id));
  const [userClapped, setUserClapped] = useState((post.campaign_interactions || []).some(i => i.interaction_type === 'clap' && i.user_id === user?.id));
  const [comments, setComments] = useState(post.campaign_comments || []);

  const dateObj = new Date(post.created_at);
  const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' às ' + dateObj.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});

  const today = new Date();
  today.setHours(0,0,0,0);
  let isActiveCampaign = true;
  let dateStatusText = '';
  
  if (post.start_date && new Date(post.start_date + 'T00:00:00') > today) {
    isActiveCampaign = false;
    dateStatusText = `Inicia em ${new Date(post.start_date + 'T00:00:00').toLocaleDateString('pt-BR')}`;
  } else if (post.end_date && new Date(post.end_date + 'T23:59:59') < today) {
    isActiveCampaign = false;
    dateStatusText = `Encerrada em ${new Date(post.end_date + 'T23:59:59').toLocaleDateString('pt-BR')}`;
  } else if (post.end_date) {
    dateStatusText = `Válida até ${new Date(post.end_date + 'T23:59:59').toLocaleDateString('pt-BR')}`;
  } else {
    dateStatusText = 'Campanha Ativa';
  }

  const hasSuperGoal = post.super_goal_value && Number(post.super_goal_value) > 0;
  
  let progVal = Number(post.progress_value || 0);
  const isUnit = post.super_goal_unit === 'Unidades';
  
  if (hasSuperGoal && post.super_goal_type === 'Individual' && post.campaign_sales) {
      progVal = post.campaign_sales
          .filter(s => s.status === 'approved' && s.user_id === user?.id)
          .reduce((acc, s) => acc + (isUnit ? Number(s.quantity) : Number(s.sale_value)), 0);
  }

  const targetVal = Number(post.super_goal_value || 0);
  const progressPercent = hasSuperGoal ? Math.min(100, Math.round((progVal / targetVal) * 100)) : 0;
  
  const fmtProg = isUnit ? `${progVal} Unid.` : new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(progVal);
  const fmtTarget = isUnit ? `${targetVal} Unid.` : new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(targetVal);

  const hasSuperReward = post.super_goal_reward && Number(post.super_goal_reward) > 0;
  const superRewardFmt = post.super_goal_reward_type === 'R$' 
    ? new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(post.super_goal_reward)
    : `${post.super_goal_reward} ${post.super_goal_reward_type || 'Pontos'}`;

  const handleInteract = async (type) => {
    // Optimistic UI
    if (type === 'like') {
      setUserLiked(!userLiked);
      setLikes(prev => userLiked ? prev - 1 : prev + 1);
    } else {
      setUserClapped(!userClapped);
      setClaps(prev => userClapped ? prev - 1 : prev + 1);
    }

    try {
      await campaignService.interact(post.id, user?.id, type);
    } catch (e) {
      console.error(e);
      // Revert on error
      if (type === 'like') {
        setUserLiked(userLiked);
        setLikes(prev => userLiked ? prev + 1 : prev - 1);
      } else {
        setUserClapped(userClapped);
        setClaps(prev => userClapped ? prev + 1 : prev - 1);
      }
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    const optimisticComment = {
      id: Date.now(), // temporary id
      user_name: user?.name || user?.fullName || 'Usuário',
      comment: commentText,
      likes: []
    };
    setComments(prev => [...prev, optimisticComment]);
    setCommentText('');

    try {
      const realComment = await campaignService.addComment(post.id, user?.id, user?.name || user?.fullName || 'Usuário', optimisticComment.comment);
      setComments(prev => prev.map(c => c.id === optimisticComment.id ? realComment : c));
    } catch (e) {
      alert("Erro ao comentar: " + e.message);
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
    }
  };

  const handleLikeComment = async (commentId, currentLikes) => {
    const hasLiked = currentLikes.includes(user?.id);
    const newLikes = hasLiked 
      ? currentLikes.filter(id => id !== user?.id) 
      : [...currentLikes, user?.id];
    
    // Optimistic update
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: newLikes } : c));

    try {
      await campaignService.likeComment(commentId, user?.id, currentLikes);
    } catch (e) {
      console.error(e);
      // Revert on error
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: currentLikes } : c));
    }
  };

  return (
    <div className="post-card-v2">
      <div className="post-header-v2">
        <div className="post-author-group">
          <div className="user-avatar-small">
            {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="post-meta">
            <span className="post-author">{post.author_name}</span>
            <span className="post-time">{formattedDate}</span>
          </div>
        </div>
        <div className="post-header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', background: isActiveCampaign ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 77, 109, 0.1)', color: isActiveCampaign ? '#00D4AA' : '#FF4D6D', fontWeight: 'bold' }}>
            {dateStatusText}
          </span>
          {isAdminOrManager && (
            <>
              <button className={`icon-btn-subtle ${post.is_pinned ? 'text-primary' : ''}`} onClick={() => onTogglePin(post.id, post.is_pinned)} title={post.is_pinned ? "Desfixar" : "Fixar"}>
                <Pin size={18} fill={post.is_pinned ? "currentColor" : "none"} />
              </button>
              <button className="icon-btn-subtle" onClick={() => setOpenMenu(!openMenu)}>
                <MoreVertical size={18} />
              </button>
              {openMenu && (
                <div className="post-action-dropdown">
                  <button onClick={() => { setOpenMenu(false); onEdit(post); }}>Editar Campanha</button>
                  <button onClick={() => { setOpenMenu(false); onDelete(post.id); }} className="text-danger">Excluir Campanha</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="post-body-v2">
        <h4 className="post-title">{post.title}</h4>
        <div className="post-html-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        
        <div className="campaign-progress-list">
          {hasSuperGoal && (
            <div className="campaign-progress-box">
              <div className="progress-texts" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="progress-status">Meta {post.super_goal_type || 'Global'}: {progressPercent}% atingida - {fmtProg} / {fmtTarget}</span>
                  <div className="medal-icon">🏆</div>
                </div>
                {post.super_goal_objective && (
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Objetivo: {post.super_goal_objective}</span>
                )}
                {hasSuperReward && (
                  <span style={{ fontSize: '12px', color: '#00D4AA', fontWeight: 'bold' }}>
                    Prêmio da Super Meta: {superRewardFmt}
                  </span>
                )}
              </div>
              <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          )}

          {post.criteria && post.criteria.length > 0 && post.criteria.map((crit, idx) => {
              const targetQty = Number(crit.qty) || 1;
              let currentQty = 0;
              if (post.campaign_sales && post.campaign_sales.length > 0) {
                currentQty = post.campaign_sales.reduce((acc, sale) => {
                    if (sale.status !== 'approved') return acc;
                    const obj = crit.objective || '';
                    if (sale.criteria_id === String(crit.id) || (!sale.criteria_id && (!obj || obj.trim() === '' || (sale.product_name || '').toLowerCase().includes(obj.toLowerCase())))) {
                      return acc + (Number(sale.quantity) || 1);
                    }
                    return acc;
                }, 0);
              }

              if (crit.criteriaType === 'Única') {
                const critProgress = Math.min(100, Math.round((currentQty / targetQty) * 100));
                return (
                  <div className="campaign-progress-box" key={idx} style={{ marginTop: '12px' }}>
                    <div className="progress-texts">
                      <span className="progress-status" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Produto (Única): {crit.objective || 'Venda Geral'} ({critProgress}%) - {currentQty} / {targetQty} vendidas
                      </span>
                      {Number(crit.reward) > 0 && <span style={{fontSize: '12px', color: '#00D4AA'}}>Prêmio: {crit.reward} pts</span>}
                    </div>
                    <div className="progress-bar-bg" style={{ height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${critProgress}%`, backgroundColor: 'var(--accent)' }}></div>
                    </div>
                  </div>
                );
              }

              // Recorrente
              const rewardsEarned = Math.floor(currentQty / targetQty);

              return (
                <div className="campaign-progress-box" key={idx} style={{ marginTop: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div className="progress-texts" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="progress-status" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Produto (Recorrente): {crit.objective || 'Venda Geral'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {currentQty} {currentQty === 1 ? 'venda validada' : 'vendas validadas'}
                        {Number(crit.reward) > 0 && ` • ${rewardsEarned} ${rewardsEarned === 1 ? 'prêmio' : 'prêmios'} (a cada ${targetQty})`}
                      </span>
                    </div>
                    <div className="medal-icon" style={{ fontSize: '16px', background: 'rgba(0, 212, 170, 0.1)', padding: '6px', borderRadius: '50%' }}>🎯</div>
                  </div>
                </div>
              );
          })}
        </div>
      </div>

      <div className="post-footer-v2">
        <div className="post-views">
          <Eye size={16} /> <span>{likes + claps + comments.length} Engajamentos</span>
        </div>
        
        <div className="post-reactions">
          <div className={`reaction-chip ${userLiked ? 'active-reaction' : ''}`} onClick={() => handleInteract('like')} style={{cursor: 'pointer'}}>
            ❤️ {likes}
          </div>
          <div className={`reaction-chip ${userClapped ? 'active-reaction' : ''}`} onClick={() => handleInteract('clap')} style={{cursor: 'pointer'}}>
            <MessageSquare size={16} /> {comments.length}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {isActiveCampaign && (
              <button className="btn-primary" onClick={() => onSaleClick(post.id, post.criteria)}>
                Registrar Venda
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="post-comment-section">
        <div className="comment-input-row">
          <div className="user-avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="comment-input-wrapper" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <input 
              type="text" 
              placeholder={`Deixe um comentário...`} 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleComment() }}
              style={{flex: 1}}
            />
            <button className="btn-primary" style={{padding: '6px 12px', minWidth: 'auto', fontSize: '13px'}} onClick={handleComment}>Enviar</button>
          </div>
        </div>
        
        {comments && comments.length > 0 && (
          <div className="comments-list" style={{marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {comments.map(c => {
              const commentLikes = c.likes || [];
              const userLikedComment = commentLikes.includes(user?.id);
              return (
                <div key={c.id} style={{fontSize: '13px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <strong>{c.user_name}:</strong> {c.comment}
                  </div>
                  <button 
                    className={`icon-btn-subtle ${userLikedComment ? 'text-danger' : ''}`} 
                    style={{ padding: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                    onClick={() => handleLikeComment(c.id, commentLikes)}
                  >
                    {userLikedComment ? '❤️' : '🤍'} {commentLikes.length > 0 ? commentLikes.length : ''}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PostCard);
