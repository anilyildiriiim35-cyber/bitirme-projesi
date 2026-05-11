// =======================================
// 🍽 AKTİF MASAYI TUTAR
// =======================================
// Kullanıcının seçtiği masayı saklar.
// Sipariş işlemleri bu değişken üzerinden yapılır.
let aktifMasa = null;


// =======================================
// 💳 BOOTSTRAP ÖDEME MODALI
// =======================================
// Ödeme ekranındaki modal yapısını başlatır.
const modal = new bootstrap.Modal(
    document.getElementById('odemeModal')
);


// =======================================
// 📦 LOCALSTORAGE'DAN ÜRÜNLERİ ÇEKER
// =======================================
// Tarayıcıda kayıtlı ürünleri getirir.
// Eğer veri yoksa boş dizi döndürür.
function getProducts(){

    return JSON.parse(
        localStorage.getItem("urban_products")
    ) || [];
}


// =======================================
// 💾 ÜRÜNLERİ LOCALSTORAGE'A KAYDEDER
// =======================================
// Ürün dizisini localStorage içine kaydeder.
function saveProducts(data){

    localStorage.setItem(
        "urban_products",
        JSON.stringify(data)
    );
}


// =======================================
// 🟡 MASA REZERVASYON BİLGİSİNİ GETİRİR
// =======================================
// İlgili masanın rezervasyon bilgilerini döndürür.
function getRezerv(masaNo){

    return JSON.parse(
        localStorage.getItem("masa_" + masaNo + "_rezerv")
    );
}


