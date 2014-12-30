cbecc.factory('System', ['$resource', function($resource) {
  return $resource('/zone_systems/:id.json', { id: '@id' },
    {
      'index':   { method: 'GET', isArray: true },
      'createUpdate': { method: 'POST', params: {building_id: '@building_id', type: '@type'}}
    }
  );
}]);
