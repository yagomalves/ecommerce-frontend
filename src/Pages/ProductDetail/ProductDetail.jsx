import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./ProductDetail.css";

function ProductDetail() {
  const { slug } = useParams(); // ✅ Agora usando slug
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Novo estado para erro
  const [selectedImage, setSelectedImage] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        setError(null); // ✅ Limpa erros anteriores

        // ✅ Busca produto por SLUG
        const productRes = await axios.get(
          `http://127.0.0.1:8000/api/products/${slug}`
        );
        const productData = productRes.data;

        console.log("Dados completos do produto:", productData);

        setProduct({
          ...productData,
          images:
            productData.images?.length > 0
              ? productData.images
              : [
                  {
                    image_url:
                      "https://via.placeholder.com/600x400?text=No+Image",
                  },
                ],
        });

        setSeller(productData.user);
        setReviews(productData.reviews || []);
      } catch (error) {
        console.error("Failed to load product details:", error);
        console.error("URL tentada:", error.config?.url);
        console.error("Status:", error.response?.status);
        
        // ✅ MUDEI: Em vez de navegar imediatamente, apenas seta o erro
        setError("Produto não encontrado");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [slug]); // ✅ Removi navigate das dependências

  const handleAddToCart = () => {
    console.log(`Produto ${product.name} adicionado ao carrinho!`);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ Error state - mostra mensagem de erro sem redirecionar
  if (error) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>{error}</h2>
          <p>O produto que você está procurando não foi encontrado.</p>
          <button onClick={() => navigate("/")}>
            Voltar para página inicial
          </button>
          <button onClick={() => navigate("/all-products")} style={{marginLeft: '10px'}}>
            Ver Todos os Produtos
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ Se não tem produto (fallback)
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <h2>Produto não encontrado</h2>
          <button onClick={() => navigate("/")}>
            Voltar para página inicial
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // ✅ Renderização normal do produto
  return (
    <>
      <Navbar />

      <div className="product-detail-container">
        <div className="breadcrumb">
          <button onClick={() => navigate(-1)}>← Voltar</button>
          <span>/</span>
          <button onClick={() => navigate("/all-products")}>Produtos</button>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail-content">
          {/* Lado Esquerdo - Imagens do Produto */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  failedImages.has(selectedImage)
                    ? "https://via.placeholder.com/600x400?text=No+Image"
                    : product.images[selectedImage]?.image_url
                }
                alt={product.name}
                onError={() => {
                  setFailedImages((prev) => new Set(prev).add(selectedImage));
                }}
              />
            </div>

            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={
                      failedImages.has(index)
                        ? "https://via.placeholder.com/100x100?text=Img"
                        : image.image_url
                    }
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? "active" : ""}
                    onClick={() => setSelectedImage(index)}
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(index));
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Centro - Informações do Produto */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price">
              R$ {parseFloat(product.price).toFixed(2)}
            </div>

            <div className="stock-info">
              {product.stock_quantity > 0 ? (
                <span className="in-stock">
                  ✅ Em estoque ({product.stock_quantity} unidades)
                </span>
              ) : (
                <span className="out-of-stock">❌ Fora de estoque</span>
              )}
            </div>

            <div className="product-description">
              <h3>Descrição</h3>
              <p>
                {product.description || "Este produto não possui descrição."}
              </p>
            </div>

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity > 0
                  ? "🛒 Adicionar ao Carrinho"
                  : "Produto Indisponível"}
              </button>
            </div>
          </div>

          {/* Lado Direito - Informações do Vendedor */}
          <div className="seller-info">
            <h3>Informações do Vendedor</h3>
            {seller ? (
              <div className="seller-details">
                <div className="seller-avatar">
                  {seller.name?.charAt(0).toUpperCase()}
                </div>
                <div className="seller-data">
                  <h4>{seller.name}</h4>
                  <p>📧 {seller.email}</p>
                  {seller.profile?.phone && <p>📞 {seller.profile.phone}</p>}
                </div>
              </div>
            ) : (
              <p>Informações do vendedor não disponíveis</p>
            )}
          </div>
        </div>

        {/* Seção de Avaliações */}
        <div className="reviews-section">
          <h2>Avaliações do Produto</h2>

          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="reviewer-info">
                      <h4>{review.user?.name || "Usuário"}</h4>
                      <div className="rating">
                        {"⭐".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                        <span>({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">
              <p>Este produto ainda não possui avaliações.</p>
              <p>Seja o primeiro a avaliar!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetail;