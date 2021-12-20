import './ProfileRightSide.scss'
import { ThumbUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


function ProfileRightSide({userData, isDarkMode}) {
    let navigate = useNavigate()
    
    const handleReviewClick = (reviewId, movieId) =>{
        
        navigate(`/movie/${movieId}`, {state:{reviewId: reviewId}})
    }
   

    return (
        <div className="ProfileRightSide">
            <div className="ProfileRightSide-reviews-container">
                <h2>Latest Reviews</h2>
                {userData && userData.reviews.map(r =>{
                    return <div key={r._id} className='ProfileRightSide-reviews-single' onClick={()=>{handleReviewClick(r._id, r.movieId._id)}}>
                        <div className='ProfileRightSide-reviews-single-content'><span>{`${userData.firstName} ${userData.lastName}`}</span> reviewed <span>{r.movieId.original_title}</span> and gave it a rating of <span>{r.rating}/10</span></div>
                        <div className='ProfileRightSide-reviews-single-likes'>
                            <div className='ProfileRightSide-liked-container-button'>
                                <ThumbUp />
                            </div>
                            <span>{r.likes}</span>
                        </div>
                    </div>
                })}
            </div>
            <div className="ProfileRightSide-likedReviews-container">

            </div>
        </div>
    )
}

export default ProfileRightSide
