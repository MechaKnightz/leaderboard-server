module.exports = {
  Query: {
    speedruns: async (_, __, { dataSources }) =>
      dataSources.defaultAPI.getAllSpeedruns(),
    speedrunsOfType: async (_, { type }, { dataSources }) =>
      dataSources.defaultAPI.getAllSpeedrunsOfType(type),
    speedrun: async (_, { id }, { dataSources }) =>
      dataSources.defaultAPI.getSpeedrunById(id),
    submittedRunsById: async (_, { id }, { dataSources }) =>
      dataSources.defaultAPI.getSubmittedRunsById(id),
    userById: async (_, { id }, { dataSources }) =>
      dataSources.defaultAPI.getUserById(id),
  },
  User: {
    submittedRuns: async (user, __, { dataSources }) =>
      dataSources.defaultAPI.getSubmittedRunsById(user.id),
  },
  Speedrun: {
    verifier: async (speedrun, __, { dataSources }) =>
      dataSources.defaultAPI.getVerifierByRunId(speedrun.id),
    submitter: async (speedrun, __, { dataSources }) =>
      dataSources.defaultAPI.getSubmitterByRunId(speedrun.id),
  },
  Mutation: {
    submitSpeedrun: async (_, { data }, { dataSources }) => {
			const speedrun = await dataSources.userAPI.submitSpeedrun(data);
			if (speedrun) {
				
				return {
          success: true,
          message: "Submitted speedrun successfully",
          speedrun
        }
      }
      return {
        success: false,
        message: "Failed to submit speedrun",
      }
		},
  }
};