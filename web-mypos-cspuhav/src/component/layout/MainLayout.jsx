import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import logo from "../../assets/Image/Logo/Mylogo.png";
import profile_image from "../../assets/Image/Logo/laylonghav.jpg";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Dropdown,
  Space,
  Badge,
  Drawer,
  Empty,
  notification,
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
  getProfile,
  setAccessToken,
  setProfile,
} from "../../store/profile.store";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
import ListCard from "../listCard/ListCard";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
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
    key: "product",
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
        key: "/category",
        icon: <GroupOutlined />,
        children: null,
        label: "Category",
      },
    ],
  },
  {
    key: "purchase",
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
    key: "expense",
    icon: <ShoppingOutlined />,
    label: "Expense",
    children: [
      {
        key: "expense_type",
        icon: <ShoppingOutlined />,
        children: null,
        label: "Expense Type",
      },
      {
        key: "expense",
        icon: <ShoppingOutlined />,
        children: null,
        label: "Expense",
      },
    ],
  },
  {
    key: "employee",
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
    key: "user",
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
    key: "sitting",
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const profile = getProfile();

  const navigate = useNavigate();
  const {
    count,
    increase,
    decrease,
    config,
    setconfig,
    count_cart,
    list_cart,
    addItemToCart,
    removeItemFromCart,
    decreaseCartItem,
    increaseCartItem,
    clearCart,
    cartSummary,
  } = configStore();

  useEffect(() => {
    getconfigapi();
    if (!profile) {
      navigate("/login");
    }
  }, []);
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
    // Call increaseCartItem action to increase quantity
    increaseCartItem(item);

    // Show success notification after increasing the quantity
    notification.info({
      message: "Success",
      description: `Plus cart !`,
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

  // Function to decrease cart item quantity
  const Minuscartqty = (item) => {
    decreaseCartItem(item);
    if (count_cart != 1) {
      notification.info({
        message: "Success",
        description: `Decrease cart  !`,
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
    } else {
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

  const LOGOUT = () => {
    setProfile("");
    setAccessToken("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

  const showDefaultDrawer = () => {
    setSize("default");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  const clearItemCart = () => {
    clearCart();
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
                  onClick={showDefaultDrawer}
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
                onClose={onClose}
                open={open}
                extra={
                  <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={onClose}>
                      OK
                    </Button>
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
                    <Button type="primary" onClick={showChildrenDrawer}>
                      Summary
                    </Button>
                  </Space>
                ) : (
                  <></>
                )}

                <Drawer
                  title="Summary Cart"
                  width={400}
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
                      <div>{summary.discount_percentage}%</div>
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
                      <div style={{ flexGrow: 1 }}>Price total : </div>
                      <div>{summary.total}$</div>
                    </div>
                  </div>
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
            overflowY: "scroll",
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
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
