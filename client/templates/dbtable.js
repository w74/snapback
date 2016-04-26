var DBCOUNT = new ReactiveVar(0);
Session.set('cphoto', null);

Template.dbtable.helpers({
	// The count here is implmented mainly as a method to see whether an add or delete call was fulfuilled
	ct(){return DBCOUNT.get();},
	photo(){return Session.get('cphoto');}
});

Template.login.events({
	/**
	 *  [On login page, if password is valid, render the database table. Else, show error box]
	 */
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

	/**
	 *  [Pulls all data from table, creates a new Image object, and sends ito the DB.]
	 */
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

	/**
	 *  [Removes an image from the DB. Only the first input (ID) is considered]
	 */
	'click #snap-del'(event){
		var hash = $('.table  tbody tr').eq(0).find(':nth-child(2)').text();
		if(hash.length != 6){
			$('#snap-del').transition('flash');
			return;
		}
		Meteor.call('delImage', hash);
		dbtableClear();
	},

	/**
	 *  [Gets the data associated with a particular image and fills in the table so it's ready for editing]
	 */
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

/**
	 *  [Wipes the table]
	 */
function dbtableClear(){
	$('td[contenteditable]').text('');

	Meteor.call('dbCount', {}, function(e, r){
		DBCOUNT.set(r);
	});
}