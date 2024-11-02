import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
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
  Image,
  Upload,
  Col,
  Row,
} from "antd";
import { MdImageNotSupported } from "react-icons/md";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";

import { responsiveArray } from "antd/es/_util/responsiveObserver";
import { Content } from "antd/es/layout/layout";

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

  // const getlist = async () => {
  //   try {
  //     var param = {
  //       // ...filter,
  //       txtsearch: filter.txtsearch,
  //       category_id: filter.category_id,
  //       brand: filter.brand,
  //     };
  //     const res = await request("product", "get", param);

  //     if (res && !res.error && Array.isArray(res.list)) {
  //       console.log(res.list); // Log the correct variable 'res.list'
  //       setState((pre) => ({
  //         ...pre,
  //         list: res.list,
  //       }));
  //     } else {
  //       console.error("Unexpected response structure:", res);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch categories:", error);
  //   }
  // };

  // State to manage the filter values
  const [filter, setFilter] = useState({
    txtsearch: "",
    category_id: "",
    brand: "",
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      // Construct the parameters for the request based on the filter
      const param = {
        txtsearch: filter.txtsearch,
        category_id: filter.category_id,
        brand: filter.brand,
      };

      // Make the API request
      const res = await request("product", "get", param);

      // Handle the response if it's successful and res.list is an array
      if (res && !res.error && Array.isArray(res.list)) {
        console.log(res.list); // Log the correct variable 'res.list'

        // Update the state with the fetched list
        setState((pre) => ({
          ...pre,
          list: res.list,
        }));
      } else {
        console.error("Unexpected response structure:", res); // Handle unexpected structure
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error); // Catch any request-related errors
    }
  };

  const onClickEdit = (data, index) => {
    form.setFieldsValue({ ...data });
    setState((p) => ({
      ...p,
      visibleModule: true,
    }));
    if (data.image != "" && data.image != null) {
      const imageproduct = [
        {
          uid: "-1",
          name: data.image,
          status: "done",
          url: configs.image_Path + data.image,
        },
      ];
      setImageDefault(imageproduct);
    }
  };
  const onClickDelete = async (data, index) => {
    // alert(JSON.stringify(data));
    Modal.confirm({
      title: "Remove data",
      content: "Are you to remove ?",
      onOk: async () => {
        const res = await request("product", "delete", data);
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
    setImageDefault([]);
  };
  const btnFilter = () => {
    getlist();
  };


  const onFinish = async (item) => {
    // console.log({
    //   ...item,
    //   id: form.getFieldValue("id"),
    //   image: form.getFieldValue("image"),
    // });
    //   return;
    // id	category_id	barcode	name	brand	description	qty	price	discount	status	image	create_by	create_at

    const params = new FormData();
    params.append("name", item.name);
    params.append("category_id", item.category_id);
    params.append("barcode", item.barcode); //item.barcode
    params.append("brand", item.brand);
    params.append("description", item.description);
    params.append("qty", item.qty);
    params.append("price", item.price);
    params.append("discount", item.discount);
    params.append("status", item.status);

    //when update ,we use to key
    params.append("image", form.getFieldValue("image")); // just name image
    params.append("id", form.getFieldValue("id"));

    if (item.image_default && item.image_default.file.status === "removed") {
      params.append("image_remove", "1");
    } else {
      params.append(
        "upload_image",
        item.image_default.file.originFileObj,
        item.image_default.file.originFileObj.name
      );
      // console.log("Image not provided or file structure is invalid");
    }

    try {
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("product", method, params);
      if (res && !res.error) {
        message.success(res.message);
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
  
  
  // const onFinish = async (item) => {
  //   const params = new FormData();

  //   // Adding product details to params
  //   params.append("name", item.name);
  //   params.append("category_id", item.category_id);
  //   params.append("barcode", item.barcode);
  //   params.append("brand", item.brand);
  //   params.append("description", item.description);
  //   params.append("qty", item.qty);
  //   params.append("price", item.price);
  //   params.append("discount", item.discount);
  //   params.append("status", item.status);

  //   // Set image and id parameters
  //   params.append("image", form.getFieldValue("image")); // Just the name of the image
  //   params.append("id", form.getFieldValue("id"));

  //   // Check if image_default exists and handle accordingly
  //   if (item.image_default) {
  //     if (
  //       item.image_default.file &&
  //       item.image_default.file.status === "removed"
  //     ) {
  //       params.append("image_remove", "1");
  //     } else if (
  //       item.image_default.file &&
  //       item.image_default.file.originFileObj
  //     ) {
  //       // If image is uploaded, append the file object
  //       params.append(
  //         "upload_image",
  //         item.image_default.file.originFileObj,
  //         item.image_default.file.originFileObj.name
  //       );
  //     }
  //   } else {
  //     console.warn("image_default is undefined or null");
  //   }

  //   try {
  //     var method = "post";
  //     if (form.getFieldValue("id")) {
  //       method = "put";
  //     }
  //     const res = await request("product", method, params);

  //     if (res && !res.error) {
  //       message.success(res.message);
  //       oncloseModule();
  //       // getlist();
  //     } else {
  //       message.error(res.error?.barcode);
  //     }
  //     console.log(res);
  //   } catch (error) {
  //     console.error("Request failed", error);
  //   }
  // };


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChangeImageDefault = ({ fileList: newFileList }) =>
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
            placeholder="Category"
            allowClear
            options={config.category}
            onChange={(id) => {
              // alert(id);
              setFilter((p) => ({
                ...p,
                category_id: id,
              }));
            }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Brand"
            allowClear
            options={config.brand}
            onChange={(id) =>
              setFilter((p) => ({
                ...p,
                brand: id,
              }))
            }
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
              maxCount={1}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
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
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Category",
            dataIndex: "category_name",
            key: "category_name",
          },
          {
            title: "Brand",
            dataIndex: "brand",
            key: "brand",
          },
          {
            title: "Barcode",
            dataIndex: "barcode",
            key: "barcode",
          },
          {
            title: "Quantity",
            dataIndex: "qty",
            key: "qty",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "create_by",
            dataIndex: "create_by",
            key: "create_by",
          },
          // {
          //   title: "image",
          //   dataIndex: "image",
          //   key: "image",
          // },
          {
            title: "image",
            dataIndex: "image",
            // key: "image",
            render: (value) =>
              value ? (
                <Image
                className="image_product"
                  style={{
                    // borderRadius: 5,
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    
                  }}
                  src={"http://localhost/fullstack/image_cspuhav/" + value}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: "gray",
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <MdImageNotSupported style={{ fontSize: 70 }} />
                </div>
              ),
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
