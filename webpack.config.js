const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  target: 'web',
  entry: {
    app: ['./src/index.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.join(__dirname, 'babel.config.js'),
          },
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.join(__dirname, 'babel.config.js'),
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './imgs',
            name: '[name].[ext]?[contenthash]',
          },
        },
      },
      {
        test: /\.(otf|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: 'url-loader',
        options: {
          outputPath: './fonts',
          name: '[contenthash].[ext]',
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'defer',
      hash: true,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
      },
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    publicPath: '/',
    host: 'localhost',
    hot: true,
    overlay: true,
    compress: true,
    port: 8080,
    stats: 'errors-only',
    historyApiFallback: true,
    // writeToDisk: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
}
