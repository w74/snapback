/**
 *  [PHOTOBOOK contains all references and IDs to stock photos]
 *  @properties:
 *  	hash - 6 character alphanumeric identifer, all caps
 *  	source - unsplash, pexels, etc.
 *  	link - download link if possible, website link otherwise, self-hosted link if image is unavailable from source
 *  	size - S(<1280), M(<2480), B(<3508), L(<4961), X(<7016), H(>7017)
 *  	filter1 - 'string'
 *  	filter2 - 'string'
 *  	filter3 - 'array'
 *  	date - date of upload
 *  	attr: photographer
 *  	
 *  @example: {
 *  	hash: 'IQTQWK',
 *  	source: 'unsplash',
 *  	link: 'https://images.unsplash.com/photo-1446108440972-3798c860067c?fm=jpg',
 *  	size: 'B',
 *  	filter1: '',
 *  	filter2: '',
 *  	filter3: [],
 *  	date: new Date(),
 *  	attr: 'Sergey Zolkin'
 *  }
 */
PHOTOBOOK = new Mongo.Collection('photobook');