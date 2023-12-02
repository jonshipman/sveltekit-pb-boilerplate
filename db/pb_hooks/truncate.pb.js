$app.rootCmd.addCommand(
	new Command({
		use: 'truncate',
		run(cmd, args) {
			if (!args[0]) return console.error('Need collection name');

			$app
				.dao()
				.db()
				.newQuery('DELETE FROM ' + args[0])
				.execute();
		}
	})
);
