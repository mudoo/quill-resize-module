// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const PKG = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'

const stylesHandler = MiniCssExtractPlugin.loader

const bannerPack = new webpack.BannerPlugin({
  banner: [
    `Quill Resize Module v${PKG.version}`,
    'https://github.com/mudoo/quill-resize-module'
  ].join('\n'),
  entryOnly: true
})

const config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename is overriden for production to produce an ESM file (.mjs)
    filename: '[name].js'
  },
  // experiments are enabled per-config below (only the ESM config will set outputModule)
  devServer: {
    open: true,
    host: 'localhost'
  },
  plugins: [
    bannerPack,
    // new HtmlWebpackPlugin({
    //   template: "index.html",
    // }),

    new MiniCssExtractPlugin({
      filename: 'resize.css'
    })

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      },
      {
        test: /\.svg$/,
        type: 'asset/source'
      }

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false // 不将注释提取到单独的文件中
      })
    ]
  }
}

module.exports = () => {
  if (isProduction) {
    // Create a UMD build (historical file) and an ESM build (.mjs).
    // We shallow-copy the base config and override the output and externals per-target.
    const base = Object.assign({}, config)

    // UMD build (dist/resize.js)
    const umdConfig = Object.assign({}, base, {
      mode: 'production',
      entry: {
        resize: './src/index.js'
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resize.js',
        library: {
          name: 'QuillResize',
          type: 'umd'
        }
      },
      externals: {
        quill: 'Quill'
      }
    })

    // ESM build (dist/resize.mjs)
    const esmConfig = Object.assign({}, base, {
      mode: 'production',
      entry: {
        resize: './src/index.js'
      },
      // enable ESM output only for the ESM config
      experiments: {
        outputModule: true
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'resize.mjs',
        library: {
          type: 'module'
        }
      },
      // Emit ESM-style externals so the bundle contains `import 'quill'` specifier.
      externalsType: 'module',
      externals: {
        quill: 'quill'
      }
    })

    return [umdConfig, esmConfig]
  } else {
    Object.assign(config, {
      mode: 'development',
      entry: {
        index: './demo/index.js'
      },
      devtool: 'source-map'
    })
    config.plugins.push(
      new HtmlWebpackPlugin({
        chunks: ['index'],
        filename: 'index.html',
        template: './demo/index.html'
      })
    )
  }
  return config
}
