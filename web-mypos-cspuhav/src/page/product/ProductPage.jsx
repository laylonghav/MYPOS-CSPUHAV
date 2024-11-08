import React, { useEffect, useState } from "react";
import { request } from "../../util/helper";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css"; // Import Slider from react-slick
import ViewSlider from "react-view-slider";
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
  Carousel,
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
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  const { config } = configStore();
  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
    image: [],
    total: [],
  });

  const refPage = React.useRef(1);

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
  const [imageOptional_Old, setImageOptional_Old] = useState([]);

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
    txt_search: "",
    category_id: "",
    brand: "",
  });

  // Function to fetch the list based on the filter
  const getlist = async () => {
    try {
      // Construct the parameters for the request based on the filter
      var param = {
        ...filter,
        page: refPage.current, // get value
        // txt_search: filter.txt_search,
        // category_id: filter.category_id,
        // brand: filter.brand,
        // page: filter.page,
      };

      // Make the API request
      const res = await request("product", "get", param);

      // Handle the response if it's successful and res.list is an array
      if (res && !res.error && Array.isArray(res.list)) {
        console.log(res.list); // Log the correct variable 'res.list'

        // Update the state with the fetched list
        // setState((pre) => ({
        //   ...pre,
        //   list: res.list,
        //   image: res.products,
        //   total: res.total,
        // }));

        setState((pre) => ({
          ...pre,
          list: res.list,
          total: refPage.current === 1 ? res.total : pre.total,
        }));
      } else {  r("Unexpected response structure:", res); // Handle unexpected structure
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error); // Catch any request-related errors
    }
  };

  const onClickEdit = async (data, index) => {
    form.setFieldsValue({ ...data });
    setState((p) => ({
      ...p,
      visibleModule: true,
    }));

    // Handle primary image
    if (data.image && data.image !== "") {
      const imageproduct = [
        {
          uid: "-1",
          name: data.image,
          status: "done",
          url: configs.image_Path + data.image,
        },
      ];
      setImageDefault(imageproduct);
    } else {
      setImageDefault([]); // Clear if no image
    }

    // Handle optional images
    // if (data.product_image && data.product_image.length > 0) {
    //   const imageproduct_optional = data.product_image.map((image, index) => ({
    //     uid: index.toString(), // Unique UID for each optional image
    //     name: image,
    //     status: "done",
    //     url: configs.image_Path + image,
    //   }));
    //   setImageOptional(imageproduct_optional);
    // } else {
    //   setImageOptional([]); // Clear if no optional images
    // }

    // Handle optional images
    // if (data.product_image && data.product_image.length > 0) {
      try {
        const res_image = await request("product_image/" + data.id, "get");
        if (res_image && !res_image.error && res_image.list) {
          const imageProductOptional = res_image.list.map((item, index) => ({
            uid: index.toString(), // Ensure uid is a unique string
            name: item.image,
            status: "done",
            url: configs.image_Path + item.image,
          }));
          setImageOptional(imageProductOptional);
          setImageOptional_Old(imageProductOptional);
        } else {
          setImageOptional([]); // Clear if no optional images from response
        }
      } catch (error) {
        console.error("Error fetching optional images:", error);
        setImageOptional([]);
      }
    // } else {
    //   setImageOptional([]); // Clear if no optional images
    // }
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
    setImageOptional([]);
  };
  const btnFilter = () => {
    getlist();
  };

  // const onFinish = async (item) => {
  //   // console.log({
  //   //   ...item,
  //   //   id: form.getFieldValue("id"),
  //   //   image: form.getFieldValue("image"),
  //   // });
  //   //   return;
  //   // id	category_id	barcode	name	brand	description	qty	price	discount	status	image	create_by	create_at

  //   const params = new FormData();
  //   params.append("name", item.name);
  //   params.append("category_id", item.category_id);
  //   params.append("barcode", item.barcode); //item.barcode
  //   params.append("brand", item.brand);
  //   params.append("description", item.description);
  //   params.append("qty", item.qty);
  //   params.append("price", item.price);
  //   params.append("discount", item.discount);
  //   params.append("status", item.status);

  //   //when update ,we use to key
  //   params.append("image", form.getFieldValue("image")); // just name image
  //   params.append("id", form.getFieldValue("id"));

  //   if (item.image_default && item.image_default.file.status === "removed") {
  //     params.append("image_remove", "1");
  //   } else {
  //     params.append(
  //       "upload_image",
  //       item.image_default.file?.originFileObj,
  //       item.image_default.file.originFileObj.name
  //     );
  //     // console.log("Image not provided or file structure is invalid");
  //   }
  //   if (item.image_optional) {
  //     // console.log(item.image_optional);
  //     item.image_optional.fileList?.map((items, index) => {
  //       params.append(
  //         "upload_image_optional",
  //         items.originFileObj,
  //         items.name
  //       );
  //     });
  //   }
  //   // return;

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

  const onFinish = async (item) => {
    // Log the item to inspect its structure
    console.log(item); // Debugging: Log the entire item object
    var imageoption = [];
    if (imageOptional_Old.length > 0 && item.image_optional) {
      imageOptional_Old.map((item1, index1) => {
        var isfound = false;
        if (item.image_optional && item.image_optional.fileList) {
          item.image_optional.fileList.forEach((file) => {
            if (item1.name === file.name) {
              isfound = true;
            }
          });
        }
        if (isfound === false) {
          imageoption.push(item1.name);
        }
        // imageoption.push({ ...item1, isfound: isfound });
      });
    }
    // console.log(imageoption)

    // return;

    const params = new FormData();
    params.append("name", item.name);
    params.append("category_id", item.category_id);
    params.append("barcode", item.barcode);
    params.append("brand", item.brand);
    params.append("description", item.description);
    params.append("qty", item.qty);
    params.append("price", item.price);
    params.append("discount", item.discount);
    params.append("status", item.status);

    // When updating, we use the key
    params.append("image", form.getFieldValue("image")); // Just name image
    params.append("id", form.getFieldValue("id"));
    params.append("product_image", form.getFieldValue("product_image"));
    if (imageoption && imageoption.length > 0) {
      // image for remove
      imageoption.map((item_image) => {
        params.append("image_optional", item_image);
        // console.log(item_image);
      });
    }

    // return
    // console.log("product_image : ", form.getFieldValue("product_image"));

    // Append images to "image_lt" array in FormData

    // Check if image_default exists and has a file property
    if (item.image_default && item.image_default.file) {
      if (item.image_default.file.status === "removed") {
        params.append("image_remove", "1");
      } else {
        params.append(
          "upload_image",
          item.image_default.file.originFileObj,
          item.image_default.file.originFileObj.name
        );
      }
    } else {
      console.error(
        "Image default is not provided or file structure is invalid"
      );
    }

    // Check if image_optional exists and has fileList
    if (item.image_optional && item.image_optional.fileList) {
      item.image_optional.fileList.forEach((files) => {
        if (files.originFileObj) {
          params.append(
            "upload_image_optional",
            files.originFileObj,
            files.name
          );
        } else {
          console.error("Origin file object is missing in image optional");
        }
      });
    } else {
      console.error("Image optional is not provided or fileList is invalid");
    }

    // if (item.image_optional && item.image_optional.file) {
    //   const { file } = item.image_optional;
    //   if (file.status === "removed") {
    //     params.append("remove_image_optional", file.name);
    //     console.log("remove_image_optional", file.name);
    //   }
    // }

    try {
      var method = "post";
      if (form.getFieldValue("id")) {
        method = "put";
      }
      const res = await request("product", method, params);
      if (res && !res.error) {
        message.success(res.message);
        oncloseModule();
        getlist();
      } else {
        message.error(res.error?.barcode);
      }
      console.log(res);
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  // const onFinish = async (item) => {
  //   // Log the item to inspect its structure
  //   console.log(item); // Debugging: Log the entire item object

  //   // Collect images to remove
  //   const imageoption = [];
  //   if (
  //     imageOptional_Old &&
  //     imageOptional_Old.length > 0 &&
  //     item.image_optional
  //   ) {
  //     imageOptional_Old.forEach((oldImage) => {
  //       let isFound = false;
  //       if (item.image_optional.fileList) {
  //         item.image_optional.fileList.forEach((file) => {
  //           if (oldImage.name === file.name) {
  //             isFound = true;
  //           }
  //         });
  //       }
  //       if (!isFound) {
  //         imageoption.push(oldImage.name);
  //       }
  //     });
  //   }

  //   const params = new FormData();
  //   // Append basic product data
  //   params.append("name", item.name);
  //   params.append("category_id", item.category_id);
  //   params.append("barcode", item.barcode);
  //   params.append("brand", item.brand);
  //   params.append("description", item.description);
  //   params.append("qty", item.qty);
  //   params.append("price", item.price);
  //   params.append("discount", item.discount);
  //   params.append("status", item.status);

  //   // Handle primary image (existing or new upload)
  //   params.append("image", form.getFieldValue("image"));
  //   params.append("id", form.getFieldValue("id"));
  //   params.append("product_image", form.getFieldValue("product_image"));

  //   // Append images to remove if any
  //   if (imageoption.length > 0) {
  //     imageoption.forEach((imageName) => {
  //       params.append("image_optional", imageName);
  //     });
  //   }

  //   // Check and append the main image if provided
  //   if (item.image_default && item.image_default.file) {
  //     if (item.image_default.file.status === "removed") {
  //       params.append("image_remove", "1");
  //     } else {
  //       params.append(
  //         "upload_image",
  //         item.image_default.file.originFileObj,
  //         item.image_default.file.originFileObj.name
  //       );
  //     }
  //   } else {
  //     console.error("Image default is not provided or file structure is invalid");
  //   }

  //   // Append optional images if they exist
  //   if (item.image_optional && item.image_optional.fileList) {
  //     item.image_optional.fileList.forEach((file) => {
  //       if (file.originFileObj) {
  //         params.append("upload_image_optional", file.originFileObj, file.name);
  //       } else {
  //         console.error("Origin file object is missing in image optional");
  //       }
  //     });
  //   } else {
  //     console.error("Image optional is not provided or fileList is invalid");
  //   }

  //   try {
  //     const method = form.getFieldValue("id") ? "put" : "post";
  //     const res = await request("product", method, params);
  //     if (res && !res.error) {
  //       message.success(res.message);
  //       oncloseModule();
  //       getlist(); // Uncomment if needed to refresh the list
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
          <div>Category {state.total}</div>
          <Input.Search
          onSearch={getlist}
            allowClear
            onChange={(event) =>
              setFilter((p) => ({
                ...p,
                txt_search: event.target.value,
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
              maxCount={4}
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
        pagination={{
          pageSize: 5,
          total: state.total,
          onChange: (page) => {
            // setFilter((pre) => ({ ...pre, page: page }));
            refPage.current = page;
            getlist();
          },
        }}
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
          //   dataIndex: "product_image",
          //   key: "product_image",
          // },

          // {
          //   title: "Images",
          //   dataIndex: "product_image", // Ensure this matches your data structure
          //   key: "product_image",
          //   render: (images) => {
          //     // If images is a single string, wrap it in an array
          //     const imageArray = Array.isArray(images) ? images : [images];

          //     return (
          //       <div
          //         style={{
          //           width: "150px",
          //           height: "100px",
          //           overflow: "hidden",
          //         }}
          //       >
          //         {imageArray && imageArray.length > 0 ? (
          //           <Carousel
          //             autoplaySpeed={4000}
          //             arrows
          //             waitForAnimate={true}
          //             autoplay
          //           >
          //             {imageArray.map((image, index) => (
          //               <div
          //                 key={index}
          //                 style={{
          //                   // position: "relative",
          //                   height: "150px",
          //                   width: "100px",
          //                 }}
          //               >
          //                 <div
          //                   style={{
          //                     backgroundImage: `url(http://localhost/fullstack/image_cspuhav/${image})`,
          //                     width: "150px",
          //                     height: "100px",
          //                     backgroundSize: "cover",
          //                     borderRadius: "10px", // Optional: Add border radius for aesthetics
          //                   }}
          //                 />
          //               </div>
          //             ))}
          //           </Carousel>
          //         ) : (
          //           <div
          //             style={{
          //               backgroundColor: "gray",
          //               width: "150px",
          //               height: "100px",
          //               display: "flex",
          //               justifyContent: "center",
          //               alignItems: "center",
          //               borderRadius: 10,
          //               overflow: "hidden",
          //             }}
          //           >
          //             <MdImageNotSupported style={{ fontSize: 70 }} />
          //           </div>
          //         )}
          //       </div>
          //     );
          //   },
          // },
          {
            title: "image",
            dataIndex: "image",
            // key: "image",
            render: (value) =>
              value ? (
                <div
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  className="hover-image"
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={"http://localhost/fullstack/image_cspuhav/" + value}
                  />
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "gray",
                    height: "100px",
                    width: "150px",
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
