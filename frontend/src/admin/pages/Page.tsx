import GenericList from '../component/GenericList';
import { GenericCreate, GenericEdit } from '../component/GenericForm';
import  OrderFormShow  from '../component/orderDetailShow';

const ProductList = () => (
    <GenericList
    resource="product"
    title="Product"
    fields={[
        { source: "image", label: "  ", type: "image" }, // Thêm type: "image"
        { source: "name", label: "Products" },
        { source: "price", label: "Price", type: "number" },
        { source: "unit", label: "Unit" },
        { source: "stock", label: "Quantity", type: "number" },
        { source: "category", label: "Brand" },
        
    ]}
/>
);
const ProductEdit = () => (
    <GenericEdit
        resource="product"
        fields={[
            { source: "id", label: "ID" },
            { source: "name", label: "Products" },
            { source: "price", label: "Price" },
            { source: "unit", label: "Unit" },
            { source: "stock", label: "Quantity" },
            { source: "description", label: "Description" },
            { source: "more_details", label: "More Details" },
            { source: "category", label: "Brand" },
        ]}
    />
);
const ProductCreate = () => (
    <GenericCreate
        resource="product"
        fields={[
            { source: "id", label: "ID" },
            { source: "name", label: "Products" },
            { source: "price", label: "Price" },
            { source: "unit", label: "Unit" },
            { source: "stock", label: "Quantity" },
            { source: "description", label: "Description" },
            { source: "more_details", label: "More Details" },
            { source: "category", label: "Brand" },
        ]}
    />
);

const UserList = () => (
    <GenericList
        resource="user"
        title="User"
        fields={[
            { source: "avatar", label: "Avatar", type: "image" },
            { source: "name", label: "Name" },
            { source: "email", label: "Email" },
            { source: "status", label: "Status" },
            { source: "role", label: "Role" },
            { source: "verify_email", label: "Verify Email" },
        ]}
    />
);
const UserEdit = () => (
    <GenericEdit
        resource="user"
        fields={[
            { source: "name", label: "Name" },
            { source: "email", label: "Email" },
            { source: "status", label: "Status" },
            { source: "role", label: "Role" },
        ]}
    />
);
const Category = () => (
    <GenericList
        resource="category"
        title="Categories"
        fields={[
            { source: "name", label: "Category" },
           
        ]}
    />
);
const CategoryEdit = () => (
    <GenericEdit
        resource="category"
        fields={[
            { source: "name", label: "Category" },
        ]}
    />
);
const CategoryCreate = () => (
    <GenericCreate
        resource="category"
        fields={[
            { source: "name", label: "Category" },
        ]}
    />
);
const OrderList = () => (
    <GenericList
        resource="order"
        title="Order"
        fields={[
            { source: "userName", label: "Name"},
            { source: "orderId", label: "OrderId" },
            { source: "createdAt", label: "Ngày Đặt", type: "date" },
            { source: "delivery_address", label: "Địa chỉ giao hàng" },
            { source: "payment_status", label: "Trạng thái thanh toán" },
            { source: "delivery_status", label: "Trạng thái giao hàng" },
        ]}
    />
);
const OrderShow = () => (
    <OrderFormShow
        resource="order"
        fields={[
            { source: "userName", label: "Name"},
            { source: "orderId", label: "OrderId" },
            { source: "createdAt", label: "Ngày Đặt", type: "date" },
            { source: "delivery_address", label: "Địa chỉ giao hàng" },
            { source: "payment_status", label: "Trạng thái thanh toán" },
            { source: "delivery_status", label: "Trạng thái giao hàng" },
            { source: "products", label: "Sản Phẩm", type: "array" },
        ]}
    />
);

export { ProductList, CategoryCreate, CategoryEdit, OrderShow, UserList, UserEdit, Category, ProductEdit, ProductCreate, OrderList };
