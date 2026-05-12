// =========================
// 🚀 SAYFA BAŞLATMA (INIT)
// =========================
// Sayfa açıldığında:
// - tarih input'u bugüne ayarlanır
// - bugünün raporu otomatik yüklenir
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("tarihSecici");

    // Bugünün tarihi (YYYY-MM-DD formatında)
    const bugun = new Date().toISOString().split("T")[0];

    if (input) input.value = bugun;

    // İlk yükleme
    raporuYukle(bugun);
});


// =========================
// 📅 TARİHE GÖRE FİLTRELEME
// =========================
// Kullanıcı tarih seçtiğinde raporu filtreler
function tariheGoreFiltrele() {

    const input = document.getElementById("tarihSecici");
    if (!input) return;

    raporuYukle(input.value);
}


// =========================
// 📊 GÜN SONU RAPOR YÜKLEME
// =========================
// localStorage'dan rapor verilerini çeker
// seçilen tarihe göre filtreler
// tablo + istatistikleri oluşturur
function raporuYukle(filtreTarih) {

    const rapor = JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];

    const tablo = document.getElementById("raporTablosu");
    const toplamCiroEl = document.getElementById("toplamCiro");

    if (!tablo || !toplamCiroEl) return;

    tablo.innerHTML = "";

    // =========================
    // 📊 TOPLAM İSTATİSTİKLER
    // =========================
    let toplam = 0;
    let nakit = 0;
    let kart = 0;
    let urunler = {}; // ürün bazlı satış sayacı


    // =========================
    // 🔎 TARİH FİLTRELEME
    // =========================
    // Sadece seçilen tarihteki kayıtlar alınır
    const veri = rapor.filter(x => {
        const tarih = (x.tarih || "").split("T")[0];
        return tarih === filtreTarih;
    });


    // =========================
    // ❌ VERİ YOKSA
    // =========================
    if (veri.length === 0) {

        tablo.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    Bu tarihte işlem bulunamadı
                </td>
            </tr>`;

        toplamCiroEl.innerText = "0 ₺";

        // boş veri için istatistikleri sıfırla
        istatistikGuncelle(0, 0, {}, 0);
        return;
    }


    // =========================
    // 📋 RAPOR SATIRLARINI OLUŞTUR
    // =========================
    veri.forEach(x => {

        const tutar = Number(x.tutar || 0);
        const tur = x.tur; // NAKİT / KART

        toplam += tutar;

        // ödeme tipine göre ayrım
        if (tur === "NAKİT") nakit += tutar;
        else kart += tutar;


        // =========================
        // 🍽 ÜRÜN SATIŞ SAYACI
        // =========================
        (x.urunler || []).forEach(u => {

            const ad = u.ad;
            const adet = u.adet || 1;

            urunler[ad] = (urunler[ad] || 0) + adet;
        });


        // =========================
        // 📄 TABLO SATIRI
        // =========================
        tablo.innerHTML += `
        <tr>
            <td>${new Date(x.tarih).toLocaleTimeString()}</td>
            <td>Masa ${x.masa}</td>
            <td class="${tur === "NAKİT" ? "text-success" : "text-primary"}">
                ${tur}
            </td>
            <td class="text-warning fw-bold">
                ${tutar} ₺
            </td>
        </tr>`;
    });


    // toplam ciro ekrana yazdırılır
    toplamCiroEl.innerText = toplam + " ₺";

    // istatistik paneli güncellenir
    istatistikGuncelle(nakit, kart, urunler, toplam);
}


// =========================
// 📈 İSTATİSTİK PANELİ
// =========================
// Nakit/kart oranı + en çok satan ürün
function istatistikGuncelle(nakit, kart, urunler, toplam) {

    const nBar = document.getElementById("nakitBar");
    const kBar = document.getElementById("kartBar");

    const nY = document.getElementById("nakitYuzde");
    const kY = document.getElementById("kartYuzde");

    const enUrun = document.getElementById("enCokSatanUrun");
    const enAdet = document.getElementById("enCokSatanAdet");


    // =========================
    // 💳 NAKİT / KART YÜZDE HESABI
    // =========================
    if (toplam > 0) {

        const n = (nakit / toplam) * 100;
        const k = (kart / toplam) * 100;

        if (nBar) nBar.style.width = n + "%";
        if (kBar) kBar.style.width = k + "%";

        if (nY) nY.innerText = "%" + Math.round(n);
        if (kY) kY.innerText = "%" + Math.round(k);

    } else {

        // veri yoksa sıfır göster
        if (nBar) nBar.style.width = "0%";
        if (kBar) kBar.style.width = "0%";
        if (nY) nY.innerText = "%0";
        if (kY) kY.innerText = "%0";
    }


    // =========================
    // 🔥 EN ÇOK SATAN ÜRÜN
    // =========================
    const entries = Object.entries(urunler);

    if (entries.length > 0) {

        // en çok satılan ürün bulunur
        const en = entries.sort((a, b) => b[1] - a[1])[0];

        if (enUrun) enUrun.innerText = en[0];
        if (enAdet) enAdet.innerText = en[1] + " adet";

    } else {

        if (enUrun) enUrun.innerText = "Veri Yok";
        if (enAdet) enAdet.innerText = "0";
    }
}


// =========================
// 🗑 TÜM RAPORU SİL
// =========================
// localStorage'daki tüm gün sonu raporunu temizler
function temizle() {

    if (confirm("Tüm raporlar silinsin mi?")) {
        localStorage.removeItem("gun_sonu_raporu");
        location.reload();
    }
}