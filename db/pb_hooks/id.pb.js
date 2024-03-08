$app.rootCmd.addCommand(
	new Command({
		use: 'id',
		run(cmd, args) {
			const [length = 15] = args;

			console.log($security.randomString(length));
		}
	})
);
