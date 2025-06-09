const DEV_BACKEND_URL = import.meta.env.VITE_DEV_BACKEND_URL;
const PROD_BACKEND_URL = import.meta.env.VITE_PROD_BACKEND_URL;
const MODE = import.meta.env.VITE_MODE;

const APP_URI =
  MODE === "development"
    ? DEV_BACKEND_URL
    : PROD_BACKEND_URL || DEV_BACKEND_URL;

export default APP_URI;
