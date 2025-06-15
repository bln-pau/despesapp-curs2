import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { auth, updateProjecte, getDocument } from "../../firebase/firebase";
import Titol from "../../components/titol/Titol";
import GestorParticipants from "../../components/gestorParticipants/GestorParticipants";
import DespesesLlista from "../../components/despesesLlista/DespesesLlista";
import DespesaForm from "../../components/despesaForm/DespesaForm";
import Modal from "../../components/modal/Modal";
import estilos from "./ProjectesDetall.module.css";

export default function ProjectesDetall() {
  const { id } = useParams();
  const { documents: usuaris } = useCollection("usuaris");
  const [projecte, setProjecte] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [titol, setTitol] = useState("");
  const [editantTitol, setEditantTitol] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarProjecte = async () => {
      setLoading(true);
      const doc = await getDocument("projectes", id);
      if (doc) {
        const participantsIni = doc.participants || [];
        const despeses = doc.despeses || [];

        const projecteComplet = {
          ...doc,
          participants: participantsIni,
          despeses: despeses
        };

        setProjecte(projecteComplet);
        setParticipants(participantsIni.map((nom) => ({ id: crypto.randomUUID(), nom })));
        setTitol(doc.titol);
      }
      setLoading(false);
    };

    carregarProjecte();
  }, [id]);

  const actualitzarTitol = async () => {
    const nouTitol = titol.trim();
    if (!nouTitol || nouTitol === projecte.titol) {
      setEditantTitol(false);
      return;
    }

    const projecteActualitzat = {
      ...projecte,
      titol: nouTitol,
      participants: participants.map((p) => p.nom),
    };

    await updateProjecte(id, projecteActualitzat);
    setProjecte(projecteActualitzat);
    setEditantTitol(false);
  };

  const usuariLoguejat = auth.currentUser?.displayName || auth.currentUser?.email || "";
  const esPropietari = projecte?.participants.includes(usuariLoguejat);

  if (loading) return <p>Carregant projecte...</p>;
  if (!projecte) return <p>No s'ha trobat el projecte.</p>;

  return (
    <div className={estilos.projecteDetall}>
      <Titol text="Detall del projecte" />

      <div className={estilos.titolProjecte}>
        {editantTitol ? (
          <>
            <input
              type="text"
              value={titol}
              className={estilos.inputTitol}
              onChange={(e) => setTitol(e.target.value)}
            />
            <button className={estilos.editar} onClick={actualitzarTitol}>Desar</button>
          </>
        ) : (
          <>
            <h2>{titol}</h2>
            {esPropietari && (
              <button onClick={() => setEditantTitol(true)}>Editar títol</button>
            )}
          </>
        )}
      </div>

      {esPropietari && (
        <GestorParticipants
          participants={participants}
          setParticipants={setParticipants}
          usuaris={usuaris}
        />
      )}

      <h3>Despeses</h3>
      <DespesesLlista despeses={projecte.despeses || []} />

      {esPropietari && (
        <>
          <button onClick={() => setMostrarModal(true)}>Afegir despesa</button>
          {mostrarModal && (
          <Modal mostrar={mostrarModal} handleTancar={() => setMostrarModal(false)}>
            <DespesaForm afegirDespesa={(novaDespesa) => {
                                          const despesesActuals = projecte.despeses || [];
                                          const actualitzat = { 
                                            ...projecte,
                                            despeses: [...despesesActuals, novaDespesa]
                                          };
                                          updateProjecte(projecte.id, actualitzat);
                                          setProjecte(actualitzat);
                                        }}
                                        participants={participants.map(p => p.nom)}
                                        tancar={() => setMostrarModal(false)} />
          </Modal>
          )}
        </>
      )}
    </div>
  );
}
