import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Truck,
  Bell,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Printer,
  DollarSign,
  Users,
  Menu,
  Package,
  History,
  Calendar,
  Database,
  BarChart3,
  Download,
  TrendingUp,
  FileText,
} from "lucide-react";

/*
  IMPORTANT:
  This must point to a REAL backend.
  Vercel frontend URL WILL NOT work unless API routes exist.
*/
const API_URL = "https://restorunt-virid.vercel.app";

function T() {
  const [cart, setCart] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const [showCart, setShowCart] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const [databaseStats, setDatabaseStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  /* ---------------- FETCH MENU ---------------- */
  const fetchFoodItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/menu`);
      if (!res.ok) throw new Error("Menu fetch failed");
      const data = await res.json();
      setFoodItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching food items:", err);
      setError("Failed to load menu items.");
    }
  };

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/hist`);
      if (!res.ok) throw new Error("Order fetch failed");
      const data = await res.json();
      const orders = Array.isArray(data) ? data : [];
      setOrderHistory(orders);
      calculateDatabaseStats(orders);
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError("Failed to load order history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
    fetchOrderHistory();
  }, []);

  /* ---------------- STATS ---------------- */
  const calculateDatabaseStats = (orders) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(
      (o) => o.date?.split("T")[0] === today
    );
    const todayRevenue = todayOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );

    setDatabaseStats({
      totalOrders,
      totalRevenue,
      totalTransactions: totalOrders,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      todayOrders: todayOrders.length,
      todayRevenue,
    });
  };

  /* ---------------- FILTERS ---------------- */
  const priceRanges = [
    { id: "all", min: 0, max: Infinity },
    { id: "under10", min: 0, max: 10 },
    { id: "10to20", min: 10, max: 20 },
    { id: "20to30", min: 20, max: 30 },
    { id: "over30", min: 30, max: Infinity },
  ];

  const filteredItems = useMemo(() => {
    let items = [...foodItems];

    if (searchTerm) {
      items = items.filter((i) =>
        i.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== "all") {
      items = items.filter((i) => i.category === activeCategory);
    }

    if (priceFilter !== "all") {
      const range = priceRanges.find((r) => r.id === priceFilter);
      if (range) {
        items = items.filter(
          (i) => i.price >= range.min && i.price <= range.max
        );
      }
    }

    if (sortOrder === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name-desc") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }

    return items;
  }, [foodItems, searchTerm, activeCategory, priceFilter, sortOrder]);

  /* ---------------- CART ---------------- */
  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      return found
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const tax = totalPrice * 0.08;
  const deliveryFee = totalPrice > 50 ? 0 : 5.99;
  const grandTotal = totalPrice + tax + deliveryFee;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-orange-50">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{item.name}</h3>
            <p>${item.price}</p>
            <button
              onClick={() => addToCart(item)}
              className="mt-2 bg-orange-500 text-white px-4 py-2 rounded"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow rounded">
          <p className="font-bold">Total: ${grandTotal.toFixed(2)}</p>
          <button
            onClick={() => setShowCart(!showCart)}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default T;
