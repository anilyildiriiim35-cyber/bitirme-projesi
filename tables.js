document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 📌 DOM ELEMENTLERİ
    // =========================
    const masaAlani = document.getElementById("masaAlani");
    const secBtn = document.getElementById("secBtn");

    // 👤 Form inputları
    const musteriAdiInput =
        document.getElementById("musteriAdi");

    const kisiSayisiInput =
        document.getElementById("kisiSayisi");

    // Eğer masa alanı yoksa sistemi durdur
    if (!masaAlani) {

        console.error("masaAlani bulunamadı!");
        return;
    }

    // seçilen masa
    let secilenMasa = null;

    // =========================
    // 🪑 MASALARI GETİR
    // =========================
    let tables = getTables();

    // =========================
    // 🪑 MASA OLUŞTUR
    // =========================
    for (let i = 1; i <= 12; i++) {

        // ilgili masa
        let table = tables.find(
            t => Number(t.id) === Number(i)
        );

        // siparişler
        let siparis = table?.orderItems || [];

        // müşteri bilgisi
        let rezerv = table?.customer || null;

        // =========================
        // 🔥 OTOMATİK TEMİZLEME
        // =========================
        if (
            siparis.length === 0 &&
            !rezerv &&
            table
        ) {

            table.status = "empty";
        }

        // =========================
        // 🧠 MASA DURUMU
        // =========================
        let durum = "BOŞ";

        if (siparis.length > 0) {

            durum = "DOLU";

        } else if (rezerv) {

            durum = "REZERVE";

        }

        // =========================
        // 🧱 KART OLUŞTUR
        // =========================
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

                        👤 ${rezerv.name}

                        <br>

                        👥 ${rezerv.people} kişi

                    </div>

                    <button 
                        class="btn btn-sm btn-danger mt-2"
                        onclick="rezervIptal(${i})">

                        İptal Et

                    </button>

                ` : ""}

            </div>
        `;

        // ekrana bas
        masaAlani.appendChild(col);

        // =========================
        // 🖱️ MASA SEÇ
        // =========================
        let card = col.querySelector(".masa-card");

        card.addEventListener("click", () => {

            // eski seçimleri kaldır
            document.querySelectorAll(".masa-card")
                .forEach(m =>
                    m.classList.remove("masa-secili")
                );

            // yeni seçim
            card.classList.add("masa-secili");

            // seçilen masa
            secilenMasa = i;

            // buton aktif
            secBtn.disabled = false;
        });
    }

    // =========================
    // 🟡 REZERVASYON
    // =========================
    secBtn.addEventListener("click", () => {

        // masa seçilmediyse
        if (!secilenMasa) {

            alert("Lütfen masa seç!");
            return;
        }

        // input verileri
        let isim =
            musteriAdiInput.value.trim();

        let kisi =
            kisiSayisiInput.value.trim();

        // =========================
        // ❌ VALIDASYON
        // =========================
        if (!isim) {

            alert("İsim zorunlu!");
            return;
        }

        if (
            !kisi ||
            !/^[0-9]+$/.test(kisi) ||
            Number(kisi) <= 0
        ) {

            alert("Geçerli kişi sayısı gir!");
            return;
        }

        // =========================
        // 💾 RESERVE TABLE
        // =========================
        reserveTable(
            Number(secilenMasa),
            isim,
            Number(kisi)
        );

        // mesaj
        alert("Masa rezerve edildi!");

        // input temizle
        musteriAdiInput.value = "";
        kisiSayisiInput.value = "";

        // sayfa yenile
        location.reload();
    });

});


// ======================================================
// ❌ REZERVASYON İPTAL
// ======================================================

function rezervIptal(masaNo) {

    let onay = confirm(
        "Rezervasyonu iptal etmek istiyor musun?"
    );

    if (!onay) return;

    // storage.js fonksiyonu
    cancelTable(Number(masaNo));

    // mesaj
    alert("Rezervasyon iptal edildi!");

    // yenile
    setTimeout(() => location.reload(), 100);
}