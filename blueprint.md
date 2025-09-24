# Blueprint: E-commerce Platform

## Overview

This document outlines the architecture and features of a modern e-commerce platform built with Next.js, `next-auth`, and NeonDB. The platform is designed to be a multi-vendor marketplace, allowing vendors to sign up, manage their own products, and sell to customers. Customers can browse products, manage their profiles, and place orders.

## Project Structure

The project follows a standard Next.js App Router structure:

-   `/app`: Contains all the routes and UI components for the application.
-   `/components`: Contains reusable UI components.
-   `/lib`: Contains utility functions and the Prisma client instance.
-   `/prisma`: Contains the database schema.

## Implemented Features

### 1. User Authentication with `next-auth`

-   **Google OAuth:** Users can sign in using their Google accounts, leveraging the `next-auth` Google Provider.
-   **Session Management:** `next-auth` handles session management, providing session data on both the client and server.
-   **Prisma Adapter:** The `@next-auth/prisma-adapter` is used to store user and session data in the NeonDB database.

### 2. Address Management (Customer-side)

-   **CRUD Operations:** Customers can create, read, update, and delete their shipping addresses.
-   **Validation:** Address input is validated using a Zod schema to ensure data integrity.
-   **Server Actions:** Address management is handled via Next.js server actions.

### 3. Product Management (Vendor-side)

-   **CRUD Operations:** Vendors can create, read, update, and delete their products.
-   **Validation:** Product information is validated using a Zod schema.
-   **Security:** Server actions for product management include checks to ensure that only authenticated vendors can manage their own products.

### 4. Shopping Cart & Checkout

-   **Cart Management:**
    -   **Get Cart:** Fetches the user's cart from the database.
    -   **Add to Cart:** Adds a product to the user's cart. If the item is already in the cart, it increases the quantity.
    -   **Update Cart Item Quantity:** Allows users to change the quantity of an item in their cart.
    -   **Remove Cart Item:** Removes an item from the user's cart.
-   **Checkout with Razorpay:**
    -   **Create Razorpay Order:** Creates a new order with Razorpay, providing the total amount and other necessary details.
    -   **Verify Payment:** Verifies the payment signature from Razorpay to ensure the transaction is legitimate.
-   **Webhook for Payment Verification:**
    -   **`/api/webhook/route.ts`:** A dedicated webhook endpoint to receive and process payment confirmations from Razorpay.

### 5. Vendor Order Management

-   **View Orders:** Vendors can view a list of orders containing their products on the `/vendor/dashboard/orders` page.
-   **Order Details:** The order list displays key information such as order ID, status, total amount, and date.
-   **Security:** The `getVendorOrders` server action ensures that vendors can only view orders containing their own products.

### 6. Customer Order History

-   **View Orders:** Customers can view a list of their past orders on the `/orders` page.
-   **Order Details:** The order list displays key information such as order ID, status, total amount, and date.
-   **Security:** The `getCustomerOrders` server action ensures that customers can only view their own orders.

### 7. Product Reviews

-   **Leave a Review:** Customers who have purchased a product can leave a review with a rating and a comment.
-   **View Reviews:** Product reviews are displayed on the product detail page, along with the average rating.
-   **Validation:** Review input is validated to ensure that ratings are between 1 and 5 and that comments are not empty.
-   **Security:** Users must be logged in and have purchased a product to leave a review.

### 8. Vendor Dashboard

-   **Dashboard Overview:** A central dashboard for vendors to view key metrics.
-   **Metrics:**
    -   Total Products
    -   Total Orders
    -   Total Revenue
-   **Security:** The `getVendorDashboardData` server action ensures that vendors can only view their own dashboard data.
