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

/**
 *  [After the main filter is created, implements lazy loading based on scroll position]
 */
Template.mainFilter.onCreated(() => {
	window.addEventListener("scroll", (e) => {
		if($(e.target).scrollTop() == $(document).height()-$(window).height()){
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

/**
 *  [After filters are loaded, searches all photos]
 */
Template.filters.onRendered(() => {
	$('.ui.dropdown').dropdown({
		maxSelections: 3,
		placeholder: false
	});
	$('#snap-go').click();
});

Template.filters.events({
	/**
	 *  [On filter 1 change, record new value]
	 */
	'change #snap-filter1'(event){
		let val = event.target.value;
		if(val != ''){Session.set('f2Opt', TAXONOMY[val].filters);}
		//update values
		Session.set('f1', val);
	},

	/**
	 *  [On filter 2 change, if filter 1 is valid, record new value]
	 */
	'change #snap-filter2'(event){
		let val = event.target.value;
		//if subfilters exist, enable third filter
		if(Session.get('f1') && TAXONOMY[Session.get('f1')][val] != undefined){
			//update values
			Session.set('f3Opt', TAXONOMY[Session.get('f1')][val]);
		}
		Session.set('f2', val);
	},

	/**
	 *  [On filter 3 change, record new value]
	 */
	'change #snap-filter3'(event){
		//get array of subfilters
		var subfilters = $(event.target).dropdown('get value').pop();
		Session.set('f3', subfilters);
	},
	 
	/**
	 *  [Anytime a filter changes, clears and resets all filter to the right of it]
	 */ 
	'change nav .selection'(event){
		let val = event.target.value;
		$(event.currentTarget).parent().nextAll().children('.selection').dropdown('clear').addClass('disabled');
		if(TAXONOMY[val] || (TAXONOMY[Session.get('f1')] && TAXONOMY[Session.get('f1')][val])){
			$(event.currentTarget).parent().next().children('.selection').removeClass('disabled');
		}
		Session.set('scroll', 0);
	},

	/**
	 *  [Pull all values from the filters, including sort order, and send the query to the DB]
	 */
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