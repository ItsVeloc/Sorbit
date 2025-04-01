// src/utils/schemaTypes.js
const mongoose = require('mongoose');

// Helper to create a field that can be either an ObjectId or a String
// (useful for testing without a real database)
const flexibleObjectId = {
  type: mongoose.Schema.Types.Mixed,
  validate: {
    validator: function(v) {
      return v === null || 
             v === undefined || 
             mongoose.Types.ObjectId.isValid(v) || 
             typeof v === 'string';
    },
    message: props => `${props.value} is not a valid ObjectId or string`
  }
};

module.exports = {
  flexibleObjectId
};