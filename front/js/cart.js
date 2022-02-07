/******************** Variables ********************/
let productsArray = JSON.parse(localStorage.productToCart);
let cartArray = [];
let infoProduct = [];
let productsQuantity;
let productsPrice;
let productPrice = [];
let productQuantity = [];
let whichProduct;
let orderProducts;
let validFirstName = false;
let validLastName = false;
let validEmail = false;

const cartProducts = document.getElementById("cart__items");
const cartProduct = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const productDeleted = document.getElementsByClassName("deleteItem");
const quantityChange = document.getElementsByClassName("itemQuantity");
const firstName = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const email = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");
const order = document.querySelector(".cart__order__form");

searchProducts();

/******************** Fonctions ********************/
// Fonction qui cherchent les produits dans l'API pour les mettre
// dans un Object puis d'afficher les produits
function searchProducts() {
  Promise.all(
    productsArray.map((product) => {
      return new Promise((resolve) => {
        fetch("http://localhost:3000/api/products/" + product.id)
          .then(function (res) {
            return res.json();
          })
          .then(function (value) {
            infoProduct = {
              id: product.id,
              name: value.name,
              price: value.price,
              quantity: product.quantity,
              color: product.color,
              imageUrl: value.imageUrl,
              altTxt: value.altTxt,
            };
            cartArray.push(infoProduct);
            resolve();
          });
      });
    })
  ).then(() => {
    displayProducts();
  });
}

// Fonction pour afficher les produits avec CreateElement
function displayProducts() {
  cartProducts.innerHTML = "";

  for (let i = 0; i < cartArray.length; i++) {
    let cartItems = document.createElement("article");
    cartItems.setAttribute("class", "cart__item");
    cartItems.setAttribute("data-id", cartArray[i].id);
    cartItems.setAttribute("data-color", cartArray[i].color);

    let cartItemImgDiv = document.createElement("div");
    cartItemImgDiv.setAttribute("class", "cart__item__img");

    let cartItemImg = document.createElement("img");
    cartItemImg.setAttribute("src", cartArray[i].imageUrl);
    cartItemImg.setAttribute("alt", cartArray[i].altTxt);

    let cartItemContent = document.createElement("div");
    cartItemContent.setAttribute("class", "cart__item__content");

    let cartItemContentDescription = document.createElement("div");
    cartItemContentDescription.setAttribute(
      "class",
      "cart__item__content__description"
    );

    let cartItemName = document.createElement("h2");
    let cartItemNameContent = document.createTextNode(cartArray[i].name);
    cartItemName.appendChild(cartItemNameContent);

    let cartItemColor = document.createElement("p");
    let cartItemColorContent = document.createTextNode(cartArray[i].color);
    cartItemColor.appendChild(cartItemColorContent);

    let cartItemPrice = document.createElement("p");
    let cartItemPriceContent = document.createTextNode(
      `${cartArray[i].price} €`
    );
    cartItemPrice.appendChild(cartItemPriceContent);

    let cartItemContentSettings = document.createElement("div");
    cartItemContentSettings.setAttribute(
      "class",
      "cart__item__content__settings"
    );

    let cartItemQuantityDiv = document.createElement("div");
    cartItemQuantityDiv.setAttribute(
      "class",
      "cart__item__content__settings__quantity"
    );

    let cartItemQuantity = document.createElement("p");
    let cartItemQuantityContent = document.createTextNode("Qté : ");
    cartItemQuantity.appendChild(cartItemQuantityContent);

    let cartItemQuantityInput = document.createElement("input");
    cartItemQuantityInput.setAttribute(
      "onchange",
      `changeQuantity(event, '${cartArray[i].id}', '${cartArray[i].color}')`
    );
    cartItemQuantityInput.setAttribute("type", "number");
    cartItemQuantityInput.setAttribute("class", "itemQuantity");
    cartItemQuantityInput.setAttribute("name", "itemQuantity");
    cartItemQuantityInput.setAttribute("min", "1");
    cartItemQuantityInput.setAttribute("max", "100");
    cartItemQuantityInput.setAttribute("value", cartArray[i].quantity);

    let cartItemDeleteDiv = document.createElement("div");
    cartItemDeleteDiv.setAttribute(
      "class",
      "cart__item__content__settings__delete"
    );

    let cartItemDelete = document.createElement("p");
    cartItemDelete.setAttribute("class", "deleteItem");
    cartItemDelete.setAttribute(
      "onclick",
      `deleteProduct('${cartArray[i].id}', '${cartArray[i].color}')`
    );

    let cartItemDeleteContent = document.createTextNode("Supprimer");

    cartItemDelete.appendChild(cartItemDeleteContent);
    cartItems.appendChild(cartItemImgDiv);
    cartItemImgDiv.appendChild(cartItemImg);
    cartItems.appendChild(cartItemContent);
    cartItemContent.appendChild(cartItemContentDescription);
    cartItemContentDescription.appendChild(cartItemName);
    cartItemContentDescription.appendChild(cartItemColor);
    cartItemContentDescription.appendChild(cartItemPrice);
    cartItemContent.appendChild(cartItemContentSettings);
    cartItemContentSettings.appendChild(cartItemQuantityDiv);
    cartItemQuantityDiv.appendChild(cartItemQuantity);
    cartItemQuantityDiv.appendChild(cartItemQuantityInput);
    cartItemContentSettings.appendChild(cartItemDeleteDiv);
    cartItemDeleteDiv.appendChild(cartItemDelete);

    cartProducts.appendChild(cartItems);

    /* html += 
    `<article class="cart__item" data-id="${cartArray[i].id}" data-color="${cartArray[i].color}">
      <div class="cart__item__img">
          <img src="${cartArray[i].imageUrl}" alt="${cartArray[i].altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${cartArray[i].name}</h2>
          <p>${cartArray[i].color}</p>
          <p> ${cartArray[i].price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input onchange="changeQuantity(event, '${cartArray[i].id}', '${cartArray[i].color}')" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartArray[i].quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" onclick="deleteProduct('${cartArray[i].id}', '${cartArray[i].color}')">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`; */
  }
  //cartProducts.innerHTML = html;
  calculateQuantityPrice();
}

