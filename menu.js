// =======================================
// 📦 ÜRÜNLERİ LOCALSTORAGE'DAN ÇEKER
// =======================================
// Bu fonksiyon tarayıcıda saklanan "urban_products"
// verisini okur. Eğer veri yoksa boş dizi döner.
function getProducts(){
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}


// =======================================
// 📊 MENÜYÜ EKRANA YAZDIRIR
// =======================================
// Bu fonksiyon parametre olarak aldığı ürün listesini
// HTML içine kart olarak basar.
// Sadece aktif ve stokta olan ürünleri gösterir.
function renderMenu(list){

    let container = document.getElementById("menu");

    // Eğer HTML'de menu alanı yoksa hata vermemesi için çık
    if(!container) return;

    let html = "";

    list.forEach(p => {

        // Stokta olmayan veya pasif ürünleri gösterme
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
        </div>`;
    });

    // Oluşturulan HTML'i sayfaya bas
    container.innerHTML = html;
}


// =======================================
// 🔍 KATEGORİYE GÖRE FİLTRELEME YAPAR
// =======================================
// Kullanıcı kategori butonuna bastığında çalışır.
// Seçilen kategoriye göre ürünleri süzer.
function filterMenu(type){

    let data = getProducts();

    // Önce sadece aktif ve stokta olan ürünleri al
    data = data.filter(p => p.active && p.stock > 0);

    // Eğer "hepsi" seçilmediyse kategoriye göre filtrele
    if(type !== "hepsi"){
        data = data.filter(p => p.category === type);
    }

    // Filtrelenmiş listeyi ekrana bas
    renderMenu(data);
}


// =======================================
// 🔎 ÜRÜN ARAMA (SEARCH) FONKSİYONU
// =======================================
// Kullanıcı input'a yazdıkça çalışır.
// Ürün isimlerine göre filtreleme yapar.
function searchMenu(){

    // Kullanıcının yazdığı metni al (küçük harfe çevir)
    let q = document.getElementById("search")?.value.toLowerCase() || "";

    // Ürünleri filtrele
    let data = getProducts()
        .filter(p => p.active && p.stock > 0) // aktif ve stokta olanlar
        .filter(p => p.name.toLowerCase().includes(q)); // arama

    // Sonucu ekrana bas
    renderMenu(data);
}


// =======================================
// 🚀 SAYFA YÜKLENDİĞİNDE ÇALIŞIR
// =======================================
// DOM tamamen yüklendiğinde otomatik olarak
// tüm ürünleri menüye basar.
document.addEventListener("DOMContentLoaded", () => {
    renderMenu(getProducts());
});