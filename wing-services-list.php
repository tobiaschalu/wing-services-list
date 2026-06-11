<?php
/**
 * Plugin Name:       Wing Services List
 * Plugin URI:        https://github.com/your-username/wing-services-list
 * Description:       A Gutenberg block for displaying a list of services with title, description, and image.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Wing
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wing-services-list
 */

defined( 'ABSPATH' ) || exit;

define( 'WING_SERVICES_VERSION', '1.0.0' );
define( 'WING_SERVICES_DIR', plugin_dir_path( __FILE__ ) );
define( 'WING_SERVICES_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register the block and its assets.
 */
function wing_services_register_block(): void {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	register_block_type( WING_SERVICES_DIR . 'build' );
}
add_action( 'init', 'wing_services_register_block' );

/**
 * Enqueue frontend styles.
 * (block.json handles editor styles; this handles both via style handle)
 */
function wing_services_frontend_styles(): void {
	if ( ! is_admin() ) {
		wp_enqueue_style(
			'wing-services-list-frontend',
			WING_SERVICES_URL . 'assets/css/frontend.css',
			[],
			WING_SERVICES_VERSION
		);
	}
}
add_action( 'wp_enqueue_scripts', 'wing_services_frontend_styles' );
