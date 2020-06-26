Module.register("mami-conversation-ui",{
	// Default module config.
	defaults: {
		text: "Foo!"

	},

	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		var statusImage = document.createElement("img");
        //wrapper.className = 'simple-logo__container';
        //wrapper.classList.add(this.config.position);
        //wrapper.style.width = this.config.width;
		//var img = document.createElement("img");
		var filePath = this.name + "/" + this.status + ".png";
		statusImage.setAttribute('src', filePath);
		statusImage.style.width = "10%";
		wrapper.appendChild(statusImage);

		//var statusElem = document.createElement("div");
		//statusElem.className = "bright small light";
		//statusElem.innerHTML = "<< " + this.translate(this.status) + " >>";
		//wrapper.appendChild(statusElem);

		var input = document.createElement("div");
		input.className = "medium light";
		input.innerHTML = this.currentSpeechInput;
		wrapper.appendChild(input);

		var output = document.createElement("div");
		output.className = "bright medium light";
		output.innerHTML = this.currentSpeechOutput;
		wrapper.appendChild(output);

		return wrapper;
	},

  loaded: function(callback) {
	   this.finishLoading();
	   console.log(this.name + ' is loaded!*****************');
	   callback();
  },

  start: function() {
    Log.log(this.name + " is started!*******");
		this.currentSpeechInput = "";
		this.currentSpeechOutput = "";
		this.status = 'INITIALISING';

    this.sendSocketNotification("HANDSHAKE", "Send notitifcation to module helper in order to establish two-way connection");

  },

	getTranslations: function() {
		return {
				fi: "fi.json"
		}
	},

	processMirrorActions: function(actions) {
		console.log("Enter processMirrorActions(), actions: " + actions);

		if (actions == undefined || actions.length == 0) {
			console.log("No actions to process");
			return;

		} else {
			console.log("Actions length: " + actions.length);
			for (var i = 0; i < actions.length; i++) {
				var action = actions[i];
				console.log("Processing mirror action: " + action);

				switch (action) {
					case 'showSensorTag':
						MM.getModules().withClass('mami-sensortag').enumerate(function (module) {
							console.log('Enumerating through module: ' + module.name);
							module.show(1000);
						});
						break;

					case 'hideSensorTag':
						MM.getModules().withClass('mami-sensortag').enumerate(function (module) {
							console.log('Enumerating through module: ' + module.name);
							module.hide(1000);
						});
						break;

					default:
						console.log('Unknown action, nothing to do');
				}
			}

		}

	},

  socketNotificationReceived: function(notification, payload) {


    Log.log("Notification received, notification: " + notification + ", payload: " + payload);

		if (notification == "speech_transcript") {
    		this.currentSpeechInput = payload.transcript;
			this.currentSpeechOutput = "";

		} else if (notification == "response_transcript") {
			this.currentSpeechOutput = payload;

		} else if (notification == "STATUS") {
			this.status = payload;

		} else if (notification == 'mirror_actions') {
			this.processMirrorActions(payload);
		}

    this.updateDom();

	},

});
