import { Create, Edit, SimpleForm, SelectArrayInput, SelectInput, FunctionField, useNotify, useRefresh,  useRecordContext, TextInput, NumberInput, useRedirect, Button } from 'react-admin';
import { Card, CardContent, IconButton} from '@mui/material';
import { useState, useEffect } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const fetchCategories = async () => {
    try {
        const response = await axios.post("http://localhost:8080/api/category/get");
        return response.data?.data || [];
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
};
const GenericForm = ({ fields, resource }: { fields: any[]; resource: string }) => {
    const [categories, setCategories] = useState<any[]>([]);
    useEffect(() => {
        if (resource === "product") {
            const loadCategories = async () => {
                const data = await fetchCategories();
                setCategories(data.map((category: any) => ({ id: category._id, name: category.name })));
            };
            loadCategories();
        }
    }, [resource]);
    
    return (
        <>
            <SimpleForm>
                {fields.map((field) => {
                    if (field.source === "id") return null;

                    // Hiển thị SelectArrayInput cho category nếu resource là product
                    if (resource === "product" && field.source === "category") {
                        return (
                            <SelectArrayInput
                                key={field.source}
                                source={field.source}
                                label={field.label}
                                choices={categories}
                                optionText="name"
                                optionValue="id"
                            />
                        );
                    }

                    if (field.type === "number") {
                        return <NumberInput key={field.source} source={field.source} label={field.label} />;
                    }

                    return <TextInput key={field.source} source={field.source} label={field.label} />;
                })}

                {/* Hiển thị ImageUploadField nếu resource là product */}
                {resource === "product" && <FunctionField style={{ width: "100%" }} render={() => <ImageUploadField   />} />}
            </SimpleForm>
        </>
    );
};
    const ImageUploadField = () => {
        const record = useRecordContext();
        const notify = useNotify();
        const refresh = useRefresh();
        const [images, setImages] = useState<string[]>([]);; 
        if (!record) return null;
        useEffect(() => {  
                setImages(record?.image|| []);
                
        }, [record]);
        const handleRemoveImage = (index: number) => {
            setImages((prev) => prev.filter((_, i) => i !== index));
        };
        
        const handleUpload = async (event: any) => {
            const file = event.target.files[0];
            if (!file) return;
        
            
            if (!record?._id) {
                notify("Error: Missing product ID", { type: "error" });
                return;
            }
            const formData = new FormData();
            formData.append("image", file);
            formData.append("productId", record._id); // ✅ Thêm productId vào formData
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.post(
                    "http://localhost:8080/api/file/upload",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
                );
        
                console.log("Upload response:", response.data);
        
                if (response.data.success) {
                    setImages((prev) => [...prev, response.data.data.image]); // ✅ Cập nhật danh sách ảnh
                    notify("Image uploaded successfully", { type: "success" });
                } else {
                    notify("Upload failed", { type: "error" });
                }
            } catch (error) {
                notify("Upload error", { type: "error" });
                console.error(error);
            }
        };
        const handleSave = () => {
            
            // xử lý dữ liệu đây
            
            notify('Images updated successfully', { type: 'success' });
            refresh();
        };
    
        return (
            <div style={{ marginTop: 20}}>
                    <>
                        {/* Hiển thị ảnh hiện có với nút X */}
                        {images ? (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {images.map((url: string, index: number) => (
                                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                        <img src={url} alt={`image-${index}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            size="small"
                                            style={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                background: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                borderRadius: '50%',
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span>No images available</span>
                        )}
                     {/* Upload ảnh mới */}
                     <label className="flex w-1/12 items-center gap-2 px-4 py-2 my-4 border border-gray-500 rounded-lg text-gray-300 cursor-pointer hover:bg-gray-800 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                            />
                        </svg>
                        Upload a file
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                        </label>
                    </>
            </div>
        );
    };
    
// Component Create với nút "Back" ở góc trên trái
export const GenericCreate = ({ resource, fields }: { resource: string; fields: any[] }) => {
    const redirect = useRedirect();
    return (
        <Create resource={resource} actions={false}>
            <Card>
                <CardContent>
                    <Button
                        label="Back"
                        variant="outlined"
                        onClick={() => redirect(`/${resource}`)}
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                    />
                    <GenericForm resource={resource} fields={fields} />
                </CardContent>
            </Card>
        </Create>
    );
};

// Component Edit với nút "Back" ở góc trên trái và không có nút Delete
export const GenericEdit = ({ resource, fields }: { resource: string; fields: any[] }) => {
    const redirect = useRedirect();
    return (
        <Edit resource={resource} actions={false}>
            <Card>
                <CardContent>
                    <Button
                        label="Back"
                        variant="outlined"
                        onClick={() => redirect(`/${resource}`)}
                        style={{ display: 'flex', justifyContent: 'flex-start', margin: '0 20px' }}
                    />
                    <GenericForm resource={resource} fields={fields} />
                </CardContent>
            </Card>
        </Edit>
    );
};
