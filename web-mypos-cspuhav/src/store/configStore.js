import { create } from "zustand";

export const configStore = create((set, get) => ({
  config: {
    category: null, // Corrected spelling from cotegory to category
    role: null,
    supplier: null,
    product: null,
    purchase_status: null,
    brand: null,
    Purchase: null,
  },
  setconfig: (params) =>
    set((state) => ({
      config: params,
    })),

  count_cart: 0,
  list_cart: [],

  // Action to add an item to the cart
  addItemToCart: (item) =>
    set((state) => {
      const findIndex = state.list_cart.findIndex(
        (row) => row.barcode === item.barcode
      );

      if (findIndex === -1) {
        return {
          list_cart: [...state.list_cart, { ...item, cart_qty: 1 }],
          count_cart: state.count_cart + 1,
        };
      } else {
        const updatedCart = [...state.list_cart];
        updatedCart[findIndex].cart_qty += 1;
        return {
          list_cart: updatedCart,
          count_cart: state.count_cart + 1,
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
              return null;
            }
          }
          return cartItem;
        })
        .filter((item) => item !== null);

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

      if (state.count_cart > 0) {
        const updatedList = state.list_cart.map((cartItem) => {
          if (cartItem.id === itemToDecrease.id) {
            if (cartItem.cart_qty > 1) {
              itemRemovedCount = 1;
              return { ...cartItem, cart_qty: cartItem.cart_qty - 1 };
            } else if (cartItem.cart_qty === 1) {
              return cartItem;
            }
          }
          return cartItem;
        });

        return {
          list_cart: updatedList,
          count_cart: state.count_cart - itemRemovedCount,
        };
      }

      return state;
    }),

  // Action to clear the cart
  clearCart: () =>
    set(() => ({
      list_cart: [],
      count_cart: 0,
    })),

  // Cart summary calculation
  cartSummary: () => {
    const { list_cart } = get();

    let total_qty = 0;
    let sub_total = 0;
    let save_discount = 0;
    let total = 0;
    let original_total = 0;

    list_cart.forEach((item) => {
      total_qty += item.cart_qty;
      let final_price = item.price;

      // Apply discount if it exists
      if (item.discount != null && item.discount !== 0) {
        final_price = item.price - (item.price * item.discount) / 100;
        final_price = parseFloat(final_price.toFixed(2)); // Ensure two decimal places
      }

      original_total += item.cart_qty * item.price;
      sub_total += item.cart_qty * final_price;
    });

    // Apply two decimal places for sub_total and total
    sub_total = parseFloat(sub_total.toFixed(2));

    // Save discount is the difference between the original and discounted total
    save_discount = (original_total - sub_total).toFixed(2);

    // Tax calculation (assuming a tax rate of 10%)
    const tax_rate = 0.1;
    const tax = (sub_total * tax_rate).toFixed(2);

    // Total price after tax
    total = (sub_total + parseFloat(tax)).toFixed(2);

    // Discount total in percentage
    const discount_percentage = (
      (save_discount / original_total) *
      100
    ).toFixed(2);

    return {
      total_qty,
      sub_total,
      save_discount,
      total,
      original_total,
      tax,
      discount_percentage,
    };
  },

  count: 1,
  profile: {},
  list: {},
  loading: false,
  increase: () =>
    set((state) => ({
      count: state.count + 1,
    })),
  decrease: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));
