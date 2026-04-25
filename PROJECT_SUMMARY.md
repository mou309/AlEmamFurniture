# Maison Furniture App — Project Summary

> **Purpose of this file:** Quick-reference context for future Claude sessions. Read this before making any changes to avoid duplicating work and to understand current state.

---

## Stack

| Layer      | Tech                                   |
|------------|----------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript    |
| Styling    | Tailwind CSS (custom earthy palette)   |
| 3D         | Three.js via @react-three/fiber + drei |
| State      | React Context (Auth, Cart)             |
| Backend    | Node.js + Express (REST API)           |
| Database   | Firestore (Catalog/Portfolio) + PostgreSQL (Auth/Orders) |
| Auth       | JWT (bcryptjs)                         |
| Animations | Framer Motion                          |

---

## Project Structure

```
Furniture App/
├── backend/
│   ├── src/
│   │   ├── index.js               # Express entry — all routes wired here
│   │   ├── middleware/auth.js     # JWT verification middleware
│   │   ├── models/
│   │   │   ├── db.js              # pg Pool wrapper
│   │   │   ├── schema.sql         # Full DB schema + seed data
│   │   │   └── initDb.js          # Run once: npm run db:init
│   │   └── routes/
│   │       ├── auth.js            # POST /register, POST /login, GET /me
│   │       ├── furniture.js       # GET /furniture (filters), GET /furniture/:id, GET /categories
│   │       ├── orders.js          # POST /orders, GET /orders
│   │       ├── virtualRoom.js     # POST/GET/PUT /virtual-room, GET /share/:token
│   │       ├── portfolio.js       # GET /portfolio
│   │       └── designRequests.js  # POST /design-requests
│   ├── .env.example               # Copy to .env and fill
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         # Root layout — wraps AuthProvider, CartProvider, Navbar, Footer
    │   │   ├── page.tsx           # Home page with hero, categories, featured items, portfolio preview
    │   │   ├── catalog/page.tsx   # Catalog with sidebar filters, search, pagination, custom request form
    │   │   ├── auth/
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   ├── virtual-room/
    │   │   │   ├── page.tsx       # Full virtual room builder UI
    │   │   │   └── share/[token]/page.tsx  # Public shared room view
    │   │   ├── portfolio/page.tsx
    │   │   ├── cart/page.tsx
    │   │   └── checkout/page.tsx  # 2-step checkout (shipping → review → success)
    │   ├── components/
    │   │   ├── Navbar.tsx          # Sticky, scroll-aware, mobile-responsive
    │   │   ├── Footer.tsx
    │   │   ├── FurnitureCard.tsx   # Card with add-to-cart, add-to-room actions
    │   │   ├── CartSidebar.tsx     # Slide-in cart drawer
    │   │   └── VirtualRoomScene.tsx  # Three.js 3D scene (Canvas + room + draggable furniture)
    │   ├── context/
    │   │   ├── AuthContext.tsx     # login/register/logout + localStorage persistence
    │   │   └── CartContext.tsx     # items, addItem, updateQty, removeItem
    │   └── lib/api.ts             # Axios client + typed helpers per domain
    ├── tailwind.config.ts         # Custom colors: beige, earth, sage, bark, cream
    └── package.json
```

---

## Color Palette

| Name   | Usage                          |
|--------|-------------------------------|
| bark   | `#3d2b1f` — primary text/CTA  |
| cream  | `#faf8f5` — page background   |
| beige  | Warm neutrals (50–900 scale)  |
| earth  | Mid-tone browns               |
| sage   | `#4d7a50` — accent/CTA green  |

---

## API Endpoints

### Auth `/api/auth`
- `POST /register` — { email, password, name } → { token, user }
- `POST /login` — { email, password } → { token, user }
- `GET /me` — requires Bearer token

### Furniture `/api/furniture`
- `GET /` — query: category(slug), style, min_price, max_price, search, page, limit
- `GET /categories`
- `GET /:id`

### Orders `/api/orders` *(auth required)*
- `POST /` — { items[], shipping_address, notes }
- `GET /` — user's orders

### Virtual Room `/api/virtual-room`
- `POST /` *(auth)* — { name, room_data } → saves room, generates share_token
- `GET /` *(auth)* — user's saved rooms
- `GET /share/:token` — public
- `PUT /:id` *(auth)*

### Portfolio `/api/portfolio`
- `GET /` — all projects

### Design Requests `/api/design-requests`
- `POST /` — { email, name, description, image_url? }

---

## Database Tables

- `users` — user_id, email, password (hashed), name, role
- `categories` — category_id, name, slug
- `furniture_items` — item_id, name, description, price, image_url, category_id, style, dimensions(JSONB), colors[]
- `orders` — order_id, user_id, status, total_amount, shipping_address(JSONB)
- `order_items` — order_item_id, order_id, item_id, quantity, unit_price
- `virtual_rooms` — room_id, user_id, name, room_data(JSONB), share_token
- `portfolio_projects` — project_id, title, description, images[], tags[]
- `design_requests` — request_id, user_id?, email, description, status

**Seed data included:** 5 categories, 15 furniture items, 4 portfolio projects.

---

## Runtime Status (آخر تحديث: 2026-04-26)

| Server | Port | Status |
|--------|------|--------|
| Frontend (Next.js) | 3000 | ✅ شغال — `npm run dev` |
| Backend (Express) | 5000 | ✅ شغال — `nodemon src/index.js` |
| Firestore Database | - | ✅ شغال — Seeded with 15 products |

**`npm install` تم** في كلا المجلدين. السيرفرات جاهزة للتشغيل مباشرة.
**`.env`** تم إعداده ببيانات Firestore وService Account.
**Firestore** تم تفعيله وعمل Seed لـ 15 منتج و4 مشاريع Portfolio.

