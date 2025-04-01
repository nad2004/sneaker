import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider, TextField, Box, Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import axios from 'axios';
const LeftsideBar = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [categorys, setCategorys] = useState<string[]>([]);
  const navigate = useNavigate();
  const fetchCategorys = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/category/get');
      const data = response.data.data;
      setCategorys([{ name: "Tất cả sản phẩm", id: "" }, ...data.map((category: any) => ({ name: category.name, id: category._id }))]);
    } catch (error) {
      console.error('Error fetching categorys:', error);
    }
  }
  useEffect(() => {
    fetchCategorys();
  },[]);
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
    setSelectedBrand("");
    navigate(`/search-product?${queryParams.toString()}`);
  };

  return (
    <Box className="container mx-auto p-4 mb-2" sx={{ backgroundColor: '#f9f9f9', padding: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Widget price filter
      </Typography>

      {/* Bộ lọc giá */}
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        <TextField
          label="Min price"
          variant="outlined"
          size="small"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          sx={{ width: 100 }}
        />
        <Typography variant="body2">-</Typography>
        <TextField
          label="Max price"
          variant="outlined"
          size="small"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          sx={{ width: 100 }}
        />
      </Box>

      <Slider
        value={priceRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={10000000}
        step={1000}
        color="secondary"
      />

      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        Price: ${priceRange[0]} — ${priceRange[1]}
      </Typography>

      <Button variant="contained" color="secondary" fullWidth onClick={handleFilter}>
        Filter
      </Button>

      {/* Danh mục sản phẩm */}
      <FormControl sx={{ mt: 4 }}>
        <FormLabel>Product Categories</FormLabel>
        <RadioGroup value={selectedBrand} onChange={handleBrandChange}>
          {categorys.map((brand:any) => (
            <FormControlLabel key={brand.id} value={brand.id} control={<Radio />} label={brand.name} />
          ))}
        </RadioGroup>
      </FormControl>

      
     
    </Box>
  );
};

export default LeftsideBar;
