import React from 'react'

const CountryDetail = ({ country , weather}) => {
    return (
        <div>
            <h1> {country.name.common}</h1>

            <p> Capital :  {country.capital[0]}</p>
            <p> Area : {country.area} km²</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(lang => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            {weather && (
                <div>
                    <h3>Weather in {country.capital[0]}</h3>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <p>Wind: {weather.wind.speed} m/s</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt="weather icon"
                    />
                </div>
            )}
        </div>
    )
}

export default CountryDetail