// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Code for ALL pages ---

    // JavaScript for mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links on the main page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.length > 1) {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    }
                }
            });
        });
    }

    // --- Animations for index.html ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const gameCards = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, {
            threshold: 0.1
        });

        gameCards.forEach(card => {
            observer.observe(card);
        });

        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('animate__animated', 'animate__pulse');
            });
            link.addEventListener('animationend', () => {
                link.classList.remove('animate__animated', 'animate__pulse');
            });
        });

        const hero = document.querySelector('.hero-bg');
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            if (hero) {
                hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        });

        // Feedback Modal
        const feedbackBtn = document.getElementById('feedback-btn');
        const feedbackModal = document.getElementById('feedback-modal');
        const cancelFeedbackBtn = document.getElementById('cancel-feedback-btn');
        const feedbackForm = document.getElementById('feedback-form');

        if (feedbackBtn && feedbackModal && cancelFeedbackBtn && feedbackForm) {
            feedbackBtn.addEventListener('click', () => {
                feedbackModal.classList.remove('hidden');
            });

            cancelFeedbackBtn.addEventListener('click', () => {
                feedbackModal.classList.add('hidden');
            });

            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const feedbackData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    date: new Date().toLocaleString()
                };

                // Save to localStorage
                const existingFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
                existingFeedback.push(feedbackData);
                localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

                alert('Thank you for your feedback! It has been saved to the Dashboard.');
                feedbackModal.classList.add('hidden');
                feedbackForm.reset();
                
                // If we are on the dashboard, refresh the list (optional)
                if (window.loadFeedback) window.loadFeedback();
            });
        }
    }
});


