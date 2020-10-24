import config from "config"
import { connect } from "mongoose"

export default function dbLoader() {
    connect(config.databaseUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
}
