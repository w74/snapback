Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
	this.redirect('browse');
});

Router.route('/browse', {
	name: 'browse',
	template: 'mainFilter'
});

Router.route('/mongo', {
	name: 'mongo',
	template: 'login'
});