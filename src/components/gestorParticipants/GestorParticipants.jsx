import { useState, useEffect } from "react";
import estilos from "./GestorParticipants.module.css";

export default function GestorParticipants({ participants, setParticipants, usuaris }) {
  const [nouParticipant, setNouParticipant] = useState("");
  const [participantEditant, setParticipantEditant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [nouParticipant]);

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

  return (
    <div>
      <h3>Participants:</h3>
      <input
        type="text"
        value={nouParticipant}
        onChange={(e) => {
          setNouParticipant(e.target.value);
          setError("");
        }}
        placeholder="Nom participant"
      />

      {participantEditant === null ? (
        <button type="button" onClick={afegirParticipantNoRegistrat}>
          Afegir
        </button>
      ) : (
        <button type="button" onClick={confirmarEdicio}>
          Confirmar edició
        </button>
      )}

      {usuaris && nouParticipant.trim() && (
        <ul className={estilos.coincidencies}>
          {usuaris
            .filter((u) =>
              u.nom.toLowerCase().includes(nouParticipant.trim().toLowerCase())
            )
            .map((u) => (
              <li key={u.uid}>
                Coincidència: {u.nom} ({u.email})
                <button
                  type="button"
                  onClick={() => afegirParticipantRegistrat(u.nom)}
                >
                  Afegir usuari
                </button>
              </li>
            ))}
        </ul>
      )}

      <ul className={estilos.llista}>
        {participants.map((p) => (
          <li key={p.id} className={estilos.elementLlista}>
            <span>{p.nom}</span>
            <div className={estilos.botons}>
              <button
                type="button"
                className={estilos.editar}
                onClick={() => iniciarEdicio(p.id)}
              >
                Editar
              </button>
              <button
                type="button"
                className={estilos.eliminar}
                onClick={() => eliminarParticipant(p.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error && <p className={estilos.error}>{error}</p>}
    </div>
  );
}
