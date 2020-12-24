module.exports = {
	Query: {
		speedrun: (_, { id }, { dataSources }) =>
			dataSources.launchAPI.getLaunchById({ launchId: id })
	}
};