module.exports = {
	entry: './index.js',
	mode: 'production',
	devtool: 'source-map',
	output: {
		library: '',
		libraryTarget: 'umd',
		filename: 'artemis.min.js',
		umdNamedDefine: true,
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					'presets': ['env'],
					'plugins': [
						'transform-es2015-modules-umd'
					]
				}
			}
		]
	}
};