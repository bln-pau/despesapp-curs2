import { useParams } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";
import { saveDespesa, deleteDespesa, updateDespesa } from "../../firebase/firebase";
import Modal from "../../components/modal/Modal";
import DespesaForm from "../../components/despesaForm/DespesaForm";
import DespesesLlista from "../../components/despesesLlista/DespesesLlista";

export default function ProjecteDetall() {
    const { id } = useParams();
    console.log("ID del projecte:", id);

    const { documents: projectes } = useCollection("projectes");
    const { documents: despeses } = useCollection("despeses");

    const [mostraModal, setMostraModal] = useState(false);
    const [despesaEditant, setDespesaEditant] = useState(null);

    const projecte = projectes?.find(p => p.id === id);
    const despesesProjecte = despeses?.filter(d => d.idProjecte === id) || [];

    const guardarDespesa = async (despesa) => {
        const dades = { ...despesa, idProjecte: id };

        if (despesaEditant) {
            await updateDespesa(despesaEditant.id, dades);
        } else{
            await saveDespesa(dades);
        }
        
        setDespesaEditant(null);
        setMostraModal(false);
    };

    const eliminarDespesa = async (idDespesa) => {
        await deleteDespesa(idDespesa);
    };

    const editarDespesa = (despesa) => {
        setDespesaEditant(despesa);
        setMostraModal(true);
    }

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
        <DespesesLlista despeses={despesesProjecte} editarDespesa={editarDespesa} eliminarDespesa={eliminarDespesa} 
         />

        {mostraModal && (
            <Modal handleTancar={() => setMostraModal(false)}>
                <DespesaForm afegirDespesa={guardarDespesa} participants={projecte.participants}
                despesaInicial={despesaEditant}/>
            </Modal>
        )}

        <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
    </div>
  )
}
