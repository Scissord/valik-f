/**
 * Components Index - Clean Architecture
 * Organized by layers: Layout, Shared, Features, Mobile
 */

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
export { Header } from "./layout/Header";
export { Footer } from "./layout/Footer";
export { SideBar } from "./layout/SideBar";
export { Provider } from "./layout/Provider";

// =============================================================================
// SHARED/UI COMPONENTS
// =============================================================================
export { Title } from "./shared/Title";
export { PageNotFound404 } from "./shared/PageNotFound404";
export { Pagination } from "./shared/Pagination";
export { RefreshButton } from "./shared/RefreshButton";
export * from "./shared/breadcrumbs";
export { ZodErrors as ZodError } from "./shared/ZodError";


// =============================================================================
// FEATURE COMPONENTS (Domain-driven)
// =============================================================================

// Authentication
export * from "./features/auth";

// Product Catalog
export * from "./features/catalog";

// Product Details
export * from "./features/product";

// Shopping Cart
export * from "./features/cart";

// Checkout Process
export * from "./features/checkout";

// User Profile
export * from "./features/profile";

// AI Assistant
export * from "./features/ai-assistant";

// Landing Pages
export * from "./features/landing";

// =============================================================================
// MOBILE COMPONENTS
// =============================================================================
export * from "./mobile";
