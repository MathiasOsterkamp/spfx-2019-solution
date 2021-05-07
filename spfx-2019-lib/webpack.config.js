const path = require('path');
const del = require('del');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');

var PACKAGE = require('./package.json');
var version = PACKAGE.version.replace(/\./g, '_');

class ClearCssModuleDefinitionsPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    compiler.hooks.done.tap('FixStylesPlugin', (stats) => {
      if (!this.options.deleted) {
        setTimeout(() => {
          del.sync(['src/**/*.module.scss.ts']);
        }, 3000);

        this.options.deleted = true;
      }
    });
  }
}

module.exports = ['source-map'].map((devtool) => ({
  mode: 'development',
  entry: {
    "spfx2019lib": './lib/index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules']
  },
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[id].[name]_[chunkhash].js',
    filename: '[name].js',
    library: '[name]_' + version,
    libraryTarget: 'var',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: 'webpack:///../[resource-path]',
    devtoolFallbackModuleFilenameTemplate: 'webpack:///../[resource-path]?[hash]'
  },
  devtool,
  optimization: {
    runtimeChunk: false
  },
  performance: { hints: false },
  externals: [
    '@microsoft/decorators',
    '@microsoft/sp-lodash-subset',
    '@microsoft/sp-core-library',
    '@microsoft/office-ui-fabric-react-bundle',
    '@microsoft/sp-polyfills',
    '@microsoft/sp-loader',
    '@microsoft/sp-http',
    '@microsoft/sp-page-context',
    '@microsoft/sp-component-base',
    '@microsoft/sp-extension-base',
    '@microsoft/sp-application-base',
    '@microsoft/sp-webpart-base',
    '@microsoft/sp-dialog',
    '@microsoft/sp-office-ui-fabric-core',
    '@microsoft/sp-client-preview',
    '@microsoft/sp-webpart-workbench'
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      },
      {
        use: [
          {
            loader: '@microsoft/loader-cased-file',
            options: {
              name: '[name:lower]_[hash].[ext]'
            }
          }
        ],
        test: /\.(jpe?g|png|woff|eot|ttf|svg|gif|dds)$/i
      },
      {
        use: [
          {
            loader: 'html-loader'
          }
        ],
        test: /\.html$/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: '@microsoft/loader-load-themed-styles',
            options: {
              async: true
            }
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: function (fileName) {
          return fileName.endsWith('.module.scss'); // scss modules support
        },
        use: [
          {
            loader: '@microsoft/loader-load-themed-styles',
            options: {
              async: true
            }
          },
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:8]'
              }
            }
          }, // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: function (fileName) {
          return !fileName.endsWith('.module.scss') && fileName.endsWith('.scss'); // just regular .scss
        },
        use: [
          {
            loader: '@microsoft/loader-load-themed-styles',
            options: {
              async: true
            }
          },
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new ForkTsCheckerWebpackPlugin({
      tslint: false
    }),
    new ClearCssModuleDefinitionsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(true),
      DEBUG: JSON.stringify(true)
    })
  ]
}));
