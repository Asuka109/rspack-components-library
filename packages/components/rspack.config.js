const rspack = require('@rspack/core');
const RefreshPlugin = require('@rspack/plugin-react-refresh');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const _ = require('lodash');
const isDev = process.env.NODE_ENV === 'development';

/**
 * @param {import('@rspack/cli').Configuration} config
 * @returns {import('@rspack/cli').Configuration}
 */
const extendConfig = config => {
  /** @type {import('@rspack/cli').Configuration} */
  const base = {
    context: __dirname,
    entry: {
      index: './src/index.ts'
    },
  externals: [nodeExternals()],
    resolve: {
      extensions: ['...', '.ts', '.tsx', '.jsx']
    },
    optimization: {
      minimize: false
    },
    experiments: {
      rspackFuture: {
        newTreeshaking: true,
        disableApplyEntryLazily: true
      }
    },
    devServer: {
      devMiddleware: {
        writeToDisk: true
      }
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          type: 'asset'
        },
        {
          test: /\.(jsx?|tsx?)$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                sourceMap: true,
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      development: isDev,
                      refresh: isDev
                    }
                  }
                },
                env: {
                  targets: [
                    'chrome >= 87',
                    'edge >= 88',
                    'firefox >= 78',
                    'safari >= 14'
                  ]
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new rspack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new rspack.ProgressPlugin({}),
      new ForkTsCheckerWebpackPlugin({
        typescript: { build: true, mode: 'write-dts' }
      })
      // isDev ? new RefreshPlugin() : null
    ].filter(Boolean)
  };
  return _.merge(base, config);
};

/** @type {import('@rspack/cli').Configuration} */
module.exports = [
  extendConfig({
    output: {
      library: {
        type: 'module'
      },
      module: true,
      chunkFormat: 'module'
    },
    experiments: {
      outputModule: true
    }
  }),
  extendConfig({
    output: {
      library: {
        type: 'commonjs2'
      }
    }
  }),
  extendConfig({
    output: {
      filename: 'index.umd.js',
      globalObject: 'this',
      library: {
        name: 'myComponents',
        type: 'umd'
      }
    },
    optimization: {
      minimize: true
    }
  })
];
