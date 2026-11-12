
import { Navigate, Route, Routes } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NewsPage from "./pages/NewsPage";
import InfoPage from "./pages/InfoPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/ru" replace />}
      />

      <Route path="/:locale" element={<SiteLayout />}>
        <Route index element={<HomePage />} />

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
