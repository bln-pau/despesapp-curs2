import { useState } from 'react';
import './DespesaForm.css'

export default function DespesaForm({ afegirDespesa, participants }) {

  const [concepte, setConcepte] = useState("");
  const [quantia, setQuantia] = useState("");
  const [pagatPer, setPagatPer] = useState("");

  const resetForm = () => {
    setConcepte("");
    setQuantia("");
    setPagatPer("");
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const despesa = {
      concepte: concepte,
      quantia: quantia,
      pagatPer: pagatPer,
    }

    afegirDespesa(despesa);
    resetForm();
  };

  return (
    <form className='despesa-form' onSubmit={handleSubmit}>
        <label>
            <span>Concepte</span>
            <input type="text" onChange={(e) => setConcepte(e.target.value)} value={concepte} />
        </label>
        <label>
            <span>Quantia</span>
            <input type="text" onChange={(e) => setQuantia(e.target.value)} value={quantia} />
        </label>
        <label>
            <span>Pagat per</span>
            <select onChange={(e) => {setPagatPer(e.target.value)}}>
              <option value="">-- Selecciona qui ha pagat --</option>
              {participants.map((p, i) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
        </label>
        <button>Afegir</button>
    </form>
  )
}