// =======================================
// 🪑 MASALARI EKRANA OLUŞTURUR
// =======================================
// 12 adet masayı dinamik olarak ekrana basar.
// Masa;
// - boşsa yeşil
// - doluysa kırmızı
// - rezerveli ise sarı görünür.
function masaOlustur(){

    let alan = document.getElementById("masaAlani");

    alan.innerHTML = "";

    for(let i = 1; i <= 12; i++){

        let siparis = JSON.parse(
            localStorage.getItem("masa_" + i)
        ) || [];

        let rezerv = getRezerv(i);

        let durum = "BOŞ";
        let renk = "bg-success text-white";

        // Rezerveli masa kontrolü
        if(rezerv){

            durum = "REZERVE";
            renk = "bg-warning text-dark";
        }

        // Sipariş varsa masa dolu görünür
        else if(siparis.length > 0){

            durum = "DOLU";
            renk = "bg-danger text-white";
        }

        alan.innerHTML += `
        <div class="col-md-2 mb-2">

            <div class="card p-3 text-center ${renk}"
            onclick="masaSec(${i})">

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


// =======================================
// 🎯 MASA SEÇME İŞLEMİ
// =======================================
// Kullanıcı bir masaya tıkladığında çalışır.
// Seçilen masayı aktif yapar ve siparişleri gösterir.
function masaSec(no){

    aktifMasa = no;

    document.getElementById("masaBaslik").innerText =
    "Masa " + no;

    siparisGoster();
}


// =======================================
// 🍽 MENÜYÜ EKRANA BASAR
// =======================================
// Aktif ve stokta bulunan ürünleri listeler.
function menuYukle(){

    let urunler = getProducts();

    let alan = document.getElementById("menuAlani");

    alan.innerHTML = "";

    urunler
    .filter(u => u.active && u.stock > 0)

    .forEach(u => {

        alan.innerHTML += `
        <div class="col-md-3 mb-3">

            <div class="card p-3 text-center">

                <b>${u.name}</b>

                <div>${u.price} ₺</div>

                <small>Stok: ${u.stock}</small>

                <button
                class="btn btn-warning btn-sm mt-2"
                onclick="ekle('${u.name}',${u.price})">

                    EKLE

                </button>

            </div>

        </div>`;
    });
}


// =======================================
// 🛒 ÜRÜN EKLE + STOK DÜŞ
// =======================================
// Siparişe ürün ekler.
// Ürün eklendiğinde stok 1 azalır.
function ekle(ad, fiyat){

    if(!aktifMasa){

        return alert("Masa seç!");
    }

    let urunler = getProducts();

    let u = urunler.find(x => x.name === ad);

    // Stok kontrolü
    if(!u || u.stock <= 0){

        return alert("Stok yok!");
    }

    // Stok azalt
    u.stock -= 1;

    // Stok bittiyse ürünü pasif yap
    if(u.stock <= 0){

        u.active = false;
    }

    saveProducts(urunler);

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    let mevcut = siparis.find(x => x.ad === ad);

    // Ürün daha önce eklenmişse adet arttır
    if(mevcut){

        mevcut.adet++;
    }

    // İlk kez ekleniyorsa yeni ürün oluştur
    else{

        siparis.push({
            ad,
            fiyat,
            adet:1
        });
    }

    localStorage.setItem(
        key,
        JSON.stringify(siparis)
    );

    siparisGoster();
    masaOlustur();
    menuYukle();
}


// =======================================
// 📋 SİPARİŞLERİ GÖSTERİR
// =======================================
// Aktif masanın sipariş listesini ekrana basar.
// Toplam fiyat hesaplar.
function siparisGoster(){

    if(!aktifMasa) return;

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    let alan = document.getElementById("siparisListesi");

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

    document.getElementById("toplamTutar").innerText =
    toplam;
}


// =======================================
// ➕ ÜRÜN ADETİNİ ARTIRIR
// =======================================
// Seçilen sipariş ürününün adetini 1 artırır.
function arttir(i){

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    siparis[i].adet++;

    localStorage.setItem(
        key,
        JSON.stringify(siparis)
    );

    siparisGoster();
}


// =======================================
// ➖ ÜRÜN ADETİNİ AZALTIR
// =======================================
// Sipariş adedi azaltılır.
// Adet 0 olursa sipariş silinir.
function azalt(i){

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    siparis[i].adet--;

    if(siparis[i].adet <= 0){

        siparis.splice(i,1);
    }

    localStorage.setItem(
        key,
        JSON.stringify(siparis)
    );

    siparisGoster();
}


// =======================================
// ❌ SİPARİŞİ TAMAMEN SİLER
// =======================================
// Seçilen ürünü sipariş listesinden kaldırır.
function sil(i){

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    siparis.splice(i,1);

    localStorage.setItem(
        key,
        JSON.stringify(siparis)
    );

    siparisGoster();
}


// =======================================
// 💳 ÖDEME MODALINI AÇAR
// =======================================
// Toplam tutarı modal içine yazdırır.
function odemeOnay(){

    if(!aktifMasa){

        return alert("Masa seç!");
    }

    let toplam =
    document.getElementById("toplamTutar").innerText;

    if(toplam == 0){

        return alert("Boş masa!");
    }

    document.getElementById("modalTutar").innerText =
    toplam;

    modal.show();
}


// =======================================
// 💰 ÖDEMEYİ TAMAMLAR
// =======================================
// Siparişi gün sonu raporuna ekler,
// ardından masayı temizler.
function odemeYap(tip){

    let key = "masa_" + aktifMasa;

    let siparis = JSON.parse(
        localStorage.getItem(key)
    ) || [];

    let rapor = JSON.parse(
        localStorage.getItem("gun_sonu_raporu")
    ) || [];

    rapor.push({

        masa: aktifMasa,

        tur: tip,

        tutar:
        document.getElementById("toplamTutar").innerText,

        urunler: siparis,

        tarih: new Date().toLocaleString()
    });

    localStorage.setItem(
        "gun_sonu_raporu",
        JSON.stringify(rapor)
    );

    // Masa siparişlerini temizle
    localStorage.removeItem(key);

    modal.hide();

    siparisGoster();
    masaOlustur();

    alert("Ödeme alındı!");
}


// =======================================
// 🚀 SAYFA BAŞLANGICI
// =======================================
// Sayfa açıldığında:
// - masaları oluşturur
// - menüyü yükler
masaOlustur();
menuYukle();