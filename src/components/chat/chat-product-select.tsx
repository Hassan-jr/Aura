"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectProductId, setProductId } from "@/redux/slices/productId";

export function ProductSelect({
  products
  // onSelect,
  // selectedProductDetails,
}) {
  const dispatch = useAppDispatch();
  const selectedProductId = useAppSelector(selectProductId);
  const [selectedProductDetails, setselectedProductDetails] = React.useState(products?.find((product) => product._id === products[0]?._id));

  React.useEffect(() => {
    if (!selectedProductId && products?.length > 0) {
      dispatch(setProductId(products[0]?._id));
      setselectedProductDetails(
        products.find((product) => product._id === products[0]?._id)
      );
    }
  }, [selectedProductId, products]);

  const handleValueChange = (value: string) => {
    console.log("Selected product ID:", value);
    dispatch(setProductId(value));
    setselectedProductDetails(
      products.find((product) => product._id === value)
    );
    // onSelect(value);
  };

  return (
    <Select.Root
      value={selectedProductDetails?._id}
      onValueChange={handleValueChange}
    >
      <Select.Trigger className=" w-full mx-auto inline-flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
        <Select.Value placeholder="Select a product" className="w-full m-0">
          <div className="relative flex items-center rounded-md text-sm text-gray-700 hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none select-none">
            <div className="absolute left-2 inline-flex items-center">
              <Check className="h-4 w-4" />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src="https://r2.nomapos.com/model/hassanjr001%20(1).jpg"
                  alt={selectedProductDetails?.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-md object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 justify-start align-middle items-start">
                <p className="text-sm font-medium text-gray-900">
                  {selectedProductDetails?.title}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {selectedProductDetails?.description?.slice(0, 50)}...
                </p>
                <div className="mt-1 flex items-center">
                  <p className="text-sm font-medium text-gray-900">
                    $
                    {(
                      selectedProductDetails?.price *
                      (1 - selectedProductDetails?.maxDiscountRate / 100)
                    ).toFixed(2)}
                  </p>
                  {selectedProductDetails?.maxDiscountRate > 0 && (
                    <>
                      <p className="ml-2 text-sm text-gray-500 line-through">
                        ${selectedProductDetails?.price.toFixed(2)}
                      </p>
                      <p className="ml-2 text-sm font-medium text-green-600">
                        {selectedProductDetails?.maxDiscountRate}% off
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Select.Value>
        <Select.Icon className="ml-0">
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="relative w-auto mx-auto overflow-hidden rounded-md bg-white shadow-lg">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] w-full bg-white text-gray-700 cursor-default">
            <ChevronUp className="h-4 w-4" />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-2 w-full">
            {products.map((product) => (
              <Select.Item
                key={product._id}
                value={product._id}
                className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none select-none"
              >
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {product.title}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {product.description?.slice(0, 50)}..
                    </p>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        $
                        {(
                          product.price *
                          (1 - product.maxDiscountRate / 100)
                        ).toFixed(2)}
                      </p>
                      {product.maxDiscountRate > 0 && (
                        <>
                          <p className="ml-2 text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="ml-2 text-sm font-medium text-green-600">
                            {product.maxDiscountRate}% off
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Select.ItemText>{product.title}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-gray-700 cursor-default">
            <ChevronDown className="h-4 w-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
