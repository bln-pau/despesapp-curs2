import { useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { deleteProjecte } from "../../firebase/firebase";
import estilos from './Inici.module.css';
import ProjecteForm from '../../components/projecteForm/ProjecteForm';
import Modal from "../../components/modal/Modal";
import ProjecteEditForm from "../../components/projecteEditForm/ProjecteEditForm";

export default function Inici() {
    const { documents: projectes } = useCollection('projectes');

    const [mostraModal, setMostraModal] = useState(false);
    const [projecteEditant, setProjecteEditant] = useState(null);
    const [error, setError] = useState("");

    const eliminarProjecte = async (id) => {
        if (!window.confirm("Segur que vols eliminar aquest projecte?")) return;

        try {
            await deleteProjecte(id);
        } catch (err) {
            setError("No s'ha pogut eliminar el projecte.");
        }
    };

    return (
        <div className={estilos.container}>
            <h1>Llista de projectes</h1>

            <ul className={estilos.llista}>
                {projectes && projectes.map(projecte => (
                    <li key={projecte.id} className={estilos.elementLlista}>
                        <Link to={`/projecte/${projecte.id}`}>
                            <strong>{projecte.titol}</strong> 
                        </Link> ({projecte.participants.length} participants)
                        <div className={estilos.botons}>
                            <button onClick={() => setProjecteEditant(projecte)}>Editar</button>
                            <button onClick={() => eliminarProjecte(projecte.id)}>Eliminar</button>
                        </div>
                    </li>
                ))} 
            </ul>

            {mostraModal && (
                <Modal handleTancar={() => setMostraModal(false)}>
                    <ProjecteForm tancar={() => setMostraModal(false)} />
                </Modal>
            )}
                    
            {projecteEditant && (
                <Modal handleTancar={() => setProjecteEditant(null)}>
                    <ProjecteEditForm
                        projecte={projecteEditant}
                        tancar={() => setProjecteEditant(null)}
                        onUpdate={() => {}}
                    />
                </Modal>
            )}

            {error && <p className={estilos.error}>{error}</p>}
            <button type="button" onClick={() => setMostraModal(true)}>Crear projecte</button>
        </div>
    )
}
