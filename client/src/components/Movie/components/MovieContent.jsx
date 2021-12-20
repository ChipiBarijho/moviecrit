import StarsIcon from '@mui/icons-material/Stars';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React, { useContext, useEffect, useState } from 'react'
import './MovieContent.scss'
// import axios from 'axios'
// import {useParams} from 'react-router-dom'
import YoutubeTrailer from './YoutubeTrailer';
import { ThemeContext } from '../../../contexts/ThemeContext';
const moment = require('moment')


function MovieContent({movie, genre, director}) {
    const [trailer, setTrailer] = useState(false)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)

    const backgroundPoster = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`

    function timeConvert(n) {
        const num = n;
        const hours = (num / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "m";
    }
    return (
        <div className='MovieContent'>
            <div className="background"></div>
            {trailer && <YoutubeTrailer youtubeId={movie.trailer.key} setTrailer={setTrailer}/>}
            {movie.length !== 0 &&
            <div className="MovieContent-banner" style={{backgroundImage: `url(${backgroundPoster})`, backgroundRepeat:"no-repeat", backgroundSize: 'cover'}}>
                <div className="background"></div>
                <div className="MovieContent-banner-container">
                    <div className='MovieContent-banner-image'>
                        <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={movie.original_title} />
                        
                    </div>
                    <div className='MovieContent-banner-details'>
                        <div className="MovieContent-details-title">
                            <h1>{movie.original_title}</h1>
                            
                            {/* <span>({moment(movie.release_date).format('YYYY')})</span> */}
                        </div>
                        
                        <div className='MovieContent-details-subtitle'>
                            <div>
                                <StarsIcon fontSize={'small'} style={{color: '#ffe945', margin: '0px 2px'}}/>
                                <p>{movie.vote_average}/10</p>
                            </div>
                            <div className='MovieContent-subtitle-date'>
                                <p>{moment(movie.release_date).format('DD/MM/YYYY')}</p>
                                <p>•</p>
                                <p>{genre.join(', ')}</p>
                                <p>•</p>
                                <p>{timeConvert(movie.runtime)}</p>
                            </div>
                        </div>
                        <div className='MovieContent-banner-trailer'>
                            {movie.trailer && <button onClick={() => {setTrailer(true)}}><PlayArrowIcon style={{marginRight: '4px'}}/>Watch Trailer</button>}
                        </div>
                        <div className='MovieContent-banner-tagline'>{movie.tagline}</div>
                        <div className='MovieContent-banner-description'>
                            <h3>Overview</h3>
                            <p>{movie.overview}</p>
                            <div className='MovieContent-description-director'>
                                <h4>Director</h4>
                                
                                <p>{director.name}.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            }
            {movie.length !== 0 && <h2 className='MovieContent-cast-title'>Cast</h2>}
            {movie.length !== 0 &&
                <div className="MovieContent-cast">
                    <div className='MovieContent-cast-container'>
                        {movie.credits.cast.map(c =>{
                            return <div key={c.id} className={isDarkMode ? "MovieContent-person MovieContent-person-dark": 'MovieContent-person'}>
                            <img src={`https://image.tmdb.org/t/p/original/${c.profile_path}`} alt="" />
                            <div className='MovieContent-person-details'>
                                <p>{c.name}</p>
                                <p>{c.character}</p>
                            </div>
                            </div>
                        })}
                    </div>
                </div>
            }
            <div className='separator'></div>
        </div>
    )
}

export default MovieContent
