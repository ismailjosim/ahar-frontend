# Ahar Frontend

Ahar is a modern restaurant management web application designed for both customers and restaurant staff. This frontend delivers the customer experience for browsing the menu, placing orders, managing a cart, making reservations, and interacting with a secure account dashboard.

## Project Overview

The frontend is built as part of a larger full-stack system that connects to a shared backend and database. It follows the feature roadmap in the planning folder and supports the core journey for a restaurant business:

- Discovering the restaurant and exploring the menu
- Adding items to a cart and checking out
- Tracking an order after purchase
- Making table reservations
- Signing in or signing up with authentication and profile support
- Accessing protected dashboard and profile experiences

## Key Features

### Customer Experience

- Responsive home page and menu browsing experience
- Product and food item detail views
- Cart management with persistent global state
- Checkout flow with phone validation and order submission
- Order tracking and order history experience
- Reservation page for table booking

### Admin and Staff Ready Features

- Protected dashboard routes for staff or admin users
- Role-based access support through shared authentication
- Planned modules for inventory, payments, reports, coupons, settings, and staff management

## Technologies Used

This project is built with a modern React and Next.js stack:

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS v4 for styling
- shadcn/ui and Radix UI components
- Better Auth for authentication
- Prisma client for database access
- Zustand for global cart state
- React Hook Form and Zod for form handling and validation
- Sonner for toast notifications
- Lucide and Tabler icons for interface icons
- Lottie for lightweight animations

## How It Works

1. The app loads the public restaurant experience through the Next.js frontend routes.
2. Customers can browse the menu, add favorites to the cart, and proceed through checkout.
3. Authentication is handled through Better Auth, with protected routes for account and dashboard access.
4. The frontend communicates with the backend services to create orders, reservations, and account-related actions.
5. Shared state such as the cart is managed globally so the user experience stays consistent across pages.
6. The architecture is designed to grow into richer admin features such as payments, inventory, analytics, and reports.

## Project Structure

- src/app: route-level pages and layouts
- src/components/modules: feature-specific UI modules such as Home, Cart, Checkout, Reservation, Profile, and Dashboard
- src/lib: shared utilities, authentication helpers, and validation helpers
- src/store: global application state such as cart data
- src/services: integrations with backend APIs
- src/types and src/schema: shared TypeScript types and validation schemas

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A running PostgreSQL database

### Installation

```bash
cd ahar-frontend
pnpm install
```

### Environment Setup

Create your environment file from the example config and fill in the required values:

```bash
cp .env.example .env.local
```

### Run the Development Server

```bash
pnpm dev
```

Open <http://localhost:3000> in your browser.

## Notes

The frontend is aligned with the implementation plan documented in the planning folder and is intended to work alongside the backend services in the Ahar server project.
