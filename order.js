// =======================================
// 🍽 AKTİF MASA
// =======================================
let aktifMasa = null;


// =======================================
// 💳 MODAL (SAFE INIT)
// =======================================
let modal;

document.addEventListener("DOMContentLoaded", () => {

    const modalEl = document.getElementById("odemeModal");

    if (modalEl) {
        modal = new bootstrap.Modal(modalEl);
    }

    masaOlustur();
    menuYukle();
});


// =======================================
// 📦 STORAGE
// =======================================

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// =======================================
// 📦 ÜRÜNLER
// =======================================

function getProducts() {
    return getData("urban_products");
}

function saveProducts(data) {
    setData("urban_products", data);
}


// =======================================
// 🪑 MASA OLUŞTUR
// =======================================

function masaOlustur() {

    const alan = document.getElementById("masaAlani");
    if (!alan) return;

    alan.innerHTML = "";

    for (let i = 1; i <= 12; i++) {

        let siparis = getData("masa_" + i);

        let durum = siparis.length > 0 ? "DOLU" : "BOŞ";
        let renk = siparis.length > 0
            ? "bg-danger text-white"
            : "bg-success text-white";

        alan.innerHTML += `
        <div class="col-md-2 mb-2">
            <div class="card p-3 text-center ${renk}" onclick="masaSec(${i})">
                <b>Masa ${i}</b>
                <small>${durum}</small>
            </div>
        </div>`;
    }
}


// =======================================
// 🎯 MASA SEÇ
// =======================================

function masaSec(no) {

    aktifMasa = no;

    document.getElementById("masaBaslik").innerText =
        "Masa " + no;

    siparisGoster();
}


// =======================================
// 🍽 MENÜ
// =======================================

function menuYukle() {

    const alan = document.getElementById("menuAlani");
    if (!alan) return;

    let urunler = getProducts();

    alan.innerHTML = "";

    urunler
        .filter(u => Number(u.stock) > 0) // 🔥 FIX
        .forEach(u => {

            alan.innerHTML += `
            <div class="col-md-3 mb-3">
                <div class="card p-3 text-center">

                    <b>${u.name}</b>
                    <div>${u.price} ₺</div>
                    <small>Stok: ${u.stock}</small>

                    <button class="btn btn-warning btn-sm mt-2"
                    onclick="urunEkle('${u.id}')">
                        EKLE
                    </button>

                </div>
            </div>`;
        });
}


// =======================================
// 🛒 ÜRÜN EKLE
// =======================================

function urunEkle(id) {

    if (!aktifMasa) return alert("Masa seç!");

    let products = getProducts();
    let urun = products.find(x => x.id === id);

    if (!urun || urun.stock <= 0)
        return alert("Stok yok!");

    urun.stock -= 1;

    saveProducts(products);

    let key = "masa_" + aktifMasa;
    let siparis = getData(key);

    let item = siparis.find(x => x.id === id);

    if (item) {
        item.adet++;
    } else {
        siparis.push({
            id: urun.id,
            ad: urun.name,
            fiyat: urun.price,
            adet: 1
        });
    }

    setData(key, siparis);

    siparisGoster();
    masaOlustur();
    menuYukle();
}


// =======================================
// 📋 SİPARİŞ GÖSTER
// =======================================

function siparisGoster() {

    if (!aktifMasa) return;

    let siparis = getData("masa_" + aktifMasa);

    let alan = document.getElementById("siparisListesi");
    if (!alan) return;

    let toplam = 0;

    alan.innerHTML = "";

    siparis.forEach((s, i) => {

        toplam += s.fiyat * s.adet;

        alan.innerHTML += `
        <div class="d-flex justify-content-between border-bottom py-2">
            <div>
                <b>${s.ad}</b><br>
                ${s.adet} x ${s.fiyat}
            </div>

            <div>
                <button onclick="arttir(${i})">+</button>
                <button onclick="azalt(${i})">-</button>
                <button onclick="sil(${i})">X</button>
            </div>
        </div>`;
    });

    document.getElementById("toplamTutar").innerText = toplam;
}


// =======================================
// ➕ ARTIR
// =======================================

function arttir(i) {

    let siparis = getData("masa_" + aktifMasa);

    siparis[i].adet++;

    setData("masa_" + aktifMasa, siparis);

    siparisGoster();
}


// =======================================
// ➖ AZALT
// =======================================

function azalt(i) {

    let siparis = getData("masa_" + aktifMasa);

    siparis[i].adet--;

    if (siparis[i].adet <= 0)
        siparis.splice(i, 1);

    setData("masa_" + aktifMasa, siparis);

    siparisGoster();
}


// =======================================
// ❌ SİL
// =======================================

function sil(i) {

    let siparis = getData("masa_" + aktifMasa);

    siparis.splice(i, 1);

    setData("masa_" + aktifMasa, siparis);

    siparisGoster();
}


// =======================================
// 💳 ÖDEME
// =======================================

function odemeOnay() {

    if (!aktifMasa) return alert("Masa seç!");

    let toplam = document.getElementById("toplamTutar")?.innerText || 0;

    if (toplam == 0) return alert("Boş masa!");

    document.getElementById("modalTutar").innerText = toplam;

    modal?.show();
}


// =======================================
// 💰 ÖDEME TAMAM
// =======================================

function odemeYap(tip) {

    let siparis = getData("masa_" + aktifMasa);

    let rapor = getData("gun_sonu_raporu");

    rapor.push({
        masa: aktifMasa,
        tur: tip,
        tutar: Number(document.getElementById("toplamTutar").innerText),
        urunler: siparis,
        tarih: new Date().toISOString()
    });

    setData("gun_sonu_raporu", rapor);

    localStorage.removeItem("masa_" + aktifMasa);

    modal?.hide();

    siparisGoster();
    masaOlustur();

    alert("Ödeme alındı!");
}
function renderSiparisMasalar() {

    const masalar = getMasalar();

    console.log("MASALAR:", masalar);

    for (let i = 1; i <= 12; i++) {

        if (masalar[i]) {
            console.log(`🟢 Masa ${i} DOLU`);
        } else {
            console.log(`⚪ Masa ${i} BOŞ`);
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    masaOlustur();
    menuYukle();
    if (aktifMasa) siparisGoster();
});