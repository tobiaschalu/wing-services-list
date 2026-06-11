const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		'style-index': './src/style-index.scss',
	},
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin( {
			patterns: [
				{ from: 'src/render.php', to: 'render.php' },
			],
		} ),
	],
};
