import { useState } from 'react';

export default function Register() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

  return (
    <form>
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
        <button type="submit" >Registrar</button>
    </form>
  )
}
