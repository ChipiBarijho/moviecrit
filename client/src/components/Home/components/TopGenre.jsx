import './TopGenre.scss'
import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { ThemeContext } from '../../../contexts/ThemeContext'
import {Link} from 'react-router-dom'

function TopGenre() {
    const [genres, setGenres] = useState(null)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    useEffect(() => {
       
        const getTopGenre = async () =>{
            const res = await axios.get('/movies/topgenres')
            if (res.status === 200) {
                // console.log(res.data);
                setGenres(res.data)
            }
        }

        getTopGenre()

        
    }, [])
 

    return (
        <div className="TopGenre" style={isDarkMode ? {color:'white'} : {color: 'rgb(0, 0, 0, 0.7)'}}>
            {genres && genres.map(genre => {
                return <div className='TopGenre-genre-container' key={genre.name} >
                    <h2>{genre.name} Movies</h2>
                    <div className="TopGenre-cards">
                    {genre.data.map(movie =>{
                        return <Link to={`/movie/${movie._id}`} style={isDarkMode ? {color:'white'} : {color: 'rgb(0, 0, 0, 0.7)'}} key={movie._id}><div className='TopGenre-movie-container' >
                            <div className='TopGenre-single-card'>

                                <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" />
                            </div>
                            <div className="TopGenre-movie-title">
                                <h4>{movie.original_title}</h4>
                            </div>
                        </div></Link>
                    })}
                    </div>
                </div>
            })}
        </div>
    )
}

export default TopGenre
