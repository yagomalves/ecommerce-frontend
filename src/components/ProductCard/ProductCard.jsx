import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const imageErrorRef = useRef(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const navigate = useNavigate();

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
        console.log('Produto adicionado ao carrinho!', data);
        
        // Limpa a mensagem após 2 segundos
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
    navigate(`/product/${product.id}`);
  };

  const handleImageError = (e) => {
    if (!imageErrorRef.current) {
      imageErrorRef.current = true;
      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
    }
  };

  return (
    <div className="pc-card" onClick={handleViewDetails}>
      <div className="pc-image-container">
        <img 
          src={product.imageUrl}
          alt={product.name}
          className="pc-image"
          onError={handleImageError}
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