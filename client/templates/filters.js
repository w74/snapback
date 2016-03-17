Session.set('f1', '');				// Selected value of the first filter
Session.set('f2', null);			// Selected value of the second filter
Session.set('f3', null);			// Selected value(s) of the third filter
Session.set('f2Opt', []);			// Available options pulled from Taxonomy.js
Session.set('f3Opt', []);			// Available options pulled from Taxonomy.js
Session.set('scroll', 0);			// Counter for how many times lazy-load has been called
DECK = new ReactiveVar([]);		// Results from a Filter search

//MainFilter
Template.mainFilter.helpers({
	deck(){return DECK.get();}
});

Template.mainFilter.onCreated(() => {
	window.addEventListener("scroll", (e) => {
		if(e.view.scrollY == $(document).height()-$(window).height()){
			Session.set('scroll', Session.get('scroll')+1);
			var query = {
				f1: Session.get('f1'),
				f2: Session.get('f2'),
				f3: Session.get('f3'),
				srt: $('#snap-sort').val().split(','),
				skip: Session.get('scroll')
			};
			Meteor.call('findImagesViaFilters', query,
				function(e, r){
					if(e){console.log(e); return;}
					DECK.set(DECK.get().concat(r));
				}
			);
		}
	});
})

Template.mainFilter.events({
	'click .card .image'(event){
		// Every time an image is clicked on, the popularity increments by 1
		Meteor.call('addPopularity', this._id);
	}
});

// Filters
Template.filters.helpers({
	f1Opt(){return TAXONOMY.filters ;},
	f2Opt(){return Session.get('f2Opt');},
	f3Opt(){return Session.get('f3Opt');},
});

Template.filters.onRendered(() => {
	// Initiate the dropdowns and search All Images
	$('.ui.dropdown').dropdown({
		maxSelections: 3,
		placeholder: false
	});
	$('#snap-go').click();
});

Template.filters.events({
	'change #snap-filter1'(event){
		let val = event.target.value;
		if(val != ''){Session.set('f2Opt', TAXONOMY[val].filters);}
		//update values
		Session.set('f1', val);
	},

	'change #snap-filter2'(event){
		let val = event.target.value;
		//if subfilters exist, enable third filter
		if(Session.get('f1') && TAXONOMY[Session.get('f1')][val] != undefined){
			//update values
			Session.set('f3Opt', TAXONOMY[Session.get('f1')][val]);
		}
		Session.set('f2', val);
	},

	'change #snap-filter3'(event){
		//get array of subfilters
		var subfilters = $(event.target).dropdown('get value').pop();
		Session.set('f3', subfilters);
	},
	 
	'change nav .selection'(event){
		let val = event.target.value;
		$(event.currentTarget).nextAll('.selection').addClass('disabled').dropdown('clear');
		if(TAXONOMY[val] || (TAXONOMY[Session.get('f1')] && TAXONOMY[Session.get('f1')][val])){
			$(event.currentTarget).next('.selection').removeClass('disabled');
		}
		Session.set('scroll', 0);
	},

	'click #snap-go'(event){
		var query = {
			f1: Session.get('f1'),
			f2: Session.get('f2'),
			f3: Session.get('f3'),
			srt: $('#snap-sort').val().split(','),
			skip: Session.get('scroll')
		};
		Meteor.call('findImagesViaFilters', query,
			function(e, r){
				if(e){console.log(e); return;}
				DECK.set(r);
			}
		);
	}
});