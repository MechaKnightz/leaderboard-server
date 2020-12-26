module.exports = {
	Query: {
    speedruns: (_, __, { dataSources }) => 
      dataSources.defaultAPI.getAllSpeedruns(),
		speedrun: (_, { id }, { dataSources }) =>
			dataSources.defaultAPI.getSpeedrunById({ id })
	}
};