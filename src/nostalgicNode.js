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
		var resendFunction = (m) => {
			let duration = m.timestamp - Date.now();
			let n = moment.duration(duration).humanize(true);
			if (m.resend) {
				m.msg.nostalgic = n;
				node.send(m.msg);
			} else {
				let id = RED.util.generateId();
				node.send({ _msgId: id, nostalgic: n });
			}
		};

		node.interval = config.interval * 1000;
		node.lastMsg = {
			resend: config.resend
		};

		node.on('input', function(msg, send, done) {
			send = send || function() { node.send.apply(node,arguments); };
			node.lastMsg.msg = RED.util.cloneMessage(msg);
			node.lastMsg.timestamp = Date.now();
			node.send(msg);
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
