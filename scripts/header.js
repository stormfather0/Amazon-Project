let headerInitialized = false;

function initializeHeader() {
  if (headerInitialized) {
    console.log('Header already initialized for:', window.location.href);
    return;
  }
  headerInitialized = true;

  // Wait until the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Log elements to check if they're in the DOM
    const menuIcons = document.querySelectorAll('.menu-icon'); 
    const menuBar = document.querySelector('.menu-bar');
    const header = document.querySelector('.amazon-header'); 
    const placeholder = document.querySelector('.placeholder');

    console.log('Menu Icons:', menuIcons); // Log menuIcons
    console.log('Menu Bar:', menuBar); // Log menuBar
    console.log('Header:', header); // Log header
    console.log('Placeholder:', placeholder); // Log placeholder

    if (menuIcons.length > 0 && menuBar && header && placeholder) {
      menuIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
          console.log('Menu icon clicked:', icon);
          menuBar.classList.toggle('hidden');
          icon.classList.toggle('menu-icon-active');
        });
      });
    } else {
      console.error('Menu icons or menu bar or header not found!');
    }

    // Sticky header logic
    const adBanner = document.querySelector('.ad-banner');
    const handleScroll = () => {
      const adBannerHeight = adBanner ? adBanner.offsetHeight : 0;
      const headerHeight = header ? header.offsetHeight : 0;

      const headerRect = header.getBoundingClientRect();
      const headerTop = headerRect.top; 

      const menuBarTop = headerTop + headerHeight;

      if (window.scrollY > adBannerHeight) {
        header.classList.add("is-sticky");
        menuBar.classList.add("is-sticky");
        placeholder.style.height = `${headerHeight}px`;
        menuBar.style.top = `${menuBarTop}px`;
      } else {
        header.classList.remove("is-sticky");
        menuBar.classList.remove("is-sticky");
        placeholder.style.height = '0px';
        menuBar.style.top = '';
      }
    };

    if (header && placeholder) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    } else {
      console.error('Header or placeholder not found!');
    }
  });
}

// Cleanup before reinitialization
function cleanupHeader() {
  headerInitialized = false;
}

// Handle initialization on navigation and handle query parameters
window.addEventListener("pageshow", () => {
  const currentUrl = window.location.href;

  cleanupHeader();
  initializeHeader();
});