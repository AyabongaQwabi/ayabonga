import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import Blog from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx';
import GetAQuotePage from './pages/GetAQuotePage.tsx';
import ServicesPage from './pages/Services.tsx';
import TechnicalCofounderPage from './pages/TechnicalCofounder.tsx';
import DynamicServicePage from './pages/DynamicServicePage.tsx';
import DynamicComparisonPage from './pages/DynamicComparisonPage.tsx';
import DevelopersRegionHub from './pages/DevelopersRegionHub.tsx';
import LocalDeveloperPage from './pages/LocalDeveloperPage.tsx';
import EspazzaProject from './pages/EspazzaProject.tsx';
import NotFound from './pages/NotFound.tsx';
import About from './pages/About.tsx';
import Privacy from './pages/Privacy.tsx';
import Editorial from './pages/Editorial.tsx';
import Corrections from './pages/Corrections.tsx';
import BuyerIntentPage from './pages/BuyerIntentPage.tsx';
import { buyerIntentPaths } from './data/buyer-intent-pages.ts';
import { isBusinessSite } from './lib/site-variant.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/technical-cofounder" element={<TechnicalCofounderPage />} />
          <Route path="/solutions/:slug" element={<DynamicServicePage />} />
          <Route path="/vs/:slug" element={<DynamicComparisonPage />} />
          <Route
            path="/developers/south-africa"
            element={<DevelopersRegionHub regionSlug="south-africa" />}
          />
          <Route
            path="/developers/eastern-cape"
            element={<DevelopersRegionHub regionSlug="eastern-cape" />}
          />
          <Route
            path="/developers/eastern-cape/:city/:role"
            element={<LocalDeveloperPage />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/corrections" element={<Corrections />} />
          {!isBusinessSite ? (
            <>
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </>
          ) : null}
          <Route path="/get-a-quote" element={<GetAQuotePage />} />
          {buyerIntentPaths.map((path) => (
            <Route key={path} path={path} element={<BuyerIntentPage />} />
          ))}
          <Route path="/projects/espazza" element={<EspazzaProject />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
