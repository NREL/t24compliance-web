cbecc.provider('data', {
  $get: ['$q', 'toaster', 'api', 'Shared', function ($q, toaster, api, Shared) {

    var data = {
      // new: function(resource, params) {
      //   return new api[resource](params);
      // },

      list: function (resource, query) {
        // Check cache for construction libraries
        var caches = ['constructions', 'door_lookups', 'fenestrations', 'space_function_defaults', 'zip_codes'];
        if (_.contains(caches, resource)) {
          if (Shared.existsInCache(resource)) {
            return $q.when(Shared.loadFromCache(resource));
          }
        }

        if (resource == 'constructions') {
          toaster.pop('note', 'Downloading constructions library', 'Please wait...', 60000);
        }

        var promise = api[resource].query(query).$promise;
        promise.then(function (response) {
          if (resource == 'constructions') toaster.clear();
          if (_.contains(caches, resource)) {
            Shared.saveToCache(resource, response);
          }
        });
        return promise;
      },

      show: function (resource, query) {
        return api[resource].get(query).$promise;
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
