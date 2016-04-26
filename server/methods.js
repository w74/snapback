Meteor.methods({

	/**
	 *  [Login check to access Mongo Database. Intended only for internal use.]
	 *  @param {String} p [password]
	 *  @return {Boolean} [return true if password matches, false otherwise]
	 */
	checkLogin(p){
		let PASS = "SUPER SECRET PASSWORD";
		if(p.toLowerCase().trim() == PASS){
			return true;
		}
		return false;
	},

	/**
	 *  [Add a new image entry to the Mongo database]
	 *  @param {Array} arr [array of values to insert into DB]
	 */
	addImage(arr){
		PHOTOBOOK.upsert({hash: arr[0]}, {
			$setOnInsert: {
				hash: arr[0],
				date: new Date(),
				popularity: 0
			},
			$set: {
				link: arr[1],
				thumb: arr[2],
				filter1: arr[3],
				filter2: arr[4],
				filter3: arr[5],
				attr: arr[6],
				source: arr[7]
			}
		});
	},

	/**
	 *  [Increment an image's popularity]
	 *  @param {String} id [ID of a photo]
	 */
	addPopularity(id){
		PHOTOBOOK.update({_id: id}, {$inc: {popularity: 1}});
	},

	/**
	 *  [Remove an image from the Mongo database by ID]
	 *  @param {String} hash [ID of a photo]
	 */
	delImage(hash){
		PHOTOBOOK.remove({hash: hash});
	},

	/**
	 *  [Gets the total number of images in the Mongo database]
	 *  @param {String} q [query, in this case, all photos]
	 *  @return {Int} [return number of photos in DB]
	 */
	dbCount(q){
		return PHOTOBOOK.find(q).count();
	},

	/**
	 *  [Finds an images and its associated data by ID]
	 *  @param {String} hash [ID of a photo]
	 *  @return {Object} [return found image or return undefined if no image found]
	 */
	findImageViaHash(hash){
		let a = PHOTOBOOK.findOne({hash: hash});
		if(a){return a;}
		else{return undefined;}
	},

	/**
	 *  [Finds all images and their associated data by filter]
	 *  @param {Object} q [filters from the page]
	 *  @return {Object} [results from MongoDB query]
	 */
	findImagesViaFilters(q){
		let query = {};
		if(q.f1){
			query.filter1 = q.f1;
		}
		if(q.f2){
			query.filter2 = q.f2;
		}
		if(q.f3){
			query.filter3 = {$all: q.f3};
		}
		return PHOTOBOOK.find(query, {
			sort: [q.srt],
			skip: q.skip * 20,
			limit: 16
		}).fetch();
	}
});