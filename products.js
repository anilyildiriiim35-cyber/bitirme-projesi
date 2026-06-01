// =======================================
// 🧠 LOCALSTORAGE KEY (ÜRÜN VERİ TABANI)
// =======================================
const KEY = "urban_products";


// =======================================
// 📦 SABİT KATEGORİ LİSTESİ
// =======================================
const categories = [
    { id: "kirmizi", name: "Kırmızı Et" },
    { id: "beyaz", name: "Beyaz Et" },
    { id: "meze", name: "Meze" },
    { id: "icecek", name: "İçecek" }
];


// =======================================
// 📦 ÜRÜN VERİ OKUMA
// =======================================
function getProducts() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =======================================
// 💾 ÜRÜN VERİ KAYDETME
// =======================================
function saveProducts(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =======================================
// 📂 KATEGORİ DROPDOWN DOLDURMA
// =======================================
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
function render() {

    const table = document.getElementById("liste");
    if (!table) return;

    let data = getProducts();

    let html = "";

    data.forEach(p => {

        html += `
        <tr>

            <!-- Ürün Adı -->
            <td>${p.name}</td>

            <!-- Fiyat -->
            <td>
                ${p.price} ₺
                <br>
                <button
                    class="btn btn-warning btn-sm mt-1"
                    onclick="fiyatGuncelle('${p.id}')">
                    Fiyat Güncelle
                </button>
            </td>

            <!-- Kategori -->
            <td>${p.category}</td>

            <!-- Stok -->
            <td>
                <button
                    class="btn btn-secondary btn-sm"
                    onclick="stokAzalt('${p.id}')">
                    -
                </button>

                <strong style="margin:0 8px;">
                    ${p.stock}
                </strong>

                <button
                    class="btn btn-success btn-sm"
                    onclick="stokArtir('${p.id}')">
                    +
                </button>
            </td>

            <!-- Sil -->
            <td>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="sil('${p.id}')">
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
function ekle() {

    let ad = document.getElementById("ad").value.trim();
    let fiyat = Number(document.getElementById("fiyat").value);
    let kat = document.getElementById("kat").value;
    let stok = Number(document.getElementById("stok").value);

    if (!ad || !fiyat || !kat || stok < 0) {
        alert("Tüm alanları doldur!");
        return;
    }

    let data = getProducts();

    // Aynı ürün kontrolü
    const urunVar = data.find(
        p => p.name.toLowerCase() === ad.toLowerCase()
    );

    if (urunVar) {
        alert("Bu ürün zaten kayıtlı. Stok veya fiyat güncelleyin.");
        return;
    }

    data.push({
        id: Date.now().toString(),
        name: ad,
        price: fiyat,
        category: kat,
        stock: stok,
        active: true
    });

    saveProducts(data);

    document.getElementById("ad").value = "";
    document.getElementById("fiyat").value = "";
    document.getElementById("stok").value = "";

    render();
}


// =======================================
// ❌ ÜRÜN SİLME
// =======================================
function sil(id) {

    let data = getProducts().filter(p => p.id !== id);

    saveProducts(data);
    render();
}


// =======================================
// 📈 STOK ARTIR
// =======================================
function stokArtir(id) {

    let data = getProducts();

    let urun = data.find(p => p.id === id);

    if (!urun) return;

    urun.stock++;

    saveProducts(data);
    render();
}


// =======================================
// 📉 STOK AZALT
// =======================================
function stokAzalt(id) {

    let data = getProducts();

    let urun = data.find(p => p.id === id);

    if (!urun) return;

    if (urun.stock > 0) {
        urun.stock--;
    }

    saveProducts(data);
    render();
}


// =======================================
// 💰 FİYAT GÜNCELLE
// =======================================
function fiyatGuncelle(id) {

    let data = getProducts();

    let urun = data.find(p => p.id === id);

    if (!urun) return;

    let yeniFiyat = prompt(
        `${urun.name} için yeni fiyat giriniz:`,
        urun.price
    );

    if (yeniFiyat === null) return;

    yeniFiyat = Number(yeniFiyat);

    if (isNaN(yeniFiyat) || yeniFiyat <= 0) {
        alert("Geçerli bir fiyat giriniz.");
        return;
    }

    urun.price = yeniFiyat;

    saveProducts(data);
    render();
}


// =======================================
// 🚀 SAYFA BAŞLATMA
// =======================================
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    render();
});