### صفحات تم التحقق منها بصرياً
| الصفحة | الحالة |
|--------|--------|
| `/` Home | ✅ Hero + Features + Categories + Footer كله شغال |
| `/virtual-room` | ✅ Three.js 3D room محمل — floor/walls/grid ظاهرين |
| `/catalog` | ✅ منتجات بتظهر بالصور الحقيقية عبر Mock data |
| `/catalog#custom-request` | ✅ فورم الطلب المخصص — اسم + موبايل + رفع صور |
| `/auth/login` | ✅ مبنية |
| `/auth/register` | ✅ مبنية |
| `/portfolio` | ✅ مبنية |
| `/cart` | ✅ مبنية |
| `/checkout` | ✅ مبنية |

### إصلاحات وتحديثات تمت (2026-04-25 → 2026-04-26)
- **`db.js`** — Mock data layer يتيح تشغيل الكاتالوج بدون PostgreSQL
- **`designRequests.js`** — Multer integration لرفع الصور (حتى 5 صور / 10MB لكل صورة)
- **`index.js`** — Static serving لـ `/uploads` + `unhandledRejection` handler
- **`catalog/page.tsx`** — فورم الطلب المخصص محدّث: اسم + رقم موبايل + image upload مع preview

---

## What's Done ✅

1. **Backend** — Full Express REST API with JWT auth, all routes, PostgreSQL schema + seed
2. **Frontend config** — Next.js 14, Tailwind with custom palette, TypeScript, postcss
3. **Auth system** — Register/Login pages, AuthContext with localStorage persistence, JWT interceptors
4. **Cart system** — CartContext, CartSidebar drawer, CartPage with quantity controls
5. **Home page** — Hero, feature highlights, category grid, featured products, portfolio preview, custom design CTA
6. **Catalog page** — Sidebar filters (category, style, price), search, pagination
7. **Virtual Room** — Full 3D builder: room templates, custom dimensions, furniture placement via drag, rotation/scale/color controls, save + shareable link
8. **Portfolio page** — Projects grid with tags, client info, CTA
9. **Checkout** — 2-step (shipping form → order review → success), cash-on-delivery
10. **Shared components** — Navbar (scroll-aware, mobile menu), Footer, FurnitureCard, CartSidebar
11. **npm install** — تم في frontend/ وbackend/
12. **`.claude/launch.json`** — موجود، يشغل الاتنين بـ preview_start
13. **Firestore Integration** — تم ربط المشروع بـ Firestore كقاعدة بيانات أساسية للكاتالوج والمشاريع.
14. **Seeding Complete** — تم رفع 5 تصنيفات، 15 منتج، و4 مشاريع Portfolio إلى Firestore.
15. **Mock DB Fallback** — الـ `db.js` يدعم العمل ببيانات Mock في حالة عدم توفر Firestore لضمان استقرار التطبيق.
16. **صور حقيقية** — 9 صور تم إضافتها في `frontend/public/images/` (غرف نوم + صالات)
17. **15 منتج** — أُضيف 7 منتجات جديدة للـ seed: سرير ذكي، تسريحات، ركنات متنوعة
18. **فورم طلب مخصص** — محدّث بـ: اسم + رقم موبايل + رفع صور (حتى 5 صور) مع preview فوري
19. **Image Upload API** — `POST /api/design-requests` بيقبل `multipart/form-data` ويحفظ الصور في `backend/uploads/requests/`
20. **`.env`** — تم تكوينه بالـ Service Account Key الخاص بـ Firebase.

---

## What Still Needs Work ❌

1. **PostgreSQL Sync** — باقي جداول (Users, Orders, Virtual Rooms) لسه شغالة PostgreSQL. لو محتاج تحولهم لـ Firestore بلغني.
2. **Item detail page** — `frontend/src/app/catalog/[id]/page.tsx` مش موجودة (404 عند الضغط على منتج)
3. **User profile page** — `frontend/src/app/profile/page.tsx` مش موجودة (linked من Navbar)
4. **3D furniture models** — الأثاث بيظهر كـ colored boxes. لو عايز models حقيقية: استخدم `useGLTF` من drei وحط GLTF/GLB files وعبّي `model_3d_url` في DB
5. **Payment gateway** — Cash-on-delivery بس دلوقتي. ادمج Paymob أو Stripe
6. **Email notifications** — ثبّت nodemailer وابعت confirmation emails عند register + order
7. **Admin dashboard** — CRUD للأثاث، إدارة الأوردرات، مراجعة design requests
8. **Wishlist** — يحتاج DB table جديد + API + UI
9. **Reviews/ratings** — يحتاج DB table جديد + API + UI

---

## Setup Commands

```bash
# Backend
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
npm run db:init             # creates tables and seeds data
npm run dev                 # starts on port 5000

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                 # starts on port 3000
```

---

## Design Decisions to Remember

- **Color classes** use custom names: `bg-bark`, `bg-cream`, `bg-sage-600`, `bg-beige-100`, `bg-earth-500` — NOT standard Tailwind colors
- **Buttons** use CSS component classes: `.btn-primary`, `.btn-secondary`, `.btn-sage`, `.input-field`, `.card`, `.section-title`, `.badge` — defined in `globals.css`
- **Three.js** is dynamically imported (`next/dynamic` with `ssr: false`) because it uses browser APIs
- **Cart** persists to `localStorage` automatically via `CartContext`
- **Auth** tokens stored in `localStorage`; 401 responses auto-redirect to login
- **Currency** is displayed as EGP (Egyptian Pounds) throughout
