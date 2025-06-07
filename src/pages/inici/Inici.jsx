import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { deleteProjecte, updateProjecte } from "../../firebase/firebase";
import estilos from './Inici.module.css';
import ProjecteForm from '../../components/projecteForm/ProjecteForm';
import Modal from "../../components/modal/Modal";
import ProjecteEditForm from "../../components/projecteEditForm/ProjecteEditForm";
import {auth} from "../../firebase/firebase";

export default function Inici() {
    const { documents: projectes } = useCollection('projectes');

    const [mostraModal, setMostraModal] = useState(false);
    const [projecteEditant, setProjecteEditant] = useState(null);
    const [usuari, setUsuari] = useState(null);
    const [error, setError] = useState("");
    
    const nav = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUsuari(user);
        });

        return () => unsubscribe();
    }, []);

    const editarProjecte = (projecte) => {
        nav(`/projecte/${projecte.id}`);
    };

    const eliminarProjecte = async (id) => {
        if (!auth.currentUser) {
            setError("Has d'estar autenticat per eliminar projectes.");
            return;
        };

        if (!window.confirm("Segur que vols eliminar aquest projecte?")) return;

        try {
            await deleteProjecte(id);
        } catch (err) {
            setError("No s'ha pogut eliminar el projecte.");
        };
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
                    {usuari && (
                        <div className={estilos.botons}>
                            <button className={estilos.editar} onClick={() => editarProjecte(projecte)}>Editar</button>
                            <button className={estilos.eliminar} onClick={() => eliminarProjecte(projecte.id)}>Eliminar</button>
                        </div>
                    )}
                    
                </li>
            ))} 
        </ul>

        {mostraModal && (
                <Modal handleTancar={() => setMostraModal(false)}>
                    <ProjecteForm tancar={() => setMostraModal(false)} />
                </Modal>
        )}
                
        {error && <p className={estilos.error}>{error}</p>}
        {usuari && (
            <button type="button" onClick={() => setMostraModal(true)}>Crear projecte</button>
        )}
    </div>
  )
}
