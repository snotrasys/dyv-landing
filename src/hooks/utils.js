import { utils } from "ethers";
const refHandler = () => {
    let referrer = "";
    new URLSearchParams(window.location.href).forEach((value, key, c) => {
        if (value.search("Trust") == -1) {
            /* eslint-disable */
            if ((key = "ref")) referrer = value.split("#")[0];
            if (window.navigator.userAgent.search("iPhone") >= 0) {
                referrer = value;
            }
        }
    });

    if (!utils.isAddress(referrer)) {
        referrer = "0x0F9896e07dEF77E3B01445170bbFd742DC49e0c8";
    }

    return referrer;
};

export default refHandler;
