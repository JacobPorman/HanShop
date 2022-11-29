let perPage = 6;
let idPage = 1;
let start = 0;
let end = perPage;
let currentPage = 1;

// localStorage.setItem("products", JSON.stringify(product));
// localStorage.removeItem("products");
//  productIncart[];
const product = getDataFromLocal("products");
const categories = getDataFromLocal("categories");
const productIncart = getDataFromLocal("productInCart");

// totalPage = product / page-size

// page = 1 =>
// start = page-size * (page - 1)
// end = start + page-size
// start = 0  6
// end = 6  12
// produce.slice(start, end)

let productArr = [];
let showAdd = false;
let totalPages = Math.ceil(product.length / perPage);

window.addEventListener("load", () => {
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  renderProduct(product);
  renderListPage();
  renderIconProduct(categories);
  changePage();
  renderProductIncart();
  renderProductCheckout();

  nextBtn.addEventListener("click", () => {
    currentPage++;

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    if (currentPage === totalPages) {
      $(".next").addClass("btn-active");
    }
    $(".prev").removeClass("btn-active");
    $(".number-page li").removeClass("active");
    $(`.number-page li:eq(${currentPage - 1})`).addClass("active");

    getCurrentPage(currentPage);
    filterByCategory();
  });

  prevBtn.addEventListener("click", () => {
    currentPage--;

    if (currentPage <= 1) {
      currentPage = 1;
    }

    if (currentPage === 1) {
      $(".prev").addClass("btn-active");
    }
    $(".next").removeClass("btn-active");
    $(".number-page li").removeClass("active");
    $(`.number-page li:eq(${currentPage - 1})`).addClass("active");

    getCurrentPage(currentPage);
    filterByCategory();
  });

  // // Searching for products
  // const searchInput = document.getElementById("search-form");

  // searchInput.addEventListener("input", (e) => {
  //   let txtsearch = e.target.value.trim().toLowerCase();
  //   console.log(txtsearch);

  //   let listProductDOM = product;
  //   console.log(listProductDOM);
  //   listProductDOM.forEach((item, index) => {
  //     console.log(item[0]);
  //   });
  // });
});

// b1
//  products_in_cart = [{id, name, price, amount, img}, {id, name, price, amount, img}, .....]
//  render_products
// b2
//  them su kien vao button => them object vao products_in_cart

// forEach map filter

// Render khi moi load page index
// const childArr = product.filter((item) => item.category_id == 2);
// renderProduct(childArr);

// Duyet qua 'Product' --> lay category_id gan cho id

// get category name
function getCateName(product) {
  // let category_id = product.category
  let { category_id } = product;

  // let cate = categories.find(function(item) {
  //     if(item.id == category_id) return item
  // });

  let cate = categories.find((item) => item.id == category_id);

  return cate.name;
}

function filterByCategory(id) {
  if (id) {
    const newArr = product.filter((item) => item.category_id == id);
    renderProduct(newArr);
  } else {
    renderProduct(product);
  }
}

// get category name
function getProductById(id) {
  return product.find((item) => item.id == id);
}

function getProductInCartById(id) {
  return productIncart.find((item) => item.id == id);
}

// get category name
function addProductToCart(product) {
  // xu ly trung data va them du lieu vao array
  if (!productIncart.find((item) => item.id == product.id)) {
    product.quantity = 1;
    productIncart.push(product);
  }
  // luu arr len localStorage
  localStorage.setItem("productInCart", JSON.stringify(productIncart));

  // render
  renderProductIncart();
}

