import React, { useState } from 'react';
import { X } from 'lucide-react';

const SaleModal = ({ isOpen, onClose, campaignId, criteria, user, onSubmit }) => {
  const [saleClient, setSaleClient] = useState('');
  const [saleCnpj, setSaleCnpj] = useState('');
  const [saleProduct, setSaleProduct] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [saleValue, setSaleValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!saleClient || !saleCnpj || !saleProduct || !saleValue || !saleQuantity) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const selectedCrit = criteria.find(c => String(c.id) === saleProduct);
    const productName = selectedCrit ? selectedCrit.objective : saleProduct;
    
    onSubmit({
      campaignId,
      userId: user?.id,
      userName: user?.name || user?.fullName || 'Usuário',
      saleClient,
      saleCnpj,
      productName,
      quantity: Number(saleQuantity),
      saleValue: Number(saleValue),
      criteriaId: selectedCrit ? selectedCrit.id : null
    });
  };

  return (
    <div className="campaign-modal-overlay" style={{zIndex: 9999}}>
      <div className="campaign-modal-content" style={{maxWidth: '400px'}}>
        <div className="modal-header">
          <h2>Registrar Venda</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>ID da Venda</label>
            <input type="text" value={saleClient} onChange={(e) => setSaleClient(e.target.value)} placeholder="Ex: VD-12345" />
          </div>
          <div className="form-group">
            <label>CNPJ do Cliente</label>
            <input type="text" value={saleCnpj} onChange={(e) => setSaleCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
          </div>
          <div className="form-group">
            <label>Produto Vendido</label>
            <select value={saleProduct} onChange={(e) => setSaleProduct(e.target.value)}>
              <option value="">Selecione um produto/objetivo...</option>
              {criteria && criteria.map((crit, idx) => (
                <option key={idx} value={crit.id}>{crit.objective || 'Venda Geral'}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantidade</label>
            <input type="number" min="1" value={saleQuantity} onChange={(e) => setSaleQuantity(e.target.value)} placeholder="Ex: 1" />
          </div>
          <div className="form-group">
            <label>Valor Total (R$)</label>
            <input type="number" value={saleValue} onChange={(e) => setSaleValue(e.target.value)} placeholder="Ex: 1500" />
          </div>
          <p style={{fontSize: '12px', color: 'var(--text-secondary)'}}>O valor e quantidade serão computados para meta e carteira de prêmios após a auditoria.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>Salvar Registro</button>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;
