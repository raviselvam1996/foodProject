// utils/errorHandler.js

export const handleApiError = (error) => {
    if (!error.response) {
      return "Network error. Please check your internet connection.";
    }
  
    const { status, data } = error.response;
  
    switch (status) {
      case 400:
        return data.message || "Bad Request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Forbidden. You do not have permission.";
      case 404:
        return "Resource not found.";
      case 500:
        return "Internal Server Error. Please try again later.";
      case 503:
        return "Service Unavailable. Please try again later.";
      default:
        return data.message || "An unexpected error occurred.";
    }
  };
  