import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Image,
  Typography,
  Tooltip,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { request } from "../../util/helper";

const { Text } = Typography;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [validate, setValidate] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (value.length > 8 && /[A-Z]/.test(value) && /\d/.test(value)) {
      setPasswordStrength("Strong");
    } else if (value.length > 5) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish1 = async (values) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("type", null);
    if (values.image && values.image.file) {
      formData.append("image", values.image.file.originFileObj);
    }
    const res = await request("register", "post", formData);
    if (res && !res.error) {
      message.success("Create account successfully.");
      navigate("/login");
    } else {
      message.error("Create account fail.");
    }
  };

  const onFinish = async (values) => {
    // console.log(values);
    // return;
    setLoading(true); // Start loading
    try {
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.password_confirmation);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("type", values.type);
      if (values.image && values.image.file) {
        formData.append("image", values.image.file.originFileObj);
      }

      // Register the user
      const registerRes = await request("register", "post", formData);

      if (registerRes.errors) {
        // message.error(res.message);
        console.log("Error obj :", registerRes);
        setValidate(registerRes.errors);
        setLoading(false); // Stop loading
      }

      if (registerRes && !registerRes.errors) {
        message.success("Account created successfully!");

        // Automatically log in the user after successful registration
        const loginParams = {
          email: values.email,
          password: values.password,
        };

        const loginRes = await request("login", "post", loginParams);

        if (loginRes && !loginRes.errors) {
          // Set the user profile and access token
          setAccessToken(loginRes.access_token);
          setProfile(loginRes.user);

          message.success("Logged in successfully!");
          navigate("/"); // Redirect to the homepage
        } else {
          message.error(
            "Account created, but login failed. Please log in manually."
          );
          navigate("/login"); // Redirect to the login page if login fails
        }
      } else {
        message.error("Failed to create account. Please try again.");
      }
    } catch (error) {
      // Handle unexpected errors
      message.error(
        "An error occurred. Please check your connection or try again."
      );
      console.error("Error during registration or login:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const validatePasswordStrength = (value) => {
    if (!value) return Promise.resolve(); // Ignore empty value

    // Corrected condition to check if passwordStrength is not 'Medium' or 'Strong'
    if (
      passwordStrength &&
      passwordStrength !== "Medium" &&
      passwordStrength !== "Strong"
    ) {
      return Promise.reject(
        new Error(`Password strength: ${passwordStrength}`)
      );
    }

    // If password is Medium or Strong, return success
    return Promise.resolve();
  };

  return (
    <div
      className="bg-gray-100 p-8 rounded-md"
      style={{
        maxWidth: 650,
        margin: "100px auto",
        textAlign: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Spin spinning={loading}>
        <Typography.Title level={2} style={{ fontWeight: "bold" }}>
          Register
        </Typography.Title>
        <Form
          className="mt-6"
          name="register"
          onFinish={onFinish}
          layout="vertical"
          style={{ textAlign: "left" }}
        >
          <Row gutter={16}>
            {/* Email */}
            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Email is required!" },
                  { type: "email", message: "Enter a valid email address!" },
                ]}
                {...validate.email}
              >
                <Input
                  allowClear
                  prefix={<MailOutlined />}
                  placeholder="user@example.com"
                  aria-label="Email"
                />
              </Form.Item>
            </Col>

            {/* Username */}
            <Col span={12}>
              <Form.Item
                label="Username"
                name="name"
                rules={[{ required: true, message: "Username is required!" }]}
                {...validate.name}
              >
                <Input
                  allowClear
                  prefix={<UserOutlined />}
                  placeholder="Choose a username"
                  aria-label="Username"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Password */}
            <Col span={12} className="mb-4">
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password is required!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                  // { validator: (_, value) => validatePasswordStrength(value) },
                ]}
                {...validate.password}
              >
                <Input.Password
                  allowClear
                  prefix={<LockOutlined />}
                  placeholder="Create a password"
                  aria-label="Password"
                  onChange={handlePasswordChange}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* Confirm Password */}
              <Form.Item
                label="Confirm Password"
                name="password_confirmation"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
                {...validate.password_confirmation}
              >
                <Input.Password
                  allowClear
                  prefix={<LockOutlined />}
                  placeholder="Re-enter password"
                  aria-label="Confirm Password"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Phone */}
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                // rules={[{ required: true, message: "Phone number is required!" }]}
              >
                <Input
                  allowClear
                  prefix={<PhoneOutlined />}
                  placeholder="092456789"
                  aria-label="Phone"
                />
              </Form.Item>
            </Col>
            {/* Type */}
            <Col span={12}>
              <Form.Item
                label="User Type"
                name="type"
                rules={
                  [
                    // { required: true, message: "Please select a user type!" },
                  ]
                }
              >
                <Select
                  allowClear
                  placeholder="User or Admin?"
                  aria-label="User Type"
                >
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="user">SYSTEM</Select.Option>
                  <Select.Option value="admin">GENERAL</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Address */}

          <Form.Item
            label="Home Address"
            name="address"
            // rules={[{ required: true, message: "Address is required!" }]}
          >
            <Input
              allowClear
              prefix={<HomeOutlined />}
              placeholder="Your address"
              aria-label="Address"
            />
          </Form.Item>

          {/* Profile Image */}
          <Form.Item
            label="Profile Picture (Optional)"
            name="image"
            {...validate.image}
          >
            <Upload
              customRequest={(e) => {
                e.onSuccess();
              }}
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
          <Image
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={previewImage}
            style={{ display: "none" }}
          />

          {/* Submit Button */}
          <Form.Item className="m-0 p-0">
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      <Text>
        Already have an account?{" "}
        <Link to="/login" className="font-bold underline">
          Login here
        </Link>
      </Text>
    </div>
  );
};

export default RegisterPage;
