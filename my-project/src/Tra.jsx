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

// function T() {
const API_URL = "http://localhost:5000";

function T() {
  const [cart, setCart] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [error, setError] = useState(null);

  // Order history state
  const [orderHistory, setOrderHistory] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [databaseStats, setDatabaseStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  // Fetch food items
  const fetchfoodItems = () => {
    fetch(`${API_URL}/api/menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu");
        return res.json();
      })
      .then((data) => {
        setFoodItems(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching food items:", err);
        setError("Failed to load menu items. Please try again later.");
      });
  };

  // Fetch order history from database
  // Fetch order history from database
  const fetchOrderHistory = () => {
    setIsLoading(true);

    fetch(`${API_URL}/api/hist`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array before using it
        const ordersData = Array.isArray(data) ? data : [];
        setOrderHistory(ordersData);
        calculateDatabaseStats(ordersData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
        setError("Failed to load order history. Please try again later.");
        setIsLoading(false);
      });
  };

  // Clear all order history
  const clearOrderHistory = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all order history? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    fetch(`${API_URL}/api/hist`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete orders");
        return res.json();
      })
      .then(() => {
        setOrderHistory([]);
        setDatabaseStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalTransactions: 0,
          averageOrderValue: 0,
          todayOrders: 0,
          todayRevenue: 0,
        });
        setIsLoading(false);
        alert("Order history cleared successfully!");
      })
      .catch((err) => {
        console.error("Error clearing order history:", err);
        setError("Failed to clear order history.");
        setIsLoading(false);
      });
  };

  // Calculate database statistics
  const calculateDatabaseStats = (orders) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Today's date
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter(
      (order) => order.date.split("T")[0] === today
    );
    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Count total transactions (including cancelled)
    const totalTransactions = orders.length;

    setDatabaseStats({
      totalOrders,
      totalRevenue,
      totalTransactions,
      averageOrderValue,
      todayOrders: todayOrders.length,
      todayRevenue,
    });
  };

  useEffect(() => {
    fetchfoodItems();
    fetchOrderHistory();
  }, []);

  const categories = [
    { id: "all", name: "All Items" },
    { id: "italian", name: "Italian" },
    { id: "american", name: "American" },
    { id: "japanese", name: "Japanese" },
    { id: "salads", name: "Salads" },
    { id: "desserts", name: "Desserts" },
    { id: "mexican", name: "Mexican" },
    { id: "thai", name: "Thai" },
    { id: "drinks", name: "Drinks" },
  ];

  const priceRanges = [
    { id: "all", name: "All Prices", min: 0, max: Infinity },
    { id: "under10", name: "Under $10", min: 0, max: 10 },
    { id: "10to20", name: "$10 - $20", min: 10, max: 20 },
    { id: "20to30", name: "$20 - $30", min: 20, max: 30 },
    { id: "over30", name: "Over $30", min: 30, max: Infinity },
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = [...foodItems];

    if (searchTerm) {
      items = items.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (priceFilter !== "all") {
      const range = priceRanges.find((r) => r.id === priceFilter);
      if (range) {
        items = items.filter(
          (item) => item.price >= range.min && item.item.price <= range.max
        );
      }
    }

    switch (sortOrder) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return items;
  }, [foodItems, searchTerm, activeCategory, priceFilter, sortOrder]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });

    const button = document.getElementById(`add-btn-${item.id}`);
    if (button) {
      button.classList.add("animate-pulse");
      setTimeout(() => button.classList.remove("animate-pulse"), 300);
    }
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === id);
      if (existingItem.quantity === 1) {
        return prevCart.filter((i) => i.id !== id);
      }
      return prevCart.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = totalPrice * 0.08;
  const deliveryFee = totalPrice > 50 ? 0 : 5.99;
  const grandTotal = totalPrice + tax + deliveryFee;

  const showRecipe = (item) => setSelectedRecipe(item);
  const closeRecipe = () => setSelectedRecipe(null);
  const clearCart = () => setCart([]);

  const generateReceipt = () => {
    const orderId = `ORD${Date.now().toString().slice(-8)}`;
    const receipt = {
      orderId,
      items: [...cart],
      subtotal: totalPrice,
      tax: tax.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      date: new Date().toLocaleString(),
      estimatedDelivery: new Date(Date.now() + 40 * 60000).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      ),
    };
    setOrderReceipt(receipt);
    return receipt;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add some items first!");
      return;
    }

    const receipt = generateReceipt();
    setShowReceipt(true);
  };

  const confirmOrder = () => {
    setOrderPlaced(true);

    fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderReceipt),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to place order");
        return res.json();
      })
      .then((data) => {
        // Auto-download receipt
        downloadReceipt();

        alert(
          `Order #${data.orderId} placed successfully!\nTotal: $${data.totalAmount}\nEstimated delivery: ${orderReceipt.estimatedDelivery}`
        );
        clearCart();
        setOrderPlaced(false);
        setShowReceipt(false);
        setShowCart(false);

        // Refresh order history after new order
        fetchOrderHistory();
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        alert("Failed to place order. Please try again.");
        setOrderPlaced(false);
      });
  };

  const viewDetails = (item) => {
    setSelectedItemDetail(item);
  };

  const closeDetails = () => {
    setSelectedItemDetail(null);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const downloadReceipt = () => {
    if (!orderReceipt) return;

    const receiptText = `
      ==================================
              FOODEXPRESS RECEIPT
      ==================================
      Order ID: ${orderReceipt.orderId}
      Date: ${orderReceipt.date}
      
      ITEMS:
      ${orderReceipt.items
        .map(
          (item) =>
            `  ${item.quantity}x ${item.name} - $${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}
      
      ----------------------------------
      Subtotal:      $${orderReceipt.subtotal.toFixed(2)}
      Tax (8%):      $${orderReceipt.tax}
      Delivery:      $${orderReceipt.deliveryFee}
      ----------------------------------
      TOTAL:         $${orderReceipt.grandTotal}
      
      Estimated Delivery: ${orderReceipt.estimatedDelivery}
      ==================================
      Thank you for your order!
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${orderReceipt.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export all orders to CSV
  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Items",
      "Total Amount",
      "Status",
      "Payment",
    ];
    const csvData = [
      headers.join(","),
      ...orderHistory.map((order) =>
        [
          order.orderId,
          `"${formatDate(order.date)}"`,
          order.items,
          `$${order.totalAmount.toFixed(2)}`,
          order.status,
          order.paymentMethod,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate item totals for an order
  const calculateItemTotals = (order) => {
    return order.itemNames.map((name, index) => ({
      name,
      price: order.itemPrices[index],
      quantity: order.itemQuantities[index],
      total: order.itemPrices[index] * order.itemQuantities[index],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 text-gray-800">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-3xl md:text-4xl animate-bounce">🍽️</div>
              <h1 className="text-xl md:text-2xl font-bold text-orange-600">
                FoodExpress Restaurant
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Database Stats Button */}
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                onClick={() => setShowOrderHistory(true)}
              >
                <Database className="w-5 h-5" />
                <span className="hidden md:inline">Orders History</span>
                <span className="bg-white text-green-600 rounded-full px-2 py-1 text-xs font-bold">
                  {databaseStats.totalOrders}
                </span>
              </button>

              <button
                className="text-2xl md:text-3xl relative cart-icon hover:scale-110 transition-transform"
                onClick={() => setShowCart(!showCart)}
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cart.reduce((t, i) => t + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Search for food or recipes..."
              className="w-full p-3 rounded-full border focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 rounded-full border bg-white"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 rounded-full border bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Categories */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 hover:scale-105 flex-shrink-0 ${activeCategory === c.id
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white hover:bg-gray-50"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => {
            const cartItem = cart.find((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.deliveryTime}</p>
                    <p className="font-bold text-orange-600 text-xl">
                      ${item.price}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-5xl ml-4">{item.image || "🍕"}</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex-1"
                    onClick={() => viewDetails(item)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-1"
                    onClick={() => addToCart(item)}
                    id={`add-btn-${item.id}`}
                  >
                    {cartItem
                      ? `Add More (${cartItem.quantity})`
                      : "Add to Cart"}
                  </button>
                </div>

                {cartItem && (
                  <div className="mt-3 p-2 bg-green-50 text-green-700 rounded text-center">
                    {cartItem.quantity} in cart - $
                    {(cartItem.price * cartItem.quantity).toFixed(2)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredItems.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">No items found</h3>
            <p className="text-gray-600">Try changing your search or filters</p>
          </div>
        )}
      </main>

      {/* Orders History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <FileText className="mr-3 text-green-600" />
                    Orders & Pricing Records
                  </h2>
                  <p className="text-gray-600">
                    Complete transaction history with itemized pricing
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setShowOrderHistory(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* Price & Order Statistics */}
            <div className="p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="mr-2" />
                Financial Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {databaseStats.totalOrders}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">
                    {databaseStats.totalTransactions}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${databaseStats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold">
                    ${databaseStats.averageOrderValue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Today's Orders</p>
                  <p className="text-2xl font-bold">
                    {databaseStats.todayOrders}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${databaseStats.todayRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order History Table */}
            <div className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">All Order Records</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={clearOrderHistory}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </button>
                  <button
                    onClick={fetchOrderHistory}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    {isLoading ? "Refreshing..." : "Refresh Data"}
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Loading order records...</p>
                </div>
              ) : orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-2">No orders found</h3>
                  <p className="text-gray-600">
                    No orders have been placed yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-semibold">
                          Order #
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Date & Time
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Items
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Item Prices
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Quantities
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Total Amount
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-lg">
                              #{order.orderId}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm">
                                {formatDate(order.date)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.itemNames.map((name, idx) => (
                                <div
                                  key={idx}
                                  className="truncate max-w-[150px]"
                                >
                                  {name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.itemPrices.map((price, idx) => (
                                <div key={idx} className="text-gray-600">
                                  ${price.toFixed(2)}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {order.itemQuantities.map((qty, idx) => (
                                <div key={idx} className="text-center">
                                  <span className="px-2 py-1 bg-gray-100 rounded">
                                    x{qty}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-lg text-green-600">
                              ${order.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items} items
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm flex items-center"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-6 border-t bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-bold mb-3 text-gray-700">
                    Revenue Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Orders:</span>
                      <span className="font-bold">
                        {
                          orderHistory.filter((o) => o.status === "completed")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Revenue:</span>
                      <span className="font-bold text-green-600">
                        $
                        {orderHistory
                          .filter((o) => o.status === "completed")
                          .reduce((sum, o) => sum + o.totalAmount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cancelled Orders:</span>
                      <span className="font-bold text-red-600">
                        {
                          orderHistory.filter((o) => o.status === "cancelled")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <h4 className="font-bold mb-3 text-gray-700">
                    Order Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Average Items per Order:
                      </span>
                      <span className="font-bold">
                        {(
                          orderHistory.reduce((sum, o) => sum + o.items, 0) /
                          orderHistory.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Highest Order Value:
                      </span>
                      <span className="font-bold text-green-600">
                        $
                        {Math.max(
                          ...orderHistory.map((o) => o.totalAmount)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Lowest Order Value:</span>
                      <span className="font-bold text-gray-600">
                        $
                        {Math.min(
                          ...orderHistory.map((o) => o.totalAmount)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal - Focus on Prices */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Order #
                    <span className="text-orange-600">
                      {selectedOrder.orderId}
                    </span>
                  </h2>
                  <p className="text-gray-600">
                    {formatDate(selectedOrder.date)}
                  </p>
                </div>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Order Status */}
              <div
                className={`p-4 rounded-lg mb-6 ${getStatusColor(
                  selectedOrder.status
                )}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      Status: {selectedOrder.status.toUpperCase()}
                    </p>
                    <p className="text-sm">
                      Payment: {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Items: {selectedOrder.items}</p>
                  </div>
                </div>
              </div>

              {/* Order Items with Prices */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">
                  Order Items & Pricing
                </h3>
                <div className="space-y-3">
                  {calculateItemTotals(selectedOrder).map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-600">
                              Price: ${item.price.toFixed(2)}
                            </span>
                            <span className="text-gray-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${item.total.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({selectedOrder.items} items):</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      ${selectedOrder.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  onClick={closeOrderDetails}
                >
                  Close
                </button>
                <button
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  onClick={() => {
                    // Print detailed receipt
                    const receiptContent = `
                      Order #${selectedOrder.orderId}
                      Date: ${formatDate(selectedOrder.date)}
                      
                      ITEMS:
                      ${calculateItemTotals(selectedOrder)
                        .map(
                          (item) =>
                            `  ${item.quantity}x ${item.name
                            } - $${item.price.toFixed(
                              2
                            )} = $${item.total.toFixed(2)}`
                        )
                        .join("\n")}
                      
                      -------------------------------
                      TOTAL: $${selectedOrder.totalAmount.toFixed(2)}
                      Status: ${selectedOrder.status}
                      Payment: ${selectedOrder.paymentMethod}
                    `;
                    const printWindow = window.open("", "_blank");
                    printWindow.document.write(`<pre>${receiptContent}</pre>`);
                    printWindow.print();
                  }}
                >
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Confirmation Modal */}
      {showReceipt && orderReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
              <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Confirm Order</h2>
              <p className="text-orange-100 mt-1">
                Please review your order details
              </p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-bold text-gray-800">
                  #{orderReceipt.orderId}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                  Items
                </h3>
                {orderReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded mr-3">
                        {item.quantity}x
                      </span>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${orderReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${orderReceipt.tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${orderReceipt.deliveryFee}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">
                    Total Amount
                  </span>
                  <span className="font-extrabold text-2xl text-green-600">
                    ${orderReceipt.grandTotal}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-center text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <span className="font-bold text-yellow-700">
                  Estimated Delivery:
                </span>{" "}
                {orderReceipt.estimatedDelivery}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                disabled={orderPlaced}
                className={`flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg transform transition-all active:scale-95 hover:shadow-xl ${orderPlaced
                  ? "opacity-75 cursor-wait"
                  : "hover:from-green-600 hover:to-emerald-700"
                  }`}
              >
                {orderPlaced ? (
                  <span className="flex items-center justify-center">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  "Place Order Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[45] backdrop-blur-sm transition-opacity">
          <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-right">
            {/* Cart Header */}
            <div className="p-5 bg-white border-b shadow-sm flex justify-between items-center z-10">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🛒</span>
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-sm font-bold">
                  {cart.reduce((t, i) => t + i.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
              >
                <XCircle size={28} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                  <div className="text-8xl mb-6 grayscale text-orange-200">
                    🥗
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-400">
                    Looks like you haven't added anything yet.
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-8 px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md"
                  >
                    <div className="text-3xl flex items-center justify-center bg-gray-50 w-16 h-16 rounded-lg">
                      {item.image || "🥘"}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="font-bold text-orange-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        ${item.price} each
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            {item.quantity === 1 ? <Trash2 size={16} /> : "-"}
                          </button>
                          <span className="w-8 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t shadow-lg z-10">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>
                      $
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-2xl text-orange-600">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-200 hover:from-orange-600 hover:to-red-600 transform active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <Truck size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Access Buttons */}
      {!showCart && cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 z-30"
        >
          <span className="flex items-center">
            🛒
            <span className="ml-2 bg-white text-orange-500 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
              {cart.reduce((t, i) => t + i.quantity, 0)}
            </span>
          </span>
        </button>
      )}

      {!showOrderHistory && (
        <button
          onClick={() => setShowOrderHistory(true)}
          className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-30 flex items-center"
        >
          <FileText className="w-6 h-6" />
          <span className="ml-2 bg-white text-green-500 rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
            {databaseStats.totalOrders}
          </span>
        </button>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        table {
          border-collapse: separate;
          border-spacing: 0;
        }
        
        th {
          position: sticky;
          top: 0;
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}

export default T;
