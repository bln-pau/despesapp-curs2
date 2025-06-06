import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { deleteProjecte, saveCollection, updateProjecte } from "../../firebase/firebase";
import estilos from './Projectes.module.css';

export default function Projectes() {
    const { documents: projectes } = useCollection('projectes');
    const {documents: usuaris} = useCollection('usuaris');

    const [titol, setTitol] = useState("");
    const [participants, setParticipants] = useState([]);
    const [nouParticipant, setNouParticipant] = useState("");
    const [participantEditant, setParticipantEditant] = useState(null);
    const [projecteEditant, setProjecteEditant] = useState(null);
    const [titolEdicio, setTitolEdicio] = useState("");
    const [error, setError] = useState("");
    
    const nav = useNavigate();

    const afegirParticipantNoRegistrat = () => {
        const nom = nouParticipant.trim();
        if (!nom) return;

        const coincidenciaExacta = usuaris?.some(u => u.nom.trim().toLowerCase() === nom.toLowerCase());
        if (coincidenciaExacta) {
            setError("Aquest nom coincideix amb un usuari registrat. Si és aquest, fes clic a 'Afegir usuari'.")
            return;
        }

        const jaExisteix = participants.some(p => p.nom.toLowerCase() === nom.toLocaleLowerCase());
        if (jaExisteix) return;

        setParticipants([...participants, {id: Date.now(), nom}]);
        setNouParticipant("");
    }

    const afegirParticipantRegistrat = (nom) => {
        const nomNet = nom.trim();

        if (!nomNet) return;

        const jaExisteix = participants.some(p => p.nom.toLowerCase() === nom.toLocaleLowerCase());
        if (jaExisteix) return;

        setParticipants([...participants, {id: Date.now(), nom: nomNet }]);
        setNouParticipant("");
        setError("");
    }

    const eliminarParticipant = (id) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    const iniciarEdicio = (id) => {
        const p = participants.find(p => p.id === id);

        if (p) {
            setNouParticipant(p.nom);
            setParticipantEditant(id);
        }
    }

    const confirmarEdicio = () => {
        setParticipants(participants.map(p => 
            p.id === participantEditant ? {...p, nom:nouParticipant.trim() } : p
        ));

        setNouParticipant("");
        setParticipantEditant(null);
    }

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
            setParticipantEditant(null);
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

    

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        if (!titol.trim()) {
            setError("Has d'introduir un títol.");
            return;
        }

        const titolNormalitzat = titol.trim().toLowerCase();
        const titolDuplicat = projectes?.some(p => p.titol.trim().toLowerCase() === titolNormalitzat);

        if (titolDuplicat) {
            setError("Ja existeix un projecte amb aquest títol.");
            return;
        }

        const nomsValids = participants.map(p => p.nom).filter(nom => nom !== "");
        if (nomsValids.length === 0){
            setError("Has d'afegir almenys un participant.");
            return;
        }

        const projecte = {
            titol,
            participants: nomsValids,
            creat: Date.now()
        };

        try {
            const id = await saveCollection("projectes", projecte);
            nav(`/projecte/${id}`);
        } catch (err) {
            console.error("Error al guardar el projecte: ", err);
            setError("No s'ha pogut guardar el projecte.");
        }
    };

  return (
    <div className={estilos.container}>
        <h1>Projectes</h1>

        <ul className={estilos.llista}>
            {projectes && projectes.map(projecte => (
                <li key={projecte.id} className={estilos.elementLlista}>
                    <strong>{projecte.titol}</strong> ({projecte.participants.length} participants)
                    <div className={estilos.botons}>
                        <button className={estilos.editar} onClick={() => editarProjecte(projecte)}>Editar</button>
                        <button className={estilos.eliminar} onClick={() => eliminarProjecte(projecte.id)}>Eliminar</button>
                    </div>
                </li>
            ))} 
        </ul>

        <h2>Crear nou projecte</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Títol:
                <input type="text" value={titol} onChange={ev => setTitol(ev.target.value)} />
            </label>

            <div>
                <h3>Participants:</h3>
                
                <input type="text" placeholder="Nom del participant" value={nouParticipant}
                onChange={ev => {
                    setNouParticipant(ev.target.value);
                    setError("")}} />

                { participantEditant === null ? (
                    <button type="button" onClick={afegirParticipantNoRegistrat}>Afegir participant</button>
                ): (
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
                                    <button type="button" onClick={() => afegirParticipantRegistrat(u.nom)}>
                                        Afegir usuari
                                    </button>
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
                
                
                {projecteEditant && (
                    <div>
                        <h2>Edita projecte</h2>
                        <label>
                            Títol:
                            <input type="text" value={titolEdicio} onChange={(ev) => setTitolEdicio(ev.target.value)} />
                        </label>
                        <button onClick={confirmarEdicioProjecte}>Desar canvis</button>
                        <button onClick={() => setProjecteEditant(null)}>Cancel·lar</button>
                    </div>
                )}
            </div>

            {error && <p className={estilos.error}>{error}</p>}
            <button type="submit">Crear projecte</button>
        </form>
    </div>
  )
}
