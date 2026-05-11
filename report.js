// =========================
// 🚀 SAYFA BAŞLANGICI
// =========================
// Sayfa açıldığında otomatik çalışır.
// Bugünün tarihini input içine yerleştirir
// ve bugüne ait raporları ekrana getirir.
window.onload = () => {

    // Bugünün tarihini alır.
    let bugun = new Date().toISOString().split('T')[0];

    // Tarih inputuna bugünün tarihini yazar.
    document.getElementById("tarihSecici").value = bugun;

    // Bugünün raporlarını yükler.
    raporuYukle(bugun);
};


// =========================
// 📅 TARİHE GÖRE FİLTRELE
// =========================
// Kullanıcının seçtiği tarihe göre
// raporları yeniden listeler.
function tariheGoreFiltrele() {

    // Input içerisindeki seçili tarihi alır.
    let secilenTarih = document.getElementById("tarihSecici").value;

    // Seçilen tarihe ait raporu getirir.
    raporuYukle(secilenTarih);
}


// =========================
// 📊 RAPOR YÜKLE
// =========================
// localStorage içindeki tüm raporları çeker.
// Tarihe göre filtreler ve tabloya yazdırır.
function raporuYukle(filtreTarih) {

    // LocalStorage içindeki rapor verilerini alır.
    let rapor = JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];

    // HTML elementlerini alır.
    let tablo = document.getElementById("raporTablosu");
    let tCiroGosterge = document.getElementById("toplamCiro");

    // Toplam hesaplama değişkenleri.
    let toplamCiro = 0;
    let nakitToplam = 0;
    let kartToplam = 0;

    // Ürün analiz sayacı.
    let urunSayaci = {};

    // Tabloyu temizler.
    tablo.innerHTML = "";


    // =========================
    // 📅 TARİHE GÖRE FİLTRE
    // =========================
    // Sadece seçilen tarihteki işlemleri getirir.
    let gosterilecekVeri = rapor.filter(islem => 
        islem.tarih === filtreTarih
    );


    // =========================
    // ⚠️ VERİ YOKSA
    // =========================
    // Eğer o tarihte işlem yoksa kullanıcıya bilgi verir.
    if(gosterilecekVeri.length === 0) {

        tablo.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted py-4">
                Bu tarihte yapılmış bir işlem bulunamadı.
            </td>
        </tr>`;
    }


    // =========================
    // 📋 RAPOR TABLOSU
    // =========================
    // İşlemleri tabloya yazdırır.
    gosterilecekVeri.reverse().forEach(islem => {

        // Toplam ciro hesaplanır.
        toplamCiro += Number(islem.tutar);

        // Nakit / kart ayrımı yapılır.
        if(islem.tur === 'NAKİT') {

            nakitToplam += Number(islem.tutar);

        } else {

            kartToplam += Number(islem.tutar);
        }


        // =========================
        // 🍽 ÜRÜN ANALİZİ
        // =========================
        // Satılan ürünlerin adetlerini sayar.
        if(islem.urunler && Array.isArray(islem.urunler)) {

            islem.urunler.forEach(u => {

                urunSayaci[u] = (urunSayaci[u] || 0) + 1;

            });
        }


        // =========================
        // 🎨 ÖDEME TÜRÜ RENK
        // =========================
        // Nakit ve kart işlemlerine renk verir.
        let turRengi = islem.tur === 'NAKİT'
            ? 'text-nakit'
            : 'text-kart';


        // =========================
        // 🧾 TABLO SATIRI EKLE
        // =========================
        tablo.innerHTML += `

        <tr>

            <td>${islem.saat}</td>

            <td>Masa ${islem.masa}</td>

            <td class="tur-metin ${turRengi}">
                ${islem.tur || "-"}
            </td>

            <td class="text-warning fw-bold">
                ${islem.tutar} ₺
            </td>

        </tr>`;
    });


    // =========================
    // 💰 TOPLAM CİRO GÜNCELLE
    // =========================
    tCiroGosterge.innerText = toplamCiro + " ₺";


    // =========================
    // 📈 İSTATİSTİKLERİ GÜNCELLE
    // =========================
    istatistikGuncelle(
        nakitToplam,
        kartToplam,
        urunSayaci,
        toplamCiro
    );
}


// =========================
// 📈 İSTATİSTİKLERİ GÜNCELLE
// =========================
// Nakit / kart yüzdelerini,
// en çok satan ürünü ve analizleri hesaplar.
function istatistikGuncelle(nakit, kart, urunler, toplam) {

    // Progress bar elementleri alınır.
    const nBar = document.getElementById("nakitBar");
    const kBar = document.getElementById("kartBar");


    // =========================
    // 💳 NAKİT / KART YÜZDE
    // =========================
    if(toplam > 0) {

        // Yüzde hesaplama.
        let nYuzde = (nakit / toplam) * 100;
        let kYuzde = (kart / toplam) * 100;

        // Progress bar genişliği ayarlanır.
        nBar.style.width = nYuzde + "%";
        kBar.style.width = kYuzde + "%";

        // Yüzdeler yazdırılır.
        document.getElementById("nakitYuzde").innerText =
            "%" + Math.round(nYuzde);

        document.getElementById("kartYuzde").innerText =
            "%" + Math.round(kYuzde);

        // Toplam tutarlar yazdırılır.
        document.getElementById("nakitTutar").innerText = nakit;

        document.getElementById("kartTutar").innerText = kart;

    } else {

        // Veri yoksa barları sıfırlar.
        nBar.style.width = "0%";
        kBar.style.width = "0%";

        document.getElementById("nakitYuzde").innerText = "%0";
        document.getElementById("kartYuzde").innerText = "%0";
    }


    // =========================
    // 🔥 EN ÇOK SATAN ÜRÜN
    // =========================
    // En fazla satılan ürünü bulur.
    let urunDizisi = Object.entries(urunler);

    if(urunDizisi.length > 0) {

        // Büyükten küçüğe sıralar.
        let enCokSatan =
            urunDizisi.sort((a,b) => b[1] - a[1])[0];

        // Ürün bilgilerini ekrana yazdırır.
        document.getElementById("enCokSatanUrun").innerText =
            enCokSatan[0];

        document.getElementById("enCokSatanAdet").innerText =
            enCokSatan[1] + " adet satıldı";

    } else {

        // Satış yoksa bilgi verir.
        document.getElementById("enCokSatanUrun").innerText =
            "Veri Yok";

        document.getElementById("enCokSatanAdet").innerText =
            "Henüz ürün satışı yok";
    }
}


// =========================
// 🗑 TÜM RAPORLARI TEMİZLE
// =========================
// Kullanıcıdan onay alır.
// Tüm gün sonu raporlarını siler.
function temizle() {

    // Onay kutusu açılır.
    if(confirm(
        "DİKKAT! Tüm geçmiş raporlar kalıcı olarak silinecek. Bu işlem geri alınamaz!"
    )) {

        // LocalStorage içindeki raporları siler.
        localStorage.removeItem("gun_sonu_raporu");

        // Sayfayı yeniler.
        location.reload();
    }
}