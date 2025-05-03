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
                ? "0x46a40D7CB5184CCF793bA2F9e69E6124B1731E15"
                : "0x46a40D7CB5184CCF793bA2F9e69E6124B1731E15";
    }

    return referrer;
};

export default refHandler;
