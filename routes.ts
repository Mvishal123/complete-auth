/**
 * These routes are not protected as they are necessary for authentication and authourization.
 *@type {String}
 */
export const authRoute = "/api/auth";

/**
 * These routes are available to the public
 * No authetication required
 * @type {String[]}
 */
export const publicRoutes = ["/"];

/**
 * These routes are not available to the public
 * Authetication is required!
 * @type {String[]}
 */
export const privateRoutes = ["/settings", "/dashboard"];

export const LOGIN_REDIRECT_URL = "/auth/login"
