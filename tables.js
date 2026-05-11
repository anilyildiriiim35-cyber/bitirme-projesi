// ======================================================
// 🚀 SAYFA YÜKLENDİĞİNDE ÇALIŞAN ANA SİSTEM
// ======================================================
// Bu yapı sayesinde HTML tamamen yüklendikten sonra
// JavaScript kodları çalışır.
// Böylece element bulunamadı hataları önlenir.
document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // 📌 HTML ELEMENTLERİNİ SEÇME
    // ======================================================
    // JavaScript içinde kullanacağımız HTML alanlarını seçiyoruz.
    const masaAlani = document.getElementById("masaAlani");
    const secBtn = document.getElementById("secBtn");

    // ======================================================
    // ⚠️ GÜVENLİK KONTROLÜ
    // ======================================================
    // Eğer HTML içinde masaAlani yoksa sistem hata vermesin.
    if (!masaAlani) {
        console.error("masaAlani bulunamadı!");
        return;
    }

    // ======================================================
    // 🪑 SEÇİLEN MASA BİLGİSİ
    // ======================================================
    // Kullanıcının hangi masayı seçtiğini tutar.
    let secilenMasa = null;

    // ======================================================
    // 🪑 MASALARI OLUŞTUR
    // ======================================================
    // 1’den 12’ye kadar masa üretir.
    // Her masa localStorage kontrolü yapar.
    for (let i = 1; i <= 12; i++) {

        // ======================================================
        // 📦 LOCALSTORAGE'DAN REZERVASYON VERİSİ ÇEK
        // ======================================================
        // Örnek kayıt:
        // masa_1_rezerv
        let rezerv = JSON.parse(
            localStorage.getItem("masa_" + i + "_rezerv")
        );

        // ======================================================
        // 🎨 MASA DURUMUNU BELİRLE
        // ======================================================
        // Eğer rezerv varsa masa dolu görünür.
        let durum = rezerv ? "dolu" : "bos";

        // ======================================================
        // 📦 MASA KARTI OLUŞTUR
        // ======================================================
        let col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        // ======================================================
        // 🖼 MASA HTML TASARIMI
        // ======================================================
        col.innerHTML = `
            <div class="masa-card ${durum === "bos" ? "masa-bos" : "masa-dolu"}">

                <h5>Masa ${i}</h5>

                <p>${durum === "bos" ? "BOŞ" : "REZERVE"}</p>

                ${rezerv ? `
                    <div class="text-warning small">

                        👤 ${rezerv.adSoyad || rezerv.isim}

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

        // ======================================================
        // 📌 MASAYI SAYFAYA EKLE
        // ======================================================
        masaAlani.appendChild(col);

        // ======================================================
        // 🎯 MASA KARTINI SEÇ
        // ======================================================
        let card = col.querySelector(".masa-card");

        // ======================================================
        // 🖱 MASAYA TIKLAMA OLAYI
        // ======================================================
        // Kullanıcı masa seçince:
        // - eski seçim kaldırılır
        // - yeni masa seçilir
        // - buton aktif olur
        card.addEventListener("click", () => {

            // Önce tüm seçili classları kaldır
            document.querySelectorAll(".masa-card")
                .forEach(m => m.classList.remove("masa-secili"));

            // Yeni seçilen masaya class ekle
            card.classList.add("masa-secili");

            // Seçilen masayı kaydet
            secilenMasa = i;

            // Onay butonunu aktif et
            secBtn.disabled = false;
        });
    }

    // ======================================================
    // 🟡 MASA REZERVASYON ONAYI
    // ======================================================
    // Kullanıcı "Seçilen Masayı Onayla" butonuna basınca çalışır.
    secBtn.addEventListener("click", () => {

        // Masa seçilmediyse işlem yapma
        if (!secilenMasa) return;

        // ======================================================
        // 👤 KULLANICI AD SOYAD AL
        // ======================================================
        let isim = prompt("Ad Soyad:");

        // İsim boşsa işlemi durdur
        if (!isim) {
            return alert("İsim zorunlu!");
        }

        // ======================================================
        // 👥 KİŞİ SAYISI AL
        // ======================================================
        let kisi = prompt("Kişi sayısı:");

        // Sayı değilse hata ver
        if (!kisi || isNaN(kisi)) {
            return alert("Geçerli sayı gir!");
        }

        // ======================================================
        // 📦 REZERVASYON OBJESİ OLUŞTUR
        // ======================================================
        let data = {

            // müşteri adı
            adSoyad: isim,

            // kişi sayısı
            kisi: Number(kisi),

            // rezervasyon tarihi
            tarih: new Date().toLocaleString()
        };

        // ======================================================
        // 💾 LOCALSTORAGE'A KAYDET
        // ======================================================
        localStorage.setItem(
            "masa_" + secilenMasa + "_rezerv",
            JSON.stringify(data)
        );

        // ======================================================
        // ✅ BİLGİ MESAJI
        // ======================================================
        alert("Masa rezerve edildi!");

        // ======================================================
        // 🔄 SAYFAYI YENİLE
        // ======================================================
        // Yeni rezervasyon ekranda görünsün diye.
        location.reload();
    });

});


// ======================================================
// ❌ REZERVASYON İPTAL ETME FONKSİYONU
// ======================================================
// Kullanıcı rezervasyonu silmek istediğinde çalışır.
function rezervIptal(masaNo){

    // ======================================================
    // ⚠️ KULLANICIDAN ONAY AL
    // ======================================================
    let onay = confirm(
        "Rezervasyonu iptal etmek istiyor musun?"
    );

    // İptal dediyse işlemi durdur
    if(!onay) return;

    // ======================================================
    // 🗑 LOCALSTORAGE'DAN SİL
    // ======================================================
    localStorage.removeItem(
        "masa_" + masaNo + "_rezerv"
    );

    // ======================================================
    // ✅ MESAJ GÖSTER
    // ======================================================
    alert("Rezervasyon iptal edildi!");

    // ======================================================
    // 🔄 SAYFAYI YENİLE
    // ======================================================
    location.reload();
}
