const errors = {
    error: { message: "Client Error", statusCode: 400 },
    noResults: { message: "This search does not return any results", statusCode: 400 },
    auth: { message: "Invalid Credentials", statusCode: 401 },
    forbidden: { message: "Forbidden Action", statusCode: 403 },
    notFound: { message: "Not Found", statusCode: 404 },
    notAllowed: { message: "Method not allowed", statusCode: 405},
    fatal: { message: "Server Error", statusCode: 500 }
}

export default errors