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
        const random = Math.floor(Math.random() * 100);
        referrer =
            random > 50
                ? "0xb125072eA478349307bd3EbE8868A131f3D7e34A"
                : "0xb125072eA478349307bd3EbE8868A131f3D7e34A";
    }

    return referrer;
};

export default refHandler;
