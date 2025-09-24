# Blueprint

## Overview

This is a blueprint for a multi-vendor e-commerce application built with Next.js and Prisma. The application allows customers to browse products from different vendors, add them to their cart, and checkout. Vendors can manage their products, orders, and payouts through a dedicated dashboard.

## Style and Design

*   **UI Framework:** Tailwind CSS
*   **Component Library:** shadcn/ui
*   **Icons:** Lucide React
*   **Animation:** Framer Motion
*   **Fonts:** Google Fonts (Inter)
*   **Color Palette:**
    *   Primary: `#6D28D9` (Deep Purple)
    *   Secondary: `#EC4899` (Vibrant Pink)
    *   Accent: `#F59E0B` (Warm Amber)
    *   Neutral: `#F3F4F6` (Light Gray)
*   **Overall Aesthetic:** Modern, clean, and visually appealing with a focus on user experience.

## Features

### Implemented

*   **User Authentication:**
    *   Users can sign up and log in with their email and password.
    *   Support for Google OAuth.
    *   Role-based access control (Customer, Vendor, Admin).
*   **Vendor Dashboard:**
    *   Vendors can view their stats (total revenue, total orders, total products).
    *   Vendors can manage their products (add, edit, delete).
*   **Product Management:**
    *   Products have a title, description, price, stock, sizes, colors, and images.
*   **Storefront:**
    *   Customers can view a list of all products.
    *   Product cards display the product image, title, price, and vendor's store name.
    *   Links to the vendor's profile page from the product card.
*   **Product Categories:**
    *   Products can be assigned to categories.
    *   Dedicated pages for each category.
    *   Filtering products by category on the main store page.
*   **Search and Filtering:**
    *   Search for products by name.
    *   Sort products by price or newest.
*   **Vendor Profile:**
    *   Public profile page for each vendor, displaying their logo, store name, description, and products.

### Current Plan

*   **Shopping Cart:**
    *   Allow users to add products to their cart.
    *   View and manage items in the cart.
*   **Checkout:**
    *   Implement a multi-step checkout process.
    *   Integrate with a payment gateway (e.g., Stripe or Razorpay).
*   **Order Management:**
    *   Customers can view their order history.
    *   Vendors can view and manage orders for their products.
*   **Reviews and Ratings:**
    *   Allow customers to leave reviews and ratings for products.
    *   Display average ratings on product cards.
*   **Admin Panel:**
    *   A dedicated dashboard for administrators to manage users, vendors, and products.
