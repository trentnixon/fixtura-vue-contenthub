const { defineConfig } = require("@vue/cli-service");
const path = require("path");

const posthogAssetsProxy = {
  target: "https://us-assets.i.posthog.com",
  changeOrigin: true,
  secure: true,
};

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin("define").tap((definitions) => {
      const env = definitions[0]["process.env"];
      env.NEXT_PUBLIC_POSTHOG_KEY = JSON.stringify(
        process.env.NEXT_PUBLIC_POSTHOG_KEY
      );
      env.NEXT_PUBLIC_POSTHOG_HOST = JSON.stringify(
        process.env.NEXT_PUBLIC_POSTHOG_HOST
      );
      env.NEXT_PUBLIC_FEATURE_ANALYTICS = JSON.stringify(
        process.env.NEXT_PUBLIC_FEATURE_ANALYTICS
      );
      return definitions;
    });
  },
  devServer: {
    proxy: [
      {
        context: ["/ingest/static"],
        ...posthogAssetsProxy,
        pathRewrite: { "^/ingest/static": "/static" },
      },
      {
        context: ["/ingest/array"],
        ...posthogAssetsProxy,
        pathRewrite: { "^/ingest/array": "/array" },
      },
      {
        context: ["/ingest"],
        target: "https://us.i.posthog.com",
        changeOrigin: true,
        secure: true,
        pathRewrite: { "^/ingest": "" },
      },
    ],
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
