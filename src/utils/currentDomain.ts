const currentDomain = process.env.NODE_ENV === "production" ? process.env.DOMAIN : "localhost";

export default currentDomain;
