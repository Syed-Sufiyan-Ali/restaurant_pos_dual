# Pizza Town Sukkur — Backend API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new customer |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/profile` | Yes | Get current user profile |
| PATCH | `/auth/profile` | Yes | Update name / phone |
| POST | `/auth/forgot-password` | No | Send reset email |
| POST | `/auth/reset-password` | No | Reset with token |

### POST /auth/register
```json
{ "name":"Ahmed Khan", "email":"ahmed@example.com", "phone":"03001234567", "password":"Pass@123" }
```
### POST /auth/login
```json
{ "email":"ahmed@example.com", "password":"Pass@123" }
```

---

## Menu

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/menu/categories` | No | List all categories |
| POST | `/menu/categories` | Admin | Create category |
| GET | `/menu/categories/:id` | No | Get category |
| PATCH | `/menu/categories/:id` | Admin | Update category |
| DELETE | `/menu/categories/:id` | Admin | Delete category |
| GET | `/menu/items` | No | List items (search, filter, paginate) |
| POST | `/menu/items` | Admin | Create menu item |
| GET | `/menu/items/:id` | No | Get item with reviews |
| PATCH | `/menu/items/:id` | Admin | Update item |
| DELETE | `/menu/items/:id` | Admin | Delete item |
| POST | `/menu/items/:id/images` | Admin | Upload image (base64) |
| DELETE | `/menu/items/:id/images` | Admin | Delete image |

### GET /menu/items query params
- `category` — category slug (e.g. `pizza`)
- `search` — text search
- `featured` — `true` for featured only
- `page` — pagination
- `limit` — items per page (max 50)

---

## Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart` | Yes | Get cart with totals |
| POST | `/cart` | Yes | Add item to cart |
| DELETE | `/cart` | Yes | Clear cart |
| PATCH | `/cart/items/:itemId` | Yes | Update item quantity |
| DELETE | `/cart/items/:itemId` | Yes | Remove item |
| POST | `/cart/coupon` | Yes | Validate coupon code |

### POST /cart (Add Item)
```json
{ "menuItemId":"clxxx", "sizeId":"clxxx", "addonIds":["clxxx"], "quantity":2 }
```

---

## Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | Yes | Order history |
| POST | `/orders` | Yes | Place order from cart |
| GET | `/orders/:id` | Yes | Get order details |
| POST | `/orders/:id/cancel` | Yes | Cancel order |
| GET | `/orders/:id/timeline` | Yes | Order status timeline |
| PATCH | `/orders/:id/status` | Admin | Update order status |

### POST /orders (Place Order)
```json
{ "addressId":"clxxx", "type":"DELIVERY", "paymentMethod":"cod", "couponCode":"PIZZA10", "note":"Extra spicy" }
```

### PATCH /orders/:id/status (Admin)
```json
{ "status":"PREPARING", "note":"Started cooking" }
```
Status values: `PENDING` → `CONFIRMED` → `PREPARING` → `ON_THE_WAY` → `DELIVERED` | `CANCELLED`

---

## Addresses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/addresses` | Yes | List user addresses |
| POST | `/addresses` | Yes | Add address |
| PATCH | `/addresses/:id` | Yes | Update address |
| DELETE | `/addresses/:id` | Yes | Delete address |

---

## Reservations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reservations` | Yes | List user reservations |
| POST | `/reservations` | Yes | Book a table |
| DELETE | `/reservations/:id` | Yes | Cancel reservation |

### POST /reservations
```json
{ "name":"Ahmed", "phone":"03001234567", "date":"2024-12-25T00:00:00Z", "time":"19:00", "partySize":4 }
```

---

## Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews?menuItemId=xxx` | No | Get item reviews |
| POST | `/reviews` | Yes | Submit review (must have ordered) |

---

## Contact

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/contact` | No | Send contact message |

---

## Admin

All admin routes require `ADMIN` / `SUPER_ADMIN` / `MANAGER` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Stats + recent orders |
| GET | `/admin/orders` | All orders (filter by status) |
| GET | `/admin/users` | All users |
| PATCH | `/admin/users/:id` | Toggle active / change role |
| GET | `/admin/contact` | All contact messages |
| PATCH | `/admin/contact/:id` | Mark as read |

---

## Default Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@pizzatown.pk | Admin@123 |

## Test Coupon
- Code: `PIZZA10` — 10% off on orders above Rs. 500

---

## Setup Commands
```bash
# 1. Copy env
cp .env.example .env
# 2. Fill DATABASE_URL in .env
# 3. Push schema to DB
npx prisma db push
# 4. Seed essential data
npx prisma db seed
# 5. Run dev server
npm run dev
```
