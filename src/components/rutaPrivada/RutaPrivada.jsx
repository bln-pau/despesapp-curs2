import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function RutaPrivada({ element }) {
    const [usuari, setUsuari] = useState(null);
    const [carregant, setCarregant] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user){
                nav("/login", { replace: true});
            } else {
                setUsuari(user);
                setCarregant(false);
            } 
        });
        return () => unsubscribe();
    },[nav]);

    if (carregant) return <p>Carregant...</p>

  return usuari ? element : null;
}
