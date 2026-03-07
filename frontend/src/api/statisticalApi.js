import axiosClient from './axiosClient';

const statisticalApi = {
  getOrderandTable() {
    return axiosClient.get('/statistical/getOrderandTable');
  },
  getChartOfOrder() {
    return axiosClient.get('/statistical/getChartOfOrder');
  },
};

export default statisticalApi;
