import React, { useState, useEffect } from 'react'
import axios from "axios"
import "./Header.css"
import {useNavigate} from "react-router-dom"
const baseURL = "https://api.themoviedb.org/3/"
const Header = ({ url }) => {
  const [movies, setMovies] = useState([])
  const navigate= useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseURL}${url}`)
        const rest = response.data.results
        const r = Math.floor(Math.random() * rest.length)
        setMovies([rest[r]])
      } catch (error) {
        console.error("Error fetching movies:", error)
      }
    }

    if (url) {
      fetchMovies()
    }
  }, [url])

  function handleclick(id){
    navigate(`movie/${id}`)
  }

  return (
    <div>
      {movies.map((item) => (
        <div
          className="header-container"
          key={item.id}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${item.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "400px", // adjust as needed
            color: "white"
          }}
          onClick={()=>handleclick(item.id)}
        >
          <div className="header-content">
            <h1>{item.title || item.name}</h1>
            <p>{item.overview}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Header
