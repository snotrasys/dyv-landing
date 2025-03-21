import blacklist from './blacklistData'

export function isInBlacklist(address) {
    const res = blacklist.includes(address)
    console.log('isInBlacklist',address,res);
    return res;
  }