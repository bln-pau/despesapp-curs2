import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { deleteProjecte, updateProjecte } from "../../firebase/firebase";
import estilos from './Projectes.module.css';
import ProjecteForm from '../../components/projecteForm/ProjecteForm';
import Modal from "../../components/modal/Modal";
import ProjecteEditForm from "../../components/projecteEditForm/ProjecteEditForm";

export default function Projectes() {
    const { documents: projectes } = useCollection('projectes');

    const [mostraModal, setMostraModal] = useState(false);
    const [projecteEditant, setProjecteEditant] = useState(null);
    const [titolEdicio, setTitolEdicio] = useState("");
    const [error, setError] = useState("");
    
    const nav = useNavigate();

    const editarProjecte = (projecte) => {
        setProjecteEditant(projecte);
        setTitolEdicio(projecte.titol);
    };

    const confirmarEdicioProjecte = async () => {
        if (!titolEdicio.trim()) {
            setError("El títol no pot estar buit.");
            return;
        } 

        const projecteActualitzat = {
            ...projecteEditant,
            titol: titolEdicio.trim()
        };

        try {
            await updateProjecte(projecteEditant.id, projecteActualitzat);
            setTitolEdicio("");
        } catch (err) {
            setError("No s'ha pogut actualitzar el projecte.");
        }
    };

    const eliminarProjecte = async (id) => {
        if (!window.confirm("Segur que vols eliminar aquest projecte?")) return;

        try {
            await deleteProjecte(id);
        } catch (err) {
            setError("No s'ha pogut eliminar el projecte.");
        }
    }

  return (
    <div className={estilos.container}>
        <h1>Projectes</h1>

        <ul className={estilos.llista}>
            {projectes && projectes.map(projecte => (
                <li key={projecte.id} className={estilos.elementLlista}>
                    <Link to={`/projecte/${projecte.id}`}>
                        <strong>{projecte.titol}</strong> 
                    </Link> ({projecte.participants.length} participants)
                    <div className={estilos.botons}>
                        <button className={estilos.editar} onClick={() => editarProjecte(projecte)}>Editar</button>
                        <button className={estilos.eliminar} onClick={() => eliminarProjecte(projecte.id)}>Eliminar</button>
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
