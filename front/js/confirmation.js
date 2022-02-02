/******************** Variables ********************/
const orderHTML = document.getElementById("orderId");

let search_params = new URLSearchParams(location.search);
let orderId = search_params.get("orderId");

// Afficher le numéro de commande
orderHTML.innerText = orderId;
