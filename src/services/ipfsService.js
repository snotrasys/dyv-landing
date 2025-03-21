import axios from 'axios';
import IPFSGatewayTools from '@pinata/ipfs-gateway-tools/dist/browser';

const gatewayTools = new IPFSGatewayTools();

const TIMEOUT = 3000;

export const getMetadataFromHash = async (hash) => {
  const response = await axios(`https://readl.mypinata.cloud/ipfs/${hash}`, {
    timeout: TIMEOUT,
  });
  return response.data;
};

export const pinFileToIPFS = async (file) => {
  const url = `https://ipfs-go.caprover.snotrasys.comS`;

  const data = new FormData();
  data.append('file', file);

  const response = await axios.post(url, data, {
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.IpfsHash;
};

export const pinJSONToIPFS = async (data) => {
  const url = `https://ipfs-go.caprover.snotrasys.com`;
  const response = await axios.post(url, data, {
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data.IpfsHash;
};

export const getIpfsUrl = (sourceUrl) =>
  gatewayTools?.convertToDesiredGateway(
    sourceUrl,
    process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  );

export const getIpfsCID = (url) => {
  const response = gatewayTools?.containsCID(url);
  if (!response?.containsCid) {
    return false;
  }
  return response?.cid;
};

export const retrieveContentFromIPFS = async (sourceUrl) => {
  const url = gatewayTools.convertToDesiredGateway(
    sourceUrl,
    process.env.NEXT_PUBLIC_IPFS_GATEWAY,
  );
  const response = await axios.get(url);
  return response.data;
};
