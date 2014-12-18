cbecc.factory('Fenestration', ['$resource', function($resource) {
  return $resource('/fenestrations/:id.json', { id: '@id' },
    {
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false }
    }
  );
}]);
