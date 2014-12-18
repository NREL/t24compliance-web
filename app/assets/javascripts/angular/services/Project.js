cbecc.factory('Project', ['$resource','Shared',function($resource,Shared) {
  var service = $resource('/projects/:id.json', { id: '@id' },
    {
      'create':  { method: 'POST' },
      'index':   { method: 'GET', isArray: true },
      'show':    { method: 'GET', isArray: false },
      'update':  { method: 'PUT' },
      'destroy': { method: 'DELETE' }
    }
  );
  service.projectPath = function(){
    Shared.projectPath();
  };
  return service;
}]);
