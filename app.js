const products = [{"code": "P001", "name": "Medias tung tung sahur", "price": 7500, "stock": 50, "branch": "Centro"}, {"code": "P002", "name": "Clarinete", "price": 18000, "stock": 45, "branch": "Centro"}, {"code": "P003", "name": "Robot aspiradora", "price": 18000, "stock": 60, "branch": "Norte"}, {"code": "P004", "name": "Sacapelos de gatos", "price": 5400, "stock": 55, "branch": "Norte"}, {"code": "P005", "name": "Hot weels", "price": 5850, "stock": 40, "branch": "Sur"}, {"code": "P006", "name": "Anillos", "price": 2250, "stock": 35, "branch": "Sur"}, {"code": "P007", "name": "Tacho de basura", "price": 6000, "stock": 30, "branch": "Centro"}, {"code": "P008", "name": "Gorra", "price": 3000, "stock": 25, "branch": "Centro"}, {"code": "P009", "name": "Medias de pollo", "price": 9750, "stock": 200, "branch": "Norte"}, {"code": "P010", "name": "Peluche de ado", "price": 21000, "stock": 180, "branch": "Norte"}, {"code": "P011", "name": "Rascador de espalda", "price": 7500, "stock": 150, "branch": "Sur"}, {"code": "P012", "name": "Squishi de queso", "price": 11250, "stock": 140, "branch": "Sur"}, {"code": "P013", "name": "Bolitas inmantadas", "price": 4500, "stock": 50, "branch": "Centro"}, {"code": "P014", "name": "Kit de maquillaje/paleta de sombras", "price": 7800, "stock": 40, "branch": "Centro"}, {"code": "P015", "name": "Taza de gato", "price": 18000, "stock": 35, "branch": "Norte"}, {"code": "P016", "name": "Stickers de Stich", "price": 3750, "stock": 30, "branch": "Norte"}, {"code": "P017", "name": "Masageador de cabeza", "price": 5100, "stock": 28, "branch": "Norte"}, {"code": "P018", "name": "Spray recargable", "price": 4500, "stock": 60, "branch": "Sur"}, {"code": "P019", "name": "Teclado ASMR", "price": 15000, "stock": 55, "branch": "Sur"}, {"code": "P020", "name": "Pantuflas", "price": 10500, "stock": 25, "branch": "Centro"}];

const money = n => "$" + n.toLocaleString("es-AR");
const icons = ["🧦","🎷","🤖","🐱","🚗","💍","🗑️","🧢","🐔","🧸","🪮","🧀","🧲","💄","☕","✨","💆","💦","⌨️","🥿"];
let cart = JSON.parse(localStorage.getItem("randoraCart") || "[]");
let activeFilter = "all";

const grid = document.getElementById("productGrid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");

function renderProducts(){
  let list = products.filter(p => activeFilter==="all" || p.branch===activeFilter);
  const q = search.value.trim().toLowerCase();
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
  if(sort.value==="low") list.sort((a,b)=>a.price-b.price);
  if(sort.value==="high") list.sort((a,b)=>b.price-a.price);
  if(sort.value==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML = list.length ? list.map((p)=>{
    const i=products.findIndex(x=>x.code===p.code);
    return `<article class="card">
      <div class="product-art">${icons[i] || "✦"}</div>
      <span class="code">${p.code} · ${p.branch}</span>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <div class="stock">${p.stock} unidades en stock</div>
      <button class="add" onclick="addToCart('${p.code}')">Agregar al carrito</button>
    </article>`;
  }).join("") : `<div class="empty" style="grid-column:1/-1">No encontramos productos con esa búsqueda.</div>`;
}
function addToCart(code){
  const p=products.find(x=>x.code===code);
  const item=cart.find(x=>x.code===code);
  if(item) item.qty++;
  else cart.push({code,qty:1});
  saveCart(); openCart();
}
function changeQty(code, delta){
  const item=cart.find(x=>x.code===code);
  if(!item)return;
  item.qty += delta;
  if(item.qty<=0) cart=cart.filter(x=>x.code!==code);
  saveCart();
}
function saveCart(){localStorage.setItem("randoraCart",JSON.stringify(cart)); renderCart();}
function renderCart(){
  const box=document.getElementById("cartItems");
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  if(!cart.length){box.innerHTML='<div class="empty">Tu carrito está vacío.<br>Agregá algún producto.</div>';document.getElementById("cartTotal").textContent="$0";return}
  let total=0;
  box.innerHTML=cart.map(x=>{
    const p=products.find(y=>y.code===x.code); const sub=p.price*x.qty; total+=sub;
    return `<div class="cart-row"><div><strong>${p.name}</strong><br><small>${money(p.price)} × ${x.qty}</small></div>
      <div class="qty"><button onclick="changeQty('${p.code}',-1)">−</button> <button onclick="changeQty('${p.code}',1)">+</button></div></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
search.addEventListener("input",renderProducts);
sort.addEventListener("change",renderProducts);
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); activeFilter=b.dataset.filter; renderProducts();
}));
document.querySelectorAll(".theme-dot").forEach(b=>b.addEventListener("click",()=>{
  document.body.dataset.theme=b.dataset.theme;
  document.querySelectorAll(".theme-dot").forEach(x=>x.classList.remove("active")); b.classList.add("active");
  localStorage.setItem("randoraTheme",b.dataset.theme);
}));
const savedTheme=localStorage.getItem("randoraTheme"); if(savedTheme){document.body.dataset.theme=savedTheme;document.querySelectorAll(".theme-dot").forEach(x=>x.classList.toggle("active",x.dataset.theme===savedTheme))}
document.getElementById("checkout").onclick=()=>{
  if(!cart.length){alert("El carrito está vacío.");return}
  const lines=cart.map(x=>{const p=products.find(y=>y.code===x.code);return `${x.qty}× ${p.name} — ${money(p.price*x.qty)}`});
  const total=cart.reduce((s,x)=>s+products.find(y=>y.code===x.code).price*x.qty,0);
  alert("RESUMEN RANDORA\n\n"+lines.join("\n")+"\n\nTOTAL: "+money(total));
};
renderProducts(); renderCart();
