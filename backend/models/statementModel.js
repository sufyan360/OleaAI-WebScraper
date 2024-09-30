const statementModel = {
  statement: String,
  result: {
    isMisinformation: Boolean,
    reasoning: String,
    verifiedInfo: String,
  },
  createdAt: Date,
  };
  
  module.exports = statementModel;