/******************** Variables ********************/
let currentProduct = "";
let products = [];
let cart =
  localStorage.productToCart == null
    ? []
    : JSON.parse(localStorage.productToCart);
let productCart = [];
let search_params = new URLSearchParams(location.search);
let idProduct = search_params.get("id");

const itemImgHtml = document.querySelector(".item__img");
const itemName = document.getElementById("title");
const itemPrice = document.getElementById("price");
const itemDescription = document.getElementById("description");
const itemColors = document.getElementById("colors");
const itemTitle = document.title;
const btnCart = document.getElementById("addToCart");
const quantity = document.getElementById("quantity");
const color = document.getElementById("colors");

/******************** Fonctions ********************/
// Rajoute dans le panier
function addToCart() {
  // Met toutes les informations du produit que le client veut dans un Object
  productCart = {
    id: currentProduct._id,
    quantity: parseInt(quantity.value),
    color: color.value,
  };

  let isFinded = false;

  // Vérifier si le panier est vide
  if (cart.length === 0) {
    cart.push(productCart);
  } else {
    // Si le panier n'est pas vide
    // Vérifier si tous les produits sont déjà dans le panier
    for (let i in cart) {
      // Vérifier si il y a déjà le produit de même id et de même couleur dans le panier et dans le produit en cours
      if (
        cart[i].id === productCart.id &&
        cart[i].color === productCart.color
      ) {
        isFinded = true;
        cart[i].quantity =
          // besoin de modifier les valeurs en strings en numbers pour pouvoir les additionner
          parseInt(productCart.quantity) + parseInt(cart[i].quantity);
      }
    }

    if (isFinded == false) {
      cart.push(productCart);
    }
  }

  localStorage.productToCart = JSON.stringify(cart);
}

// Affiche le produit
function displayProduct() {
  let itemImg = document.createElement("img");

  itemImg.setAttribute("src", currentProduct.imageUrl);
  itemImg.setAttribute("alt", currentProduct.altTxt);
  let itemNameContent = document.createTextNode(currentProduct.name);
  let itemPriceContent = document.createTextNode(currentProduct.price);
  let itemDescriptionContent = document.createTextNode(
    currentProduct.description
  );

  itemImgHtml.appendChild(itemImg);
  itemName.appendChild(itemNameContent);
  itemPrice.appendChild(itemPriceContent);
  itemDescription.appendChild(itemDescriptionContent);
  itemTitle.innerText = currentProduct.name;

  for (let i in currentProduct.colors) {
    let optionColors = document.createElement("option");
    optionColors.setAttribute("value", currentProduct.colors[i]);
    let optionColorsContent = document.createTextNode(currentProduct.colors[i]);

    optionColors.appendChild(optionColorsContent);
    itemColors.appendChild(optionColors);
  }

  /* Autre moyen pour afficher le produit avec InnerHTML */

  /*  
  itemTitle.innerHTML = `<title>${currentProduct.name}</title>`;
  itemImg.innerHTML += `<img src="${currentProduct.imageUrl}" alt="${currentProduct.altTxt}">`;
  itemName.innerHTML += `${currentProduct.name}`;
  itemPrice.innerHTML += `${currentProduct.price}`;
  itemDescription.innerHTML += `${currentProduct.description}`;
  for (let i in currentProduct.colors) {
    itemColors.innerHTML += `
      <option value="${currentProduct.colors[i]}">${currentProduct.colors[i]}</option>`;
  } 
  */
}

// Prend les info du produit dans l'API
function getProducts() {
  fetch("http://localhost:3000/api/products")
    .then(function (res) {
      return res.json();
    })
    .then(function (value) {
      products = value;
      currentProduct = products.find((product) => product._id === idProduct);
      displayProduct();
    });
}

getProducts();

// Evenement
// Quand les clients cliquent sur "Ajouter au panier"
btnCart.addEventListener("click", () => {
  addToCart();
});
