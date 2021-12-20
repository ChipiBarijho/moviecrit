import React, { useEffect, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import './MediaDiscover.scss'
import { Link } from 'react-router-dom';
import StarsIcon from '@mui/icons-material/Stars';
import EventIcon from '@mui/icons-material/Event';
const moment= require('moment') 
// https://image.tmdb.org/t/p/original

function MediaDiscover() {
    const [topMovies, setTopMovies] = useState(null)
    
    function formatDate(date){
        const formattedDate = moment(date).format('DD MMM, YYYY')
        return formattedDate
    }

    useEffect(() => {
        const getTopMovies = async () =>{
            // const res = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/movies")
            const res = await axios.get("/movies")
            setTopMovies(res.data)
    
        }
        getTopMovies()
    }, [])
    return (
        <div className='MediaDiscover'>
            
            <Carousel showStatus={false} showArrows={false} showThumbs={false}  autoPlay={true} emulateTouch={true} infiniteLoop={true} stopOnHover={true}>
                {topMovies && topMovies.map(m =>(
                    <div key={m._id} className="MediaDiscover-image-container">
                        <div className='background'></div>
                        <div className='MediaDiscover-movie-details'>
                            <div className='MediaDiscover-title'>
                                <div>
                                    <h1>{m.movie}</h1>
                                    <div className='MediaDiscover-title-rating'>
                                        <StarsIcon fontSize={'small'} style={{color: '#ffe945', margin: '0px 2px'}}/>
                                        {m.rating}/10
                                    </div>
                                </div>
                                <div className='MediaDiscover-release'>
                                    <EventIcon fontSize={'small'}/>
                                    <span>{formatDate(m.release_date)}</span>
                                </div>
                            </div>
                            
                            <div>
                                <p>{m.description.slice(0,120)}...</p>
                            </div>
                            <Link to={`/movie/${m._id}`}>Check Movie</Link>
                        </div>
                        <img src={`https://image.tmdb.org/t/p/original${m.image}`} alt={m.movie} />
                    </div>

                ))}
            </Carousel>
        </div>
    )
}

export default MediaDiscover
