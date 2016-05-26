# Slug for collections

Add counters to collections. Indicate which fields you need to watch, and this behaviour will automatically update the corresponding specified field count.

### Install
```sh
meteor add nicooprat:collection-counter
```

### Usage

See `examples.js`. Simplest example :

````js
Stories = new Mongo.Collection('stories');
Stories.attachBehaviour('counter', [
  source: 'likes',
  destination: 'likesCount'
]);
````

### Options

The following options can be used:

* Array of objects :
  * `source`: field to get the counter from.
  * `destination`: field to set the counter value.

### Global configuration

The global configuration for this package should be in shared code, preferably
in a `lib` folder.

```js
// Configure behaviour globally
// All collection using this behaviour will use these settings as defaults, eg.:
CollectionBehaviours.configure('counter', {
  source: 'likes',
  destination: 'likesCount'
});
```

### Notes

* Warning: This code doesn't support the `slice` operator! (docs: https://docs.mongodb.com/manual/reference/operator/update/slice/)
* This package attaches a schema to the collection(s) if `aldeed:collection2` is
used by the application (no need to set the destination field definition to your own schema first).
* Inspiration from https://github.com/zimme/meteor-collection-timestampable and
https://github.com/jagi/meteor-astronomy-slug-behavior/