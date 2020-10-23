import createApp from './src'

const { app } = createApp()
const port = process.env.PORT || 5055

app.listen(port, () => {
    console.log(`🚀 App is running on localhost:${port}`)
})
