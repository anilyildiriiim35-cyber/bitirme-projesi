// =========================
// 🔑 DATABASE KEY
// =========================
// localStorage içerisinde ürünleri saklamak için
// kullanılan ana veri anahtarıdır.
const KEY = "urban_products";


// =========================
// 📦 ÜRÜNLERİ GETİR
// =========================
// localStorage içindeki tüm ürünleri okur.
// Eğer veri yoksa boş dizi döndürür.
function getProducts(){

    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =========================
// 💾 ÜRÜNLERİ KAYDET
// =========================
// Parametre olarak gelen ürün listesini
// localStorage içerisine kaydeder.
function saveProducts(data){

    localStorage.setItem(KEY, JSON.stringify(data));
}


// =========================
// ➕ YENİ ÜRÜN EKLE
// =========================
// Yeni ürün oluşturur ve localStorage'a kaydeder.
// Ürün bilgileri:
// - isim
// - fiyat
// - stok
// - kategori
function addProduct(name, price, stock, category){

    // Mevcut ürünleri alır.
    let products = getProducts();

    // Yeni ürün eklenir.
    products.push({

        // Her ürün için benzersiz ID oluşturur.
        id: Date.now(),

        // Ürün adı
        name,

        // Ürün fiyatı
        price: Number(price),

        // Ürün stoğu
        stock: Number(stock),

        // Ürün kategorisi
        category,

        // Stok varsa aktif olur.
        active: Number(stock) > 0
    });

    // Güncel ürün listesini kaydeder.
    saveProducts(products);
}


// =========================
// ❌ ÜRÜN SİL
// =========================
// ID bilgisine göre ürünü siler.
function deleteProduct(id){

    // Silinmeyecek ürünleri filtreler.
    let products = getProducts()
        .filter(p => p.id !== id);

    // Güncel listeyi kaydeder.
    saveProducts(products);
}


// =========================
// 📊 ÜRÜN GÜNCELLE
// =========================
// Ürün bilgilerini günceller.
// Sadece gönderilen alanlar değiştirilir.
function updateProduct(id, data){

    // Tüm ürünleri getirir.
    let products = getProducts();

    // Güncellenecek ürünü bulur.
    let p = products.find(x => x.id === id);

    // Ürün bulunamazsa işlemi durdurur.
    if(!p) return;


    // =========================
    // ✏️ ALAN GÜNCELLEME
    // =========================

    // Ürün adı güncelle
    if(data.name !== undefined)
        p.name = data.name;

    // Fiyat güncelle
    if(data.price !== undefined)
        p.price = Number(data.price);

    // Stok güncelle
    if(data.stock !== undefined)
        p.stock = Number(data.stock);

    // Kategori güncelle
    if(data.category !== undefined)
        p.category = data.category;


    // =========================
    // 🟢 AKTİF / PASİF DURUM
    // =========================
    // Stok varsa ürün aktif olur.
    p.active = p.stock > 0;

    // Güncel listeyi kaydeder.
    saveProducts(products);
}


// =========================
// 📉 STOK DÜŞÜR
// =========================
// Sipariş verildiğinde ürün stoğunu azaltır.
// Ürün ID ile bulunduğu için daha güvenlidir.
function decreaseStockById(id, amount = 1){

    // Tüm ürünleri getirir.
    let products = getProducts();

    // ID ile ürün bulur.
    let p = products.find(x => x.id === id);

    // Ürün bulunamazsa false döndürür.
    if(!p) return false;


    // =========================
    // ⚠️ STOK KONTROLÜ
    // =========================
    // Yeterli stok yoksa işlem iptal edilir.
    if(p.stock < amount)
        return false;


    // =========================
    // 📉 STOK AZALT
    // =========================
    p.stock -= amount;


    // =========================
    // 🔴 STOK BİTTİ KONTROLÜ
    // =========================
    if(p.stock <= 0){

        p.stock = 0;

        p.active = false;
    }


    // Güncel listeyi kaydeder.
    saveProducts(products);

    return true;
}


// =========================
// 📈 STOK ARTTIR
// =========================
// Ürün stoğunu manuel artırır.
function increaseStock(id, amount = 1){

    // Tüm ürünleri getirir.
    let products = getProducts();

    // ID ile ürün bulur.
    let p = products.find(x => x.id === id);

    // Ürün bulunamazsa işlemi durdurur.
    if(!p) return;


    // =========================
    // 📈 STOK EKLE
    // =========================
    p.stock += amount;


    // Ürün tekrar aktif yapılır.
    p.active = true;


    // Güncel listeyi kaydeder.
    saveProducts(products);
}


// =========================
// 🍽 MENÜ ÜRÜNLERİ
// =========================
// Sadece stokta olan aktif ürünleri döndürür.
// Menü ve sipariş sayfasında kullanılır.
function getMenuProducts(){

    return getProducts().filter(p =>

        p.active && p.stock > 0
    );
}


// =========================
// 🧾 SATIŞ YAP
// =========================
// Sipariş ekranında ürün satışı yapar.
// Stok düşürme işlemini çalıştırır.
function sellProductById(id, amount = 1){

    return decreaseStockById(id, amount);
}


// =========================
// 🔥 TÜM ÜRÜNLERİ SIFIRLA
// =========================
// localStorage içindeki tüm ürün verilerini siler.
function clearAllProducts(){

    localStorage.removeItem(KEY);
}