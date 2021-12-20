import { CircularProgress } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import './SearchResults.scss'
import axios from 'axios'
import { UserContext } from '../../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../contexts/ThemeContext';
const moment = require('moment')

function SearchResults({searchValue, setSearchValue}) {
    const [movieData, setMovieData] = useState(null)
    const [userContext, setUserContext] = useContext(UserContext)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)

    let navigate = useNavigate()
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchValue) {
                const res = await axios.get(`/movies/search?q=${searchValue}`)
                if (res.status === 200) {
                    setMovieData(res.data);
                } else if (res.status === 204) {
                    setMovieData(204)   
                }
            }
            
          }, 1000)
        return () => {
            clearTimeout(delayDebounceFn)
            setMovieData(null)
        }
    }, [searchValue])

    const handleMovieClick = (movieId)=>{
        navigate(`/movie/${movieId}`)
        setSearchValue(null)
    }

    return (
        <div className='SearchResults'>
            {searchValue && searchValue.length && <div className={isDarkMode ? "SearchResults-container SearchResults-container-dark" : "SearchResults-container"}>
                {!movieData && <CircularProgress sx={{margin: '20px auto'}}/>}
                {movieData == 204 && <div className='SearchResults-not-found' style={isDarkMode ? {color: 'white'} : {color: 'black'}}>{userContext.token ? 'Movie not found, please click on the plus icon to add it': "Movie not found. Please log in to add it to MovieCrit's database"}</div>}
                {movieData && movieData !== 204 && 
                    movieData.map((m, index) =>{
                        return <div key={m._id}> 
                        
                            <Link to={`/movie/${m._id}`}><div  className='SearchResults-single-movie' onClick={()=>{handleMovieClick(m._id)}}>
                                <div className='SearchResults-movie-image'>
                                    <img src={`https://image.tmdb.org/t/p/original/${m.poster_path}`} alt="" />
                                </div>
                                
                                <div className="SearchResults-movie-title">
                                    <h4>{m.original_title}</h4>
                                    <span>({moment(m.release_date).format('YYYY')})</span>
                                </div>
                                
                                
                            </div></Link>
                            {index < movieData.length - 1 && <div className='separator'></div>}
                        </div>
                    })
                
                }
            </div>}
        </div>
    )
}

export default SearchResults
