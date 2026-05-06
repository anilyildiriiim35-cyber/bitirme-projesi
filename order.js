
let aktifMasa = null;
const modal = new bootstrap.Modal(document.getElementById('odemeModal'));

// =========================
// 📦 ÜRÜNLER
// =========================
function getProducts(){
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}

function saveProducts(data){
    localStorage.setItem("urban_products", JSON.stringify(data));
}

// =========================
// 🟡 REZERVASYON
// =========================
function getRezerv(masaNo){
    return JSON.parse(localStorage.getItem("masa_" + masaNo + "_rezerv"));
}

// =========================
// 🪑 MASALAR
// =========================
function masaOlustur(){

    let alan = document.getElementById("masaAlani");
    alan.innerHTML = "";

    for(let i=1;i<=12;i++){

        let siparis = JSON.parse(localStorage.getItem("masa_" + i)) || [];
        let rezerv = getRezerv(i);

        let durum = "BOŞ";
        let renk = "bg-success text-white";

        if(rezerv){
            durum = "REZERVE";
            renk = "bg-warning text-dark";
        }
        else if(siparis.length > 0){
            durum = "DOLU";
            renk = "bg-danger text-white";
        }

        alan.innerHTML += `
        <div class="col-md-2 mb-2">
            <div class="card p-3 text-center ${renk}" onclick="masaSec(${i})">

                <div>Masa ${i}</div>
                <small>${durum}</small>

                ${rezerv ? `
                    <div style="font-size:11px; margin-top:5px;">
                        👤 ${rezerv.adSoyad}<br>
                        👥 ${rezerv.kisi} kişi
                    </div>
                ` : ""}

            </div>
        </div>`;
    }
}

// =========================
// 🎯 MASA SEÇ
// =========================
function masaSec(no){
    aktifMasa = no;
    document.getElementById("masaBaslik").innerText = "Masa " + no;
    siparisGoster();
}

// =========================
// 🍽 MENÜ
// =========================
function menuYukle(){

    let urunler = getProducts();
    let alan = document.getElementById("menuAlani");
    alan.innerHTML = "";

    urunler.filter(u => u.active && u.stock > 0).forEach(u => {

        alan.innerHTML += `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">

                <b>${u.name}</b>
                <div>${u.price} ₺</div>
                <small>Stok: ${u.stock}</small>

                <button class="btn btn-warning btn-sm mt-2"
                onclick="ekle('${u.name}',${u.price})">
                    EKLE
                </button>

            </div>
        </div>`;
    });
}

// =========================
// 🛒 EKLE + STOK
// =========================
function ekle(ad,fiyat){

    if(!aktifMasa) return alert("Masa seç!");

    let urunler = getProducts();
    let u = urunler.find(x => x.name === ad);

    if(!u || u.stock <= 0){
        return alert("Stok yok!");
    }

    u.stock -= 1;
    if(u.stock <= 0) u.active = false;

    saveProducts(urunler);

    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    let mevcut = siparis.find(x => x.ad === ad);

    if(mevcut){
        mevcut.adet++;
    } else {
        siparis.push({ad,fiyat,adet:1});
    }

    localStorage.setItem(key, JSON.stringify(siparis));

    siparisGoster();
    masaOlustur();
    menuYukle();
}

// =========================
// 📋 SİPARİŞ
// =========================
function siparisGoster(){

    if(!aktifMasa) return;

    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    let alan = document.getElementById("siparisListesi");
    let toplam = 0;

    alan.innerHTML = "";

    siparis.forEach((s,i)=>{

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

// =========================
// ➕ ARTTIR
// =========================
function arttir(i){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis[i].adet++;
    localStorage.setItem(key, JSON.stringify(siparis));

    siparisGoster();
}

// =========================
// ➖ AZALT
// =========================
function azalt(i){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis[i].adet--;

    if(siparis[i].adet <= 0){
        siparis.splice(i,1);
    }

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
}

// =========================
// ❌ SİL
// =========================
function sil(i){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis.splice(i,1);

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
}

// =========================
// 💳 ÖDEME
// =========================
function odemeOnay(){

    if(!aktifMasa) return alert("Masa seç!");

    let toplam = document.getElementById("toplamTutar").innerText;

    if(toplam == 0) return alert("Boş masa!");

    document.getElementById("modalTutar").innerText = toplam;

    modal.show();
}

// =========================
// 💰 ÖDEME YAP
// =========================
function odemeYap(tip){

    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    let rapor = JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];

    rapor.push({
        masa: aktifMasa,
        tur: tip,
        tutar: document.getElementById("toplamTutar").innerText,
        urunler: siparis,
        tarih: new Date().toLocaleString()
    });

    localStorage.setItem("gun_sonu_raporu", JSON.stringify(rapor));

    localStorage.removeItem(key);

    modal.hide();

    siparisGoster();
    masaOlustur();

    alert("Ödeme alındı!");
}

// =========================
// 🚀 BAŞLAT
// =========================
masaOlustur();
menuYukle();