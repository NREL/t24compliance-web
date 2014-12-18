cbecc.factory('ConstructionDefaults', ['$resource',function($resource) {
  return $resource('construction_defaults/:id.json', { project_id: '@projectId', id: '@id' },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
}]);
