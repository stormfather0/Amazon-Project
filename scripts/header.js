let headerInitialized = false;

function initializeHeader() {
  if (headerInitialized) {
    console.log('Header already initialized for:', window.location.href);
    return;
  }
  headerInitialized = true;

  // Wait for the DOM to load
  document.addEventListener("DOMContentLoaded", () => {
    const menuIcons = document.querySelectorAll('.menu-icon'); 
    const menuBar = document.querySelector('.menu-bar'); 
    const header = document.querySelector('.amazon-header'); 
    const placeholder = document.querySelector('.placeholder');
    const adBanner = document.querySelector('.ad-banner');

    if (menuIcons.length > 0 && menuBar && header) {
      menuIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
          menuBar.classList.toggle('hidden');
          icon.classList.toggle('menu-icon-active');
        });
      });
    } else {
      console.error('Menu icons, menu bar, or header not found!');
    }

    // Sticky header logic
    const handleScroll = () => {
      const adBannerHeight = adBanner ? adBanner.offsetHeight : 0;
      const headerHeight = header ? header.offsetHeight : 0;
      const headerTop = header.getBoundingClientRect().top; 
      const menuBarTop = headerTop + headerHeight;

      if (window.scrollY > adBannerHeight) {
        header.classList.add("is-sticky");
        menuBar.classList.add("is-sticky");
        if (placeholder) {
          placeholder.style.height = `${headerHeight}px`;
        }
        menuBar.style.top = `${menuBarTop}px`;
      } else {
        header.classList.remove("is-sticky");
        menuBar.classList.remove("is-sticky");
        if (placeholder) {
          placeholder.style.height = '0px';
        }
        menuBar.style.top = '';
      }
    };

    if (header) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    } else {
      console.error('Header not found!');
    }
  });
}

// Cleanup before reinitialization
function cleanupHeader() {
  headerInitialized = false;
}

// Handle reinitialization
window.addEventListener("pageshow", () => {
  cleanupHeader();
  initializeHeader();
});