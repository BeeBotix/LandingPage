document.addEventListener('DOMContentLoaded', () => {
    // Fetch and load the product data
    fetch('products-catalog.json')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
        })
        .catch(error => console.error('Error loading products:', error));

    // Handle quote button click
    document.getElementById('quoteButton').addEventListener('click', (e) => {
        e.preventDefault();
        const subject = encodeURIComponent('Product Quotation Request');
        const body = encodeURIComponent(
            'Hello BeeBotix Team,\n\n' +
            'I would like to request a quotation for the following products from your catalog:\n\n' +
            'Please list the product IDs you are interested in here.\n\n' +
            'Could you please provide pricing information and any additional details?\n\n' +
            'Looking forward to your response.\n\nBest regards,'
        );
        window.location.href = `mailto:contact@beebotix.com?subject=${subject}&body=${body}`;
    });    
});

function displayProducts(products) {
    const container = document.getElementById('catalogContainer');
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const formattedPrice = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(product.price);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h2 class="product-name">${product.name}</h2>
                <ul class="product-description">
                    ${product.description.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p class="product-price">${formattedPrice}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}