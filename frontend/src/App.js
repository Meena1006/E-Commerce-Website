
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import PlaceOrder from './pages/PlaceOrder';
import ShopCategory from './pages/ShopCategory';
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import LoginSignup from "./pages/LoginSignup"
import Shop from "./pages/Shop"
import Footer from './components/Footer/Footer';
import men_banner from "./components/Assets/banner_mens.png"
import women_banner from "./components/Assets/banner_women.png"
import kids_banner from "./components/Assets/banner_kids.png"


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Shop/>}/>
        <Route path='/men' element={<ShopCategory banner={men_banner} category="men" />}/>
        <Route path='/women' element={<ShopCategory banner={women_banner} category="women"/>}/>
        <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>
        <Route path='/product' element={<Product/>}>
              <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>

      

        
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
