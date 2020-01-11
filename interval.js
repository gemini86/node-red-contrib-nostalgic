var obj = {};
obj.interval = () => {
	console.log('tick');
	obj.tock = setInterval(() => {
		console.log(obj.tock);
		console.log('tock');
	}, 7000);
};
console.log('set interval now!');
obj.interval();
console.log('set timeout to stop interval!');
setTimeout(() => {
	console.log('clearing interval!');
	clearInterval(obj.tock);
	setTimeout(() => {
		console.log(obj.tock);
	},2000);
}, 20000);
