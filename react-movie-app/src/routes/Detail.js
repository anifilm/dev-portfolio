import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Detail() {
  const { id } = useParams();

  const getMovieDetail = async () => {
    const response = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    const json = await response.json();
    console.log(json);
  };

  useEffect(() => {
    getMovieDetail();
  // eslint-disable-next-line
  }, []);

  return <h1>Detail</h1>;
}

export default Detail;
