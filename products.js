function getProducts(){
    return JSON.parse(localStorage.getItem("urban_products")) || [];
}

function saveProducts(data){
    localStorage.setItem("urban_products", JSON.stringify(data));
}

/* SAYFA YÜKLE */
function render(){
    let data = getProducts();
    let html = "";

    data.forEach(p=>{
        html += `
        <tr>
            <td class="fw-bold">${p.name}</td>
            <td>${p.price} ₺</td>
            <td><span class="text-warning">${p.category}</span></td>
            <td>
                <input type="checkbox" class="form-check-input stock-switch"
                ${p.inStock ? "checked":""}
                onchange="stok('${p.id}')">
            </td>
            <td>
                <button class="btn btn-danger btn-sm btn-action" onclick="sil('${p.id}')">Sil</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("liste").innerHTML = html;
}

/* EKLE */
function ekle(){
    let data = getProducts();

    data.push({
        id: Date.now().toString(),
        name: document.getElementById("ad").value,
        price: Number(document.getElementById("fiyat").value),
        category: document.getElementById("kat").value,
        inStock: true
    });

    saveProducts(data);
    render();
}

/* SİL */
function sil(id){
    let data = getProducts().filter(x=>x.id !== id);
    saveProducts(data);
    render();
}

/* STOK */
function stok(id){
    let data = getProducts();
    let u = data.find(x=>x.id === id);
    u.inStock = !u.inStock;
    saveProducts(data);
    render();
}

/* NAVİGASYON */
function gitMenu(){
    window.location.href = "MENÜ.html";
}

function gitSiparis(){
    window.location.href = "siparis.html";
}

render();
