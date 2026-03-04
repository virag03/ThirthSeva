import { useState } from 'react';
import PropTypes from 'prop-types';

const TempleDetailsModal = ({ temple, details, isLoading, error, onClose }) => {
    if (!temple) return null;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                style={{ zIndex: 1050 }}
            ></div>

            {/* Modal Dialog */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                style={{ zIndex: 1055 }}
            >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" role="document">
                    <div className="modal-content" style={{
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {/* Modal Header */}
                        <div
                            className="modal-header text-white"
                            style={{
                                backgroundColor: 'var(--deep-maroon)',
                                borderTopLeftRadius: 'var(--radius-lg)',
                                borderTopRightRadius: 'var(--radius-lg)'
                            }}
                        >
                            <h5 className="modal-title text-white">
                                <i className="bi bi-info-circle me-2"></i>
                                {temple.name}
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {/* Location Badge */}
                            <div className="mb-4">
                                <span className="badge bg-saffron px-3 py-2" style={{ fontSize: '1rem' }}>
                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                    {temple.city}, {temple.state}
                                </span>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-maroon" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Fetching temple information...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !isLoading && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {/* Temple Details */}
                            {details && !isLoading && !error && (
                                <div>
                                    {/* Description */}
                                    {details.description && (
                                        <div className="mb-4">
                                            <h6 className="text-maroon mb-3">
                                                <i className="bi bi-book me-2"></i>
                                                About
                                            </h6>
                                            <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                                                {details.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Key Information */}
                                    {details.keyInfo && details.keyInfo.length > 0 && (
                                        <div className="mb-4">
                                            <h6 className="text-maroon mb-3">
                                                <i className="bi bi-list-ul me-2"></i>
                                                Key Information
                                            </h6>
                                            <ul className="list-unstyled">
                                                {details.keyInfo.map((info, index) => (
                                                    <li key={index} className="mb-2" style={{ fontSize: '1rem' }}>
                                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                        {info}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Additional Information */}
                                    {details.additionalInfo && (
                                        <div className="mb-4">
                                            <h6 className="text-maroon mb-3">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Additional Details
                                            </h6>
                                            <div className="card bg-light-beige p-3">
                                                <p className="mb-0" style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                                    {details.additionalInfo}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Source Attribution */}
                                    <div className="text-muted text-center mt-4" style={{ fontSize: '0.85rem' }}>
                                        <i className="bi bi-info-circle me-1"></i>
                                        Information sourced from web search results
                                    </div>
                                </div>
                            )}

                            {/* No Data State */}
                            {!details && !isLoading && !error && (
                                <div className="text-center py-5">
                                    <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3 text-muted">No additional information available.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

TempleDetailsModal.propTypes = {
    temple: PropTypes.object,
    details: PropTypes.shape({
        description: PropTypes.string,
        keyInfo: PropTypes.arrayOf(PropTypes.string),
        additionalInfo: PropTypes.string
    }),
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

export default TempleDetailsModal;
