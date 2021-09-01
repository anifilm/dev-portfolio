const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
require('@babel/polyfill');

module.exports = (env, opts) => {
  const config = {
    resolve: {
      extensions: ['.js', '.vue'], // import시 확장자 생략
      alias: {
        '~': path.resolve(__dirname, 'src'),
        'scss': path.resolve(__dirname, 'src/scss')
      }
    },
    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'src/main.js')
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].budle.js', // app.js
      path: path.join(__dirname, 'dist')
    },
    // 모듈 처리 방식을 설정
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.?js$/,
          exclude: /node_modules/, // 해당 폴더 제외
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin([ // src/assets 디렉터리의 파일을 dist 디렉터리에 복사
        {
          from: 'src/assets/',
          to: ''
        }
      ])
    ]
  };

  if (opts.mode === 'development') { // (개발용)
    return merge(config, {
      devtool: 'evel', // 빌드 시간이 빠르고, 디버깅이 가능한 방식(용량이 클 수 있다. 개발용으로 적합)
      devServer: {
        open: true, // 자동으로 기본 브로우저를 띄울지 옵션
        hot: true
      }
    });
  } else {
    // opts.mode === 'production' (제품용)
    return merge(config, {
      devtool: 'cheap-module-source-map', // 용량이 작은 방식
      plugins: [
        // 빌드(build) 직전 'output.path'(dist 디렉터리)내 기존 파일 모두 삭제
        new CleanWebpackPlugin()
      ]
    });
  }
};