function renderProduct() {
  let productCard = document.getElementsByClassName("product-cards")[0];
  let html = "";
  product.filter((item, index) => {
    if (index >= start && index < end) {
      html += `
    <div class="product-detail-area detail-form" product_id="${item.id}">
      <div class="top-container">
        <div class="close-btn detail-btn-close">
          <i class="fa-solid fa-xmark"></i>
        </div>
        <div class="row align-item-center">
          <div class="book-img">
            <img src="${item.image}" />
          </div>
          <div class="book-info">
            <div class="top-content">
              <h2>${item.title}</h2>
              <p>Details</p>
              <ul class="tag">
                <li>
                  BookID:
                  <span>${item.id}</span>
                </li>
                <li>
                  Category:
                  <span>${getCateName(item)}</span>
                </li>
                <li>
                  Author:
                  <span>${item.author}</span>
                </li>
                <li>
                  Size:
                  <span>${item.size}</span>
                </li>
                <li>
                  Cost:
                  <span>$${item.cost}</span>
                </li>
              </ul>
              <ul class="cart">
                <li>
                  <ul class="number">
                    <li class="range-input">
                      <span class="minus">-</span>
                      <input class="num" value="1" type="text" />
                      <span class="plus">+</span>
                    </li>
                  </ul>
                </li>
                <li class="add-to-cart" product_id="${item.id}">
                  <button>Add To Cart</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="product-card__item" product_id="${item.id}">
        <div class="top">
            <div class="product-detail">
                <a href="" class="product-thumb">
                    <img src="${item.image}" alt="Products" />
                </a>
                <button product_id="${item.id}" class="details">Details</button>
            </div>

            <div class="product-info">
                <a href="" class="product-cat">${getCateName(item)}</a>
                <a href="./product.html" class="product-name">${item.title}</a>
                <div class="product-price">$${item.cost}</div>
            </div>
        </div>

        <div class="bottom" product_id="${item.id}">
            <button class="cart-text" product_id="${
              item.id
            }">Add to Cart</button>
            <i class="fa-solid fa-plus"></i>
        </div>
    </div>
        `;
    }
    return html;
  });
  productCard.innerHTML = html;

  // show detail product
  let buttons = productCard.querySelectorAll(".details");
  // console.log(buttons);
  let buttons_2 = productCard.querySelectorAll(".bottom");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      let product_id = btn.getAttribute("product_id");

      let detail_product = productCard.querySelector(
        `.detail-form[product_id="${product_id}"]`
      );

      detail_product.classList.add("openDetail");

      // close detail product
      let closeBtn = detail_product.querySelector(".detail-btn-close");
      closeBtn.addEventListener("click", () =>
        detail_product.classList.remove("openDetail")
      );
      // add product to cart

      let addToCartBtn = detail_product.querySelector(".add-to-cart");
      addToCartBtn.addEventListener("click", () => {
        // get product need to add
        addProductToCart(getProductById(product_id));
      });
    });
  });

  buttons_2.forEach((btn5) => {
    btn5.addEventListener("click", () => {
      let product_id_2 = btn5.getAttribute("product_id");

      // add product to cart
      addProductToCart(getProductById(product_id_2));
    });
  });

  var Plus = document.getElementsByClassName("plus");
  var Minus = document.getElementsByClassName("minus");
  var Num = document.getElementsByClassName("num");
  // Increment
  for (var i = 0; i < Plus.length; i++) {
    var button = Plus[i];
    button.addEventListener("click", function (e) {
      var buttonClicked = e.currentTarget;
      var input = buttonClicked.parentElement.children[1];

      var inputValue = input.value;
      var newValue23 = parseInt(inputValue) + 1;

      input.value = newValue23;
      console.log("run");
      // console.log(productInCartById);
    });
  }

  // Decrement
  for (var i = 0; i < Minus.length; i++) {
    var button = Minus[i];
    button.addEventListener("click", function (e) {
      var buttonClicked = e.target;
      var input = buttonClicked.parentElement.children[1];
      var inputProductId2 =
        buttonClicked.parentElement.parentElement.getAttribute("product_id");

      var inputValue = input.value;
      let newValue2 = parseInt(inputValue) - 1;

      if (newValue2 >= 1) {
        input.value = newValue2;
      }
    });
  }
}

// (function () {
// )();

function renderProductIncart() {
  const CartItemForm = document.getElementsByClassName("cart-items-form")[0];
  let html = "";
  let total = 0;

  productIncart.forEach((item, index) => {
    sumTotal();

    html += `
    <div class="cart-item" product_id="${item.id}">
          <span class="x-mark__times fa-regular fa-circle-xmark"></span>
          <img src="${item.image}" alt="" />
          <div class="content">
            <h3>${item.title}</h3>
            <div class="price">$${item.cost} x ${item.quantity}</div>
          </div>
          <div class="range-input">
            <span class="minus">-</span>
            <input class="num" value="${item.quantity}" type="text" />
            <span class="plus">+</span>
          </div>
    </div>
    `;
    document.getElementsByClassName("cart-items-list")[0].innerHTML = html;
  });

  // console.log(total);

  // remove Product in Cart
  const XmarkBtn = CartItemForm.querySelectorAll(".x-mark__times");
  XmarkBtn.forEach((btn6, index) => {
    btn6.addEventListener("click", (e) => {
      const getProductinLocal = localStorage.getItem("productInCart");
      const converse = JSON.parse(getProductinLocal);

      let targetFromXmark = e.target.parentElement;
      let getId = targetFromXmark.getAttribute("product_id");
      if (converse[index].id == getId) {
        converse.splice(index, 1);
        localStorage.setItem("productInCart", JSON.stringify(converse));
      }
      // console.log(converse);
      window.location = "index.html";
    });
  });

  var Plus = document.getElementsByClassName("plus");
  var Minus = document.getElementsByClassName("minus");
  var Num = document.getElementsByClassName("num");

  // Increment
  for (var i = 0; i < Plus.length; i++) {
    var button = Plus[i];
    button.addEventListener("click", function (e) {
      var buttonClicked = e.target;
      var input = buttonClicked.parentElement.children[1];
      var inputProductId =
        buttonClicked.parentElement.parentElement.getAttribute("product_id");

      var inputValue = input.value;
      var newValue = parseInt(inputValue) + 1;

      input.value = newValue;
      console.log("run2");
      productIncart.forEach(function (product) {
        if (product.id == inputProductId) product.quantity = newValue;
      });
      sumTotal();
      // console.log(productInCartById);
    });
  }

  // Decrement
  for (var i = 0; i < Minus.length; i++) {
    var button = Minus[i];
    button.addEventListener("click", function (e) {
      var buttonClicked = e.target;
      var input = buttonClicked.parentElement.children[1];
      var inputProductId =
        buttonClicked.parentElement.parentElement.getAttribute("product_id");

      var inputValue = input.value;
      var newValue = parseInt(inputValue) - 1;

      if (newValue >= 1) {
        input.value = newValue;
      }
      productIncart.forEach(function (product) {
        if (product.id == inputProductId) product.quantity = newValue;
      });
      sumTotal();
    });
  }
}

