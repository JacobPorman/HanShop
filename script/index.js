// Hidden - Shine

// Use 'onclick' !!!

// Cart form
let cartItem = document.querySelector(".cart-items-form");

document.querySelector("#cart-btn").onclick = () => {
  cartItem.classList.toggle("active");
};

// Search form
let searchItem = document.querySelector(".search-form");

document.querySelector("#search-btn").onclick = () => {
  searchItem.classList.toggle("active");
};

// function showproduct() {
//   // var product = JSON.parse(localStorage.getItem("product"));
//   let html = "";
//   for (var i = 0; i < product.length; i++) {
//     html +=
//       '<div class="product"><img src=""><div class="infor"><div class="name">' +
//       product[i].name +
//       '</div><div class="price">' +
//       product[i].price +
//       "</div></div></div>";
//   }

//   product.forEach((item) => {
//     html += `

//     `;
//   });
//   document.querySelector(".products").innerHTML = tr;
// }
// createProduct();
// showproduct();

// function searchProduct() {
//     let productSearch = product.filter((value) => {
//       return value.name.toUpperCase().includes(searchBox);
//     });
//     console.log(productSearch);
//     renderProductInSearch(storageItems);
// }
