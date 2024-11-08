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
            <p style={{ fontWeight: "bold" }}>
              {name} | {brand} | {category_name}
            </p>
            <p className="product-description">{description}</p>
            <Space>
              <p className="product-barcode">Barcode: {barcode}</p>
              <p className="product-qty">
                Quantity:{" "}
                <Tag color="orange" style={{ fontSize: "1.2rem" }}>
                  {cart_qty}
                </Tag>{" "}
              </p>
            </Space>
            <Space>
              {discount && discount != 0 ? (
                <Space>
                  <del className="originalprice">{price}$</del>
                  <span className="Discount">-{discount}%</span>
                </Space>
              ) : (
                <Space className="finalprice">{price}$</Space>
              )}
              <Space>
                <p className="product-status">
                  {" "}
                  Status:{" "}
                  {status ? (
                    <Tag color="green">Available</Tag>
                  ) : (
                    <Tag color="red">Out of Stock</Tag>
                  )}
                </p>
              </Space>
            </Space>
          </div>
          <div>
            <Space className="price">{finalPrice}$</Space>
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
