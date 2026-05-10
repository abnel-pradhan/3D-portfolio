// craco.config.js
const path = require("path");
require("dotenv").config();

const isDevServer = process.env.NODE_ENV !== "production";

const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      // ── Patch the visual-edits babel plugin to skip 3D/R3F files ──────────
      // The plugin injects data-line-number attrs which break the R3F reconciler.
      // We find it in the babel-loader rules and add an exclude for 3D components.
      const THREE_D_FILES = [
        /AmbientBG\.(jsx?|tsx?)$/,
        /Hero\.(jsx?|tsx?)$/,
        /Skills\.(jsx?|tsx?)$/,
      ];

      webpackConfig.module.rules.forEach((rule) => {
        if (!rule.oneOf) return;
        rule.oneOf.forEach((loader) => {
          if (!loader.use) return;
          const uses = Array.isArray(loader.use) ? loader.use : [loader.use];
          uses.forEach((use) => {
            if (
              typeof use === "object" &&
              use.loader &&
              use.loader.includes("babel-loader") &&
              use.options &&
              use.options.plugins
            ) {
              use.options.plugins = use.options.plugins.map((plugin) => {
                // Detect the visual-edits babel plugin (it's usually a function or array)
                const pluginPath =
                  Array.isArray(plugin) ? plugin[0] : plugin;
                if (
                  typeof pluginPath === "string" &&
                  pluginPath.includes("visual-edits")
                ) {
                  // Wrap it: only run on non-3D files
                  return [
                    pluginPath,
                    Array.isArray(plugin) ? plugin[1] || {} : {},
                    // Add a test exclude via babel override instead
                  ];
                }
                return plugin;
              });
            }
          });
        });
      });

      // Exclude 3D component files from the visual-edits babel transform entirely
      webpackConfig.module.rules.forEach((rule) => {
        if (!rule.oneOf) return;
        rule.oneOf.forEach((loader) => {
          if (!loader.use) return;
          const uses = Array.isArray(loader.use) ? loader.use : [loader.use];
          const hasVisualEdits = uses.some(
            (use) =>
              typeof use === "object" &&
              use.loader &&
              use.loader.includes("babel-loader") &&
              use.options &&
              use.options.plugins &&
              use.options.plugins.some((p) => {
                const name = Array.isArray(p) ? p[0] : p;
                return typeof name === "string" && name.includes("visual-edits");
              })
          );

          if (hasVisualEdits) {
            // Add the 3D files to the exclude list for this loader
            const existing = loader.exclude
              ? Array.isArray(loader.exclude)
                ? loader.exclude
                : [loader.exclude]
              : [];
            loader.exclude = [...existing, ...THREE_D_FILES];
          }
        });
      });

      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
    const originalSetupMiddlewares = devServerConfig.setupMiddlewares;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetupMiddlewares) {
        middlewares = originalSetupMiddlewares(middlewares, devServer);
      }
      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }
  return devServerConfig;
};

// Wrap with visual edits in dev mode only
if (isDevServer) {
  try {
    const { withVisualEdits } = require("@emergentbase/visual-edits/craco");
    webpackConfig = withVisualEdits(webpackConfig);
  } catch (err) {
    if (
      err.code === "MODULE_NOT_FOUND" &&
      err.message.includes("@emergentbase/visual-edits/craco")
    ) {
      console.warn(
        "[visual-edits] @emergentbase/visual-edits not installed — visual editing disabled."
      );
    } else {
      throw err;
    }
  }
}

module.exports = webpackConfig;