import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Movie.module.css';

const Movie = ({ id, coverImg, title, year, summary, genres, genresIds }) => {
  return (
    <div className={styles.movie}>
      {coverImg ? (
        <img
          src={`https://image.tmdb.org/t/p/w500/${coverImg}`}
          alt={title}
          className={styles.movie__img}
        />
      ) : (
        <img
          src={`https://m.media-amazon.com/images/S/sash/4FyxwxECzL-U1J8.png`}
          alt={title}
          className={styles.movie__img}
        />
      )}
      <div>
        <h2 className={styles.movie__title}>
          {title}
          {/*<Link to={`/movie/${id}`}>{title}</Link>*/}
        </h2>
        <h3 className={styles.movie__year}>{year}</h3>
        <p>{summary.length > 235 ? `${summary.slice(0, 235)}...` : summary}</p>
        <ul className={styles.movie__genres}>
          {genresIds.map((ids) => (
            <li key={ids}>{genres.map((gen) => gen.id === ids && gen.name)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.object).isRequired,
  genresIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Movie;
