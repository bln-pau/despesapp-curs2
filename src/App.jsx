import React, { useState } from 'react';
import './App.css';
import Titol from './components/titol/Titol';
import Modal from './components/modal/Modal';
import DespesesLlista from './components/despesesLlista/DespesesLlista';

function App() {
  const [mostrarDespeses, setMostrarDespeses] = useState(true);
  const [mostraModal, setMostraModal] = useState(false);

  console.log(mostraModal);

  const [despeses, setDespeses] = useState([
    {concepte: "dinar", quantia: 30.55, pagatPer: "Pere", id: 1},
    {concepte: "sopar", quantia: 45.65, pagatPer: "Toni", id: 2},
    {concepte: "excursió", quantia: 21.33, pagatPer: "Anna", id: 3}
  ]);

  //console.log(mostrarDespeses);

  const subtitol = "React & Firebase!!";

  const handleClick = (id) => {
    setDespeses((despesesPrevies)=> {
      return despesesPrevies.filter((despesa) => id !== despesa.id)
    })
  }

  const handleTancar = () => {
    setMostraModal(false);
  }

  return (
    <div>
      <Titol titol="Benvinguts al Curs!!" subtitol={subtitol} />
      { !mostrarDespeses &&
      (
      <div>
        <button onClick={()=>setMostrarDespeses(true)}>Mostrar Despeses</button>
      </div>
      )
      }
      { mostrarDespeses &&
      (
      <div>
        <button onClick={()=>setMostrarDespeses(false)}>Ocultar Despeses</button>
      </div>
      )
      }
      {mostrarDespeses && <DespesesLlista despeses={despeses} handleClick={handleClick} />}
      {mostraModal && <Modal handleTancar = {handleTancar}>
        <h2>Component Modal</h2>
        <p>Ara canviarem el contingut</p>
        <p>Hola</p>
      </Modal>}
      <div>
        <button onClick={() => setMostraModal(true)}>Mostrar Modal</button>
      </div>
    </div>
  )
}

export default App
