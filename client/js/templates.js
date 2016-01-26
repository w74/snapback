////////////////////////
// Reactive Variables //
////////////////////////
var tree = new ReactiveVar("");


//////////////////////
// Template Helpers //
//////////////////////
Template.landing.helpers({
	filters(){return TAXONOMY.filters;}
});

Template.rail.helpers({
	steps(){return tree.get();}
});

/////////////////////
// Template Events //
/////////////////////
Template.landing.events({
	'click .snap-f'(){
		console.log(this);
	},
});
