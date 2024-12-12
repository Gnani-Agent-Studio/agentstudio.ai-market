const footerTemplate = `
    <footer class="main-footer">
        <div class="footer-content">
            <div class="footer-logo">Agent-Studio.AI</div>
            <div class="footer-links">
                <div class="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <!-- Add more footer columns as needed -->
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Agent-Studio.AI. All rights reserved.</p>
            </div>
        </div>
    </footer>
`;

export function loadFooter() {
    document.body.insertAdjacentHTML('beforeend', footerTemplate);
} 