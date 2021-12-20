import MediaDiscover from "./components/MediaDiscover"
import LatestReviews from "./components/LatestReviews";
import InTheatres from "./components/InTheatres";
import TopGenre from './components/TopGenre'
import './Home.scss'
import { ThemeContext } from "../../contexts/ThemeContext";
import { useContext} from "react";


function Home() {
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
   

    return (
        <div className={isDarkMode ? "Home-dark" : ''}>
            <div className='Home'>
                <MediaDiscover />
                <LatestReviews />
                <InTheatres />
                <TopGenre />
            </div>
        </div>
    )
}

export default Home
