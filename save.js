/**
 * Wing Services List – Edit Component
 * Accessibility + validation improvements
 */
import { __ , sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	RangeControl,
	TextControl,
	ToggleControl,
	SelectControl,
	ColorPicker,
	Placeholder,
	Notice,
	Tooltip,
} from '@wordpress/components';
import { plus, trash, chevronUp, chevronDown } from '@wordpress/icons';
import { useState, useRef, useEffect } from '@wordpress/element';
import { speak } from '@wordpress/a11y';

import './editor.scss';

/** Simple unique ID generator */
function makeId() {
	return Math.random().toString( 36 ).slice( 2, 10 );
}

/** Validate a URL – empty string is valid (field is optional) */
function isValidUrl( url ) {
	if ( ! url ) return true;
	try {
		const u = new URL( url );
		return u.protocol === 'https:' || u.protocol === 'http:';
	} catch {
		return false;
	}
}

/** Strip HTML tags to check if RichText value is truly empty */
function isRichTextEmpty( value ) {
	return ! value || value.replace( /<[^>]*>/g, '' ).trim() === '';
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		services,
		columns,
		headingText,
		subheadingText,
		showHeading,
		cardStyle,
		accentColor,
	} = attributes;

	const [ editingId,  setEditingId  ] = useState( null );
	// Track which card IDs have been "touched" (blurred at least once) for validation
	const [ touched,    setTouched    ] = useState( {} );
	// ref to the newly-added card so we can focus it
	const newCardRef = useRef( null );
	const pendingFocusId = useRef( null );

	const blockProps = useBlockProps( {
		className: `wing-services-list wing-services-list--cols-${ columns } wing-services-list--${ cardStyle }`,
	} );

	// ── focus management: move focus into new card after render ──────────────
	useEffect( () => {
		if ( pendingFocusId.current && newCardRef.current ) {
			const el = newCardRef.current.querySelector(
				'.wing-services-list__card-title [contenteditable],' +
				'.wing-services-list__card-title'
			);
			el?.focus();
			pendingFocusId.current = null;
		}
	} );

	// ── helpers ──────────────────────────────────────────────────────────────

	function addService() {
		const newService = {
			id: makeId(),
			title: '',
			description: '',
			imageUrl: '',
			imageId: 0,
			imageAlt: '',
			linkUrl: '',
			linkLabel: __( 'Learn more', 'wing-services-list' ),
		};
		pendingFocusId.current = newService.id;
		setAttributes( { services: [ ...services, newService ] } );
		setEditingId( newService.id );
		speak( __( 'New service added. Enter a title to get started.', 'wing-services-list' ) );
	}

	function updateService( id, patch ) {
		setAttributes( {
			services: services.map( ( s ) => ( s.id === id ? { ...s, ...patch } : s ) ),
		} );
	}

	function removeService( id, title ) {
		const label = title
			? sprintf( __( '"%s" removed.', 'wing-services-list' ), title )
			: __( 'Service removed.', 'wing-services-list' );
		setAttributes( { services: services.filter( ( s ) => s.id !== id ) } );
		setTouched( ( prev ) => { const n = { ...prev }; delete n[ id ]; return n; } );
		if ( editingId === id ) setEditingId( null );
		speak( label );
	}

	function moveService( index, direction ) {
		const next = [ ...services ];
		const target = index + direction;
		if ( target < 0 || target >= next.length ) return;
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { services: next } );
		const moved = next[ target ];
		speak(
			sprintf(
				__( 'Moved "%s" to position %d.', 'wing-services-list' ),
				moved.title || __( 'Untitled service', 'wing-services-list' ),
				target + 1
			)
		);
	}

	function markTouched( id ) {
		setTouched( ( prev ) => ( { ...prev, [ id ]: true } ) );
	}

	// ── per-card validation errors (only shown after field is touched) ────────
	function getErrors( service ) {
		const errs = {};
		if ( touched[ service.id ] ) {
			if ( isRichTextEmpty( service.title ) ) {
				errs.title = __( 'A title is required.', 'wing-services-list' );
			}
			if ( service.linkUrl && ! isValidUrl( service.linkUrl ) ) {
				errs.linkUrl = __( 'Enter a valid URL starting with http:// or https://', 'wing-services-list' );
			}
		}
		return errs;
	}

	// Does the whole block have any validation errors?
	const hasBlockErrors = services.some( ( s ) => {
		const e = getErrors( s );
		return Object.keys( e ).length > 0;
	} );

	// Count services missing a title (regardless of touched) for block-level notice
	const missingTitles = services.filter( ( s ) => isRichTextEmpty( s.title ) ).length;

	// ── render ────────────────────────────────────────────────────────────────

	return (
		<>
			{ /* ── Inspector sidebar ─────────────────────────────────────── */ }
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'wing-services-list' ) } initialOpen>
					<RangeControl
						label={ __( 'Columns', 'wing-services-list' ) }
						value={ columns }
						onChange={ ( val ) => setAttributes( { columns: val } ) }
						min={ 1 }
						max={ 4 }
					/>
					<SelectControl
						label={ __( 'Card style', 'wing-services-list' ) }
						value={ cardStyle }
						options={ [
							{ label: __( 'Shadow', 'wing-services-list' ), value: 'shadow' },
							{ label: __( 'Border', 'wing-services-list' ), value: 'border' },
							{ label: __( 'Flat',   'wing-services-list' ), value: 'flat'   },
						] }
						onChange={ ( val ) => setAttributes( { cardStyle: val } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Heading', 'wing-services-list' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Show heading', 'wing-services-list' ) }
						checked={ showHeading }
						onChange={ ( val ) => setAttributes( { showHeading: val } ) }
					/>
					{ showHeading && (
						<>
							<TextControl
								label={ __( 'Heading', 'wing-services-list' ) }
								value={ headingText }
								onChange={ ( val ) => setAttributes( { headingText: val } ) }
							/>
							<TextControl
								label={ __( 'Sub-heading', 'wing-services-list' ) }
								value={ subheadingText }
								onChange={ ( val ) => setAttributes( { subheadingText: val } ) }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Accent colour', 'wing-services-list' ) } initialOpen={ false }>
					<ColorPicker
						color={ accentColor }
						onChange={ ( val ) => setAttributes( { accentColor: val } ) }
						enableAlpha={ false }
					/>
				</PanelBody>

				{ /* Validation summary in sidebar */ }
				{ missingTitles > 0 && (
					<PanelBody title={ __( 'Validation', 'wing-services-list' ) } initialOpen>
						<Notice status="warning" isDismissible={ false }>
							{ sprintf(
								missingTitles === 1
									? __( '1 service is missing a title.', 'wing-services-list' )
									: __( '%d services are missing a title.', 'wing-services-list' ),
								missingTitles
							) }
						</Notice>
					</PanelBody>
				) }
			</InspectorControls>

			{ /* ── Block canvas ──────────────────────────────────────────── */ }
			<div
				{ ...blockProps }
				style={ { '--wing-accent': accentColor } }
				role="region"
				aria-label={ __( 'Wing Services List block', 'wing-services-list' ) }
			>
				{ /* Heading */ }
				{ showHeading && (
					<div className="wing-services-list__header">
						<RichText
							tagName="h2"
							className="wing-services-list__heading"
							value={ headingText }
							onChange={ ( val ) => setAttributes( { headingText: val } ) }
							placeholder={ __( 'Heading…', 'wing-services-list' ) }
							aria-label={ __( 'Block heading', 'wing-services-list' ) }
						/>
						<RichText
							tagName="p"
							className="wing-services-list__subheading"
							value={ subheadingText }
							onChange={ ( val ) => setAttributes( { subheadingText: val } ) }
							placeholder={ __( 'Sub-heading…', 'wing-services-list' ) }
							aria-label={ __( 'Block sub-heading', 'wing-services-list' ) }
						/>
					</div>
				) }

				{ /* Empty state */ }
				{ services.length === 0 ? (
					<Placeholder
						icon={ plus }
						label={ __( 'Wing Services List', 'wing-services-list' ) }
						instructions={ __( 'Add your first service to get started.', 'wing-services-list' ) }
					>
						<Button variant="primary" onClick={ addService }>
							{ __( 'Add Service', 'wing-services-list' ) }
						</Button>
					</Placeholder>
				) : (
					<ol
						className={ `wing-services-list__grid wing-services-list__grid--${ columns }` }
						aria-label={ sprintf(
							__( 'Services list, %d items', 'wing-services-list' ),
							services.length
						) }
					>
						{ services.map( ( service, index ) => {
							const errors     = getErrors( service );
							const hasErrors  = Object.keys( errors ).length > 0;
							const isEditing  = editingId === service.id;
							const cardLabel  = service.title
								? sprintf(
									__( 'Service %d: %s', 'wing-services-list' ),
									index + 1,
									service.title.replace( /<[^>]*>/g, '' )
								  )
								: sprintf( __( 'Service %d: untitled', 'wing-services-list' ), index + 1 );

							return (
								<li
									key={ service.id }
									ref={ pendingFocusId.current === service.id ? newCardRef : null }
									className={ [
										'wing-services-list__card',
										`wing-services-list__card--${ cardStyle }`,
										isEditing  ? 'is-editing'  : '',
										hasErrors  ? 'has-errors'  : '',
									].filter( Boolean ).join( ' ' ) }
									aria-label={ cardLabel }
									{ ...( hasErrors ? { 'aria-invalid': 'true' } : {} ) }
								>
									{ /* ── Toolbar ── */ }
									<div
										className="wing-services-list__card-toolbar"
										role="toolbar"
										aria-label={ sprintf(
											__( 'Controls for service %d', 'wing-services-list' ),
											index + 1
										) }
									>
										<Tooltip text={ __( 'Move up', 'wing-services-list' ) }>
											<Button
												icon={ chevronUp }
												label={ __( 'Move up', 'wing-services-list' ) }
												size="small"
												disabled={ index === 0 }
												onClick={ () => moveService( index, -1 ) }
												aria-disabled={ index === 0 }
											/>
										</Tooltip>
										<Tooltip text={ __( 'Move down', 'wing-services-list' ) }>
											<Button
												icon={ chevronDown }
												label={ __( 'Move down', 'wing-services-list' ) }
												size="small"
												disabled={ index === services.length - 1 }
												onClick={ () => moveService( index, 1 ) }
												aria-disabled={ index === services.length - 1 }
											/>
										</Tooltip>
										<Button
											size="small"
											variant={ isEditing ? 'primary' : 'secondary' }
											onClick={ () => setEditingId( isEditing ? null : service.id ) }
											aria-expanded={ isEditing }
											aria-controls={ `wing-card-extras-${ service.id }` }
										>
											{ isEditing
												? __( 'Done', 'wing-services-list' )
												: __( 'Edit link', 'wing-services-list' ) }
										</Button>
										<Tooltip text={ __( 'Remove this service', 'wing-services-list' ) }>
											<Button
												icon={ trash }
												label={ __( 'Remove this service', 'wing-services-list' ) }
												isDestructive
												size="small"
												onClick={ () => removeService( service.id, service.title?.replace( /<[^>]*>/g, '' ) ) }
											/>
										</Tooltip>
									</div>

									{ /* ── Image ── */ }
									<div className="wing-services-list__card-image">
										<MediaUploadCheck
											fallback={
												<p className="wing-services-list__media-fallback">
													{ __( 'You need permission to upload images.', 'wing-services-list' ) }
												</p>
											}
										>
											<MediaUpload
												onSelect={ ( media ) =>
													updateService( service.id, {
														imageUrl: media.sizes?.medium?.url ?? media.url,
														imageId:  media.id,
														imageAlt: media.alt || '',
													} )
												}
												allowedTypes={ [ 'image' ] }
												value={ service.imageId }
												render={ ( { open } ) => (
													<button
														className="wing-services-list__image-btn"
														onClick={ open }
														type="button"
														aria-label={
															service.imageUrl
																? __( 'Change service image', 'wing-services-list' )
																: __( 'Add service image', 'wing-services-list' )
														}
													>
														{ service.imageUrl ? (
															<img
																src={ service.imageUrl }
																alt={ service.imageAlt || '' }
															/>
														) : (
															<span
																className="wing-services-list__image-placeholder"
																aria-hidden="true"
															>
																<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" focusable="false">
																	<rect x="3" y="3" width="18" height="18" rx="2" />
																	<circle cx="8.5" cy="8.5" r="1.5" />
																	<path d="M21 15l-5-5L5 21" />
																</svg>
																<span>{ __( 'Add image', 'wing-services-list' ) }</span>
															</span>
														) }
													</button>
												) }
											/>
										</MediaUploadCheck>
										{ service.imageUrl && (
											<Button
												className="wing-services-list__image-remove"
												isDestructive
												size="small"
												onClick={ () =>
													updateService( service.id, {
														imageUrl: '',
														imageId:  0,
														imageAlt: '',
													} )
												}
												aria-label={ __( 'Remove image from this service', 'wing-services-list' ) }
											>
												{ __( 'Remove image', 'wing-services-list' ) }
											</Button>
										) }
									</div>

									{ /* ── Content ── */ }
									<div className="wing-services-list__card-content">

										{ /* Title */ }
										<div className={ `wing-field${ errors.title ? ' wing-field--error' : '' }` }>
											<RichText
												tagName="h3"
												className="wing-services-list__card-title"
												value={ service.title }
												onChange={ ( val ) => updateService( service.id, { title: val } ) }
												onBlur={ () => markTouched( service.id ) }
												placeholder={ __( 'Service title (required)…', 'wing-services-list' ) }
												aria-required="true"
												aria-invalid={ !! errors.title }
												aria-describedby={ errors.title ? `wing-err-title-${ service.id }` : undefined }
											/>
											{ errors.title && (
												<span
													id={ `wing-err-title-${ service.id }` }
													className="wing-field__error"
													role="alert"
												>
													{ errors.title }
												</span>
											) }
										</div>

										{ /* Description */ }
										<RichText
											tagName="p"
											className="wing-services-list__card-desc"
											value={ service.description }
											onChange={ ( val ) => updateService( service.id, { description: val } ) }
											placeholder={ __( 'Short description…', 'wing-services-list' ) }
											aria-label={ __( 'Service description', 'wing-services-list' ) }
										/>

										{ /* Extended fields (link URL + label) */ }
										<div
											id={ `wing-card-extras-${ service.id }` }
											className="wing-services-list__card-extras"
											hidden={ ! isEditing }
											aria-hidden={ ! isEditing }
										>
											<div className={ `wing-field${ errors.linkUrl ? ' wing-field--error' : '' }` }>
												<TextControl
													label={ __( 'Link URL', 'wing-services-list' ) }
													value={ service.linkUrl }
													onChange={ ( val ) =>
														updateService( service.id, { linkUrl: val } )
													}
													onBlur={ () => markTouched( service.id ) }
													placeholder="https://"
													type="url"
													aria-invalid={ !! errors.linkUrl }
													aria-describedby={ errors.linkUrl ? `wing-err-url-${ service.id }` : undefined }
												/>
												{ errors.linkUrl && (
													<span
														id={ `wing-err-url-${ service.id }` }
														className="wing-field__error"
														role="alert"
													>
														{ errors.linkUrl }
													</span>
												) }
											</div>

											<TextControl
												label={ __( 'Link label', 'wing-services-list' ) }
												value={ service.linkLabel }
												onChange={ ( val ) =>
													updateService( service.id, { linkLabel: val } )
												}
												aria-label={ __( 'Text shown on the link button', 'wing-services-list' ) }
											/>
										</div>

										{ /* Link preview */ }
										{ service.linkUrl && isValidUrl( service.linkUrl ) && (
											<a
												className="wing-services-list__card-link"
												href={ service.linkUrl }
												onClick={ ( e ) => e.preventDefault() }
												tabIndex={ -1 }
												aria-hidden="true"
											>
												{ service.linkLabel || __( 'Learn more', 'wing-services-list' ) }
												<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
													<path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
												</svg>
											</a>
										) }
									</div>
								</li>
							);
						} ) }
					</ol>
				) }

				{ /* Add button */ }
				{ services.length > 0 && (
					<div className="wing-services-list__add-row">
						<Button
							variant="secondary"
							icon={ plus }
							onClick={ addService }
							aria-label={ __( 'Add a new service card', 'wing-services-list' ) }
						>
							{ __( 'Add Service', 'wing-services-list' ) }
						</Button>
					</div>
				) }

				{ /* Live region for screen reader announcements (wp/a11y speak handles this) */ }
			</div>
		</>
	);
}
