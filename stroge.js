
// =========================
// 🔑 DATABASE KEY
// =========================
const KEY = "urban_products";


// =========================
// 📦 GET PRODUCTS
// =========================
function getProducts(){
    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =========================
// 💾 SAVE PRODUCTS
// =========================
function saveProducts(data){
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =========================
// ➕ ÜRÜN EKLE
// =========================
function addProduct(name, price, stock, category){
    let products = getProducts();

    products.push({
        id: Date.now(),
        name,
        price: Number(price),
        stock: Number(stock),
        category,
        active: true
    });

    saveProducts(products);
}


// =========================
// ❌ ÜRÜN SİL
// =========================
function deleteProduct(id){
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
}


// =========================
// 📊 ÜRÜN GÜNCELLE
// =========================
function updateProduct(id, data){
    let products = getProducts();

    let p = products.find(x => x.id === id);
    if(!p) return;

    p.name = data.name ?? p.name;
    p.price = data.price ?? p.price;
    p.stock = data.stock ?? p.stock;
    p.category = data.category ?? p.category;

    if(p.stock <= 0){
        p.stock = 0;
        p.active = false;
    }

    saveProducts(products);
}


// =========================
// 📉 STOK DÜŞ
// =========================
function decreaseStock(name, amount = 1){
    let products = getProducts();

    let p = products.find(x => x.name === name);
    if(!p) return false;

    if(p.stock < amount){
        return false; // stok yok
    }

    p.stock -= amount;

    if(p.stock <= 0){
        p.stock = 0;
        p.active = false;
    }

    saveProducts(products);
    return true;
}


// =========================
// 📈 STOK ARTTIR
// =========================
function increaseStock(id, amount = 1){
    let products = getProducts();

    let p = products.find(x => x.id === id);
    if(!p) return;

    p.stock += amount;
    if(p.stock > 0) p.active = true;

    saveProducts(products);
}


// =========================
// 🍽 MENÜ İÇİN ÜRÜNLER
// =========================
function getMenuProducts(){
    return getProducts().filter(p => p.active && p.stock > 0);
}


// =========================
// 🧾 ORDER SATIŞ
// =========================
function sellProduct(name, amount = 1){
    return decreaseStock(name, amount);
}


// =========================
// 🔥 RESET (İSTEĞE BAĞLI)
// =========================
function clearAllProducts(){
    localStorage.removeItem(KEY);
}