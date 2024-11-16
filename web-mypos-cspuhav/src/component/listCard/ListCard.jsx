import React from "react";
import "./style.css";
import { configs } from "../../util/config";
import { Image, Space, Tag } from "antd";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

export default function ListCard({
  id,
  category_name,
  barcode,
  image,
  name,
  brand,
  description,
  cart_qty,
  price,
  discount,
  status,
  btncloseCartList,
  Pluscartqty,
  Minuscartqty,
}) {
  const finalPrice = discount
    ? (price - (price * discount) / 100).toFixed(2)
    : price;

  return (
    <div>
      <ul style={{ position: "relative" }} className="product-list">
        <CloseOutlined
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: "5px 5px 0px 0px",
            padding: 3,
          }}
          className="CloseOutlined"
          onClick={btncloseCartList}
        />
        <li className="product">
          <div className="image">
            <Image
              preview
              style={{ transform: "scale(1.5)" }}
              src={`${configs.image_Path}${image}`}
              alt={name}
            />
          </div>
          <div className="infor">
            <p style={{ fontWeight: "bold" }}>{name}</p>
            <p style={{ fontWeight: "bold", color: "#606060" }}>
              {brand} | {category_name} | {barcode}
            </p>
            <p style={{}} className="productdescription">
              {description}
            </p>

            {/* <p className="product-barcode">Barcode: </p> */}
            <Space style={{ margin: 0 }} className="product-qty">
              Quantity :
              <Tag color="orange" style={{ marginTop: 0 }}>
                {cart_qty}
              </Tag>
              <p className="product-status" style={{ margin: 0 }}>
                Status : {""}
                {status ? (
                  <Tag style={{ margin: 0 }} color="green">
                    Available
                  </Tag>
                ) : (
                  <Tag style={{ margin: 0 }} color="red">
                    Out of Stock
                  </Tag>
                )}
              </p>
            </Space>

            <Space>
              {discount && discount != 0 ? (
                <Space>
                  <del className="originalprice">{price}$</del>
                  <span className="Discount">-{discount}%</span>
                  <span className="price">{finalPrice}$ /1</span>
                </Space>
              ) : (
                <Space className="finalprice">{price}$</Space>
              )}
            </Space>
          </div>
          <div style={{}}>
            <Space className="priceTotal">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>
                  <Space style={{ color: "#1890ff" }}>Total</Space>
                </div>
                <div>
                  {cart_qty * finalPrice}$/{cart_qty}
                </div>
              </div>
            </Space>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: "5px 5px 0px 0px",
              padding: 3,
            }}
          >
            <Space>
              <PlusOutlined className="PlusOutlined" onClick={Pluscartqty} />
              <Space>{cart_qty}</Space>
              <MinusOutlined className="MinusOutlined" onClick={Minuscartqty} />
            </Space>
          </div>
        </li>
      </ul>
    </div>
  );
}
