import { useState, useEffect } from 'react';
import { auth } from "../../firebase/firebase";
import './DespesaForm.css'

export default function DespesaForm({ afegirDespesa, participants = [], despesaInicial }) {

  const [concepte, setConcepte] = useState("");
  const [quantia, setQuantia] = useState("");
  const [pagatPer, setPagatPer] = useState("");
  const [dividirEntre, setDividirEntre] = useState(participants);

  const resetForm = () => {
    const usuari = auth.currentUser;
    const nomUsuari = usuari?.displayName || usuari?.email || "";

    setConcepte("");
    setQuantia("");
    setPagatPer(nomUsuari);
    setDividirEntre(participants);
  }

  useEffect(() => {
    const usuari = auth.currentUser;
    const nomUsuari = usuari?.displayName || usuari?.email || "";

    if (despesaInicial) {
      setConcepte(despesaInicial.concepte || "");
      setQuantia(despesaInicial.quantia || "");
      setPagatPer(despesaInicial.pagatPer || nomUsuari);
      setDividirEntre(despesaInicial.dividirEntre || []);
    } else {
      setConcepte("");
      setQuantia("");
      setPagatPer(nomUsuari);
      setDividirEntre(participants);
    }
  }, [despesaInicial]);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const despesa = {
      concepte: concepte,
      quantia: quantia,
      pagatPer: pagatPer,
      dividirEntre: dividirEntre.filter(p => p !== pagatPer)
    }

    afegirDespesa(despesa);
    resetForm();
  };

  const toggleParticipant = (nom) => {
    if (dividirEntre.includes(nom)) {
      setDividirEntre(dividirEntre.filter(p => p !== nom));
    } else {
      setDividirEntre([...dividirEntre, nom]);
    }
  }

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
            <select value={pagatPer} onChange={(e) => {setPagatPer(e.target.value)}}>
              <option value="">-- Selecciona qui ha pagat --</option>
              {participants.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
        </label>
        <fieldset>
          <legend>Dividir entre: </legend>
          {participants.filter(p => p !== pagatPer)
          .map(p => (
            <label>
              <input type="checkbox" checked={dividirEntre.includes(p)} 
              onChange={() => toggleParticipant(p)} />
              {p}
            </label>
          ))}
        </fieldset>
        <button>Afegir</button>
    </form>
  )
}
