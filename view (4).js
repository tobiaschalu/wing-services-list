{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "wing/services-list",
	"version": "1.0.0",
	"title": "Wing Services List",
	"category": "widgets",
	"icon": "screenoptions",
	"description": "Display a list of services with title, description, and image.",
	"keywords": ["services", "wing", "list", "cards"],
	"textdomain": "wing-services-list",
	"attributes": {
		"services": {
			"type": "array",
			"default": [],
			"items": {
				"type": "object",
				"properties": {
					"id": { "type": "string" },
					"title": { "type": "string" },
					"description": { "type": "string" },
					"imageUrl": { "type": "string" },
					"imageId": { "type": "number" },
					"imageAlt": { "type": "string" },
					"linkUrl": { "type": "string" },
					"linkLabel": { "type": "string" }
				}
			}
		},
		"columns": {
			"type": "number",
			"default": 3
		},
		"headingText": {
			"type": "string",
			"default": "Our Services"
		},
		"subheadingText": {
			"type": "string",
			"default": "What we can do for you"
		},
		"showHeading": {
			"type": "boolean",
			"default": true
		},
		"cardStyle": {
			"type": "string",
			"default": "shadow"
		},
		"accentColor": {
			"type": "string",
			"default": "#2563EB"
		}
	},
	"supports": {
		"html": false,
		"align": ["wide", "full"],
		"spacing": {
			"padding": true,
			"margin": true
		},
		"color": {
			"background": true,
			"text": true
		}
	},
	"editorScript": "file:./index.js",
	"editorStyle": "file:./index.css",
	"style": "file:./style-index.css",
	"render": "file:./render.php",
	"viewScript": "file:./view.js"
}
