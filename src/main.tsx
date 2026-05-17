import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import { ScrollToTop } from './components/ScrollToTop';
import { ViewTransitionHandler } from './components/ViewTransitionHandler';
import { AppProviders } from './components/layout/AppProviders';
import { RouteFallback } from './components/layout/RouteFallback';

const App = lazy(() => import('./App.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Privacy = lazy(() => import('./pages/Privacy.tsx'));
const Editorial = lazy(() => import('./pages/Editorial.tsx'));
const Corrections = lazy(() => import('./pages/Corrections.tsx'));
const EspazzaProject = lazy(() => import('./pages/EspazzaProject.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const Blog = lazy(() => import('./pages/Blog.tsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.tsx'));
const GetAQuotePage = lazy(() => import('./pages/GetAQuotePage.tsx'));
const ServicesPage = lazy(() => import('./pages/Services.tsx'));
const TechnicalCofounderPage = lazy(() => import('./pages/TechnicalCofounder.tsx'));
const DynamicServicePage = lazy(() => import('./pages/DynamicServicePage.tsx'));
const DynamicComparisonPage = lazy(() => import('./pages/DynamicComparisonPage.tsx'));
const DevelopersRegionHub = lazy(() => import('./pages/DevelopersRegionHub.tsx'));
const LocalDeveloperPage = lazy(() => import('./pages/LocalDeveloperPage.tsx'));
const SitemapPage = lazy(() => import('./pages/Sitemap.tsx'));

/** Remount blog post page when :slug changes (same route, new params). */
function BlogPostRoute() {
  const { slug } = useParams();
  return <BlogPost key={slug} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppProviders>
          <ScrollToTop />
          <ViewTransitionHandler />
          <Suspense fallback={<RouteFallback />}>
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
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostRoute />} />
              <Route path="/get-a-quote" element={<GetAQuotePage />} />
              <Route path="/projects/espazza" element={<EspazzaProject />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppProviders>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
