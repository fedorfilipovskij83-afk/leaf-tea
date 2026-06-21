// Открыть/закрыть меню
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('overlay').classList.toggle('active');
    document.querySelector('.menu-toggle').classList.toggle('active');
}

// Загрузить категории
async function loadCategories() {
    try {
        const response = await fetch('_data/categories.json');
        const categories = await response.json();
        
        const container = document.getElementById('categories-list');
        container.innerHTML = `
            <a href="#" class="category-link active" data-category="all">
                <span class="category-icon">📦</span>
                <span>Все товары</span>
            </a>
        `;
        
        categories.forEach(cat => {
            const link = document.createElement('a');
            link.className = 'category-link';
            link.dataset.category = cat.slug;
            link.innerHTML = `
                <span class="category-icon">${cat.icon || '🍵'}</span>
                <span>${cat.title}</span>
            `;
            link.onclick = (e) => {
                e.preventDefault();
                filterProducts(cat.slug);
                document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                toggleMenu();
            };
            container.appendChild(link);
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

// Загрузить товары
async function loadProducts() {
    try {
        const response = await fetch('_data/products.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Показать товары
function displayProducts(products) {
    const container = document.getElementById('products-grid');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.innerHTML = `
            <img src="${product.images?.[0] || 'images/placeholder.png'}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">${product.price} ₽</p>
            <p class="description">${product.description}</p>
        `;
        container.appendChild(card);
    });
}

// Фильтровать товары
function filterProducts(category) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
});
