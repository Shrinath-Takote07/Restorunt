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
    User,
    MapPin,
    Phone,
    CreditCard,
    FileText,
    Download,
    ChevronLeft,
    ChevronRight,
    Database,
    BarChart3,
    TrendingUp
} from "lucide-react";

function R() {
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
        todayRevenue: 0
    });

    // Fetch food items
    const fetchfoodItems = () => {
        fetch("http://localhost:5000/api/menu")
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
    const fetchOrderHistory = () => {
        setIsLoading(true);

        // Simulate API call to your backend
        setTimeout(() => {
            // Mock data - Replace this with actual API call
            const mockOrders = [
                {
                    id: "ORD-00123",
                    orderId: "00123",
                    date: "2024-01-15T12:30:00",
                    customerName: "John Smith",
                    items: 3,
                    totalAmount: 52.96,
                    status: "completed",
                    paymentMethod: "Credit Card",
                    itemsList: ["Margherita Pizza", "Garlic Bread", "Tiramisu"]
                },
                {
                    id: "ORD-00124",
                    orderId: "00124",
                    date: "2024-01-15T18:45:00",
                    customerName: "Emma Wilson",
                    items: 2,
                    totalAmount: 44.97,
                    status: "cancelled",
                    paymentMethod: "PayPal",
                    itemsList: ["Pasta Carbonara", "Caesar Salad"]
                },
                {
                    id: "ORD-00125",
                    orderId: "00125",
                    date: "2024-01-14T19:30:00",
                    customerName: "Michael Brown",
                    items: 3,
                    totalAmount: 80.95,
                    status: "completed",
                    paymentMethod: "Cash",
                    itemsList: ["Grilled Salmon", "Mashed Potatoes", "Cheesecake"]
                },
                {
                    id: "ORD-00126",
                    orderId: "00126",
                    date: "2024-01-14T13:15:00",
                    customerName: "Sarah Johnson",
                    items: 4,
                    totalAmount: 67.50,
                    status: "completed",
                    paymentMethod: "Credit Card",
                    itemsList: ["Burger Deluxe", "Fries", "Coke", "Chocolate Cake"]
                },
                {
                    id: "ORD-00127",
                    orderId: "00127",
                    date: "2024-01-13T20:00:00",
                    customerName: "David Lee",
                    items: 2,
                    totalAmount: 35.99,
                    status: "completed",
                    paymentMethod: "Debit Card",
                    itemsList: ["Chicken Wings", "Onion Rings"]
                },
                {
                    id: "ORD-00128",
                    orderId: "00128",
                    date: "2024-01-12T19:15:00",
                    customerName: "Lisa Wang",
                    items: 5,
                    totalAmount: 112.45,
                    status: "completed",
                    paymentMethod: "Credit Card",
                    itemsList: ["Sushi Platter", "Miso Soup", "Edamame", "Green Tea", "Mochi Ice Cream"]
                }
            ];

            setOrderHistory(mockOrders);
            calculateDatabaseStats(mockOrders);
            setIsLoading(false);
        }, 1000);
    };

    // Calculate database statistics
    const calculateDatabaseStats = (orders) => {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Today's date
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order =>
            order.date.split('T')[0] === today
        );
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Count total transactions (including cancelled)
        const totalTransactions = orders.length;

        setDatabaseStats({
            totalOrders,
            totalRevenue,
            totalTransactions,
            averageOrderValue,
            todayOrders: todayOrders.length,
            todayRevenue
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
                    (item) => item.price >= range.min && item.price <= range.max
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

        setTimeout(() => {
            alert(
                `Order #${orderReceipt.orderId} placed successfully!\nTotal: $${orderReceipt.grandTotal}\nEstimated delivery: ${orderReceipt.estimatedDelivery}`
            );
            clearCart();
            setOrderPlaced(false);
            setShowReceipt(false);
            setShowCart(false);

            // Refresh order history after new order
            fetchOrderHistory();
        }, 1500);
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
            case "completed": return "bg-green-100 text-green-700";
            case "cancelled": return "bg-red-100 text-red-700";
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "preparing": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Export all orders to CSV
    const exportToCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Total Amount', 'Status', 'Payment Method'];
        const csvData = [
            headers.join(','),
            ...orderHistory.map(order => [
                order.orderId,
                `"${formatDate(order.date)}"`,
                `"${order.customerName}"`,
                order.items,
                `$${order.totalAmount.toFixed(2)}`,
                order.status,
                order.paymentMethod
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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
                                <span className="hidden md:inline">Database Records</span>
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

            {/* Database Records Modal */}
            {showOrderHistory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center">
                                        <Database className="mr-3" />
                                        Database Records
                                    </h2>
                                    <p className="text-gray-600">Total transactions and order history</p>
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

                        {/* Database Statistics */}
                        <div className="p-6 bg-gray-50">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <BarChart3 className="mr-2" />
                                Database Statistics
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold">{databaseStats.totalOrders}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Total Transactions</p>
                                    <p className="text-2xl font-bold">{databaseStats.totalTransactions}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-2xl font-bold">${databaseStats.totalRevenue.toFixed(2)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-2xl font-bold">${databaseStats.averageOrderValue.toFixed(2)}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Today's Orders</p>
                                    <p className="text-2xl font-bold">{databaseStats.todayOrders}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <p className="text-sm text-gray-600">Today's Revenue</p>
                                    <p className="text-2xl font-bold">${databaseStats.todayRevenue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order History Table */}
                        <div className="p-6 flex-1 overflow-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Previous Order Records</h3>
                                <button
                                    onClick={fetchOrderHistory}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                >
                                    {isLoading ? "Refreshing..." : "Refresh Data"}
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                    <p>Loading database records...</p>
                                </div>
                            ) : orderHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📊</div>
                                    <h3 className="text-xl font-bold mb-2">No records found</h3>
                                    <p className="text-gray-600">No orders have been placed yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border rounded-lg">
                                        <thead>
                                            <tr className="bg-gray-50 border-b">
                                                <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                                                <th className="py-3 px-4 text-left font-semibold">Date & Time</th>
                                                <th className="py-3 px-4 text-left font-semibold">Customer</th>
                                                <th className="py-3 px-4 text-left font-semibold">Items</th>
                                                <th className="py-3 px-4 text-left font-semibold">Total Amount</th>
                                                <th className="py-3 px-4 text-left font-semibold">Status</th>
                                                <th className="py-3 px-4 text-left font-semibold">Payment</th>
                                                <th className="py-3 px-4 text-left font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderHistory.map((order) => (
                                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono font-bold">{order.orderId}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                            {formatDate(order.date)}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <User className="w-4 h-4 mr-2 text-gray-400" />
                                                            {order.customerName}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-sm">
                                                            <div>{order.items} items</div>
                                                            <div className="text-gray-500 truncate max-w-xs">
                                                                {order.itemsList.join(", ")}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-bold text-green-600">
                                                            ${order.totalAmount.toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                                            {order.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                                                            {order.paymentMethod}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() => viewOrderDetails(order)}
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Summary Footer */}
                        <div className="p-6 border-t bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-2">Summary</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Total Orders in Database:</span>
                                            <span className="font-bold">{databaseStats.totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Transactions:</span>
                                            <span className="font-bold">{databaseStats.totalTransactions}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Database Revenue:</span>
                                            <span className="font-bold text-green-600">${databaseStats.totalRevenue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Today's Activity</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Orders Today:</span>
                                            <span className="font-bold">{databaseStats.todayOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Revenue Today:</span>
                                            <span className="font-bold text-green-600">${databaseStats.todayRevenue.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Average Order Value:</span>
                                            <span className="font-bold">${databaseStats.averageOrderValue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Order #{selectedOrder.orderId}</h2>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-3 flex items-center">
                                        <User className="mr-2" />
                                        Customer Information
                                    </h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                                        <p><span className="font-medium">Order ID:</span> {selectedOrder.orderId}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-3 flex items-center">
                                        <CreditCard className="mr-2" />
                                        Order Details
                                    </h3>
                                    <div className="space-y-2">
                                        <p><span className="font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status.toUpperCase()}
                                            </span>
                                        </p>
                                        <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                                        <p><span className="font-medium">Total Items:</span> {selectedOrder.items}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-bold text-lg mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.itemsList.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <div className="flex items-center">
                                                <span className="mr-3 text-gray-500">{index + 1}.</span>
                                                <span>{item}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg mb-6">
                                <h3 className="font-bold mb-3">Transaction Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            ${selectedOrder.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Order Date:</span>
                                        <span>{formatDate(selectedOrder.date)}</span>
                                    </div>
                                </div>
                            </div>

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
                                        // Reprint order
                                        const printContent = `
                      Order: ${selectedOrder.orderId}
                      Customer: ${selectedOrder.customerName}
                      Date: ${formatDate(selectedOrder.date)}
                      Items: ${selectedOrder.itemsList.join(', ')}
                      Total: $${selectedOrder.totalAmount.toFixed(2)}
                      Status: ${selectedOrder.status}
                    `;
                                        const printWindow = window.open('', '_blank');
                                        printWindow.document.write(`<pre>${printContent}</pre>`);
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

            {/* Cart Sidebar and other modals remain the same... */}

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
                    <Database className="w-6 h-6" />
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

export default R;