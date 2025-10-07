import Products from '../../components/Products/Products';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CategoriesBar from '../../components/CategoriesBar/CategoriesBar';

const response = await fetch('http://127.0.0.1:8000/api/products?include=images');

function Home() {
  return (
    <div>
      <Navbar />
      <CategoriesBar />
      <Products />
      <Footer />
    </div>
  );
}

export default Home;
