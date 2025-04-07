# IEMS5718-My-online-store
### Project Name: Shopping Cart System with Admin Control Panel


---

### Project Overview
This project is a comprehensive **e-commerce shopping cart system** that includes both a user-friendly frontend shopping cart and an admin control panel for managing products and categories. The system is built using **Node.js** and **Express** for the backend, with **MySQL** as the database. It allows users to browse products, add them to the cart, and manage their cart, while administrators can dynamically manage product categories and items through the control panel.

---

### Features

#### **Frontend Shopping Cart**
1. **Product Categories and Display**:
   - Dynamically fetch product categories and items from the backend API.
   - Display products based on selected categories.

2. **Cart Operations**:
   - **Add to Cart**: Users can add products to the cart with a success notification.
   - **Adjust Quantity**: Users can increase or decrease the quantity of items in the cart.
   - **Remove Items**: Users can delete items from the cart.
   - **Total Amount Calculation**: Automatically calculates the total price of items in the cart.

3. **Persistent Cart Data**:
   - Uses **localStorage** to store cart data, ensuring it persists even after page refresh.

4. **Cart Sidebar**:
   - A collapsible sidebar displays the cart contents and allows users to manage their cart.

---

#### **Admin Control Panel**
1. **Product Management**:
   - Add, edit, and delete products.
   - Upload product images with automatic thumbnail generation (using **Multer** and **Sharp**).

2. **Category Management**:
   - Add, edit, and delete product categories.
   - Categories are dynamically linked with products.

3. **File Upload and Validation**:
   - Handles file uploads using **Multer** with validation for image types (`jpg`, `png`, `gif`).
   - Automatically generates thumbnails to optimize image loading.

4. **Database Management**:
   - Uses **MySQL** for storing product and category data.
   - Provides efficient CRUD operations for managing data.

---

### Technology Stack

#### **Backend Technologies**
- **Node.js**: Backend framework for handling API requests and business logic.
- **Express.js**: RESTful API framework for managing routes and middleware.
- **MySQL**: Relational database for storing product and category data.
- **Multer**: Middleware for handling file uploads.
- **Sharp**: Library for image processing and thumbnail generation.
- **CORS**: Middleware to handle cross-origin requests for frontend-backend communication.

#### **Frontend Technologies**
- **HTML/CSS/JavaScript**: Used for building the shopping cart and admin panel interfaces.
- **Flexbox**: Used for responsive layout design.
- **localStorage**: Used for persisting cart data on the client side.

---

### File Structure
```
project/
│
├── index.html               # Frontend shopping cart page
├── admin.html               # Admin control panel page
├── phase2.css               # Stylesheet for the project
├── shopping_cart_script1.js # Frontend shopping cart logic
├── admin_script.js          # Admin panel logic
├── server.js                # Node.js backend server
├── api/                     # API route files
│   ├── products.js          # Product-related API routes
│   └── categories.js        # Category-related API routes
├── uploads/                 # Uploaded image files
│   └── thumbnails/          # Generated thumbnails
└── README.md                # Project documentation
```

---

### Implementation Details

#### **Shopping Cart**
- **Dynamic Rendering**:
  - Fetch product data from the backend API and dynamically render cart items.
  - Use `flexbox` to layout the delete button and product details (20% and 80% width, respectively).

- **Cart Updates**:
  - Update cart data and re-render the page when users adjust quantities or delete items.
  - Automatically recalculate the total price of items in the cart.

#### **Admin Control Panel**
- **Product Management**:
  - Use `POST` requests to add new products and store them in the MySQL database.
  - Use `PUT` requests to edit product details.
  - Use `DELETE` requests to remove products.

- **Category Management**:
  - Perform similar CRUD operations for managing categories.
  - Ensure categories are dynamically linked with products.

- **Image Upload and Thumbnail Generation**:
  - Use **Multer** to handle image uploads and validate file types.
  - Use **Sharp** to generate 150x150 thumbnails for faster image loading.

---

### Usage Instructions

#### **Start the Backend Server**
1. Install dependencies:
   ```bash
   npm install
   ```

2.Change your MySQL host, password

3. Start the server:
   ```bash
   node server.js
   ```
4. The backend server will run at `http://localhost:3002`.

#### **Access the Frontend Shopping Cart**
- Open `My_shopping_cart.html` in a browser to access the shopping cart page.

#### **Access the Admin Control Panel**
- Open `Products_Form.html` in a browser to access the  Product admin panel.
- Open `Categories_Form.html` in a browser to access the Category admin panel.

---

### Project Highlights

1. **Full-Stack Development**:
   - Covers frontend, backend, and database development, showcasing complete project lifecycle management.

2. **File Upload and Processing**:
   - Implements file upload with validation and automatic thumbnail generation, demonstrating advanced file handling.

3. **RESTful API Development**:
   - Uses **Express.js** to build RESTful APIs for managing products and categories.

4. **Database Integration**:
   - Uses **MySQL** for efficient data storage and retrieval, demonstrating proficiency in relational database management.

5. **Cross-Origin Resource Sharing (CORS)**:
   - Handles cross-origin requests to enable seamless frontend-backend communication.

6. **Responsive Design**:
   - Uses **Flexbox** for responsive layouts, ensuring a consistent user experience across devices.


