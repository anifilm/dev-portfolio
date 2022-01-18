import React, { useState, useEffect, useRef } from 'react';
import Movie from '../components/Movie';

import styles from './Home.module.css';

const api_key = process.env.REACT_APP_TMDB_API_KEY;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const inputRef = useRef();

  const getGenres = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`);
    const json = await response.json();
    //console.log(json.genres);
    setGenres(json.genres);
  }
  const getMovies = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${api_key}`);
    const json = await response.json();
    console.log(json.results);
    setMovies(json.results);
    setLoading(false);
  };
  const searchMovies = async (data) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${data}`);
    const json = await response.json();
    //console.log(json.results);
    setMovies(json.results);
    setLoading(false);
  };

  useEffect(() => {
    getGenres();
    getMovies();
  }, []);

  const onChange = (event) => {
    setSearch(event.target.value);
  };
  const onClick = () => {
    inputRef.current.select();
  }
  const onSubmit = (event) => {
    event.preventDefault();
    if (search.trim() === '') return;
    setLoading(true);
    searchMovies(search.trim());
    //setSearch('');
    inputRef.current.blur();
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={search}
            onChange={onChange}
            onClick={onClick}
            placeholder="search for..."
            ref={inputRef}
          />
          <button>search</button>
        </form>
      </div>
      {loading ? (
        <div className={styles.loader}>
          <span>Loading...</span>
        </div>
      ) : (
        <div className={styles.movies}>
          {movies.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              coverImg={movie.poster_path}
              title={movie.title}
              year={movie.release_date}
              summary={movie.overview}
              genres={genres}
              genresIds={movie.genre_ids}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
