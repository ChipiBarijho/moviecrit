import { useEffect, useState, useContext } from 'react'
import './LatestReviews.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {ThemeContext} from '../../../contexts/ThemeContext'

function LatestReviews() {
    const [latestReviews, setLatestReviews] = useState(null)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    const navigate = useNavigate()
    useEffect(() => {
        const getLatestReviews = async () =>{
            const res = await axios.get("/review/latest")
            setLatestReviews(res.data)
    
        }
        getLatestReviews()
    }, [])

    const handleClickReview = ( movieId, reviewId) =>{
        navigate(`/movie/${movieId}`, {state:{reviewId: reviewId}})
    }

    return (
        <div className='LatestReviews'>
            {latestReviews && <h2 style={isDarkMode ? {color: 'white'} : {color: 'rgb(0, 0, 0, 0.7)'}}>Latest Reviews</h2>}
            <div className="LatestReviews-cards-container">
                {latestReviews && latestReviews.map(r =>{
                    return <div key={r._id} className='LatestReviews-single-card'>
                        <div className='LatestReviews-card-user'>
                            <div className='LatestReviews-user-image'>
                                <img src={r.authorId.profileImg} alt="" />
                            </div>
                            <div className='LatestReviews-username'>
                                <div className="LatestReviews-username-name">{r.authorId.firstName ? `${r.authorId.firstName} ${r.authorId.lastName}`: r.authorId.username}</div>
                                <div className='LatestReviews-username-rating'>{r.rating}</div>
                            </div>
                            
                        </div>

                        <div className='LatestReviews-card-movie'>
                            <h3>{r.movieId.original_title}</h3>
                            <div className="LatestReviews-movie-bg"></div>
                            <img src={`https://image.tmdb.org/t/p/original/${r.movieId.backdrop_path}`} alt="" />
                        </div>
                        <div className="LatestReviews-card-check-review" onClick={()=>{handleClickReview(r.movieId._id, r._id)}}>
                            <span>Read Review</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default LatestReviews
