import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer"; // Importe o Footer
import ProductCard from "../../components/ProductCard/ProductCard";
import "./AllProducts.css";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        setLoading(true);
        // Usa a rota normal mas com o parâmetro ?all=true
        const res = await axios.get("http://127.0.0.1:8000/api/products?all=true");
        const productList = res.data; // ← Note: res.data (sem .data) porque não é paginado

        console.log('Produtos recebidos:', productList); // Para debug

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
        console.error("URL tentada:", error.config?.url);
        console.error("Status:", error.response?.status);
      } finally {
        setLoading(false);
      }
    }

    fetchAllProducts();
  }, []);

  return (
    <>
      {/* Navbar no topo */}
      <Navbar />
      
      {/* Conteúdo principal */}
      <div className="products-container">
        <div className="products-header">
          <h1>Todos os Produtos</h1>
          <p>Confira nosso catálogo completo</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando todos os produtos...</p>
          </div>
        ) : (
          <>
            <div className="products-info">
              <h2>Catálogo Completo</h2>
              <span className="products-count">{products.length} produtos encontrados</span>
            </div>
            
            {products.length === 0 ? (
              <div className="no-products">
                <p>Nenhum produto encontrado.</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer na base */}
      <Footer />
    </>
  );
}

export default AllProducts;