import axios from "axios";

const PROVINCES_API = "https://provinces.open-api.vn/api/v2";

export const fetchProvinces = () => axios.get(`${PROVINCES_API}/p/`);

export const fetchProvinceWithWards = (provinceCode) =>
  axios.get(`${PROVINCES_API}/p/${provinceCode}?depth=2`);
