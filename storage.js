// =========================
// 🔑 KEYS (localStorage anahtarları)
// =========================
// Bu sabitler localStorage içinde verilerin hangi isimle saklanacağını belirler
const PRODUCT_KEY = "urban_products";
const CATEGORY_KEY = "urban_categories";
const TABLE_KEY = "urban_tables";
const PAYMENT_KEY = "urban_payments";


// =========================
// 📦 CORE STORAGE (temel veri işlemleri)
// =========================

/**
 * localStorage'dan veri çeker
 * key: hangi veri (products, tables vs.)
 * def: veri yoksa dönecek varsayılan değer
 */
function getData(key, def = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : def;
    } catch {
        return def;
    }
}

/**
 * localStorage'a veri kaydeder
 * value JSON string'e çevrilerek saklanır
 */
function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// =========================
// 📦 PRODUCTS (ürün işlemleri)
// =========================

// Ürünleri getirir
function getProducts() {
    return getData(PRODUCT_KEY);
}

// Ürünleri kaydeder
function saveProducts(data) {
    setData(PRODUCT_KEY, data);
}


// =========================
// 📂 CATEGORIES (kategori işlemleri)
// =========================

// Kategorileri getirir
function getCategories() {
    return getData(CATEGORY_KEY);
}

// Kategorileri kaydeder
function saveCategories(data) {
    setData(CATEGORY_KEY, data);
}


// =========================
// 🪑 TABLES (masa işlemleri)
// =========================

// Masaları getirir
function getTables() {
    return getData(TABLE_KEY);
}

// Masaları kaydeder
function saveTables(data) {
    setData(TABLE_KEY, data);
}


// =========================
// 💳 PAYMENTS (ödeme işlemleri)
// =========================

// Ödemeleri getirir
function getPayments() {
    return getData(PAYMENT_KEY);
}

// Ödemeleri kaydeder
function savePayments(data) {
    setData(PAYMENT_KEY, data);
}


// =========================
// 🌱 INIT DATA (ilk veri oluşturma)
// =========================

/**
 * Sistem ilk açıldığında boşsa örnek veri oluşturur
 */
function seedData() {

    // kategori yoksa ekler
    if (getCategories().length === 0) {
        saveCategories([
            { id: "c1", name: "Kebap" },
            { id: "c2", name: "İçecek" },
            { id: "c3", name: "Tatlı" }
        ]);
    }

    // ürün yoksa ekler
   // if (getProducts().length === 0) {
       // saveProducts([
          //  { id: "p1", name: "Adana", price: 250, stock: 50, categoryId: "c1", inStock: true },
          //  { id: "p2", name: "Ayran", price: 40, stock: 100, categoryId: "c2", inStock: true },
           // { id: "p3", name: "Baklava", price: 160, stock: 30, categoryId: "c3", inStock: true }
     //   ]);
   // }//

    // masa yoksa 12 masa oluşturur
    if (getTables().length === 0) {
        let tables = [];
        for (let i = 1; i <= 12; i++) {
            tables.push({
                id: i,
                tableNo: i,
                status: "empty",      // boş masa
                customer: null,       // müşteri bilgisi
                orderItems: []        // siparişler
            });
        }
        saveTables(tables);
    }

    // ödeme yoksa boş liste oluşturur
    if (getPayments().length === 0) {
        savePayments([]);
    }
}


// =========================
// 🪑 TABLE FUNCTIONS (masa yardımcı fonksiyonlar)
// =========================

// Tek bir masayı getirir
function getTable(id) {
    return getTables().find(t => t.id === id);
}

// Belirli bir masayı günceller
function saveTable(updated) {
    let tables = getTables();
    tables = tables.map(t => t.id === updated.id ? updated : t);
    saveTables(tables);
}


// =========================
// 🪑 RESERVE TABLE (masa rezervasyonu)
// =========================

/**
 * Masayı dolu hale getirir ve müşteri ekler
 */
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
// ❌ CANCEL TABLE (masa iptali)
// =========================

/**
 * Masayı boşaltır ve siparişleri temizler
 */
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
// 🛒 ADD ORDER (masaya ürün ekleme)
// =========================

/**
 * Masaya ürün ekler
 * Eğer ürün zaten varsa miktarı artırır
 */
function addToTable(tableId, productId) {

    let tables = getTables();
    let products = getProducts();

    let table = tables.find(t => t.id === tableId);
    let product = products.find(p => p.id === productId);

    // masa yoksa veya stok yoksa işlem yapma
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
// 📉 STOCK DECREASE (stok düşürme)
// =========================

/**
 * Ürün stok azaltır
 * stok yeterli değilse false döner
 */
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
// 💳 PAYMENT / CHECKOUT (ödeme alma)
// =========================

/**
 * Masadaki siparişi ödeme olarak kaydeder
 * stokları düşer ve masa sıfırlanır
 */
function createPayment(tableId, method) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table || table.orderItems.length === 0) return false;

    // toplam hesaplama
    let total = table.orderItems.reduce((a, b) => a + b.lineTotal, 0);

    // stokları düş
    table.orderItems.forEach(i => {
        decreaseStock(i.productId, i.quantity);
    });

    let payments = getPayments();

    // ödeme kaydı oluştur
    payments.push({
        id: "pay_" + Date.now(),
        tableId,
        method,
        items: table.orderItems,
        total,
        date: new Date().toLocaleString()
    });

    savePayments(payments);

    // masa sıfırla
    table.orderItems = [];
    table.status = "empty";
    table.customer = null;

    saveTables(tables);

    return true;
}


// =========================
// 🚀 INIT (sayfa açılınca çalışır)
// =========================

// sayfa yüklenince seedData çalışır
document.addEventListener("DOMContentLoaded", seedData);


// =========================
// 🔥 REALTIME SYNC (sayfalar arası canlı güncelleme)
// =========================

/**
 * Diğer sayfalara "veri değişti" sinyali gönderir
 */
function triggerTablesUpdate() {
    window.dispatchEvent(new Event("tablesUpdated"));
}


// =========================
// 🪑 FIXED FUNCTIONS (güncellenmiş versiyonlar)
// =========================

// rezervasyon + sync
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

    triggerTablesUpdate(); // diğer sayfalara haber ver
}


// masa iptal + sync
function cancelTable(tableId) {

    let tables = getTables();
    let table = tables.find(t => t.id === tableId);

    if (!table) return;

    table.status = "empty";
    table.customer = null;
    table.orderItems = [];

    saveTables(tables);

    triggerTablesUpdate();
}


// sipariş ekleme + sync
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

    triggerTablesUpdate();
}


// ödeme + sync
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

    triggerTablesUpdate();

    return true;
}


// =========================
// 🔄 AUTO UPDATE LISTENER
// =========================

/**
 * Başka sayfadan değişiklik gelince UI günceller
 */
window.addEventListener("tablesUpdated", () => {

    if (typeof masaOlustur === "function") {
        masaOlustur();
    }

    if (typeof siparisGoster === "function") {
        siparisGoster();
    }

    if (typeof menuYukle === "function") {
        menuYukle();
    }
});