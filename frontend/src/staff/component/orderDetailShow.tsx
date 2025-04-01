import { useRecordContext, SimpleForm, TextInput, Edit, SelectInput } from 'react-admin';
import axios from 'axios';
import { useState, useEffect } from 'react';

const GenericFormShow = ({ fields }: { fields: any[] }) => {
  const [products, setProducts] = useState<any[]>([]);
  const record = useRecordContext();
console.log(record);
  useEffect(() => {
    if (record) fetchProductDetails();
  }, [record]);

  const fetchProductDetails = async () => {
    try {
        if(!record) return;
      const getProductDetails = record.products.map(async (product: any) => {
        const response = await axios.post(`http://localhost:8080/api/product/get-product-details`, {
          id: product.productId,
        });
        return { ...response.data?.data, quantity: product.quantity};
      });
      setProducts(await Promise.all(getProductDetails));
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
  };

  return (
    <SimpleForm>
      {fields.map((field) => {
        if (field.source === 'id') return null;
        
        if (field.source === 'products') {
          return (
            <div key={field.source} className="mb-8 w-full">
              <h2 className="text-xl font-bold mb-4 text-center ">Product Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg shadow-md overflow-hidden bg-white"
                  >
                    {/* Product Image */}
                    {product.image?.[0] && (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                    )}

                    <div className="p-4">
                      {/* Product Name */}
                      <h3 className="font-semibold text-lg truncate text-black">{product.name || 'Unnamed Product'}</h3>

                      {/* Product Price */}
                      <p className="text-red-500 font-bold text-xl my-1">
                        ${product.price ? product.price.toLocaleString() : '0'}
                      </p>

                      {/* Quantity */}
                      <p className="text-gray-600">Quantity: {product.quantity || 0}</p>

                      {/* Total */}
                      <p className="text-gray-600">
                        Total: ${(product.price * product.quantity).toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        if ( field.source === "payment_status") {
          return (
              <SelectInput
                  key={field.source}
                  source={field.source}
                  label={field.label}
                  choices={[
                      { id: "Pending", name: "Pending" },
                      { id: "Success", name: "Success" },
                  ]}
                  optionText="name"
                  optionValue="id"
              />
          );
        }
          if ( field.source === "delivery_status") {
            return (
                <SelectInput
                      key={field.source}
                      source={field.source}
                      label={field.label}
                      choices={[
                          { id: "Pending", name: "Pending" },
                          { id: "Delivered", name: "Delivered" },
                    ]}
                    optionText="name"
                    optionValue="id"
                />
            );
          }
        return <TextInput key={field.source} source={field.source} label={field.label}  />;
      })}
    </SimpleForm>
  );
};

const OrderShow = ({ resource, fields }: { resource: string; fields: any[] }) => {
  return (
    <Edit resource={resource} actions={false}>
      <GenericFormShow fields={fields} />
    </Edit>
  );
};

export default OrderShow;
