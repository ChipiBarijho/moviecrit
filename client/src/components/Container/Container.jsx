import './Container.scss'
import { Route, Routes } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Home from '../Home/Home'
import Movie from '../Movie/Movie'
import Navbar from '../navbar/Navbar'
import Profile from '../Profile/Profile'
import NotFound from '../utils/NotFound/NotFound'
import {useContext} from 'react'
import {ThemeContext} from '../../contexts/ThemeContext'

function Container() {
    const {isDarkMode, toggleTheme} = useContext(ThemeContext)
    return (
        <div className={isDarkMode ? 'Container Container-dark' : 'Container'}>
            <Navbar />
            <Routes>
              <Route  path='*' element={<NotFound />} />
              <Route exact path='/' element={<Home />} />
              <Route exact path='/movie/:id' element={<Movie />} />
              <Route exact path='/user/:id' element={<Profile />}/>
            </Routes>
            <Footer /> 
        </div>
    )
}

export default Container
