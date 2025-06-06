import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Inici from './pages/inici/Inici';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Navbar from './components/navbar/Navbar';
import DespesesDetall from './components/despesesDetall/DespesesDetall';
import Projectes from './pages/projectes/Projectes';
import ProjectesDetall from './pages/projecte/ProjectesDetall';
import RutaPrivada from './components/rutaPrivada/RutaPrivada';

function App() {

  return (
    <div>
      <Navbar />
        <Routes>
          <Route path='/' element={<Inici />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/projectes' element={<RutaPrivada element={<Projectes />} />} /> 
          <Route path='/projecte/:id' element={<RutaPrivada element={<ProjectesDetall />} />} />
          <Route path='/despesa/:id' element={<RutaPrivada element={<DespesesDetall />} />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App
