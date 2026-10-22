const products = [
  {
    id: "jaspis-onyx",
    name: "Ketting met bamboe-jaspis & onyx",
    material: "Sterling zilver",
    category: "zilver",
    price: 54,
    image: "./public/images/necklace-jaspis.jpg",
    alt: "Zilveren ketting met jaspis en onyx",
    href: "https://www.suzalle.nl/product/zilveren-ketting-bamboe-jaspis-en-onyx/"
  },
  {
    id: "amethist-titanium",
    name: "Ketting met amethist & titanium",
    material: "Sterling zilver",
    category: "zilver",
    price: 125,
    image: "./public/images/necklace-amethyst.jpg",
    alt: "Zilveren ketting met amethist en titanium",
    href: "https://www.suzalle.nl/product/zilveren-ketting-amethist-en-titanium/"
  },
  {
    id: "blauwe-agaat",
    name: "Ketting met blauwe druze-agaat",
    material: "Sterling zilver",
    category: "zilver",
    price: 100,
    image: "./public/images/necklace-agaat.jpg",
    alt: "Zilveren ketting met blauwe druzy-agaat",
    href: "https://www.suzalle.nl/product/zilveren-ketting-blauwe-druze-akaat/"
  },
  {
    id: "leren-armband",
    name: "Leren armband met rosegouden blad",
    material: "Leer",
    category: "leer",
    price: 15,
    image: "https://www.suzalle.nl/wp-content/uploads/2020/03/CSWA047_armband.jpg",
    alt: "Leren armband uit de Suzalle collectie",
    href: "https://www.suzalle.nl/product/leren-armband-met-rose-goud-en-blad/"
  },
  {
    id: "rvs-sterren-ketting",
    name: "RVS-ketting met sterrenhanger",
    material: "Roestvrij staal",
    category: "staal",
    price: 17.5,
    image: "./public/images/steel-necklace.jpg",
    alt: "Roestvrijstalen ketting met sterrenhanger",
    href: "https://www.suzalle.nl/product/ketting-rvs-sterren-hanger/"
  },
  {
    id: "skull-kwast-ketting",
    name: "Ketting met skullhanger & roestbruine kwast",
    material: "Bijoux",
    category: "bijoux",
    price: 17.5,
    image: "./public/images/bijoux-necklace.jpg",
    alt: "Ketting met skullhanger en roestbruine kwast",
    href: "https://www.suzalle.nl/product/ketting-koeien-skull-met-roestbruine-kwast/"
  }
];

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2
});

const productGrid = document.querySelector("#product-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#product-search");
const sortSelect = document.querySelector("#product-sort");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const categoryButtons = [...document.querySelectorAll(".category-card")];
const favoritesToggle = document.querySelector(".favorites-toggle");
const cartToggle = document.querySelector(".cart-toggle");
const cartDrawer = document.querySelector(".cart-drawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartSummary = document.querySelector(".cart-summary");
const cartCount = document.querySelector(".cart-count");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

let activeCategory = "alles";
let favoritesOnly = false;
let cart = [];
let lastFocusedElement = null;

function formatPrice(price) {
  return euro.format(price);
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase("nl");
  const sort = sortSelect.value;
  const visibleProducts = products
    .filter((product) => activeCategory === "alles" || product.category === activeCategory)
    .filter((product) => !favoritesOnly || product.isFavorite)
    .filter((product) => `${product.name} ${product.material}`.toLocaleLowerCase("nl").includes(query))
    .sort((first, second) => {
      if (sort === "price-ascending") return first.price - second.price;
      if (sort === "price-descending") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name, "nl");
      return products.indexOf(first) - products.indexOf(second);
    });

  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "sieraad" : "sieraden"}`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <a class="product-image-link" href="${product.href}" target="_blank" rel="noopener" aria-label="Bekijk ${product.name} op suzalle.nl">
          <img src="${product.image}" alt="${product.alt}" loading="lazy">
        </a>
        <span class="product-tag">${product.material}</span>
        <button class="favorite-button" type="button" data-favorite="${product.id}" aria-label="${product.isFavorite ? "Verwijder" : "Voeg toe aan"} favorieten: ${product.name}" aria-pressed="${Boolean(product.isFavorite)}">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 8.7c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.5Z"/></svg>
        </button>
        <button class="quick-add" type="button" data-add="${product.id}"><span aria-hidden="true">+</span> Voeg toe</button>
      </div>
      <div class="product-info">
        <p class="product-material">${product.material}</p>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
      </div>
    </article>
  `).join("");
}

