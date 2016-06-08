c2 = Package['aldeed:collection2'];

simulateDocumentModifier = function(doc, modifier) {
  var c = new Package.minimongo.LocalCollection('simulations');
  c.insert(doc);

  var sel = {
    _id: doc._id
  };

  c.update(sel, modifier);

  var sim = c.findOne(sel);
  c.remove(sel);

  return sim;
}

CollectionBehaviours.define('counter', function(opts = {}) {

  // Options

  const options = _.defaults(opts, this.options);

  // Schema

  if (c2 != null && !_.isEmpty(options) ) {
    const definition = {};

    _.each(options, (field) => {
      definition[field.destination] = {
        type: Number,
        optional: true
      };
    });

    this.collection.attachSchema(new SimpleSchema(definition));
  }

  // Hooks

  this.collection.before.insert((userId, doc) => {
    _.each(options, (field) => {
      if( !_.isEmpty(doc[field.source]) ) {
        doc[field.destination] = doc[field.source].length;
      } else {
        doc[field.destination] = 0;
      }
    });
  });

  this.collection.before.update((userId, doc, fieldNames, modifier, opts) => {
    // Get only fields updated & watched
    const fields = _(options).filter((option) => {
      return _(fieldNames).contains(option.source);
    });

    if( !_(fields).isEmpty() ) {
      // Simulate the document after update
      const simulation = simulateDocumentModifier(doc, modifier);

      _.each(fields, (field) => {
        modifier.$set = modifier.$set || {};
        modifier.$set[field.destination] = simulation[field.source] ? simulation[field.source].length : 0;
      });
    }
  });
});