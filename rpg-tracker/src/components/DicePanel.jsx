import { useState } from 'react';
import DiceTray from './DiceTray'; 

export default function DicePanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [diceSum, setDiceSum] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [rollConfig, setRollConfig] = useState({ shape: 'd20', number: 20 });

  const clearSum = () => setDiceSum(0);

  const rollDice = (sides, shapeClass) => {
    if (isRolling) return; 

    setIsRolling(true); 
    const finalResult = Math.floor(Math.random() * sides) + 1;

    let rouletteCounter = 0;
    const intervalId = setInterval(() => {
      if (rouletteCounter < 10) {
        setRollConfig({
          shape: shapeClass,
          number: Math.floor(Math.random() * sides) + 1
        });
        rouletteCounter++;
      } else {
        clearInterval(intervalId);
        setRollConfig({ shape: shapeClass, number: finalResult });
        
        setTimeout(() => {
          setIsRolling(false); 
          setTimeout(() => {
            setDiceSum((prev) => prev + finalResult);
          }, 300);
        }, 1000); 
      }
    }, 150);
  };

  return (
    <>
      {/* DiceTray renderizado FORA da gaveta para não quebrar o layout */}
      <DiceTray isRolling={isRolling} rollConfig={rollConfig} />

      <div className="dice-drawer-container">
        
        <div className={`dice-content ${isOpen ? '' : 'closed'}`}>
          <div className="dice-panel" style={{ margin: 0, border: '1px solid #3f3f5a' }}>
            <div className="dice-row">
              <button className="dice-btn" onClick={() => rollDice(2, 'circle')}>
                <div className="dice-texture circle"></div><span className="dice-number-static">2</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(4, 'd4')}>
                <div className="dice-texture dice-shape d4"></div><span className="dice-number-static" style={{ top: '60%' }}>4</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(6, 'd6')}>
                <div className="dice-texture dice-shape d6"></div><span className="dice-number-static">6</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(8, 'd8')}>
                <div className="dice-texture dice-shape d8"></div><span className="dice-number-static">8</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(10, 'd10')}>
                <div className="dice-texture dice-shape d10"></div><span className="dice-number-static">10</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(12, 'd12')}>
                <div className="dice-texture dice-shape d12"></div><span className="dice-number-static">12</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(20, 'd20')}>
                <div className="dice-texture dice-shape d20"></div><span className="dice-number-static">20</span>
              </button>
              <button className="dice-btn" onClick={() => rollDice(100, 'circle')}>
                <div className="dice-texture circle"></div><span className="dice-number-static">100</span>
              </button>
            </div>

            <div className="dice-result-area">
              <span>Soma Total:</span>
              <input type="number" value={diceSum} readOnly />
              <button className="btn-clear-dice" onClick={clearSum}>Zerar 🔄</button>
            </div>
          </div>
        </div>

        {/* Orelha de puxar posicionada exatamente como a do Banco */}
        <div className="tab-handle-left" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '◀ DADOS' : '🎲 DADOS'}
        </div>

      </div>
    </>
  );
}