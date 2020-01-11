const moment = require('moment');

module.exports = function(RED) {
	function NostalgicNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.interval = config.interval * 1000;
		node.resend = config.resend;
		var msgStore = {};
		msgStore.resend = node.resend;
		node.intervalFunction = function () {
			node.setInterval = setInterval(() => {
				resendFunction(msgStore);
			}, node.interval);
		};
		function resendFunction (m) {
			let duration = m.timestamp - Date.now();
			let n = moment.duration(duration).humanize(true);
			if (m.resend) {
				m.msg.nostalgic = n;
				node.send(m.msg);
			} else {
				let id = RED.util.generateId();
				node.send({ _msgId: id, nostalgic: n });
			}
		}
		node.on('input', function(msg, send, done) {
			send = send || function() { node.send.apply(node,arguments); };
			msgStore.msg = RED.util.cloneMessage(msg);
			msgStore.timestamp = Date.now();
			node.send(msg);
			node.intervalFunction();
			if (done) {
				done();
			}
		});
		node.on('close', function() {
			clearInterval(node.setInterval);
		});
	}
	RED.nodes.registerType('nostalgic', NostalgicNode);
};
