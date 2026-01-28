import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create()(
  persist(
    (set) => ({
      // Sidebar state
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Tax Year context
      taxYear: "FY 2024-25",
      setTaxYear: (year) => set({ taxYear: year }),
      taxYearOptions: ["FY 2024-25", "FY 2023-24", "FY 2022-23", "FY 2021-22"],

      // Active client in Client 360
      activeClientId: null,
      setActiveClientId: (clientId) => set({ activeClientId: clientId }),

      // Current consultant (for RLS-ready data isolation)
      consultantId: "consultant_001",
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
      name: "taxplan-app-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        taxYear: state.taxYear,
        tableCompactMode: state.tableCompactMode,
      }),
    }
  )
);
