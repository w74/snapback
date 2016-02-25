Session.set('f1', '');
Session.set('f2', null);
Session.set('f3', null);
Session.set('f3Opt', []);
Session.set('scroll', 0);
DECK = new ReactiveVar([]);

//MainFilter
Template.mainFilter.helpers({
	deck(){return DECK.get();}
});

Template.mainFilter.events({
	'click .card .image'(event){
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