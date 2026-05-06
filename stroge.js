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
        id: Date.now(), // 🔥 tekil id (EN DOĞRU YÖNTEM)
        name,
        price: Number(price),
        stock: Number(stock),
        category,
        active: Number(stock) > 0
    });

    saveProducts(products);
}


// =========================
// ❌ ÜRÜN SİL
// =========================
function deleteProduct(id){

    let products = getProducts()
        .filter(p => p.id !== id);

    saveProducts(products);
}


// =========================
// 📊 ÜRÜN GÜNCELLE
// =========================
function updateProduct(id, data){

    let products = getProducts();

    let p = products.find(x => x.id === id);
    if(!p) return;

    if(data.name !== undefined) p.name = data.name;
    if(data.price !== undefined) p.price = Number(data.price);
    if(data.stock !== undefined) p.stock = Number(data.stock);
    if(data.category !== undefined) p.category = data.category;

    p.active = p.stock > 0;

    saveProducts(products);
}


// =========================
// 📉 STOK DÜŞ (ID İLE - DAHA SAĞLAM)
// =========================
function decreaseStockById(id, amount = 1){

    let products = getProducts();

    let p = products.find(x => x.id === id);
    if(!p) return false;

    if(p.stock < amount) return false;

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
    p.active = true;

    saveProducts(products);
}


// =========================
// 🍽 MENÜ İÇİN ÜRÜNLER
// =========================
function getMenuProducts(){

    return getProducts().filter(p => p.active && p.stock > 0);
}


// =========================
// 🧾 SATIŞ (ORDER İÇİN)
// =========================
function sellProductById(id, amount = 1){

    return decreaseStockById(id, amount);
}


// =========================
// 🔥 RESET
// =========================
function clearAllProducts(){
    localStorage.removeItem(KEY);
}