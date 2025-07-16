// "use client";

// import { useRouter } from "next/navigation";
// import { useCartStore } from "@/store";
// import { createOrder } from "@/api";
// import { useForm } from "react-hook-form";
// import clsx from "clsx";
// import { useState } from "react";

// type FormInputs = {
//   phone: string;
//   name: string;
// };

// export default function Checkout() {
//   //TODO ADD TIMER AND ICONS-CHECK-CIRCLE TO THIS PAGE
//   const router = useRouter();
//   const cart = useCartStore((state) => state.cart)|| [];
//   const [order_id, setOrderId] = useState<string | null>(null);

//   const onSubmit = async (data: FormInputs) => {
//     const order = await createOrder({ cart, ...data });
//     setOrderId(order.id);

//     setTimeout(() => {
//       router.push(`/find?order_id=${order.id}`);
//     }, 5000);
//   };

//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isValid },
//   } = useForm<FormInputs>();

//   return (
//     <div className="flex items-center justify-center p-6">
//       {!order_id ? (
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid grid-cols-1 gap-2 border border-slate-200 p-6 rounded-lg w-1/2"
//         >
//           <div className="flex flex-col mb-2">
//             <span>Имя</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("name", { required: "Укажите ваше имя!" })}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Номер</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("phone", { required: "Укажите ваш  номер!" })}
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm">{errors.phone.message}</p>
//             )}
//           </div>

//           {/* <div className="flex flex-col mb-2">
//             <span>Apellidos</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("lastName", { required: "El apellido es obligatorio" })}
//             />
//             {errors.lastName && (
//               <p className="text-red-500 text-sm">{errors.lastName.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Dirección</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("address", { required: "La dirección es obligatoria" })}
//             />
//             {errors.address && (
//               <p className="text-red-500 text-sm">{errors.address.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Dirección 2 (opcional)</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("address2")}
//             />
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Código postal</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("postalCode", {
//                 required: "El código postal es obligatorio",
//               })}
//             />
//             {errors.postalCode && (
//               <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Ciudad</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("city", { required: "La ciudad es obligatoria" })}
//             />
//             {errors.city && (
//               <p className="text-red-500 text-sm">{errors.city.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>País</span>
//             <select
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("country", { required: "El país es obligatorio" })}
//             >
//               <option value="">[ Seleccione ]</option>
//               {country.map((country) => (
//                 <option key={country.id} value={country.id}>
//                   {country.name}
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <p className="text-red-500 text-sm">{errors.country.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col mb-2">
//             <span>Teléfono</span>
//             <input
//               type="text"
//               className="p-2 border border-slate-300 rounded-md"
//               {...register("phone", { required: "El teléfono es obligatorio" })}
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm">{errors.phone.message}</p>
//             )}
//           </div> */}

//           <div className="flex flex-col mb-5 sm:mt-1">
//             {/* <div className="inline-flex items-center mb-10">
//               <label
//                 className="relative flex cursor-pointer items-center rounded-full p-3"
//                 htmlFor="checkbox"
//               >
//                 <input
//                   type="checkbox"
//                   className="h-5 w-5 cursor-pointer rounded-md border border-blue-gray-200 transition-all checked:border-blue-500 checked:bg-blue-500 hover:opacity-80"
//                   id="checkbox"
//                   {...register("rememberAddress")}
//                 />
//               </label>
//               <span>¿Recordar datos?</span>
//             </div> */}

//             <button
//               disabled={!isValid}
//               type="submit"
//               className={clsx({
//                 "btn-primary": isValid,
//                 "btn-disabled": !isValid,
//               })}
//             >
//               Оплатить
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="grid grid-cols-1 gap-2 border border-slate-200 p-6 rounded-lg w-1/2">
//           <h1>Ваш заказ успешно создан, номер: {order_id}</h1>
//           <p>Перенаправляем на страницу отслеживания заказа!</p>
//         </div>
//       )}
//     </div>
//   )
// }


export default function CheckoutPage() {
  return (
    <div className="mb-1">
      <p>Checkout</p>
    </div>
  );
}