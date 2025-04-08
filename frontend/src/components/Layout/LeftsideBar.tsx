import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Slider,
  TextField,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import axios from 'axios';
const LeftsideBar = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [categorys, setCategorys] = useState<{ name: string; id: string }[]>([]);
  const navigate = useNavigate();
  const fetchCategorys = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/category/get');
      const data = response.data.data;
      setCategorys([
        { name: 'Tất cả sản phẩm', id: '' },
        ...data.map((category: any) => ({ name: category.name, id: category._id })),
      ]);
    } catch (error) {
      console.error('Error fetching categorys:', error);
    }
  };
  useEffect(() => {
    fetchCategorys();
  }, []);
  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    const queryParams = new URLSearchParams({
      query: brand !== 'Tất cả sản phẩm' ? brand : '',
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      category: brand,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleFilter = () => {
    const queryParams = new URLSearchParams({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      category: selectedBrand,
    });
    setSelectedBrand('');
    navigate(`/search-product?${queryParams.toString()}`);
  };

  return (
    <Box className="!container !mx-auto !p-4 !bg-gray-100 !rounded-lg !shadow-md">
      {/* Tiêu đề */}
      <Typography variant="h6" className="!font-semibold !mb-4">
        Widget price filter
      </Typography>

      {/* Bộ lọc giá */}
      <Box className="!flex !flex-col !sm:flex-row !items-center !gap-3 !mb-4">
        <TextField
          label="Min price"
          variant="outlined"
          size="small"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          className="!w-full !sm:w-32"
        />
        <span>-</span>
        <TextField
          label="Max price"
          variant="outlined"
          size="small"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          className="!w-full !sm:w-32"
        />
      </Box>

      {/* Slider */}
      <Slider
        value={priceRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={10000000}
        step={1000}
        color="secondary"
        className="!text-purple-600"
      />

      {/* Hiển thị khoảng giá */}
      <Typography className="!text-sm !text-gray-700 !mt-3">
        Price: ${priceRange[0]} — ${priceRange[1]}
      </Typography>

      {/* Nút Filter */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleFilter}
        className="!bg-purple-600 !hover:bg-purple-700 !text-white !mt-3"
      >
        Filter
      </Button>

      {/* Danh mục sản phẩm */}
      <FormControl className="!mt-6">
        <FormLabel className="!font-medium">Product Categories</FormLabel>
        <RadioGroup value={selectedBrand} onChange={handleBrandChange}>
          {categorys.map((brand) => (
            <FormControlLabel
              key={brand.id}
              value={brand.id}
              control={<Radio className="text-purple-600" />}
              label={brand.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default LeftsideBar;
