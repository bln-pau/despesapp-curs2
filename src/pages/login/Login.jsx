import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sessió</h2>
      <label>
        Correu electrònic:
        <input type="email" onChange={(ev) => setEmail(ev.target.value)} />
      </label>
      <label>
        Contrasenya:
        <input type="password" onChange={(ev) => setPassword(ev.target.value)} />
      </label>
      <button type="submit">Entrar</button>
    </form>
  )
}
