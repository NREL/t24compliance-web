cbecc.provider('data', {
    
    list : function (resource, query) {
      return [
        'data',
        function (data) {  // inject the data service
          return data.list(resource, query);
        }
      ]
    },
    
    get: function (resource, query) {
      return [
        'data',
        function(data) {
          return data.get(resource, query);
        }
      ]
    },
    
    $get: function (api) {
      
      var data = {
        // new: function(resource, params) {
        //   return new api[resource](params);
        // },

        list: function (resource, query) {
          return api[resource].query(query).$promise;  
        },
        
        show : function (resource, query) {
            return api[resource].get(query).$promise;
        },
 
        create : function (resource, model) {
          return api[resource].save(model).$promise;
        }, 
 
        update : function (resource, model) {
          return api[resource].update(model).$promise;
        },
 
        remove : function (resource, model) {
          return data.remove(resource, model).$promise;
        },

        bulkSync : function(resource, params) {
          params['id'] = "bulk_sync"; //this allows us to use the url /resource/bulk_sync for this POST
          params['format'] = "json";
          return api[resource].bulkSync(params).$promise;
        }
      };
 
      return data;
    }
  });