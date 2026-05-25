import { useState } from 'react';

export default function Combat({ combatants, setCombatants }) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [resourceInputs, setResourceInputs] = useState({});
  const [effectInputs, setEffectInputs] = useState({});

  const handleNextTurn = () => {
    if (combatants.length === 0) return;
    
    setCombatants(prev => prev.map((char, index) => {
      if (index === currentTurnIndex) {
        const updatedEffects = (char.effects || [])
          .map(eff => ({ ...eff, turns: eff.turns - 1 }))
          .filter(eff => eff.turns > 0);
        return { ...char, effects: updatedEffects };
      }
      return char;
    }));

    setCurrentTurnIndex((prev) => (prev + 1) % combatants.length);
  };

  const handleReset = () => {
    if(confirm("Zerar combate? Todos os personagens serão removidos.")) {
      setCombatants([]);
      setCurrentTurnIndex(0);
    }
  };

  const removeCombatant = (instanceId) => {
    setCombatants(prev => prev.filter(c => c.instanceId !== instanceId));
  };

  const updateResource = (instanceId, stat, value) => {
    const numValue = parseInt(value); 
    if (isNaN(numValue)) return; 

    setCombatants(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const currentValue = parseInt(c[stat]) || 0; 
        return { ...c, [stat]: currentValue + numValue }; 
      }
      return c;
    }));

    setResourceInputs(prev => ({
      ...prev,
      [instanceId]: { ...prev[instanceId], [stat]: '' }
    }));
  };

  const addEffect = (instanceId, type) => {
    const effect = effectInputs[instanceId];
    if (!effect || !effect.name || !effect.turns) return alert("Preencha o nome e a quantidade de turnos do efeito.");
    
    setCombatants(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const currentEffects = c.effects || [];
        return {
          ...c,
          effects: [...currentEffects, { name: effect.name, turns: parseInt(effect.turns), type }]
        };
      }
      return c;
    }));
    
    setEffectInputs(prev => ({ ...prev, [instanceId]: { name: '', turns: '' } }));
  };

  const removeEffect = (instanceId, effectIndex) => {
    setCombatants(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const newEffects = [...(c.effects || [])];
        newEffects.splice(effectIndex, 1);
        return { ...c, effects: newEffects };
      }
      return c;
    }));
  };

  return (
    <section className="combat-area" style={{ flex: '1.5', minWidth: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>🔥 Combate Ativo</h3>
        <h2 style={{ color: '#ffcc00', margin: 0 }}>
          Rodada: {combatants.length > 0 ? Math.floor(currentTurnIndex / combatants.length) + 1 : 1}
        </h2>
      </div>

      {/* AQUI CORRIGIMOS O LAYOUT DOS BOTÕES DE TURNO */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn-turn" onClick={handleNextTurn}>Próximo Turno ➡️</button>
        <button className="btn-danger" onClick={handleReset} style={{ padding: '10px 15px' }}>Resetar 🔄</button>
      </div>

      <ul className="list-container">
        {combatants.map((char, index) => {
          const isActive = index === currentTurnIndex ? 'active-turn' : '';
          const resInput = resourceInputs[char.instanceId] || { pv: '', pe: '' };
          const effInput = effectInputs[char.instanceId] || { name: '', turns: '' };

          return (
            <li key={char.instanceId} className={`card ${isActive}`} style={{ position: 'relative' }}>
              
              <button 
                onClick={() => removeCombatant(char.instanceId)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '16px' }}
                title="Remover do combate"
              >✖</button>

              <div className="card-header" style={{ marginBottom: '10px' }}>
                {char.avatar ? <img src={char.avatar} className="token-img" /> : <div className="token-placeholder">{char.type === 'NPC' ? '👹' : '🛡️'}</div>}
                <div>
                  <strong>{char.name}</strong> <span style={{ color: '#ffcc00' }}>Ini: {char.init}</span><br />
                  <span className="info-text">📜 {char.charClass || '-'} (Nv {char.level || 1}) | 🛡️ CA: {char.armor || '-'} | 🏃 Mov: {char.move || '-'}</span>
                </div>
              </div>

              <div className="action-group">
                <span className="stat-display pv-color">PV: {char.pv}</span>
                <input 
                  type="number" 
                  placeholder="-5 / 5" 
                  style={{ width: '60px' }} 
                  value={resInput.pv}
                  onChange={(e) => setResourceInputs(prev => ({ ...prev, [char.instanceId]: { ...prev[char.instanceId], pv: e.target.value } }))}
                />
                {/* AQUI APLICAMOS A NOVA CLASSE NO BOTÃO OK */}
                <button className="btn-ok" onClick={() => updateResource(char.instanceId, 'pv', resInput.pv)}>Ok</button>

                <span className="stat-display pe-color" style={{ marginLeft: '15px' }}>PE: {char.pe}</span>
                <input 
                  type="number" 
                  placeholder="-5 / 5" 
                  style={{ width: '60px' }} 
                  value={resInput.pe}
                  onChange={(e) => setResourceInputs(prev => ({ ...prev, [char.instanceId]: { ...prev[char.instanceId], pe: e.target.value } }))}
                />
                {/* AQUI TAMBÉM */}
                <button className="btn-ok" onClick={() => updateResource(char.instanceId, 'pe', resInput.pe)}>Ok</button>
              </div>

              <div className="action-group" style={{ marginTop: '5px' }}>
                <input 
                  type="text" 
                  placeholder="Nome do Efeito" 
                  style={{ flex: 1 }} 
                  value={effInput.name}
                  onChange={(e) => setEffectInputs(prev => ({ ...prev, [char.instanceId]: { ...prev[char.instanceId], name: e.target.value } }))}
                />
                <input 
                  type="number" 
                  placeholder="Turnos" 
                  style={{ width: '70px' }} 
                  value={effInput.turns}
                  onChange={(e) => setEffectInputs(prev => ({ ...prev, [char.instanceId]: { ...prev[char.instanceId], turns: e.target.value } }))}
                />
                <button className="btn-pos" onClick={() => addEffect(char.instanceId, 'positive')}>+ Positivo</button>
                <button className="btn-neg" onClick={() => addEffect(char.instanceId, 'negative')}>- Negativo</button>
              </div>

              {char.effects && char.effects.length > 0 && (
                <div className="effects">
                  {char.effects.map((eff, i) => (
                    <div key={i} className={`effect-badge ${eff.type}`}>
                      {eff.name} ({eff.turns} turnos)
                      <span onClick={() => removeEffect(char.instanceId, i)}>✖</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}