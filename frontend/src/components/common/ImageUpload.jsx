import { useState } from 'react';
import { imageService } from '../../services/imageService';

const ImageUpload = ({ onImageUpload, initialImage = null }) => {
    const [preview, setPreview] = useState(initialImage);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const result = await imageService.upload(file);
            const imagePath = result.imagePath;

            // Set preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Notify parent component
            onImageUpload(imagePath);
        } catch (err) {
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to upload image. Please try again.';
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUpload(null);
    };

    return (
        <div className="mb-3">
            <label className="form-label">Temple Image</label>

            {!preview ? (
                <div>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                    {uploading && (
                        <div className="text-center mt-2">
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            <span className="ms-2">Uploading...</span>
                        </div>
                    )}
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                    <small className="form-text text-muted">
                        Accepted formats: JPG, PNG, WEBP | Max size: 5MB
                    </small>
                </div>
            ) : (
                <div>
                    <div className="position-relative" style={{ maxWidth: '400px' }}>
                        <img
                            src={preview}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute"
                            style={{ top: '10px', right: '10px' }}
                            onClick={handleRemove}
                        >
                            <i className="bi bi-x-circle"></i> Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
