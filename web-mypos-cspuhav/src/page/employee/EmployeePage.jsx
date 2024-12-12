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

export default function EmployeePage() {
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
    position: "",
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      const param = {
        txtsearch: filter.txtsearch,
        position: filter.position,
      };

      // Make the API request
      const res = await request("employee", "get", param);

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
    if (!data || typeof data !== "object") {
      console.error("Invalid data object");
      return;
    }

    const {
      id,
      firstname,
      lastname,
      card_id,
      dob,
      gender,
      tel,
      email,
      base_salary,
      role_id,
      address,
      status,
    } = data;

    // Check if dob is a valid date
    const formattedDob = dob ? moment(dob) : null; // Ensure dob is parsed correctly
    if (formattedDob && !formattedDob.isValid()) {
      console.error("Invalid date:", dob);
    }

    form.setFieldsValue({
      id,
      firstname,
      lastname,
      card_id,
      dob: formattedDob,
      gender,
      tel,
      email,
      base_salary,
      role_id,
      address,
      status,
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
        const res = await request("employee", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const onClickNew = async () => {
    const res = await request("new_barcode", "post");
    if (res && !res.error) {
      form.setFieldValue("barcode", res.barcode);
      setState((p) => ({
        ...p,
        visibleModule: true,
      }));
    }
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
    console.log(item); // Debugging: Log the entire item object

    var params = {
      id: form.getFieldValue("id"),
      firstname: item.firstname,
      lastname: item.lastname,
      card_id: item.card_id,
      dob: formatDateServer(item.dob),
      gender: item.gender,
      tel: item.tel,
      email: item.email,
      base_salary: item.base_salary,
      role_id: item.role_id,
      address: item.address,
      status: item.status,
    };

    try {
      var method = form.getFieldValue("id") ? "put" : "post"; // Use ternary for cleaner code
      const res = await request("employee", method, params);

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
        // getlist(); // Uncomment if you want to refresh the list
      } else {
        console.error(res.error); // Log the entire error for debugging
        message.error(res.error?.barcode || "An error occurred"); // Fallback error message
      }

      console.log(res);
    } catch (error) {
      console.error("Request failed", error);
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
          <Select
            style={{ width: 200 }}
            placeholder="Position"
            allowClear
            options={config.role}
            onChange={(id) => {
              setFilter((p) => ({
                ...p,
                position: id,
              }));
            }}
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
                    message: "Please input first name",
                  },
                ]}
                name={"firstname"}
                label="First name"
              >
                <Input placeholder="First name" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select Card id",
                  },
                ]}
                name={"card_id"}
                label="card_id"
              >
                <Input placeholder="Card id" />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input gender",
                  },
                ]}
                name={"gender"}
                label="Gender"
              >
                <Select
                  placeholder="Select gender"
                  options={[
                    {
                      label: "Male",
                      value: 1,
                    },
                    {
                      label: "Female",
                      value: 0,
                    },
                    {
                      label: "Other",
                      value: null,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input email",
                  },
                ]}
                name={"email"}
                label="Email"
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item name={"role_id"} label="Position">
                <Select placeholder="Select " options={config.role} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select position",
                  },
                ]}
                name={"lastname"}
                label="Last name"
              >
                <Input placeholder="Last name" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input birth date",
                  },
                ]}
                name={"dob"}
                label="dob"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input tel",
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
                    message: "Please input salary",
                  },
                ]}
                name={"base_salary"}
                label="Base salary"
              >
                <Input placeholder="Base salary" />
              </Form.Item>
              <Form.Item name={"status"} label="Status">
                <Select
                  placeholder="Select Status"
                  options={[
                    {
                      label: "Active",
                      value: 1,
                    },
                    {
                      label: "Inactive",
                      value: 0,
                    },
                  ]}
                />
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
            title: "First name",
            dataIndex: "firstname",
            key: "firstname",
          },
          {
            title: "Last name",
            dataIndex: "lastname",
            key: "lastname",
          },
          {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            render: (item, data, index) => (item == 1 ? "Male" : "Female"),
          },
          {
            title: "Birth of date",
            dataIndex: "dob",
            key: "dob",
            render: (value) => formatDateClient(value),
          },
          {
            title: "Card id",
            dataIndex: "card_id",
            key: "card_id",
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
            title: "Salary",
            dataIndex: "base_salary",
            key: "base_salary",
          },
          {
            title: "Position",
            dataIndex: "role_name",
            key: "role_name",
          },
          {
            title: "Address",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (item, data, index) =>
              item == 1 ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              ),
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
                  onClick={() => onClickDelete(data, index)}
                ></Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
