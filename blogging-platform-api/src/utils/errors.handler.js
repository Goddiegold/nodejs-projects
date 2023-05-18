function handleError(error) {
    let errors = {};

    // Duplicate key error (e.g., unique constraint violation)
    if (error.code === 11000) {
        Object.keys(error.keyValue).forEach((key) => {
            errors[key] = `${key} already exists`;
        });
        return errors;
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        Object.keys(error.errors).forEach((field) => {
            errors[field] = error.errors[field].message;
        });
        return errors;
    }

    // Cast errors (e.g., invalid ObjectId)
    if (error.name === 'CastError') {
        const field = error.path;
        errors[field] = `Invalid ${field}`;
        return errors;
    }

    // JWT authentication errors
    if (error.name === 'JsonWebTokenError') {
        errors.token = 'Invalid token';
        return errors;
    }

    // Authorization errors
    if (error.name === 'UnauthorizedError') {
        errors.token = 'Unauthorized';
        return errors;
    }

    // Custom error handling
    if (error.name === 'CustomError') {
        errors.customField = error.message;
        return errors;
    }

    return errors;
}

module.exports = handleError;
