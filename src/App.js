import {BrowserRouter as Router ,Routes ,Route} from 'react-router-dom';
import Home from './frontend/Home';
import Inform from './frontend/Inform'
import Listing from './frontend/Listing';
import Register from'./frontend/Register';
import Login from './frontend/Login';

function App() {
  return (
    <Router>
      <Routes>
         <Route path='/' element={<Login/>}/>
         <Route path='/Register' element={<Register/>}/>
         <Route path='/Login' element={<Login/>}/>
         <Route path='/Home' element={<Home/>}/>
         <Route path='/Inform' element={<Inform/>}/>
         <Route path='/Listing' element={<Listing/>}/>
      </Routes> 
    </Router>
  );
}

export default App;
