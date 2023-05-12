// Default values for pagination
const DEFAULT_PAGE_NUMBER = 1; // retrieve the first page
const DEFAULT_PAGE_LIMIT = 0; // retrieve all of the documents

// Get pagination details from query parameter
function getPagination(query) {
    // Calculate page number, default to 1 if not provided or negative
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;

    // Calculate limit, default to 0 if not provided or negative
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

    // Calculate number of documents to skip
    const skips = (page - 1) * limit;

    // Return pagination details
    return { skips, limit }
}

module.exports = {
    getPagination
}