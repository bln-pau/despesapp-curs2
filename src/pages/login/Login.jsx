import { useState } from "react";
import { loginUser } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom";
import estilos from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const resultat = await loginUser(email, password);

    if (resultat.code) {
      setError(resultat.message);
      return;
    }

    nav('/');
  }

  return (
    <form className={estilos["formulari-login"]} onSubmit={handleSubmit}>
      <h2>Iniciar Sessió</h2>
      <label>
        Correu electrònic:
        <input type="email" onChange={(ev) => setEmail(ev.target.value)} />
      </label>
      <label>
        Contrasenya:
        <input type="password" onChange={(ev) => setPassword(ev.target.value)} />
      </label>
      {error && <p className={estilos.error}>{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  )
}
