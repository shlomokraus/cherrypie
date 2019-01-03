const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: "development",
    target: 'web', 
    devtool: 'inline-source-map', 
	context: path.resolve(__dirname, 'src'),          
	entry: {
		popup: path.resolve('./src/extension/Popup.tsx'),
		// background: buildEntryPoint(path.resolve('./src/extension/Background.ts')),
		content: path.resolve('./src/extension/Content.tsx')
    },
    output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].bundle.js",
		publicPath: '/'
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
	    openPage: '/content.html',
		headers:          { 'Access-Control-Allow-Origin': '*' },
		https:            false,
		disableHostCheck: true
	},
	optimization: {
		minimize: true
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'babel-loader',
		  },
		  {
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		  },
			{
				test: /\.png$/,
				loader: "url-loader?limit=100000"
			},
			{
				test: /\.jpg$/,
				loader: "file-loader"
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'assets/index.html'),
			filename: "popup.html",
			chunks: ["popup"]
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'assets/index.html'),
			filename: "content.html",
			chunks: ["content"]
		}),
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, 'assets/manifest.json')
		}, 
		{
			from: path.resolve(__dirname, 'assets/hot-reload.js')
		},
		{
			from: path.resolve(__dirname, 'assets/cherry-128.png')
		}])
	]
}
