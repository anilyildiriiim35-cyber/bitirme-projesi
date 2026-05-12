document.addEventListener("DOMContentLoaded", () => {

    const masaAlani = document.getElementById("masaAlani");
    const secBtn = document.getElementById("secBtn");

    if (!masaAlani) {
        console.error("masaAlani bulunamadı!");
        return;
    }

    let secilenMasa = null;

    // =========================
    // 🪑 MASA LİSTELE
    // =========================
    for (let i = 1; i <= 12; i++) {

        let rezerv = JSON.parse(localStorage.getItem("masa_" + i + "_rezerv"));

        let tables = JSON.parse(localStorage.getItem("urban_tables")) || [];

        let table = tables.find(t => Number(t.id) === Number(i));

        let siparis = JSON.parse(localStorage.getItem("masa_" + i)) || [];

        // =========================
        // 🧠 DURUM MOTORU (FIX)
        // =========================
        let durum = "BOŞ";

        if (siparis.length > 0) {
            durum = "DOLU";
        }
        else if (table && table.status === "occupied") {
            durum = "REZERVE";
        }

        let col = document.createElement("div");
        col.className = "col-md-3 mb-3";

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

        masaAlani.appendChild(col);

        let card = col.querySelector(".masa-card");

        card.addEventListener("click", () => {

            document.querySelectorAll(".masa-card")
                .forEach(m => m.classList.remove("masa-secili"));

            card.classList.add("masa-secili");

            secilenMasa = i;

            secBtn.disabled = false;
        });
    }

    // =========================
    // 🟡 REZERVE ET (VALIDATED)
    // =========================
    secBtn.addEventListener("click", () => {

        if (!secilenMasa) return;

        let isim = prompt("Ad Soyad:");
        if (!isim) return alert("İsim zorunlu!");

        let kisi = prompt("Kişi sayısı:");

        // 🔥 FIX: sadece tam sayı
        if (!kisi || !/^[0-9]+$/.test(kisi) || Number(kisi) <= 0) {
            return alert("Sadece 1 veya daha büyük tam sayı gir!");
        }

        let data = {
            adSoyad: isim,
            kisi: Number(kisi),
            tarih: new Date().toLocaleString()
        };

        localStorage.setItem(
            "masa_" + secilenMasa + "_rezerv",
            JSON.stringify(data)
        );

        let tables = JSON.parse(localStorage.getItem("urban_tables")) || [];

        let table = tables.find(t => Number(t.id) === Number(secilenMasa));

        if (!table) {
            tables.push({
                id: Number(secilenMasa),
                status: "occupied",
                orderItems: []
            });
        } else {
            table.status = "occupied";
        }

        localStorage.setItem("urban_tables", JSON.stringify(tables));

        alert("Masa rezerve edildi!");
        location.reload();
    });

});


// ======================================================
// ❌ REZERVASYON İPTAL (FULL FIX)
// ======================================================
function rezervIptal(masaNo) {

    let onay = confirm("Rezervasyonu iptal etmek istiyor musun?");
    if (!onay) return;

    // 🗑 rezerv sil
    localStorage.removeItem("masa_" + masaNo + "_rezerv");

    // 🔥 TABLE RESET FIX
    let tables = JSON.parse(localStorage.getItem("urban_tables")) || [];

    let table = tables.find(t => Number(t.id) === Number(masaNo));

    if (table) {
        table.status = "empty";
        table.customer = null;
        table.orderItems = [];
    }

    localStorage.setItem("urban_tables", JSON.stringify(tables));

    alert("Rezervasyon iptal edildi!");

    // 🔥 önemli fix: cache temizlemeden reload
    setTimeout(() => location.reload(), 100);
}