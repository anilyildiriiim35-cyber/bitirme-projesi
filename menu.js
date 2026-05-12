// =======================================
// 📦 ÜRÜNLER
// =======================================

function getProducts() {
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}

// =======================================
// 📦 KATEGORİLER
// =======================================

function getCategories() {
    return JSON.parse(localStorage.getItem("urban_categories")) || [];
}

// =======================================
// 🏷 KATEGORİ BUL (SAFE)
// =======================================

function getCategoryName(id) {

    if (!id) return "Genel";

    let cats = getCategories();

    let cat = cats.find(c => c.id === id);

    return cat ? cat.name : "Genel";
}

// =======================================
// 📊 MENÜ RENDER
// =======================================

function renderMenu(list) {

    // SENDEKİ HTML ID FARKLI OLABİLİR
    const container =
        document.getElementById("menuAlani") ||
        document.getElementById("menu");

    if (!container) return;

    let html = "";

    list.forEach(p => {

        html += `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">

                <h5>${p.name}</h5>

                <b class="text-warning">${p.price} ₺</b>

                <br>

                <small class="text-secondary">
                    ${getCategoryName(p.categoryId || p.category)}
                </small>

                <br>

                <small class="text-info">
                    Stok: ${p.stock}
                </small>

            </div>
        </div>`;
    });

    container.innerHTML = html;
}

// =======================================
// 🔍 FİLTRE
// =======================================

function filterMenu(type = "hepsi") {

    let data = getProducts();

    // SAFE STOCK CHECK (en kritik fix)
    data = data.filter(p => Number(p.stock) > 0);

    if (type !== "hepsi") {
        data = data.filter(p =>
            (p.categoryId || p.category) === type
        );
    }

    renderMenu(data);
}

// =======================================
// 🔎 SEARCH
// =======================================

function searchMenu() {

    let input = document.getElementById("search");

    let q = input ? input.value.toLowerCase() : "";

    let data = getProducts()
        .filter(p => Number(p.stock) > 0)
        .filter(p =>
            (p.name || "").toLowerCase().includes(q)
        );

    renderMenu(data);
}

// =======================================
// 🚀 INIT
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    let data = getProducts().filter(p => Number(p.stock) > 0);

    renderMenu(data);
});