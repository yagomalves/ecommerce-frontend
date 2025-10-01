import Products from '../../components/Products/Products';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CategoriesBar from '../../components/CategoriesBar/CategoriesBar';

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
