const CreateListing = () => {
    return (
        <div className="container py-5">
            <h1 className="mb-4">
                <i className="bi bi-plus-circle me-3"></i>
                Create New Bhaktnivas Listing
            </h1>
            <div className="card">
                <div className="card-body p-5 text-center">
                    <i className="bi bi-clipboard-plus text-saffron" style={{ fontSize: '5rem' }}></i>
                    <h3 className="mt-4">Listing Creation Form</h3>
                    <p style={{ fontSize: '1.2rem' }}>
                        Add your Bhaktnivas details here with temple selection, pricing (₹50-₹200), and amenities.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
