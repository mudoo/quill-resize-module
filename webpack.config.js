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
    library: 'QuillResize',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
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
    Object.assign(config, {
      mode: 'production',
      entry: {
        resize: './src/index.js'
      },
      // 发布排除quill库
      externals: {
        quill: 'Quill'
      }
    })
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
