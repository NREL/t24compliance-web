cbecc.factory('Building', ['$resource',function($resource) {
  return $resource('projects/:project_id/buildings/:id.json', { project_id: '@projectId', id: '@id' },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET' },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
}]);
