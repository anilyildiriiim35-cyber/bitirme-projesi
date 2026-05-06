 window.onload = () => {
        
        let bugun = new Date().toISOString().split('T')[0];
        document.getElementById("tarihSecici").value = bugun;
        raporuYukle(bugun);
    };

    function tariheGoreFiltrele() {
        let secilenTarih = document.getElementById("tarihSecici").value;
        raporuYukle(secilenTarih);
    }

    function raporuYukle(filtreTarih) {
        let rapor = JSON.parse(localStorage.getItem("gun_sonu_raporu")) || [];
        let tablo = document.getElementById("raporTablosu");
        let tCiroGosterge = document.getElementById("toplamCiro");
        
        let toplamCiro = 0;
        let nakitToplam = 0;
        let kartToplam = 0;
        let urunSayaci = {}; 
        
        tablo.innerHTML = "";

        
        let gosterilecekVeri = rapor.filter(islem => islem.tarih === filtreTarih);

        if(gosterilecekVeri.length === 0) {
            tablo.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Bu tarihte yapılmış bir işlem bulunamadı.</td></tr>`;
        }

        gosterilecekVeri.reverse().forEach(islem => {
            toplamCiro += Number(islem.tutar);
            if(islem.tur === 'NAKİT') nakitToplam += Number(islem.tutar);
            else kartToplam += Number(islem.tutar);

            // Ürün analizi için ürünleri say
            if(islem.urunler && Array.isArray(islem.urunler)) {
                islem.urunler.forEach(u => {
                    urunSayaci[u] = (urunSayaci[u] || 0) + 1;
                });
            }
            
            let turRengi = islem.tur === 'NAKİT' ? 'text-nakit' : 'text-kart';
            tablo.innerHTML += `
                <tr>
                    <td>${islem.saat}</td>
                    <td>Masa ${islem.masa}</td>
                    <td class="tur-metin ${turRengi}">${islem.tur || "-"}</td>
                    <td class="text-warning fw-bold">${islem.tutar} ₺</td>
                </tr>`;
        });

        tCiroGosterge.innerText = toplamCiro + " ₺";
        istatistikGuncelle(nakitToplam, kartToplam, urunSayaci, toplamCiro);
    }

    function istatistikGuncelle(nakit, kart, urunler, toplam) {
        const nBar = document.getElementById("nakitBar");
        const kBar = document.getElementById("kartBar");
        
        if(toplam > 0) {
            let nYuzde = (nakit / toplam) * 100;
            let kYuzde = (kart / toplam) * 100;
            
            nBar.style.width = nYuzde + "%";
            kBar.style.width = kYuzde + "%";
            document.getElementById("nakitYuzde").innerText = "%" + Math.round(nYuzde);
            document.getElementById("kartYuzde").innerText = "%" + Math.round(kYuzde);
            document.getElementById("nakitTutar").innerText = nakit;
            document.getElementById("kartTutar").innerText = kart;
        } else {
            nBar.style.width = "0%";
            kBar.style.width = "0%";
            document.getElementById("nakitYuzde").innerText = "%0";
            document.getElementById("kartYuzde").innerText = "%0";
        }
        
        // En çok satan ürünü bul
        let urunDizisi = Object.entries(urunler);
        if(urunDizisi.length > 0) {
            let enCokSatan = urunDizisi.sort((a,b) => b[1] - a[1])[0];
            document.getElementById("enCokSatanUrun").innerText = enCokSatan[0];
            document.getElementById("enCokSatanAdet").innerText = enCokSatan[1] + " adet satıldı";
        } else {
            document.getElementById("enCokSatanUrun").innerText = "Veri Yok";
            document.getElementById("enCokSatanAdet").innerText = "Henüz ürün satışı yok";
        }
    }

    function temizle() {
        if(confirm("DİKKAT! Tüm geçmiş raporlar kalıcı olarak silinecek. Bu işlem geri alınamaz!")) {
            localStorage.removeItem("gun_sonu_raporu");
            location.reload();
        }
    }