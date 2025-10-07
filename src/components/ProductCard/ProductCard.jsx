import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const imageErrorRef = useRef(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  // Função para obter a URL da imagem principal
  const getImageUrl = () => {
    // Tenta acessar as imagens do relacionamento
    if (product.images && product.images.length > 0) {
      return product.images[0].image_url;
    }
    
    // Fallback para outras propriedades possíveis
    if (product.image_url) return product.image_url;
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    if (product.main_image) return product.main_image;
    
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    try {
      setAddingToCart(true);
      setCartMessage('');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/cart-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
          price: product.price
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCartMessage('✅ Adicionado ao carrinho!');
        
        setTimeout(() => {
          setCartMessage('');
        }, 2000);
      } else {
        setCartMessage('❌ Erro ao adicionar');
        console.error('Erro ao adicionar ao carrinho:', data);
      }
    } catch (error) {
      setCartMessage('❌ Erro de conexão');
      console.error('Erro:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleImageError = (e) => {
    if (!imageErrorRef.current) {
      imageErrorRef.current = true;
      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="pc-card" onClick={handleViewDetails}>
      <div className="pc-image-container">
        {!imageLoaded && (
          <div className="pc-image-placeholder">Carregando...</div>
        )}
        <img 
          src={getImageUrl()}
          alt={product.name}
          className="pc-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        
        <div className="pc-overlay">
          <button className="pc-quick-view-btn">
            Visualizar
          </button>
        </div>
      </div>
      
      <div className="pc-info">
        <h3 className="pc-name">{product.name}</h3>
        <p className="pc-description">
          {product.description && product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description || "Descrição não disponível"}
        </p>
        
        <div className="pc-price-container">
          <span className="pc-price">R$ {parseFloat(product.price).toFixed(2)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="pc-original-price">
              R$ {parseFloat(product.original_price).toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="pc-actions">
          <button 
            className={`pc-add-to-cart-btn ${addingToCart ? 'loading' : ''} ${cartMessage ? 'success' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <>
                <div className="pc-loading-spinner"></div>
                Adicionando...
              </>
            ) : cartMessage ? (
              <>
                <span className="pc-cart-icon">✅</span>
                {cartMessage}
              </>
            ) : (
              <>
                <span className="pc-cart-icon">🛒</span>
                Adicionar ao Carrinho
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;