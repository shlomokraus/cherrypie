const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

var buildEntryPoint = function (entryPoint) {
	return [
		entryPoint
	]
}

module.exports = {
    mode: "production",
    target: 'web', 
    devtool: 'inline-source-map', 
	context: path.resolve(__dirname, 'src'),          
	entry: {
		popup: buildEntryPoint(path.resolve('./src/extension/Popup.tsx')),
		background: buildEntryPoint(path.resolve('./src/extension/Background.ts')),
		content: buildEntryPoint(path.resolve('./src/extension/Content.tsx'))
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
		minimize: false // <---- disables uglify.
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],

		// Use our versions of Node modules.
		alias: {
			'fs': 'browserfs/dist/shims/fs.js',
			'buffer': 'browserfs/dist/shims/buffer.js',
			'path': 'browserfs/dist/shims/path.js',
			'processGlobal': 'browserfs/dist/shims/process.js',
			'bufferGlobal': 'browserfs/dist/shims/bufferGlobal.js',
			'bfsGlobal': require.resolve('browserfs')
		}
	},
	// REQUIRED to avoid issue "Uncaught TypeError: BrowserFS.BFSRequire is not a function"
	// See: https://github.com/jvilk/BrowserFS/issues/201
	module: {
		noParse: /browserfs\.js/,

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
		// Expose BrowserFS, process, and Buffer globals.
		// NOTE: If you intend to use BrowserFS in a script tag, you do not need
		// to expose a BrowserFS global.
		new webpack.ProvidePlugin({
			BrowserFS: 'bfsGlobal',
			process: 'processGlobal',
			Buffer: 'bufferGlobal'
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
	],
	// DISABLE Webpack's built-in process and Buffer polyfills!
	node: {
		process: false,
		Buffer: false
	}
}
