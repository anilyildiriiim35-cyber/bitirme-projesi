document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 📌 DOM ELEMENTLERİ
    // =========================
    // masaAlani: masaların basılacağı alan
    // secBtn: masa seçme / rezerv butonu
    const masaAlani = document.getElementById("masaAlani");
    const secBtn = document.getElementById("secBtn");

    // Eğer masa alanı yoksa sistem çalışmayı durdurur
    if (!masaAlani) {
        console.error("masaAlani bulunamadı!");
        return;
    }

    // Kullanıcının seçtiği masa ID'si
    let secilenMasa = null;

    // =========================
    // 🪑 MASA LİSTELEME SİSTEMİ
    // =========================
    // 1'den 12'ye kadar masaları oluşturur
    for (let i = 1; i <= 12; i++) {

        // 🔹 Rezervasyon bilgisi localStorage'dan alınır
        let rezerv = JSON.parse(
            localStorage.getItem("masa_" + i + "_rezerv")
        );

        // 🔹 Genel masa verisi (urban_tables)
        let tables = JSON.parse(
            localStorage.getItem("urban_tables")
        ) || [];

        // 🔹 Bu ID'ye ait masa bulunur
        let table = tables.find(
            t => Number(t.id) === Number(i)
        );

        // 🔹 Masaya ait siparişler
        let siparis = JSON.parse(
            localStorage.getItem("masa_" + i)
        ) || [];

        // =========================
        // 🔥 FIX 1: OTOMATİK TEMİZLEME
        // =========================
        // Eğer sipariş yok + rezerv yoksa masa "boş" kabul edilir
        // ve localStorage içindeki masa durumu sıfırlanır
        if (siparis.length === 0 && !rezerv && table) {

            table.status = "empty";
            table.customer = null;
            table.orderItems = [];

            localStorage.setItem(
                "urban_tables",
                JSON.stringify(tables)
            );
        }

        // =========================
        // 🧠 MASA DURUM MOTORU
        // =========================
        // Masanın ekranda nasıl görüneceğini belirler

        let durum = "BOŞ";

        // Sipariş varsa masa dolu
        if (siparis.length > 0) {
            durum = "DOLU";
        }
        // Rezerv varsa masa rezerve
        else if (rezerv) {
            durum = "REZERVE";
        }
        // fallback: backend occupied ise dolu sayılır
        else if (table && table.status === "occupied") {
            durum = "DOLU";
        }

        // =========================
        // 🧱 MASA KARTI OLUŞTURMA
        // =========================
        let col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        // Her masa için HTML kartı oluşturulur
        col.innerHTML = `
            <div class="masa-card ${
                durum === "BOŞ"
                    ? "masa-bos"
                    : durum === "REZERVE"
                    ? "masa-rezerve"
                    : "masa-dolu"
            }">

                <h5>Masa ${i}</h5>
                <p>${durum}</p>

                ${rezerv ? `
                    <div class="text-warning small">
                        👤 ${rezerv.adSoyad}
                        <br>
                        👥 ${rezerv.kisi} kişi
                    </div>

                    <button class="btn btn-sm btn-danger mt-2"
                    onclick="rezervIptal(${i})">
                        İptal Et
                    </button>
                ` : ""}

            </div>
        `;

        // kart ekrana basılır
        masaAlani.appendChild(col);

        // =========================
        // 🖱️ MASA SEÇME EVENTİ
        // =========================
        let card = col.querySelector(".masa-card");

        card.addEventListener("click", () => {

            // tüm masalardan seçim kaldırılır
            document.querySelectorAll(".masa-card")
                .forEach(m => m.classList.remove("masa-secili"));

            // seçilen masa highlight edilir
            card.classList.add("masa-secili");

            // seçilen masa kaydedilir
            secilenMasa = i;

            // buton aktif edilir
            secBtn.disabled = false;
        });
    }

    // =========================
    // 🟡 REZERVASYON OLUŞTURMA
    // =========================
    secBtn.addEventListener("click", () => {

        // masa seçilmediyse işlem yapma
        if (!secilenMasa) return;

        // kullanıcı adı alınır
        let isim = prompt("Ad Soyad:");
        if (!isim) return alert("İsim zorunlu!");

        // kişi sayısı alınır
        let kisi = prompt("Kişi sayısı:");

        // validasyon (sadece sayı ve >0 olmalı)
        if (!kisi || !/^[0-9]+$/.test(kisi) || Number(kisi) <= 0) {
            return alert("Sadece 1 veya daha büyük tam sayı gir!");
        }

        // rezervasyon objesi oluşturulur
        let data = {
            adSoyad: isim,
            kisi: Number(kisi),
            tarih: new Date().toLocaleString()
        };

        // localStorage'a rezerv yazılır
        localStorage.setItem(
            "masa_" + secilenMasa + "_rezerv",
            JSON.stringify(data)
        );

        // masa verisi çekilir
        let tables = JSON.parse(
            localStorage.getItem("urban_tables")
        ) || [];

        let table = tables.find(
            t => Number(t.id) === Number(secilenMasa)
        );

        // masa yoksa oluşturulur
        if (!table) {

            tables.push({
                id: Number(secilenMasa),
                status: "occupied",
                customer: data.adSoyad,
                orderItems: []
            });

        } else {
            // varsa güncellenir
            table.status = "occupied";
            table.customer = data.adSoyad;
        }

        // kaydet
        localStorage.setItem(
            "urban_tables",
            JSON.stringify(tables)
        );

        alert("Masa rezerve edildi!");

        // sayfa yenilenir
        location.reload();
    });

});


// ======================================================
// ❌ REZERVASYON İPTAL FONKSİYONU
// ======================================================

/**
 * Seçilen masanın rezervasyonunu iptal eder
 * - rezerv localStorage silinir
 * - masa boş hale getirilir
 */
function rezervIptal(masaNo) {

    let onay = confirm("Rezervasyonu iptal etmek istiyor musun?");
    if (!onay) return;

    // rezerv sil
    localStorage.removeItem(
        "masa_" + masaNo + "_rezerv"
    );

    // masa listesi alınır
    let tables = JSON.parse(
        localStorage.getItem("urban_tables")
    ) || [];

    let table = tables.find(
        t => Number(t.id) === Number(masaNo)
    );

    // masa varsa sıfırlanır
    if (table) {

        table.status = "empty";
        table.customer = null;
        table.orderItems = [];
    }

    // kaydet
    localStorage.setItem(
        "urban_tables",
        JSON.stringify(tables)
    );

    alert("Rezervasyon iptal edildi!");

    // UI yenile
    setTimeout(() => location.reload(), 100);
}