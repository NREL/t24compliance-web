cbecc.factory('Construction', function($resource) {
  return $resource('/constructions/:id.json', { id: '@id' },
    {
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false }
    }
  );
});
