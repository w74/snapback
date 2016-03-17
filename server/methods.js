Meteor.methods({

	// Login check to access Mongo Database. Intended only for internal use.
	checkLogin(p){
		let PASS = "SUPER SECRET PASSWORD";
		if(p.toLowerCase().trim() == PASS){
			return true;
		}
		return false;
	},

	// Add a new image entry to the Mongo database
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

	// Increment an image's popularity
	addPopularity(id){
		PHOTOBOOK.update({_id: id}, {$inc: {popularity: 1}});
	},

	// Remove an image from the Mongo database by ID
	delImage(hash){
		PHOTOBOOK.remove({hash: hash});
	},

	// Gets the total number of images in the Mongo database
	dbCount(q){
		return PHOTOBOOK.find(q).count();
	},

	// Finds an images and its associated data by ID
	findImageViaHash(hash){
		let a = PHOTOBOOK.findOne({hash: hash});
		if(a){return a;}
		else{return undefined;}
	},

	// Finds all images and their associated data by filter
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