import './NewMovie.scss'
import NewMovieLists from './NewMovieLists';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import {ThemeContext} from '../../contexts/ThemeContext'

function NewMovie({ setOpenNewMovieModal }) {
  const [formData, setFormData] = useState('')
  const [movieString, setMovieString] = useState('')
  const [movies, setMovies] = useState('')
  const [created, setCreated] = useState(false)
  const [exists, setExists] = useState(false)
  const {isDarkMode, toggleTheme} = useContext(ThemeContext)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (exists || created) {
      setExists(false)
      setCreated(false)
    }
    setMovieString(formData)
  }
  useEffect(() => {
    if (movieString) {
      const movieStringEnc = encodeURIComponent(movieString.trim())
      const getMovies = async () => {
        try {
          const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&query=${movieStringEnc}&include_adult=false`)
          const { results } = res.data
          if (results.length <= 10) {
            setMovies(results)
          } else {
            const slicedResults = results.slice(0, 10);
            setMovies(slicedResults)
          }
        } catch (error) {
          console.log(error);
        }
      }
      getMovies()
    }
  }, [movieString])

  return (
    <div className={isDarkMode ? "NewMovie NewMovie-dark" : "NewMovie"}>
      <div className="NewMovie-background" onClick={() => { setOpenNewMovieModal(false) }}></div>
      <div className={isDarkMode ? 'NewMovie-container NewMovie-container-dark' : 'NewMovie-container'}>
        <CloseIcon onClick={() => { setOpenNewMovieModal(false) }} className='NewMovie-container-closebtn' />
        <h1>Add New Movie</h1>
        <div className='NewMovie-search-container'>
          <p>Movies obtained from <a href='https://themoviedb.org'>themoviedb.org</a></p>
          <form className='NewMovie-search-form' id='get-movie-form' onSubmit={handleSubmit}>
            <input placeholder='Search for a movie...' onChange={(e) => setFormData(e.target.value)} />
            <div className='NewMovie-search-icon'>
              <button type='submit' form='get-movie-form'>Search</button>
            </div>
          </form>
        </div>
        <NewMovieLists movies={movies} created={{created, setCreated}} exists={{exists, setExists}} />
      </div>
    </div>
  )
}

export default NewMovie