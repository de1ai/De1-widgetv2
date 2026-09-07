import axios from 'axios'

const marketApiURL = 'https://market-api.de1.exchange'
const EXPIRE_TIME = 60 * 1000 // 60 seconds

export const setConfig = (params: any) => {
  return axios.post(`${marketApiURL}/v1/widget-v2/init`, {
    config: JSON.stringify(params),
    address: '0x4b1921f0311cBb1D73774edb295ef6FBfb864766'
  })
}

export const getConfig = async (hash: string) => {
  const { data } = await axios.get(`${marketApiURL}/v1/widget-v2/config?hash=${hash}`)
  const { config } = data && data.data || {};
  if (config) {
    return JSON.parse(config);
  }
  return null;
}

