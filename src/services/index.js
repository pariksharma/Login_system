import axiosClient from "./axios"


const VersionUrl = 'version/'

export const getVersionService = async (params) => await axiosClient.post(VersionUrl + 'get_version', params);

const AuthUrl = 'users/'

export const userLoginService = async (params) => await axiosClient.post(AuthUrl + 'login_auth', params);
export const userRegisterService = async (params) => await axiosClient.post(AuthUrl + 'registration', params);
export const sendVerificationOtpService = async (params) => await axiosClient.post(AuthUrl + 'send_verification_otp', params)
export const updatePasswordService = async (params) => await axiosClient.post(AuthUrl + 'update_password', params);
export const userLogoutService = async () => await axiosClient.post(AuthUrl + 'logout');


// Master hit
const MasterUrl = 'master_hit/';
export const countryListService = async () => await axiosClient.post(MasterUrl + 'get_countries');
export const stateListService = async (params) => await axiosClient.post(MasterUrl + 'get_states', params);
export const cityListService = async (params) => await axiosClient.post(MasterUrl + 'get_cities', params);
export const refundPolicyService = async (params) => await axiosClient.post(MasterUrl + 'refund', params);
export const aboutUsService = async (params) => await axiosClient.post(MasterUrl + 'about', params);
export const policiesService = async (params) => await axiosClient.post(MasterUrl + 'policies', params);
export const termService = async (params) => await axiosClient.post(MasterUrl + 'terms', params);

