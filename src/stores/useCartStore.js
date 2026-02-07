import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create()(
    persist(
        (set, get) => ({
            // Cart items array
            items: [],

            // Add item to cart
            addItem: (item) => {
                const { items } = get();

                // Create unique ID based on service title and variant name
                const itemId = item.variantName
                    ? `${item.category}-${item.title}-${item.variantName}`
                    : `${item.category}-${item.title}`;

                // Check if item already exists
                const exists = items.some(i => i.id === itemId);

                if (!exists) {
                    // Add new item
                    const newItem = {
                        id: itemId,
                        service_id: item.service_id || null, // NEW: Include service_id
                        category: item.category,
                        title: item.title,
                        variantName: item.variantName || null,
                        price: item.price,
                        tat: item.tat,
                        quantity: 1,
                        addedAt: new Date().toISOString(),
                    };
                    set({ items: [...items, newItem] });
                }
            },

            // Remove item from cart
            removeItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },


            // Clear cart
            clearCart: () => set({ items: [] }),

            // Check if item is in cart
            isInCart: (category, title, variantName = null) => {
                const itemId = variantName
                    ? `${category}-${title}-${variantName}`
                    : `${category}-${title}`;
                return get().items.some((item) => item.id === itemId);
            },

            // Get item count
            getItemCount: () => {
                return get().items.length;
            },

            // Get total price
            getTotalPrice: () => {
                return get().items.reduce((total, item) => {
                    const price = typeof item.price === 'number' ? item.price : 0;
                    return total + price;
                }, 0);
            },
        }),
        {
            name: "taxplan-cart-store",
            partialize: (state) => ({
                items: state.items,
            }),
        }
    )
);
