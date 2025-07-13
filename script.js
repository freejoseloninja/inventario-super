const form = document.getElementById('productForm');
const nameInput = document.getElementById('name');
const skuInput = document.getElementById('sku');
const stockInput = document.getElementById('stock');
const expiryInput = document.getElementById('expiry');
const productList = document.getElementById('productList');
const alertList = document.getElementById('alertList');
const totalCount = document.getElementById('total-count');
const messageDiv = document.getElementById('message');
const searchInput = document.getElementById('search');
const toggleReportesBtn = document.getElementById('toggleReportes');
const reportesSection = document.getElementById('reportes');
const sortNameBtn = document.getElementById('sortName');
const sortStockBtn = document.getElementById('sortStock');

let products = [];
let editIndex = null;
let sortDirection = {
  name: 1,
  stock: 1,
};

function updateCount() {
  totalCount.textContent = `Productos registrados: ${products.length}`;
}

function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  setTimeout(() => (messageDiv.style.display = 'none'), 3000);
}

function renderProducts(filter = '') {
  productList.innerHTML = '';
  alertList.innerHTML = '';
  const now = new Date();

  products.forEach((product, index) => {
    if (
      !filter ||
      product.name.toLowerCase().includes(filter) ||
      product.sku.toLowerCase().includes(filter)
    ) {
      const li = document.createElement('li');
      const expiryDate = new Date(product.expiry);
      const diffDays = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

      if (product.stock < 5 || diffDays <= 3) {
        const alertLi = document.createElement('li');
        alertLi.textContent = `${product.name} (${product.sku}) - ` +
          (product.stock < 5 ? 'Stock bajo' : '') +
          (diffDays <= 3 ? ` / Vence en ${diffDays} día(s)` : '');
        alertList.appendChild(alertLi);
      }

      li.innerHTML = `
        <strong>${product.name}</strong> | SKU: ${product.sku} | Stock: ${product.stock} | Vence: ${product.expiry}
      `;

      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Editar';
      editBtn.onclick = () => {
        nameInput.value = product.name;
        skuInput.value = product.sku;
        stockInput.value = product.stock;
        expiryInput.value = product.expiry;
        skuInput.disabled = true;
        editIndex = index;
        form.querySelector('button').textContent = 'Actualizar producto';
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.onclick = () => {
        products.splice(index, 1);
        renderProducts(searchInput.value.toLowerCase());
        showMessage('Producto eliminado.', 'success');
      };

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      productList.appendChild(li);
    }
  });

  updateCount();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const sku = skuInput.value.trim();
  const stock = parseInt(stockInput.value);
  const expiry = expiryInput.value;

  if (!name || !sku || !stock || !expiry) {
    showMessage('Completa todos los campos.', 'error');
    return;
  }

  if (editIndex !== null) {
    products[editIndex] = { name, sku, stock, expiry };
    editIndex = null;
    form.querySelector('button').textContent = 'Registrar producto';
    skuInput.disabled = false;
    showMessage('Producto actualizado.');
  } else {
    if (products.find(p => p.sku === sku)) {
      showMessage('Ese SKU ya existe.', 'error');
      return;
    }
    products.push({ name, sku, stock, expiry });
    showMessage('Producto registrado.');
  }

  form.reset();
  renderProducts(searchInput.value.toLowerCase());
});

searchInput.addEventListener('input', () => {
  renderProducts(searchInput.value.toLowerCase());
});

toggleReportesBtn.addEventListener('click', () => {
  reportesSection.classList.toggle('hidden');
  toggleReportesBtn.textContent = reportesSection.classList.contains('hidden')
    ? 'Ver Productos Registrados'
    : 'Ocultar Productos Registrados';
});

sortNameBtn.addEventListener('click', () => {
  products.sort((a, b) =>
    a.name.localeCompare(b.name) * sortDirection.name
  );
  sortDirection.name *= -1;
  renderProducts(searchInput.value.toLowerCase());
});

sortStockBtn.addEventListener('click', () => {
  products.sort((a, b) =>
    (a.stock - b.stock) * sortDirection.stock
  );
  sortDirection.stock *= -1;
  renderProducts(searchInput.value.toLowerCase());
});
