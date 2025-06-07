import { useState } from "react";
import { updateProjecte } from "../../firebase/firebase";
import { useCollection } from "../../hooks/useCollection";
import estilos from "./ProjecteEditForm.module.css";
import GestorParticipants from "../gestorParticipants/GestorParticipants";

export default function ProjecteEditForm({ projecte, tancar, onUpdate }) {
  const { documents: usuaris } = useCollection("usuaris");
  const [titol, setTitol] = useState(projecte.titol);
  const [participants, setParticipants] = useState(
    projecte.participants.map((nom, i) => ({ id: Date.now() + i, nom }))
  );
  const [error, setError] = useState("");


  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!titol.trim()) {
      setError("El títol no pot estar buit.");
      return;
    }

    const nomsValids = participants.map(p => p.nom).filter(n => n !== "");
    if (nomsValids.length === 0) {
      setError("Has d'afegir almenys un participant.");
      return;
    }

    const dadesActualitzades = {
      ...projecte,
      titol: titol.trim(),
      participants: nomsValids
    };

    try {
      await updateProjecte(projecte.id, dadesActualitzades);
      onUpdate();
      tancar();
    } catch (err) {
      setError("No s'ha pogut actualitzar el projecte.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={estilos["formulari-edicio"]}>
      <h2>Edita projecte</h2>

      <label>
        Títol:
        <input type="text" value={titol} onChange={(e) => setTitol(e.target.value)} />
      </label>

      <GestorParticipants participants={participants} setParticipants={setParticipants} usuaris={usuaris} />

      {error && <p className={estilos.error}>{error}</p>}
      <button type="submit">Desar canvis</button>
      <button type="button" className={estilos.cancelar} onClick={tancar}>Cancel·lar</button>
    </form>
  );
}
