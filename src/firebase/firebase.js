import { firebaseConfig } from "./config"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDocs, onSnapshot, doc, deleteDoc, setDoc, updateDoc, getDoc} from "firebase/firestore"
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth};

/* Firestore functions */
export const getDocument = async (collectionName, id) => {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);

  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const saveDespesa = async (despesa) => {
  console.log(despesa);
  const docRef = await addDoc(collection(db, "despeses"), despesa);

  return docRef.id;   
}

export const saveCollection = async (collectionName, item) => {
  console.log(item);
  const docRef = await addDoc(collection(db, collectionName), item);

  return docRef.id;
}

export const getDespeses = () => 
  getDocs(collection(db, "despeses"));

export const onGetCollection = (collectionName, callback) =>
  onSnapshot(collection(db, collectionName), callback);

export const onGetDespesa = (id, callback) =>
  onSnapshot(doc(db, "despeses", id), callback);

export const deleteDespesa = async (id) => {
  await deleteDoc(doc(db, "despeses", id));
}

export const updateDespesa = async (id, dades) => {
  const ref = doc(db, "despeses", id);
  await updateDoc(ref, dades);
}

export const updateProjecte = async (id, dades) => {
  const ref = doc(db, "projectes", id);
  await updateDoc(ref, dades);
}

export const deleteProjecte = async (id) => {
  await deleteDoc(doc(db, "projectes", id));
}

/* Auth functions */
export const registerUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    let message = "S'ha produït un error al registrar-se.";
    switch (err.code) {
      case "auth/invalid-email":
        message = "Email no vàlid.";
        break;
      case "auth/email-already-in-use":
        message = "Aquest correu ja està registrat.";
        break;
      case "auth/weak-password":
        message = "La contrasenya ha de tenir almenys 6 caràcters.";
        break;
    }
    return { code: err.code, message };
  }
}

export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    let message = "No s'ha pogut iniciar sessió.";
    switch (err.code) {
      case "auth/invalid-email":
        message = "Email no vàlid.";
        break;
      case "auth/user-not-found":
        message = "No existeix cap usuari amb aquest correu.";
        break;
      case "auth/wrong-password":
        message = "La contrasenya no és correcta.";
        break;
      case "auth/invalid-credential":
        message = "Email o contrasenya erronis.";
        break;
    }
    return { code: err.code, message };
  }
}

export const saveUserProfile = async (uid, nom, email) => {
  try{
    await setDoc(doc(db, "usuaris", uid), {
      uid,
      nom, 
      email
    });
  } catch (err) {
    console.error("Error al guardar el perfil de l'usuari: ", err);
    throw err;
  }
}
