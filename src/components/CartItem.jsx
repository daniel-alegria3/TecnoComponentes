import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';

export default function CartItem({ product, quantity }) {
  const navigate = useNavigate();
  const { updateProdFromCart, removeProdFromCart } = useCart();
  const { imageUrls, isImagesLoading } = useProductImages(product?.images_path || []);

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
            onClick={() => updateProdFromCart(product, -1)}
            className="px-2 bg-gray-200 rounded"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => updateProdFromCart(product, +1)}
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
        onClick={() => removeProdFromCart(product)}
        className="ml-4 text-red-500"
      >
        🗑️
      </button>
    </div>
  );
}

