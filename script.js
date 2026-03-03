// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {

    // Main sections
    const welcome = document.getElementById('welcomeScreen');
    const main = document.getElementById('mainContainer');
    const qtyContainer = document.querySelector('.quantity-control');
    const addCartBtn = document.getElementById('addCartBtn');
    const optionsContainer = document.getElementById('optionsContainer');

    // Hide controls at start
    qtyContainer.style.display = 'none';
    addCartBtn.style.display = 'none';

    // Inputs
    const fullNameInput = document.getElementById('fullName');
    const lrnInput = document.getElementById('lrn');

    // App state
    const state = {
        cart: [],
        currentCategory: null,
        currentProduct: null,
        qty: 1,
        options: { rice: null }
    };

    // Menu data
    const menu = {
        meal:[
            {name:"Adobo w/ rice", price:50},
            {name:"Adobong sitaw w/ rice", price:50},
            {name:"Chicken nuggets w/ rice", price:50},
            {name:"Chicken fillet w/ rice", price:50},
            {name:"Giniling w/ rice", price:50},
            {name:"Menudo w/ rice", price:50},
            {name:"Sisig w/ rice", price:50},
            {name:"Egg", price:15},
            {name:"Ham", price:15},
            {name:"Longganisa", price:15},
            {name:"Shanghai", price:10},
            {name:"Toge", price:10},
        ],
        rice:[
            {name:"Plain rice", price:15},
            {name:"Java rice", price:15}
        ],
        snacks:[
            {name:"Dynamite", price:15},
            {name:"Turon", price:16},
            {name:"Cracklings", price:10},
            {name:"Clover", price:10},
            {name:"Cheezy", price:10},
            {name:"Chees curls", price:10},
            {name:"Funky", price:13},
            {name:"Marty's", price:10},
            {name:"Nova", price:23},
            {name:"Oishi", price:13},
            {name:"Potato fries", price:10},
            {name:"Piattos", price:23},
            {name:"Patata", price:10},
            {name:"Ringbee", price:10},
            {name:"Roller coster", price:10},
            {name:"Ri-chee", price:10},
            {name:"Snaku", price:10},
            {name:"Tomi", price:10},
            {name:"V-cut", price:23},
            {name:"Burger (paty, egg, ham)", price:25},
        ],
        drinks:[
            {name:"C2 apple", price:20},
            {name:"Magnolia", price:18},
            {name:"Water", price:15},
            {name:"Juice (orange, apple, grapes)", price:17}
        ]
    };

    // Start order
    document.getElementById('startOrderBtn').addEventListener('click', ()=>{
        if(fullNameInput.value.trim() === '' || lrnInput.value.trim() === ''){
            alert('Please enter your Full Name and LRN!');
            return;
        }
        welcome.style.display = 'none';
        main.style.display = 'flex';
        renderAllProducts();
    });

    // Show all products
    function renderAllProducts() {
        const list = document.getElementById('productList');
        const title = document.getElementById('productTitle');
        title.innerText = 'All Products';
        list.innerHTML = '';

        const order = ['meal', 'rice', 'snacks', 'drinks'];

        order.forEach(cat => {
            const catHeader = document.createElement('h3');
            catHeader.className = 'category-title';
            catHeader.innerText = cat.toUpperCase();
            list.appendChild(catHeader);

            menu[cat].forEach(p => {
                const btn = document.createElement('button');
                btn.innerText = `${p.name} - ₱${p.price}`;
                btn.addEventListener('click', () => {
                    renderProducts(cat);
                    state.currentProduct = p;
                    state.qty = 1;
                    showQuantityAndAdd();

                    if(cat === 'meal'){
                        renderMealOptions();
                    } else {
                        optionsContainer.innerHTML = '';
                    }

                    highlightCategory(cat);
                });
                list.appendChild(btn);
            });
        });
    }

    // Show products by category
    function renderProducts(cat){
        state.currentCategory = cat;
        state.currentProduct = null;
        state.qty = 1;
        state.options.rice = null;
        qtyContainer.style.display = 'none';
        addCartBtn.style.display = 'none';
        optionsContainer.innerHTML = '';

        const list = document.getElementById('productList');
        const title = document.getElementById('productTitle');
        title.innerText = cat.toUpperCase();
        list.innerHTML = '';

        menu[cat].forEach(p=>{
            const btn = document.createElement('button');
            btn.innerText = `${p.name} - ₱${p.price}`;
            btn.addEventListener('click', ()=> {
                state.currentProduct = p;
                state.qty = 1;
                showQuantityAndAdd();

                if(cat==='meal'){
                    renderMealOptions();
                } else {
                    optionsContainer.innerHTML = '';
                }
            });
            list.appendChild(btn);
        });
    }

    // Highlight category
    function highlightCategory(cat){
        document.querySelectorAll('.category-btn').forEach(btn=>{
            btn.style.background = (btn.dataset.category === cat) ? '#2e7d32' : '#66bb6a';
        });
    }

    // Show meal rice options
    function renderMealOptions(){
        optionsContainer.innerHTML = '';
        const riceOptions = [...menu.rice, {name:"No, thanks", price:0}];
        riceOptions.forEach(r=>{
            const btn = document.createElement('button');
            btn.innerText = `${r.name} - ₱${r.price}`;
            btn.addEventListener('click', ()=>{
                state.options.rice = r;
                alert(`${r.name} selected!`);
            });
            optionsContainer.appendChild(btn);
        });
    }

    // Show quantity and add button
    function showQuantityAndAdd(){
        qtyContainer.style.display = 'flex';
        addCartBtn.style.display = 'block';
        document.getElementById('qty').innerText = state.qty;
    }

    // Increase quantity
    document.getElementById('plusQty').addEventListener('click', ()=>{
        state.qty++;
        document.getElementById('qty').innerText = state.qty;
    });

    // Decrease quantity
    document.getElementById('minusQty').addEventListener('click', ()=>{
        if(state.qty>1) state.qty--;
        document.getElementById('qty').innerText = state.qty;
    });

    // Add to cart
    addCartBtn.addEventListener('click', ()=>{
        if(!state.currentProduct) return;

        let price = state.currentProduct.price;
        let name = state.currentProduct.name;

        if(state.currentCategory==='meal' && state.options.rice){
            if(state.options.rice.name !== "No, thanks"){
                price += state.options.rice.price;
                name += ` + ${state.options.rice.name}`;
            }
        }

        state.cart.push({name:name, price:price*state.qty, qty: state.qty});
        renderCart();

        optionsContainer.innerHTML = '';
        state.currentProduct = null;
        state.options.rice = null;
        state.qty = 1;
        qtyContainer.style.display = 'none';
        addCartBtn.style.display = 'none';
    });

    // Show cart
    function renderCart(){
        const list = document.getElementById('cartList');
        list.innerHTML='';
        let total = 0;
        state.cart.forEach((item,i)=>{
            total += item.price;
            const div = document.createElement('div');
            div.className='item-line';
            div.innerHTML = `<span>${item.name} x ${item.qty}</span><span>₱${item.price}</span><button onclick="removeItem(${i})">Remove</button>`;
            list.appendChild(div);
        });
        document.getElementById('totalAmount').innerText = 'Total: ₱'+total;
    }

    // Remove item
    window.removeItem = function(index){
        state.cart.splice(index,1);
        renderCart();
    }

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            renderProducts(btn.dataset.category);
            highlightCategory(btn.dataset.category);
        });
    });

    // Print order
    document.getElementById('printBtn').addEventListener('click', ()=>{
        if(state.cart.length === 0){
            alert("Cart is empty!");
            return;
        }

        const customerName = fullNameInput.value.trim();
        const lrn = lrnInput.value.trim();

        let total = state.cart.reduce((sum, item) => sum + item.price, 0);
        let items = state.cart.map(i => `${i.name} x ${i.qty} - ₱${i.price}`).join('\n');

        alert(`Customer: ${customerName}\nLRN: ${lrn}\n\nOrder Summary:\n${items}\nTotal: ₱${total}\n\nPlease pay cash at the counter and present your ID.`);

        state.cart = [];
        renderCart();
        optionsContainer.innerHTML = '';
        state.currentProduct = null;
        state.options.rice = null;
        state.qty = 1;
        qtyContainer.style.display = 'none';
        addCartBtn.style.display = 'none';
    });

    // Back to welcome
    document.getElementById('backToWelcomeBtn').addEventListener('click', () => {
        welcome.style.display = 'flex';
        main.style.display = 'none';

        state.cart = [];
        renderCart();
        state.currentProduct = null;
        state.options.rice = null;
        state.qty = 1;
        qtyContainer.style.display = 'none';
        addCartBtn.style.display = 'none';

        fullNameInput.value = '';
        lrnInput.value = '';

        renderAllProducts();
        highlightCategory(null);
    });

});