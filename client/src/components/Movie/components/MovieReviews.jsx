import React, { useContext, useEffect, useState } from 'react'
import './MovieReviews.scss'
import {UserContext} from '../../../contexts/UserContext'
import Rating from '@mui/material/Rating';
import axios from 'axios'
import {Link, useParams} from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import {ReadMore} from '../../utils/utils'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import StarsIcon from '@mui/icons-material/Stars';
import { ThumbUp } from '@mui/icons-material';
import { ThemeContext } from '../../../contexts/ThemeContext';
const moment = require('moment')

function MovieReviews(location) {
    const [userContext, setUserContext] = useContext(UserContext)
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    const [addReview, setAddReview] = useState(false)
    const [reviewId, setReviewId] = useState(null)
    const [reviewBody, setReviewBody] = useState('')
    const [ratingValue, setRatingValue] = useState(5)
    const [ratingFeedback, setRatingFeedback] = useState(5);
    const [isSending, setIsSending] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [deleteReview, setDeleteReview] = useState(null)
    const [likeReview, setLikeReview] = useState(null)
    const [likedReview, setLikedReview] = useState(null)
    const [sortBy, setSortBy] = useState('popular')
    const [reviews, setReviews] = useState(null)
    const params = useParams() // need params.id to get the id of the movie and then send the id on the post request to the api and use the id to find the movie in the db

    // Get reviews
    useEffect(() => {
        if (sortBy === 'popular') {
            const getReviews = async () =>{
                const res = await axios.post(`/movies/${params.id}/reviews`, {sortBy: sortBy})
                if (res.status === 200) {
                    setReviews(res.data)
                }
            }
            getReviews()
        } else if (sortBy === 'latest') {
            const getReviews = async () =>{
                const res = await axios.post(`/movies/${params.id}/reviews`, {sortBy: sortBy})
                if (res.status === 200) {
                    setReviews(res.data)
                }
            }
            getReviews()
        }
    }, [sortBy])

    const handleReviewSort = async (e) =>{
        setSortBy(e.target.value)
    }

    const handleReviewSubmit = async (e) =>{
        e.preventDefault()
        setIsSending(true)
        const res = await axios.post('/review/new', {body: reviewBody, rating: ratingValue, movieId: params.id }, {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}})
        if (res.status === 200) {
            setIsSending(false)
            window.location.reload(false);
        }
    }

    const handleEditReviewSubmit = async (e) =>{
        e.preventDefault()
        setIsSending(true)
        const res = await axios.put(`/review/${reviewId}`, {reviewId: reviewId, body: reviewBody, rating: ratingValue, authorId: userContext.currentUserId }, {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userContext.token}`}})
        if (res.status === 200) {
            setIsSending(false)
            setReviewBody(null)
            setIsEditing(false)
            setAddReview(false)
            setRatingValue(5)
            setRatingFeedback(5)
            setReviewId(null)
            window.location.reload(false);
        }
    }

    const handleDeleteReview = async (reviewId, authorId) =>{
        setDeleteReview(reviewId)
        setIsSending(true)
        const data = {reviewId, authorId}
        const res = await axios.delete(`/review/${reviewId}`, {headers: {'Authorization': `Bearer ${userContext.token}` }, data: data})
        if (res.status === 200) {
            setDeleteReview(null)
            setIsSending(false)
            window.location.reload(false);
        }
    }

    const singleReview = (reviewId) =>{
        if (reviewId === deleteReview) {
            return <CircularProgress size='20px' sx={{color: 'red'}}/>
        } else{
            return <DeleteOutlineIcon />
        }
    }

    const handleEditReview = (body, rating, reviewId) =>{
        setReviewBody(body)
        setIsEditing(true)
        setAddReview(true)
        setRatingValue(rating)
        setRatingFeedback(rating)
        setReviewId(reviewId)
    }

    const handleLike = async (reviewId) => {
        console.log(reviewId);
        if (!likeReview) {
            const res = await axios.post(`/review/${reviewId}/like`, {currentUserId: userContext.currentUserId})
            if (res.status === 200) {
                setLikeReview([reviewId])
            }
        } else if (likeReview.indexOf(reviewId) === -1) {
            
            const res = await axios.post(`/review/${reviewId}/like`, {currentUserId: userContext.currentUserId})
            if (res.status === 200) {
                setLikeReview(oldArray => [...oldArray, reviewId])
            }
        } else if (likeReview.indexOf(reviewId) !== -1) {
            const res = await axios.delete(`/review/${reviewId}/like`, {headers: {'Authorization': `Bearer ${userContext.token}` }})
            if (res.status === 200) {
                let index = likeReview.indexOf(reviewId)
                setLikeReview(likeReview => likeReview.filter((r, i) => i !== index))
            }
        }
    }

    const handleLiked = async (reviewId) =>{
        if (!likedReview) {
            const res = await axios.delete(`/review/${reviewId}/like`, {headers: {'Authorization': `Bearer ${userContext.token}` }})
            if (res.status === 200) {
                setLikedReview([reviewId])
            }
        } else if (likedReview.indexOf(reviewId) === -1) {
            const res = await axios.delete(`/review/${reviewId}/like`, {headers: {'Authorization': `Bearer ${userContext.token}` }})
            if (res.status === 200) {
                setLikedReview(oldArray => [...oldArray, reviewId])
            }
            
        } else if (likedReview.indexOf(reviewId) !== -1) {
            const res = await axios.post(`/review/${reviewId}/like`, {currentUserId: userContext.currentUserId})
            if (res.status === 200) {
                let index = likedReview.indexOf(reviewId)
                setLikedReview(likedReview => likedReview.filter((r, i) => i !== index)) 
            }
            
        }
    }

    useEffect(() => {
        window.addEventListener("beforeunload", clearLocation);
        return () => {
          window.removeEventListener("beforeunload", clearLocation);
        };
      }, []);
    const clearLocation = (e) => {
        window.history.replaceState(null, '')
    };

    return (
        <div className="MovieReviews">
            {reviews && <div className="MovieReviews-title-and-add">
                <div className='MovieReviews-title'>
                    <h2>Reviews</h2>
                    <span>{reviews && reviews.length}</span>
                    <select value={sortBy} onChange={handleReviewSort}>
                        <option value="popular">Popular</option>
                        <option value="latest">Latest</option>
                    </select>
                </div>
                
                {userContext.token && !addReview && <button onClick={()=>{setAddReview(true)}}>Add Review</button>}
                {userContext.token && addReview && <button onClick={()=>{setAddReview(false)}}>Cancel</button>}
            </div>}
            
            {addReview && <div className={isDarkMode ? "MovieReviews-add-review-card MovieReviews-add-review-card-dark" : "MovieReviews-add-review-card"}>
                <form onSubmit={!isEditing ? handleReviewSubmit : handleEditReviewSubmit}>
                    <textarea name="" id="" cols="30" rows="12" onChange={e =>{setReviewBody(e.target.value)}} defaultValue={isEditing ? reviewBody : ''} style={isDarkMode ? {border: '1px solid gray'}: {border: 'none'}}></textarea>

                    <div className='form-rating'>
                        <Rating 
                            size='large'
                            value={ratingValue} 
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setRatingValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setRatingFeedback(newHover);
                            }}
                            max={10}
                            style={isDarkMode ? {backgroundColor: 'rgba(180, 180, 180, 0.2)', borderRadius: '20px'} : {borderRadius: '0'}}
                        />
                        <span className='form-rating-feedback'>{ratingFeedback !== -1 ? ratingFeedback : ratingValue}</span>
                    </div>

                    <div className='form-submit'>
                        {isEditing && <p style={{marginRight: '10px'}}>You can only edit your review once!</p>}
                        {isSending && <CircularProgress sx={{color: '#784BA0'}}/>}
                        <button disabled={isSending ? true : false}>{!isEditing? 'Submit Review' : 'Edit Review'}</button>
                    </div>
                </form>
            </div>}

            {reviews && reviews.map(r =>{
                return <div key={r._id} className={location.location.state && location.location.state.reviewId === r._id ? 'MovieReviews-review-card selected-review' : 'MovieReviews-review-card'} >
                    <div className="MovieReviews-review-card-container">
                        <div className='MovieReviews-review-card-profile'>
                            <div className='MovieReviews-profile-photo'>
                                
                                <Link to={`/user/${r.authorId._id}`}><img src={r.authorId.profileImg} alt="" /></Link>
                            </div>
                            <div className="MovieReviews-review-card-date">
                                <span>{moment(r.created_at).format('D MMM YY')}</span>
                            </div>
                            
                        </div>
                        <div className='MovieReviews-review-card-content'>
                            <div className="MovieReviews-review-content-user">
                                <Link to={`/user/${r.authorId._id}`} className='MovieReviews-review-user-name'>{r.authorId.firstName} {r.authorId.lastName}</Link>
                                <div className="MovieReviews-content-user-rating"><StarsIcon fontSize='small' style={{color: '#edc121', margin: '0px 4px', alignSelf: 'center'}} /> {r.rating}</div>
                                {r.edited && <div className="MovieReviews-content-user-edit">(edited)</div>}
                            </div>
                            <div className="MovieReviews-review-content-body">
                                <ReadMore>
                                    {r.body}
                                </ReadMore>
                            </div>
                        </div>
                        <div className="MovieReviews-review-content-buttons">

                            
                                <div className='MovieReviews-buttons-like-container'>
                                {r.likedBy.indexOf(userContext.currentUserId) === -1 ?
                                    <div>
                                        <div className={likeReview && likeReview.indexOf(r._id) !== -1 ? 'MovieReviews-liked-container-button' : 'MovieReviews-like-container-button'}>
                                            <ThumbUp onClick={() => {handleLike(r._id)}}/>
                                        </div>
                                        <span>{likeReview && likeReview.indexOf(r._id) !== -1 ? r.likes + 1 : r.likes}</span>
                                    </div> 
                                    :
                                    <div>
                                        <div className={likedReview && likedReview.indexOf(r._id) !== -1 ? 'MovieReviews-like-container-button' : 'MovieReviews-liked-container-button'}>
                                            <ThumbUp onClick={() => {handleLiked(r._id)}}/>
                                        </div>
                                        <span>{likedReview && likedReview.indexOf(r._id) !== -1 ? r.likes - 1 : r.likes}</span>
                                    </div>
                                }
                                </div>
                            
                            {r.authorId._id === userContext.currentUserId &&
                                <div>
                                    <div className='MovieReviews-button-remove'>
                                        {!isSending ? <DeleteOutlineIcon onClick={() => {handleDeleteReview(r._id, r.authorId._id)}}/> : singleReview(r._id)}
                                    </div>
                                    <div className="MovieReviews-button-edit">
                                        {r.edited === false && <EditIcon onClick={() => handleEditReview(r.body, r.rating, r._id)} sx={isDarkMode && {color: 'white'}} />}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            })}
            
        </div>
    )
}

export default MovieReviews
