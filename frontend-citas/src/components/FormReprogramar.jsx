import React, { useState } from 'react';

export const FormReprogramar = ({ id, onConfirm, onCancel }) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fecha || !hora || !motivo) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onConfirm(id, fecha, hora, motivo);
  };

  return (
    <form onSubmit={handleSubmit} style={boxStyle}>
      <h5>Reprogramar Horario</h5>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} />
      <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={inputStyle} />
      <input type="text" placeholder="Motivo" value={motivo} onChange={e => setMotivo(e.target.value)} style={inputStyle} />
      <div style={{ display: 'flex', gap: '5px' }}>
        <button type="submit" style={{ ...btnStyle, backgroundColor: '#d35400' }}>Confirmar</button>
        <button type="button" onClick={onCancel} style={{ ...btnStyle, backgroundColor: '#95a5a6' }}>Cancelar</button>
      </div>
    </form>
  );
};

const boxStyle = { marginTop: '10px', padding: '10px', background: '#f9f9f9', border: '1px solid #f39c12', borderRadius: '5px' };
const inputStyle = { display: 'block', margin: '5px 0', padding: '5px', width: '90%' };
const btnStyle = { color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' };