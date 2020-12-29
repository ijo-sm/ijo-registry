const Registry = require("./registry");
const registry = new Registry();
registry.initialize()
.then(() => {
	return registry.start();
})
.then(() => {
	console.log("The IJO registry has started.");
})
.catch(err => {
	throw err;
});

let stopped = false;
const stop = (event, err) => {
	if(err && err instanceof Error) console.error(err);
	if(stopped) return;
	stopped = true;

	return registry.stop()
	.then(() => {
		console.log(`The IJO registry has stopped (event: ${event}).`);
	})
	.catch(err => {
		throw err;
	});
};

[`beforeExit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`, `uncaughtException`, `unhandledRejection`].forEach(event => {
    process.on(event, err => stop(event, err));
});