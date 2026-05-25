import { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav className={`app-sidebar ${isOpen ? '' : 'collapsed'}`}>
      
      <div className="sidebar-header">
        <h2 className="brand-title">🐉 <span className="nav-text">Mesa Virtual</span></h2>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)} title="Recolher menu">☰</button>
      </div>
      
      {/* Botão da Aba de Combate */}
      <div 
        className={`nav-item ${activeTab === 'combate' ? 'active' : ''}`} 
        onClick={() => setActiveTab('combate')} 
        title="Combate"
      >
        <span>⚔️</span><span className="nav-text">Combate</span>
      </div>
      
      {/* Botão da Aba de Ficha */}
      <div 
        className={`nav-item ${activeTab === 'ficha' ? 'active' : ''}`} 
        onClick={() => setActiveTab('ficha')} 
        title="Ficha" 
        style={{ marginTop: '10px' }}
      >
        <span>📋</span><span className="nav-text">Ficha</span>
      </div>
      
    </nav>
  );
}