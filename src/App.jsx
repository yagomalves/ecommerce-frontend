import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import Profile from "./Pages/Profile/Profile";
import AllProducts from "./Pages/AllProducts/AllProducts";
import ProductDetail from './Pages/ProductDetail/ProductDetail';
import EditPersonal from "./Pages/EditPersonal/EditPersonal";
import EditContact from "./Pages/EditContact/EditContact";
import Cart from "./Pages/Cart/Cart";
import CategoryProducts from "./Pages/CategoryProducts/CategoryProducts";
import CreateProduct from "./Pages/CreateProduct/CreateProduct";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/profile/edit-personal" element={<EditPersonal />} />
        <Route path="/profile/edit-contact" element={<EditContact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/categories/:categoryId" element={<CategoryProducts/>} />  
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
