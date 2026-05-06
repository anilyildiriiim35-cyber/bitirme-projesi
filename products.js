
// =========================
// 🔑 STORAGE KEY
// =========================
const KEY = "urban_products";


// =========================
// 📦 GET
// =========================
function getProducts(){
    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =========================
// 💾 SAVE
// =========================
function saveProducts(data){
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =========================
// 📊 RENDER (SAFE)
// =========================
function render(){

    let table = document.getElementById("liste");

    // 🔴 DOM yoksa hata verme
    if(!table){
        console.warn("liste ID bulunamadı!");
        return;
    }

    let data = getProducts();
    let html = "";

    data.forEach(p=>{

        let durum = p.stock > 0 ? "AKTİF" : "STOK BİTTİ";
        let renk = p.stock > 0 ? "text-success" : "text-danger";

        html += `
        <tr>
            <td class="fw-bold">${p.name}</td>
            <td>${p.price} ₺</td>
            <td>${p.category}</td>

            <td class="${renk}">
                ${p.stock} (${durum})
            </td>

            <td>
                <button class="btn btn-danger btn-sm" onclick="sil('${p.id}')">Sil</button>
            </td>
        </tr>
        `;
    });

    table.innerHTML = html;
}


// =========================
// ➕ EKLE (SAFE VERSION)
// =========================
function ekle(){

    let adEl = document.getElementById("ad");
    let fiyatEl = document.getElementById("fiyat");
    let katEl = document.getElementById("kat");
    let stokEl = document.getElementById("stok");

    if(!adEl || !fiyatEl || !katEl || !stokEl){
        alert("Input ID'leri yanlış veya eksik!");
        return;
    }

    let ad = adEl.value.trim();
    let fiyat = Number(fiyatEl.value);
    let kat = katEl.value.trim();
    let stok = Number(stokEl.value);

    if(!ad || !fiyat || !kat || !stok){
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

    // input temizle
    adEl.value = "";
    fiyatEl.value = "";
    katEl.value = "";
    stokEl.value = "";

    render();
}


// =========================
// ❌ SİL
// =========================
function sil(id){
    let data = getProducts().filter(x => x.id !== id);
    saveProducts(data);
    render();
}


// =========================
// 📉 STOK DÜŞ (ORDER İÇİN)
// =========================
function stokDus(name, adet = 1){

    let data = getProducts();

    let u = data.find(x => x.name === name);
    if(!u) return false;

    if(u.stock < adet){
        alert("Stok yetersiz!");
        return false;
    }

    u.stock -= adet;

    if(u.stock <= 0){
        u.stock = 0;
        u.active = false;
    }

    saveProducts(data);
    return true;
}


// =========================
// 📈 STOK ARTTIR
// =========================
function stokArtir(id, adet = 1){

    let data = getProducts();

    let u = data.find(x => x.id === id);
    if(!u) return;

    u.stock += adet;

    if(u.stock > 0){
        u.active = true;
    }

    saveProducts(data);
    render();
}


// =========================
// 🟢 AKTİF ÜRÜNLER
// =========================
function getActiveProducts(){
    return getProducts().filter(p => p.active && p.stock > 0);
}


// =========================
// 🚀 INIT (SAFE)
// =========================
document.addEventListener("DOMContentLoaded", ()=>{
    render();
});