// render cho Checkout
function renderProductCheckout() {
  let checkout = "";
  let totalOder;
  productIncart.forEach((item, index) => {
    sumTotalOder();
    checkout += `
      <ul class="align-items-center">
        <li class="img">
          <img src="${item.image}" alt="Checkout" />
        </li>
        <li class="name">
          <h4>${item.title}</h4>
        </li>
        <li class="price">
          <span>$${item.cost} x ${item.quantity}</span>
        </li>
      </ul>
      `;
  });
  document.getElementsByClassName("checkout-order-items")[0].innerHTML =
    checkout;
}
renderProductCheckout();

// get category name
function renderIconProduct(categories) {
  // category 'All'
  html = `<li class="product-item" onclick="filterByCategory()">
    <div class="product-item__content">
        <i class="fa-solid fa-border-all"></i>
        <span>All</span>
    </div>
    </li>
`;

  const iconContent = categories.forEach((item, index) => {
    // onclick truyen id cua 'categories' vao function
    html += `
        <li class="product-item" onclick="filterByCategory(${item.id})">
            <div class="product-item__content">
                <i class="${item.icon}"></i>
                <span>${item.name}</span>
            </div>
        </li>
        `;
    document.getElementsByClassName("product-icons__center")[0].innerHTML =
      html;
  });
}

// get category name
function getCurrentPage(currentPage) {
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage;
  // console.log(start, end);
}

function changePage() {
  const currentPages = document.querySelectorAll(".number-page li");
  // console.log(currentPage);

  for (let i = 0; i < currentPages.length; i++) {
    currentPages[i].addEventListener("click", () => {
      const value = i + 1;
      // console.log(value);
      currentPage = value;

      $(".number-page li").removeClass("active");
      currentPages[i].classList.add("active");

      if (currentPage > 1 && currentPage < totalPages) {
        $(".next").removeClass("btn-active");
        $(".prev").removeClass("btn-active");
      }
      if (currentPage === 1) {
        $(".prev").addClass("btn-active");
      }
      if (currentPage === totalPages) {
        $(".next").addClass("btn-active");
      }

      getCurrentPage(currentPage);
      filterByCategory();
    });
  }
}

function renderListPage() {
  html = "";
  html += `
  <li class="active">
    <a>${1}</a>
  </li>
  `;

  for (let i = 2; i <= totalPages; i++) {
    html += `<li><a>${i}</a></li>`;
  }

  document.getElementsByClassName("number-page")[0].innerHTML = html;
}

function getDataFromLocal(key) {
  var string = localStorage.getItem(key);
  var data = JSON.parse(string);

  return data;
}

function sumTotal() {
  total = 0;
  productIncart.forEach((item) => {
    total += item.cost * item.quantity;
  });
  total = total.toFixed(2);

  localStorage.setItem("productInCart", JSON.stringify(productIncart));

  document.querySelector(".total-content__price").innerHTML = "$" + total;
}

function sumTotalOder() {
  totalOder = 1;
  productIncart.forEach((item) => {
    totalOder += item.cost * item.quantity;
  });
  totalOder = totalOder.toFixed(2);

  localStorage.setItem("productInCart", JSON.stringify(productIncart));
  document.querySelector(".checkout-price").innerHTML = "$" + totalOder;
}

// function searchProductInIndex() {
//   var valueInput = document.getElementById("search-box").value;
//   valueInput.addEventListener("input", () => {

//   });

//   renderProduct(productSearch);
// }

function renderProductInSearch(searchProduct) {
  // const listSearch = document.getElementsByClassName("search-list")[0];
  let html = "";
  searchProduct.forEach((item, index) => {
    html += `
    <div class="product-search">
      <img src="${item.image}" alt="" />
      <div class="content-search">
        <h2>${item.title}</h2>
        <h3>$${item.cost}</h3>
      </div>
    </div>
    `;
  });
  document.getElementsByClassName("product-list-search")[0].innerHTML = html;
}
// renderProductInSearch(product);

const searchForm = document.getElementById("search-box");
console.log(searchForm);

searchForm.addEventListener("input", (e) => {
  let searchtxt = e.target.value.trim();
  // let listProductDOM = document.querySelectorAll(".product-list-search");
  // if (product.title === searchtxt) {
  //   renderProductInSearch(product.title);
  // } else {
  //   // item.classList.add('hide');
  // }
  let searchProduct = product.filter((item) => {
    let length = searchtxt.length;
    return (
      item.title.substring(0, length).toLowerCase() === searchtxt.toLowerCase()
    );
  });
  renderProductInSearch(searchProduct);
});
// Tieng Vong
