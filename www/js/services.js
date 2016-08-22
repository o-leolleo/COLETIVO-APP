angular.module('starter.services', [])

.factory('Voting', function($rootScope) {
	// armazena vetor de canais inscritos
	var channels = []; 

	return {
		all: function() {
			return channels; 
		}, 

		add: function(name) {
			if (this.get(name) !== null) 
				return false;

			channels.push({
				name: name,
				state: "subscribed",
				options: [],
				schedule: "",

				result: {
					labels: [],
					data:   []
				}
			});

			return true;
		},

		addOptions: function(votacao, options, desc) {
			for (var i = 0; i < channels.length; ++i)
				if (channels[i].name === votacao) {
					console.log("adding options: " + options);
					channels[i].options = options.split("#");
					channels[i].schedule = desc;
					return true;
				} 

			return false;
		},

		addResults: function(votacao, labels, data) {
			var current = this.get(votacao);	

			current.result.labels = labels.split("#"); 
			current.result.data   = data.split("#");

			console.log("results added to " + current.name); 
		},

		remove: function(votacao) {
			console.log(votacao);

			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === votacao) {
					console.log(channels[i].name);
					channels.splice(i, 1);
					console.log("unsubscribe in Coletivo_" + votacao);
					return true;
				}
			}
				
			console.log("sem sucesso");
			return false;
		},

		get: function (votacao) {
			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === votacao)
					return channels[i];
			}

			return null;
		},

		nextState: function (channel) {
			var toEval = this.get(channel);

			switch(toEval.state) {
			case "subscribed": toEval.state = "waiting"; break;
			case    "waiting": toEval.state =  "voting"; break;
			case     "voting": toEval.state =   "voted"; break;
			case      "voted": toEval.state ="finished"; break;
			case   "finished": {
					toEval.options  = [];
					toEval.schedule = "";
					toEval.result   = {
						labels: [],
						data:   []
					}
					toEval.state = "waiting";
				}break;
			}
		}
	};
})

.factory('Owned', function($rootScope) {
	var channels = [];	

	return {
		all: function() {
			return channels; 
		}, 

		add: function(name) {
			channels.push({
				name: name,
				options: {},
				schedule: "",
				state: "born"
			});
		},

		addOptions: function(votacao, options, desc) {
			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === votacao) {
					console.log("adding options: " + options);
					channels[i].schedule = desc;

					for (var opt in options.split("#"))
						channels[i].options[options.split("#")[opt]] = 0;

					return true;
				} 
			}

			return false;
		},

		remove: function(votacao) {
			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === votacao) {
					channels.splice(i, 1);
					console.log("unsubscribe in Coletivo_" + votacao);

					return true;
				}

				console.log(channels[i].name);
			}
				
			console.log("sem sucesso");
			return false;
		},

		get: function (channel) {
			for (var i = 0; i < channels.length; ++i) {
				if (channels[i].name === channel)
					return channels[i];
			}

			return null;
		},

		nextState: function (channel) {
			var toEval = this.get(channel);

			switch (toEval.state) {
			case  "born"   : toEval.state =  "created"; break;
			case  "created": toEval.state =  "started"; break;
			case  "started": toEval.state = "finished"; break;
			case "finished": {
					toEval.options  = {};
					toEval.schedule = "";
					toEval.state = "born";
				} break;
			}
		}
	};
});

