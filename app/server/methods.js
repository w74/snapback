Meteor.methods({
	checkLogin(p){
		let PASS = "zoidberg";
		if(p.toLowerCase().trim() == PASS){
			return true;
		}
		return false;
	},

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

	addPopularity(id){
		PHOTOBOOK.update({_id: id}, {$inc: {popularity: 1}});
	},

	delImage(hash){
		PHOTOBOOK.remove({hash: hash});
	},

	dbCount(q){
		return PHOTOBOOK.find(q).count();
	},

	findImageViaHash(hash){
		let a = PHOTOBOOK.findOne({hash: hash});
		if(a){return a;}
		else{return undefined;}
	},

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
			limit: 24
		}).fetch();
	}
});