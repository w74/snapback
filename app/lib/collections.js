/**
 *  [PHOTOBOOK contains all references and IDs to stock photos]
 *  @properties:
 *  	hash - 6 character alphanumeric identifer, all caps
 *  	link - download link if possible, website link otherwise, self-hosted link if image is unavailable from source
 *  	thumb - link to thumbnail file hosted on ImageVenue
 *  	source - unsplash, pexels, etc.
 *  	filter1 - [array]
 *  	filter2 - [array]
 *  	filter3 - [array]
 *  	date - date of upload
 *  	attr: photographer
 *  	popularity: number of downloads
 *  	
 *  @example: {
 *  	hash: 'IQTQWK',
 *  	link: 'https://images.unsplash.com/photo-1446108440972-3798c860067c?fm=jpg',
 *  	thumb: 'http://example.com/example.jpg'
 *  	source: 'unsplash',
 *  	filter1: [],
 *  	filter2: [],
 *  	filter3: [],
 *  	date: new Date(),
 *  	attr: 'Sergey Zolkin',
 *  	popularity: 0
 *  }
 */
PHOTOBOOK = new Mongo.Collection('photobook');