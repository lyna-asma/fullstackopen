import React from 'react'

const CountryList = ({ countries , handleShowClick  }) => {
    return (
        <div>
         <ul>
            {countries.map( country => 
            <li key={country.name.common} >
                 {country.name.common} 
                 <button onClick={() => handleShowClick(country)}> show</button>
            </li>)}
         </ul>
        </div>
    )
}

export default CountryList