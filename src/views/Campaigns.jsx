import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, Video, Mic, Radio, ChevronDown, 
  MessageSquare, Plus, CheckCircle, Trash2, StopCircle,
  Megaphone, ShoppingCart, Trophy, Gift,
  Pin, MoreVertical, Eye, Paperclip, X,
  Bold, Italic, Underline, List
} from 'lucide-react';
import './Campaigns.css';
import { campaignService } from '../services/campaignService';
import { marketplaceService } from '../services/marketplaceService';
import SaleModal from '../components/campaigns/SaleModal';
import CampaignFormModal from '../components/campaigns/CampaignFormModal';
import PostCard from '../components/campaigns/PostCard';

const Campaigns = ({ user, onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'gestor';
  
  // Modals States
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaignData, setEditingCampaignData] = useState(null);
  
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleCampaignId, setSaleCampaignId] = useState(null);
  const [saleCampaignCriteria, setSaleCampaignCriteria] = useState([]);

  // Audit Sales Modal State
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [pendingSales, setPendingSales] = useState([]);
  const [rejectingSaleId, setRejectingSaleId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [fetchedPosts, balance] = await Promise.all([
        campaignService.getCampaigns(user?.id),
        marketplaceService.getWalletBalance(user?.id)
      ]);
      setPosts(fetchedPosts);
      setWalletBalance(balance);
    } catch (e) {
      console.error("Erro ao carregar campanhas", e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const handleCreatePost = () => {
    setEditingCampaignData(null);
    setIsCampaignModalOpen(true);
  };

  const handleEditCampaign = (post) => {
    setEditingCampaignData(post);
    setIsCampaignModalOpen(true);
  };

  const handleAuditSalesClick = async () => {
    setLoadingAudit(true);
    setAuditModalOpen(true);
    try {
      const sales = await campaignService.getAllPendingSales();
      setPendingSales(sales);
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar vendas pendentes.');
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleApproveSale = async (sale) => {
    try {
      await campaignService.approveSale(sale);
      alert('Venda aprovada e pontos distribuídos!');
      setPendingSales(prev => prev.filter(s => s.id !== sale.id));
      loadData(false); // Atualiza o feed de campanhas
    } catch (error) {
      alert('Erro ao aprovar venda: ' + error.message);
    }
  };

  const handleRejectSaleSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('O motivo da reprovação é obrigatório.');
      return;
    }
    try {
      await campaignService.rejectSale(rejectingSaleId, rejectionReason);
      alert('Venda reprovada.');
      setPendingSales(prev => prev.filter(s => s.id !== rejectingSaleId));
      setRejectingSaleId(null);
      setRejectionReason('');
      loadData(false);
    } catch (error) {
      alert('Erro ao reprovar venda: ' + error.message);
    }
  };

  const handleSaveCampaign = async (id, campaignData) => {
    if (id) {
      await campaignService.updateCampaign(id, campaignData);
    } else {
      campaignData.progress_value = 0;
      await campaignService.createCampaign(campaignData);
    }
    setIsCampaignModalOpen(false);
    loadData();
  };

  const handleDeleteCampaign = async (postId) => {
    if (!window.confirm("Deseja realmente excluir esta campanha?")) return;
    try {
      await campaignService.deleteCampaign(postId);
      loadData(false);
    } catch (e) {
      alert("Erro ao excluir campanha: " + e.message);
    }
  };

  const handleSaleClick = (campaignId, criteria) => {
    setSaleCampaignId(campaignId);
    setSaleCampaignCriteria(criteria || []);
    setSaleModalOpen(true);
  };

  const handleSubmitSale = async (saleData) => {
    try {
      await campaignService.registerSale(
        saleData.campaignId,
        saleData.userId,
        saleData.userName,
        saleData.saleClient,
        saleData.saleCnpj,
        saleData.productName,
        saleData.quantity,
        saleData.saleValue,
        saleData.criteriaId
      );
      setSaleModalOpen(false);
      loadData(false);
    } catch (e) {
      alert("Erro ao registrar venda: " + e.message);
    }
  };



  const totalActive = posts.length;
  const totalSales = posts.reduce((acc, p) => acc + Number(p.progress_value || 0), 0);

  return (
    <div className="campaigns-container">
      <header className="campaigns-top-header">
        <div className="campaigns-title-group">
          <h1>
            <span className="hashtag">#</span> Comunidade TEC-B2
            <Trophy size={28} color="#6C63FF" /> 
            Campanhas de Vendas
          </h1>
          <p>Acompanhe metas, pontuações e engaje com o time.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdminOrManager && (
            <button className="btn-primary" style={{ background: 'var(--surface-light)', border: '1px solid var(--border-color)', color: 'white' }} onClick={handleAuditSalesClick}>
              <CheckCircle size={20} />
              Auditar Vendas
            </button>
          )}

          {isAdminOrManager && (
            <button className="btn-primary" onClick={handleCreatePost}>
              <Plus size={20} />
              Nova Campanha
            </button>
          )}
        </div>
      </header>

      <div className="campaigns-main-wrapper">
        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-icon bg-green">
              <Megaphone size={18} color="#00D4AA" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Campanhas Ativas</span>
              <span className="metric-value">{totalActive}</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon bg-purple">
              <ShoppingCart size={18} color="#b388ff" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Vendas em Campanhas</span>
              <span className="metric-value">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales)}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon bg-pink">
              <Trophy size={18} color="#ff4d6d" />
            </div>
            <div className="metric-info">
              <span className="metric-label">Sua Pontuação</span>
              <span className="metric-value">{walletBalance} pts</span>
            </div>
          </div>

          <button className="marketplace-btn" onClick={() => onNavigate && onNavigate('marketplace')}>
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
        <div className="filters-section">
          <h3>Feed de Campanhas</h3>
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

        {loading ? (
          <div className="empty-state">
             <h3>Carregando campanhas...</h3>
          </div>
        ) : posts.length === 0 ? (
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
              <PostCard 
                key={post.id}
                post={post}
                user={user}
                isAdminOrManager={isAdminOrManager}
                onTogglePin={async (id, pinned) => {
                  await campaignService.togglePin(id, pinned);
                  loadData(false);
                }}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaign}
                onSaleClick={handleSaleClick}
              />
            ))}
          </div>
        )}
        </div>
        <SaleModal 
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        campaignId={saleCampaignId}
        criteria={saleCampaignCriteria}
        user={user}
        onSubmit={handleSubmitSale}
      />

      <CampaignFormModal 
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        initialData={editingCampaignData}
        user={user}
        onSave={handleSaveCampaign}
      />
      </div>

      {auditModalOpen && (
        <div className="campaign-modal-overlay">
          <div className="campaign-modal-content" style={{maxWidth: '900px', width: '90%'}}>
            <div className="modal-header">
              <h2>Auditar Vendas Pendentes</h2>
              <button className="btn-close" onClick={() => setAuditModalOpen(false)}>×</button>
            </div>
            <div className="modal-body scrollable-y" style={{ maxHeight: '60vh' }}>
              {loadingAudit ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Buscando vendas...</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px 8px' }}>Campanha</th>
                      <th style={{ padding: '12px 8px' }}>Vendedor</th>
                      <th style={{ padding: '12px 8px' }}>Produto</th>
                      <th style={{ padding: '12px 8px' }}>Valor</th>
                      <th style={{ padding: '12px 8px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSales.length === 0 ? (
                      <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Tudo limpo! Nenhuma venda aguardando auditoria.</td></tr>
                    ) : (
                      pendingSales.map(sale => (
                        <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: '500' }}>{sale.campaigns?.title || 'Campanha Removida'}</td>
                          <td style={{ padding: '12px 8px' }}>{sale.user_name}</td>
                          <td style={{ padding: '12px 8px' }}>{sale.product_name} ({sale.quantity}x)</td>
                          <td style={{ padding: '12px 8px' }}>R$ {sale.sale_value}</td>
                          <td style={{ padding: '12px 8px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleApproveSale(sale)} style={{ background: 'rgba(0, 212, 170, 0.2)', color: '#00D4AA', border: '1px solid #00D4AA', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Aprovar</button>
                            <button onClick={() => setRejectingSaleId(sale.id)} style={{ background: 'rgba(255, 77, 109, 0.2)', color: '#FF4D6D', border: '1px solid #FF4D6D', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Reprovar</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {rejectingSaleId && (
        <div className="campaign-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="campaign-modal-content" style={{maxWidth: '400px'}}>
            <div className="modal-header">
              <h2>Motivo da Reprovação</h2>
              <button className="btn-close" onClick={() => setRejectingSaleId(null)}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                autoFocus
                rows="4"
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}
                placeholder="Ex: CNPJ não confere, venda cancelada, etc."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => setRejectingSaleId(null)}>Cancelar</button>
                <button className="btn-primary" style={{ background: '#FF4D6D' }} onClick={handleRejectSaleSubmit}>Reprovar Venda</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
