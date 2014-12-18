cbecc.factory('ConstructionDefaults', ['$resource',function($resource) {
  return $resource('construction_defaults/:id.json', { project_id: '@projectId', id: '@id' },
    {
      'index':   { method: 'GET', isArray: true },
    }
  );
}]);
