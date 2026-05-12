// =========================
// 🔑 KEYS
// =========================
const PRODUCT_KEY = "urban_products";
const CATEGORY_KEY = "urban_categories";
const TABLE_KEY = "urban_tables";
const PAYMENT_KEY = "urban_payments";


// =========================
// 📦 CORE STORAGE
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
// 🌱 INIT DATA
// =========================
function seedData() {

    if (getCategories().length === 0) {
        saveCategories([
            { id: "c1", name: "Kebap" },
            { id: "c2", name: "İçecek" },
            { id: "c3", name: "Tatlı" }
        ]);
    }

    if (getProducts().length === 0) {
        saveProducts([
            { id: "p1", name: "Adana", price: 250, stock: 50, categoryId: "c1", inStock: true },
            { id: "p2", name: "Ayran", price: 40, stock: 100, categoryId: "c2", inStock: true },
            { id: "p3", name: "Baklava", price: 160, stock: 30, categoryId: "c3", inStock: true }
        ]);
    }

    if (getTables().length === 0) {
        let tables = [];
        for (let i = 1; i <= 12; i++) {
            tables.push({
                id: i,
                tableNo: i,
                status: "empty",
                customer: null,
                orderItems: []
            });
        }
        saveTables(tables);
    }

    if (getPayments().length === 0) {
        savePayments([]);
    }
}


// =========================
// 🪑 TABLE FUNCTIONS
// =========================
function getTable(id) {
    return getTables().find(t => t.id === id);
}

function saveTable(updated) {
    let tables = getTables();
    tables = tables.map(t => t.id === updated.id ? updated : t);
    saveTables(tables);
}


// =========================
// 🪑 RESERVE TABLE
// =========================
function reserveTable(tableId, name, people) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    table.status = "occupied";
    table.customer = {
        name,
        people,
        time: new Date().toLocaleString()
    };

    saveTables(tables);
}


// =========================
// ❌ CANCEL TABLE
// =========================
function cancelTable(tableId) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    table.status = "empty";
    table.customer = null;
    table.orderItems = [];

    saveTables(tables);
}


// =========================
// 🛒 ADD ORDER
// =========================
function addToTable(tableId, productId) {

    let tables = getTables();
    let products = getProducts();

    let table = tables.find(t => t.id === tableId);
    let product = products.find(p => p.id === productId);

    if (!table || !product || product.stock <= 0) return;

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

    saveTables(tables);
}


// =========================
// 📉 STOCK DECREASE
// =========================
function decreaseStock(productId, qty) {

    let products = getProducts();
    let p = products.find(x => x.id === productId);

    if (!p || p.stock < qty) return false;

    p.stock -= qty;
    p.inStock = p.stock > 0;

    saveProducts(products);
    return true;
}


// =========================
// 💳 PAYMENT / CHECKOUT
// =========================
function createPayment(tableId, method) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table || table.orderItems.length === 0) return false;

    let total = table.orderItems.reduce((a, b) => a + b.lineTotal, 0);

    table.orderItems.forEach(i => {
        decreaseStock(i.productId, i.quantity);
    });

    let payments = getPayments();

    payments.push({
        id: "pay_" + Date.now(),
        tableId,
        method,
        items: table.orderItems,
        total,
        date: new Date().toLocaleString()
    });

    savePayments(payments);

    table.orderItems = [];
    table.status = "empty";
    table.customer = null;

    saveTables(tables);

    return true;
}


// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", seedData);
// ======================================================
// 🔥 REALTIME SYNC FIX (EN KRİTİK PARÇA)
// ======================================================

// 📡 Masa / sipariş değişince tüm sayfalara haber ver
function triggerTablesUpdate() {
    window.dispatchEvent(new Event("tablesUpdated"));
}


// ======================================================
// 🪑 REZERVASYON FIX (SENİN reserveTable ÜZERİNE)
// ======================================================
function reserveTable(tableId, name, people) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    table.status = "occupied";
    table.customer = {
        name,
        people,
        time: new Date().toLocaleString()
    };

    saveTables(tables);

    triggerTablesUpdate(); // 🔥 EKLENDİ
}


// ======================================================
// ❌ MASA İPTAL FIX
// ======================================================
function cancelTable(tableId) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    table.status = "empty";
    table.customer = null;
    table.orderItems = [];

    saveTables(tables);

    triggerTablesUpdate(); // 🔥 EKLENDİ
}


// ======================================================
// 🛒 ADD ORDER FIX (SİPARİŞ EKLEYİNCE DE GÜNCELLE)
// ======================================================
function addToTable(tableId, productId) {

    let tables = getTables();
    let products = getProducts();

    let table = tables.find(t => t.id === tableId);
    let product = products.find(p => p.id === productId);

    if (!table || !product || product.stock <= 0) return;

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

    saveTables(tables);

    triggerTablesUpdate(); // 🔥 EKLENDİ
}


// ======================================================
// 💳 PAYMENT FIX
// ======================================================
function createPayment(tableId, method) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table || table.orderItems.length === 0) return false;

    let total = table.orderItems.reduce((a, b) => a + b.lineTotal, 0);

    table.orderItems.forEach(i => {
        decreaseStock(i.productId, i.quantity);
    });

    let payments = getPayments();

    payments.push({
        id: "pay_" + Date.now(),
        tableId,
        method,
        items: table.orderItems,
        total,
        date: new Date().toLocaleString()
    });

    savePayments(payments);

    table.orderItems = [];
    table.status = "empty";
    table.customer = null;

    saveTables(tables);

    triggerTablesUpdate(); // 🔥 EKLENDİ

    return true;
}


// ======================================================
// 🔄 SİPARİŞ SAYFASI OTOMATİK GÜNCELLE
// ======================================================
window.addEventListener("tablesUpdated", () => {

    // masa ekranı varsa güncelle
    if (typeof masaOlustur === "function") {
        masaOlustur();
    }

    // sipariş ekranı varsa güncelle
    if (typeof siparisGoster === "function") {
        siparisGoster();
    }

    if (typeof menuYukle === "function") {
        menuYukle();
    }
});