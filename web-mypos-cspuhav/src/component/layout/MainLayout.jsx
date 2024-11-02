import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import logo from "../../assets/Image/Logo/Mylogo.png";
import profile_image from "../../assets/Image/Logo/laylonghav.jpg";
import React, { useEffect, useState } from "react";
import { Input, Button, Dropdown, Space } from "antd";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
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
  const { count, increase, decrease, config, setconfig } = configStore();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const profile = getProfile();

  const navigate = useNavigate();

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

  const LOGOUT = () => {
    setProfile("");
    setAccessToken("");
    navigate("/login");
  };

  if (!profile) {
    return null;
  }

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
            <MdOutlineMarkEmailUnread className="icon-notify" />
            <IoIosNotifications className="icon-email" />
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
              <img className="Profile-User" src={profile_image} alt="Profile" />
            </Dropdown>
          </div>
        </div>
        <Content
          style={{
            margin: "10px",
          }}
        >
          <div
            className="Admin-body"
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
