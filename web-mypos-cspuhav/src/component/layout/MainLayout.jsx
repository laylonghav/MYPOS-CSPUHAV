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
  DownOutlined,
  FileOutlined,
  PieChartOutlined,
  SmileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import {
  getProfile,
  setAccessToken,
  setProfile,
} from "../../store/profile.store";
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
    icon: <PieChartOutlined />,
    children: null,
    label: "POS",
  },
  {
    key: "customer",
    icon: <PieChartOutlined />,
    children: null,
    label: "Customer",
  },
  {
    key: "order",
    icon: <PieChartOutlined />,
    label: "Order",
    children: null,
  },
  {
    key: "product",
    icon: <PieChartOutlined />,
    label: "Product",
    children: [
      {
        key: "product",
        icon: <PieChartOutlined />,
        children: null,
        label: "List Product",
      },
      {
        key: "product/category",
        icon: <PieChartOutlined />,
        children: null,
        label: "Category",
      },
    ],
  },
  {
    key: "purchase",
    icon: <PieChartOutlined />,
    label: "Purchase",
    children: [
      {
        key: "supplier",
        icon: <PieChartOutlined />,
        children: null,
        label: "Supplier",
      },
      {
        key: "purchase",
        icon: <PieChartOutlined />,
        children: null,
        label: "List Purchase",
      },
      {
        key: "purchase_product",
        icon: <PieChartOutlined />,
        children: null,
        label: "Purchase Product",
      },
    ],
  },
  {
    key: "expanse",
    icon: <PieChartOutlined />,
    label: "Expanse",
    children: [
      {
        key: "expanse_type",
        icon: <PieChartOutlined />,
        children: null,
        label: "Expanse Type",
      },
      {
        key: "expanse",
        icon: <PieChartOutlined />,
        children: null,
        label: "Expanse",
      },
    ],
  },
  {
    key: "employee",
    icon: <PieChartOutlined />,
    label: "Employee",
    children: [
      {
        key: "employee",
        icon: <PieChartOutlined />,
        children: null,
        label: "Employee",
      },
      {
        key: "payroll",
        icon: <PieChartOutlined />,
        children: null,
        label: "Payroll",
      },
    ],
  },
  {
    key: "user",
    icon: <PieChartOutlined />,
    label: "User",
    children: [
      {
        key: "user",
        icon: <PieChartOutlined />,
        children: null,
        label: "User",
      },
      {
        key: "role",
        icon: <PieChartOutlined />,
        children: null,
        label: "Role",
      },
      {
        key: "role_permission",
        icon: <PieChartOutlined />,
        children: null,
        label: "Role Permission",
      },
    ],
  },
  {
    key: "sitting",
    icon: <PieChartOutlined />,
    label: "Sitting",
    children: [
      {
        key: "currency",
        icon: <PieChartOutlined />,
        children: null,
        label: "Currency",
      },
      {
        key: "langauge",
        icon: <PieChartOutlined />,
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
  const profile = getProfile();

  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const OnclickMenu = (item) => {
    navigate(item.key);
    alert(item.key);
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
