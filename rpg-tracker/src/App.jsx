import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DicePanel from './components/DicePanel';
import Roster from './components/Roster';
import Combat from './components/Combat';
import CombatRoster from './components/CombatRoster';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('combate');
  const [combatants, setCombatants] = useState([]);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('rpg_roster');
    if (saved) setRoster(JSON.parse(saved));
  }, []);

  const saveRoster = (newRoster) => {
    setRoster(newRoster);
    localStorage.setItem('rpg_roster', JSON.stringify(newRoster));
  };

  const handleAddToCombat = (characterTemplate, initiativeValue) => {
    const initNum = parseInt(initiativeValue);
    if (isNaN(initNum)) return alert("⚠️ Digite um número válido para a iniciativa!");

    const newCombatant = {
      ...characterTemplate,
      instanceId: Date.now() + Math.random(),
      init: initNum,
      effects: []
    };
    setCombatants((prev) => [...prev, newCombatant].sort((a, b) => b.init - a.init));
  };

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        
        {activeTab === 'combate' && (
          <div style={{ display: 'flex', width: '100%', height: '100vh', padding: '20px', gap: '20px' }}>
            
            {/* Coluna Esquerda: Gavetas (DADOS + BANCO) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
              <DicePanel />
              <CombatRoster roster={roster} addToCombat={handleAddToCombat} />
            </div>

            {/* Coluna Direita: Combate (Fixo e com scroll próprio) */}
            <div style={{ width: '450px', flexShrink: 0, overflowY: 'auto' }}>
              <Combat combatants={combatants} setCombatants={setCombatants} />
            </div>

          </div>
        )}

        {activeTab === 'ficha' && (
          <div style={{ width: '100%', padding: '20px' }}>
            <Roster roster={roster} setRoster={saveRoster} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;