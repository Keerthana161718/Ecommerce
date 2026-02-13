import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* ================= FETCH ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError({ message: "Please login to view wishlist", auth: true });
      setLoading(false);
      return;
    }

    api
      .getWishlist()
      .then((data) => {
        setWishlist(data || { products: [] });
      })
      .catch((e) =>
        setError({ message: e.message || "Failed to load wishlist" })
      )
      .finally(() => setLoading(false));
  }, []);

  /* ================= REMOVE ================= */

  const remove = async (id) => {
    try {
      await api.removeFromWishlist(id);

      // Update UI instantly
      setWishlist((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p._id !== id),
      }));
    } catch {
      alert("Remove failed");
    }
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async (productId) => {
    try {
      await api.addToCart({ productId, quantity: 1 });
      alert("Added to cart!");
    } catch (e) {
      alert(e.message || "Failed to add to cart");
    }
  };

  /* ================= STATES ================= */

  if (loading) return <p className="center">Loading wishlist...</p>;

  if (error)
    return (
      <div className="wish-page center-wrap">
        <div className="wish-empty">
          <h2>{error.auth ? "Login Required" : "Error"}</h2>
          <p>{error.message}</p>

          {error.auth && (
            <button
              className="primary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    );

  if (!wishlist.products.length)
    return (
      <div className="wish-page center-wrap">
        <div className="wish-empty">
          <h2>Your Wishlist is Empty</h2>
          <p>Add items you love to your wishlist ❤️</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );

  /* ================= UI ================= */

  return (
    <div className="wish-page">
      
      <div className="container">
        

        <div className="wish-list">
          {wishlist.products.map((p) => (
            <div className="wish-item" key={p._id}>
              
              {/* IMAGE */}
              <Link to={`/product/${p._id}`} className="wish-img">
                <img
                  src={p.images?.[0]?.url || p.images?.[0]}
                  alt={p.name}
                />
              </Link>

              {/* INFO */}
              <div className="wish-info">
                <h3>{p.name}</h3>
                <p className="stock">In Stock</p>
                <p className="price">₹{p.price}</p>
              </div>

              {/* ACTIONS */}
              <div className="wish-actions">
                <button
                  className="remove-btn"
                  onClick={() => remove(p._id)}
                >
                  Remove
                </button>

                <button
                  className="cart-btn"
                  onClick={() => addToCart(p._id)}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
