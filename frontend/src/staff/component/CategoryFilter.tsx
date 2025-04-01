import { FilterAlt } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, FormControlLabel, Checkbox, Button, Popover, Typography } from '@mui/material';
import axios from 'axios';
interface CategoryFilterProps {
    setFilters: (filters: any) => void; // Prop từ react-admin để áp dụng bộ lọc
    filters: any; // Danh sách các bộ lọc hiện tại
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({ setFilters, filters }) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    console.log('CategoryFilter rendered');
    // Fetch list of categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post('http://localhost:8080/api/category/get');
                setCategories(response.data?.data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle category selection
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Bỏ chọn nếu đã chọn
                : [...prev, categoryId] // Thêm vào nếu chưa chọn
        );
    };

    // Fetch products by selected category IDs
    const handleFilter = async () => {
        if (selectedCategories.length === 0) return;

        try {
            
            const response = await axios.post('http://localhost:8080/api/product/get-product-by-categories', { categoryIds: selectedCategories });
            setFilters({ ...filters, category: selectedCategories })
            console.log('Filtered products:', response.data.data);
            return response.data.data// Log sản phẩm đã lọc
        } catch (error) {
            console.error('Failed to filter products:', error);
        }
    };

    // Open dropdown
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Close dropdown
    const handleClose = () => {
        setAnchorEl(null);
    };

    const isOpen = Boolean(anchorEl);
    console.log('CategoryFilter rendered');
    return (
        <Box>
            {/* Icon Filter */}
            <Tooltip title="Filter by Category">
                <IconButton onClick={handleOpen} color="primary">
                    <FilterAlt />
                </IconButton>
            </Tooltip>

            {/* Dropdown */}
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: 2, minWidth: 200 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Select Categories
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {categories.map((category) => (
                            <FormControlLabel
                                key={category._id}
                                control={
                                    <Checkbox
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={() => handleCategoryChange(category._id)}
                                    />
                                }
                                label={category.name}
                            />
                        ))}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleFilter();
                            handleClose();
                        }}
                        disabled={selectedCategories.length === 0}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Apply Filter
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
};

export default CategoryFilter;