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

Router.route('/browse/:fTree', {
	template: 'mainFilter',
	onAfterAction: function(){
		let fTree = this.params.fTree.split('-');
		if(fTree[2]){
			fTree[2] = fTree[2].split(',');
		}
		fTree.forEach((val, i, arr) => {
			Session.set('f' + (i + 1), val);
		});
	}
});

Router.route('/mongo', {
	name: 'mongo',
	template: 'login'
});