import React from "react";
import "./styleProductCard.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Badge, Button, Image, Tag } from "antd";
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
      style={discount > 0 ? "" : { display: "none" }}
      color="red"
      text={`Discount ${discount}%`}
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
              <HeartFilled style={{ color: "red" }} />
            ) : (
              <HeartOutlined style={{ color: "gray" }} />
            )}
          </button>
        </div>

        {/* Product Details */}
        <div className="product-info">
          <h2 className="product-name">{name}</h2>
          <p className="product-brand">Brand: {brand}</p>
          <p className="product-category">Category: {category_name}</p>
          <p className="product-barcode">Barcode: {barcode}</p>
          <p className="product-qty">Stock: {qty} units</p>
          <p className="product-status">
            Status:{" "}
            {status ? (
              <Tag color="green">Available</Tag>
            ) : (
              <Tag color="red">Out of Stock</Tag>
            )}
          </p>
          <p className="product-description">{description}</p>

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
