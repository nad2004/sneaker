import ProductModel from "../models/product.model.js";
import mongoose from 'mongoose';
export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category ,
            unit,
            stock,
            price,
            discount = 0,
            description,
            more_details,
        } = request.body 

        if(!name || !stock  || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductController = async(request,response)=>{
    try {
        
        let { page = 1, limit = 10, search, minPrice, maxPrice } = request.body;
        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }
        const skip = (page - 1) * limit
        const filters = {
            ...(search && { name: { $regex: search, $options: "i" } }), // Nếu có `search`, thêm bộ lọc $text
            price: { $gte: minPrice || 0, $lte: maxPrice || 100000000000000000000 }, // Điều kiện lọc theo giá
          };
        const [data,totalCount] = await Promise.all([
            ProductModel.find(filters).sort({createdAt : -1 }).skip(skip).limit(limit).populate('category'),
            ProductModel.countDocuments(filters)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async (request, response) => {
    try {
      const { query, minPrice, maxPrice, category, page, limit } = request.body;
  
      if (!query && !category  && !minPrice && !maxPrice) {
        return response.status(400).json({
          message: "Provide at least one filter parameter",
          error: true,
          success: false,
        });
      }
  
      const filters = {
        ...(query && { category: { $in: [new mongoose.Types.ObjectId(query)] } }), 
        price: { $gte: minPrice || 0, $lte: maxPrice || 10000000 },                 
      };
  
      const products = await ProductModel.find(filters)
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalCount = await ProductModel.countDocuments(filters);
  
      return response.json({
        message: "Filtered product list",
        data: products,
        totalNoPage: Math.ceil(totalCount / limit), // Tổng số trang
        error: false,
        success: true,
      });
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };

export const getProductDetails = async(request,response)=>{
    try {
        const { id } = request.body 

        const product = await ProductModel.findOne({ _id : id })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide product id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async (request, response) => {
    try {
        let { search, page, limit } = request.body;

        if (!page) page = 1;
        if (!limit) limit = 10;

        let query = {};
        let sortQuery = {};

        if (search) {
            query = {
                name: { $regex: search, $options: "i" } 
            };
            sortQuery = {
                isMatchStart: -1,
                createdAt: -1
            };
        }

        const skip = (page - 1) * limit;

        const data = await ProductModel.aggregate([
            {
                $match: query
            },
            {
                $addFields: {
                    isMatchStart: { $cond: [{ $regexMatch: { input: "$name", regex: `^${search}`, options: "i" } }, 1, 0] }
                }
            },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit }
        ]);

        const dataCount = await ProductModel.countDocuments(query);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
export const getProductsByCategories = async (request, response) => {
    try {
        const { categoryIds } = request.body; // Nhận danh sách ID danh mục từ request.body

        if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
            return response.status(400).json({
                message: "Provide a valid list of category IDs",
                error: true,
                success: false,
            });
        }

        // Tìm sản phẩm thuộc tất cả các danh mục trong danh sách categoryIds
        const products = await ProductModel.find({
            category: { $all: categoryIds }, // Sử dụng $all để tìm sản phẩm thuộc tất cả danh mục
        }).populate("category"); // Populate để lấy thông tin chi tiết danh mục

        return response.json({
            message: "Filtered products by all categories",
            data: products,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
