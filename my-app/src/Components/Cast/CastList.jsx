import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CastList.css';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '6c8667169423f0631688a2422e5ebc69';

const CastList = () => {
  const { id } = useParams(); // Get movie ID from URL
  const navigate = useNavigate();
  const [cast, setCast] = useState([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch movie details and cast information
    const fetchCastData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch movie details to get the title
        const movieResponse = await axios.get(
          `${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        setMovieTitle(movieResponse.data.original_title);

        // Fetch cast credits
        const creditsResponse = await axios.get(
          `${BASE_URL}movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        setCast(creditsResponse.data.cast || []);
      } catch (err) {
        console.error('Error fetching cast:', err);
        setError('Failed to load cast information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCastData();
    }
  }, [id]);

  // Navigate to cast member details page
  const handleCastClick = (personId) => {
    navigate(`/person/${personId}`);
  };

  // Navigate back to movie page
  const handleBackToMovie = () => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="cast-loading">
        <div className="spinner"></div>
        <p>Loading cast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cast-error">
        <p>{error}</p>
        <button onClick={handleBackToMovie}>Back to Movie</button>
      </div>
    );
  }

  return (
    <div className="cast-list-container">
      {/* Header Section */}
      <div className="cast-list-header">
        <button className="back-btn" onClick={handleBackToMovie}>
          ← Back to Movie
        </button>
        <h1>Full Cast of "{movieTitle}"</h1>
        <p className="cast-count">{cast.length} Cast Members</p>
      </div>

      {/* Cast Grid */}
      <div className="cast-grid">
        {cast.map((member) => (
          <div
            key={member.cast_id || member.credit_id}
            className="cast-card"
            onClick={() => handleCastClick(member.id)}
          >
            <div className="cast-image-wrapper">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w185/${member.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'
                }
                alt={member.name}
                loading="lazy"
              />
            </div>
            <div className="cast-info">
              <h3 className="cast-name">{member.name}</h3>
              <p className="cast-character">{member.character}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No cast message */}
      {cast.length === 0 && (
        <div className="no-cast">
          <p>No cast information available for this movie.</p>
        </div>
      )}
    </div>
  );
};

export default CastList;
