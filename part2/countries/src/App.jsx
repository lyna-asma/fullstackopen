import {  useState , useEffect} from 'react';
import SearchBar from './components/SearchBar';
import Notification from './components/Notification';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import countryService from './services/countries'


const App = () => {


  // states initialisation
 const [search, setSearch] = useState('')
 const [errorMessage,setErrorrMessage]= useState('')
const [countries , setCountries] =useState([])
const [selectedCountry , setSelectedCountry]=useState(null)
const [weather, setWeather] = useState(null)



// countries to show 
const countriesToShow= countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))



  // effect call
useEffect(() => {

 countryService
 .getAll()
  .then(
    returnedCountries => {
      setCountries(returnedCountries)
    }
  )
}, [])

useEffect(() => {
  const country = selectedCountry || (countriesToShow.length === 1 ? countriesToShow[0] : null)
  if (country) {
    countryService
      .getWeather(country.capital[0])
      .then(weatherData => {
        setWeather(weatherData)
      })
  }
}, [selectedCountry, countriesToShow])


  // event handlers
const handleSearchChange = (event) => {
  console.log("coutry search filter value : " , event.target.value);
  
  setSearch(event.target.value)
}



  // form submission event handler 
  


  return (
    <div>
  <Notification message={errorMessage}></Notification>
<SearchBar search={search} handleSearchChange={handleSearchChange} placeholder="Type the country name...."></SearchBar>
{search === '' ? (
        <p>Start typing to search...</p>
      ) : selectedCountry ? (
        <CountryDetail country={selectedCountry} weather={weather} />
      ) : countriesToShow.length > 10 ? (
        <Notification message="Too many matches, specify another filter" />
      ) : countriesToShow.length > 1 ? (
        <CountryList countries={countriesToShow} handleShowClick={setSelectedCountry} />
      ) : countriesToShow.length === 1 ? (
        <CountryDetail country={countriesToShow[0]} weather={weather} />
      ) : (
        <Notification message="No countries found" />
      )}
    </div>
  )
}

export default App