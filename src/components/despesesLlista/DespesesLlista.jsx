import React from 'react'

export default function DespesesLlista({ despeses, handleClick }) {
    return (
        <div>
            {
                despeses.map((despesa, index) => (
                    <React.Fragment key={despesa.id}>
                        <h2>{index + 1} - {despesa.concepte}</h2>
                        <button onClick={() => handleClick(despesa.id)}>Eliminar Despesa</button>
                    </React.Fragment>
                ))
            }
        </div>
    )
}
