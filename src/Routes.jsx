import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import EbookCreation from './pages/ebook-creation';
import ContentPreview from './pages/content-preview';
import GenerationProgress from './pages/generation-progress';
import DownloadManager from './pages/download-manager';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ContentPreview />} />
        <Route path="/ebook-creation" element={<EbookCreation />} />
        <Route path="/content-preview" element={<ContentPreview />} />
        <Route path="/generation-progress" element={<GenerationProgress />} />
        <Route path="/download-manager" element={<DownloadManager />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
