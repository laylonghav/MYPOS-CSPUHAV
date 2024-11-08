import { create } from "zustand";

export const configStore = create((set) => ({
  config: {
    category: null, // Corrected spelling from cotegory to category
    role: null,
    supplier: null,
    product: null,
    purchase_status: null,
    brand: null,
    brand: null,
    Purchase: null,
  },
  setconfig: (params) =>
    set((state) => ({
      config: params,
      //    {
      //     ...state.config, // Merge current config with new params
      //     ...params,
      //   },
    })),

  count_cart: 0,
  list_cart: [],

  // Action to add an item to the cart
  addItemToCart: (item) =>
    set((state) => {
      // Check if the item exists in the cart
      const findIndex = state.list_cart.findIndex(
        (row) => row.barcode === item.barcode
      );

      if (findIndex === -1) {
        // Item not found, add new item with quantity 1
        return {
          list_cart: [...state.list_cart, { ...item, cart_qty: 1 }],
          count_cart: state.count_cart + 1, // Increment count when adding new item
        };
      } else {
        // Item found, update the quantity
        const updatedCart = [...state.list_cart];
        updatedCart[findIndex].cart_qty += 1;
        return {
          list_cart: updatedCart,
          count_cart: state.count_cart + 1, // Increment count when quantity increases
        };
      }
    }),
  // Action to remove an item from the cart by index
  removeItemFromCart: (itemToRemove) =>
    set((state) => {
      let itemRemovedCount = 0;

      const updatedList = state.list_cart
        .map((cartItem) => {
          if (cartItem.id === itemToRemove.id) {
            if (cartItem.cart_qty > 1) {
              itemRemovedCount = 1;
              return { ...cartItem, cart_qty: cartItem.cart_qty - 1 };
            } else if (cartItem.cart_qty === 1) {
              itemRemovedCount = 1;
              return null; // Mark item for removal
            }
          }
          return cartItem;
        })
        .filter((item) => item !== null); // Remove null items

      return {
        list_cart: updatedList,
        count_cart: state.count_cart - itemRemovedCount,
      };
    }),

  increaseCartItem: (itemToIncrease) =>
    set((state) => {
      const updatedList = state.list_cart.map((cartItem) => {
        if (cartItem.id === itemToIncrease.id) {
          return { ...cartItem, cart_qty: cartItem.cart_qty + 1 };
        }
        return cartItem;
      });

      return {
        list_cart: updatedList,
        count_cart: state.count_cart + 1,
      };
    }),

  decreaseCartItem: (itemToDecrease) =>
    set((state) => {
      let itemRemovedCount = 0;

      // Only proceed if count_cart > 0
      if (state.count_cart > 0) {
        const updatedList = state.list_cart.map((cartItem) => {
          if (cartItem.id === itemToDecrease.id) {
            // Decrease cart_qty only if it's greater than 1
            if (cartItem.cart_qty > 1) {
              itemRemovedCount = 1;
              return { ...cartItem, cart_qty: cartItem.cart_qty - 1 };
            }
            // If cart_qty is 1, do nothing (keep the item in the cart)
            else if (cartItem.cart_qty === 1) {
              // No changes, just return the item as is
              return cartItem;
            }
          }
          return cartItem;
        });

        return {
          list_cart: updatedList,
          count_cart: state.count_cart - itemRemovedCount, // Decrease count_cart if any item is updated
        };
      }

      // If count_cart is 0, don't proceed
      return state;
    }),

  // Action to clear the cart
  clearCart: () =>
    set(() => ({
      list_cart: [],
      count_cart: 0,
    })),

  count: 1,
  profile: {},
  list: {},
  loading: false,
  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),
  decrease: () =>
    // Corrected spelling from descrease to decrease
    set((state) => ({
      count: state.count - 1,
    })),
}));
