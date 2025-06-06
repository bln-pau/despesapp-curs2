import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Inici from './pages/inici/Inici';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Navbar from './components/navbar/Navbar';
import DespesesDetall from './components/despesesDetall/DespesesDetall';
import Projectes from './pages/projectes/Projectes';
import ProjecteDetall from './pages/projecte/ProjecteDetall';

function App() {

  return (
    <div>
      <Navbar />
        <Routes>
          <Route path='/' element={<Inici />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/projectes' element={<Projectes />} /> 
          <Route path='/projecte/:id' element={<ProjecteDetall />} />
          <Route path='/despesa/:id' element={<DespesesDetall />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default App
