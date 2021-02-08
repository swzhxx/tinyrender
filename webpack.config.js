const webpack = require('webpack')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = (env, args) => {
  const isProductionMode = args.mode === 'production' ? 'production' : 'development'

  return {
    entry: './ts2/main.ts',
    mode: isProductionMode,
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isProductionMode ? '[name].[contenthash].js' : '[name].js ',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.obj$/,
          use: 'raw-loader',
        },
        {
          test: /\.tga$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 81920000,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
      // new WasmPackPlugin({
      //   crateDirectory: path.resolve(__dirname, '.'),
      // }),
      new webpack.ProvidePlugin({
        TextDecoder: ['text-encoding', 'TextDecoder'],
        TextEncoder: ['text-encoding', 'TextEncoder'],
      }),
    ],
  }
}
