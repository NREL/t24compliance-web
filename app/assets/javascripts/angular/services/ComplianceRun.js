cbecc.factory('ComplianceRun', function($resource) {
    return $resource('/projects/:project_id/simulations/:id/run', { project_id: '@projectId', id: '@id' },
        {
            'run':  { method: 'POST' }
        }
    );
});

cbecc.factory('ComplianceXml', function($resource) {
    return $resource('/simulations/:id/xml', { project_id: '@projectId', id: '@id' },
        {
            'xml':  { method: 'GET' }
        }
    );
});
