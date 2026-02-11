import React, { useMemo, useState, useEffect } from "react";
import { watchPageStyles } from "../assets/dummyStyles";
import { FILTERS as RAW_FILTERS } from "../assets/dummywdata";
import { useCart } from "../pages/CartContext";
import { Grid, Minus, Plus, ShoppingCart, User, Users } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const ICON_MAP = { Grid, User, Users };

const FILTERS = RAW_FILTERS?.length
  ? RAW_FILTERS.map((f) => ({ ...f, icon: ICON_MAP[f.iconName] ?? Grid }))
  : [
      { key: "all", label: "All", icon: Grid },
      { key: "men", label: "Men", icon: User },
      { key: "women", label: "Women", icon: Users },
    ];

const WatchPage = () => {
  const [filter, setFilter] = useState("all");
  const { cart, addItem, increment, decrement, removeItem } = useCart();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://timespark-t0e4.onrender.com";

  const mapServerToUI = (item) => {
    let img = item.image ?? "";
    if (typeof img === "string" && img.startsWith("/")) {
      img = `${API_BASE}${img}`;
    }

    const rawGender = String(item.category ?? "").toLowerCase();
    const gender =
      rawGender === "men"
        ? "men"
        : rawGender === "women"
        ? "women"
        : "unisex";

    return {
      id: item._id,
      name: item.name,
      price: item.price ?? 0,
      category: item.category ?? "",
      brand: item.brandName ?? "",
      description: item.description ?? "",
      img,
      gender,
    };
  };

  // ✅ FIXED FETCH
  useEffect(() => {
    let mounted = true;

    const fetchWatches = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${API_BASE}/api/watches?limit=10000`);
        const items = Array.isArray(resp.data?.data)
          ? resp.data.data
          : [];

        if (mounted) {
          setWatches(items.map(mapServerToUI));
        }
      } catch (err) {
        console.error("Failed to fetch watches:", err);
        if (mounted) {
          setWatches([]);
          toast.error("Failed to load watches");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWatches();
    return () => {
      mounted = false;
    };
  }, []);

  const getQty = (id) => {
    const items = Array.isArray(cart) ? cart : cart?.items ?? [];
    const match = items.find(
      (c) => String(c.productId ?? c.id ?? c._id) === String(id)
    );
    return match ? Number(match.qty ?? match.quantity ?? 0) : 0;
  };

  const filtered = useMemo(
    () =>
      watches.filter((w) =>
        filter === "all" ? true : w.gender === filter
      ),
    [filter, watches]
  );

  return (
    <div className={watchPageStyles.container}>
      <ToastContainer />

      <div className={watchPageStyles.headerContainer}>
        <div>
          <h1 className={watchPageStyles.headerTitle}>
            Timepieces <span className={watchPageStyles.titleAccent}>Curated</span>
          </h1>
          <p className={watchPageStyles.headerDescription}>
            A handpicked selection - clean presentation, zero borders.
          </p>
        </div>

        <div className={watchPageStyles.filterContainer}>
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`${watchPageStyles.filterButtonBase} ${
                  active
                    ? watchPageStyles.filterButtonActive
                    : watchPageStyles.filterButtonInactive
                }`}
              >
                <Icon className={watchPageStyles.filterIcon} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={watchPageStyles.loadingText}>Loading watches...</div>
      ) : filtered.length === 0 ? (
        <div className={watchPageStyles.noWatchesText}>No watches found.</div>
      ) : (
        <div className={watchPageStyles.grid}>
          {filtered.map((w) => {
            const sid = String(w.id);
            const qty = getQty(sid);

            return (
              <div key={sid} className={watchPageStyles.card}>
                <div className={watchPageStyles.imageContainer}>
                  <img
                    src={w.img}
                    alt={w.name}
                    className={watchPageStyles.image}
                    draggable={false}
                  />

                  <div className={watchPageStyles.cartControlsContainer}>
                    {qty > 0 ? (
                      <div className={watchPageStyles.cartQuantityControls}>
                        <button
                          onClick={() =>
                            qty > 1 ? decrement(sid) : removeItem(sid)
                          }
                          className={watchPageStyles.quantityButton}
                        >
                          <Minus />
                        </button>
                        <div className={watchPageStyles.cartQuantity}>{qty}</div>
                        <button
                          onClick={() => increment(sid)}
                          className={watchPageStyles.cartButton}
                        >
                          <Plus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addItem({
                            id: sid,
                            name: w.name,
                            price: w.price,
                            img: w.img,
                          })
                        }
                        className={watchPageStyles.addToCartButton}
                      >
                        <ShoppingCart />
                        Add
                      </button>
                    )}
                  </div>
                </div>

                <div className={watchPageStyles.productInfo}>
                  <h3 className={watchPageStyles.productName}>{w.name}</h3>
                  <p className={watchPageStyles.productDescription}>
                    {w.description}
                  </p>
                  <div className={watchPageStyles.productPrice}>₹{w.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchPage;
