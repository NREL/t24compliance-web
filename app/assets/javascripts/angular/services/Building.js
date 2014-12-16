cbecc.factory('Building', function($resource) {
  return $resource('projects/:project_id/buildings/:id.json', { project_id: '@projectId', id: '@id' },
    {
      'index':   {method: 'GET'},
      'create':  { method: 'POST' },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
});
