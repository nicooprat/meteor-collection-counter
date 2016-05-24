Package.describe({
  git: 'https://github.com/nicooprat/meteor-collection-counter.git',
  name: 'nicooprat:collection-counter',
  summary: 'Add counters to collections',
  version: '1.0.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');

  api.use([
    'underscore'
  ]);

  api.use([
    'ecmascript',
    'matb33:collection-hooks@0.7.6',
    'zimme:collection-behaviours@1.1.0'
  ]);

  api.imply('zimme:collection-behaviours');

  api.addFiles('counter.js');
});
