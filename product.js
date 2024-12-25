document.addEventListener('DOMContentLoaded', () => {
    // Fetch the product data from the JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            renderProducts(data);
        })
        .catch(error => console.error('Error fetching the product data:', error));

    // Function to render products dynamically
    function renderProducts(data) {
        const softwareGrid = document.getElementById('software-products-grid');
        const hardwareGrid = document.getElementById('hardware-products-grid');

        // Render Software Products
        data.software.forEach(product => {
            const productCard = createProductCard(product);
            softwareGrid.appendChild(productCard);
        });

        // Render Hardware Products
        data.hardware.forEach(product => {
            const productCard = createProductCard(product);
            hardwareGrid.appendChild(productCard);
        });
    }

    // Function to create a product card
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <div class="image-container">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price}</div>
                <button class="download-btn">
                    <a href="${product.brochure}"><i class="fas fa-download"></i>Download Brochure</a>
                </button>
            </div>
        `;
        
        return card;
    }

    // Modal functionality
    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.querySelector('.close-btn');

    // Show modal on page load
    modal.style.display = "block";

    // Close modal when clicking on the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });
});
