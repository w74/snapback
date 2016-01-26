Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', {
	name: 'landing',
	template: 'landing'
});

Router.route('/f/:fTree', {
	name: 'filter',
	template: 'images',
	data: {
		steps(){
			var tree = this.params.fTree.split('-');
			var steps = [];
			for(var i = 0; i < tree.length; i++){
				steps[i] = {text: tree[i]};
				if(i == 0){steps[i].route = "/f/" + tree[0];}
				else{steps[i].route = steps[i-1].route + "-" + tree[i];}
			}
			return steps;
		}
	}
});