<?php
/**
 * Wing Services List – Server-Side Render Template
 * Accessibility improvements: semantic HTML, ARIA, focus-visible styles
 *
 * @var array    $attributes  Block attributes.
 * @var string   $content     Inner blocks content (unused).
 * @var WP_Block $block       Block instance.
 *
 * @package WingServicesList
 */

defined( 'ABSPATH' ) || exit;

$services     = $attributes['services']       ?? [];
$columns      = (int) ( $attributes['columns']      ?? 3 );
$heading_text = $attributes['headingText']    ?? '';
$sub_text     = $attributes['subheadingText'] ?? '';
$show_heading = (bool) ( $attributes['showHeading'] ?? true );
$card_style   = $attributes['cardStyle']      ?? 'shadow';
$accent_color = $attributes['accentColor']    ?? '#2563EB';

// Sanitize: strip services with no title (editor warned them).
$services = array_values(
	array_filter( $services, fn( $s ) => ! empty( trim( wp_strip_all_tags( $s['title'] ?? '' ) ) ) )
);

if ( empty( $services ) ) {
	return;
}

// Sanitize accent color to a valid CSS color token.
$accent_color = sanitize_hex_color( $accent_color ) ?? '#2563EB';

$wrapper_attrs = get_block_wrapper_attributes( [
	'class' => "wing-services-list wing-services-list--cols-{$columns} wing-services-list--{$card_style}",
	'style' => "--wing-accent:{$accent_color};",
] );

$service_count = count( $services );
?>
<div <?php echo $wrapper_attrs; ?>>

	<?php if ( $show_heading && ( $heading_text || $sub_text ) ) : ?>
		<div class="wing-services-list__header">
			<?php if ( $heading_text ) : ?>
				<h2 class="wing-services-list__heading">
					<?php echo wp_kses_post( $heading_text ); ?>
				</h2>
			<?php endif; ?>
			<?php if ( $sub_text ) : ?>
				<p class="wing-services-list__subheading">
					<?php echo wp_kses_post( $sub_text ); ?>
				</p>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php
	/*
	 * Use <ul> so screen readers announce "list, N items" and users can
	 * navigate between cards with standard list-navigation shortcuts.
	 */
	?>
	<ul
		class="wing-services-list__grid wing-services-list__grid--<?php echo esc_attr( $columns ); ?>"
		aria-label="<?php
			/* translators: %d: number of services */
			echo esc_attr( sprintf( _n( '%d service', '%d services', $service_count, 'wing-services-list' ), $service_count ) );
		?>"
	>
		<?php foreach ( $services as $index => $service ) :
			$title       = wp_kses_post( $service['title']       ?? '' );
			$description = wp_kses_post( $service['description'] ?? '' );
			$image_url   = esc_url( $service['imageUrl']         ?? '' );
			$image_alt   = esc_attr( $service['imageAlt']        ?? '' );
			$link_url    = esc_url( $service['linkUrl']          ?? '' );
			$link_label  = esc_html( $service['linkLabel']       ?? __( 'Learn more', 'wing-services-list' ) );

			// Unique IDs for heading association.
			$heading_id  = 'wing-service-heading-' . esc_attr( $service['id'] ?? $index );
			$desc_id     = $description ? ( 'wing-service-desc-' . esc_attr( $service['id'] ?? $index ) ) : '';
		?>
			<li>
				<article
					class="wing-services-list__card wing-services-list__card--<?php echo esc_attr( $card_style ); ?>"
					aria-labelledby="<?php echo $heading_id; ?>"
					<?php if ( $desc_id ) : ?>aria-describedby="<?php echo $desc_id; ?>"<?php endif; ?>
				>
					<?php if ( $image_url ) : ?>
						<div class="wing-services-list__card-image" aria-hidden="true">
							<img
								src="<?php echo $image_url; ?>"
								alt=""
								loading="lazy"
								decoding="async"
								width="800"
								height="450"
							/>
						</div>
					<?php endif; ?>

					<div class="wing-services-list__card-content">

						<h3
							id="<?php echo $heading_id; ?>"
							class="wing-services-list__card-title"
						>
							<?php echo $title; ?>
						</h3>

						<?php if ( $description ) : ?>
							<p
								id="<?php echo $desc_id; ?>"
								class="wing-services-list__card-desc"
							>
								<?php echo $description; ?>
							</p>
						<?php endif; ?>

						<?php if ( $link_url ) : ?>
							<a
								class="wing-services-list__card-link"
								href="<?php echo $link_url; ?>"
								aria-label="<?php
									/* translators: 1: link label, 2: service title (plain text) */
									echo esc_attr( sprintf(
										__( '%1$s – %2$s', 'wing-services-list' ),
										$link_label,
										wp_strip_all_tags( $title )
									) );
								?>"
							>
								<span aria-hidden="true"><?php echo $link_label; ?></span>
								<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" width="16" height="16">
									<path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
								</svg>
							</a>
						<?php endif; ?>

					</div>
				</article>
			</li>
		<?php endforeach; ?>
	</ul>

</div>
