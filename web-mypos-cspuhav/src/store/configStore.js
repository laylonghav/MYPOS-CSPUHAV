import { create } from "zustand";

export const configStore = create((set) => ({
  config: {
    category: null, // Corrected spelling from cotegory to category
    role: null,
    supplier: null,
    product: null,
    purchase_status: null,
    brand: null,
  },
  setconfig: (params) =>
    set((state) => ({
      config: params,
      //    {
      //     ...state.config, // Merge current config with new params
      //     ...params,
      //   },
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
