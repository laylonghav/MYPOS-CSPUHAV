import React from "react";
import "./styleProductCard.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Badge, Button, Image, Space, Tag } from "antd";
import { configs } from "../../util/config";

const ProductCard = ({
  barcode,
  brand,
  category_name,
  description,
  discount,
  id,
  image,
  name,
  price,
  qty,
  status,
  wishlist,
  onAddToBag,
}) => {
  // Calculate the discounted price
  const finalPrice = discount
    ? (price - (price * discount) / 100).toFixed(2)
    : price;

  return (
    <Badge.Ribbon
      style={discount > 0 ? { fontSize: "1rem" } : { display: "none" }}
      color="#1890ff"
      size="middle"
      text={`Save ${discount}%`}
    >
      <article className="product-card">
        {/* Product Image and Wishlist Icon */}
        <div className="product-image">
          <Image
            src={`${configs.image_Path}${image}`}
            alt={name}
            loading="lazy"
            className="product-image-content"
          />
          <button
            className="wishlist-icon"
            onClick={() => onWishlistToggle(id)}
            aria-label="Toggle Wishlist"
          >
            {wishlist ? (
              <HeartFilled style={{ color: "orange" }} />
            ) : (
              <HeartOutlined style={{ color: "orange" }} />
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="product-info">
          <h2 className="product-name">{name}</h2>
          <h2>
            <Space>
              <span className="product-brand">
                {brand} | {category_name} | {barcode}
              </span>
              {/* <span className="product-category"></span> */}
            </Space>
          </h2>

          <p className="description">{description}</p>

          {/* <p className="product-barcode">Barcode: </p> */}
          <Space>
            <p className="product-qty">
              Stock : <Tag color="blue"> {status ? qty : 0 }</Tag>
            </p>
            <p className="product-status">
              Status : {""}
              {status ? (
                <Tag color="green">Available</Tag>
              ) : (
                <Tag color="red">Out of Stock</Tag>
              )}
            </p>
          </Space>

          {/* <p className="product-description">{description}</p> */}

          {/* Price Details */}
          <div className="price-container">
            {discount && discount != 0 ? (
              <>
                <del className="original-price">{price}$</del>
                <span className="discount">{discount}%</span>
                <span className="final-price">{finalPrice}$</span>
              </>
            ) : (
              <span className="final-price">{price}$</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="add-to-cart-button"
            type="primary"
            onClick={() => onAddToBag(id)}
            disabled={!status}
          >
            Add to Cart
          </Button>
        </div>
      </article>
    </Badge.Ribbon>
  );
};

export default ProductCard;
