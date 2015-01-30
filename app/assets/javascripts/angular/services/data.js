cbecc.provider('data', {
  $get: ['$q', 'toaster', 'api', 'Shared', function ($q, toaster, api, Shared) {

    var data = {
      list: function (resource, query) {
        // Check cache for construction libraries
        var caches = ['constructions', 'door_lookups', 'fenestrations', 'space_function_defaults'];
        if (_.contains(caches, resource)) {
          if (Shared.existsInCache(resource)) {
            return $q.when(Shared.loadFromCache(resource));
          }
        }

        if (resource == 'constructions') {
          toaster.pop('note', 'Downloading constructions library', 'Please wait...', 60000);
        }

        return api[resource].query(query).$promise.then(function (response) {
          if (resource == 'constructions') toaster.clear();
          if (_.contains(caches, resource)) {
            Shared.saveToCache(resource, response);
          }
          return response;
        }, function (response) {
          // Determine which ID is invalid
          return data.show('projects', {id: Shared.getProjectId()}).then(function (response) {
            return $q.reject('Invalid building ID');
          }, function (response) {
            return $q.reject('Invalid project ID');
          });
        });
      },

      show: function (resource, query) {
        return api[resource].get(query).$promise.catch(function (response) {
          if (response.status == 404) {
            if (resource == 'projects') return $q.reject('Invalid project ID');
            if (resource == 'buildings') return $q.reject('Invalid building ID');
          }
          return $q.reject(response);
        });
      },

      create: function (resource, model) {
        return api[resource].save(model).$promise;
      },

      update: function (resource, model) {
        return api[resource].update(model).$promise;
      },

      remove: function (resource, model) {
        return data.remove(resource, model).$promise;
      },

      bulkSync: function (resource, params) {
        params.id = 'bulk_sync'; //this allows us to use the url /resource/bulk_sync for this POST
        params.format = 'json';
        return api[resource].bulkSync(params).$promise;
      }
    };

    return data;
  }]
});
