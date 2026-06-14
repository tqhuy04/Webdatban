import axiosClient from './axiosClient';

const statisticalApi = {
  getOrderandTable(params = {}) {
    return axiosClient.get('/statistical/getOrderandTable', { params });
  },
  getChartOfOrder(params = {}) {
    return axiosClient.get('/statistical/getChartOfOrder', { params });
  },
  getPieTimeframe(params = {}) {
    return axiosClient.get('/statistical/getPieTimeframe', { params });
  },
};

export default statisticalApi;
