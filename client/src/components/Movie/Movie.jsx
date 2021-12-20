import React, { useContext, useEffect, useState } from 'react'
import MovieContent from './components/MovieContent'
import MovieReviews from './components/MovieReviews'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios'
import { ThemeContext } from '../../contexts/ThemeContext'
import './Movie.scss'

function Movie() {
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    const [movie, setMovie] = useState([])
    const [genre, setGenre] = useState([])
    const [director, setDirector] = useState({name: null, img: null})
    const params = useParams() 
    let navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        const getMovie = async () =>{
            const res = await axios.get("/movies/" + params.id)
            if (res.status === 200) {
                setMovie(res.data)
                if (res.data.genres) {
                    const genreArray = []
                    const genres = res.data.genres.map(g =>{
                        return genreArray.push(g.name)
                    })
                    setGenre(genreArray)
                    const director = res.data.credits.crew.map(d => {
                        if (d.job === 'Director' ) {
                            setDirector({name: d.name, img: d.profile_path})
                        }
                    })
                    
                }
            } else if (res.status === 204){
                navigate('/404')
            }
        }
        getMovie()
    }, [params])

    return (
        <div key={params.id} className={isDarkMode ? 'Movie-dark' : 'Movie'} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <MovieContent movie={movie} genre={genre} director={director}/>
            <MovieReviews location={location}/>
            
        </div>
    )
}

export default Movie
