import { useState } from 'react';
import { imageService } from '../../services/imageService';

const BhaktnivasImageUpload = ({ onImageUpload, initialImage = null }) => {
    const [preview, setPreview] = useState(initialImage);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);

    const validateImageResolution = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = img;
                let warningMsg = null;
                
                if (width < 1200 || height < 675) {
                    warningMsg = `Image resolution (${width}x${height}) is too small. Required: minimum 1200x675px.`;
                } else if (width > 1920 || height > 1080) {
                    warningMsg = `Image resolution (${width}x${height}) is too large. Maximum: 1920x1080px.`;
                }
                
                resolve(warningMsg);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const warningMsg = await validateImageResolution(file);
            setWarning(warningMsg);

            const result = await imageService.upload(file, 'bhaktnivas');
            const imagePath = result.imagePath;

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            onImageUpload(imagePath);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setWarning(null);
        onImageUpload(null);
    };

    return (
        <div className="mb-3">
            <label className="form-label">Bhaktnivas Background Image</label>
            
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
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                            <span className="ms-2">Uploading...</span>
                        </div>
                    )}
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                    <small className="form-text text-muted">
                        Required: 1200x675px | Max: 5MB | Formats: JPG, PNG, WEBP
                    </small>
                </div>
            ) : (
                <div>
                    <div className="position-relative" style={{ maxWidth: '400px' }}>
                        <img
                            src={preview}
                            alt="Bhaktnivas Preview"
                            className="img-fluid rounded"
                            style={{ width: '100%', height: 'auto' }}
                        />
                        <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute"
                            style={{ top: '10px', right: '10px' }}
                            onClick={handleRemove}
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                    {warning && (
                        <div className="alert alert-warning mt-2">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {warning}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BhaktnivasImageUpload;