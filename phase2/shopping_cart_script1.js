// 事件綁定和獲取分類及產品資料
    document.addEventListener('DOMContentLoaded', async () => {
        const categoryMenu = document.querySelector('.sub-menu'); // 選取分類容器
        try {
            const response = await fetch('http://localhost:3002/api/categories'); // 發送 API 請求
            const categories = await response.json(); // 解析返回的 JSON 數據
            categoryMenu.innerHTML = ''; // 清空現有分類
            categories.forEach(category => {
                const li = document.createElement('li'); // 創建 li 元素
                li.className = 'menu-item'; // 設置 li 的 class 屬性
                li.innerHTML = `<a href="?catid=${category.catid}" class="menu-link">${category.name}</a>`; // 設置 li 的 HTML
                categoryMenu.appendChild(li); // 將 li 添加到 categoryMenu 中
            });
        } catch (error) {
            console.error('Error fetching categories:', error); // 錯誤處理
            categoryMenu.innerHTML = '<li class="menu-item">無法加載分類</li>'; // 顯示錯誤信息, 
        }
    });

//點擊分類後獲取產品資料
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('menu-link'))
        {
        event.preventDefault(); // 阻止默認行為
        const catid=event.target.getAttribute('href').split('=')[1]; // 獲取 catid
        const productContainer = document.querySelector('.product'); // 選取產品容器

        try{
            // 發送 API 請求獲取產品資料
            const response = await fetch(`http://localhost:3002/api/products/${catid}`); // 使用動態路由
            const products = await response.json(); // 解析返回的 JSON 數據
            //動態生成產品資料
            productContainer.innerHTML = ''; // 清空現有產品
            
            products.forEach(product =>{
                const productDiv = document.createElement('div'); // 創建產品 div
                productDiv.className = 'product-item'; // 設置 class 屬性
                productDiv.innerHTML = `
                    <img src="http://localhost:3002${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p id='price'>Price: ${product.price} 元</p>
                    <button class="add-to-cart" data-product-id="${product.pid}" data-product-price="${product.price}" id="add-to-cart">加入購物車</button>
                `;   // 設置產品的 HTML
            
                productContainer.appendChild(productDiv); // 將產品 div 添加到 productContainer 中
            });
        }catch (error) {
            console.error('Error fetching products:', error); // 錯誤處理
            productContainer.innerHTML = '<p class="error">無法加載產品</p>'; // 顯示錯誤信息
        }
    }
 }
);

// 點擊購物車圖示顯示購物車側邊欄
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('shopping-cart-icon').addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默認行為
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.add('active'); // 顯示購物車側邊欄
    });

    // 點擊關閉按鈕隱藏購物車側邊欄
    document.getElementById('close-cart').addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默認行為
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.remove('active'); // 隱藏購物車側邊欄
    });
});










// 購物車數組
let cart = JSON.parse(localStorage.getItem('cart')) || []; // 從 localStorage 加載購物車數據
//localstorage 表示本地存儲，當頁面刷新時，數據不會丟失

// 點擊加入購物車按鈕
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) { // 確保點擊的是加入購物車按鈕
        const productId = event.target.getAttribute('data-product-id'); // 獲取產品 ID
        const productName = event.target.parentElement.querySelector('h3').innerText; // 獲取產品名稱
        const productPrice = parseFloat(event.target.getAttribute('data-product-price')); // 獲取產品價格並轉換為數字
        console.log(productId, productName, productPrice); // 輸出產品信息
        // 檢查購物車中是否已存在該產品
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // 如果已存在，數量加 1
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1 // 初始數量為 1
            });
        }

        // 更新 localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // 更新購物車顯示
        updateCartDisplay();
        alert(`${productName} successfully added to cart`); // 提示用戶
    }
});


// 更新購物車顯示
// 2. Update the shopping cart display
function updateCartDisplay() 
    {
    const cartContent = document.getElementById('cart-content');// 獲取購物車側邊欄
    // Clear existing contents
        cartContent .innerHTML = '';
        let totalAmount = 0; // 初始化總金額

    cart.forEach(item => {
        totalAmount += item.price * item.quantity; // 計算總金額
        
      // Create a container for the cart item
      const itemDiv = document.createElement('div');// 創建產品 div
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
       <button class="delete" data-product-id="${item.id}">Delete</button>
        <div class="detail1">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            <div class="detail2">
            <button class="decrement" data-product-id="${item.id}">-</button>
            <input type="number" class="item-quantity" data-product-id="${item.id}" value="${item.quantity}" min="1" readonly>
            <button class="increment" data-product-id="${item.id}">+</button>
            </div>
          </div>
        `;
      cartContent.appendChild(itemDiv);
    });

    //在購物車底部顯示總金額
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    totalDiv.innerHTML = `<strong>總金額: $${totalAmount.toFixed(2)}</strong>`;
    cartContent.appendChild(totalDiv);
  


  }

//購物車頁面增減數量和刪除產品

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('increment')) { // 點擊增加數量按鈕
        const productId = event.target.getAttribute('data-product-id'); // 獲取產品 ID
        const product = cart.find(item => item.id === productId); // 查找產品
        if (product) {
            product.quantity += 1; // 數量加 1
            localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage
            updateCartDisplay(); // 更新顯示
        }
    } else if (event.target.classList.contains('decrement')) { // 點擊減少數量按鈕
        const productId = event.target.getAttribute('data-product-id'); // 獲取產品 ID
        const product = cart.find(item => item.id === productId); // 查找產品
        if (product && product.quantity > 1) {
            product.quantity -= 1; // 數量減 1
            localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage
            updateCartDisplay(); // 更新顯示
        }
    } else if (event.target.classList.contains('delete')) { // 點擊刪除按鈕
        alert('are you sure to delete this product?')
        const productId = event.target.getAttribute('data-product-id'); // 獲取產品 ID
        cart = cart.filter(item => item.id !== productId); // 刪除產品
        localStorage.setItem('cart', JSON.stringify(cart)); // 更新 localStorage
        updateCartDisplay(); // 更新顯示
    }

/*
遍歷陣列： cart.filter(...) 會將 cart 陣列中的每一個項目都傳給箭頭函式，檢查每個項目的 id 是否不等於 productId。

條件判斷： 在 item => item.id !== productId 這段中，對於每個項目：

如果 item.id !== productId 為 true，那麼該項目會被保留在新的陣列中。

如果條件為 false（也就是 item.id === productId），該項目會被過濾掉，也就是不會出現在新的陣列裡。

重新賦值： 最後，filter() 方法會返回一個新陣列，這個陣列中只包含那些條件為 true 的項目。接著，把這個新陣列賦值給 cart，相當於「刪除」了那些符合特定條件（item.id === productId）的產品。


*/
});



// 更新頁面購物車數量的顯示
function updateCartCount(count) {
    let cartCount = document.getElementById('cart-count'); // 獲取購物車數量標籤
    cartCount.innerText = count; // 更新購物車數量顯示
    cartCount.style.display = count > 0 ? 'inline-block' : 'none'; // 如果購物車有產品，顯示數量，否則隱藏
}










    

















