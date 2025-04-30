import './DespesaForm.css'

export default function DespesaForm() {
  return (
    <form className='despesa-form'>
        <label>
            <span>Concepte</span>
            <input type="text" />
        </label>
        <label>
            <span>Quantia</span>
            <input type="text" />
        </label>
        <label>
            <span>Pagat per</span>
            <input type="text" />
        </label>
        <button>Afegir</button>
    </form>
  )
}
