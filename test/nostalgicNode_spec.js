var nostalgicNode = require('../src/nostalgicNode.js');
var should = require('should');
var helper = require('node-red-node-test-helper');

helper.init(require.resolve('node-red'));

describe('Nostalgic Node', function () {

	beforeEach(function (done) {
		helper.startServer(done);
	});

	afterEach(function(done) {
		helper.unload().then(() => {
			helper.stopServer(done);
		});
	});

	it('should be loaded', function (done) {
		let flow = [{ id: 'n1', type: 'nostalgic', name: 'since when' }];
		helper.load(nostalgicNode, flow, function () {
			var n1 = helper.getNode('n1');
			n1.should.have.property('name', 'since when');
			done();
		});
	});

	it('should output a message received on input', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 10, wires: [['n2']] },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			n2.on('input', function (msg) {
				msg.should.have.property('payload', 'test 1');
				done();
			});
			n1.receive({payload: 'test 1'});
		});
	});

	it('should send a message with only nostgic property after interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.01, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			var firstMsgId = '';
			var msgCounter = 0;
			n2.on('input', function (msg) {
				msgCounter++;
				if (msgCounter == 2) {
					msg._msgid.should.not.equal(firstMsgId);
					msg.should.not.have.property('payload');
					msg.should.have.property('nostalgic', 'a few seconds ago');
					done();
				} else  if (msgCounter == 1){
					firstMsgId = msg._msgid;
					msg.should.have.property('payload', 'test 2');
				}
			});
			n1.receive({ payload: 'test 2' });
		});
	});

	it('should resend original message on interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.01, resend: true, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			var firstMsgId = '';
			var msgCounter = 0;
			n2.on('input', function (msg) {
				msgCounter++;
				if (msgCounter == 2) {
					msg.should.have.property('payload', 'test 3');
					msg.should.have.property('nostalgic', 'a few seconds ago');
					msg.should.have.property('_msgid', firstMsgId);
					done();
				} else if (msgCounter == 1) {
					firstMsgId = msg._msgid;
					msg.should.have.property('payload', 'test 3');
				}
			});
			n1.receive({ payload: 'test 3' });
		});
	});

	it('should send multiple messages on interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.01, resend: false, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			var msgCounter = 0;
			n2.on('input', function () {
				msgCounter++;
			});
			n1.receive({ payload: 'test 4' });
			setTimeout(() => {
				msgCounter.should.be.aboveOrEqual(99);
				done();
			}, 1040);
		});
	});
});
