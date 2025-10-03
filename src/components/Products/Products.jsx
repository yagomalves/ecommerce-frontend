import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductsWithImages() {
      try {
        setLoading(true);
        // Usa a rota normal que retorna 15 produtos paginados
        const res = await axios.get("http://127.0.0.1:8000/api/products");
        const productList = res.data.data; // ← Note: res.data.data por causa da paginação

        const productsWithImages = await Promise.all(
          productList.map(async (product) => {
            try {
              const imgRes = await axios.get(`http://127.0.0.1:8000/api/product-images/${product.id}`);
              return {
                ...product,
                imageUrl: imgRes.data.image_url
              };
            } catch {
              return {
                ...product,
                imageUrl: "https://via.placeholder.com/300x200?text=No+Image"
              };
            }
          })
        );

        setProducts(productsWithImages);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsWithImages();
  }, []);

  const handleViewAllProducts = () => {
    navigate('/all-products');
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Yago Market</h1>
        <p>Encontre os melhores produtos com os melhores preços</p>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
      ) : (
        <>
          <div className="products-info">
            <h2>Produtos em Destaque</h2>
            <span className="products-count">
              {products.length} produtos
            </span>
          </div>
          
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                // ✅ AGORA O ProductCard RECEBE O PRODUCT COMPLETO COM SLUG
              />
            ))}
          </div>

          <div className="view-all-container">
            <button className="view-all-btn" onClick={handleViewAllProducts}>
              Ver Todos os Produtos
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;