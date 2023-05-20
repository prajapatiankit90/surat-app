const config = {
    API_URL: process.env.REACT_APP_API_URL,
    APP_TYPE: process.env.REACT_APP_TYPE,
    APP_WEB_URL : process.env.REACT_APP_API_WEB
  };
  
  const currentEnvironment = process.env.REACT_APP_TYPE;
  export default config;
  