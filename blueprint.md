# ModernWear - Application Blueprint

## Overview

ModernWear is a full-featured e-commerce platform designed for selling and buying clothing. It provides a complete end-to-end experience for users, from browsing products to making a purchase and viewing their order history. The platform also includes a dedicated dashboard for vendors to manage their products.

## Implemented Features

### 1. Authentication & Authorization

- **Sign Up:** New users can create an account, specifying their role as either a "User" or a "Vendor."
- **Sign In:** Existing users can sign in to access their accounts.
- **Session Management:** The application uses NextAuth.js for robust session management.
- **Role-Based Access Control:** The system distinguishes between regular users and vendors, showing specific UI elements and restricting access based on the user's role.

### 2. Vendor Dashboard

- **Product Creation:** Vendors have access to a dashboard where they can create new product listings. The product creation form includes fields for title, description, price, images, and other details.
- **Product Management:** Vendors can view a list of all the products they have created.

### 3. Storefront & Product Discovery

- **Product Listing Page (`/store`):** A central page that displays all available products in a grid layout. Each product is displayed on a `ProductCard` component.
- **Product Detail Page (`/store/product/[id]`):** A dynamic page that provides a detailed view of a single product, including its name, description, price, images, and vendor information.
- **Related Products:** The product detail page also displays a section for "You Might Also Like," showing other products from the same vendor.

### 4. Shopping Cart & State Management

- **Add to Cart:** Users can add products to their shopping cart from the product detail page. An "Add to Cart" button triggers a server action to update the user's cart.
- **Cart State:** The state of the cart (e.g., whether it is open or closed) is managed globally using a `zustand` store, allowing for a seamless user experience.
- **Cart Sidebar:** A sidebar component that displays the contents of the user's cart, including a list of items, quantities, and the subtotal. The sidebar can be opened and closed from a cart icon in the header.
- **User Feedback:** The application provides immediate user feedback with toast notifications (e.g., "Item added to cart!") using the `sonner` library.

### 5. Checkout & Payment Integration

- **Stripe Integration:** The application is integrated with Stripe for secure and reliable payment processing.
- **Checkout Page (`/checkout`):** A dedicated page that displays an order summary, including subtotal, shipping costs, and the total amount.
- **Stripe Checkout Session:** The checkout page creates a Stripe Checkout session and redirects the user to the secure Stripe payment page.
- **Order Fulfillment:** After a successful payment, the application verifies the payment with Stripe, creates a new `Order` in the database, and clears the user's cart.
- **Success Page (`/checkout/success`):** A confirmation page that is displayed after a successful payment, showing the order summary and an order confirmation message.

### 6. User Profile & Order History

- **My Orders Page (`/profile/orders`):** A page where users can view a list of all their past orders, including the order ID, date, total amount, and status.
- **Order Detail Page (`/profile/orders/[id]`):** A dynamic page that provides a detailed breakdown of a specific order, including a list of the items in the order, their prices, and quantities.

### 7. Styling & Design

- **Tailwind CSS:** The application is styled using Tailwind CSS, providing a modern and responsive design.
- **Component Library:** The UI is built with a set of reusable components from the `shadcn/ui` library, ensuring a consistent and polished look and feel.
- **Layout:** The application has a consistent layout, with a header, main content area, and a footer.

### 8. Product Reviews & Ratings

- **Submit Reviews:** Logged-in users who have purchased a product can submit a review, including a star rating (1-5), a title, and a comment.
- **Purchase Verification:** The system verifies that a user has actually purchased a product before they are allowed to submit a review, ensuring the authenticity of feedback.
- **Display Reviews:** The product detail page displays all existing reviews for the product, including the reviewer's name, the rating they gave, the review title, and the comment.
- **Average Rating:** The product detail page and the product cards on the store page now display the average star rating for each product, giving users a quick visual indicator of product quality.
- **Server Actions for Submissions:** Review submissions are handled securely and efficiently using Next.js Server Actions.
- **UI Components:** The feature includes a `ReviewForm` client component for submitting reviews and a `ReviewList` server component for displaying them.
