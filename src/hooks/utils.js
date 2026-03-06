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
        referrer = "0x2614087B86aBe928887dCF999834db546c40387A";
    }

    return referrer;
};

export default refHandler;
