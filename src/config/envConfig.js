import ConfigService from "../services/configService";

const EnvConfig = {
    DEVELOPMENT: {
      API_URL: ConfigService.getApiUrl(),
    },
    PRODUCTION: {
      API_URL: "https://apiportalwebalbus-hadjdhbdc3dxd4em.brazilsouth-01.azurewebsites.net",
    }
};
  
const getCurrentEnvConfig = () => {
    return process.env.NODE_ENV === "production"
      ? EnvConfig.PRODUCTION.API_URL
      : EnvConfig.DEVELOPMENT.API_URL;
};
  
  export default getCurrentEnvConfig;
  