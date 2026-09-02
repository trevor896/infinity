const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.nav-links');

if (mobileMenuToggle && mobileMenu) {
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
    };

    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            // Focus first link when menu opens for keyboard users
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 0);
            }
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) closeMobileMenu();
    });
}
