
// =========================
// 📦 LOCALSTORAGE OKU
// =========================
function getProducts(){
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}


// =========================
// 📊 MENÜYÜ YAZDIR
// =========================
function renderMenu(list){

    let container = document.getElementById("menu");

    if(!container){
        console.warn("menu id bulunamadı");
        return;
    }

    let html = "";

    list.forEach(p => {

        // 🔥 YENİ SİSTEM FİLTRE
        if(!p.active || p.stock <= 0) return;

        html += `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">

                <h5>${p.name}</h5>

                <b class="text-warning">${p.price} ₺</b>

                <br>

                <small class="text-secondary">${p.category}</small>

                <br>

                <small class="text-info">Stok: ${p.stock}</small>

            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}


// =========================
// 🔍 KATEGORİ FİLTRE
// =========================
function filterMenu(type){

    let data = getProducts();

    if(type !== "hepsi"){
        data = data.filter(p => p.category === type);
    }

    renderMenu(data);
}


// =========================
// 🔎 ARAMA
// =========================
function searchMenu(){

    let q = document.getElementById("search")?.value.toLowerCase() || "";

    let data = getProducts().filter(p =>
        p.active &&
        p.stock > 0 &&
        p.name.toLowerCase().includes(q)
    );

    renderMenu(data);
}


// =========================
// 🚀 BAŞLAT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(getProducts());
});