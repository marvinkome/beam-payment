import config from "config"

const flw = require("flutterwave-node-v3")
const Flutterwave = new flw(config.flutterwavePublicKey, config.flutterwaveSecretKey)

export default Flutterwave
