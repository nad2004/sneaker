import { Menu, MenuProps } from 'react-admin';
import { ShoppingCart,  DoNotStep} from '@mui/icons-material';

const CustomMenu = (props: MenuProps) => {

    
    return (
    
        <Menu {...props} sx={{ '& .RaMenu-root': { paddingLeft: 0 } }}>
          
            <Menu.Item to="/product" primaryText="Products" leftIcon={<DoNotStep />} />
            <Menu.Item to="/order" primaryText="Order" leftIcon={<ShoppingCart />} />
            
        </Menu>
    );
}

export default CustomMenu;