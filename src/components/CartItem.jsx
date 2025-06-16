import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';

export default function CartItem({ product, quantity }) {
  const navigate = useNavigate();
  const { _, setCartItems } = useContext(CartContext);
  const { imageUrls, isImagesLoading } = useProductImages(product?.images_path || []);

  const updateQty = (id, delta) => {
    setCartItems((items) =>
      items
        .map((it) =>
          it.product.id_product === id
            ? { ...it, quantity: Math.max(1, it.quantity + delta) }
            : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((it) => it.product.id_product !== id));
  }

  return (
    <div
      key={product.id_product}
      className="bg-white p-4 rounded-lg shadow flex items-center"
    >
      {isImagesLoading ? (
            <div className="w-32 h-32 border-4 border-dashed rounded-full border-gray-300 animate-spin"></div>
        ) : (
        <img
          src={imageUrls[0]}
          alt={product.name}
          onClick={() => navigate(`/product/${product.id_product}`)}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1 px-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-500 text-sm truncate">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQty(product.id_product, -1)}
            className="px-2 bg-gray-200 rounded"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => updateQty(product.id_product, +1)}
            className="px-2 bg-gray-200 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-700">
          €{product.price}
        </p>
        <p className="font-semibold">
          €{(product.price * quantity).toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => removeItem(product.id_product)}
        className="ml-4 text-red-500"
      >
        🗑️
      </button>
    </div>
  );
}

