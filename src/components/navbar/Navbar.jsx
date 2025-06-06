import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import './Navbar.css';

export default function Navbar() {
  const [usuari, setUsuari] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuari(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al tancar sessió:", err);
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="titol"><Link to="/">Despesapp</Link></li>
        <li><Link to="/">Inici</Link></li>
        <li><Link to="/projectes">Projectes</Link></li>
        {usuari ? (
          <li>
            <button onClick={handleLogout}>Tancar sessió</button>
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Registrar-se</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
