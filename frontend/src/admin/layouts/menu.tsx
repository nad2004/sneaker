import { Menu, MenuProps } from 'react-admin';
import { Home, People, ShoppingCart, Warehouse, DoNotStep, Category} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const CustomMenu = (props: MenuProps) => {

    const navigate = useNavigate();
    return (
    
        <Menu {...props} sx={{ '& .RaMenu-root': { paddingLeft: 0 } }}>
           <Menu.Item 
                to="/dashboard" 
                primaryText="Dashboard" 
                leftIcon={<Home />} 
                onClick={() => navigate('/dashboard')} 
            />
            <Menu.Item to="/product" primaryText="Products" leftIcon={<DoNotStep />} />
            <Menu.Item to="/category" primaryText="Product Categories" leftIcon={<Category />} />
            <Menu.Item to="/user" primaryText="User" leftIcon={<People />} />
            <Menu.Item to="/order" primaryText="Order" leftIcon={<ShoppingCart />} />
            
        </Menu>
    );
}

export default CustomMenu;