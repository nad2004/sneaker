import GenericList from '../component/GenericList';
import { GenericCreate, GenericEdit } from '../component/GenericForm';
import  OrderFormShow  from '../component/orderDetailShow';

const StaffProductList = () => (
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
const StaffProductEdit = () => (
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
const StaffProductCreate = () => (
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


const StaffOrderList = () => (
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
const StaffOrderShow = () => (
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

export { StaffProductList, StaffOrderShow,  StaffProductEdit, StaffProductCreate, StaffOrderList };
