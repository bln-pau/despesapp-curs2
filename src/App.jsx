import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inici from './pages/inici/Inici';
import Login from './pages/login/Login';
import Navbar from './components/navbar/Navbar';

function App() {

  return (
    <div>
      <Navbar />
        <Routes>
          <Route path='/' element={<Inici />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  )
}

export default App
