if(!Session.get('f1')){Session.set('f1', "")};
if(!Session.get('f2')){Session.set('f2', "")};
if(!Session.get('f3')){Session.set('f3', [])};
Session.set('f2Opt', []);
Session.set('f3Opt', []);
var DECK = new ReactiveVar(PHOTOBOOK.find({}));

Template.filters.helpers({
	f1Opt(){return TAXONOMY.filters;},
	f2Opt(){return Session.get('f2Opt');},
	f3Opt(){return Session.get('f3Opt');},
	deck(){return DECK;}
});

Template.filters.onRendered(() => {
	$('.ui.dropdown').dropdown({
		maxSelections: 3,
		placeholder: false
	});
});

Template.filters.events({
	// 'change #snap-filter1'(event){
	// 	let val = event.target.value;
	// 	//Reset other two dropdowns
	// 	if(val != ''){
	// 		$('#snap-filter2').removeClass('disabled').dropdown('clear').dropdown('set text', 'Category');
	// 		Session.set('f2Opt', TAXONOMY[val].filters);
	// 	}
	// 	else{
	// 		$('#snap-filter2').addClass('disabled').dropdown('clear').dropdown('set text', 'Category');
	// 	}
	// 	$('#snap-filter3').addClass('disabled').dropdown('clear').dropdown('set text', 'Subfilter');
	// 	//update values
	// 	Session.set('f1', val);
	// 	//requeryDeck(1);
	// },

	// 'change #snap-filter2'(event){
	// 	let val = event.target.value;
	// 	//if subfilters exist, enable third filter
	// 	if(typeof(TAXONOMY[Session.get('f1')][val]) != 'undefined'){
	// 		$('#snap-filter3').removeClass( 'disabled').dropdown('clear').dropdown('set text', 'Subfilter');
	// 		//update values
	// 		Session.set('f3Opt', TAXONOMY[Session.get('f1')][val]);
	// 	} else {
	// 		$('#snap-filter3').dropdown('clear').dropdown('set text', 'No Subfilters');
	// 	}
	// 	Session.set('f2', val);
	// 	//requeryDeck(2);
	// },

	// 'change #snap-filter3'(event){
	// 	//get array of subfilters
	// 	var subfilters = event.target.value.split(',');
	// 	Session.set('f3', subfilters);
	// 	//requeryDeck(3);
	// }
	 
	'change nav .selection'(event){
		console.log(event);
		if(event.target.value != ''){
			$(event.currentTarget).next('.selection').removeClass('disabled');
		}
		$(event.currentTarget).nextAll('.selection').dropdown('clear');
	}
});

function requeryDeck(i){
	switch(i){
		case 1:
			Meteor.call('findImagesViaFilters', Session.get('f1'));
			break;
		case 2:
			Meteor.call('findImagesViaFilters', Session.get('f1'), Session.get('f2'));
			break;
		case 3:
			Meteor.call('findImagesViaFilters', Session.get('f1'), Session.get('f2'), Session.get('f3'));
			break;
	}
}