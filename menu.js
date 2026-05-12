// =======================================
// 📦 ÜRÜNLER (LOCALSTORAGE OKUMA)
// =======================================
// localStorage içindeki ürün listesini çeker
// Eğer veri yoksa boş array döner (hata önler)
function getProducts() {
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}

// =======================================
// 📦 KATEGORİLER (LOCALSTORAGE OKUMA)
// =======================================
// localStorage içindeki kategori listesini çeker
// yoksa boş array döndürür
function getCategories() {
    return JSON.parse(localStorage.getItem("urban_categories")) || [];
}

// =======================================
// 🏷 KATEGORİ BUL (SAFE CHECK)
// =======================================
// Ürün içindeki categoryId'ye göre kategori adını bulur
// - id yoksa "Genel" döner
// - kategori bulunamazsa yine "Genel" döner
function getCategoryName(id) {

    if (!id) return "Genel";

    let cats = getCategories();

    let cat = cats.find(c => c.id === id);

    return cat ? cat.name : "Genel";
}

// =======================================
// 📊 MENÜ RENDER (EKRANA BASMA)
// =======================================
// Ürün listesini HTML olarak ekrana basar
// Kart yapısı oluşturur (Bootstrap card)
function renderMenu(list) {

    // Menü alanını DOM'dan bulur
    // Farklı sayfalarda ID değişirse diye fallback eklenmiş
    const container =
        document.getElementById("menuAlani") ||
        document.getElementById("menu");

    if (!container) return;

    let html = "";

    // Her ürün için kart oluşturulur
    list.forEach(p => {

        html += `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">

                <!-- Ürün adı -->
                <h5>${p.name}</h5>

                <!-- Ürün fiyatı -->
                <b class="text-warning">${p.price} ₺</b>

                <br>

                <!-- Ürün kategorisi -->
                <small class="text-secondary">
                    ${getCategoryName(p.categoryId || p.category)}
                </small>

                <br>

                <!-- Stok bilgisi -->
                <small class="text-info">
                    Stok: ${p.stock}
                </small>

            </div>
        </div>`;
    });

    // HTML'i ekrana basar
    container.innerHTML = html;
}

// =======================================
// 🔍 FİLTRE (KATEGORİYE GÖRE SÜZME)
// =======================================
// Ürünleri kategoriye göre filtreler
// ayrıca stok 0 olanları gizler (SAFE CHECK)
function filterMenu(type = "hepsi") {

    let data = getProducts();

    // Stok kontrolü (0 olan ürünler görünmez)
    data = data.filter(p => Number(p.stock) > 0);

    // kategori filtresi
    if (type !== "hepsi") {
        data = data.filter(p =>
            (p.categoryId || p.category) === type
        );
    }

    renderMenu(data);
}

// =======================================
// 🔎 SEARCH (ÜRÜN ARAMA)
// =======================================
// input'tan gelen kelimeye göre ürün arar
// isim içinde geçen ürünleri filtreler
function searchMenu() {

    let input = document.getElementById("search");

    let q = input ? input.value.toLowerCase() : "";

    let data = getProducts()
        // stok 0 olanları çıkar
        .filter(p => Number(p.stock) > 0)
        // isim içinde arama yap
        .filter(p =>
            (p.name || "").toLowerCase().includes(q)
        );

    renderMenu(data);
}

// =======================================
// 🚀 INIT (SAYFA YÜKLENİNCE)
// =======================================
// Sayfa açıldığında ürünleri otomatik yükler
// stok kontrolü yaparak sadece aktif ürünleri gösterir
document.addEventListener("DOMContentLoaded", () => {

    let data = getProducts().filter(p => Number(p.stock) > 0);

    renderMenu(data);
});