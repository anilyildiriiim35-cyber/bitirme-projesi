// ======================================================
// 🚀 MASA SİSTEMİ (REFRACTORED)
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const masaAlani = document.getElementById("masaAlani");
    const secBtn = document.getElementById("secBtn");

    if (!masaAlani) {
        console.error("masaAlani bulunamadı!");
        return;
    }

    let secilenMasa = null;

    // ======================================================
    // 🪑 MASALARI OLUŞTUR
    // ======================================================
    function masaOlustur() {

        masaAlani.innerHTML = "";

        for (let i = 1; i <= 12; i++) {

            let rezerv = JSON.parse(
                localStorage.getItem("masa_" + i + "_rezerv")
            );

            let durum = rezerv ? "dolu" : "bos";

            const col = document.createElement("div");
            col.className = "col-md-3 mb-3";

            col.innerHTML = `
                <div class="masa-card ${durum === "bos" ? "masa-bos" : "masa-dolu"}"
                     data-id="${i}">

                    <h5>Masa ${i}</h5>
                    <p>${durum === "bos" ? "BOŞ" : "REZERVE"}</p>

                    ${rezerv ? `
                        <div class="text-warning small">
                            👤 ${rezerv.adSoyad || rezerv.isim}<br>
                            👥 ${rezerv.kisi} kişi
                        </div>
                        <button class="btn btn-sm btn-danger mt-2"
                                onclick="rezervIptal(${i})">
                            İptal Et
                        </button>
                    ` : ""}

                </div>
            `;

            masaAlani.appendChild(col);
        }

        // tek seferde event binding (PERFORMANS FIX)
        document.querySelectorAll(".masa-card").forEach(card => {

            card.addEventListener("click", () => {

                document.querySelectorAll(".masa-card")
                    .forEach(m => m.classList.remove("masa-secili"));

                card.classList.add("masa-secili");

                secilenMasa = Number(card.dataset.id);

                if (secBtn) secBtn.disabled = false;
            });
        });
    }

    // ======================================================
    // 🟡 REZERVASYON ONAY
    // ======================================================
    if (secBtn) {

        secBtn.addEventListener("click", () => {

            if (!secilenMasa) return;

            let isim = prompt("Ad Soyad:");
            if (!isim) return alert("İsim zorunlu!");

            let kisi = prompt("Kişi sayısı:");
            if (!kisi || isNaN(kisi)) return alert("Geçerli sayı gir!");

            let data = {
                adSoyad: isim,
                kisi: Number(kisi),
                tarih: new Date().toLocaleString()
            };

            localStorage.setItem(
                "masa_" + secilenMasa + "_rezerv",
                JSON.stringify(data)
            );

            alert("Masa rezerve edildi!");
            location.reload();
        });
    }

    // ilk yükleme
    masaOlustur();
});


// ======================================================
// ❌ REZERVASYON İPTAL
// ======================================================
function rezervIptal(masaNo) {

    if (!confirm("Rezervasyonu iptal etmek istiyor musun?")) return;

    localStorage.removeItem("masa_" + masaNo + "_rezerv");

    alert("Rezervasyon iptal edildi!");
    location.reload();
}
