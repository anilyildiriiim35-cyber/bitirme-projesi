// =========================
// 🔑 STORAGE KEYS
// =========================
const PRODUCT_KEY = "urban_products";
const CATEGORY_KEY = "urban_categories";
const TABLE_KEY = "urban_tables";
const PAYMENT_KEY = "urban_payments";


// =========================
// 📥 GENEL STORAGE
// =========================
function getData(key, def = []) {
    try {
        return JSON.parse(localStorage.getItem(key)) || def;
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
// 📦 ÜRÜNLER
// =========================
function getProducts() {
    return getData(PRODUCT_KEY);
}

function saveProducts(data) {
    setData(PRODUCT_KEY, data);
}


// =========================
// 📂 KATEGORİLER
// =========================
function getCategories() {
    return getData(CATEGORY_KEY);
}

function saveCategories(data) {
    setData(CATEGORY_KEY, data);
}


// =========================
// 🪑 MASALAR
// =========================
function getTables() {
    return getData(TABLE_KEY);
}

function saveTables(data) {
    setData(TABLE_KEY, data);
}


// =========================
// 💳 ÖDEMELER
// =========================
function getPayments() {
    return getData(PAYMENT_KEY);
}

function savePayments(data) {
    setData(PAYMENT_KEY, data);
}


// =========================
// 🌱 SEED DATA
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

    // MASALAR
    if (getTables().length === 0) {
        saveTables([
            { id: 1, tableNo: 1, status: "empty", orderItems: [] },
            { id: 2, tableNo: 2, status: "empty", orderItems: [] },
            { id: 3, tableNo: 3, status: "empty", orderItems: [] }
        ]);
    }

    // ÖDEMELER
    if (getPayments().length === 0) {
        savePayments([]);
    }
}


// =========================
// 📌 KATEGORİ SELECT DOLDUR
// =========================
function fillCategorySelect() {

    const select = document.getElementById("kat");
    if (!select) return;

    let cats = getCategories();

    select.innerHTML = `<option value="">Kategori Seç</option>`;

    cats.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}


// =========================
// ➕ ÜRÜN EKLE
// =========================
function addProduct(name, price, stock, categoryId) {

    if (!name || price <= 0 || stock < 0) return;

    let products = getProducts();

    products.push({
        id: "p_" + Date.now(),
        name,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        inStock: Number(stock) > 0
    });

    saveProducts(products);
}


// =========================
// 🏷 KATEGORİ ADI
// =========================
function getCategoryName(id) {

    let cats = getCategories();
    let c = cats.find(x => x.id === id);

    return c ? c.name : "Bilinmiyor";
}


// =========================
// 📉 STOK DÜŞ
// =========================
function decreaseStock(id, qty = 1) {

    let products = getProducts();
    let p = products.find(x => x.id === id);

    if (!p || p.stock < qty) return false;

    p.stock -= qty;
    p.inStock = p.stock > 0;

    saveProducts(products);
    return true;
}


// =========================
// 📈 STOK ARTIR
// =========================
function increaseStock(id, qty = 1) {

    let products = getProducts();
    let p = products.find(x => x.id === id);

    if (!p) return;

    p.stock += qty;
    p.inStock = true;

    saveProducts(products);
}


// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    seedData();
    fillCategorySelect();
});