import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
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
  Image,
  Upload,
  Col,
  Row,
} from "antd";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";

export default function ProductPage() {
  //   const { category } = configStore().config;
  //   const {category,role}=config;

  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
  });

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageDefault, setImageDefault] = useState([]);
  const [imageOptional, setImageOptional] = useState([]);

  useEffect(() => {
    getlist();
  }, []);

  const getlist = async () => {
    try {
      setState((p) => ({
        ...p,
        loading: true,
      }));

      const res = await request("category", "get");
      setState((p) => ({
        ...p,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const onClickEdite = (data, index) => {};
  const onClickDelete = async (data, index) => {};

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
    form.resetFields();
  };

  const onFinish = async (item) => {
    console.log(item);
    // id	category_id	barcode	name	brand	description	qty	price	discount	status	image	create_by	create_at

    const params = new FormData();
    params.append("name", item.name);
    params.append("category_id", item.category_id);
    params.append("barcode", item.barcode);//item.barcode
    params.append("brand", item.brand);
    params.append("description", item.description);
    params.append("qty", item.qty);
    params.append("price", item.price);
    params.append("discount", item.discount);
    params.append("status", item.status);

    if (item.image_default) {
      params.append(
        "upload_image",
        item.image_default.file.originFileObj,
        item.image_default.file.originFileObj.name
      );
    } else {
      console.log("Image not provided or file structure is invalid");
    }

    try {
      const res = await request("product", "post", params);
      if (res && !res.error) {
        message.success(res.message)
        oncloseModule();
        // getlist();
      } else {
        message.error(res.error?.barcode);
      }
      console.log(res);
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChangeImageDefailt = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);
  const handleChangeImageOptional = ({ fileList: newFileList }) =>
    setImageOptional(newFileList);

  return (
    <MainPage loading={state.loading}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
        }}
        className=""
      >
        <Space>
          <div>Category</div>
          <Input.Search placeholder="Search" />
          <Select
            style={{ width: 200 }}
            placeholder="Category"
            allowClear
            options={config.category}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Brand"
            allowClear
            options={config.brand}
          />
          <Button type="primary">Filter</Button>
        </Space>

        <Button type="primary" icon={<MdAdd />} onClick={onClickNew}>
          New
        </Button>
      </div>
      <Modal
        open={state.visibleModule}
        title={form.getFieldValue("id") ? "Edit product" : "New product"}
        footer={null}
        onCancel={oncloseModule}
        width={700}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input product name",
                  },
                ]}
                name={"name"}
                label="Product name"
              >
                <Input placeholder="Product name" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select brand",
                  },
                ]}
                name={"brand"}
                label="Brand"
              >
                <Select
                  placeholder="Select brand"
                  options={config?.brand?.map((item) => ({
                    label: item.label + "(" + item.country + ")",
                    value: item.value,
                  }))}
                />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input price",
                  },
                ]}
                name={"price"}
                label="Price"
              >
                <InputNumber style={{ width: "100%" }} placeholder="price" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input discount",
                  },
                ]}
                name={"discount"}
                label="Discount"
              >
                <InputNumber style={{ width: "100%" }} placeholder="Discount" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select category",
                  },
                ]}
                name={"category_id"}
                label="Category"
              >
                <Select
                  placeholder="Select category"
                  options={config?.category}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input barcode",
                  },
                ]}
                name={"barcode"}
                label="Barcode"
              >
                <Input disabled placeholder="Barcode" />
              </Form.Item>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input quantity",
                  },
                ]}
                name={"qty"}
                label="Qusantity"
              >
                <InputNumber style={{ width: "100%" }} placeholder="Quantity" />
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

          <Form.Item name={"description"} label="Description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>

          <Form.Item name={"image_default"} label="Image">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefailt}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <Form.Item name={"image_optional"} label="Image (Optional)">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              multiple={true}
              maxCount={5}
              listType="picture-card"
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
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
            dataIndex: "Name",
            key: "Name",
          },
          {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
          },
          {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
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
                  onClick={() => onClickEdite(data, index)}
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
