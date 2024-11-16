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
  notification,
} from "antd";
import { MdImageNotSupported } from "react-icons/md";
import { MdAdd, MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import { configs } from "../../util/config";

import { responsiveArray } from "antd/es/_util/responsiveObserver";
import { Content } from "antd/es/layout/layout";
import ProductCard from "../../component/productCard/ProductCard";
import ListCard from "../../component/listCard/ListCard";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function PosPage() {
  //   const { category } = configStore().config;
  //   const {category,role}=config;
  const [settings, setSettings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  const { list_cart, config, addItemToCart, cartSummary } = configStore();
  const summary = cartSummary();

  const [form] = Form.useForm();
  const [state, setState] = useState({
    loading: false,
    visibleModule: false,
    list: [],
    image: [],
    total: [],
  });

  const refPage = React.useRef(1);

  useEffect(() => {
    getlist();
  }, []);

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
        is_list_all: 1,
        // txt_search: filter.txt_search,
        // category_id: filter.category_id,
        // brand: filter.brand,
        // page: filter.page,
      };

      const res = await request("product", "get", param);

      if (res && !res.error && Array.isArray(res.list)) {
        console.log(res.list);
        if (res.list?.length === 1) {
          onAddToBag(res.list[0]);
          return;
        }

        setState((pre) => ({
          ...pre,
          list: res.list,
          total: refPage.current === 1 ? res.total : pre.total,
        }));
      } else {
        r("Unexpected response structure:", res); // Handle unexpected structure
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error); // Catch any request-related errors
    }
  };

  const onAddToBag = (item) => {
    try {
      // Add item to cart
      addItemToCart(item);
      notification.info({
        message: "Item Added to Cart",
        description: `${item.name || "Item"} added to your cart successfully!`,
        icon: (
          <InfoCircleOutlined
            style={{
              color: "#108ee9",
            }}
          />
        ),
        placement: "top",
        duration: 2,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);

      // Display error notification
      notification.error({
        message: "Error",
        description: "There was an error adding the item to the cart.",
        icon: (
          <InfoCircleOutlined
            style={{
              color: "#ff4d4f",
            }}
          />
        ),
        placement: "top",
        duration: 3,
      });
    }
  };

  const onwishlist = (item) => {
    // alert("Hello")
    // alert(JSON.stringify(item));
    handleWishlist(item);
  };

  const btnFilter = () => {
    getlist();
  };

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
      </div>
      <div className="">
        <Row
          gutter={[
            { xs: 2, sm: 4, md: 6, lg: 12, xl: 16 },
            { xs: 2, sm: 4, md: 6, lg: 12, xl: 16 },
          ]}
        >
          {state.list?.map((item, index) => (
            <Col key={index} xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
              <ProductCard
                {...item}
                onAddToBag={() => onAddToBag(item)}
                // onwishlist={() => onwishlist(item)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </MainPage>
  );
}
