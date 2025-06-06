import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, saveUserProfile } from '../../firebase/firebase';

export default function Register() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");

    const nav = useNavigate();

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        if (password !== password2) {
            setError("Les contrasenyes no coincideixen");
            return;
        }

        const resultat = await registerUser(email, password);

        if (resultat.code){
            setError(resultat.message);
            return;
        }

        try {
            await saveUserProfile(resultat.user.uid, nom, resultat.user.email);
            nav('/');
        } catch (err) {
            setError("Error al desar el perfil d'usuari");
        }
    };

  return (
    <form onSubmit={handleSubmit}>
        <h2>REGISTRE</h2>
        <label>
            Nom:
            <input type="text" onChange={(ev) => {setNom(ev.target.value)}} />
        </label>
        <label>
            Correu electrònic:
            <input type="email" onChange={(ev) => {setEmail(ev.target.value)}} />
        </label>
        <label>
            Contrasenya:
            <input type="password" onChange={(ev) => {setPassword(ev.target.value)}} />
        </label>
        <label>
            Repetir contrasenya:
            <input type="password" onChange={(ev) => {setPassword2(ev.target.value)}} />
        </label>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <button type="submit" >Registrar</button>
    </form>
  )
}
