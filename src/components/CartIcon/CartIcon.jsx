import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

function CartIcon() {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className="cart-icon" onClick={handleCartClick}>
      🛒
    </div>
  );
}

export default CartIcon;