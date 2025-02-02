let headerInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  initializeHeader();
});

// This will initialize header logic and retry if elements are not available initially
function initializeHeader() {
  if (headerInitialized) {
    console.log('Header already initialized for:', window.location.href);
    return;
  }
  headerInitialized = true;

  // Retry logic if elements are not available on the first attempt
  setTimeout(() => {
    const menuIcons = document.querySelectorAll('.menu-icon'); // Select both menu icons
    const menuBar = document.querySelector('.menu-bar'); // Select the menu bar
    const header = document.querySelector('.amazon-header'); // Select the header

    if (menuIcons.length > 0 && menuBar && header) {
      // Initialize Menu logic
      menuIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
          console.log('Menu icon clicked:', icon);
          menuBar.classList.toggle('hidden');
          icon.classList.toggle('menu-icon-active');
        });
      });

      // Sticky header logic
      const adBanner = document.querySelector('.ad-banner');
      const placeholder = document.querySelector('.placeholder');

      const handleScroll = () => {
        const adBannerHeight = adBanner ? adBanner.offsetHeight : 0;
        const headerHeight = header ? header.offsetHeight : 0;

        // Get the position of the header relative to the viewport
        const headerRect = header.getBoundingClientRect();
        const headerTop = headerRect.top; // This is the distance from the top of the viewport

        // Calculate the position of the menu bar based on header's position
        const menuBarTop = headerTop + headerHeight;

        if (window.scrollY > adBannerHeight) {
          header.classList.add("is-sticky");
          menuBar.classList.add("is-sticky"); // Add sticky class to menu-bar
          placeholder.style.height = `${headerHeight}px`;

          // Adjust the top of the menu bar based on the header's top position
          menuBar.style.top = `${menuBarTop}px`; // Position menu bar below the header
        } else {
          header.classList.remove("is-sticky");
          menuBar.classList.remove("is-sticky"); // Remove sticky class from menu-bar
          placeholder.style.height = '0px';
          menuBar.style.top = ''; // Reset the top position when it's not sticky
        }
      };

      if (header && placeholder) {
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial setup
      } else {
        console.error('Header or placeholder not found!');
      }
    } else {
      console.error('Menu icons or menu bar or header not found!');
      // Retry after a short delay
      setTimeout(initializeHeader, 500);
    }
  }, 100);
}