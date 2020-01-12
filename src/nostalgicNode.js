const moment = require('moment');

module.exports = function(RED) {
	function NostalgicNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.lastMsg = {
			interval: config.interval * 1000,
			resend: config.resend,

		};
		var interval;
		var intervalHandler = {
			set: function (msg) {
				interval = setInterval(() => {
					resendFunction(msg);
				}, node.lastMsg.interval);
			},
			clear: function (interval) {
				clearInterval(interval);
			}
		};
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
		node.on('input', function(msg, send, done) {
			send = send || function() { node.send.apply(node,arguments); };
			node.lastMsg.msg = RED.util.cloneMessage(msg);
			node.lastMsg.timestamp = Date.now();
			node.send(msg);
			intervalHandler.set(node.lastMsg);
			if (done) {
				done();
			}
		});
		node.on('close', function(done) {
			intervalHandler.clear(interval);
			done();
		});
	}
	RED.nodes.registerType('nostalgic', NostalgicNode);
};
