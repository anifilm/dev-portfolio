import axios from 'axios';
import _unionBy from 'lodash/unionBy';
import { writable, get } from 'svelte/store';

export const movies = writable([]);
export const message = writable('Search for the movie title!');
export const loading = writable(false);
export const theMovie = writable({});

export function initMovies() {
  movies.set([]);
  message.set('Search for the movie title!');
  loading.set(false);
}

export async function searchMovies(payload) {
  if (get(loading)) return;
  loading.set(true);
  message.set('');

  let total = 0;

  try {
    const res = await _fetchMovie({
      ...payload,
      page: 1
    });
    const { Search, totalResults } = res.data;
    movies.set(Search);
    total = parseInt(totalResults, 10);
  } catch (message) {
    movies.set([]);
    message.set(message);
    loading.set(false);
    return;
  }

  const pageLength = Math.ceil(total / 10);
  if (pageLength > 1) {
    for (let page = 2; page <= pageLength; page += 1) {
      if (page > (payload.number / 10)) break;
      const res = await _fetchMovie({
        ...payload,
        page: page
      });
      const { Search } = res.data;
      movies.update(($movies) => {
        return _unionBy($movies, Search, 'imdbID');
      });
    }
  }

  loading.set(false);
}

export async function searchMovieWithId(id) {
  if (get(loading)) return;
  loading.set(true);

  const res = await _fetchMovie({
    id: id
  });
  theMovie.set(res.data);

  loading.set(false);
}

function _fetchMovie(payload) {
  const { title, type, year, page, id } = payload;
  const OMDB_API_KEY = '8fd5eae9';

  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`;

  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(url);
      //console.log(res.data);
      if (res.data.Error) {
        reject(res.data.Error);
      }
      resolve(res);
    } catch (error) {
      console.log(error.response.status);
      reject(error.message);
    }
  });
}
