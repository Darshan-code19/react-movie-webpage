import React, { useState, useEffect } from 'react';
import Request from './Components/Requests/Request';
import Row from './Components/Row/Row';
import "./App.css";
import axios from "axios";
import Nav from "./Components/Navbar/Navbar";
import SearchRow from './Components/Row/SearchRow';
import Header from './Components/Header/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MoviePage from "./Components/Moviepage/index";
import CastList from "./Components/Cast/CastList";
import CastDetails from "./Components/Cast/CastDetails";
const baseURL = "https://api.themoviedb.org/3/";

const App = () => {
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    if (search.trim()) {
      axios.get(`${baseURL}${Request.searchMovies(search)}`)
        .then((res) => {
          setSearchList(res.data.results || []);
        })
        .catch((err) => console.error(err));
    } else {
      setSearchList([]); // reset when no search
    }
  }, [search]);

  return (
    <div>
      <BrowserRouter>
        <Nav setsearch={setSearch} />

        <Routes>
          {/* Home route */}
          <Route
            path="/"
            element={
              <>
                {/* Show Header only when no search */}
                {!search.trim() && (
                  <Header url={Request.fetchPopularMovies} />
                )}

                {/* Search Results */}
                {search.length > 0 ? (
                  <SearchRow title={search} searchList={searchList} />
                ) : (
                  ""
                )}

                {/* Movie Rows */}
                <Row url={Request.fetchPopularMovies} title="Popular Movies" />
                <Row url={Request.fetchUpcomingMovies} title="Upcoming Movies" />
                <Row url={Request.fetchTopRatedMovies} title="Top Rated Movies" />
              </>
              
            }
          />
          {/* Movie Details route */}
          <Route path="/movie/:id" element={<MoviePage />} />
          
          {/* Cast List route */}
          <Route path="/movie/:id/cast" element={<CastList />} />
          
          {/* Cast Details route */}
          <Route path="/person/:id" element={<CastDetails />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
