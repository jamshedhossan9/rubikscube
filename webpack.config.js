// This Webpack is only for building Sass (*.scss) to CSS.
const path = require('path');
// This plugin extracts CSS into separate files.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// This plugin removes an output JavaScript file generated by Webpack.
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
// input file: src/scss/style.scss
// output file: wwwroot/styles/style.css
module.exports = {
  entry: {
    style: './src/style',
  },
  // Explicitly set the default mode to development.
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'), // An output dir must be an absolute path.
  },
  resolve: {
    extensions: ['.scss']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // Extract code to an external CSS file.
          MiniCssExtractPlugin.loader,
          // Translates CSS to CommonJS and ignore solving URL of images
          {
            loader: 'css-loader',
            options: {
              // Set to false, css-loader will not parse any paths specified in url or image-set.
              // For more details, please refer to https://webpack.js.org/loaders/css-loader/#url.
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                    'autoprefixer'
                ]
              }
            }
          },
          // Compile Sass to CSS.
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
    ] // End rules
  },
  plugins: [
    new RemoveEmptyScriptsPlugin({ verbose: true }),
    new MiniCssExtractPlugin({
      // Configure the output of CSS.
      // It is relative to an output dir. !!! Only relative path works, absolute path does not work.
      filename: '[name].css',
    }),
  ],
};