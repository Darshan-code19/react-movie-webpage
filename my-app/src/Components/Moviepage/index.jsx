// // Components/Moviepage/index.jsx
// import React,{useState,useEffect} from 'react'
// import "./index.css"
// import {useParams} from "react-router-dom"

// const baseURL="https://api.themoviedb.org/3/"
// const api_key = "6c8667169423f0631688a2422e5ebc69";
// const MoviePage = () => {
//   const [movie, setmovie] = useState([]);
//   const {id}=useParams()
//   useEffect(() => {
//     fetch(`${baseURL}movie/${id}?api_key=${api_key}&language=en-US`)
//     .then(res=>res.json())
//     .then(data=>setmovie(data))
//   }, [id]);
//   const handleback=()=>{
//     window.history.back()
//   }
//   return (
//    <div
//   className='movie-page'
//   style={{
//     backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     height: "400px",
//     color: "white"
//   }}
// >
//   <div className="movie-title">{movie.original_title}</div>
// </div>
//   )
// }

// export default MoviePage;



import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import './index.css';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'ab1da08307f82007e9975d4dccf67670';

const FALLBACK_BACKDROP = 'https://via.placeholder.com/1280x720?text=No+Backdrop';
const FALLBACK_POSTER = 'https://via.placeholder.com/500x750?text=No+Poster';

const MoviePage = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [trailer, setTrailer] = useState(null);
	const [cast, setCast] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchMovieData = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			const [movieRes, videoRes, creditsRes] = await Promise.all([
				fetch(`${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`),
				fetch(`${BASE_URL}movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
				fetch(`${BASE_URL}movie/${id}/credits?api_key=${API_KEY}&language=en-US`)
			]);

			if (!movieRes.ok) throw new Error('Failed to load movie');

			const movieData = await movieRes.json();
			const videoData = await videoRes.json();
			const creditsData = await creditsRes.json();

			setMovie(movieData);
			const officialTrailer = (videoData.results || []).find(v =>
				['Trailer', 'Teaser'].includes(v.type) && v.site === 'YouTube'
			) || videoData.results?.[0] || null;
			setTrailer(officialTrailer);
			setCast((creditsData.cast || []).slice(0, 16));
		} catch (err) {
			console.error(err);
			setError(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => { fetchMovieData(); }, [fetchMovieData]);

	const handleBack = () => window.history.back();

	const backdrop = movie?.backdrop_path
		? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
		: FALLBACK_BACKDROP;

	const poster = movie?.poster_path
		? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
		: FALLBACK_POSTER;

	if (loading) {
		return (
			<div className="movie-loading">
				<div className="spinner" aria-label="Loading movie details" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="movie-error">
				<p>{error}</p>
				<button onClick={fetchMovieData}>Retry</button>
				<button onClick={handleBack}>Back</button>
			</div>
		);
	}

	return (
		<div className="movie-page" style={{ '--backdrop-image': `url(${backdrop})` }}>
			<div className="hero" role="banner" aria-label={movie.original_title}>
				<div className="overlay">
					<img className="poster" src={poster} alt={`${movie.original_title} poster`} loading="lazy" />
					<div className="details">
						<h1>{movie.original_title}</h1>
						{movie.tagline && <p className="tagline">{movie.tagline}</p>}
						<p className="meta">
							{movie.release_date?.slice(0, 4)} • {movie.runtime}m • ⭐ {movie.vote_average?.toFixed(1)}
						</p>
						{movie.genres?.length > 0 && (
							<p className="genres">{movie.genres.map(g => g.name).join(' • ')}</p>
						)}
						<p className="overview">{movie.overview}</p>
						<div className="actions">
							{trailer && (
								<a className="btn primary" href="#trailer" aria-label="Jump to trailer">Watch Trailer</a>
							)}
							<button className="btn" onClick={handleBack}>Back</button>
						</div>
					</div>
				</div>
			</div>

			{trailer && (
				<section id="trailer" className="trailer-section" aria-label="Trailer">
					<div className="trailer-wrapper">
						<YouTube
							videoId={trailer.key}
							className="trailer-iframe"
							opts={{
								width: '100%',
								height: '100%',
								playerVars: { modestbranding: 1, rel: 0 }
							}}
						/>
					</div>
				</section>
			)}

			{cast.length > 0 && (
				<section className="cast-section" aria-label="Cast">
					<div className="cast-header">
						<h2>Top Cast</h2>
						<button 
							className="view-all-cast-btn" 
							onClick={() => window.location.href = `/movie/${id}/cast`}
						>
							View Full Cast →
						</button>
					</div>
					<div className="cast-grid">
						{cast.map(member => (
							<div key={member.cast_id || member.credit_id} className="cast-card">
								<img
									src={member.profile_path ? `https://image.tmdb.org/t/p/w185/${member.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
									alt={member.name}
									loading="lazy"
								/>
								<div className="cast-info">
									<p className="cast-name">{member.name}</p>
									<p className="cast-character">{member.character}</p>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
};

export default MoviePage;