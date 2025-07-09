// Page navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const homePage = document.querySelector('.home-page');
            const aboutPage = document.querySelector('.about-page');
            const commonQuestionPage = document.querySelector('.common-question-page');
            // Default show About Us page
            homePage.style.display = 'none';
            aboutPage.style.display = 'block';
            commonQuestionPage.style.display = 'none';
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Remove active class from all links
                    navLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to current link
                    this.classList.add('active');
                    // Switch pages based on data-page attribute
                    const page = this.getAttribute('data-page');
                    const categoryMenu = document.querySelector('.sub-menu');
                    if (page === 'home') {
                        homePage.style.display = 'block';
                        aboutPage.style.display = 'none';
                        commonQuestionPage.style.display = 'none';
                        if (categoryMenu) categoryMenu.style.display = 'block';
                    } else if (page === 'about') {
                        homePage.style.display = 'none';
                        aboutPage.style.display = 'block';
                        commonQuestionPage.style.display = 'none';
                        if (categoryMenu) categoryMenu.style.display = 'none';
                    }
                    else if (page === 'question') {
                        homePage.style.display = 'none';
                        aboutPage.style.display = 'none';
                        commonQuestionPage.style.display = 'block'; 
                        if (categoryMenu) categoryMenu.style.display = 'none';
                    } else if (page === 'user info') {
                        homePage.style.display = 'none';
                        aboutPage.style.display = 'none';
                        commonQuestionPage.style.display = 'none';
                        if (categoryMenu) categoryMenu.style.display = 'none';
                        // Load user info content dynamically
                        document.querySelector('.user-info').style.display = 'block';
                    }

                });
            });
            
            // Cart functionality
            const cartItems = document.querySelectorAll('.add-to-cart');
            const cartCount = document.getElementById('cart-count');
            const cartSidebar = document.getElementById('cart-sidebar');
            const closeCart = document.getElementById('close-cart');
            const cartIcon = document.getElementById('shopping-cart-icon');
            
            let cart = [];
            let count = 0;
            
            // Initialize cart
            updateCartCount();
            
            // Add items to cart
            cartItems.forEach(item => {
                item.addEventListener('click', function() {
                    const product = this.parentElement;
                    const name = product.querySelector('h3').textContent;
                    const price = parseFloat(product.querySelector('p:nth-child(4)').textContent.replace('Price: $', ''));
                    
                    // Check if item is already in cart
                    const existingItem = cart.find(i => i.name === name);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            name: name,
                            price: price,
                            quantity: 1
                        });
                    }
                    
                    count++;
                    updateCartCount();
                    alert(`${name} has been added to cart`);
                });
            });
            
            // Update cart count display
            function updateCartCount() {
                cartCount.textContent = count;
                cartCount.style.display = count > 0 ? 'inline-block' : 'none';
            }
            
            // Toggle cart sidebar
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                cartSidebar.classList.add('active');
            });
            
            // Close cart sidebar
            closeCart.addEventListener('click', function(e) {
                e.preventDefault();
                cartSidebar.classList.remove('active');
            });
            
            // Mobile menu toggle
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('show');
            });
        });

// 动态加载分类和产品
document.addEventListener('DOMContentLoaded', async () => {
    const homePage = document.querySelector('.home-page');
    const aboutPage = document.querySelector('.about-page');
    const categoryMenu = document.querySelector('.sub-menu');
    const productList = document.querySelector('.product-list');

    // 初始如果是 About 页显示，则隐藏分类菜单
    if (aboutPage && aboutPage.style.display !== 'none') {
        categoryMenu.style.display = 'none';
    }

    // 1. 加载分类
    try {
        const response = await fetch('https://shoplane2025.click/api/categories');
        const categories = await response.json();
        categoryMenu.innerHTML = '';
        categories.forEach(category => { // 遍历分类数据
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = `<a href="#" class="menu-link" data-catid="${category.catid}">${category.name}</a>`;
            categoryMenu.appendChild(li);
        });
    } catch (error) {
        categoryMenu.innerHTML = '<li class="menu-item">无法加载分类</li>';
    }

    // 2. 分类点击事件，动态加载产品
    categoryMenu.addEventListener('click', async (event) => {
        if (event.target.classList.contains('menu-link')) {
            event.preventDefault();
            const catid = event.target.getAttribute('data-catid');
            try {
                const response = await fetch(`https://shoplane2025.click/api/products/${catid}`);
                const products = await response.json();
                productList.innerHTML = ''; // 只清空产品区
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product-item';
                    productDiv.innerHTML = `
                        <img src="https://shoplane2025.click${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-bottom">
                            <span class="item-price">Price: $${product.price}</span>
                            <button class="add-to-cart" data-product-id="${product.pid}" data-product-price="${product.price}">Add to Cart</button>
                        </div>
                    `;
                    productList.appendChild(productDiv);
                });
            } catch (error) {
                productList.innerHTML = '<p class="error">无法加载产品</p>';
            }
        }
    });
});


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
        
        // 修正：向上查找到 product-item 容器，然後查找 h3
        const productItem = event.target.closest('.product-item');
        const productNameElement = productItem ? productItem.querySelector('h3') : null;
        
        if (!productNameElement) {
            console.error('無法找到產品名稱元素');
            return;
        }
        
        const productName = productNameElement.innerText; // 獲取產品名稱
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
      <button type="button" class="delete" data-product-id="${item.id}" title="删除">🗑️</button>
        <div class="detail1">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            <div class="detail2">
           <button type="button" class="decrement" data-product-id="${item.id}">-</button>
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
    totalDiv.innerHTML = `<strong>Total Price: $${totalAmount.toFixed(2)}</strong>`;
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


// PayPal JS SDK Secure Checkout Flow
window.paypal
  .Buttons({
    style: {
      shape: "rect",
      layout: "vertical",
      color: "gold",
      label: "paypal",
    },

    async createOrder() {//
      try {
        // 读取 localStorage 购物车
        let cartData = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartData.length === 0) {
          resultMessage('购物车为空，无法结账！');
          throw new Error('购物车为空');
        }
        // 组装 payload
        const payload = {
          cart: cartData.map(item => ({
            id: item.id,// 产品 ID
            quantity: item.quantity// 产品数量
          }))
        };
        // 请求后端创建订单
        const response = await fetch("https://shoplane2025.click/api/create_order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const orderData = await response.json();

        if (orderData.id) {
          return orderData.id;
        }
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      } catch (error) {
        console.error(error);
        resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
      }
    },

    async onApprove(data, actions) {//
      try {
        const response = await fetch(`https://shoplane2025.click/api/create_order/${data.orderID}/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const orderData = await response.json();

        const errorDetail = orderData?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          return actions.restart();
        } else if (errorDetail) {
          throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          // 支付成功，清空购物车
          localStorage.removeItem('cart');
          resultMessage(
            `Transaction ${orderData.purchase_units[0].payments.captures[0].status}: ${orderData.purchase_units[0].payments.captures[0].id}<br>\n          <br>See console for all available details`
          );
          console.log(
            "Capture result",
            orderData,
            JSON.stringify(orderData, null, 2)
          );
        }
      } catch (error) {
        console.error(error);
        resultMessage(
          `Sorry, your transaction could not be processed...<br><br>${error}`
        );
      }
    },
  })
  .render("#paypal-button-container");

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  if (container) container.innerHTML = message;
}




    

















