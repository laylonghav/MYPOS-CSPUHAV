import { Form, Input, Button, Space, Spin, Checkbox, Typography } from "antd";
import React, { useState } from "react";
import "./LoginPage.css";
import { request } from "../../util/helper";
import { setAccessToken, setPermission, setProfile } from "../../store/profile.store";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function LoginPage() {
   const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleLogin = async (item) => {
    // alert(JSON.stringify(item));
    const param = {
      username: item.username, //"laylonghav"
      password: item.password, //"123456" //"1234567"
    };
    const res = await request("auth/login", "post", param);
    if (res && !res.error) {
      setAccessToken(res.access_token);
      setProfile(JSON.stringify(res.profile));
      setPermission(JSON.stringify(res.permission));
      navigate("/");
    } else {
      alert(JSON.stringify(res));
    }
  };

  return (
    <div
      className="bg-gray-100 py-10 px-5 rounded-md"
      style={{
        maxWidth: 450,
        margin: "200px auto",
        textAlign: "center",
      }}
    >
      <h2 className="font-bold text-2xl">Login</h2>

      {/* Wrap the Form with a Spin component */}
      <Spin spinning={loading}>
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
          style={{ textAlign: "left" }}
        >
          {/* Username Field */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter your username!" },
              // { type: "email", message: "Please enter a valid email address!" },
            ]}
            // {...validateUser}
          >
            <Input
              allowClear
              prefix={<UserOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
            // {...validatePW}
          >
            <Input.Password
              allowClear
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          {/* Remember Me */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Spin>

      {/* Register Link */}
      <Text>
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-blue-500">
          Register here
        </Link>
      </Text>
    </div>
  );
}
