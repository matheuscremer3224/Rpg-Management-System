import { useState } from 'react';

export default function CombatRoster({ roster, addToCombat }) {
  const [initInputs, setInitInputs] = useState({});
  // AQUI: O estado que controla a gaveta mora DENTRO do componente agora!
  const [isOpen, setIsOpen] = useState(true);

  const pcs = roster.filter(char => char.type === 'PC');
  const npcs = roster.filter(char => char.type === 'NPC');

  const handleInitChange = (charId, value) => {
    setInitInputs(prev => ({ ...prev, [charId]: value }));
  };

  const renderList = (title, list, icon) => (
    <div style={{ marginBottom: '25px' }}>
      <h4 style={{ color: '#ffcc00', borderBottom: '2px solid #3f3f5a', paddingBottom: '8px', margin: '0 0 15px 0' }}>
        {icon} {title}
      </h4>
      <ul className="list-container" style={{ marginTop: 0 }}>
        {list.length === 0 && <p style={{ fontSize: '13px', color: '#888', textAlign: 'center' }}>Nenhum cadastrado.</p>}

        {list.map((char) => (
          <li key={char.id} className="card roster-card" style={{ padding: '12px', textAlign: 'left' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px', alignItems: 'flex-start' }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', gap: '12px' }}>
                  <div style={{ flexShrink: 0 }}>
                    {char.avatar ? <img src={char.avatar} className="token-img" style={{width: '45px', height: '45px'}} /> : <div className="token-placeholder" style={{width: '45px', height: '45px', fontSize: '20px'}}>{icon}</div>}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <strong style={{fontSize: '15px', color: '#fff', textAlign: 'left'}}>{char.name}</strong>
                    {char.playerName && (
                      <span style={{ fontSize: '11px', color: '#888', textAlign: 'left'}}>Jog: {char.playerName}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start', width: '100%' }}>
                  <span style={{ fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {char.class || 'Sem Classe'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#111', fontWeight: 'bold', background: '#ffcc00', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                    Nv {char.level || 1}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexShrink: 0 }}>
                <input type="number" placeholder="Ini" className="init-input" style={{ width: '50px', padding: '6px' }} onChange={(e) => handleInitChange(char.id, e.target.value)} />
                <button className="btn-import" onClick={() => {
                  const val = initInputs[char.id];
                  if (!val) return alert("Digite a iniciativa!");
                  addToCombat(char, val);
                }} title="Adicionar ao Combate">➡️</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="import-drawer-container">
      {/* O painel em si recebe a classe 'closed' se não estiver aberto */}
      <aside className={`roster-panel import-content ${isOpen ? '' : 'closed'}`} style={{ margin: 0 }}>
        <h3 style={{ marginBottom: '20px' }}>📥 Importar para Combate</h3>
        {renderList('Jogadores', pcs, '🛡️')}
        {renderList('Monstros / NPCs', npcs, '👹')}
      </aside>
      
      {/* A orelha do caderno vertical */}
      <div className="tab-handle-left" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '◀ RECOLHER' : '📥 BANCO'}
      </div>
    </div>
  );
}