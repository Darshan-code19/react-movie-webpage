import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CastDetails.css';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '6c8667169423f0631688a2422e5ebc69';

const CastDetails = () => {
  const { id } = useParams(); // Get person ID from URL
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch person details and their movie credits
    const fetchPersonData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch person details
        const personResponse = await axios.get(
          `${BASE_URL}person/${id}?api_key=${API_KEY}&language=en-US`
        );
        setPerson(personResponse.data);

        // Fetch movie credits (movies they acted in)
        const creditsResponse = await axios.get(
          `${BASE_URL}person/${id}/movie_credits?api_key=${API_KEY}&language=en-US`
        );
        // Sort by popularity and take top 20
        const sortedMovies = (creditsResponse.data.cast || [])
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 20);
        setMovies(sortedMovies);
      } catch (err) {
        console.error('Error fetching person details:', err);
        setError('Failed to load cast member information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonData();
    }
  }, [id]);

  // Navigate to movie page
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Navigate back
  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="cast-details-loading">
        <div className="spinner"></div>
        <p>Loading cast details...</p>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="cast-details-error">
        <p>{error || 'Cast member not found'}</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="cast-details-container">
      {/* Hero Section */}
      <div className="cast-hero">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
        <div className="cast-hero-content">
          <div className="cast-profile-image">
            <img
              src={
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w500/${person.profile_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={person.name}
            />
          </div>
          <div className="cast-profile-info">
            <h1>{person.name}</h1>
            {person.known_for_department && (
              <p className="known-for">Known for: {person.known_for_department}</p>
            )}
            {person.birthday && (
              <p className="birthday">
                Born: {new Date(person.birthday).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {person.place_of_birth && ` in ${person.place_of_birth}`}
              </p>
            )}
            {person.popularity && (
              <p className="popularity">Popularity: {person.popularity.toFixed(1)}</p>
            )}
            {person.biography && (
              <div className="biography">
                <h3>Biography</h3>
                <p>{person.biography}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movies Section */}
      {movies.length > 0 && (
        <div className="cast-movies-section">
          <h2>Known For</h2>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="movie-poster">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Poster'
                    }
                    alt={movie.title}
                    loading="lazy"
                  />
                </div>
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  {movie.character && (
                    <p className="character">as {movie.character}</p>
                  )}
                  {movie.release_date && (
                    <p className="release-year">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                  {movie.vote_average > 0 && (
                    <p className="rating">⭐ {movie.vote_average.toFixed(1)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No movies message */}
      {movies.length === 0 && (
        <div className="no-movies">
          <p>No movie credits available.</p>
        </div>
      )}
    </div>
  );
};

export default CastDetails;
