let aktifMasa = null;
const modal = new bootstrap.Modal(document.getElementById('odemeModal'));

// MASALAR
function masaOlustur(){
    let alan = document.getElementById("masaAlani");
    alan.innerHTML = "";

    for(let i=1;i<=12;i++){
        let key = "masa_" + i;
        let siparis = JSON.parse(localStorage.getItem(key)) || [];

        let durum = siparis.length > 0 ? "DOLU" : "BOŞ";
        let renk = siparis.length > 0 ? "bg-danger text-white" : "bg-success text-white";

        alan.innerHTML += `
        <div class="col-md-2 mb-2">
            <div class="card p-3 text-center ${renk}" onclick="masaSec(${i})">
                <div class="masa-no">Masa ${i}</div>
                <small>${durum}</small>
            </div>
        </div>`;
    }
}

// MASA SEÇ
function masaSec(no){
    aktifMasa = no;
    document.getElementById("masaBaslik").innerText = "Masa " + no;
    siparisGoster();
}

// MENÜ
function menuYukle(){
    let urunler = JSON.parse(localStorage.getItem("urban_products")) || [];
    let alan = document.getElementById("menuAlani");
    alan.innerHTML = "";

    urunler.filter(u => u.inStock).forEach(u => {
        alan.innerHTML += `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">
                <div class="yemek-adi">${u.name}</div>
                <div class="fiyat-text">${u.price} ₺</div>
                <button class="btn btn-ekle btn-sm mt-2" onclick="ekle('${u.name}',${u.price})">
                    EKLE +
                </button>
            </div>
        </div>`;
    });
}

// EKLE (ADETLİ)
function ekle(ad,fiyat){
    if(!aktifMasa) return alert("Masa seç!");

    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    let mevcut = siparis.find(x => x.ad === ad);

    if(mevcut){
        mevcut.adet += 1;
    } else {
        siparis.push({ad,fiyat,adet:1});
    }

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
    masaOlustur();
}

// SİPARİŞ GÖSTER
function siparisGoster(){
    if(!aktifMasa) return;

    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    let alan = document.getElementById("siparisListesi");
    let toplam = 0;
    alan.innerHTML = "";

    siparis.forEach((s,i)=>{
        let araToplam = s.fiyat * s.adet;
        toplam += araToplam;

        alan.innerHTML += `
        <div class="border-bottom py-2 d-flex justify-content-between align-items-center">
            <div>
                <b>${s.ad}</b><br>
                ${s.adet} x ${s.fiyat} ₺
            </div>

            <div>
                <button class="btn btn-sm btn-success" onclick="arttir(${i})">+</button>
                <button class="btn btn-sm btn-warning" onclick="azalt(${i})">-</button>
                <button class="btn btn-sm btn-danger" onclick="sil(${i})">X</button>
            </div>
        </div>`;
    });

    document.getElementById("toplamTutar").innerText = toplam;
}

// ARTTIR
function arttir(index){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis[index].adet += 1;

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
    masaOlustur();
}

// AZALT
function azalt(index){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis[index].adet -= 1;

    if(siparis[index].adet <= 0){
        siparis.splice(index,1);
    }

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
    masaOlustur();
}

// SİL
function sil(index){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];

    siparis.splice(index,1);

    localStorage.setItem(key, JSON.stringify(siparis));
    siparisGoster();
    masaOlustur();
}

// MODAL AÇ
function odemeOnay(){
    if(!aktifMasa) return alert("Masa seç!");

    let toplam = document.getElementById("toplamTutar").innerText;
    if(toplam == 0) return alert("Masa boş!");

    document.getElementById("modalTutar").innerText = toplam;
    modal.show();
}

// ÖDEME (NAKİT / KART)
function odemeYap(tip){
    let key = "masa_" + aktifMasa;
    let siparis = JSON.parse(localStorage.getItem(key)) || [];
    let rapor = JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];

    rapor.push({
        tarih: new Date().toISOString().split("T")[0],
        saat: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
        masa: aktifMasa,
        tur: tip, // nakit veya kart
        tutar: Number(document.getElementById("toplamTutar").innerText),
        urunler: siparis.map(x => ({
            ad: x.ad,
            adet: x.adet
        }))
    });

    localStorage.setItem("gun_sonu_raporu", JSON.stringify(rapor));

    // MASAYI TEMİZLE → BOŞ OLUR
    localStorage.removeItem(key);

    modal.hide();
    alert("Ödeme Alındı!");

    siparisGoster();
    masaOlustur();
}

// BAŞLAT
masaOlustur();
menuYukle();