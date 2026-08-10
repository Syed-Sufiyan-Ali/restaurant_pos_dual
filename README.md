# 🍕 Pizza Town – Full Stack Restaurant Management System

A modern full-stack restaurant ordering and administration platform built with **Next.js 15**, **TypeScript**, **Prisma**, and **PostgreSQL**.

Pizza Town provides customers with a seamless food ordering experience while giving restaurant staff a powerful admin dashboard to manage orders, menus, reservations, customers, and business operations.

---

# ✨ Features

## 🛒 Customer Website

- Modern responsive UI
- Browse menu by categories
- Product variations & sizes
- Add-ons support
- Shopping cart
- Coupon system
- Secure checkout
- Guest checkout
- User authentication
- Order history
- Live order tracking
- Reservations
- Profile management
- Address management

---

## 🛠 Admin Panel

### Dashboard

- Business overview
- Revenue statistics
- Daily order summary
- Pending orders
- Preparing orders
- Delivered orders
- Quick insights

---

### Orders

- View all orders
- Live order status updates
- Order timeline
- Payment status management
- Customer information
- Delivery address
- Print orders
- Cancel orders

---

### Menu Management

- Categories
- Menu Items
- Sizes
- Add-ons
- Availability toggle
- Image uploads
- Pricing management

---

### Customers

- Customer list
- Guest orders
- Customer profiles
- Order history

---

### Reservations

- Reservation requests
- Accept / Reject reservations
- Reservation management

---

### Coupons

- Percentage discounts
- Fixed discounts
- Expiry dates
- Usage limits

---

## 🔐 Authentication

- JWT Authentication
- Protected API Routes
- Role Based Access

Roles:

- Customer
- Manager
- Admin
- Super Admin

---

# 🏗 Tech Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- Lucide Icons

---

## Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## Database

- PostgreSQL
- Prisma

---

## State Management

- React Hooks
- Context API

---

## Styling

- TailwindCSS
- Custom Design System
- CSS Variables
- Dark Theme

---

# 📁 Project Structure

```
app/
│
├── admin/
│   ├── dashboard/
│   ├── orders/
│   ├── menu/
│   ├── customers/
│   ├── reservations/
│   └── coupons/
│
├── api/
│
├── menu/
├── cart/
├── checkout/
├── profile/
└── reservations/

components/
│
├── admin/
├── common/
├── customer/
└── ui/

lib/
│
├── prisma/
├── auth/
├── admin/
└── utils/

prisma/
└── schema.prisma
```

---

# 🗄 Database

The project uses **Prisma ORM** with PostgreSQL.

Main models include:

- User
- MenuCategory
- MenuItem
- MenuItemImage
- MenuItemSize
- Addon
- Coupon
- Order
- OrderItem
- OrderTimeline
- Reservation
- Address

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/pizza-town.git

cd pizza-town
```

---

## 2. Install Packages

```bash
npm install
```

---

## 3. Configure Environment

Create:

```
.env
```

Example:

```env
DATABASE_URL=

JWT_SECRET=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 4. Prisma

Generate Prisma Client

```bash
npx prisma generate
```

Run Migrations

```bash
npx prisma migrate dev
```

---

## 5. Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📦 Available Scripts

```bash
npm run dev

npm run build

npm run start

npm run lint

npx prisma studio
```

---

# 🔒 Authentication

The application uses JWT-based authentication.

Protected routes are handled through middleware.

Administrative APIs require:

- ADMIN
- MANAGER
- SUPER_ADMIN

---

# 📈 Current Modules

✅ Authentication

✅ Customer Website

✅ Shopping Cart

✅ Checkout

✅ Orders

✅ Reservations

✅ Coupons

✅ Admin Dashboard

✅ Menu Management

✅ Customer Management

✅ Order Management

---

# 🎯 Future Improvements

- Online payment gateways
- Email notifications
- SMS notifications
- Inventory management
- Analytics dashboard
- Sales reports
- Multi-branch support
- Kitchen Display System (KDS)
- Push notifications

---

# 📸 Screenshots

Add screenshots here.

```
Customer Homepage

Admin Dashboard

Orders Module

Menu Management

Checkout

Reservation System
```

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Syed Sufiyan Ali**

Built with ❤️ using Next.js, Prisma, React and MySQL.
