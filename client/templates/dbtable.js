var DBCOUNT = new ReactiveVar(0);
Session.set('cphoto', null);

Template.dbtable.helpers({
	// The count here is implmented mainly as a method to see whether an add or delete call was fulfuilled
	ct(){return DBCOUNT.get();},
	photo(){return Session.get('cphoto');}
});

Template.login.events({
	// Checks password conformity
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
	// Show total number of images on page load
	Meteor.call('dbCount', {}, function(e, r){
		DBCOUNT.set(r);
	});
})

Template.dbtable.events({

	// Pulls all info from table, creates a new image, and adds it to the Mongo database
	'click #snap-add'(event){
		var args = $('.table  tbody tr').map(function(){
			var row = $(this);
			return row.find(':nth-child(2)').text();
		}).get();
		if(args[0].length != 6){
			$('#snap-add').transition('flash');
			return;
		}
		args[0] = args[0].toUpperCase();
		if(args[3]){args[3] = args[3].trim().split(',');}
		if(args[4]){args[4] = args[4].trim().split(',');}
		if(args[5]){args[5] = args[5].trim().split(',');}
		Meteor.call('addImage', args);
		dbtableClear();
	},

	// Removes an image by ID. Only the first column of the table matters in this method call
	'click #snap-del'(event){
		var hash = $('.table  tbody tr').eq(0).find(':nth-child(2)').text();
		if(hash.length != 6){
			$('#snap-del').transition('flash');
			return;
		}
		Meteor.call('delImage', hash);
		dbtableClear();
	},

	// Gets the data associated with a particular image and fills in the table so it's ready for editing
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

// Wipes the table clean
function dbtableClear(){
	$('td[contenteditable]').text('');

	Meteor.call('dbCount', {}, function(e, r){
		DBCOUNT.set(r);
	});
}