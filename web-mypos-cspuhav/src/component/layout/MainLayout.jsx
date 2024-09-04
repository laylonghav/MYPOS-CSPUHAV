import { Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import logo from "../../assets/Image/Logo/Mylogo.png";
import profile from "../../assets/Image/Logo/laylonghav.jpg";
import React, { useState } from "react";
import { Input } from "antd";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
const { Search } = Input;


import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
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
    key: "employee",
    icon: <PieChartOutlined />,
    children: null,
    label: "Employee",
  },
  {
    key: "customer",
    icon: <PieChartOutlined />,
    children: null,
    label: "Customer",
  },
  {
    key: "product",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "product/category",
        icon: <PieChartOutlined />,
        children: null,
        label: "Category",
      },
      {
        key: "product/stock",
        icon: <PieChartOutlined />,
        children: null,
        label: "Stock",
      },
    ],
    label: "Product",
  },
];
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const OnclickMenu = (item) => {
    navigate(item.key);
  };

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
              <div className="txt-user-name">Lay longhav</div>
              <div className="">Admin</div>
            </div>
            <img className="Profile-User" src={profile} alt="Profile" />
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
