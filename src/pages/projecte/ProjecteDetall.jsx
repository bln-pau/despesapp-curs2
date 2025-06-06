import { useParams } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";
import { saveDespesa, deleteDespesa } from "../../firebase/firebase";
import Modal from "../../components/modal/Modal";
import DespesaForm from "../../components/despesaForm/DespesaForm";
import DespesesLlista from "../../components/despesesLlista/DespesesLlista";


export default function ProjecteDetall() {
    const { id } = useParams();
    console.log("ID del projecte:", id);

    const { documents: projectes } = useCollection("projectes");
    const { documents: despeses } = useCollection("despeses");
    const [mostraModal, setMostraModal] = useState(false);

    const projecte = projectes?.find(p => p.id === id);
    const despesesProjecte = despeses?.filter(d => d.idProjecte === id) || [];

    const afegirDespesa = async (despesa) => {
        await saveDespesa({ ...despesa, idProjecte: id });
        setMostraModal(false);
    };

    const eliminarDespesa = async (idDespesa) => {
        await deleteDespesa(idDespesa);
    };

    if (!projecte) return <p>Carregant projecte...</p>

    
  return (
    <div>
        <h1>{projecte.titol}</h1>
        <h2>Participants:</h2>
        <ul>
            {projecte.participants.map((nom, index) => (
                <li key={index}>{nom}</li>
            ))}
        </ul>

        <h2>Despeses</h2>
        <DespesesLlista despeses={despesesProjecte} eliminarDespesa={eliminarDespesa} />

        {mostraModal && (
            <Modal handleTancar={() => setMostraModal(false)}>
                <DespesaForm afegirDespesa={afegirDespesa} participants={projecte.participants}/>
            </Modal>
        )}

        <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
    </div>
  )
}
