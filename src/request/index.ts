const ctx = require.context('./', false, /\.ts/)



const requireAll = (_require: __WebpackModuleApi.RequireContext) => ctx.keys().filter(path => path.indexOf('index.ts') === -1).map(path => _require(path))

const apis = requireAll(ctx).reduce((r, module) => Object.assign(r, module), {})
export default {
  install(vue: any) {
    vue.provide('$api', apis)
  }
}
