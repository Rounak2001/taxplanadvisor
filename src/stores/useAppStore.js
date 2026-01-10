import { useSyncExternalStore } from 'react';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

const identity = (s) => s;

const store = createStore(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Tax Year context
      taxYear: 'FY 2024-25',
      setTaxYear: (year) => set({ taxYear: year }),
      taxYearOptions: ['FY 2024-25', 'FY 2023-24', 'FY 2022-23', 'FY 2021-22'],

      // Active client in Client 360
      activeClientId: null,
      setActiveClientId: (clientId) => set({ activeClientId: clientId }),

      // Current consultant (for RLS-ready data isolation)
      consultantId: 'consultant_001',
      setConsultantId: (id) => set({ consultantId: id }),

      // Table preferences
      tableCompactMode: false,
      toggleTableCompactMode: () => set((state) => ({ tableCompactMode: !state.tableCompactMode })),

      // Command palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      // Call dialer
      dialerOpen: false,
      setDialerOpen: (open) => set({ dialerOpen: open }),
      activeCallClientId: null,
      setActiveCallClientId: (clientId) => set({ activeCallClientId: clientId }),

      // WhatsApp chat
      chatOpen: false,
      setChatOpen: (open) => set({ chatOpen: open }),
      activeChatClientId: null,
      setActiveChatClientId: (clientId) => set({ activeChatClientId: clientId }),
    }),
    {
      name: 'taxplan-app-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        taxYear: state.taxYear,
        tableCompactMode: state.tableCompactMode,
      }),
    }
  )
);

/**
 * React hook wrapper around a vanilla Zustand store.
 * This avoids "Invalid hook call" issues that can occur when a dependency bundles
 * its own React instance.
 */
export function useAppStore(selector = identity) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

// Convenience helpers (Zustand-like API surface)
useAppStore.getState = store.getState;
useAppStore.setState = store.setState;
useAppStore.subscribe = store.subscribe;
