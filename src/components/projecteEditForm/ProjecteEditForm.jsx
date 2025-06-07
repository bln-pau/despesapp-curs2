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
  const [nouParticipant, setNouParticipant] = useState("");
  const [participantEditant, setParticipantEditant] = useState(null);
  const [error, setError] = useState("");

  const afegirParticipantNoRegistrat = () => {
    const nom = nouParticipant.trim();
    if (!nom) return;

    const coincidenciaExacta = usuaris?.some(u => u.nom.trim().toLowerCase() === nom.toLowerCase());
    if (coincidenciaExacta) {
      setError("Aquest nom coincideix amb un usuari registrat.");
      return;
    }

    const jaExisteix = participants.some(p => p.nom.toLowerCase() === nom.toLowerCase());
    if (jaExisteix) return;

    setParticipants([...participants, { id: nom, nom }]);
    setNouParticipant("");
  };

  const afegirParticipantRegistrat = (nom) => {
    const nomNet = nom.trim();
    if (!nomNet) return;

    const jaExisteix = participants.some(p => p.nom.toLowerCase() === nom.toLowerCase());
    if (jaExisteix) return;

    setParticipants([...participants, { id: Date.now(), nom: nomNet }]);
    setNouParticipant("");
    setError("");
  };

  const eliminarParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const iniciarEdicio = (id) => {
    const p = participants.find(p => p.id === id);
    if (p) {
      setNouParticipant(p.nom);
      setParticipantEditant(id);
    }
  };

  const confirmarEdicio = () => {
    setParticipants(participants.map(p =>
      p.id === participantEditant ? { ...p, nom: nouParticipant.trim() } : p
    ));
    setNouParticipant("");
    setParticipantEditant(null);
  };

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
