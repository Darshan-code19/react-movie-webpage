import React from 'react'
import "./Navbar.css"
const Navbar = ({setsearch}) => {
  return (
    <div className='nav'>
        <div className="right">
            <h1>NETFLIX</h1>
        </div>
        <div className="left">
        <input onChange={(e)=>setsearch(e.target.value)} type="text"  placeholder='Search for movies'/>
        </div>
    </div>
  )
}

export default Navbar