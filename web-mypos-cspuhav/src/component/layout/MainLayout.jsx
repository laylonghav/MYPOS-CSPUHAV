import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import logo from "../../assets/Image/Logo/Mylogo.png";
import profile_image from "../../assets/Image/Logo/laylonghav.jpg";
import React, { lazy, useCallback, useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Dropdown,
  Space,
  Badge,
  Drawer,
  Empty,
  notification,
  InputNumber,
  Select,
  message,
} from "antd";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { PiShoppingCart } from "react-icons/pi";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

import {
  DesktopOutlined,
  DollarOutlined,
  DotChartOutlined,
  DownOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  GroupOutlined,
  KeyOutlined,
  OrderedListOutlined,
  PayCircleOutlined,
  PieChartOutlined,
  ProductOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SmileOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import {
  getPermission,
  getProfile,
  setAccessToken,
  setProfile,
} from "../../store/profile.store";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
import ListCard from "../listCard/ListCard";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../PrintInvoice/PrintInvoice";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items_menu = [
  {
    key: "",
    icon: <PieChartOutlined />,
    children: null,
    label: "Dashaboard",
  },
  {
    key: "pos",
    icon: <FundProjectionScreenOutlined />,
    children: null,
    label: "POS",
  },
  {
    key: "customer",
    icon: <TeamOutlined />,
    children: null,
    label: "Customer",
  },
  {
    key: "order",
    icon: <OrderedListOutlined />,
    label: "Order",
    children: null,
  },
  {
    // key: "product",
    icon: <ProductOutlined />,
    label: "Product",
    children: [
      {
        key: "product",
        icon: <ProductOutlined />,
        children: null,
        label: "List Product",
      },
      {
        key: "category",
        icon: <GroupOutlined />,
        children: null,
        label: "Category",
      },
    ],
  },
  {
    // key: "purchase",
    icon: <ShoppingCartOutlined />,
    label: "Purchase",
    children: [
      {
        key: "supplier",
        icon: <TeamOutlined />,
        children: null,
        label: "Supplier",
      },
      {
        key: "purchase",
        icon: <ShoppingCartOutlined />,
        children: null,
        label: "List Purchase",
      },
      {
        key: "purchase_product",
        icon: <DotChartOutlined />,
        children: null,
        label: "Purchase Product",
      },
    ],
  },
  {
    // key: "expense",
    icon: <ShoppingOutlined />,
    label: "Expense",
    children: [
      {
        key: "expanse_type",
        icon: <ShoppingOutlined />,
        children: null,
        label: "Expense Type",
      },
      {
        key: "expanse",
        icon: <ShoppingOutlined />,
        children: null,
        label: "Expense",
      },
    ],
  },
  {
    // key: "employee",
    icon: <TeamOutlined />,
    label: "Employee",
    children: [
      {
        key: "employee",
        icon: <TeamOutlined />,
        children: null,
        label: "Employee",
      },
      {
        key: "payroll",
        icon: <PayCircleOutlined />,
        children: null,
        label: "Payroll",
      },
    ],
  },
  {
    // key: "report_sale_summary",
    icon: <TeamOutlined />,
    label: "Report",
    children: [
      {
        // key: "sale",
        key: "report_sale_summary",
        icon: <TeamOutlined />,
        children: null,
        label: "Sale",
      },
      {
        key: "top_sale",
        icon: <TeamOutlined />,
        children: null,
        label: "Top Sale",
      },
      {
        key: "report_expense_summary",
        icon: <TeamOutlined />,
        children: null,
        label: "Expense",
      },
      // {
      //   key: "purchase",
      //   icon: <TeamOutlined />,
      //   children: null,
      //   label: "Purchase",
      // },
      {
        key: "new_customer",
        icon: <TeamOutlined />,
        children: null,
        label: "New Customer",
      },
      // {
      //   key: "payroll",
      //   icon: <PayCircleOutlined />,
      //   children: null,
      //   label: "Payroll",
      // },
    ],
  },
  {
    // key: "user",
    icon: <UserOutlined />,
    label: "User",
    children: [
      {
        key: "user",
        icon: <UserOutlined />,
        children: null,
        label: "User",
      },
      {
        key: "role",
        icon: <KeyOutlined />,
        children: null,
        label: "Role",
      },
      {
        key: "role_permission",
        icon: <UnlockOutlined />,
        children: null,
        label: "Role Permission",
      },
    ],
  },
  {
    // key: "sitting",
    icon: <SettingOutlined />,
    label: "Sitting",
    children: [
      {
        key: "currency",
        icon: <DollarOutlined />,
        children: null,
        label: "Currency",
      },
      {
        key: "langauge",
        icon: <GlobalOutlined />,
        children: null,
        label: "Langauge",
      },
    ],
  },
];
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const [open2, setOpen2] = useState(false);
  // const [size, setSize] = useState();
  // const [childrenDrawer1, setChildrenDrawer] = useState(false);

  const profile = getProfile();
  const permission = getPermission();

  const navigate = useNavigate();
  const {
    count,
    increase,
    decrease,
    open,
    childrenDrawer,
    config,
    setconfig,
    setOpen,
    setChildrenDrawer,
    count_cart,
    list_cart,
    addItemToCart,
    removeItemFromCart,
    decreaseCartItem,
    increaseCartItem,
    clearCart,
    cartSummary,
    setGlobal,
    clearGlobalState,
    globalState,
    inv,
    setOrder,
  } = configStore();

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

  useEffect(() => {
    getMenuByUser();
    getconfigapi();
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const getMenuByUser = () => {
    let new_item_menu = [];
    // level one
    items_menu?.map((item1) => {
      // is not exist in permission
      const p1 = permission?.findIndex(
        (data1) => data1.web_route_key == "/" + item1.key
      ); // -1 | 0,1`,3.....
      if (p1 != -1) {
        new_item_menu.push(item1);
      }

      // level two
      if (item1?.children && item1?.children.length > 0) {
        let childTmp = [];
        item1?.children.map((data1) => {
          permission?.map((data2) => {
            if (data2.web_route_key == "/" + data1.key) {
              childTmp.push(data1);
            }
          });
        });
        if (childTmp.length > 0) {
          item1.children = childTmp; // update new child dreen
          new_item_menu.push(item1);
        }
      }
    });
    // permission?.map((item)=>{
    // })
    setItems(new_item_menu);
  };

  const getconfigapi = async () => {
    try {
      const res = await request("config", "get");
      console.log(res); // Debugging purposes
      if (res) {
        setconfig(res);
      } else {
        console.error("Config data is missing or invalid.");
      }
    } catch (error) {
      console.error("Failed to fetch config data:", error);
    }
  };

  const OnclickMenu = (item) => {
    navigate(item.key);
    // alert(item.key);
  };

  const btncloseCartList = (item) => {
    // Call removeItemFromCart action
    removeItemFromCart(item);

    // Show success notification after removal
    notification.info({
      message: "Success",
      description: `Remove cart !`,
      icon: (
        <InfoCircleOutlined
          style={{
            color: "#108ee9",
          }}
        />
      ),
      placement: "top",
      duration: 2,
    });
  };

  const summary = cartSummary();

  // Function to increase cart item quantity
  const Pluscartqty = (item) => {
    increaseCartItem(item);
  };

  // Function to decrease cart item quantity
  const Minuscartqty = (item) => {
    decreaseCartItem(item);
    if (!(count_cart != 1)) {
      notification.error({
        message: "Error",
        description: "Can not decrease !",
        icon: (
          <InfoCircleOutlined
            style={{
              color: "#ff4d4f",
            }}
          />
        ),
        placement: "top",
        duration: 3,
      });
    }
  };

  const holderCheckOut = configStore.getState().onCheckOutClick;
  const onClose = configStore.getState().onCheckCloseDrawer;
  const onChildrenDrawerClose = configStore.getState().onChildrenDrawerClose;
  const holderPrint = configStore.getState().holderPrint;

  const LOGOUT = () => {
    setProfile("");
    setAccessToken("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

  const showDefaultDrawer = () => {
    setOpen(true);
    // clearGlobalState();
  };
  const closeDefaultDrawer = () => {
    setOpen(false);
    // clearGlobalState();
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
    // clearGlobalState();
  };

  // const onChildrenDrawerClose = () => {
  //   setChildrenDrawer(false);
  // };
  const clearItemCart = () => {
    clearCart();
    clearGlobalState();
    notification.info({
      message: "Success",
      description: `Cart has been reset!`,
      icon: (
        <InfoCircleOutlined
          style={{
            color: "#108ee9",
          }}
        />
      ),
      placement: "top",
      duration: 2,
    });
  };

  const itemDroptown = [
    {
      key: "1",
      label: "Profile",
    },
    {
      key: "2",
      label: "Change Password",
      icon: <SmileOutlined />,
      // disabled: true,
    },
    {
      key: "logout",
      danger: true,
      label: "LOGOUT",
    },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={OnclickMenu}
        />
      </Sider>
      <Layout>
        {/* <div>
           {permission?.map((item, index) => (
             <div key={index}>
               <div className="">
                 {item.name}:{item.web_route_key}
               </div>
             </div>
           ))}
         </div> */}
        <div className="admin-header">
          <div className="admin-header-g1">
            <div className="">
              <img className="Admin-logo" src={logo} alt="Mylogo" />
            </div>
            <div className="Brand">
              <div className="txt-brand-name">My-POS-CSPUHAV</div>
              <div className="brandName">Computer & Phone Shop</div>
            </div>
            <div className="txtSeach">
              <Search placeholder="input search text" enterButton />
            </div>
          </div>
          <div className="admin-header-g2">
            <Space>
              <Space>
                <Badge
                  showZero
                  count={count_cart}
                  onClick={showDefaultDrawer || setOpen(false)}
                  className="icon-shopping"
                >
                  <PiShoppingCart />
                </Badge>
                <Badge count={8} className="icon-notify">
                  <IoIosNotifications />
                </Badge>
                <Badge count={8} className="icon-email">
                  <MdOutlineMarkEmailUnread />
                </Badge>
              </Space>
              <Drawer
                title={"Product Cart"}
                placement="right"
                // size={size}
                // closable={false}
                width={550}
                onClose={closeDefaultDrawer}
                open={open}
                extra={
                  <Space>
                    {/* <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onClose}>
                      OK
                    </Button> */}
                  </Space>
                }
              >
                <div>
                  {(!list_cart || list_cart.flat().length === 0) && (
                    <Empty description="No items in the cart" />
                  )}
                  {list_cart &&
                    list_cart.flat().length > 0 &&
                    list_cart
                      .flat()
                      .map((item, index) => (
                        <ListCard
                          key={index}
                          {...item}
                          btncloseCartList={() => btncloseCartList(item)}
                          Pluscartqty={() => Pluscartqty(item)}
                          Minuscartqty={() => Minuscartqty(item)}
                        />
                      ))}
                </div>
                {list_cart && list_cart.length > 0 ? (
                  <Space>
                    <Button type="primary" onClick={clearItemCart}>
                      Clear
                    </Button>
                    <Button
                      type="primary"
                      onClick={showChildrenDrawer || setChildrenDrawer(false)}
                    >
                      Summary
                    </Button>
                  </Space>
                ) : (
                  <></>
                )}

                <Drawer
                  title="Summary Cart"
                  width={500}
                  closable={false}
                  onClose={onChildrenDrawerClose}
                  open={childrenDrawer}
                >
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Quantity total : </div>
                      <div>{summary.total_qty}</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        marginTop: 10,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Subtotal : </div>
                      <div>{summary.sub_total}$</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        marginTop: 10,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Discount total : </div>
                      <div>{summary.save_discount}$</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        marginTop: 10,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Original Price total : </div>
                      <div>{summary.original_total}$</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        marginTop: 10,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Tax total : </div>
                      <div>{summary.tax}$</div>
                    </div>
                  </div>
                  <div style={{ borderBottom: "1px solid black" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        marginTop: 10,
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>Discount total (%) : </div>
                      <div>{summary.discount_percentage || 0}% </div>
                    </div>
                  </div>
                  <div className=" pb-2">
                    <div className="flex justify-between mt-2 ">
                      <div className="flex-grow">Price total:</div>
                      <div>{summary.total}$</div>
                    </div>
                  </div>

                  {/* Customer and Payment Method Selection */}
                  <div className="flex flex-row justify-between gap-2 mt-2">
                    <div className="w-1/2">
                      <Select
                        value={globalState.customer_id} // Set value from globalState
                        placeholder="Select customer"
                        options={config.customer}
                        className="w-full"
                        onChange={(value) => setGlobal({ customer_id: value })} // Update customer in globalState
                      />
                    </div>
                    <div className="w-1/2">
                      <Select
                        value={globalState.payment_method} // Set value from globalState
                        placeholder="Select method pay"
                        options={[
                          { label: "Wing", value: "wing" },
                          { label: "ABA", value: "aba" },
                          { label: "ACLEDA", value: "acleda" },
                          { label: "TrueMoney", value: "truemoney" },
                          { label: "Pi Pay", value: "pipay" },
                          { label: "PayGo", value: "paygo" },
                          { label: "PrincePay", value: "princepay" },
                          { label: "Ly Hour Veluy", value: "lyhour" },
                          { label: "AMK Mobile Banking", value: "amk" },
                          { label: "Vattanac Bank", value: "vattanac" },
                          { label: "Canadia Bank", value: "canadia" },
                          { label: "Chip Mong Bank", value: "chipmong" },
                          { label: "E-money", value: "emoney" },
                          { label: "Cambodia Post Bank", value: "cpb" },
                        ]}
                        className="w-full"
                        onChange={(value) =>
                          setGlobal({ payment_method: value })
                        } // Update payment method in globalState
                      />
                    </div>
                  </div>

                  {/* Remark Input */}
                  <div className="mt-2">
                    <Input.TextArea
                      placeholder="Add a remark (optional)"
                      value={globalState.remark} // Set value from globalState
                      onChange={(e) => setGlobal({ remark: e.target.value })} // Update remark in globalState
                      className="w-full"
                    />
                  </div>

                  {/* Paid Amount Input and Checkout Button */}
                  <Space className="flex flex-row justify-between gap-2 mt-2">
                    <div className="flex-grow">
                      <InputNumber
                        placeholder="Amount"
                        value={globalState.paid_amount} // Set value from globalState
                        className="w-full"
                        onChange={(value) => {
                          setGlobal({
                            paid_amount: value,
                          });
                        }}
                      />
                    </div>

                    <Space className="">
                      <Button
                        type="primary"
                        onClick={handlePrint}
                        className="w-full"
                      >
                        Print invoice
                      </Button>
                      <Button
                        type="primary"
                        onClick={holderCheckOut}
                        className="w-full"
                      >
                        Check Out
                      </Button>
                    </Space>
                  </Space>
                </Drawer>
              </Drawer>
              <div className="Lavel_User">
                <div className="txt-user-name">{profile?.name}</div>
                <div className="">{profile?.role_name}</div>
              </div>
              {/* <div className="btnLOGOUT">
              {profile && (
                <Button type="primary" onClick={LOGOUT}>
                  LOGOUT
                </Button>
              )}
            </div> */}
              <Dropdown
                menu={{
                  items: itemDroptown,
                  onClick: (event) => {
                    if (event.key == "logout") {
                      LOGOUT();
                    }
                  },
                }}
              >
                <img
                  className="Profile-User"
                  src={profile_image}
                  alt="Profile"
                />
              </Dropdown>
            </Space>
          </div>
        </div>
        <Content
          className="Admin-body"
          style={{
            margin: "10px",
            overflowY: "auto",
            // height: "calc(100vh - 100px)",
          }}
          sc
        >
          <div
            className="Admin-content"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className="hidden">
              <PrintInvoice
                ref={refInvoice}
                list_cart={list_cart}
                customer={inv.customer}
                order_no={inv.order_no}
                order_date={inv.order_date}
                paid_amount={globalState.paid_amount}
                payment_method={globalState.payment_method}
                total_amount={summary.total}
                remark={globalState.remark}
              />
            </div>
            {/* <h1>{inv.customer + ""}</h1>
            <h1>{inv.order_no + ""}</h1>
            <h1>{inv.order_date + ""}</h1> */}

            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
