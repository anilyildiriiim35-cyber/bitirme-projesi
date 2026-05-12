// =======================================
// 🧠 LOCALSTORAGE KEY (ÜRÜN VERİ TABANI)
// =======================================
// Tüm ürünler bu key altında saklanır
const KEY = "urban_products";


// =======================================
// 📦 SABİT KATEGORİ LİSTESİ
// =======================================
// Ürün ekleme sırasında kullanılacak kategori yapısı
// (UI select box buradan doldurulur)
const categories = [
    { id: "kirmizi", name: "Kırmızı Et" },
    { id: "beyaz", name: "Beyaz Et" },
    { id: "meze", name: "Meze" },
    { id: "icecek", name: "İçecek" }
];


// =======================================
// 📦 ÜRÜN VERİ OKUMA
// =======================================
// localStorage'dan ürünleri çeker
// veri yoksa boş array döner (hata önler)
function getProducts() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =======================================
// 💾 ÜRÜN VERİ KAYDETME
// =======================================
// Ürün listesini localStorage'a JSON olarak yazar
function saveProducts(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =======================================
// 📂 KATEGORİ DROPDOWN DOLDURMA
// =======================================
// HTML select (#kat) içine kategorileri basar
// kullanıcı ürün eklerken kategori seçsin diye
function loadCategories() {

    const select = document.getElementById("kat");
    if (!select) return;

    select.innerHTML = `<option value="">Kategori Seç</option>`;

    categories.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}


// =======================================
// 📊 ÜRÜN TABLOSU RENDER
// =======================================
// Ürünleri HTML tabloya basar
// Her ürün için satır oluşturur
function render() {

    const table = document.getElementById("liste");
    if (!table) return;

    let data = getProducts();

    let html = "";

    data.forEach(p => {

        html += `
        <tr>
            <!-- Ürün adı -->
            <td>${p.name}</td>

            <!-- Fiyat -->
            <td>${p.price} ₺</td>

            <!-- Kategori -->
            <td>${p.category}</td>

            <!-- Stok -->
            <td>${p.stock}</td>

            <!-- Sil butonu -->
            <td>
                <button class="btn btn-danger btn-sm" onclick="sil('${p.id}')">
                    Sil
                </button>
            </td>
        </tr>`;
    });

    table.innerHTML = html;
}


// =======================================
// ➕ ÜRÜN EKLEME
// =======================================
// Formdan gelen verileri alır
// doğrulama yapar
// localStorage'a ekler
function ekle() {

    let ad = document.getElementById("ad").value.trim();
    let fiyat = Number(document.getElementById("fiyat").value);
    let kat = document.getElementById("kat").value;
    let stok = Number(document.getElementById("stok").value);

    // basit validation (boş veya hatalı giriş kontrolü)
    if (!ad || !fiyat || !kat || stok < 0) {
        alert("Tüm alanları doldur!");
        return;
    }

    let data = getProducts();

    // yeni ürün eklenir
    data.push({
        id: Date.now().toString(), // unique id
        name: ad,
        price: fiyat,
        category: kat,
        stock: stok,
        active: true // ileride pasif/aktif kontrolü için
    });

    saveProducts(data);

    // form temizleme
    document.getElementById("ad").value = "";
    document.getElementById("fiyat").value = "";
    document.getElementById("stok").value = "";

    render();
}


// =======================================
// ❌ ÜRÜN SİLME
// =======================================
// id'ye göre ürünü listeden çıkarır
// sonra tekrar kaydeder
function sil(id) {

    let data = getProducts().filter(p => p.id !== id);
    saveProducts(data);
    render();
}


// =======================================
// 🚀 SAYFA BAŞLATMA
// =======================================
// Sayfa açıldığında:
// - kategori dropdown doldurulur
// - ürün tablosu yüklenir
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    render();
});
