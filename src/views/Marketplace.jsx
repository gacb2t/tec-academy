import { useState, useEffect } from 'react';
import { marketplaceService } from '../services/marketplaceService';
import { Coins, Ticket, CircleDollarSign, Package, Plus, Edit2, Trash2, CheckCircle, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import './Marketplace.css';

const Marketplace = ({ user, onNavigate }) => {
  const isAdminOrRH = user?.role === 'admin' || user?.role === 'rh' || user?.role === 'gestor';
  
  const [activeTab, setActiveTab] = useState('loja');
  const [walletBalance, setWalletBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Admin Item Form
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ title: '', description: '', type: 'Produto', price: 0, is_recurring: false });

  // States for Redeeming
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [itemToRedeem, setItemToRedeem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const balance = await marketplaceService.getWalletBalance(user.id);
        setWalletBalance(balance);
      }

      const itemsData = await marketplaceService.getItems(isAdminOrRH);
      setItems(itemsData);

      const redemptionsData = await marketplaceService.getAllRedemptions();
      setRedemptions(redemptionsData);

    } catch (error) {
      console.error("Erro carregando marketplace:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handlers for Redemptions
  const handleRedeemClick = (item) => {
    setItemToRedeem(item);
    setRedeemModalOpen(true);
  };

  const confirmRedeem = async () => {
    if (!itemToRedeem) return;
    try {
      const newBalance = await marketplaceService.redeemItem(user.id, itemToRedeem.id, itemToRedeem.price);
      setWalletBalance(newBalance);
      alert('Resgate solicitado com sucesso! Acompanhe na aba Meus Resgates.');
      setRedeemModalOpen(false);
      loadData();
    } catch (error) {
      alert(error.message || 'Erro ao resgatar item.');
    }
  };

  const markAsDelivered = async (redemptionId) => {
    if (window.confirm("Deseja marcar este item como entregue/pago ao colaborador?")) {
      try {
        await marketplaceService.updateRedemptionStatus(redemptionId, 'delivered');
        loadData();
      } catch (error) {
        alert("Erro ao atualizar o status.");
      }
    }
  };

  // Handlers for Admin Items
  const handleOpenItemForm = (item = null) => {
    if (item) {
      setEditingItemId(item.id);
      setItemForm({ title: item.title, description: item.description, type: item.type, price: item.price, is_recurring: item.is_recurring || false });
    } else {
      setEditingItemId(null);
      setItemForm({ title: '', description: '', type: 'Produto', price: 0, is_recurring: false });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...itemForm, is_active: true };
      if (editingItemId) payload.id = editingItemId;
      
      await marketplaceService.saveItem(payload);
      setIsItemModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar item.');
    }
  };

  const handleToggleItem = async (item) => {
    try {
      await marketplaceService.toggleItemStatus(item.id, !item.is_active);
      loadData();
    } catch (error) {
      alert('Erro ao alterar status.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Tem certeza que deseja excluir este prêmio?")) {
      try {
        await marketplaceService.deleteItem(itemId);
        loadData();
      } catch (error) {
        alert("Erro ao excluir item.");
      }
    }
  };

  // Helper function to render correct icon based on type
  const renderItemIcon = (type, size = 48) => {
    switch (type) {
      case 'Cupom': return <Ticket size={size} color="#00D4AA" />;
      case 'R$': return <CircleDollarSign size={size} color="#00D4AA" />;
      case 'Produto': return <Package size={size} color="#FF4D6D" />;
      case 'Pontos': return <Coins size={size} color="#FFD166" />;
      default: return <Package size={size} color="#6C63FF" />;
    }
  };

  if (loading) {
    return <div className="loading-screen" style={{position:'static', height:'400px'}}>Carregando Marketplace...</div>;
  }

  const myRedemptions = redemptions.filter(r => r.user_id === user?.id);

  return (
    <div className="marketplace-container">
      {/* Header */}
      <div className="marketplace-header">
        <div className="marketplace-title-area">
          <h1>Marketplace de Prêmios</h1>
          <p>Troque seus pontos de campanhas por recompensas incríveis.</p>
        </div>
        <div className="wallet-card">
          <div className="wallet-icon">
            <Coins size={28} />
          </div>
          <div className="wallet-info">
            <span className="wallet-label">Seu Saldo</span>
            <span className="wallet-balance">{walletBalance} pts</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="marketplace-tabs">
        <button className={`tab-btn ${activeTab === 'loja' ? 'active' : ''}`} onClick={() => setActiveTab('loja')}>Loja</button>
        <button className={`tab-btn ${activeTab === 'meus-resgates' ? 'active' : ''}`} onClick={() => setActiveTab('meus-resgates')}>Meus Resgates</button>
        {isAdminOrRH && (
          <>
            <button className={`tab-btn ${activeTab === 'admin-loja' ? 'active' : ''}`} onClick={() => setActiveTab('admin-loja')}>Gerenciar Loja</button>
            <button className={`tab-btn ${activeTab === 'admin-resgates' ? 'active' : ''}`} onClick={() => setActiveTab('admin-resgates')}>Gestão de Resgates</button>
          </>
        )}
      </div>

      {/* LOJA - View for everyone */}
      {activeTab === 'loja' && (
        <div className="items-grid">
          {items.filter(i => i.is_active).length === 0 ? (
            <p style={{color: 'var(--text-secondary)'}}>Nenhum item disponível no momento.</p>
          ) : (
            items.filter(i => i.is_active).map(item => {
              const hasRedeemed = myRedemptions.some(r => r.item_id === item.id);
              const isDisabled = (walletBalance < item.price) || (!item.is_recurring && hasRedeemed);
              
              return (
              <div key={item.id} className="item-card">
                <div className="item-icon-area">
                  <span className={`item-type-badge type-${item.type.toLowerCase()}`}>{item.type}</span>
                  {renderItemIcon(item.type, 64)}
                </div>
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-desc">{item.description}</p>
                  <div className="item-footer">
                    <span className="item-price">
                      <Coins size={18} /> {item.price} pts
                    </span>
                    <button 
                      className="btn-redeem" 
                      onClick={() => handleRedeemClick(item)}
                      disabled={isDisabled}
                      style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                      {(!item.is_recurring && hasRedeemed) ? 'Já Resgatado' : 'Resgatar'}
                    </button>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      )}

      {/* MEUS RESGATES - History for the user */}
      {activeTab === 'meus-resgates' && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>Seu Histórico de Resgates</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Prêmio</th>
                  <th>Preço Pago</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myRedemptions.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign:'center', color:'var(--text-secondary)'}}>Você ainda não resgatou nenhum item.</td></tr>
                ) : (
                  myRedemptions.map(r => (
                    <tr key={r.id}>
                      <td>{r.marketplace_items?.title || 'Item Removido'}</td>
                      <td>{r.price_paid} pts</td>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status === 'delivered' ? 'Entregue' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN - Gerenciar Loja */}
      {activeTab === 'admin-loja' && isAdminOrRH && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>Itens Cadastrados no Marketplace</h3>
            <button className="btn-add" onClick={() => handleOpenItemForm()}>
              <Plus size={16} /> Adicionar Novo Prêmio
            </button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Prêmio</th>
                  <th>Tipo</th>
                  <th>Custo (Pts)</th>
                  <th>Recorrência</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign:'center'}}>Nenhum item cadastrado.</td></tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.type}</td>
                      <td>{item.price}</td>
                      <td>
                        <span className="status-badge" style={{background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)'}}>
                          {item.is_recurring ? 'Ilimitado' : 'Único (1x)'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${item.is_active ? 'active' : 'inactive'}`}>
                          {item.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon" title={item.is_active ? 'Desativar' : 'Ativar'} onClick={() => handleToggleItem(item)}>
                            <RefreshCw size={16} />
                          </button>
                          <button className="btn-icon" title="Editar" onClick={() => handleOpenItemForm(item)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-icon delete" title="Excluir" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN - Gestão de Resgates */}
      {activeTab === 'admin-resgates' && isAdminOrRH && (
        <div className="admin-panel">
          <div className="admin-header">
            <h3>Solicitações de Resgate Pendentes</h3>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Colaborador</th>
                  <th>Prêmio</th>
                  <th>Preço Pago</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhum resgate encontrado.</td></tr>
                ) : (
                  redemptions.map(r => (
                    <tr key={r.id}>
                      <td>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{display:'flex', flexDirection:'column'}}>
                          <strong>{r.user_profiles?.user_name}</strong>
                          <span style={{fontSize:'12px', color:'var(--text-secondary)'}}>{r.user_profiles?.department}</span>
                        </div>
                      </td>
                      <td>{r.marketplace_items?.title || 'Item Removido'}</td>
                      <td>{r.price_paid} pts</td>
                      <td>
                        <span className={`status-badge status-${r.status}`}>
                          {r.status === 'delivered' ? 'Entregue' : 'Pendente'}
                        </span>
                      </td>
                      <td>
                        {r.status === 'pending' && (
                          <button 
                            className="btn-redeem" 
                            style={{padding: '4px 12px', fontSize: '12px', display:'flex', gap:'6px', alignItems:'center'}}
                            onClick={() => markAsDelivered(r.id)}
                          >
                            <PackageCheck size={14} /> Dar Baixa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Confirmação de Resgate */}
      {redeemModalOpen && itemToRedeem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '400px'}}>
            <div className="modal-header">
              <h2>Confirmar Resgate</h2>
              <button className="btn-close" onClick={() => setRedeemModalOpen(false)}>×</button>
            </div>
            <div className="modal-body" style={{textAlign: 'center'}}>
              <div style={{margin: '24px 0'}}>
                {renderItemIcon(itemToRedeem.type, 48)}
              </div>
              <h3>{itemToRedeem.title}</h3>
              <p style={{color: 'var(--text-secondary)', margin: '8px 0 24px'}}>
                Você está prestes a gastar <strong>{itemToRedeem.price} pontos</strong> por este item.
              </p>
              
              <div style={{display:'flex', gap:'16px', justifyContent:'center'}}>
                <button className="btn-secondary" onClick={() => setRedeemModalOpen(false)}>Cancelar</button>
                <button className="btn-primary" onClick={confirmRedeem}>Confirmar Resgate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Admin Form (Add/Edit Item) */}
      {isItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h2>{editingItemId ? 'Editar Prêmio' : 'Novo Prêmio'}</h2>
              <button className="btn-close" onClick={() => setIsItemModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveItem} className="market-form">
                <div className="form-group">
                  <label>Título do Prêmio</label>
                  <input type="text" required value={itemForm.title} onChange={e => setItemForm({...itemForm, title: e.target.value})} placeholder="Ex: Voucher Ifood R$ 50, Copo Stanley" />
                </div>
                
                <div style={{display:'flex', gap:'16px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Tipo de Resgate</label>
                    <select required value={itemForm.is_recurring ? 'true' : 'false'} onChange={e => setItemForm({...itemForm, is_recurring: e.target.value === 'true'})}>
                      <option value="false">Unitário (1x por pessoa)</option>
                      <option value="true">Recorrente (Ilimitado)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Preço em Pontos</label>
                    <input type="number" min="0" required value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tipo (Ícone Opcional)</label>
                  <select required value={itemForm.type} onChange={e => setItemForm({...itemForm, type: e.target.value})}>
                    <option value="Produto">Produto Físico</option>
                    <option value="Cupom">Cupom Digital</option>
                    <option value="R$">Dinheiro (R$)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição e Regras</label>
                  <textarea rows="4" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} placeholder="Descreva como o prêmio será entregue, regras, etc."></textarea>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setIsItemModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary">Salvar Prêmio</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;
