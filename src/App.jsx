import React, { useState, useEffect } from 'react';
import './App.css';
import Titol from './components/titol/Titol';
import Modal from './components/modal/Modal';
import DespesaForm from './components/despesaForm/DespesaForm';
import DespesesLlista from './components/despesesLlista/DespesesLlista';

function App() {
  const [mostrarDespeses, setMostrarDespeses] = useState(true);
  const [mostraModal, setMostraModal] = useState(false);
  const [filtrarPerQuantia, setFiltrarPerQuantia] = useState(false);

  console.log(mostraModal);

  const [despeses, setDespeses] = useState([
    {concepte: "dinar", quantia: 9.55, pagatPer: "Pere", id: 1},
    {concepte: "sopar", quantia: 7.65, pagatPer: "Toni", id: 2},
    {concepte: "excursió", quantia: 11.33, pagatPer: "Anna", id: 3}
  ]);

  // useEffect

  //const [despeses, setDespeses] = useState([]);

  //console.log(mostrarDespeses);

  const subtitol = "React & Firebase!!";

  useEffect(() => {
    setDespeses((despesesPrevies) => {
      if(filtrarPerQuantia)
        return despesesPrevies.filter((despesa) => despesa.quantia > 10.00);
      else
        return despesesPrevies;
    })
  }
  , [filtrarPerQuantia])

  const afegirDespesa = (despesa) => {
    setDespeses((despesesPrevies) => {
      return [...despesesPrevies, despesa];
    }
    );
    setMostraModal(false);
  };

  const handleClick = (id) => {
    setDespeses((despesesPrevies) => {
      return despesesPrevies.filter((despesa) => id !== despesa.id)
    })
  }

  const handleTancar = () => {
    setMostraModal(false);
  }

  return (
    <div>
      <Titol titol="Benvinguts al Curs!!" subtitol={subtitol} />
      {!mostrarDespeses &&
        (
          <div>
            <button onClick={() => setMostrarDespeses(true)}>Mostrar Despeses</button>
          </div>
        )
      }
      {mostrarDespeses &&
        (
          <div>
            <button onClick={() => setMostrarDespeses(false)}>Ocultar Despeses</button>
          </div>
        )
      }
      {mostrarDespeses && <DespesesLlista despeses={despeses} handleClick={handleClick} />}
      {mostraModal && <Modal handleTancar={handleTancar} >
        <DespesaForm afegirDespesa={afegirDespesa} />
      </Modal>}
      <div>
        <button onClick={() => setMostraModal(true)}>Afegir Despesa</button>
      </div>
      <div>
        <button onClick={() => setFiltrarPerQuantia(true)} >Filtrar</button>
      </div>
    </div>
  )
}

export default App
