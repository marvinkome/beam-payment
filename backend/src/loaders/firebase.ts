import * as admin from "firebase-admin"
import config from "config"

export default function firebaseLoader() {
    admin.initializeApp({
        credential: admin.credential.cert(config.serviceAccount),
    })
}
