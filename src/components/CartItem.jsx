import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useCart } from "../context/CartContext";
import useProductImages from '../composables/useProductImages';
import { useProduct } from "../context/ProductsContext";

export default function CartItem({ producto, productoID, quantity }) {
  let [prod, setProduct] = useProduct(productoID);
  const product = productoID ? prod : producto;

  const navigate = useNavigate();
  const { updateProdFromCart, removeProdFromCart } = useCart();
  const images = useMemo(() => product?.images_path ?? [], [product]);
  const { imageUrls, isImagesLoading } = useProductImages(images);

  const cartItemUpdate = async (amount) => {
    const available_stock = await updateProdFromCart(product, amount);
    if (available_stock != null) {
      if (productoID) {
        setProduct({available_stock: available_stock});
      } else {
        product.available_stock = available_stock;
      }
    }
  };

  const cartItemDrop = async (amount) => {
    const available_stock = await removeProdFromCart(product);
    if (available_stock != null) {
      if (productoID) {
        setProduct({available_stock: available_stock});
      } else {
        product.available_stock = available_stock;
      }
    }
  };

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
            onClick={() => cartItemUpdate(-1)}
            className="px-2 bg-gray-200 rounded"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => cartItemUpdate(+1)}
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
        onClick={() => cartItemDrop()}
        className="ml-4 text-red-500"
      >
        🗑️
      </button>
    </div>
  );
}

