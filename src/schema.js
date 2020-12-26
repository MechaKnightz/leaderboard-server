const { gql } = require('apollo-server');

const typeDefs = gql`

type Speedrun {
	id: ID!
	time: Int!
	date: Date!
	type: SpeedrunType!
  description: String
  url: String
  verifier: User
  submitter: User!
}

type Query {
  speedruns: [Speedrun]!
	speedrun(id: ID!): Speedrun
}

type User {
	id: ID!
	name: String!
	email: String!
	submittedRuns: [Speedrun]!
	token: String
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