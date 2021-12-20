import { useContext, useEffect, useState } from "react";
import {UserContext} from '../../../contexts/UserContext'
import axios from "axios";
import './InTheatres.scss'
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';



function InTheatres() {
    const [missingMovies, setMissingMovies] = useState(null)
    const [addStatus, setAddStatus] = useState(null)
    const [nowPlaying, setNowPlaying] = useState(null)
    const [openLoginPopUp, setOpenLoginPopUp] = useState(false)
    const [userContext, setUserContext] = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {

        // Get current movies playing in theatres
        const getNowPlaying = async()=>{
            const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`)
            if (tmdbRes.status === 200) {
                const tmdbResults = tmdbRes.data.results
                setNowPlaying(tmdbResults)
                //Compare movies obtained from tmdbRes to movies in Movie Crit's database.
                // This is done so users can add missing movies to Movie Crit's database.
                const sendNowPlaying = async() =>{
                    const res = await axios.post(`/movies/checkdb`, tmdbResults)
                    if (res.status === 200) {
                        setMissingMovies(res.data)
                    }
                }
                sendNowPlaying()
            }
        }
        getNowPlaying()

        
    }, [])

    const handleAddMovie = async (movie) => {
        
        try {
          const res = await axios.post('/movies/new', { id: movie.id })
          if (res.status === 201) {
            const index = missingMovies.indexOf(movie.id)
            setMissingMovies(missingMovies => missingMovies.filter((r, i) => i !== index))
            setAddStatus({id: movie.id, status: 201})
          }
        } catch (error) {
            setAddStatus({id: movie.id, status: 409})
        }
    }

    const handleMovieClick = async(movie) =>{
        try{
            const res= await axios.get(`/movies/theatre/${movie.id}`)
            if (res.status === 200) {
                navigate(`/movie/${res.data[0]._id}`)

            }
        } catch (error){
           console.log(error);
        }
    }

    return (
        <div className="InTheatres">
            {openLoginPopUp && <div className="login-pop-up">
                <CloseIcon className="login-pop-up-close" onClick={()=>{setOpenLoginPopUp(false)}} />
                <span>You need to be signed in to add movies to MovieCrit's database</span>
            </div>}
            {nowPlaying &&
            <div className="InTheatres-container">
                
                <div className="InTheatres-content">
                    <h2>Now In Theatres</h2>
                    <div className="InTheatres-content-cards">
                        {nowPlaying.map(movie =>{
                            return <div key={movie.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%'}}>
                                <div className={missingMovies && missingMovies.indexOf(movie.id) === -1 ? "InTheatres-content-card hover-card" : "InTheatres-content-card"} onClick={missingMovies && missingMovies.indexOf(movie.id) === -1 ? ()=>{handleMovieClick(movie)}: null}>
                                    {missingMovies && missingMovies.indexOf(movie.id) !== -1 &&
                                    <div>
                                        <div className="InTheatres-content-card-add"></div>
                                        <AddIcon className="InTheatres-content-card-add-icon" fontSize='large' onClick={userContext.token ? ()=>{handleAddMovie(movie)} : ()=>{setOpenLoginPopUp(true)}}/>
                                        
                                    </div>}
                                    {addStatus && addStatus.id === movie.id && addStatus.status === 201 && <div className="InTheatres-content-card-success">
                                            <div></div>
                                            <span>Successfully added to MovieCrit's database</span>    
                                    </div>}
                                    
                                    <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" />
                                </div>
                                <h3>{movie.original_title}</h3>
                            </div>
                        })}
                    </div>
                </div>
                <div className="InTheatres-background">
                    <div style={{backgroundColor: '#154c74', width: '100%', height: '100%', position: 'absolute', opacity: '0.8'}}></div>
                    <img src={`https://image.tmdb.org/t/p/original/${nowPlaying[0].backdrop_path}`} alt="" className="InTheatres-img-background"/>
                </div>
            </div>
            
                
        }
        </div>
    )
}

export default InTheatres
