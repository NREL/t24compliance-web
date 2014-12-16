cbecc.factory('Compliance', function($resource) {
    return $resource('/projects/:project_id/simulations/:id', { project_id: '@projectId', id: '@id' },
        {
            'create':  { method: 'POST' },
            'index':   { method: 'GET', isArray: true },
            'show':    { method: 'GET', isArray: false },
            'update':  { method: 'PUT' },
            'destroy': { method: 'DELETE' }
        }
    );
});
