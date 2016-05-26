c2 = Package['aldeed:collection2'];

CollectionBehaviours.define('counter', function(opts = {}) {

  // Options

  const options = _.defaults(opts, this.options);

  // Schema

  if (c2 != null && !_.isEmpty(options) ) {
    const definition = {};

    _.each(options, (field) => {
      definition[field.destination] = {
        type: Number,
        optional: true,
        defaultValue: 0
      };
    });

    this.collection.attachSchema(new SimpleSchema(definition));
  }

  // Hooks

  this.collection.before.insert((userId, doc) => {
    _.each(options, (field) => {
      if( !_.isEmpty(doc[field.source]) ) {
        doc[field.destination] = doc[field.source].length;
      }
    });
  });

  // We must execute before update to avoid extra queries after doc is inserted
  this.collection.before.update((userId, doc, fieldNames, modifier, opts) => {
    // We must calculate the future length of the Array source field
    // Before Mongo operates, for each possible operator
    // /!\ Doesn't support the `$slice` operator /!\
    // https://docs.mongodb.com/manual/reference/operator/update-array/
    _.each(options, (field) => {
      // $push -> $inc + 1
      if( modifier.$push && modifier.$push[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = 1;
      }

      // $pushAll -> $inc + $pushAll.length
      if( modifier.$pushAll && modifier.$pushAll[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = modifier.$pushAll[field.source].length
      }

      // $pull -> $inc - 1
      if( modifier.$pull && modifier.$pull[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = -1;
      }

      // $pullAll -> $inc - $pullAll.length
      if( modifier.$pullAll && modifier.$pullAll[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = modifier.$pullAll[field.source].length;
      }

      // $pull -> $inc - 1
      if( modifier.$pull && modifier.$pull[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = -1;
      }

      // $set -> $set
      if( modifier.$set && modifier.$set[field.source] ){
        modifier.$set[field.destination] = modifier.$set[field.source].length
      }

      // $addtoset -> $inc + $addtoset.length
      if( modifier.$addtoset && modifier.$addtoset[field.source] ){
        modifier.$inc = modifier.$inc || {};
        modifier.$inc[field.destination] = _.union(modifier.$addtoset[field.source], doc[field.source]).length;
      }
    });
  });
});