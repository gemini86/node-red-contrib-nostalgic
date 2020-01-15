const moment = require('moment');

class IntervalTimer {
	constructor(callback, time) {
		this.timerId = setInterval(callback, time);
	}
	clear() {
		clearInterval(this.timerId);
		return this.timerId;
	}
}

module.exports = function(RED) {
	function NostalgicNode(config) {
		RED.nodes.createNode(this,config);

		var node = this;
		var interval;

		node.interval = config.interval * 1000;
		node.outputProp = config.outputProp || 'nostalgic';
		node.attach = config.attach == undefined ? true : config.attach;
		node.lastMsg = {
			resend: config.resend
		};

		var resendFunction = (m) => {
			let timestamp = m.msg.timestamp || m.timestamp;
			let duration = timestamp - Date.now();
			let n = moment.duration(duration).humanize(true);
			if (m.resend) {
				m.msg[node.outputProp] = n;
				node.send(m.msg);
			} else {
				let id = RED.util.generateId();
				let newMsg = { _msgid: id };
				newMsg[node.outputProp] = n;
				node.send(newMsg);
			}
		};

		node.on('input', function(msg, send, done) {
			send = send || function() { node.send.apply(node,arguments); };
			node.lastMsg.msg = RED.util.cloneMessage(msg);
			node.lastMsg.timestamp = Date.now();

			function errorHandler (err) {
				if (done) {
					done(err);
				} else {
					node.error(err, msg);
				}
			}

			if (msg.timestamp != undefined) {
				if (isNaN(msg.timestamp)) {
					errorHandler('msg.timestamp is not a number.', msg);
				}
			}

			if (node.attach == true) {
				if (msg.timestamp) {
					msg[node.outputProp] = moment.duration(msg.timestamp - Date.now()).humanize(true);
				} else {
					msg[node.outputProp] = 'just now';
				}
			}

			node.send(msg);

			if (interval != undefined) {
				interval.clear();
			}

			interval = new IntervalTimer(function() {resendFunction(node.lastMsg);}, node.interval);

			if (done) {
				done();
			}
		});

		node.on('close', function(done) {
			interval.clear();
			done();
		});
	}

	RED.nodes.registerType('nostalgic', NostalgicNode);
};
