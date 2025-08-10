"use client";
import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { FaRegTrashCan } from "react-icons/fa6";

export const ProductInCart = () => {
  //const [loading, setLoaded] = useState(false);
  const updateProductInCart=useCartStore((state)=>state.updateProductQuantity);
  const cart = useCartStore((state) => state.cart)|| [];
  const deleteProduct=useCartStore((state)=>state.deleteProduct);

  /*useEffect(() => {
    setLoaded(true);
  });*/

  if (!cart) {
    return <p>Loading ... </p>;
  }

  return (
    <>
      {/* {productInCart.sort((a, b) => a.slug.localeCompare(b.slug)).map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.images}`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rodunded-none"
          />
          <div>
            <Link className="hover:underline" href={`/product/${product.slug}`}>
              <p>
                {product.size} - {product.title}{" "}
              </p>
            </Link>
            <p>{product.price}</p>
            <div className="flex flex-row space-x-1 items-center">
              <QuantitySelector
                quantity={product.quantity}
                onQuantityUpdated={(quantity) => updateProductInCart(product,quantity)}
              />
              <FaRegTrashCan onClick={()=>deleteProduct(product)}
                className=" text-red-500 hover:text-red-600 cursor-pointer"
                size={25}
              />
            </div>
          </div>
        </div>
      ))} */}
      {cart.length > 0 && cart
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((product) => (
          <div key={product.id} className="flex mb-5">
            <Image
              src={product.image || (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg")}
              width={100}
              height={100}
              alt={product.title}
              className="mr-5 rounded-none object-cover"
            />
            <div>
              <Link className="hover:underline" href={`/product/${product.id}`}>
                <p>
                  {product.title}{" "}
                </p>
              </Link>
              <p>Кол-во: {product.quantity}</p>
              <p>{product.price}$</p>
              <div className="flex flex-row space-x-1 items-center">
                <FaRegTrashCan onClick={() => deleteProduct(product)}
                  className=" text-red-500 hover:text-red-600 cursor-pointer"
                  size={16}
                />
              </div>
            </div>
          </div>
      ))}
    </>
  );
};
