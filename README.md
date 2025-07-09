# Full-Stack E-Commerce System (Node.js + Express + MySQL + AWS EC2/RDS)

## Project Overview

This project is a full-stack e-commerce website, with the backend built using Node.js + Express and the database managed by MySQL (hosted on AWS RDS). The frontend is developed with native HTML/CSS/JavaScript. The system supports product browsing, shopping cart, order management, PayPal payment, admin backend, and user authentication. It is deployed on AWS EC2 with Nginx as a reverse proxy, and the database is hosted on AWS RDS.

## Main Features

- Product categories and dynamic product management (RESTful API)
- Frontend product browsing, shopping cart (local persistent storage), checkout, and PayPal sandbox payment
- Automatic order synchronization with the database to ensure data consistency
- Admin backend (category/product management, login, password modification)
- Secure authentication mechanism (JWT + HTTPOnly Cookie) and encrypted password storage
- Web security protections (against XSS and SQL injection attacks)
- Cloud deployment (EC2 + RDS + Nginx)

## Technical Architecture

- **Backend**: Node.js + Express
- **Database**: MySQL (AWS RDS)
- **Frontend**: Native HTML/CSS/JavaScript
- **Payment Integration**: PayPal JS SDK
- **Deployment Environment**: AWS EC2, RDS, Nginx

## Directory Structure

```bash
phase5/
├── api/                        # Backend APIs (Node.js/Express routes)
│   ├── db.js                   # Database connection and encapsulation
│   ├── login.js                # Login authentication
│   ├── change_password.js      # Password modification interface
│   └── ...                     # Other API routes (e.g., products, orders)
├── uploads/                    # Product image resources
├── shopping_cart_script1.js    # Main frontend JS (shopping cart logic)
├── Categories_Form.html        # Admin category management page
├── Products_Form.html          # Admin product management page
├── admin-categories-login.html # Admin login page
└── server.js                   # Main application
```

## Quick Start

### 1. Clone the Project

```bash
git clone https://github.com/haibocharles/IEMS5718-My-online-store.git
cd IEMS5718-My-online-store/phase5
```

### 2. Install Dependencies

Navigate to the main directory and install Node.js packages:

```bash
npm install
```

### 3. Configure the Database

Edit `api/db.js` to include your AWS RDS/MySQL connection details (host, port, user, password, database name).

**Note**: Ensure AWS RDS has a created database with the following required tables: `users`, `products`, `categories`, `orders` (refer to project comments or deployment scripts for details).

### 4. Start the Backend Service

In the `phase5` directory, run:

```bash
node server.js
```

### 5. Launch the Frontend

Open the HTML files in the `phase5` directory (e.g., `index.html`) directly in a browser, or deploy the entire `phase5` directory to an Nginx/Apache static server.

### 6. Cloud Deployment

Recommended setup using AWS EC2 + RDS integration:
- EC2 as the application server (running Node.js backend + Nginx reverse proxy)
- RDS as the database (MySQL)
- Refer to project comments and deployment scripts for detailed setup.

## Admin Backend

### Access Path
/admin-categories-login.html

### Supported Features
- Category management (add, edit, delete categories)
- Product management (add, edit, delete products)
- Password modification (admin account password update)

## Security Notes

- **Authentication Mechanism**: All sensitive operations (e.g., admin backend, payments) require JWT verification, with tokens stored in HTTPOnly Cookies to prevent XSS attacks.
- **Password Security**: User passwords are encrypted using bcrypt (salted hashing) to prevent plaintext leaks.
- **Protection Measures**:
  - **SQL Injection**: Use parameterized queries (Prepared Statements) and prohibit direct SQL string concatenation.
  - **XSS Attacks**: Escape frontend input during output and filter dangerous characters on the backend.
- **Production Environment Recommendation**: Enable HTTPS (configure SSL certificates via Nginx).

## Main Dependencies

| Package Name   | Purpose                       |
|----------------|-------------------------------|
| express        | Backend web application framework |
| mysql          | MySQL database driver         |
| bcrypt         | Password encryption hashing   |
| jsonwebtoken   | JWT token generation and verification |
| cookie-parser  | Parse HTTPOnly Cookies        |

## Contribution and License

- Feel free to fork the project and submit Pull Requests (PRs)!
- For issues or suggestions, please use GitHub Issues or contact the author.
- This project is part of the IEMS5718 course assignment and is intended for academic demonstration purposes only. Do not use sensitive information (e.g., database passwords) directly in a production environment.
