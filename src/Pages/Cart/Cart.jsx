import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch("http://127.0.0.1:8000/api/cart-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        // Atualiza localmente
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/cart-items/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0
    );
  };

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  const continueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Carregando carrinho...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Meu Carrinho</h1>
          <button className="continue-shopping-btn" onClick={continueShopping}>
            ← Continuar Comprando
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione alguns produtos incríveis!</p>
            <button className="shop-now-btn" onClick={continueShopping}>
              Comprar Agora
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={
                        item.product.imageUrl ||
                        "https://via.placeholder.com/100x100?text=Produto"
                      }
                      alt={item.product.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p className="item-price">
                      R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    disabled={updating}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumo do Pedido</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={proceedToCheckout}>
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
