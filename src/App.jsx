import { useState } from 'react';
import './App.css';
import Titol from './components/titol/Titol';

function App() {
  const [mostrarDespeses, setMostrarDespeses] = useState(true);

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
      {mostrarDespeses &&
        despeses.map((despesa, index)=>(
          <div key={despesa.id}>
            <h2>{index + 1} - {despesa.concepte}</h2>
            <button onClick={() => handleClick(despesa.id)}>Eliminar Despesa</button>
          </div>
        )
      )
      }
    </div>
  )
}

export default App
