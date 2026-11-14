
import { Navigate, Route, Routes } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import InfoPage from "./pages/InfoPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLoginPage from "./pages/AdminLoginPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminTranslationsPage from "./pages/admin/AdminTranslationsPage";
import AdminSeoPage from "./pages/admin/AdminSeoPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/ru" replace />}
      />

      {/* Страница входа в административную панель */}
      <Route
        path="/:locale/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Administrative panel */}
      <Route
        path="/:locale/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<AdminDashboardPage />}
        />

        <Route
          path="categories"
          element={<AdminCategoriesPage />}
        />

        <Route
          path="products"
          element={<AdminProductsPage />}
        />

        <Route
          path="news"
          element={<AdminNewsPage />}
        />

        <Route
          path="translations"
          element={<AdminTranslationsPage />}
        />

        <Route
          path="seo"
          element={<AdminSeoPage />}
        />
      </Route>

      {/* Public website */}
      <Route
        path="/:locale"
        element={<SiteLayout />}
      >
        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="products"
          element={<ProductsPage />}
        />

        <Route
          path="products/:slug"
          element={<ProductDetailPage />}
        />

        <Route
          path="news"
          element={<NewsPage />}
        />

        <Route
          path="news/:slug"
          element={<NewsDetailPage />}
        />

        <Route
          path="about"
          element={<InfoPage page="about" />}
        />

        <Route
          path="export"
          element={<InfoPage page="export" />}
        />

        <Route
          path="partners"
          element={<InfoPage page="partners" />}
        />

        <Route
          path="contacts"
          element={<InfoPage page="contacts" />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/ru" replace />}
      />
    </Routes>
  );
}

export default App;
