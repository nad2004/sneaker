import { AppBar, AppBarProps } from 'react-admin';
import { Typography } from '@mui/material';

const CustomAppBar = (props: AppBarProps) => (
    <AppBar {...props}>
        <Typography variant="h6" flex="1" textAlign="left" pl={2}>
            Lucky Larks
        </Typography>
    </AppBar>
);

export default CustomAppBar;