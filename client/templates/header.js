Template.header.events({

	// Pulls the search ID and redirects the window directly to the image
	'click .search.link'(event){
		let searchID = $('.snap-search input').val().toUpperCase();
		if(searchID.length !== 6){
			$(event.currentTarget).transition('jiggle');
		}
		else{
			Meteor.call('findImageViaHash', searchID, function(e, r){
				if(e){console.log(e); return;}
				window.location.assign(r.link);
			})
		}
	}
})