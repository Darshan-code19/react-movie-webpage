import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./SearchRow.css"

const SearchRow = ({title, searchList}) => {
  const navigate = useNavigate()

  // Navigate to movie details page when clicked
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  return (
    <div>
        {title && (
            <div className="movie-container">
                {searchList.map((item) => {
                    return(
                        <img 
                          key={item.id} 
                          className="img" 
                          src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} 
                          alt={item.title} 
                          height={'200px'} 
                          width={'340px'}
                          onClick={() => handleMovieClick(item.id)}
                          style={{cursor: 'pointer'}}
                        />
                    )
                })}
            </div>
        )}
    </div>
  )
}

export default SearchRow