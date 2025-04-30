import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({children, handleTancar}) {
  return ReactDOM.createPortal((
    <div className="modal-fons">
        <div className="modal">
            {children}
            <button onClick={handleTancar}>Tancar</button>
        </div>
    </div>
  ), document.body)
}
