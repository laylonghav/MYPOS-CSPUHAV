import React, { useEffect, useState } from "react";
import moment from "moment";
import { formatDateClient, formatDateServer, request } from "../../util/helper";
import "./style.css";
import {
  Space,
  Table,
  Button,
  Modal,
  Input,
  Form,
  Select,
  message,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";


export default function PurchaseProductPage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
  });

  const [filter, setFilter] = useState({
    txtsearch: "",
    status: "",
  });

  useEffect(() => {
    getlist();
  }, [filter]);

  const getlist = async () => {
    try {
      //  const param = {
      //    txtsearch: filter.txtsearch,
      //    supplier: filter.supplier,
      //    status: filter.status,
      //  };
      const res = await request("purchase_product", "get", filter);

      if (res && res.list && Array.isArray(res.list)) {
        setState((prev) => ({
          ...prev,
          list: res.list,
        }));
      } else if (res && res.message) {
        console.error("Server response:", res.message);
      }
    } catch (error) {
      console.error("Failed to fetch list:", error.message || error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const onClickEdit = async (data) => {
    const {
      id,
      purchase_id,
      product_id,
      qty,
      cost,
      discount,
      amount,
      retail_price,
      remark,
      status,
    } = data;

    form.setFieldsValue({
      id,
      purchase_id,
      product_id,
      qty,
      cost,
      discount,
      amount,
      retail_price,
      remark,
      status,
    });

    setState((prevState) => ({
      ...prevState,
      visibleModule: true,
    }));
  };

  const onClickDelete = (data) => {
    Modal.confirm({
      title: "Remove data",
      content: "Are you sure you want to remove?",
      onOk: async () => {
        const res = await request("purchase_product", "delete", data);
        if (res && !res.error) {
          message.success(res.message);
          getlist();
        }
      },
    });
  };

  const onClickNew = async () => {
    setState((prev) => ({
      ...prev,
      visibleModule: true,
    }));
  };

  const oncloseModule = () => {
    setState((prev) => ({
      ...prev,
      visibleModule: false,
    }));
    getlist();
    form.resetFields();
  };

  const onFinish = async (item) => {
    console.log(item);

    // return
    const params = {
      ...item,
      id: form.getFieldValue("id"),
    };

    try {
      const method = form.getFieldValue("id") ? "put" : "post";
      const res = await request("purchase_product", method, params);

      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
      } else {
        message.error("An error occurred");
      }
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
          <div>Purchase product</div>
          <Input.Search
            onSearch={getlist}
            allowClear
            onChange={(event) =>
              setFilter((prev) => ({ ...prev, txtsearch: event.target.value }))
            }
            placeholder="Search"
          />
          <Select
            style={{ width: 200 }}
            placeholder="Purchase status"
            allowClear
            options={config.purchase_status}
            onChange={(id) => setFilter((prev) => ({ ...prev, status: id }))}
          />
          <Button onClick={getlist} type="primary">
            Filter
          </Button>
        </Space>
        <Button type="primary" icon={<MdAdd />} onClick={onClickNew}>
          New
        </Button>
      </div>

      <Modal
        open={state.visibleModule}
        title={
          form.getFieldValue("id")
            ? "Edit purchase product"
            : "New purchase product"
        }
        footer={null}
        onCancel={oncloseModule}
        width={600}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="purchase_id"
                label="Purchase"
                rules={[{ required: true, message: "Please select supplier" }]}
              >
                <Select
                  allowClear
                  placeholder="Purchase"
                  options={config?.Purchase?.map((item) => ({
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Change to HomeOutlined if BuildingOutlined is unavailable */}
                        <span>
                          {item.label} ({" "}
                          <HomeOutlined style={{ marginRight: 8 }} />{" "}
                          {item.ship_company || "No company"}
                          <span style={{ marginLeft: 8 }}>
                            <UserOutlined style={{ marginRight: 4 }} />
                            {item.supplier_name}
                          </span>
                          )
                        </span>
                      </div>
                    ),
                    value: item.value,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="product_id"
                label="Product"
                rules={[{ required: true }]}
              >
                <Select
                  allowClear
                  placeholder="Product"
                  options={config.product}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="qty"
                label="Quantity"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Quantity" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cost" label="Cost" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} placeholder="Cost" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="discount"
                label="Discount"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Discount" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} placeholder="Amount" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="retail_price"
                label="Retail price"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Retail price"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select placeholder="Status" options={config.purchase_status} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="remark"
                label="Remark"
                rules={[{ required: true }]}
              >
                <Input placeholder="Remark" />
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Button onClick={oncloseModule}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              {form.getFieldValue("id") ? "Update" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        rowKey={(record) => record.id} // Ensure each row has a unique key
        dataSource={state.list}
        columns={[
          {
            title: "No",
            key: "No",
            render: (text, record, index) => index + 1,
          },
          {
            title: "Purchase",
            dataIndex: "purchase_name",
            key: "purchase_name",
          },
          {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
          },
          { title: "Quantity", dataIndex: "qty", key: "qty" },
          { title: "Cost", dataIndex: "cost", key: "cost" },

          { title: "Discount", dataIndex: "discount", key: "discount" },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
          },
          {
            title: "Retail price",
            dataIndex: "retail_price",
            key: "retail_price",
          },
          {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
          },
          { title: "Status", dataIndex: "status", key: "status" },
          { title: "Create by", dataIndex: "create_by", key: "create_by" },
          {
            title: "Action",
            key: "Action",
            render: (text, record, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(record)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(record)}
                />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}
