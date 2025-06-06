// src/components/projectesDetall/ProjectesDetall.jsx
import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";
import { saveDespesa, deleteDespesa, updateDespesa } from "../../firebase/firebase";
import Modal from "../modal/Modal";
import DespesaForm from "../despesaForm/DespesaForm";
import DespesesLlista from "../despesesLlista/DespesesLlista";
import estilos from './ProjectesDetall.module.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";

export default function ProjectesDetall({ id }) {
    const { documents: projectes } = useCollection("projectes");
    const { documents: despeses } = useCollection("despeses");

    const [mostraModal, setMostraModal] = useState(false);
    const [despesaEditant, setDespesaEditant] = useState(null);

    const nav = useNavigate();

    const projecte = projectes?.find(p => p.id === id);
    const despesesProjecte = despeses?.filter(d => d.idProjecte === id) || [];

    const usuariLoguejat = auth.currentUser?.displayName || auth.currentUser?.email || "";

    const guardarDespesa = async (despesa) => {
        const dades = { ...despesa, idProjecte: id };

        if (despesaEditant) {
            await updateDespesa(despesaEditant.id, dades);
        } else {
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
    };

    if (!projecte) return <p>Carregant projecte...</p>;

    return (
        <div className={estilos.container}>
            <h1 className={estilos.titol}>{projecte.titol}</h1>
            <div className={estilos.section}>
                <h2>Participants</h2>
                <ul className={estilos.llista}>
                    {projecte.participants
                        .filter(nom => nom !== usuariLoguejat)
                        .map((nom, index) => (
                        <li key={index} className={estilos.elementLlista}>
                            <span>{nom}</span>
                            <div className={estilos.botons}>
                            <button className={estilos.editar}>Editar</button>
                            <button className={estilos.eliminar}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className={estilos.section}>
                <h2>Despeses</h2>
                <DespesesLlista
                    despeses={despesesProjecte}
                    editarDespesa={editarDespesa}
                    eliminarDespesa={eliminarDespesa}
                />
            </div>
            
            {mostraModal && (
                <Modal handleTancar={() => setMostraModal(false)}>
                    <DespesaForm
                        afegirDespesa={guardarDespesa}
                        participants={projecte.participants}
                        despesaInicial={despesaEditant}
                    />
                </Modal>
            )}

            <button className={estilos.botoAfegir} onClick={() => setMostraModal(true)}>Afegir Despesa</button>
        </div>
    );
}
