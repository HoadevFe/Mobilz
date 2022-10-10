import * as express from 'express'
import * as httpProxy from 'http-proxy'
import { join } from 'path'

const app = express()
const apiPrefix = '/api'
const port = process.env.PORT || 30500
const proxyTarget = process.env.PROXY_API_TARGET || 'http://192.168.10.49:30080'
const proxyServer = httpProxy.createProxyServer({ target: proxyTarget })

app.use(express.static('dist'))

app.use(apiPrefix, (req, resp, next) => {
  req.url = apiPrefix + req.url
  console.log(`req.url`, req.url)
  proxyServer.web(req, resp, { timeout: 10000 }, next)
})

app.use('*', (_, resp) => {
  resp.sendFile(join(__dirname, 'dist/index.html'))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
