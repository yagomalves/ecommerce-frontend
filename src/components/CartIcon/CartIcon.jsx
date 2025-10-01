import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

function CartIcon() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItemsCount();
  }, []);

  const fetchCartItemsCount = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8000/api/cart-items-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItemsCount(data.count);
      }
    } catch (error) {
      console.error('Erro ao carregar contagem do carrinho:', error);
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="cart-icon" onClick={handleCartClick}>
      🛒
      {cartItemsCount > 0 && (
        <span className="cart-badge">{cartItemsCount}</span>
      )}
    </div>
  );
}

export default CartIcon;