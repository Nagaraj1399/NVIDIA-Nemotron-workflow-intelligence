import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateWorkflowPage } from './pages/CreateWorkflowPage';
import { ExecutionStudioPage } from './pages/ExecutionStudioPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportViewerPage } from './pages/ReportViewerPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ModelUsagePage } from './pages/ModelUsagePage';
import { HelpPage } from './pages/HelpPage';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 1: Public Marketing & Demo Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Application Workspace Routes (Wrapped in AppShell) */}
        <Route
          path="/app"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/app/workflows/new"
          element={
            <AppShell>
              <CreateWorkflowPage />
            </AppShell>
          }
        />
        <Route
          path="/app/workflows/:id"
          element={
            <AppShell>
              <ExecutionStudioPage />
            </AppShell>
          }
        />
        <Route
          path="/app/history"
          element={
            <AppShell>
              <HistoryPage />
            </AppShell>
          }
        />
        <Route
          path="/app/reports"
          element={
            <AppShell>
              <ReportViewerPage />
            </AppShell>
          }
        />
        <Route
          path="/app/reports/:id"
          element={
            <AppShell>
              <ReportViewerPage />
            </AppShell>
          }
        />
        <Route
          path="/app/integrations"
          element={
            <AppShell>
              <IntegrationsPage />
            </AppShell>
          }
        />
        <Route
          path="/app/settings"
          element={
            <AppShell>
              <SettingsPage />
            </AppShell>
          }
        />
        <Route
          path="/app/settings/models"
          element={
            <AppShell>
              <ModelUsagePage />
            </AppShell>
          }
        />
        <Route
          path="/app/help"
          element={
            <AppShell>
              <HelpPage />
            </AppShell>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
