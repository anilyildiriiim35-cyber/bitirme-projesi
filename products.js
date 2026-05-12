const KEY = "urban_products";

const categories = [
    { id: "kirmizi", name: "Kırmızı Et" },
    { id: "beyaz", name: "Beyaz Et" },
    { id: "meze", name: "Meze" },
    { id: "icecek", name: "İçecek" }
];

function getProducts() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveProducts(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =========================
// 📦 KATEGORİ DOLDUR
// =========================
function loadCategories() {

    const select = document.getElementById("kat");
    if (!select) return;

    select.innerHTML = `<option value="">Kategori Seç</option>`;

    categories.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}


// =========================
// 📊 TABLO
// =========================
function render() {

    const table = document.getElementById("liste");
    if (!table) return;

    let data = getProducts();

    let html = "";

    data.forEach(p => {

        html += `
        <tr>
            <td>${p.name}</td>
            <td>${p.price} ₺</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="sil('${p.id}')">
                    Sil
                </button>
            </td>
        </tr>`;
    });

    table.innerHTML = html;
}


// =========================
// ➕ EKLE
// =========================
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


// =========================
// ❌ SİL
// =========================
function sil(id) {

    let data = getProducts().filter(p => p.id !== id);
    saveProducts(data);
    render();
}


// =========================
// 🚀 BAŞLAT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    render();
});
