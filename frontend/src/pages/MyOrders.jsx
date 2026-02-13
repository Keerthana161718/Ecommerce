import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your orders");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) return <p className="center">Loading orders...</p>;

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="orders-page center-wrap">
        <div className="orders-card">
          <h2>Login Required</h2>
          <p>{error}</p>
          <button className="btn primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ================= EMPTY ================= */

  if (!orders.length) {
    return (
      <div className="orders-page center-wrap">
        <div className="orders-card">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <button className="btn primary" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ================= MAIN ================= */

  return (
    <div className="orders-page">
      <div className="container">


        <div className="orders-list">

          {orders.map(order => (
            <div key={order._id} className="order-item">

              {/* LEFT IMAGE */}
              <Link
                to={`/product/${order.orderItems?.[0]?.product?._id}`}
                className="order-img"
              >
                <img
                  src={
                    order.orderItems?.[0]?.product?.images?.[0]?.url ||
                    order.orderItems?.[0]?.product?.images?.[0]
                  }
                  alt=""
                />
              </Link>

              {/* INFO */}
              <div className="order-info">
                <h3>
                  {order.orderItems?.[0]?.product?.name || "Product"}
                </h3>

                <p>Qty: {order.orderItems?.[0]?.qty}</p>

                <p className="order-id">
                  Order: {order._id.slice(-8).toUpperCase()}
                </p>

                <p>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="price">₹{order.totalPrice}</p>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="order-actions">

                <span
                  className={`status-badge status-${order.status || "pending"}`}
                >
                  {(order.status || "pending").toUpperCase()}
                </span>

                <button
                  className="details-btn"
                  onClick={() =>
                    navigate(`/order-details/${order._id}`)
                  }
                >
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
