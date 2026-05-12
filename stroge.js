// =========================
// 🔑 STORAGE KEYS
// =========================
const PRODUCT_KEY = "urban_products";
const CATEGORY_KEY = "urban_categories";
const TABLE_KEY = "urban_tables";
const PAYMENT_KEY = "urban_payments";


// =========================
// 📥 STORAGE CORE
// =========================
function getData(key, def = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : def;
    } catch {
        return def;
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function removeData(key) {
    localStorage.removeItem(key);
}


// =========================
// 📦 PRODUCTS
// =========================
function getProducts() {
    return getData(PRODUCT_KEY);
}

function saveProducts(data) {
    setData(PRODUCT_KEY, data);
}


// =========================
// 📂 CATEGORIES
// =========================
function getCategories() {
    return getData(CATEGORY_KEY);
}

function saveCategories(data) {
    setData(CATEGORY_KEY, data);
}


// =========================
// 🪑 TABLES
// =========================
function getTables() {
    return getData(TABLE_KEY);
}

function saveTables(data) {
    setData(TABLE_KEY, data);
}


// =========================
// 💳 PAYMENTS
// =========================
function getPayments() {
    return getData(PAYMENT_KEY);
}

function savePayments(data) {
    setData(PAYMENT_KEY, data);
}


// =========================
// 🌱 SEED DATA (FULL FIX)
// =========================
function seedData() {

    // KATEGORİLER
    if (getCategories().length === 0) {
        saveCategories([
            { id: "c_1", name: "Kırmızı Et" },
            { id: "c_2", name: "İçecek" },
            { id: "c_3", name: "Tatlı" }
        ]);
    }

    // ÜRÜNLER
    if (getProducts().length === 0) {
        saveProducts([
            { id: "p_1", name: "Adana Kebap", price: 250, stock: 50, categoryId: "c_1", inStock: true },
            { id: "p_2", name: "Urfa Kebap", price: 240, stock: 40, categoryId: "c_1", inStock: true },
            { id: "p_3", name: "Köfte", price: 220, stock: 35, categoryId: "c_1", inStock: true },

            { id: "p_4", name: "Ayran", price: 40, stock: 100, categoryId: "c_2", inStock: true },
            { id: "p_5", name: "Kola", price: 50, stock: 80, categoryId: "c_2", inStock: true },
            { id: "p_6", name: "Su", price: 15, stock: 120, categoryId: "c_2", inStock: true },

            { id: "p_7", name: "Künefe", price: 140, stock: 25, categoryId: "c_3", inStock: true },
            { id: "p_8", name: "Sütlaç", price: 90, stock: 20, categoryId: "c_3", inStock: true },
            { id: "p_9", name: "Baklava", price: 160, stock: 30, categoryId: "c_3", inStock: true }
        ]);
    }

    // 🪑 MASALAR (FIX: min 5 masa)
    if (getTables().length === 0) {
        saveTables([
            { id: 1, tableNo: 1, status: "empty", orderItems: [] },
            { id: 2, tableNo: 2, status: "empty", orderItems: [] },
            { id: 3, tableNo: 3, status: "empty", orderItems: [] },
            { id: 4, tableNo: 4, status: "empty", orderItems: [] },
            { id: 5, tableNo: 5, status: "empty", orderItems: [] }
        ]);
    }

    // ÖDEMELER
    if (getPayments().length === 0) {
        savePayments([]);
    }
}


// =========================
// 📦 CATEGORY HELPERS
// =========================
function getCategoryName(id) {
    const c = getCategories().find(x => x.id === id);
    return c ? c.name : "Bilinmiyor";
}


// =========================
// 📦 PRODUCT CREATE (SAFE)
// =========================
function addProduct(name, price, stock, categoryId) {

    if (!name || price <= 0 || stock <= 0 || !categoryId) {
        alert("Hatalı ürün bilgisi");
        return;
    }

    let products = getProducts();

    const exists = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert("Bu ürün zaten var");
        return;
    }

    products.push({
        id: "p_" + Date.now(),
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        inStock: true
    });

    saveProducts(products);
}


// =========================
// 📉 STOCK DECREASE (GLOBAL SAFE)
// =========================
function decreaseStock(productId, qty = 1) {

    let products = getProducts();
    let p = products.find(x => x.id === productId);

    if (!p || p.stock < qty) return false;

    p.stock = Math.max(0, p.stock - qty);
    p.inStock = p.stock > 0;

    saveProducts(products);
    return true;
}


// =========================
// 📈 STOCK INCREASE
// =========================
function increaseStock(productId, qty = 1) {

    let products = getProducts();
    let p = products.find(x => x.id === productId);

    if (!p) return;

    p.stock += qty;
    p.inStock = true;

    saveProducts(products);
}


// =========================
// 🪑 TABLE ORDER HELPERS (CRITICAL FIX)
// =========================
function getTable(tableId) {
    return getTables().find(t => t.id === tableId);
}

function saveTable(updatedTable) {

    let tables = getTables();

    tables = tables.map(t =>
        t.id === updatedTable.id ? updatedTable : t
    );

    saveTables(tables);
}


// =========================
// 🛒 ADD TO TABLE ORDER
// =========================
function addToTable(tableId, productId) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    let product = getProducts().find(p => p.id === productId);
    if (!product || product.stock <= 0) return alert("Stok yok");

    let item = table.orderItems.find(i => i.productId === productId);

    if (item) {
        item.quantity++;
        item.lineTotal += product.price;
    } else {
        table.orderItems.push({
            productId,
            name: product.name,
            unitPrice: product.price,
            quantity: 1,
            lineTotal: product.price
        });
    }

    table.status = "occupied";

    saveTable(table);
}


// =========================
// 💳 PAYMENT (FULL FIX)
// =========================
function createPayment(tableId, paymentType) {

    let table = getTable(tableId);
    if (!table || table.orderItems.length === 0) return false;

    let total = table.orderItems.reduce((a, b) => a + b.lineTotal, 0);

    // stock düş
    table.orderItems.forEach(i => {
        decreaseStock(i.productId, i.quantity);
    });

    let payment = {
        id: "pay_" + Date.now(),
        tableId,
        paymentType,
        amount: total,
        items: table.orderItems,
        paidAt: new Date().toISOString()
    };

    let payments = getPayments();
    payments.push(payment);
    savePayments(payments);

    // masa temizle
    table.orderItems = [];
    table.status = "empty";

    saveTable(table);

    return true;
}


// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", seedData);