# Textile Shop Manager

A complete, production-quality, mobile-first **Textile Shop Management Web App** that runs entirely in the browser — no backend, no database server, no API. All data is stored locally using `localStorage`. Built with plain HTML5, CSS3, and vanilla JavaScript (ES6), so it can be hosted for free on GitHub Pages and opened directly from `index.html`.

## Project Overview

Textile Shop Manager solves the everyday problems of running a textile/garment retail shop:

- Tracks current, sold, and remaining stock automatically
- Calculates profit, loss, income, and expenses in real time
- Provides a professional Point-of-Sale (POS) system with invoicing
- Tracks supplier purchases and customer sales history
- Remembers purchase prices so margins are always known
- Gives the owner a customer-facing product catalog
- Generates daily/weekly/monthly/yearly business reports with export to PDF, Excel, and CSV

The app is designed to feel like a native mobile app — bottom navigation, floating action button, glassmorphism cards, smooth animations, and full dark mode support — while remaining just as usable on a tablet or desktop.

## Features

- **Authentication** — Owner login, Employee login, 4–6 digit PIN login, "Remember me", logout, and role-based access (Employees cannot access Settings).
- **Dashboard** — Today's/Monthly Sales, Income, Expense, Profit, Current Cash, Inventory Value, Total Products/Customers/Suppliers, Pending Payments, Low Stock & Out of Stock alerts, best sellers, latest sales/expenses, recent activity feed, and Chart.js visualizations.
- **Products** — Full CRUD with SKU, barcode & QR code generation/preview, category, brand, fabric, color, design, size, purchase/selling/wholesale/offer price, stock, minimum stock, supplier, rack number, image upload, and a customer-facing **Catalog** view (grid/list, search, filter, favorites, share).
- **Inventory** — Stock In, Stock Out, Adjustment, Damaged, and Returned movements, full stock movement history, live inventory table, low-stock and out-of-stock alerts, total inventory value.
- **Sales / POS** — Product search & category filters, cart with quantity steppers, discount and tax, Cash/Card/Bank/Split payment, auto invoice numbering, printable receipt, PDF invoice (jsPDF), Return / Exchange / Cancel Sale, and full sales history.
- **Customers** — Contact details, WhatsApp, address, purchase history, outstanding balance, notes.
- **Suppliers** — Contact details, products supplied, purchase history, due payments, and a **Purchase Management** flow that automatically increases stock and remembers the latest purchase price.
- **Expenses** — Categorized expense tracking (Rent, Salary, Electricity, Water, Internet, Transport, Marketing, Maintenance, Miscellaneous, plus custom categories) with charts.
- **Income** — Automatic sales income tracking plus manual/other income entries, with trend charts.
- **Reports** — Sales, Purchase, Expense, Income, Profit, Inventory, Customer, and Supplier reports across Daily/Weekly/Monthly/Yearly/Custom ranges, each with KPIs, charts, and **Export to PDF / Excel / CSV** plus Print.
- **Settings** — Shop profile & logo, owner info, currency, default tax %, Dark/Light mode, user & PIN management, category management, and full **Backup / Restore / Reset** of the local database.
- **Global Search** — Instantly search products, customers, suppliers, and invoices from any page.

## Folder Structure

```
/
├── index.html
├── login.html
├── dashboard.html
├── products.html
├── inventory.html
├── sales.html
├── customers.html
├── suppliers.html
├── expenses.html
├── income.html
├── reports.html
├── settings.html
│
├── css/
│   ├── style.css        # design tokens, layout shell, core components
│   ├── dashboard.css     # KPI cards, chart layout, activity feed
│   ├── forms.css         # inputs, filters, tabs, toggles
│   ├── tables.css        # data tables + mobile card fallback
│   ├── mobile.css        # responsive breakpoints, bottom nav, FAB
│   └── animations.css    # keyframes, spinners, transitions
│
├── js/
│   ├── storage.js        # localStorage data layer (CRUD for every entity)
│   ├── auth.js           # login, session, role guard
│   ├── app.js             # shared shell: sidebar/topbar/bottom-nav/FAB, toasts, modals
│   ├── dashboard.js
│   ├── products.js
│   ├── inventory.js
│   ├── sales.js
│   ├── customers.js
│   ├── suppliers.js
│   ├── expenses.js
│   ├── income.js
│   ├── reports.js
│   └── settings.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

## Technology

HTML5 · CSS3 · Vanilla JavaScript (ES6) · `localStorage` · [Chart.js](https://www.chartjs.org/) · [jsPDF](https://github.com/parallax/jsPDF) · [SheetJS (xlsx)](https://sheetjs.com/) · [Font Awesome](https://fontawesome.com/) · [Google Fonts](https://fonts.google.com/) — all loaded via CDN. No frameworks, no build tools, no server.

## How to Use

1. Open `index.html` in any modern browser (or deploy to GitHub Pages — see below).
2. Log in with one of the demo accounts (shown on the login screen):
   - **Owner:** `owner` / `owner123`
   - **Employee:** `staff` / `staff123`
   - **PIN:** `1234`
3. The app seeds itself with sample products, suppliers, and customers on first run so you can explore immediately.
4. Use the sidebar (desktop) or bottom navigation + hamburger menu (mobile) to move between Dashboard, Sales, Products, Inventory, Customers, Suppliers, Expenses, Income, Reports, and Settings.
5. Everything you create, edit, or sell is saved immediately to your browser's `localStorage` — no internet connection is required after the page has loaded once.

## How to Backup

1. Go to **Settings → Backup & Data**.
2. Click **Download Backup** to save a complete JSON snapshot of your shop's data (products, sales, customers, suppliers, expenses, income, inventory history, settings, and users).

## How to Restore

1. Go to **Settings → Backup & Data**.
2. Click **Restore Backup** and select a previously downloaded JSON backup file.
3. Confirm the prompt — this will overwrite all current data with the contents of the backup, then reload the app.

> To completely wipe the shop's data (e.g. before handing the app to a new shop), use **Reset All Data** in the same section. This is irreversible — export a backup first if you want to keep a copy.

## How to Publish on GitHub Pages

1. Create a new GitHub repository and push the contents of this folder to it (`index.html` must be at the repository root, or in `/docs` if you configure Pages that way).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, choose the branch (e.g. `main`) and folder (`/root`), then save.
4. Wait a minute for GitHub to build the site, then open the URL GitHub provides (e.g. `https://<username>.github.io/<repo-name>/`).
5. That's it — no server, no environment variables, no build step. The app runs entirely client-side.

## Future Improvements

- Real scannable barcode/QR generation (currently a lightweight visual placeholder rendered on canvas, since the project intentionally avoids third-party barcode libraries)
- Multi-currency support with live exchange rates
- Cloud sync / multi-device backup via an optional external API
- Barcode scanning via device camera for faster checkout
- Role-based permissions beyond Owner/Employee (e.g. Cashier, Accountant)
- Offline-first service worker for installable PWA support

---

Built as a fully self-contained, no-backend retail management system — just open `index.html` and start running your shop.
