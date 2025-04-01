import { Layout, LayoutProps } from 'react-admin';
import CustomAppBar from './appbar';
import CustomMenu from './menu';

const CustomLayout = (props: LayoutProps) => <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />;

export default CustomLayout;