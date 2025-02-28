document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.getElementById("footer");

    if (!footerContainer) {
        console.error("❌ Footer container not found!");
        return;
    }

    footerContainer.innerHTML = `
        <footer class="modern-footer">
            <div class="download-apps">
                <p>Download our apps</p>
                <div class="download-apps-right">
                    <div class="download-applestore">
                        <a href="https://www.apple.com/">
                            <img src="./images/icons/download-applestore.svg" alt="Download from Apple Store">
                        </a>
                    </div>
                    <div class="download-googleplay">
                        <a href="https://play.google.com/store/games?hl=en">
                            <img src="./images/icons/download-googleplay.svg" alt="Download from Google Play">
                        </a>
                    </div>
                </div>
            </div>

            <div class="footer-content">
                <div class="footer-section">
                    <h3>Connect With Us</h3>
                    <div class="social-icons">
                        <a href="https://facebook.com" target="_blank" class="social-icon facebook">
                            <img src="images/socials/facebook.svg" alt="Facebook">
                        </a>
                        <a href="https://twitter.com" target="_blank" class="social-icon twitter">
                            <img src="images/socials/twitter.svg" alt="Twitter">
                        </a>
                        <a href="https://youtube.com" target="_blank" class="social-icon youtube">
                            <img src="images/socials/youtube.svg" alt="YouTube">
                        </a>
                        <a href="https://instagram.com" target="_blank" class="social-icon instagram">
                            <img src="images/socials/instagram.svg" alt="Instagram">
                        </a>
                        <a href="https://wa.me" target="_blank" class="social-icon whatsapp">
                            <img src="images/socials/whatsapp.svg" alt="WhatsApp">
                        </a>
                        <a href="https://telegram.org" target="_blank" class="social-icon telegram">
                            <img src="images/socials/telegram.svg" alt="Telegram">
                        </a>
                    </div>
                </div>

                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#products">Products</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>Help</h3>
                    <ul>
                        <li><a href="#franchise">Delivery & Returns</a></li>
                        <li><a href="#legal">Credit</a></li>
                        <li><a href="#rent">Guarantee</a></li>
                        <li><a href="#contact">Refunds</a></li>
                        <li><a href="#contact">Service Centers</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>Partnership</h3>
                    <ul>
                        <li><a href="#franchise">Franchise</a></li>
                        <li><a href="#legal">Legal</a></li>
                        <li><a href="#rent">Rent</a></li>
                        <li><a href="#contact">Corporate Clients</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-bottom-right">
                    <div>
                        <img class="payment-icon-mastercard" src="images/socials/mastercard.svg" alt="Mastercard">
                        <img class="payment-icon-visa" src="images/socials/visa.svg" alt="Visa">
                    </div>
                    <p>&copy; 2024 Amazon. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    `;
});