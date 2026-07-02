import React from 'react'

const SearchBar = ({ search , handleSearchChange , placeholder}) => {
return (
    <div>
      Find countries:<input type="text" value={search} onChange={handleSearchChange} placeholder={placeholder} />
    </div>
)
}

export default SearchBar