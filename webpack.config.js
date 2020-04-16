const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')


const isDev = process.env.NODE_ENV === 'development'
const optimisation = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (!isDev) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  }

  return config
}
const filenames = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const cssLoader = preProcessor => {
  const loader = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    'css-loader'
  ]

  if (preProcessor) {
    loader.push(preProcessor)
  }

  return loader
}
const babelOptions = ext => {
  const options = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (ext) {
    options.presets.push(ext)
  }

  return options
}
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions()
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}
const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html', // на какой html-файл опираться вебпаку
      minify: {
        collapseWhitespace: !isDev
      }
    }),

    new CleanWebpackPlugin(),  // плагин для очистки папки dist

    new CopyWebpackPlugin([   // Плагин для управления перемещением файлов
      {
        from: path.join(__dirname, 'src', 'favicon.ico'),
        to: path.join(__dirname, 'dist')
      }
    ]),

    new MiniCssExtractPlugin({
      filename: filenames('css')
    })
  ]

  if (!isDev) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}


module.exports = {
  context: path.join(__dirname, 'src'),   // от какой папки оталкиваться Вебпаку
  mode: 'development',
  entry: {
    // main: './src/index.js',
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  }, // точка входа
  output: {
    // filename: '[name].[hash].js',
    filename: filenames('js'),
    path: path.join(__dirname, 'dist')  // куда все будем складывать
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],  // теперь в импортах можно не указывать расширения файлов
    alias: {
      '@models': path.join(__dirname, 'src/models'),  // для того чтобы можно было писать абсолютные пути
      '@': path.join(__dirname, 'src')
    }
  },
  optimization: optimisation(),
  devServer: {
    port: 4004,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      },
      {
        test: /\.css$/,
        // use: [MiniCssExtractPlugin.loader, 'css-loader']  // style-loader устанавливает стили в секцию head in html-file
        use: cssLoader()
      },
      {
        test: /\.less$/,
        use: cssLoader('less-loader')
      },
      {
        test: /\.(sass|scss)$/,
        use: cssLoader('sass-loader')
      },
      {
        test: /\.(png|jpeg|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }
    ]
  }
}