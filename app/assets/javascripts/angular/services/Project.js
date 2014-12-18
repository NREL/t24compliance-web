cbecc.factory('Project', ['$resource','Shared',function($resource,Shared) {
  return $resource('/projects/:id.json', { id: '@id' },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
}]);
