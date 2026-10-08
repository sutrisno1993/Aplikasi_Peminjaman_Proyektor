import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BorrowForm from './components/BorrowForm';
import UnitStatusCards from './components/UnitStatusCards';
import AuditTrailTable from './components/AuditTrailTable';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdminMasterView from './components/admin/AdminMasterView';
import ReturnModal from './components/ReturnModal';
import QRGeneratorModal from './components/QRGeneratorModal';
import QRScannerModal from './components/QRScannerModal';
import UnitDetailModal from './components/UnitDetailModal';
import ErrorBoundary from './components/ErrorBoundary';
import { storage } from './data/storage';
import { INITIAL_PROJECTORS, INITIAL_AUDIT_LOGS, INITIAL_TEACHERS, INITIAL_CLASSES } from './constants/appConstants';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [projectors, setProjectors] = useState(() => {
    const list = storage.getProjectors();
    return list && list.length ? list : INITIAL_PROJECTORS;
  });
  
  const [auditLogs, setAuditLogs] = useState(() => {
    const list = storage.getAuditLogs();
    return list && list.length ? list : INITIAL_AUDIT_LOGS;
  });

  const [teachers, setTeachers] = useState(() => {
    const list = storage.getTeachers();
    return list && list.length ? list : INITIAL_TEACHERS;
  });

  const [classes, setClasses] = useState(() => {
    const list = storage.getClasses();
    return list && list.length ? list : INITIAL_CLASSES;
  });

  const [stats, setStats] = useState(() => storage.getStats());
  
  // Tab state: 'borrow' | 'units' | 'audit' | 'analytics' | 'admin'
  const [activeTab, setActiveTab] = useState('borrow');
  
  // Selected projector for borrow form
  const [selectedUnitId, setSelectedUnitId] = useState('PRJ-01');

  // Modal states
  const [returnModalProjector, setReturnModalProjector] = useState(null);
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [detailModalProjector, setDetailModalProjector] = useState(null);
  const [qrModalInitialUnit, setQrModalInitialUnit] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simpro_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('simpro_dark_mode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  // Subscribe to storage updates & poll from MySQL database
  useEffect(() => {
    const updateLocalState = (data) => {
      if (data) {
        setProjectors(data.projectors || storage.getProjectors());
        setAuditLogs(data.auditLogs || storage.getAuditLogs());
        setTeachers(data.teachers || storage.getTeachers());
        setClasses(data.classes || storage.getClasses());
        setStats(data.stats || storage.getStats());
      } else {
        setProjectors(storage.getProjectors());
        setAuditLogs(storage.getAuditLogs());
        setTeachers(storage.getTeachers());
        setClasses(storage.getClasses());
        setStats(storage.getStats());
      }
    };

    const unsubscribe = storage.subscribe(updateLocalState);
    storage.syncFromApi();

    const interval = setInterval(() => {
      storage.syncFromApi();
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Parse URL query parameter (?unit=PRJ-xx) on mount
  useEffect(() => {
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const unitParam = params.get('unit');
      if (unitParam) {
        const normalized = unitParam.toUpperCase();
        const found = storage.getProjectorById(normalized);
        if (found) {
          setSelectedUnitId(found.id);
          setActiveTab('borrow');
        }
      }
    };

    parseUrlParams();
    window.addEventListener('popstate', parseUrlParams);
    return () => window.removeEventListener('popstate', parseUrlParams);
  }, []);

  // Handle unit selection and reflect in URL
  const handleSelectUnit = (unitId) => {
    setSelectedUnitId(unitId);
    const url = new URL(window.location);
    url.searchParams.set('unit', unitId);
    window.history.pushState({}, '', url);
  };

  // Submit Borrow
  const handleBorrowSubmit = (formData) => {
    storage.borrowProjector(formData);
  };

  // Confirm Return
  const handleConfirmReturn = (returnData) => {
    storage.returnProjector(returnData);
  };

  // Reset demo data
  const handleResetData = () => {
    storage.resetToDefault();
    setSelectedUnitId('PRJ-01');
    const url = new URL(window.location);
    url.searchParams.delete('unit');
    window.history.pushState({}, '', url);
  };

  // Quick Action from Unit Card
  const handleSelectAndBorrow = (unitId) => {
    handleSelectUnit(unitId);
    setActiveTab('borrow');
  };

  // Open single unit QR print modal
  const handlePrintSingleQR = (projector) => {
    setQrModalInitialUnit(projector);
    setIsQRGeneratorOpen(true);
  };

  // Handle QR Scan Detection
  const handleScanSuccess = (unitId) => {
    handleSelectUnit(unitId);
    setActiveTab('borrow');
  };

  const safeProjectors = projectors && projectors.length ? projectors : INITIAL_PROJECTORS;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
          onOpenQRGenerator={() => {
            setQrModalInitialUnit(null);
            setIsQRGeneratorOpen(true);
          }}
          onResetData={handleResetData}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {activeTab === 'borrow' && (
            <BorrowForm
              projectors={safeProjectors}
              selectedUnitId={selectedUnitId}
              teachers={teachers}
              classes={classes}
              onSelectUnit={handleSelectUnit}
              onBorrowSubmit={handleBorrowSubmit}
              onOpenReturnModal={(p) => setReturnModalProjector(p)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
            />
          )}

          {activeTab === 'units' && (
            <UnitStatusCards
              projectors={safeProjectors}
              onSelectAndBorrow={handleSelectAndBorrow}
              onOpenReturnModal={(p) => setReturnModalProjector(p)}
              onOpenUnitDetail={(p) => setDetailModalProjector(p)}
              onPrintSingleQR={handlePrintSingleQR}
              onResolveMaintenance={(id) => storage.resolveUnitMaintenance(id)}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTrailTable
              logs={auditLogs}
              projectors={safeProjectors}
              onSelectUnitForDetail={(p) => setDetailModalProjector(p)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              stats={stats}
              logs={auditLogs}
              projectors={safeProjectors}
            />
          )}

          {activeTab === 'admin' && (
            <AdminMasterView
              projectors={safeProjectors}
              teachers={teachers}
              classes={classes}
              auditLogs={auditLogs}
              stats={stats}
              onPrintQR={handlePrintSingleQR}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="no-print border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              SIMPRO &bull; Sistem Informasi Manajemen Peminjaman & Pelacakan Proyektor Sekolah
            </p>
            <p>
              Entry Point QR Code &bull; Mobile-First PBM &bull; Akuntabilitas Sarana & Prasarana &bull; Panel Admin & Master Data
            </p>
          </div>
        </footer>

        {/* Modals */}
        <ReturnModal
          projector={returnModalProjector}
          isOpen={!!returnModalProjector}
          onClose={() => setReturnModalProjector(null)}
          onConfirmReturn={handleConfirmReturn}
        />

        <QRGeneratorModal
          isOpen={isQRGeneratorOpen}
          onClose={() => setIsQRGeneratorOpen(false)}
          projectors={safeProjectors}
          initialSelectedUnit={qrModalInitialUnit}
        />

        <QRScannerModal
          isOpen={isQRScannerOpen}
          onClose={() => setIsQRScannerOpen(false)}
          projectors={safeProjectors}
          onScanSuccess={handleScanSuccess}
        />

        <UnitDetailModal
          projector={detailModalProjector}
          isOpen={!!detailModalProjector}
          onClose={() => setDetailModalProjector(null)}
          logs={auditLogs}
          onBorrowThisUnit={handleSelectAndBorrow}
          onPrintQR={handlePrintSingleQR}
        />

      </div>
    </ErrorBoundary>
  );
}
