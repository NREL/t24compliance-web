cbecc.factory('ConstructionDefaults', ['$resource',function($resource) {
  return $resource('construction_defaults/:id.json', { project_id: '@projectId', id: '@id' },
    {
      'show':   { method: 'GET', isArray: false },
      'createUpdate': { method: 'POST', params: {project_id: '@project_id'} }
    }
  );
}]);