function setCategory(category) {
  activeCategory = category;
  favoritesOnly = false;
  favoritesToggle.setAttribute("aria-pressed", "false");
  favoritesToggle.setAttribute("aria-label", "Toon favorieten");
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

function renderCart() {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  cartCount.textContent = String(itemCount);
  cartToggle.setAttribute("aria-label", `Winkelwagen, ${itemCount} ${itemCount === 1 ? "artikel" : "artikelen"}`);
  document.querySelector(".drawer-item-count").textContent = `(${itemCount})`;

  cartItems.innerHTML = cart.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${product.image}" alt="">
      <div>
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)} per stuk</p>
        <div class="quantity-control" aria-label="Aantal ${product.name}">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Verwijder één ${product.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Voeg één ${product.name} toe">+</button>
        </div>
      </div>
      <span class="cart-line-total">${formatPrice(product.price * quantity)}</span>
    </article>
  `).join("");

  const isEmpty = itemCount === 0;
  cartEmpty.hidden = !isEmpty;
  cartSummary.hidden = isEmpty;
  cartSummary.querySelector(".cart-subtotal strong").textContent = formatPrice(subtotal);
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.removeAttribute("inert");
  cartToggle.setAttribute("aria-expanded", "true");
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => drawerBackdrop.classList.add("is-open"));
  document.body.classList.add("drawer-open");
  cartDrawer.querySelector(".cart-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("inert", "");
  cartToggle.setAttribute("aria-expanded", "false");
  drawerBackdrop.classList.remove("is-open");
  document.body.classList.remove("drawer-open");
  window.setTimeout(() => {
    drawerBackdrop.hidden = true;
  }, 240);
  lastFocusedElement?.focus();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.product.id === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ product, quantity: 1 });
  renderCart();
  openCart();
}

productGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const product = products.find((item) => item.id === favoriteButton.dataset.favorite);
    if (!product) return;
    product.isFavorite = !product.isFavorite;
    renderProducts();
    return;
  }

  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  if (!quantityButton) return;

  const item = cart.find(({ product }) => product.id === quantityButton.dataset.quantity);
  if (!item) return;
  const productId = item.product.id;
  const change = quantityButton.dataset.change;
  item.quantity += Number(quantityButton.dataset.change);
  if (item.quantity < 1) cart = cart.filter(({ product }) => product.id !== item.product.id);
  renderCart();
  const updatedButton = cartItems.querySelector(`[data-quantity="${productId}"][data-change="${change}"]`);
  (updatedButton || cartDrawer.querySelector(".cart-close")).focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setCategory(button.dataset.filter));
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
    document.querySelector("#uitgelicht").scrollIntoView();
  });
});

document.querySelector("[data-reset-filters]").addEventListener("click", () => {
  searchInput.value = "";
  setCategory("alles");
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

favoritesToggle.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favoritesToggle.setAttribute("aria-pressed", String(favoritesOnly));
  favoritesToggle.setAttribute("aria-label", favoritesOnly ? "Toon alle sieraden" : "Toon favorieten");
  renderProducts();
  document.querySelector("#uitgelicht").scrollIntoView();
});

cartToggle.addEventListener("click", openCart);
cartDrawer.querySelector(".cart-close").addEventListener("click", closeCart);
cartDrawer.querySelector(".cart-continue").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
  if (event.key === "Tab" && cartDrawer.classList.contains("is-open")) {
    const focusable = [...cartDrawer.querySelectorAll('button:not(:disabled), a[href], select:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Menu openen" : "Menu sluiten");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    primaryNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menu openen");
  }
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderProducts();
renderCart();
