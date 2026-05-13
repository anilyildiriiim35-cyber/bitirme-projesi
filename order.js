// =======================================
// 🍽 AKTİF MASA
// =======================================
let aktifMasa = null;

// =======================================
// 💳 MODAL
// =======================================
let modal;

// =======================================
// 🚀 INIT
// =======================================
document.addEventListener("DOMContentLoaded", () => {

    const modalEl = document.getElementById("odemeModal");
    if (modalEl) modal = new bootstrap.Modal(modalEl);

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
// 🪑 MASA DURUM MOTORU (FIX CORE)
// =======================================
function masaOlustur() {

    const alan = document.getElementById("masaAlani");
    if (!alan) return;

    alan.innerHTML = "";

    let tables = getData("urban_tables");

    for (let i = 1; i <= 12; i++) {

        let siparis = getData("masa_" + i);

        let table = tables.find(t => Number(t.id) === i);

        // =========================
        // 🔥 FIX: default masa oluştur
        // =========================
        if (!table) {
            table = {
                id: i,
                status: "empty"
            };
            tables.push(table);
        }

        let durum = "BOŞ";
        let renk = "bg-success text-white";

        // =========================
        // 🔥 ÖNCELİK SIRASI (DOĞRU)
        // =========================

        if (siparis.length > 0) {
            durum = "DOLU";
            renk = "bg-danger text-white";
            table.status = "occupied";
        }
        else if (table.status === "occupied") {
            durum = "REZERVE";
            renk = "bg-warning text-dark";
        }
        else {
            table.status = "empty";
        }

        setData("urban_tables", tables);

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
    document.getElementById("masaBaslik").innerText = "Masa " + no;
    siparisGoster();
}

// =======================================
// 🍽 MENÜ
// =======================================
function menuYukle() {

    const alan = document.getElementById("menuAlani");
    if (!alan) return;

    let urunler = getData("urban_products");

    alan.innerHTML = "";

    urunler.filter(u => Number(u.stock) > 0).forEach(u => {

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

    let products = getData("urban_products");
    let urun = products.find(x => x.id === id);

    if (!urun || urun.stock <= 0) return alert("Stok yok!");

    urun.stock--;

    setData("urban_products", products);

    let key = "masa_" + aktifMasa;
    let siparis = getData(key);

    let item = siparis.find(x => x.id === id);

    if (item) item.adet++;
    else siparis.push({
        id: urun.id,
        ad: urun.name,
        fiyat: urun.price,
        adet: 1
    });

    setData(key, siparis);

    masaOlustur();
    menuYukle();
    siparisGoster();
}

// =======================================
// 📋 SİPARİŞ
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
// ➕ ➖ ❌
// =======================================
function arttir(i) {
    let s = getData("masa_" + aktifMasa);
    s[i].adet++;
    setData("masa_" + aktifMasa, s);
    siparisGoster();
}

function azalt(i) {
    let s = getData("masa_" + aktifMasa);
    s[i].adet--;

    if (s[i].adet <= 0) s.splice(i, 1);

    setData("masa_" + aktifMasa, s);

    // 🔥 masa boş kaldıysa status reset
    if (s.length === 0) {

        let tables = getData("urban_tables");

        let t = tables.find(x =>
            Number(x.id) === Number(aktifMasa)
        );

        if (t) t.status = "empty";

        setData("urban_tables", tables);

        masaOlustur();
    }

    siparisGoster();
}

function sil(i) {

    let s = getData("masa_" + aktifMasa);

    s.splice(i, 1);

    setData("masa_" + aktifMasa, s);

    // 🔥 tüm sipariş silindiyse masa boşalt
    if (s.length === 0) {

        let tables = getData("urban_tables");

        let t = tables.find(x =>
            Number(x.id) === Number(aktifMasa)
        );

        if (t) t.status = "empty";

        setData("urban_tables", tables);

        masaOlustur();
    }

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

    // =======================================
    // 🔥 MASA SİPARİŞİNİ SİL
    // =======================================
    localStorage.removeItem("masa_" + aktifMasa);

    // =======================================
    // 🔥 MASAYI BOŞA ÇIKAR (FIX)
    // =======================================
    let tables = getData("urban_tables");

    let t = tables.find(x =>
        Number(x.id) === Number(aktifMasa)
    );

    if (t) {
        t.status = "empty";
    }

    setData("urban_tables", tables);

    // =======================================
    // 🔥 EKRANI RESETLE
    // =======================================
    aktifMasa = null;

    modal?.hide();

    masaOlustur();

    document.getElementById("siparisListesi").innerHTML = "";

    document.getElementById("toplamTutar").innerText = "0";

    document.getElementById("masaBaslik").innerText =
        "Masa Seçilmedi";

    alert("Ödeme alındı!");
}
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

    // =======================================
    // 🔥 FULL CLEAN FIX (EKLENDİ)
    // =======================================

    localStorage.removeItem("masa_" + aktifMasa);
    localStorage.removeItem("masa_" + aktifMasa + "_rezerv"); // 🔥 KRİTİK FIX

    let tables = getData("urban_tables");

    let t = tables.find(x =>
        Number(x.id) === Number(aktifMasa)
    );

    if (t) {
        t.status = "empty";
        t.customer = null;   // 🔥 KRİTİK FIX
    }

    setData("urban_tables", tables);

    // =======================================
    // 🔥 UI RESET
    // =======================================

    aktifMasa = null;

    modal?.hide();

    masaOlustur();

    document.getElementById("siparisListesi").innerHTML = "";
    document.getElementById("toplamTutar").innerText = "0";
    document.getElementById("masaBaslik").innerText =
        "Masa Seçilmedi";

    alert("Ödeme alındı!");
}