import React from 'react'

const Filter = ({ searchFilter, handleSearchFilterChange }) => {
  return (
  <div>
        filter shown with <input value={searchFilter} onChange={handleSearchFilterChange} />
      </div>
  )
}

export default Filter