const nostalgicNode = require('../src/nostalgicNode.js');
const should = require('should');
const helper = require('node-red-node-test-helper');

helper.init(require.resolve('node-red'));

describe('Nostalgic Node', function () {

	beforeEach(function (done) {
		helper.startServer(done);
	});

	afterEach(function (done) {
		helper.unload();
		helper.stopServer(done);
		var intervals = setTimeout(function() {
			for (var i = intervals; i > 0; i--) {
				console.log(i);
				clearInterval(i);
			}
		},3000);
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
			{ id: 'n1', type: 'nostalgic', name: '', wires: [['n2']] },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			n2.on('input', function (msg) {
				msg.should.have.property('payload', 'foo');
				done();
			});
			n1.receive({payload: 'foo'});
		});
	});

	it('should send a message on interval', function (done) {
		let flow = [
			{ id: 'n1', type: 'nostalgic', name: '', interval: 0.1, resend: true, wires: [['n2']]  },
			{ id: 'n2', type: 'helper' }
		];
		helper.load(nostalgicNode, flow, function () {
			var n2 = helper.getNode('n2');
			var n1 = helper.getNode('n1');
			n2.on('input', function (msg) {
				if (msg.nostalgic) {
					msg.should.have.property('payload', 'foo');
					msg.should.have.property('nostalgic', 'a few seconds ago');
					done();
				}
			});
			n1.receive({ payload: 'foo' });
		});
	});
});
