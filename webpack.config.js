/* eslint-disable @typescript-eslint/no-require-imports */
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
    'https://github.com/mudoo/quill-resize-module',
  ].join('\n'),
  entryOnly: true,
})

const baseConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    bannerPack,
    // new HtmlWebpackPlugin({
    //   template: "index.html",
    // }),

    new MiniCssExtractPlugin({
      filename: 'resize.css',
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: isProduction
          ? {}
          : {
              configFile: 'tsconfig.dev.json',
            },
      },
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 不将注释提取到单独的文件中
      }),
    ],
  },
}

module.exports = () => {
  if (isProduction) {
    // UMD 格式配置
    const umdConfig = {
      ...baseConfig,
      mode: 'production',
      entry: {
        resize: './src/index.ts',
      },
      output: {
        ...baseConfig.output,
        library: 'QuillResize',
        libraryTarget: 'umd',
        filename: '[name].js',
        globalObject: 'this',
      },
      // 发布排除quill库
      externals: {
        quill: {
          commonjs: 'quill',
          commonjs2: 'quill',
          amd: 'quill',
          root: 'Quill',
        },
      },
    }

    // ESM 格式配置
    const esmConfig = {
      ...baseConfig,
      mode: 'production',
      entry: {
        'resize.esm': './src/index.ts',
      },
      output: {
        ...baseConfig.output,
        library: {
          type: 'module',
        },
        filename: '[name].js',
        module: true,
        environment: {
          module: true,
        },
      },
      experiments: {
        outputModule: true,
      },
      optimization: {
        minimize: false,
      },
      // 发布排除quill库
      externals: {
        quill: 'quill',
      },
    }

    return [umdConfig, esmConfig]
  } else {
    const config = {
      ...baseConfig,
      mode: 'development',
      entry: {
        index: './demo/index.ts',
      },
      output: {
        ...baseConfig.output,
        library: 'QuillResize',
        libraryTarget: 'umd',
        filename: '[name].js',
      },
      devtool: 'source-map',
    }
    config.plugins.push(
      new HtmlWebpackPlugin({
        chunks: ['index'],
        filename: 'index.html',
        template: './demo/index.html',
      }),
    )
    return config
  }
}
