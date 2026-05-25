import { useState } from 'react';

export default function Roster({ roster, setRoster }) {
  const [editId, setEditId] = useState(null);
  
  const initialForm = { 
    name: '', playerName: '', occupation: '', 
    class: '', level: '', armor: '', move: '', pv: '', pe: '', 
    str: '', dex: '', wis: '', cha: '', 
    type: 'PC', avatar: '' 
  };
  
  const [form, setForm] = useState(initialForm);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const SIZE = 150;
        canvas.width = SIZE; canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        const scale = Math.max(SIZE / img.width, SIZE / img.height);
        const x = (SIZE - img.width * scale) / 2;
        const y = (SIZE - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setForm((prev) => ({ ...prev, avatar: canvas.toDataURL('image/jpeg', 0.8) }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name) return alert("Preencha pelo menos o Nome do Personagem!");
    let updatedRoster = editId 
      ? roster.map(c => c.id === editId ? { ...form, id: editId } : c) 
      : [...roster, { ...form, id: Date.now() }];
    
    setRoster(updatedRoster); 
    handleCancel();
  };

  const handleEdit = (char) => { setEditId(char.id); setForm(char); };
  const handleDelete = (id) => confirm("Excluir ficha?") && setRoster(roster.filter(c => c.id !== id));
  const handleCancel = () => { setEditId(null); setForm(initialForm); };

  const attrStyle = { flex: 1, background: '#1e1e2f', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #3f3f5a' };
  const attrLabelStyle = { fontSize: '10px', color: '#ffcc00', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' };
  const attrInputStyle = { width: '100%', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', background: 'transparent', border: 'none', color: 'white', marginTop: '5px' };

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', width: '100%', padding: '10px' }}>
      
      {/* COLUNA ESQUERDA: FORMULÁRIO */}
      <aside className="roster-panel" style={{ flex: '1', minWidth: '380px', margin: 0, position: 'sticky', top: '20px' }}>
        <h3>{editId ? '📝 Editando Ficha' : '📋 Nova Ficha'}</h3>
        
        <div className="avatar-picker" onClick={() => document.getElementById('avatarInput').click()}>
          {form.avatar ? <img src={form.avatar} alt="Avatar" /> : <div className="avatar-placeholder">📸</div>}
          <div className="avatar-overlay">Alterar</div>
        </div>
        <input type="file" id="avatarInput" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

        <div className="inline-inputs">
          <input type="text" id="name" placeholder="Nome do Personagem" value={form.name} onChange={handleInputChange} />
          <input type="text" id="playerName" placeholder="Nome do Jogador" value={form.playerName} onChange={handleInputChange} />
        </div>
        <input type="text" id="occupation" placeholder="Ocupação / Histórico" value={form.occupation} onChange={handleInputChange} />

        <div className="inline-inputs">
          <input type="text" id="class" placeholder="Classe" value={form.class} onChange={handleInputChange} />
          <input type="number" id="level" placeholder="Nível" value={form.level} onChange={handleInputChange} />
        </div>

        <div className="inline-inputs">
          <input type="number" id="armor" placeholder="CA" value={form.armor} onChange={handleInputChange} />
          <input type="text" id="move" placeholder="Mov" value={form.move} onChange={handleInputChange} />
          <input type="number" id="pv" placeholder="PV" value={form.pv} onChange={handleInputChange} />
          <input type="number" id="pe" placeholder="PE" value={form.pe} onChange={handleInputChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
          <div style={attrStyle}>
            <span style={attrLabelStyle}>Força</span>
            <input type="number" id="str" value={form.str} onChange={handleInputChange} style={attrInputStyle} />
          </div>
          <div style={attrStyle}>
            <span style={attrLabelStyle}>Destreza</span>
            <input type="number" id="dex" value={form.dex} onChange={handleInputChange} style={attrInputStyle} />
          </div>
          <div style={attrStyle}>
            <span style={attrLabelStyle}>Sabedoria</span>
            <input type="number" id="wis" value={form.wis} onChange={handleInputChange} style={attrInputStyle} />
          </div>
          <div style={attrStyle}>
            <span style={attrLabelStyle}>Carisma</span>
            <input type="number" id="cha" value={form.cha} onChange={handleInputChange} style={attrInputStyle} />
          </div>
        </div>

        <select id="type" value={form.type} onChange={handleInputChange} style={{ marginTop: '15px' }}>
          <option value="PC">Personagem Jogador (PC)</option>
          <option value="NPC">Monstro / NPC</option>
        </select>

        <button className="btn-save" onClick={handleSave} style={{ marginTop: '10px' }}>
          {editId ? '💾 Atualizar Personagem' : '💾 Salvar no Banco'}
        </button>
        {editId && <button className="btn-cancel" onClick={handleCancel}>❌ Cancelar</button>}
      </aside>

      {/* COLUNA DIREITA: FICHAS SALVAS (AGORA COM GRID BLINDADO) */}
      <section style={{ flex: '2.5', width: '100%' }}>
        <h3 style={{ textAlign: 'left', fontSize: '18px', color: '#ffcc00', margin: '0 0 15px 0' }}>🗄️ Fichas Salvas</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          {roster.map((char) => (
            
            <div key={char.id} className="card" style={{ 
              margin: 0, 
              padding: '15px', 
              borderLeft: char.type === 'NPC' ? '5px solid #ff4d4d' : '5px solid #ffcc00', 
              /* MÁGICA DO GRID AQUI: 3 colunas (Imagem, Textos, Botões), 2 linhas */
              display: 'grid', 
              gridTemplateColumns: '55px 1fr auto', 
              gridTemplateRows: 'auto auto', 
              columnGap: '15px', 
              rowGap: '12px',
              textAlign: 'left' // Força o texto para a esquerda sobrepondo qualquer classe
            }}>
              
              {/* 1. IMAGEM: Coluna 1, Linha 1 (Canto Superior Esquerdo absoluto) */}
              <div style={{ gridColumn: '1', gridRow: '1', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                {char.avatar ? <img src={char.avatar} className="token-img" style={{ width: '55px', height: '55px' }} /> : <div className="token-placeholder" style={{ width: '55px', height: '55px', fontSize: '26px' }}>{char.type === 'NPC' ? '👹' : '🛡️'}</div>}
              </div>

              {/* 2. NOMES: Coluna 2, Linha 1 (Logo após a imagem) */}
              <div style={{ gridColumn: '2', gridRow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <strong style={{ fontSize: '18px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {char.name}
                </strong>
                {char.playerName && (
                  <span style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Jogador: {char.playerName}
                  </span>
                )}
              </div>

              {/* 3. CLASSE E NÍVEL: Colunas 1 e 2, Linha 2 (Abaixo da imagem e dos nomes) */}
              <div style={{ gridColumn: '1 / span 2', gridRow: '2', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {char.class || 'Sem Classe'}
                </span>
                <span style={{ fontSize: '12px', color: '#111', fontWeight: 'bold', background: '#ffcc00', padding: '3px 8px', borderRadius: '6px' }}>
                  Nv {char.level || 1}
                </span>
              </div>

              {/* 4. BOTÕES: Coluna 3, atravessa as duas linhas no canto direito */}
              <div style={{ gridColumn: '3', gridRow: '1 / span 2', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <button className="btn-standard" onClick={() => handleEdit(char)} style={{ padding: '8px 12px', fontSize: '14px' }}>✏️</button>
                <button className="btn-danger" onClick={() => handleDelete(char.id)} style={{ padding: '8px 12px', fontSize: '14px' }}>🗑️</button>
              </div>

            </div>
          ))}

          {roster.length === 0 && <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>Nenhuma ficha criada ainda.</p>}
        </div>
      </section>

    </div>
  );
}