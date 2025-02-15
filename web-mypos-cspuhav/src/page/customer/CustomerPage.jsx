import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatDateClient, formatDateServer, request } from "../../util/helper";
import "react-slideshow-image/dist/styles.css"; // Import Slider from react-slick
import "./style.css";
import {
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Select,
  message,
  InputNumber,
  Col,
  Row,
  DatePicker,
} from "antd";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";

export default function CustomerPage() {
  //   const { category } = configStore().config;
  //   const {category,role}=config;

  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
  });

  useEffect(() => {
    getlist();
  }, []);

  // State to manage the filter values
  const [filter, setFilter] = useState({
    txtsearch: "",
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      const param = {
        txtsearch: filter.txtsearch,
      };

      // Make the API request
      const res = await request("customer", "get", param);

      // Check if the response is structured as expected and contains the 'list' property
      if (res && res.list && Array.isArray(res.list)) {
        // Update the state with the fetched list
        setState((prev) => ({
          ...prev,
          list: res.list,
        }));
      } else if (res && res.message) {
        // If there's an error message from the server, log it
        console.error("Server response:", res.message);
      } else {
        // Handle unexpected structure if 'list' is missing
        console.error("Unexpected response structure:", res);
      }
    } catch (error) {
      // Catch any network or request-related errors
      console.error("Failed to fetch employee list:", error.message || error);

      // Optional: If you want to log additional error details, you can add this line
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const onClickEdit = async (data) => {
    const { id, name, tel, email, address, type } = data;
    form.setFieldsValue({
      id,
      name,
      tel,
      email,
      address,
      type,
    });

    setState((prevState) => ({
      ...prevState,
      visibleModule: true,
    }));
  };

  const onClickDelete = async (data, index) => {
    // alert(JSON.stringify(data));
    Modal.confirm({
      title: "Remove data",
      content: "Are you to remove ?",
      onOk: async () => {
        const res = await request("customer", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const onClickNew = async () => {
    setState((p) => ({
      ...p,
      visibleModule: true,
    }));
  };

  const oncloseModule = () => {
    setState((p) => ({
      ...p,
      visibleModule: false,
    }));
    getlist();
    form.resetFields();
  };

  const btnFilter = () => {
    getlist();
  };

  const onFinish = async (item) => {
    console.log(item);
    var params = {
      ...item,
      id: form.getFieldValue("id"),
    };

    try {
      var method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("customer", method, params); // Change to "customer"

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
      }
    } catch (error) {
      console.error("Request failed:", error);
      message.error("An unexpected error occurred.");
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
      >
        <Space>
          <div>Employee</div>
          <Input.Search
            allowClear
            onChange={(event) =>
              setFilter((p) => ({
                ...p,
                txtsearch: event.target.value,
              }))
            }
            placeholder="Search"
          />
          <Button onClick={btnFilter} type="primary">
            Filter
          </Button>
        </Space>

        <Button type="primary" icon={<MdAdd />} onClick={onClickNew}>
          New
        </Button>
      </div>
      <h1>{form.getFieldValue("id")}</h1>
      <Modal
        open={state.visibleModule}
        title={form.getFieldValue("id") ? "Edit customer" : "New customer"}
        footer={null}
        onCancel={oncloseModule}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                ]}
                name={"name"}
                label="Name"
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select Card id",
                  },
                ]}
                name={"email"}
                label="Email"
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select tel",
                  },
                ]}
                name={"tel"}
                label="Tel"
              >
                <Input placeholder="Tel" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input type",
                  },
                ]}
                name={"type"}
                label="Type"
              >
                <Input placeholder="Type" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input address",
              },
            ]}
            name={"address"}
            label="Address"
          >
            <Input.TextArea placeholder="Address" />
          </Form.Item>
          <Space>
            <Button onClick={oncloseModule}>Cacel</Button>
            <Button htmlType="submit" type="primary">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        columns={[
          {
            title: "No",
            // dataIndex: "Name",
            key: "No",
            render: (item, data, index) => index + 1,
          },
          {
            title: "name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Tel",
            dataIndex: "tel",
            key: "tel",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Type",
            dataIndex: "type",
            key: "type",
          },
          {
            title: "Create by",
            dataIndex: "create_by",
            key: "create_by",
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Action",
            // dataIndex: "Action",
            align: "center",
            key: "Action",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                ></Button>
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(item, index)}
                ></Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
