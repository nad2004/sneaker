import axios from 'axios';
import { DataProvider } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";


const apiUrl = "http://localhost:8080/api";
const fetchCategoryName = async (categoryId: string) => {
    try {
        
        const response = await axios.post(`${apiUrl}/category/get-category-detail`,  { id: categoryId } );
     
        return response.data?.data?.name || "Unknown Category";
    } catch (error) {
        console.error(`Failed to fetch category name for ${categoryId}`, error);
        return "Unknown Category";
    }
};
const fetchUserName = async (UserId: string) => {
    try {
        
        const response = await axios.post(`${apiUrl}/user/get-user-details`,  { id: UserId } );
     
        return response.data?.data?.name || "Unknown user";
    } catch (error) {
        console.error(`Failed to fetch user name for ${UserId}`, error);
        return "Unknown user";
    }
};
const fetchGetList = async (resource: string, params: any) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const url = `${apiUrl}/${resource}/get`;

    try {
        const response = await axios.post(url, { page, limit: perPage });
        const json = response.data;

        let customData;

        if (resource === "product") {
            customData = await Promise.all(
                json.data.map(async (item: any) => {
                    const categoryIds = item.category || [];
                    const categoryNames = await Promise.all(
                        categoryIds.map((item: any) => item.name)
                    );
                    return {
                        ...item,
                        id: item._id || item.id || String(Math.random()), // Ensure id always exists
                        category: categoryNames,
                    };
                })
            );
        } else if(resource === "order"){
            customData = await Promise.all(
                json.data.map(async (item: any) => {
                    const userId = item.userId || null;
                    const userName = await fetchUserName(userId);
                    return {
                        ...item,
                        id: item._id || item.id || String(Math.random()), // Ensure id always exists
                        userName: userName,
                    };
                })
            );
            console.log(customData);
        } else {
            customData = json.data.map((item: any) => ({
                ...item,
                id: item._id || item.id || String(Math.random()), // Ensure id always exists
            }));
        }
        return {
            data: customData,
            total: json.totalCount || customData.length,
            pagination: { page, perPage },
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

const searchProduct = async (resource: string, params: any) => {
    const { filter = {}, pagination = {} } = params;
    const { q = "" } = filter;
    const { page = 1, perPage = 10 } = pagination;

    if (!q) {
        return { data: [], total: 0, pagination: { page, perPage } };
    }

    try {
        const response = await axios.post(`${apiUrl}/${resource}/search-product`, {
            search: q, page, limit: perPage
        });
        const json = response.data;
        let dataWithCategoryNames;
        if (resource === "product") {
            // Chỉ xử lý category nếu resource là "product"
            dataWithCategoryNames = await Promise.all(
                json.data.map(async (item: any) => {
                    const categoryIds = item.category || [];
                    const categoryNames = await Promise.all(
                        categoryIds.map((item: any) => fetchCategoryName(item))
                    );
                    // console.log(categoryNames);
                    return {
                        ...item,
                        id: item._id || item.id,
                        category: categoryNames,
                    };
                })
            );
        } else {
            // Nếu không phải "product", giữ nguyên dữ liệu
            dataWithCategoryNames = json.data.map((item: any) => ({
                ...item,
                id: item._id || item.id,
            }));
        };
        return {
            data: dataWithCategoryNames,
            total: json.totalCount,
            pagination: { page, perPage },
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to search products");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

const fetchGetOne = async (resource: string, params: any) => {
   
    try {
        
        console.log(`${apiUrl}/${resource}/get-${resource}-details`);
        let customData;
        const response = await axios.post(`${apiUrl}/${resource}/get-${resource}-details`, { id: params.id });
        const json = response.data;
        if (resource === "order") {
            const item = json.data;
            const userId = item.userId || null;
            const userName = await fetchUserName(userId);
            customData = {
                ...item,
                id: item._id || item.id, // Ensure id always exists
                userName: userName,
            };
        } else {
            customData = {id: json.data._id || json.data.id, ...json.data};
        }
        console.log(customData);
        return { data: customData};
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch resource");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}
const customDataProvider: DataProvider = {
    ...simpleRestProvider(apiUrl),

    getList: async (resource, params) => {
        return params.filter?.q ? searchProduct(resource, params) : fetchGetList(resource, params);
      
    },

    getOne: async (resource, params) => {
       return  fetchGetOne(resource, params);
    },

    create: async (resource, params) => {
        console.log(params.data);
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(`${apiUrl}/${resource}/create`, 
                { ...params.data, image: [] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { data: { ...response.data, id: response.data._id || response.data.id } };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to create resource");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },

    update: async (resource, params) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.put(
                `${apiUrl}/${resource}/update-${resource}-details`, 
                { _id: params.id, ...params.data },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = await axios.post(`${apiUrl}/${resource}/get-${resource}-details`, { id: params.id });
            return { data: { ...updated.data.data, id: updated.data.data._id || response.data.id } };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to update resource");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },

    delete: async (resource, params) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.delete(
                `${apiUrl}/${resource}/delete`, 
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    data: { _id: params.id }
                }
            );
            return { data: { id: params.id } };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to delete resource");
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    },
};

export default customDataProvider;