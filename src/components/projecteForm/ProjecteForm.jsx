// src/components/projectesForm/ProjecteForm.jsx
import { useState, useEffect } from "react";
import { saveCollection } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import {auth} from "../../firebase/firebase";
import estilos from "./ProjecteForm.module.css";

export default function ProjecteForm({ tancar }) {
  const { documents: usuaris } = useCollection("usuaris");
  const [titol, setTitol] = useState("");
  const [participants, setParticipants] = useState([]);
  const [nouParticipant, setNouParticipant] = useState("");
  const [participantEditant, setParticipantEditant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !usuaris) return;
      const usuariTrobat = usuaris.find(u => u.uid === user.uid);
      const nomUsuari = usuariTrobat?.nom || user.email || "";
      
      const jaExisteix = participants.some(p => p.nom === nomUsuari);
      if (!jaExisteix) {
        setParticipants(prev => [...prev, { id: Date.now(), nom: nomUsuari }]);
      }
    }, [usuaris]);

  const nav = useNavigate();

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

    setParticipants([...participants, { id: Date.now(), nom }]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titol.trim()) {
      setError("Has d'introduir un títol.");
      return;
    }

    const nomsValids = participants.map(p => p.nom).filter(n => n !== "");

    const user = auth.currentUser;
    const usuariTrobat = usuaris?.find(u => u.uid === user?.uid);
    const nomUsuari = usuariTrobat?.nom || user?.email || "";

    if (nomUsuari && !nomsValids.includes(nomUsuari)) {
      nomsValids.unshift(nomUsuari);
    }

    if (nomsValids.length === 0) {
      setError("Has d'afegir almenys un participant.");
      return;
    }

    const projecte = {
      titol: titol.trim(),
      participants: nomsValids,
      creat: Date.now()
    };

    try {
      const id = await saveCollection("projectes", projecte);
      tancar();
      nav(`/projecte/${id}`);
    } catch (err) {
      setError("No s'ha pogut guardar el projecte.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Títol:
        <input type="text" value={titol} onChange={(e) => setTitol(e.target.value)} />
      </label>

      <div>
        <h3>Participants:</h3>
        <input type="text" value={nouParticipant} onChange={(e) => {
          setNouParticipant(e.target.value);
          setError("");
        }} placeholder="Nom participant" />

        {participantEditant === null ? (
          <button type="button" onClick={afegirParticipantNoRegistrat}>Afegir</button>
        ) : (
          <button type="button" onClick={confirmarEdicio}>Confirmar edició</button>
        )}

        {usuaris && nouParticipant.trim() && (
          <ul className={estilos.coincidencies}>
            {
              usuaris.filter(u =>
                u.nom.toLowerCase().includes(nouParticipant.trim().toLowerCase())
              ).map(u => (
                <li key={u.uid}>
                  Coincidència: {u.nom} ({u.email})
                  <button type="button" onClick={() => afegirParticipantRegistrat(u.nom)}>Afegir usuari</button>
                </li>
              ))
            }
          </ul>
        )}

        <ul className={estilos.llista}>
          {
            participants.map(p => (
              <li key={p.id} className={estilos.elementLlista}>
                <span>{p.nom}</span>
                <div className={estilos.botons}>
                  <button type="button" className={estilos.editar} onClick={() => iniciarEdicio(p.id)}>Editar</button>
                  <button type="button" className={estilos.eliminar} onClick={() => eliminarParticipant(p.id)}>Eliminar</button>
                </div>
              </li>
            ))
          }
        </ul>
      </div>

      {error && <p className={estilos.error}>{error}</p>}
      <button type="submit">Crear projecte</button>
    </form>
  );
}
