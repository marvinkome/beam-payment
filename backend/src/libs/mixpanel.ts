import Mixpanel from "mixpanel"
import config from "config"

export default Mixpanel.init(config.mixpanel)
