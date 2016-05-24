// -----------------------
// Simplest, no schema
// Each time a Story is inserted or updated with the field `title` set,
// according likesCount field is updated. Source field must be an array.
// -----------------------

Stories = new Mongo.Collection('stories');
Stories.attachBehaviour('counter', [
  source: 'likes',
  destination: 'likesCount'
]);

// -----------------------
// With schema
// Needs one of these packages: aldeed:collection2 or aldeed:simple-schema
// -----------------------

Stories = new Mongo.Collection('stories');

Stories.Schema = new SimpleSchema({
  likes: {
    type: [String] // Array of user IDs who liked this story
  }
});

Stories.attachSchema(Stories.Schema);
Stories.attachBehaviour('counter', [
  source: 'likes',
  destination: 'likesCount'
]);

// -----------------------
// Two collection with schemas & global behaviour options
// -----------------------

Stories.Schema = new SimpleSchema({
  likes: {
    type: [String]
  }
});

Comments.Schema = new SimpleSchema({
  likes: {
    type: [String]
  }
});

CollectionBehaviours.configure('counter', {
  source: 'likes',
  destination: 'likesCount'
});

CollectionBehaviours.attach([Stories, Comments], 'counter');
