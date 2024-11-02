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
  Col,
  Row,
  DatePicker,
  InputNumber,
} from "antd";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";

export default function ExpensePage() {
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
    expense_type: "",
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      const param = {
        txtsearch: filter.txtsearch,
        expense_type: filter.expense_type,
      };

      // Make the API request
      const res = await request("expense", "get", param);

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
    const { id, expense_type_id, ref_no, name, amount, remark, expense_date } =
      data;

    // Check if dob is a valid date
    const formatted_expense_date = expense_date ? moment(expense_date) : null; // Ensure expense_date is parsed correctly
    if (formatted_expense_date && !formatted_expense_date.isValid()) {
      console.error("Invalid date:", expense_date);
    }

    form.setFieldsValue({
      id,
      expense_type_id,
      ref_no,
      name,
      amount,
      remark,
      expense_date: formatted_expense_date,
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
        const res = await request("expense", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const onClickNew = async () => {
    const res = await request("newRef_no", "post");
    if (res && !res.error) {
      form.setFieldValue("ref_no", res.ref_no);
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

    // Ensure necessary fields are present
    if (!item.expense_date) {
      message.error("Expense date is required");
      return;
    }
    //  id	expense_type_id	ref_no	name	amount	remark	expense_date
    var params = {
      id: form.getFieldValue("id"),
      expense_type_id: item.expense_type_id,
      ref_no: item.ref_no,
      name: item.name,
      amount: item.amount,
      remark: item.remark,
      expense_date: formatDateServer(item.expense_date),
    };

    try {
      var method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("expense", method, params);

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
        // getlist(); // Uncomment if you want to refresh the list
      } else {
        console.error(res.error); // Log the entire error for debugging
        message.error(res.error?.ref_no || "An error occurred"); // Fallback error message
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
          <div>Expense type</div>
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
            placeholder="Expense type"
            allowClear
            options={config.expense_type}
            onChange={(id) => {
              setFilter((p) => ({
                ...p,
                expense_type: id,
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
          {/* id expense_type_id ref_no name amount remark expense_date */}
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
                message: "Please input ref_no",
              },
            ]}
            name={"ref_no"}
            label="Reference Number"
          >
            <Input disabled placeholder="Ref no" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select expense type",
              },
            ]}
            name={"expense_type_id"}
            label="Expense type"
          >
            <Select
              placeholder="Select expense type"
              options={config.expense_type}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}
            name={"amount"}
            label="Amount"
          >
            <InputNumber style={{ width: "100%" }} placeholder="Amount" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select remark",
              },
            ]}
            name={"remark"}
            label="Remark"
          >
            <Input placeholder="Remark" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input expense date",
              },
            ]}
            name={"expense_date"}
            label="Expense date"
          >
            <DatePicker style={{ width: "100%" }} />
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
            title: "Name",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Expense type",
            dataIndex: "expense_name",
            key: "expense_name",
          },
          {
            title: "Reference Number",
            dataIndex: "ref_no",
            key: "ref_no",
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
          },
          {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
          },

          {
            title: "Expense date",
            dataIndex: "expense_date",
            key: "expense_date",
            render: (value) => formatDateClient(value),
          },
          {
            title: "Create by",
            dataIndex: "create_by",
            key: "create_by",
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
