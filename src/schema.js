const { gql } = require('apollo-server');

const typeDefs = gql`

type Speedrun {
	id: ID!
	time: Int!
	date: Date!
	type: SpeedrunType!
  description: String
  url: String!
  verifier: User
  submitter: User!
  status: SpeedrunStatus!
}

type Query {
  speedruns: [Speedrun]!
  speedrunsOfType(type: SpeedrunType!): [Speedrun]!
  verifiedSpeedrunsOfType(type: SpeedrunType!): [Speedrun]!
	speedrun(id: ID!): Speedrun
  submittedRunsById(id: ID!): [Speedrun]!
  userById(id: ID!): User
}

type Mutation {
    submitSpeedrun(data: SubmitInput): SubmitResult
  }

type SubmitResult {
  success: Boolean!
  message: String!
  speedrun: Speedrun
}

input SubmitInput {
  date: Date!
  time: Int!
  description: String
  url: String!
  type: SpeedrunType!
}

type User {
	id: ID!
	name: String!
	email: String
	submittedRuns: [Speedrun]!
  description: String
  avatar: String
}

enum SpeedrunStatus {
  UNVERIFIED
  VERIFIED
  DECLINED
}

enum SpeedrunType {
	ANY_PERCENT
	FULL_GAME_GLITCHLESS
	HUNDRED_PERCENT
	NO_KETAMINE
	VM_PERCENT
	DEATH_PERCENT
	NO_BOAT
}

scalar Date
`;

module.exports = typeDefs;