module.exports = {
	Query: {
    speedruns: (_, __, { dataSources }) => 
      dataSources.defaultAPI.getAllSpeedruns(),
    speedrunsOfType: (_, { type }, { dataSources }) => 
      dataSources.defaultAPI.getAllSpeedrunsOfType(type),
		speedrun: (_, { id }, { dataSources }) =>
			dataSources.defaultAPI.getSpeedrunById({ id })
	}
};