import { notification } from "antd";
import { create } from "zustand";

// import { InfoCircleOutlined } from "@ant-design/icons";
export const configStore = create((set, get) => ({
  open: false, // State for the main drawer
  childrenDrawer: false, // State for the child drawer

  // Actions to toggle drawer states
  setOpen: (isOpen) => set({ open: isOpen }),
  setChildrenDrawer: (isChildrenDrawerOpen) =>
    set({ childrenDrawer: isChildrenDrawerOpen }),
  // Handlers
  holderPrint: () => {}, // Placeholder, should be updated with actual function
  onCheckOutClick: () => {}, // Placeholder for checkout logic
  onCheckCloseDrawer: () => {}, // Placeholder for drawer close logic
  onChildrenDrawerClose: () => {}, // Placeholder for children drawer close

  setOnCheckOutClick: (newHandler) => set({ onCheckOutClick: newHandler }),
  setOnCheckCloseDrawer: (newHandler) =>
    set({ onCheckCloseDrawer: newHandler }),
  setOnChildrenDrawerClose: (newHandler) =>
    set({ onChildrenDrawerClose: newHandler }),
  setHolderPrint: (newHandler) => set({ holderPrint: newHandler }),

  config: {
    category: null, // Corrected spelling from cotegory to category
    role: null,
    supplier: null,
    product: null,
    expense_type: null,
    purchase_status: null,
    brand: null,
    Purchase: null,
    customer: null,
  },

  setconfig: (params) =>
    set((state) => ({
      config: params,
    })),

  inv: {
    customer: null,
    order_no: null,
    order_date: null,
  },

  setInv: (params) =>
    set((state) => ({
      inv: {
        // Update 'inv' state directly
        ...state.inv, // Preserve existing keys and values of 'inv'
        ...params, // Merge new keys and values passed in 'params'
      },
    })),

  globalState: {
    paid_amount: null,
    customer_id: null,
    payment_method: null,
    remark: null,
  },

  setGlobal: (params) =>
    set((state) => ({
      globalState: {
        ...state.globalState, // Preserve existing keys and values
        ...params, // Merge new keys and values
      },
    })),

  count_cart: 0,
  list_cart: [],

  // addItemToCart: (item) =>
  //   set((state) => {
  //     const findIndex = state.list_cart.findIndex(
  //       (row) => row.barcode === item.barcode
  //     );

  //     // Check if adding the item exceeds the available quantity
  //     const maxQty = item.qty; // Assuming `qty` is the available quantity of the item

  //     if (findIndex === -1) {
  //       if (1 <= maxQty) {
  //         notification.info({
  //           message: "Item Added to Cart",
  //           description: `${
  //             item.name || "Item"
  //           } added to your cart successfully!`,

  //           placement: "top",
  //           duration: 2,
  //         });
  //         return {
  //           list_cart: [...state.list_cart, { ...item, cart_qty: 1 }],
  //           count_cart: state.count_cart + 1,
  //         };
  //       } else {
  //         // Show error notification if quantity is unavailable
  //         notification.error({
  //           message: "Error",
  //           description: "Cannot add item. Insufficient quantity available.",

  //           placement: "top",
  //           duration: 3,
  //         });
  //         return state; // No change if quantity is insufficient
  //       }
  //     } else {
  //       const updatedCart = [...state.list_cart];
  //       const currentQty = updatedCart[findIndex].cart_qty;

  //       if (currentQty + 1 <= maxQty) {
  //         updatedCart[findIndex].cart_qty += 1;
  //         return {
  //           list_cart: updatedCart,
  //           count_cart: state.count_cart + 1,
  //         };
  //       } else {
  //         // Show error notification if quantity cannot be increased
  //         notification.error({
  //           message: "Error",
  //           description: "Cannot increase quantity beyond available stock.",
  //           placement: "top",
  //           duration: 3,
  //         });
  //         return state; // No change if quantity is insufficient
  //         // No change if quantity is insufficient
  //       }
  //     }
  //   }),

  // Function to add an item to the cart
  addItemToCart: (item) =>
    set((state) => {
      const findIndex = state.list_cart.findIndex(
        (row) => row.barcode === item.barcode
      );

      const maxQty = item.qty || 0; // Default to 0 if `qty` is undefined

      const showNotification = (type, message, description) => {
        notification[type]({
          message,
          description,
          placement: "top",
          duration: 3,
        });
      };

      // Case 1: Item not in cart
      if (findIndex === -1) {
        if (maxQty >= 1) {
          showNotification(
            "info",
            "Item Added to Cart",
            `${item.name || "Item"} added to your cart successfully!`
          );

          return {
            list_cart: [...state.list_cart, { ...item, cart_qty: 1 }],
            count_cart: state.count_cart + 1,
          };
        } else {
          showNotification(
            "error",
            "Error",
            "Cannot add item. Insufficient quantity available."
          );
          return state; // No change
        }
      }

      // Case 2: Item already in cart
      const updatedCart = [...state.list_cart];
      const currentQty = updatedCart[findIndex].cart_qty;

      if (currentQty + 1 <= maxQty) {
        updatedCart[findIndex].cart_qty += 1;

        showNotification(
          "info",
          "Item Quantity Updated",
          `${item.name || "Item"} quantity updated in your cart!`
        );

        return {
          list_cart: updatedCart,
          count_cart: state.count_cart + 1,
        };
      } else {
        showNotification(
          "error",
          "Error",
          "Cannot increase quantity beyond available stock."
        );
        return state; // No change
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
          // Check if increasing the quantity exceeds the available stock
          const maxQty = itemToIncrease.qty; // Assuming `qty` is available in `itemToIncrease`
          if (cartItem.cart_qty + 1 <= maxQty) {
            // Show success notification
            notification.info({
              message: "Success",
              description: "Item quantity increased!",

              placement: "top",
              duration: 2,
            });

            // Return updated cart item
            return { ...cartItem, cart_qty: cartItem.cart_qty + 1 };
          } else {
            // Handle case when quantity exceeds stock
            notification.error({
              message: "Error",
              description: "Cannot increase quantity beyond available stock.",
              placement: "top",
              duration: 3,
            });
          }
        }
        return cartItem;
      });

      // Only update `count_cart` if the quantity was successfully increased
      const isQuantityIncreased = updatedList.some(
        (cartItem) =>
          cartItem.id === itemToIncrease.id &&
          cartItem.cart_qty >
            state.list_cart.find((c) => c.id === cartItem.id).cart_qty
      );

      return {
        list_cart: updatedList,
        count_cart: isQuantityIncreased
          ? state.count_cart + 1
          : state.count_cart,
      };
    }),

  decreaseCartItem: (itemToDecrease) =>
    set((state) => {
      let itemRemovedCount = 0;
      let showNotification = false; // Flag to track if a notification should be shown

      if (state.count_cart > 0) {
        const updatedList = state.list_cart.map((cartItem) => {
          if (cartItem.id === itemToDecrease.id) {
            if (cartItem.cart_qty > 1) {
              itemRemovedCount = 1;
              showNotification = true; // Set flag to show notification
              return { ...cartItem, cart_qty: cartItem.cart_qty - 1 };
            } else if (cartItem.cart_qty === 1) {
              // If quantity is 1, item is not decreased further
              return cartItem;
            }
          }
          return cartItem;
        });

        // Show success notification if quantity was decreased
        if (showNotification) {
          notification.info({
            message: "Success",
            description: "Item quantity decreased!",
            placement: "top",
            duration: 2,
          });
        }

        return {
          list_cart: updatedList,
          count_cart: state.count_cart - itemRemovedCount,
        };
      }

      // If no items are in the cart, return state without changes
      return state;
    }),

  // Action to clear the cart
  clearCart: () =>
    set(() => ({
      list_cart: [],
      count_cart: 0,
      inv: {
        customer: null,
        order_no: null,
        order_date: null,
      },
    })),

  clearGlobalState: () => {
    console.log("Before clear:", get().globalState); // Log state before clearing
    set(() => ({
      globalState: {
        paid_amount: null,
        customer_id: null,
        payment_method: null,
        remark: "",
      },
    }));
    console.log("After clear:", get().globalState); // Log state after clearing
  },

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
