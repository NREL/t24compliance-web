cbecc.factory('Story', ['$resource', function($resource) {
  return $resource('/building_stories.json', { building_id: '@building_id', id: '@id' },
    {
      'index':        { method: 'GET', isArray: true },
      'createUpdate': { method: 'POST', params: {building_id: '@building_id'} }
    }
  );
}]);
