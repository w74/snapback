var DBCOUNT = new ReactiveVar(0);
Session.set('cphoto', null);

Template.dbtable.helpers({
	ct(){return DBCOUNT.get();},
	photo(){return Session.get('cphoto');}
});

Template.login.events({
	'click .snap-login-submit'(event){
		Meteor.call('checkLogin', $('[name=mongopass]').val(), function(error, result){
			if(result){
				Router.current().render('dbtable');
			} else {
				$('.ui.form').addClass('error');
				setTimeout(() => {$('.ui.form').removeClass('error');}, 3000);
			}
		});
	}
});

Template.dbtable.onRendered(() => {
	Meteor.call('dbCount', {}, function(e, r){
		DBCOUNT.set(r);
	});
})

Template.dbtable.events({
	'click #snap-add'(event){
		var args = $('.table  tbody tr').map(function(){
			var row = $(this);
			return row.find(':nth-child(2)').text();
		}).get();
		args[0] = args[0].toUpperCase();
		if(args[3]){args[3] = args[3].trim().split(',');}
		if(args[4]){args[4] = args[4].trim().split(',');}
		if(args[5]){args[5] = args[5].trim().split(',');}
		Meteor.call('addImage', args);
		dbtableClear();
	},

	'click #snap-del'(event){
		var hash = $('.table  tbody tr').eq(0).find(':nth-child(2)').text();
		console.log(hash);
		Meteor.call('delImage', hash);
		dbtableClear();
	},

	'click #snap-loadMeta'(event){
		var hash = $('#snap-searchMeta').val().toUpperCase();
		if(hash.length != 6){
			$('#snap-loadMeta').transition('flash');
			return;
		}
		Meteor.call('findImageViaHash', hash, function(e, r){
			if(e){console.log(e);}
			if(r){Session.set('cphoto', r);}
		});
	}
})

function dbtableClear(){
	$('td[contenteditable]').text('');

	Meteor.call('dbCount', {}, function(e, r){
		DBCOUNT.set(r);
	});
}