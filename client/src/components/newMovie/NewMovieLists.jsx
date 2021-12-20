import React, { useEffect, useState } from 'react'
import './NewMovieLists.scss'
import axios from 'axios'

function NewMovieLists({ movies, created, exists }) {
  const [movie, setMovie] = useState({ id: null })
  const [resAddMovie, setResAddMovie] = useState({id: null, status: null})

  useEffect(() => {
    if (resAddMovie.status === 201) {
      created.setCreated(true)
      exists.setExists(false)
    } else if (resAddMovie.status === 409) {
      exists.setExists(true)
      created.setCreated(false)
    }
  }, [resAddMovie])
  const handleAddMovie = async () => {
    try {
      const res = await axios.post('/movies/new', { id: movie.id })
      if (res.status === 201) {
        setResAddMovie({id: movie.id, status: res.status})
      }
    } catch (error) {
      setResAddMovie({id: movie.id, status: 409})
    }
  }


  return (
    <div className='NewMovieLists'>
      <div className='NewMovieLists-items-container'>
        {movies && movies.map(m => (
          <div key={m.id} className='NewMovieLists-item' style={{ borderStyle: m.id === movie.id ? 'solid' : 'none', borderColor: m.id === movie.id ? '#3fda80' : 'none', transform: m.id === movie.id ? 'scale(1.1)' : '' }} onClick={() => { if (m.id !== movie.id) { setMovie({ id: m.id }) } else if (m.id === movie.id) { setMovie({ id: null }) } }}>
            <img src={`https://image.tmdb.org/t/p/original${m.poster_path}`} alt={m.original_title} style={{ opacity: m.id === movie.id ? '0.6' : '1' }} />
            <p>{m.original_title}</p>
          </div>
        ))}
      </div>
      {movie.id && <button className='NewMovieLists-add-btn' onClick={handleAddMovie}>Add Movie</button>}
      {created.created && <p className='NewMovieLists-add-success'>Movie succesfully added to MovieCrit's database</p>}
      {exists.exists && <p className='NewMovieLists-add-failure'>Movie already exists in MovieCrit's database</p>}
    </div>
  )
}

export default NewMovieLists
