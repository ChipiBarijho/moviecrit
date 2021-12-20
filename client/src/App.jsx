import './App.css';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter} from "react-router-dom";
import Container from './components/Container/Container';
import axios from "axios";


function App() {
  // Proxy to api
  axios.defaults.baseURL = 'http://localhost:4000';  

  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <ThemeProvider>
            <Container />
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
