document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");

  if (!headerContainer) {
    console.error("❌ header-container not found!");
    return;
  }

  // Generate the header including the menu container
  headerContainer.innerHTML = `
    <div class="ad-banner">
      <p>Special Offer! Get 20% off on all products!</p>
    </div>
    <div class="placeholder"></div> 

    <div class="header-menu-wrapper">
      <div class="amazon-header">
        <div class="amazon-header-left-section">
          <a href="amazon.html" class="header-link">
            <img class="amazon-logo" src="images/amazon-logo-white.png">
            <img class="amazon-mobile-logo" src="images/amazon-mobile-logo-white.png">
          </a>
        </div>

        <div class="amazon-header-middle-section">
          <img class="menu-icon" src="images/icons/menu.svg">
          <input class="search-bar" type="text" placeholder="Search">
          <button class="search-button">
            <img class="search-icon" src="images/icons/search-icon.png">
          </button>
        </div>

        <div class="amazon-header-right-section">
          <a class="account-icon" href="test.html">
            <svg class="account-icon-svg" width="40px" height="30px" viewBox="0 0 24 24" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
              <defs><style>.cls-1{fill:none;stroke:#ffffff;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs>
              <circle class="cls-1" cx="12" cy="7.25" r="5.73"/>
              <path class="cls-1" d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"/>
            </svg>
          </a>
          <a class="orders-link header-link" href="orders.html">
            <span class="returns-text">Returns</span>
            <span class="orders-text">& Orders</span>
          </a>
          <a class="cart-link header-link" href="checkout.html">
            <img class="cart-icon" src="images/icons/cart-icon.png">
            <div class="cart-quantity js-cart-quantity">0</div>
            <div class="cart-text">Cart</div>
          </a>
        </div>
      </div>

      <!-- MENU CONTAINER NOW INSIDE HEADER -->
      
      <div class="menu-container">
           <div class="logo"> <img src="images/amazon-logo-menu1.png"></div>
        <button class="close-menu-btn">✖</button> 
        <ul class="category-list">
          <li class="category"><a href="filtered-products.html?category=clothing"><img src="images/menu-images/clothes.svg" alt="Clothes"> Clothes</a></li>
          <li class="category"><a href="filtered-products.html?category=electronics"><img src="images/menu-images/electronics.svg" alt="Electronics"> Electronics</a></li>
          <li class="category"><a href="filtered-products.html?category=digital-content"><img src="images/menu-images/digital-content.svg" alt="Digital Content"> Digital content</a></li>
          <li class="category"><a href="filtered-products.html?category=personal-care"><img src="images/menu-images/personal-care.svg" alt="Personal Care"> Personal care</a></li>
          <li class="category"><a href="filtered-products.html?category=fashion"><img src="images/menu-images/fashion.svg" alt="Fashion"> Fashion</a></li>
          <li class="category"><a href="filtered-products.html?category=gift-cards"><img src="images/menu-images/giftcards.svg" alt="Gift Cards"> Gift cards</a></li>
          <li class="category"><a href="login-test.html"><img src="images/menu-images/giftcards.svg" alt="Login Test"> LOGIN-TEST</a></li>
          <li class="category"><a href="access.html"><img src="images/menu-images/giftcards.svg" alt="Access Page"> PAGE I WANT TO ACCESS</a></li>
        </ul>
      </div>
    </div>
  `;

  //  Initialize sticky header behavior
  initStickyHeader();

  // Initialize menu toggle functionality
  initMenuToggle();
});

// Sticky Header Function
function initStickyHeader() {
  const header = document.querySelector(".amazon-header");
  const placeholder = document.querySelector(".placeholder");
  const adBanner = document.querySelector(".ad-banner");

  if (!header || !placeholder) {
    console.error("❌ Header or placeholder not found!");
    return;
  }

  placeholder.style.height = "0px";

  const handleScroll = () => {
    const adBannerHeight = adBanner ? adBanner.offsetHeight : 0;
    const headerHeight = header.offsetHeight;

    if (window.scrollY > adBannerHeight) {
      header.classList.add("is-sticky");
      placeholder.style.height = `${headerHeight}px`; // Preserve space when sticky
    } else {
      header.classList.remove("is-sticky");
      placeholder.style.height = "0px"; // Remove space when not sticky
    }
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => {
    if (header.classList.contains("is-sticky")) {
      placeholder.style.height = `${header.offsetHeight}px`;
    }
  });

  handleScroll();
}









function initMenuToggle() {
  const menuIcon = document.querySelector(".menu-icon");
  const menuContainer = document.querySelector(".menu-container");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const body = document.body;

  if (!menuIcon || !menuContainer || !closeMenuBtn) {
    console.error("❌ Menu elements not found!");
    return;
  }

  // Create a blur overlay and append it to body
  const blurOverlay = document.createElement("div");
  blurOverlay.classList.add("blur-overlay");
  document.body.appendChild(blurOverlay);
  
  // Ensure menu is hidden initially
  menuContainer.classList.remove("active");

  menuIcon.addEventListener("click", () => {
    menuContainer.classList.add("active");
    blurOverlay.style.display = "block";
    body.classList.add("no-scroll");
  });

  function closeMenu() {
    menuContainer.classList.remove("active");
    blurOverlay.style.display = "none";
    body.classList.remove("no-scroll");
  }

  closeMenuBtn.addEventListener("click", closeMenu);
  blurOverlay.addEventListener("click", closeMenu);
}