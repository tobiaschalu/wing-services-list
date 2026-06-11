/**
 * Wing Services List – Frontend & Shared Styles
 */

/* ── Custom properties ────────────────────────────────────────────────── */
.wing-services-list {
	--wing-accent:        #2563EB;
	--wing-accent-light:  color-mix(in srgb, var(--wing-accent) 10%, white);
	--wing-text:          #111827;
	--wing-muted:         #6B7280;
	--wing-surface:       #FFFFFF;
	--wing-border:        #E5E7EB;
	--wing-radius:        12px;
	--wing-radius-sm:     8px;
	--wing-shadow:        0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.07);
	--wing-shadow-hover:  0 4px 8px rgba(0,0,0,.10), 0 12px 32px rgba(0,0,0,.12);
	--wing-transition:    all .22s cubic-bezier(.4,0,.2,1);

	box-sizing: border-box;
}

.wing-services-list *,
.wing-services-list *::before,
.wing-services-list *::after {
	box-sizing: inherit;
}

/* ── Header ───────────────────────────────────────────────────────────── */
.wing-services-list__header {
	text-align: center;
	margin-bottom: 2.5rem;
}

.wing-services-list__heading {
	font-size: clamp(1.5rem, 3vw, 2.25rem);
	font-weight: 700;
	color: var(--wing-text);
	margin: 0 0 .5rem;
	line-height: 1.2;
}

.wing-services-list__subheading {
	font-size: 1.0625rem;
	color: var(--wing-muted);
	margin: 0;
	line-height: 1.6;
}

/* ── Grid ─────────────────────────────────────────────────────────────── */
.wing-services-list__grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: 1fr; /* mobile default */
}

@media (min-width: 640px) {
	.wing-services-list__grid--2,
	.wing-services-list__grid--3,
	.wing-services-list__grid--4 {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1024px) {
	.wing-services-list__grid--3 { grid-template-columns: repeat(3, 1fr); }
	.wing-services-list__grid--4 { grid-template-columns: repeat(4, 1fr); }
}

/* ── Card – base ──────────────────────────────────────────────────────── */
.wing-services-list__card {
	background: var(--wing-surface);
	border-radius: var(--wing-radius);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	transition: var(--wing-transition);
	position: relative;
}

/* Card style: shadow (default) */
.wing-services-list__card--shadow {
	box-shadow: var(--wing-shadow);
}
.wing-services-list__card--shadow:hover {
	box-shadow: var(--wing-shadow-hover);
	transform: translateY(-3px);
}

/* Card style: border */
.wing-services-list__card--border {
	border: 1.5px solid var(--wing-border);
}
.wing-services-list__card--border:hover {
	border-color: var(--wing-accent);
}

/* Card style: flat */
.wing-services-list__card--flat {
	background: var(--wing-accent-light);
}

/* ── Card image ───────────────────────────────────────────────────────── */
.wing-services-list__card-image {
	aspect-ratio: 16 / 9;
	overflow: hidden;
	background: var(--wing-border);
}

.wing-services-list__card-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	transition: transform .4s cubic-bezier(.4,0,.2,1);
}

.wing-services-list__card:hover .wing-services-list__card-image img {
	transform: scale(1.04);
}

/* ── Card content ─────────────────────────────────────────────────────── */
.wing-services-list__card-content {
	padding: 1.25rem 1.375rem 1.5rem;
	display: flex;
	flex-direction: column;
	flex: 1;
}

.wing-services-list__card-title {
	font-size: 1.0625rem;
	font-weight: 700;
	color: var(--wing-text);
	margin: 0 0 .5rem;
	line-height: 1.3;
}

.wing-services-list__card-desc {
	font-size: .9375rem;
	color: var(--wing-muted);
	line-height: 1.6;
	margin: 0;
	flex: 1;
}

/* ── Card link ────────────────────────────────────────────────────────── */
.wing-services-list__card-link {
	display: inline-flex;
	align-items: center;
	gap: .35em;
	margin-top: 1.125rem;
	font-size: .9rem;
	font-weight: 600;
	color: var(--wing-accent);
	text-decoration: none;
	transition: gap .2s ease;
}

.wing-services-list__card-link:hover {
	gap: .55em;
	text-decoration: underline;
}

.wing-services-list__card-link svg {
	width: 1em;
	height: 1em;
	flex-shrink: 0;
}

/* ── Accent stripe on hover (border style) ────────────────────────────── */
.wing-services-list__card--border::before {
	content: '';
	position: absolute;
	top: 0; left: 0; right: 0;
	height: 3px;
	background: var(--wing-accent);
	transform: scaleX(0);
	transform-origin: left;
	transition: transform .25s ease;
	border-radius: var(--wing-radius) var(--wing-radius) 0 0;
}
.wing-services-list__card--border:hover::before {
	transform: scaleX(1);
}

/* ── Alignment ────────────────────────────────────────────────────────── */
.alignwide .wing-services-list__grid,
.wp-block-wing-services-list.alignwide .wing-services-list__grid {
	max-width: 100%;
}
