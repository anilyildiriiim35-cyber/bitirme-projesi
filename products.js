// =========================
// 🔑 STORAGE KEY
// =========================
// localStorage içerisinde ürünleri tutacağımız ana key.
// Tüm ürün verileri "urban_products" adıyla saklanır.
const KEY = "urban_products";


// =========================
// 📦 ÜRÜNLERİ GETİR
// =========================
// localStorage içindeki ürünleri okur.
// Eğer veri yoksa boş dizi döndürür.
function getProducts(){
    return JSON.parse(localStorage.getItem(KEY)) || [];
}


// =========================
// 💾 ÜRÜNLERİ KAYDET
// =========================
// Parametre olarak gelen ürün listesini
// localStorage içerisine kaydeder.
function saveProducts(data){
    localStorage.setItem(KEY, JSON.stringify(data));
}


// =========================
// 📊 TABLOYU EKRANA YAZDIR
// =========================
// Ürün listesini HTML tablo içerisine render eder.
// Ürünlerin stok durumunu ve bilgilerini gösterir.
function render(){

    let table = document.getElementById("liste");

    // Eğer HTML içinde liste ID'si yoksa
    // hata vermemesi için işlemi durdurur.
    if(!table){
        console.warn("liste ID bulunamadı!");
        return;
    }

    let data = getProducts();
    let html = "";

    // Tüm ürünleri tek tek dolaşır.
    data.forEach(p=>{

        // Stok durumuna göre yazı belirlenir.
        let durum = p.stock > 0 ? "AKTİF" : "STOK BİTTİ";

        // Stok varsa yeşil, yoksa kırmızı renk verir.
        let renk = p.stock > 0 ? "text-success" : "text-danger";

        // HTML tablo satırı oluşturur.
        html += `
        <tr>

            <td class="fw-bold">${p.name}</td>

            <td>${p.price} ₺</td>

            <td>${p.category}</td>

            <td class="${renk}">
                ${p.stock} (${durum})
            </td>

            <td>
                <button 
                class="btn btn-danger btn-sm"
                onclick="sil('${p.id}')">

                    Sil

                </button>
            </td>

        </tr>
        `;
    });

    // Oluşturulan HTML tabloya aktarılır.
    table.innerHTML = html;
}


// =========================
// ➕ YENİ ÜRÜN EKLE
// =========================
// Form inputlarından alınan veriler ile
// yeni ürün oluşturur ve localStorage'a kaydeder.
function ekle(){

    // Input elementlerini alır.
    let adEl = document.getElementById("ad");
    let fiyatEl = document.getElementById("fiyat");
    let katEl = document.getElementById("kat");
    let stokEl = document.getElementById("stok");

    // Eğer inputlardan biri yoksa hata verir.
    if(!adEl || !fiyatEl || !katEl || !stokEl){
        alert("Input ID'leri yanlış veya eksik!");
        return;
    }

    // Input değerlerini alır.
    let ad = adEl.value.trim();
    let fiyat = Number(fiyatEl.value);
    let kat = katEl.value.trim();
    let stok = Number(stokEl.value);

    // Boş alan kontrolü yapar.
    if(!ad || !fiyat || !kat || !stok){
        alert("Tüm alanları doldur!");
        return;
    }

    // Mevcut ürün listesini alır.
    let data = getProducts();

    // Yeni ürün oluşturup listeye ekler.
    data.push({

        id: Date.now().toString(),

        name: ad,

        price: fiyat,

        category: kat,

        stock: stok,

        active: true
    });

    // Güncellenmiş listeyi kaydeder.
    saveProducts(data);

    // Input alanlarını temizler.
    adEl.value = "";
    fiyatEl.value = "";
    katEl.value = "";
    stokEl.value = "";

    // Tabloyu yeniden render eder.
    render();
}


// =========================
// ❌ ÜRÜN SİL
// =========================
// ID bilgisine göre ürünü siler.
function sil(id){

    // Silinmeyecek ürünleri filtreler.
    let data = getProducts().filter(x => x.id !== id);

    // Güncel veriyi kaydeder.
    saveProducts(data);

    // Tabloyu günceller.
    render();
}


// =========================
// 📉 STOK DÜŞÜR
// =========================
// Sipariş verildiğinde ürün stokunu azaltır.
// Eğer stok biterse ürün pasif hale gelir.
function stokDus(name, adet = 1){

    let data = getProducts();

    // Ürünü ismine göre bulur.
    let u = data.find(x => x.name === name);

    // Ürün yoksa işlemi durdurur.
    if(!u) return false;

    // Stok yetersizse hata verir.
    if(u.stock < adet){

        alert("Stok yetersiz!");

        return false;
    }

    // Stok azaltılır.
    u.stock -= adet;

    // Stok bittiyse pasif hale gelir.
    if(u.stock <= 0){

        u.stock = 0;

        u.active = false;
    }

    // Güncel veri kaydedilir.
    saveProducts(data);

    return true;
}


// =========================
// 📈 STOK ARTTIR
// =========================
// Ürün stoğunu manuel artırmak için kullanılır.
function stokArtir(id, adet = 1){

    let data = getProducts();

    // ID'ye göre ürün bulunur.
    let u = data.find(x => x.id === id);

    if(!u) return;

    // Stok artırılır.
    u.stock += adet;

    // Stok tekrar varsa aktif yapılır.
    if(u.stock > 0){

        u.active = true;
    }

    // Güncel veri kaydedilir.
    saveProducts(data);

    // Ekran güncellenir.
    render();
}


// =========================
// 🟢 AKTİF ÜRÜNLERİ GETİR
// =========================
// Sadece stokta olan ve aktif ürünleri döndürür.
// Menü ve sipariş sayfasında kullanılır.
function getActiveProducts(){

    return getProducts().filter(p => 
        p.active && p.stock > 0
    );
}


// =========================
// 🚀 SAYFA BAŞLAT
// =========================
// Sayfa tamamen yüklendiğinde otomatik çalışır.
// Ürün listesini ekrana getirir.
document.addEventListener("DOMContentLoaded", ()=>{

    render();

});
