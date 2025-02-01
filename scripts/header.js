let headerInitialized = false;

function initializeHeader() {
  if (headerInitialized) {
    console.log('ℹ️ Header already initialized.');
    return;
  }
  headerInitialized = true;

  console.log("✅ Initializing header...");

  const menuIcons = document.querySelectorAll('.menu-icon'); 
  const menuBar = document.querySelector('.menu-bar'); 
  const header = document.querySelector('.amazon-header'); 
  const placeholder = document.querySelector('.placeholder');

  if (menuIcons.length === 0 || !menuBar || !header) {
    console.error("❌ Missing header elements. Stopping initialization.");
    return;
  }

  menuIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      menuBar.classList.toggle('hidden');
      icon.classList.toggle('menu-icon-active');
    });
  });

  const adBanner = document.querySelector('.ad-banner');

  const handleScroll = () => {
    const adBannerHeight = adBanner ? adBanner.offsetHeight : 0;
    const headerHeight = header.offsetHeight;

    if (window.scrollY > adBannerHeight) {
      header.classList.add("is-sticky");
      menuBar.classList.add("is-sticky");

      if (placeholder) {
        placeholder.style.height = `${headerHeight}px`;
      }
    } else {
      header.classList.remove("is-sticky");
      menuBar.classList.remove("is-sticky");

      if (placeholder) {
        placeholder.style.height = "0px";
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); 
}

// Detect page content changes (for dynamic page loads)
const observer = new MutationObserver(() => {
  console.log("🔄 Page content updated. Reinitializing header...");
  headerInitialized = false;
  initializeHeader();
});

// Observe changes in the entire document body
observer.observe(document.body, { childList: true, subtree: true });

// Ensure header is initialized on initial page load
document.addEventListener("DOMContentLoaded", initializeHeader);