// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("tarihSecici");

    const bugun = new Date().toISOString().split("T")[0];

    if (input) input.value = bugun;

    raporuYukle(bugun);
});


// =========================
// 📅 FİLTRE
// =========================
function tariheGoreFiltrele() {

    const input = document.getElementById("tarihSecici");
    if (!input) return;

    raporuYukle(input.value);
}


// =========================
// 📊 RAPOR YÜKLE
// =========================
function raporuYukle(filtreTarih) {

    // 🔥 TEK KAYNAK
    const rapor =
        JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];

    const tablo = document.getElementById("raporTablosu");
    const toplamCiroEl = document.getElementById("toplamCiro");

    if (!tablo || !toplamCiroEl) return;

    tablo.innerHTML = "";

    let toplam = 0;
    let nakit = 0;
    let kart = 0;
    let urunler = {};


    // =========================
    // 🔎 TARİH FİLTRE (SAFE)
    // =========================
    const veri = rapor.filter(x => {

        const tarih =
            (x.tarih || x.paidAt || "").split("T")[0];

        return tarih === filtreTarih;
    });


    // =========================
    // ❌ VERİ YOK
    // =========================
    if (veri.length === 0) {

        tablo.innerHTML = `
        <tr>
            <td colspan="4" class="text-center text-muted py-4">
                Bu tarihte işlem bulunamadı
            </td>
        </tr>`;

        toplamCiroEl.innerText = "0 ₺";

        istatistikGuncelle(0, 0, {}, 0);

        return;
    }


    // =========================
    // 📋 TABLO DOLDUR
    // =========================
    veri.forEach(x => {

        const tutar = Number(x.tutar || x.amount || 0);

        toplam += tutar;

        const tur = x.tur || x.paymentType || "-";

        if (tur === "NAKİT") nakit += tutar;
        else kart += tutar;


        // =========================
        // 🍽 ÜRÜN SAYACI (SAFE)
        // =========================
        const items = x.urunler || x.items || [];

        if (Array.isArray(items)) {

            items.forEach(u => {

                const ad = u.ad || u.name || "Bilinmeyen";
                const adet = u.adet || u.quantity || 1;

                urunler[ad] = (urunler[ad] || 0) + adet;
            });
        }


        // =========================
        // 🧾 TABLO SATIRI
        // =========================
        tablo.innerHTML += `
        <tr>
            <td>${new Date(x.tarih || x.paidAt).toLocaleTimeString()}</td>
            <td>Masa ${x.masa || x.tableId || "-"}</td>
            <td class="${tur === "NAKİT" ? "text-success" : "text-primary"}">
                ${tur}
            </td>
            <td class="text-warning fw-bold">
                ${tutar} ₺
            </td>
        </tr>`;
    });


    toplamCiroEl.innerText = toplam + " ₺";

    istatistikGuncelle(nakit, kart, urunler, toplam);
}


// =========================
// 📈 İSTATİSTİK
// =========================
function istatistikGuncelle(nakit, kart, urunler, toplam) {

    const nBar = document.getElementById("nakitBar");
    const kBar = document.getElementById("kartBar");

    const nY = document.getElementById("nakitYuzde");
    const kY = document.getElementById("kartYuzde");

    const enUrun = document.getElementById("enCokSatanUrun");
    const enAdet = document.getElementById("enCokSatanAdet");


    // =========================
    // 💳 YÜZDE
    // =========================
    if (toplam > 0) {

        const n = (nakit / toplam) * 100;
        const k = (kart / toplam) * 100;

        if (nBar) nBar.style.width = n + "%";
        if (kBar) kBar.style.width = k + "%";

        if (nY) nY.innerText = "%" + Math.round(n);
        if (kY) kY.innerText = "%" + Math.round(k);
    } else {

        if (nBar) nBar.style.width = "0%";
        if (kBar) kBar.style.width = "0%";
    }


    // =========================
    // 🔥 EN ÇOK SATAN
    // =========================
    const entries = Object.entries(urunler);

    if (entries.length > 0) {

        const en = entries.sort((a, b) => b[1] - a[1])[0];

        if (enUrun) enUrun.innerText = en[0];
        if (enAdet) enAdet.innerText = en[1] + " adet";

    } else {

        if (enUrun) enUrun.innerText = "Veri Yok";
        if (enAdet) enAdet.innerText = "0";
    }
}


// =========================
// 🗑 TEMİZLE
// =========================
function temizle() {

    if (confirm("Tüm raporlar silinsin mi?")) {

        localStorage.removeItem("gun_sonu_raporu");

        location.reload();
    }
}