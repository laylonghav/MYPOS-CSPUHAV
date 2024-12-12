import React, { useEffect, useState, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { request } from "../../util/helper";
import { Space, Input, Select, Button, Row, Col, message } from "antd";
import MainPage from "../../component/layout/MainPage";
import ProductCard from "../../component/productCard/ProductCard";
import { configStore } from "../../store/configStore";
import PrintInvoice from "../../component/PrintInvoice/PrintInvoice";

export default function PosPage() {
  const [loadingPrint, setLoadingPrint] = useState(false);
  const refInvoice = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: refInvoice, // Reference to PrintInvoice component
    onBeforePrint: useCallback(() => {
      console.log("`onBeforePrint` called");
      return Promise.resolve();
    }, []),
    onAfterPrint: useCallback(() => {
      console.log("`onAfterPrint` called");
    }, []),
    onPrintError: useCallback(() => {
      console.log("`onPrintError` called");
    }, []),
  });

  const {
    list_cart,
    config,
    addItemToCart,
    cartSummary,
    globalState,
    setOpen,
    setChildrenDrawer,
    clearCart,
    clearGlobalState,
    setGlobal,
    setInv,
    inv,
  } = configStore();

  const summary = cartSummary();

  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    // list: [],
    // image: [],
    // total: [],
  });

  const setOnCheckOutClick = configStore((state) => state.setOnCheckOutClick);
  const setOnCheckCloseDrawer = configStore(
    (state) => state.setOnCheckCloseDrawer
  );
  const setOnChildrenDrawerClose = configStore(
    (state) => state.setOnChildrenDrawerClose
  );
  const setHolderPrint = configStore((state) => state.setHolderPrint);
  var res;

  useEffect(() => {
    if (inv && inv.order_no) {
      handlePrint(); // Trigger print when inv is populated
    }
  }, [inv]);

  useEffect(() => {
    getlist();

    setOnCheckCloseDrawer(() => {
      setOpen(false);
    });

    setOnChildrenDrawerClose(() => {
      setChildrenDrawer(false);
    });

    setOnCheckOutClick(async () => {
      try {
        let order_detail = list_cart.map((item) => {
          let total = Number(item.cart_qty) * Number(item.price);
          if (item.discount != null && item.discount !== 0) {
            total -= (total * Number(item.discount)) / 100;
          }
          return {
            product_id: Number(item.id),
            qty: Number(item.cart_qty).toFixed(0),
            price: Number(item.price).toFixed(2),
            discount:
              item.discount != null ? Number(item.discount).toFixed(2) : null,
            total: Number(total).toFixed(2),
          };
        });

        // Prepare order parameters
        const param = {
          order: {
            customer_id: globalState.customer_id,
            total_amount: summary.total,
            paid_amount: globalState.paid_amount,
            payment_method: globalState.payment_method,
            remark: globalState.remark,
          },
          order_detail: order_detail,
        };
        // handlePrint();
        // console.log(param);

        // API call for order creation
        res = await request("order", "post", param);

        if (res) {
          await setInv({
            order_no: res.order?.order_no,
            order_date: res.order?.create_at,
            customer: res.customer?.name,
          });
          console.log("_______________TESTING_________2_________");
          console.log(inv.customer);
          console.log(inv.order_no);
          console.log(inv.order_date);

          getlist();
          message.success("Order created successfully !");
          clearCart();
          clearGlobalState();
          setOpen(false);
          setChildrenDrawer(false);
        } else {
          message.error("Order not completed!");
        }
      } catch (error) {
        message.error("Error while creating order: " + error.message);
      } // Trigger the Order function on checkout click
    });
  }, [
    list_cart,
    summary.total,
    globalState,
    setOpen,
    setChildrenDrawer,
    setHolderPrint,
    setOnCheckOutClick,
    setOnCheckCloseDrawer,
    setGlobal,
    loadingPrint,
  ]);

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  // const Order =

  const getlist = async () => {
    try {
      const param = { ...filter, is_list_all: 1 };
      const res = await request("product", "get", param);

      if (res && !res.error && Array.isArray(res.list)) {
        if (res.list.length === 1) {
          // Automatically add the item to the cart if only one item is returned
          addItemToCart(res.list[0]);
        } else {
          setState((prev) => ({ ...prev, list: res.list }));
        }
      } else {
        console.error("Unexpected response structure:", res);
      }
    } catch (error) {
      console.error("Failed to fetch product list:", error);
    }
  };

  const onAddToBag = (item) => {
    try {
      addItemToCart(item);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const btnFilter = () => {
    getlist();
  };

  return (
    <MainPage loading={state.loading}>
      <div className="hidden">
        <Button onClick={handlePrint}>Print Invoice</Button>
        <PrintInvoice
          ref={refInvoice}
          list_cart={list_cart}
          customer={inv.customer || "No customer"}
          order_no={inv.order_no || "No order number"}
          order_date={inv.order_date || "No order date"}
          paid_amount={globalState.paid_amount}
          payment_method={globalState.payment_method}
          total_amount={summary.total}
          remark={globalState.remark}
        />
      </div>
      {/* <h1>{inv.customer}</h1>
      <h1>{inv.order_no}</h1>
      <h1>{inv.order_date}</h1> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <Space>
          <div>Pos {state.total}</div>
          <Input.Search
            onSearch={getlist}
            allowClear
            onChange={(e) =>
              setFilter({ ...filter, txt_search: e.target.value })
            }
            placeholder="Search"
          />
          <Select
            style={{ width: 200 }}
            placeholder="Category"
            allowClear
            options={config.category}
            onChange={(id) => setFilter({ ...filter, category_id: id })}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Brand"
            allowClear
            options={config.brand}
            onChange={(id) => setFilter({ ...filter, brand: id })}
          />
          <Button onClick={btnFilter} type="primary">
            Filter
          </Button>
        </Space>
      </div>

      <div>
        <Row gutter={[16, 16]}>
          {state.list?.map((item, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
              <ProductCard {...item} onAddToBag={() => onAddToBag(item)} />
            </Col>
          ))}
        </Row>
      </div>
    </MainPage>
  );
}
