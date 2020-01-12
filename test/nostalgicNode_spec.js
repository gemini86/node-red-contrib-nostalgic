const nostalgicNode = require('../src/nostalgicNode.js');
const should = require('should');
const helper = require('node-red-node-test-helper');

helper.init(require.resolve('node-red'));

describe('Nostalgic Node', function () {

	before(function (done) {
		helper.startServer(done);
	});

	after(function(done) {
		helper.stopServer(done);
	});

	afterEach(function() {
		helper.unload();
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

	it('should send a message on interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.5, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			var firstMsgId;
			should.not.exist();
			n2.on('input', function (msg) {
				if (msg.nostalgic) {
					msg._msgId.should.not.equal(firstMsgId);
					msg.should.not.have.property('payload');
					msg.should.have.property('nostalgic', 'a few seconds ago');
					done();
				} else {
					firstMsgId = msg._msgId;
					msg.should.have.property('payload', 'test 2');
				}
			});
			n1.receive({ payload: 'test 2' });
		});
	});

	it('should resend original message on interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.5, resend: true, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			var firstMsgId;
			n2.on('input', function (msg) {
				if (msg.nostalgic) {
					msg.should.have.property('payload', 'test 3');
					msg.should.have.property('nostalgic', 'a few seconds ago');
					msg.should.have.property('_msgId', firstMsgId);
					done();
				} else {
					firstMsgId = msg._msgId;
					msg.should.have.property('payload', 'test 3');
				}
			});
			n1.receive({ payload: 'test 3' });
		});
	});
});
