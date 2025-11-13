import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onImageUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            setUploading(true);
            const token = localStorage.getItem('token'); // Your auth token

            const response = await axios.post(
                'http://localhost:8080/api/upload/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setUploadedUrl(response.data.imageUrl);
            if (onImageUpload) {
                onImageUpload(response.data.imageUrl);
            }
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-6 border border-gray-300 rounded-lg max-w-md">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />

            {preview && (
                <div className="flex justify-center">
                    <img src={preview} alt="Preview" className="max-w-xs rounded-lg shadow" />
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>

            {uploadedUrl && (
                <div className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">Uploaded successfully!</p>
                    <img src={uploadedUrl} alt="Uploaded" className="max-w-xs rounded-lg shadow" />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;