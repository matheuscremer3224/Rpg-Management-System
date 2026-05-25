export default function DiceTray({ isRolling, rollConfig }) {
  // Se o estado isRolling for falso, esse componente não renderiza nada na tela!
  if (!isRolling) return null; 

  const { shape, number } = rollConfig;

  // Lógica para decidir qual classe CSS de forma geométrica aplicar
  const shapeClassName = shape === 'circle' ? 'circle' : `dice-shape ${shape}`;
  
  // Lógica para centralizar números em formas complexas
  let numberAlignmentClass = '';
  if (shape === 'd4') numberAlignmentClass = 'shape-d4-num';
  if (shape === 'd12') numberAlignmentClass = 'shape-d12-num';

  return (
    <div className="dice-overlay">
      <div className="dice-tray">
        <div className="dice-visual">
          <div className={`dice-visual-texture ${shapeClassName}`}></div>
          <span className={`dice-number ${numberAlignmentClass}`}>
            {number}
          </span>
        </div>
      </div>
    </div>
  );
}