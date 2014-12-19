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
 
        list: function (resource, query) {
          return api[resource].query(query).$promise;  
        },
        
        get : function (resource, query) {
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
        }
      };
 
      return data;
    }
  });