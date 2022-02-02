// Variables
let products = [];
let sectionItems = document.getElementById("items");
let str = "http://127.0.0.1:5500/html/product.html?id=42";
let url = new URL(str);
let id = url.searchParams.get("id");

// Fonctions
// Fonction qui affiche tous les produits
function displayProducts() {
  products.forEach((product) => {
    addElement(product);
    /* Autre moyen pour afficher mais avec innerHTML*/

    /* 
    sectionItems.innerHTML += `<a href="./product.html?id=${id}">
    <article>
    <img src="${product.imageUrl}" alt="${product.altTxt}">
    <h3 class="productName">${product.name}</h3>
    <p class="productDescription">${product.description}</p>
    </article>
    </a>`; 
    */
  });
}

// Fonction qui rajoute les éléments avec CreateElement
function addElement(productInfo) {
  let itemsLink = document.createElement("a");
  itemsLink.setAttribute("href", `./product.html?id=${productInfo._id}`);

  let itemsArticle = document.createElement("article");
  let itemsImg = document.createElement("img");
  itemsImg.setAttribute("src", productInfo.imageUrl);
  itemsImg.setAttribute("alt", productInfo.altTxt);

  let itemsH = document.createElement("h3");
  itemsH.setAttribute("class", "productName");
  itemsHContent = document.createTextNode(productInfo.name);

  let itemsDescription = document.createElement("p");
  itemsDescription.setAttribute("class", "productDescription");
  itemsDescrptionContent = document.createTextNode(productInfo.description);

  itemsLink.appendChild(itemsArticle);
  itemsArticle.appendChild(itemsImg);
  itemsArticle.appendChild(itemsH);
  itemsH.appendChild(itemsHContent);
  itemsArticle.appendChild(itemsDescription);
  itemsDescription.appendChild(itemsDescrptionContent);

  sectionItems.appendChild(itemsLink);
}

// Prend les produits dans l'API
function getProducts() {
  fetch("http://localhost:3000/api/products")
    .then(function (res) {
      return res.json();
    })
    .then(function (value) {
      products = value;
      displayProducts();
    });
}

getProducts();
