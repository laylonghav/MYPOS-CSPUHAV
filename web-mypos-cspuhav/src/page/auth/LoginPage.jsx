import { Form, Input, Button, Space } from "antd";
import React from "react";
import "./LoginPage.css";
import { request } from "../../util/helper";
import { setAccessToken, setProfile } from "../../store/profile.store";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (item) => {
    // alert(JSON.stringify(item));
    const param = {
      username: item.username, //"laylonghav"
      password: item.password, //"123456" //"1234567"
    };
    const res = await request("auth/login", "post", param);
    if (res && !res.error) {
      setAccessToken(res.access_token);
      setProfile(JSON.stringify(res.profile));
      navigate("/");
    } else {
      alert(JSON.stringify(res));
    }
  };

  return (
    <div>
      <h1>LoginPage</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
        className="FormLogin"
        form={form}
      >
        <Form.Item>
          <label htmlFor="" style={{ textAlign: "center" }}>
            <h2>Login</h2>
          </label>
        </Form.Item>
        <Form.Item name="username" label="Username">
          <Input placeholder="username" />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              LOGIN
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
