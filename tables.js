  let secilenMasa = null;
    const masaAlani = document.getElementById("masaAlani");
    const panel = document.getElementById("siparisPanel");
    const panelIcerik = document.getElementById("siparisIcerik");
    const panelBaslik = document.getElementById("panelBaslik");
    const secBtn = document.getElementById("secBtn");

    
    for (let i = 1; i <= 12; i++) {
        let masaTutar = localStorage.getItem("masa_" + i + "_tutar");
        let siparisler = JSON.parse(localStorage.getItem("masa_" + i + "_siparisler")) || [];
        let durum = masaTutar && parseFloat(masaTutar) > 0 ? "dolu" : "bos";

        let col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        col.innerHTML = `
            <div class="masa-card ${durum === "bos" ? "masa-bos" : "masa-dolu"}" id="card-masa-${i}">
                <h4 class="mb-1">Masa ${i}</h4>
                <p class="small text-secondary mb-0">${durum === "bos" ? "Müsait" : "Dolu"}</p>
                ${durum === "dolu" ? `<div class="tutar">${masaTutar} ₺</div>` : ""}
            </div>
        `;

        masaAlani.appendChild(col);
        const card = col.querySelector(".masa-card");

        
        card.addEventListener("click", () => {
            document.querySelectorAll(".masa-card").forEach(m => m.classList.remove("masa-secili"));
            card.classList.add("masa-secili");
            secilenMasa = i;
            secBtn.disabled = false;
        });

        
        card.addEventListener("mouseenter", () => {
            if (durum === "dolu") {
                panel.classList.add("aktif");
                panelBaslik.innerText = "Masa " + i + " Detayı";
                panelIcerik.innerHTML = "";
                siparisler.forEach(s => {
                    panelIcerik.innerHTML += `<div class="d-flex justify-content-between border-bottom border-secondary py-1">
                        <span>${s.ad}</span> <span>${s.fiyat} ₺</span>
                    </div>`;
                });
            }
        });

        card.addEventListener("mouseleave", () => panel.classList.remove("aktif"));
    }

    
    secBtn.addEventListener("click", function() {
        if (secilenMasa) {
            
            let mevcutTutar = localStorage.getItem("masa_" + secilenMasa + "_tutar");
            if (!mevcutTutar) {
                localStorage.setItem("masa_" + secilenMasa + "_tutar", "0");
                localStorage.setItem("masa_" + secilenMasa + "_siparisler", JSON.stringify([]));
            }
            localStorage.setItem("aktifMasa", secilenMasa);

            
            const seciliKart = document.querySelector(".masa-secili");
            
            
            if (!seciliKart.querySelector(".rezervasyon-yazi")) {
                const uyari = document.createElement("div");
                uyari.className = "rezervasyon-yazi";
                uyari.innerHTML = "✓ Rezervasyon Edilmiştir";
                seciliKart.appendChild(uyari);
            }

            
            secBtn.disabled = true;
            secBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Yönlendiriliyor...`;

            
            setTimeout(() => {
                window.location.href = "siparis.html";
            }, 1500);
        }
    });