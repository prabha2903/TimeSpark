import React, { useEffect, useState } from "react";
import { brandPageStyles } from "../assets/dummyStyles";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import axios from "axios";

/* 🔴 CHANGED: https → http (VERY IMPORTANT) */
const API_BASE = "https://timespark-t0e4.onrender.com";

const BrandPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const { addItem, cart, increment, decrement } = useCart();

  const [brandWatches, setBrandWatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // fetch watches by brand
  useEffect(() => {
    if (!brandName) return;

    let cancelled = false;

    const fetchWatches = async () => {
      setLoading(true);
      setError(null);
      try {
        /* 🔴 CHANGED: brands → brand (route fix) */
        const url = `${API_BASE}/api/watches/brands/${encodeURIComponent(
          brandName
        )}`;

        const resp = await axios.get(url);

        const items = resp?.data?.items ?? resp?.data ?? [];

        const mapped = items.map((it) => {
          const rawPrice =
            typeof it.price === "number"
              ? it.price
              : Number(String(it.price ?? "").replace(/[^0-9.-]+/g, "")) || 0;

          let img = it.image ?? "";
          if (img.startsWith("/")) img = `${API_BASE}${img}`;

          return {
            id: String(it._id ?? it.id),
            name: it.name ?? "",
            desc: it.description ?? "",
            image: img || null,
            price: rawPrice,
            priceDisplay: `₹${rawPrice.toFixed(2)}`
          };
        });

        if (!cancelled) setBrandWatches(mapped);
      } catch (err) {
        if (!cancelled) setError("Failed to load watches. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWatches();
    return () => (cancelled = true);
  }, [brandName]);

  const findInCart = (id) =>
    cart.find(
      (p) => String(p.id) === String(id) || String(p.productId) === String(id)
    );

  // LOADING
  if (loading) {
    return (
      <div className={brandPageStyles.loadingContainer}>
        <p className={brandPageStyles.loadingText}>Loading watches...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className={brandPageStyles.notFoundContainer}>
        <div className={brandPageStyles.notFoundCard}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Go back
          </button>
        </div>
      </div>
    );
  }

  // NO DATA
  if (!brandWatches.length) {
    return (
      <div className={brandPageStyles.notFoundContainer}>
        <div className={brandPageStyles.notFoundCard}>
          <h2>No watches found</h2>
          <p>This brand has no watches listed yet.</p>
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Go back
          </button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className={brandPageStyles.mainContainer}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className={brandPageStyles.headerContainer}>
          <button
            className={brandPageStyles.backButton}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} /> Back
          </button>

          <h1 className={brandPageStyles.title}>
            {brandName} Collections
          </h1>
        </div>

        {/* Watches Grid */}
        <div className={brandPageStyles.grid}>
          {brandWatches.map((watch) => {
            const inCart = findInCart(watch.id);
            const qty = inCart?.qty ?? 0;

            return (
              <div key={watch.id} className={brandPageStyles.card}>

                {/* Image */}
                <div className={brandPageStyles.imageContainer}>
                  {watch.image ? (
                    <img
                      src={watch.image}
                      alt={watch.name}
                      className={brandPageStyles.image} // 🔴 CHANGED
                    />
                  ) : (
                    <div className={brandPageStyles.noImagePlaceholder}>
                      No Image
                    </div>
                  )}
                </div>

                {/* 🔴 CHANGED: Details wrapper */}
                <div className={brandPageStyles.detailsContainer}>

                  <h2 className={brandPageStyles.watchName}> {/* 🔴 CHANGED */}
                    {watch.name}
                  </h2>

                  <p className={brandPageStyles.watchDesc}> {/* 🔴 CHANGED */}
                    {watch.desc}
                  </p>

                  <div className={brandPageStyles.priceAndControls}> {/* 🔴 CHANGED */}
                    <p className={brandPageStyles.price}> {/* 🔴 CHANGED */}
                      {watch.priceDisplay}
                    </p>

                    {qty > 0 ? (
                      <div className={brandPageStyles.quantityContainer}> {/* 🔴 CHANGED */}
                        <button
                          className={brandPageStyles.quantityButton} // 🔴 CHANGED
                          onClick={() => decrement(watch.id)}
                        >
                          <Minus className={brandPageStyles.quantityIcon} />
                        </button>

                        <span className={brandPageStyles.quantityCount}> {/* 🔴 CHANGED */}
                          {qty}
                        </span>

                        <button
                          className={brandPageStyles.quantityButton} // 🔴 CHANGED
                          onClick={() => increment(watch.id)}
                        >
                          <Plus className={brandPageStyles.quantityIcon} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className={brandPageStyles.addButton} // 🔴 CHANGED
                        onClick={() =>
                          addItem({
                            id: watch.id,
                            productId: watch.id,
                            name: watch.name,
                            price: watch.price,
                            img: watch.image,
                            qty: 1
                          })
                        }
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