// Fonction qui calcule le prix total et la quantité totale
function calculateQuantityPrice() {
  productQuantity = [];
  productPrice = [];

  for (let i in cartArray) {
    productQuantity.push(cartArray[i].quantity);
    let calcProductPrice = cartArray[i].price * cartArray[i].quantity;
    productPrice.push(calcProductPrice);
  }

  productsQuantity = productQuantity.reduce(function (x, y) {
    return x + y;
  });
  productsPrice = productPrice.reduce(function (x, y) {
    return x + y;
  });

  totalQuantity.innerHTML = `${productsQuantity}`;
  totalPrice.innerHTML = `${productsPrice}`;
}

// Fonction qui change la quantité dans le Array de l'API et le Array pour afficher
function changeQuantity(e, id, color) {
  for (let i in productsArray) {
    if (productsArray[i].id == id && productsArray[i].color == color) {
      productsArray[i].quantity = parseInt(e.target.value);
    }
  }

  for (let i in cartArray) {
    if (cartArray[i].id == id && cartArray[i].color == color) {
      cartArray[i].quantity = parseInt(e.target.value);
    }
  }
  calculateQuantityPrice();
  localStorage.productToCart = JSON.stringify(productsArray);
}

// Fonction qui supprime le produit des Array
function deleteProduct(id, color) {
  productsArray = productsArray.filter((product) => {
    return product.id != id || product.color != color;
  });

  localStorage.productToCart = JSON.stringify(productsArray);

  cartArray = cartArray.filter((product) => {
    return product.id != id || product.color != color;
  });

  displayProducts();
}

// Fonction qui vérifie que le prénom est correctement écrit
function validationFirstName(inputFirstName) {
  let msgFirstName;

  if (inputFirstName.value.length < 3) {
    msgFirstName = "Votre prénom ne contient-il pas plus de lettre ?";
  } else if (/[0-9]/.test(inputFirstName.value)) {
    msgFirstName = "Votre prénom n'est pas supposé contenir un chiffre";
  } else {
    validFirstName = true;
    msgFirstName = "";
  }
  firstNameErrorMsg.innerText = msgFirstName;
}

// Fonction qui vérifie que le nom est correctement écrit
function validationLastName(inputLastName) {
  let msgLastName;

  if (inputLastName.value.length < 3) {
    msgLastName = "Votre nom ne contient-il pas plus de lettre ?";
  } else if (/[0-9]/.test(inputLastName.value)) {
    msgLastName = "Votre nom n'est pas supposé contenir un chiffre";
  } else {
    validLastName = true;
    msgLastName = "";
  }

  lastNameErrorMsg.innerText = msgLastName;
}

// Fonction qui vérifie que l'Email est correctement écrit
function validationEmail(inputEmail) {
  let regex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  let msgEmail;

  if (regex.test(inputEmail.value)) {
    validEmail = true;
    msgEmail = "";
  } else {
    msgEmail = `L'adresse mail n'est pas valide`;
  }

  emailErrorMsg.innerHTML = msgEmail;
}

// Fonction qui valide ou non les informations du formulaire
function validContactInfo() {
  if (validFirstName && validLastName && validEmail) {
    return true;
  } else {
    return false;
  }
}

// Fonction qui envoie les infos collectés au serveur
function send(path, data) {
  if (validContactInfo() == true) {
    fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        window.location.href = `${window.location.origin}/front/html/confirmation.html?orderId=${response.orderId}`;
      });
  }
}

/******************** Evenements ********************/
// Evenement quand on change la valeur du prénom
firstName.addEventListener("change", function () {
  validationFirstName(this);
});

// Evenement quand on change la valeur du nom
lastName.addEventListener("change", function () {
  validationLastName(this);
});

// Evenement quand on change la valeur de l'email
email.addEventListener("change", function () {
  validationEmail(this);
});

// Evenement quand on clique sur "Commander !" ou en appuyant sur la touche "Entrée"
order.addEventListener("submit", (e) => {
  e.preventDefault();
  send("http://localhost:3000/api/products/order", {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: productsArray.map((product) => {
      return product.id;
    }),
  });
});
