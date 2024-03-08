routerAdd(
	'POST',
	'/collections/upsert',
	(c) => {
		const body = $apis.requestInfo(c).data;

		const { collection, id, data = {} } = body;
		let { created, updated } = body;

		if (created && created.includes('T')) created = created.replace('T', ' ');
		if (updated && updated.includes('T')) updated = updated.replace('T', ' ');

		const check = new DynamicModel({ id: '' });

		try {
			$app
				.dao()
				.db()
				.select('id')
				.from(collection)
				.where($dbx.exp('id = {:id}', { id }))
				.one(check);
		} catch (e) {
			// noop.
		}

		let dataToInsert = {};

		try {
			dataToInsert = Object.entries(data)
				.filter((x) => x[1])
				.reduce((a, b) => {
					let value = b[1];

					if (typeof value === 'object') value = JSON.stringify(value);

					return { ...a, [b[0]]: value };
				}, {});
		} catch (error) {
			throw new ApiError(500, 'dataToInsert creation; ' + error.message);
		}

		if (created) dataToInsert.created = created;
		if (updated) dataToInsert.updated = updated;

		try {
			if (check?.id) {
				$app.dao().db().update(collection, dataToInsert, $dbx.exp('id = {:id}', { id })).execute();

				c.json(200, { id, updated: true });
				return;
			}
		} catch (error) {
			throw new ApiError(500, 'update error; ' + error.message);
		}

		try {
			const now = new Date().toISOString();
			if (!created) dataToInsert.created = now;
			if (!updated) dataToInsert.updated = now;

			dataToInsert.id = id;

			$app.dao().db().insert(collection, dataToInsert).execute();

			c.json(200, { id, created: true });
		} catch (error) {
			throw new ApiError(500, 'create error; ' + error.message);
		}
	},
	$apis.requireAdminAuth()
);
