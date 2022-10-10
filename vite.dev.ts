import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'
import pages, { DefaultPageStrategy } from 'vite-plugin-react-pages'

export default defineConfig({
  jsx: 'react',
  plugins: [
    EnvironmentPlugin(['BASE_URL']),
    react({
      babel: {
        parserOpts: { plugins: ['decorators-legacy', 'classProperties'] }
      }
    }),
    pages({
      pagesDir: path.join(__dirname, 'pages'),
      pageStrategy: new DefaultPageStrategy({
        extraFindPages: async (pageDir, helpers) => {
          const demosBasePath = path.join(__dirname, '../')
          // find all component demos
          helpers.watchFiles(demosBasePath, '*/admin/**/*.{[tj]sx,md?(x)}', async function fileHandler(file, api) {
            const { relative, path: absolute } = file
            const match = relative.match(/(.*)\/admin\/(.*)\.([tj]sx|mdx?)$/)
            if (!match) throw new Error('unexpected file: ' + absolute)
            const [_, componentName, demoPath] = match
            const pageId = `/${componentName}`
            const runtimeDataPaths = api.getRuntimeData(pageId)
            runtimeDataPaths[demoPath] = absolute
            const staticData = api.getStaticData(pageId)
            staticData[demoPath] = await helpers.extractStaticData(file)
            if (!staticData.title) staticData.title = `${componentName} Title`
          })

          // find all component README
          helpers.watchFiles(demosBasePath, '*/README.md?(x)', async function fileHandler(file, api) {
            const { relative, path: absolute } = file
            const match = relative.match(/(.*)\/README\.mdx?$/)
            if (!match) throw new Error('unexpected file: ' + absolute)
            const [_, componentName] = match
            const pageId = `/${componentName}`
            const runtimeDataPaths = api.getRuntimeData(pageId)
            runtimeDataPaths['README'] = absolute
            const staticData = api.getStaticData(pageId)
            staticData['README'] = await helpers.extractStaticData(file)
            // make sure the title data is bound to this file
            staticData.title = undefined
            staticData.title = staticData['README'].title ?? `${componentName} Title`
          })
        }
      })
    })
  ],
  server: { port: 9090 },
  resolve: {
    alias: [
      { find: '*', replacement: path.resolve(__dirname, 'src') },
      { find: 'sdk', replacement: path.resolve(__dirname, 'src/sdk') },
      { find: 'constants', replacement: path.resolve(__dirname, 'src/constants') },
      { find: 'pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: 'hook', replacement: path.resolve(__dirname, 'src/hook') }
    ]
  }
} as UserConfig)
