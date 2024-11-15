// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Load JSON data
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        renderServices(data.services);
        renderTeam(data.team);
        renderFAQ(data.faq);
        renderClients(data.clients);
    })
    .catch(error => console.error('Error loading data:', error));

function renderServices(services) {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <i class="fas fa-${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-features">
                <ul>
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
}

function renderTeam(team) {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;

    const teamHTML = team.map(member => `
        <div class="team-card">
            <div class="image-container">
                <img src="${member.image}" alt="${member.name}">
            </div>
            <div class="team-info">
                <h3>${member.name}</h3>
                <p>${member.position}</p>
                <p class="expertise">${member.expertise}</p>
                <div class="social-links">
                    <a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="${member.social.github}" target="_blank"><i class="fab fa-github"></i></a>
                    <a href="${member.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        </div>
    `).join('');

    teamGrid.innerHTML = teamHTML + `
        <div class="team-card join-card">
            <div class="image-container">
                <img src="./assets/img/join_bee.png" alt="Join Our Team">
            </div>
            <div class="team-info">
                <h3>Join Us</h3>
                <p>Let's buzz together in RAAS and SAAS</p>
                <a href="mailto:contact@beebotix.com" class="cta-button" target="_blank">Join Us</a>
            </div>
        </div>
    `;
}

function renderFAQ(faq) {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;

    faqContainer.innerHTML = faq.map(item => `
        <div class="faq-item">
            <div class="faq-question">
                <h3>${item.question}</h3>
                <i class="fas fa-plus"></i>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
}

function renderClients(clients) {
    const clientsSlider = document.querySelector('.clients-slider');
    if (!clientsSlider) return;

    // Double the clients array to create a seamless loop
    const doubledClients = [...clients, ...clients];

    clientsSlider.innerHTML = doubledClients.map(client => `
        <div class="client-card">
            <a href="${client.website}" target="_blank" title="${client.name}">
                <img src="${client.logo}" alt="${client.name}">
            </a>
        </div>
    `).join('');
}


// Contact Form Handler
const contactForm = document.getElementById('contactForm');

// Ensure Email.js is initialized with your public key
emailjs.init("K9PmDAw2eoItuAJgX"); // Replace with your actual public key

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const templateParams = {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        };

        // Replace `serviceID` and `templateID` with your actual IDs
        const serviceID = "service_rwc5cf5";
        const templateID = "template_tkr2wgr";

        emailjs.send(serviceID, templateID, templateParams)
            .then(response => {
                alert(`Thank you, ${data.name}! Your message has been sent successfully.`);
                contactForm.reset();
            })
            .catch(error => {
                console.error("Email.js error:", error);
                alert("Oops! Something went wrong while sending your message. Please try again.");
            });
    });
}

// Download Button Handler
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        alert('Brochure currently unavailable...');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});