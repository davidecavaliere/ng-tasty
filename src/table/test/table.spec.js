describe('Directive', function () {
  'use strict';
  var $rootScope, $scope, $timeout, $httpBackend, $compile;
  var element, params, urlToCall, filters, createDirective, field, elm,
  elementSelected, expected, completeJSON, sortingJSON, paginationJSON,
  filtersJSON, tastyTable, tastyPagination, tastyThead, paginationJSONCount25;

  beforeEach(module('ngMock'));
  beforeEach(module('ngTasty.filter'));
  beforeEach(module('ngTasty.service'));
  beforeEach(module('ngTasty.table'));
  beforeEach(module('mockedAPIResponse'));
  beforeEach(module('template/table/head.html'));
  beforeEach(module('template/table/pagination.html'));


  describe('ngTasty table configs', function () {
    beforeEach(inject(function ($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    }));

    it('should return a throw message if the resource is not set', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: need the resource or resource-callback attribute';
      expect(errorFunctionWrapper).toThrow(expected);
    });

    it('should return a throw message if the resource set it\'s undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table resource="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource (getResource) it\'s not an object';
      expect(errorFunctionWrapper).toThrow(expected);
    });

    it('should return a throw message if the resource-callback set it\'s undefined', function () {
      function errorFunctionWrapper() {
        element = angular.element('<div tasty-table resource-callback="getResource"></div>');
        $compile(element)($scope);
        $scope.$digest();
      }
      expected = 'AngularJS tastyTable directive: the resource-callback (getResource) it\'s not a function';
      expect(errorFunctionWrapper).toThrow(expected);
    });
  });




  describe('ngTasty table complete server side', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _completeJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      completeJSON = _completeJSON_;
      $scope.getResource = function (params) {
        return $http.get('api.json?'+params).then(function (response) {
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      $scope.filters = {
        'city': 'sf'
      };
      element = angular.element(''+
      '<div tasty-table resource-callback="getResource" filters="filters">'+
      '  <table>'+
      '    <thead tasty-thead></thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <div tasty-pagination></div>'+
      '</div>');
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({
        'count': 5,
        'page': 1,
        'pages': 1,
        'size': 1
      });
      expect(element.scope().params.sortBy).toEqual(undefined);
      expect(element.scope().params.sortOrder).toEqual('asc');
      expect(element.scope().params.page).toEqual(1);
      expect(element.scope().params.count).toEqual(5);
      expect(element.scope().params.thead).toEqual(true);
      expect(element.scope().params.pagination).toEqual(true);
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?sort-order=asc&page=1&count=5&city=sf';
      $httpBackend.whenGET(urlToCall).respond(completeJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
    });
  });
  



  describe('ngTasty table withs sorting server side', function () {
    beforeEach(inject(function (_$rootScope_, $compile, $http, _$httpBackend_, _$timeout_, _sortingJSON_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      sortingJSON = _sortingJSON_;
      $scope.getResource = function (params) {
        return $http.get('api.json?'+params).then(function (response) {
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      $scope.notSortBy = ['sf-location'];
      element = angular.element(''+
      '<table tasty-table resource-callback="getResource">'+
      '  <thead tasty-thead not-sort-by="notSortBy"></thead>'+
      '  <tbody>'+
      '    <tr ng-repeat="row in rows">'+
      '      <td>{{ row.name }}</td>'+
      '      <td>{{ row.star }}</td>'+
      '      <td>{{ row[\'sf-location\'] }}</td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>');
      tastyTable = $compile(element)($scope);
      tastyThead = tastyTable.find('[tasty-thead=""]');
      urlToCall = 'api.json?sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('sort-order=asc');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(35);
      expect(element.scope().pagination).toEqual({ 
        'count' : null, 
        'page' : null, 
        'pages' : null, 
        'size' : 35
      });
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        thead : true 
      });
      expect(element.scope().theadDirective).toEqual(true);
      expect(element.scope().paginationDirective).toEqual(false);   
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(35);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyThead.isolateScope().fields.name).toEqual({ 
        'active': false,
        'sortable': true,
        'width' : { 'width' : '33.33%' },
        'sort' : 'name'
      });
      expect(tastyThead.isolateScope().fields.star).toEqual({ 
        'active': false,
        'sortable': true,
        'width' : { 'width' : '33.33%' },
        'sort' : 'star'
      });
      expect(tastyThead.isolateScope().fields['sf-location']).toEqual({
        'active': false,
        'sortable': false,
        'width' : { 'width' : '33.33%' },
        'sort' : 'sf-location'
      });
    });

    it('should set params.sortBy when scope.sortBy is clicked', function () {
      field = {'key': 'name', 'name': 'Name'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setFields();
      expect(element.scope().params.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().fields.name.active).toEqual(true);
      field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      tastyThead.isolateScope().setFields();
      expect(element.scope().params.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().fields.star.active).toEqual(true);
    });

    it('should not set params.sortBy when scope.sortBy is one of the notSortBy keys', function () {
      field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.scope().params.sortBy).toEqual('star');
      field = {'key': 'sf-location', 'name': 'SF Location'};
      tastyThead.isolateScope().sortBy(field);
      expect(element.scope().params.sortBy).toEqual('star');
    });

    it('should sorting ascending and descending scope.header.sortBy when scope.sortBy is clicked', function () {
      field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      tastyThead.isolateScope().sortBy(field);
      expect(tastyThead.isolateScope().header.sortBy).toEqual('-star');
    });

    it('should return true or false to indicate if a specific key is sorted up', function () {
      var isSortUp;
      field = field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      isSortUp = tastyThead.isolateScope().isSortUp(field);
      expect(isSortUp).toEqual(false);
      tastyThead.isolateScope().sortBy(field);
      isSortUp = tastyThead.isolateScope().isSortUp(field);
      expect(isSortUp).toEqual(true);
    });

    it('should return true or false to indicate if a specific key is sorted down', function () {
      var isSortDown;
      field = field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      isSortDown = tastyThead.isolateScope().isSortDown(field);
      expect(isSortDown).toEqual(true);
      tastyThead.isolateScope().sortBy(field);
      isSortDown = tastyThead.isolateScope().isSortDown(field);
      expect(isSortDown).toEqual(false);
    });

    it('should set the last sortBy and sortOrder params when doesn\'t back from backend', function () {
      sortingJSON['sortOrder'] = undefined;
      field = field =  {'key': 'star', 'name': 'star'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      urlToCall = 'api.json?sort-by=star&sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('star');
      expect(tastyThead.isolateScope().header.sortOrder).toEqual('asc');
      field = field =  {'key': 'name', 'name': 'Name'};
      tastyThead.isolateScope().sortBy(field);
      $scope.$digest();
      urlToCall = 'api.json?sort-by=name&sort-order=asc';
      $httpBackend.whenGET(urlToCall).respond(sortingJSON);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyThead.isolateScope().header.sortBy).toEqual('name');
      expect(tastyThead.isolateScope().header.sortOrder).toEqual('asc');
    });
  });
  



  describe('ngTasty table with pagination server side', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, 
      _$timeout_, _paginationJSON_, _paginationJSONCount25_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      paginationJSON = _paginationJSON_;
      paginationJSONCount25 = _paginationJSONCount25_;
      $scope.getResource = function (params) {
        return $http.get('api.json?'+params).then(function (response) {
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      element = angular.element(''+
      '<div tasty-table resource-callback="getResource">'+
      '  <table>'+
      '    <thead>'+
      '      <tr>'+
      '        <th>Name</th>'+
      '        <th>Star</th>'+
      '        <th>SF Location</th>'+
      '      </tr>'+
      '    </thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '  <tasty-pagination></tasty-pagination>'+
      '</div>');
      tastyTable = $compile(element)($scope);
      tastyPagination = tastyTable.find('tasty-pagination');
      urlToCall = 'api.json?page=1&count=5';
      $httpBackend.whenGET(urlToCall).respond(paginationJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
    }));

    it('should have these element.scope() value after 100ms', function () {
      //console.log($scope)
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('page=1&count=5');
      expect(element.scope().header.columns.length).toEqual(3);
      expect(element.scope().rows.length).toEqual(5);
      expect(element.scope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5, 
        pagination : true 
      });
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(true);
    });

    it('should return the right url after called buildUrl', function () {
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(5);
    });

    it('should have these isolateScope value as default', function () {
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 5, 
        'page' : 1,
        'pages' : 7, 
        'size' : 35 
      });
      expect(tastyPagination.isolateScope().pagListCount).toEqual([5, 25]);
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
    });

    it('should generate page count button using ng-repeat', function () {
      elementSelected = element.find('[ng-repeat="count in pagListCount"]');
      expect(elementSelected.length).toEqual(2);
    });
    
    it('should use correct class for the selected page count', function () {
      elementSelected = element.find('[ng-repeat="count in pagListCount"]');
      expect(elementSelected.eq(0)).toHaveClass('active');
      expect(elementSelected.eq(1)).not.toHaveClass('active');
      tastyPagination.isolateScope().page.setCount(25);
      $scope.$digest();
      urlToCall = 'api.json?page=1&count=25';
      $httpBackend.whenGET(urlToCall).respond(paginationJSONCount25);
      $timeout.flush();
      $httpBackend.flush();
      expect(tastyPagination.isolateScope().pagination).toEqual({ 
        'count' : 25, 
        'page' : 1,
        'pages' : 2, 
        'size' : 35 
      });
      expect(elementSelected.eq(0)).not.toHaveClass('active');
      expect(elementSelected.eq(1)).toHaveClass('active');
    });
    
    it('should update params.page when page.get is clicked', function () {
      tastyPagination.isolateScope().page.get(1);
      expect(element.scope().params.page).toEqual(1);
    });
    
    it('should update params.count when page.setCount is clicked', function () {
      tastyPagination.isolateScope().page.setCount(25);
      expect(element.scope().params.count).toEqual(25);
      expect(element.scope().params.page).toEqual(1);
    });

    it('should update pagMinRange and pagMaxRange when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(2);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(7);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().pagMinRange).toEqual(1);
      expect(tastyPagination.isolateScope().pagMaxRange).toEqual(6);
    });

    it('should update rangePage when page.previous and page.remaining are clicked', function () {
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
      tastyPagination.isolateScope().page.remaining();
      expect(tastyPagination.isolateScope().rangePage).toEqual([2,3,4,5,6]);
      tastyPagination.isolateScope().page.previous();
      expect(tastyPagination.isolateScope().rangePage).toEqual([1,2,3,4,5]);
    });

    it('has the class col-xs-3 in pagination counting', function () {
      elm = tastyPagination.find('.text-left');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });

    it('has the class col-xs-6 in pagination center', function () {
      elm = tastyPagination.find('.text-center');
      expect(angular.element(elm).hasClass('col-xs-6')).toBe(true);
    });

    it('has the class col-xs-3 in pagination right', function () {
      elm = tastyPagination.find('.text-right');
      expect(angular.element(elm).hasClass('col-xs-3')).toBe(true);
    });
  });




  describe('ngTasty table with filters server side', function () {
    beforeEach(inject(function ($rootScope, $compile, $http, _$httpBackend_, _$timeout_, _filtersJSON_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;
      filtersJSON = _filtersJSON_;
      $scope.getResource = function (params) {
        return $http.get('api.json?'+params).then(function (response) {
          return {
            'rows': response.data.rows,
            'header': response.data.header,
            'pagination': response.data.pagination,
            'sortBy': response.data['sort-by'],
            'sortOrder': response.data['sort-order']
          };
        });
      };
      $scope.filters = {
        'city': 'sf'
      };
      element = angular.element(''+
      '<div tasty-table resource-callback="getResource" filters="filters">'+
      '  <table>'+
      '    <thead>'+
      '      <tr>'+
      '        <th>Name</th>'+
      '        <th>Star</th>'+
      '        <th>SF Location</th>'+
      '      </tr>'+
      '    </thead>'+
      '    <tbody>'+
      '      <tr ng-repeat="row in rows">'+
      '        <td>{{ row.name }}</td>'+
      '        <td>{{ row.star }}</td>'+
      '        <td>{{ row[\'sf-location\'] }}</td>'+
      '      </tr>'+
      '    </tbody>'+
      '  </table>'+
      '</div>');
      $compile(element)($scope);
      $scope.$digest();
    }));

    it('should have these element.scope() value as default', function () {
      expect(element.scope().query).toEqual({
        'page': 'page',
        'count': 'count',
        'sortBy': 'sort-by',
        'sortOrder': 'sort-order',
      });
      expect(element.scope().url).toEqual('');
      expect(element.scope().header).toEqual({
        'columns': []
      });
      expect(element.scope().rows).toEqual([]);
      expect(element.scope().pagination).toEqual({
        'count': 5,
        'page': 1,
        'pages': 1,
        'size': 1
      });
      expect(element.scope().params).toEqual({ 
        sortBy : undefined, 
        sortOrder : 'asc', 
        page : 1, 
        count : 5 
      });
      expect(element.scope().theadDirective).toEqual(false);
      expect(element.scope().paginationDirective).toEqual(false);
    });

    it('should return the right url after called buildUrl', function () {
      urlToCall = 'api.json?city=sf';
      $httpBackend.whenGET(urlToCall).respond(filtersJSON);
      $timeout.flush();
      $httpBackend.flush();
      $scope.$digest();
      expect(element.scope().rows[0].name).toEqual('Ritual Coffee Roasters');
      expect(element.scope().rows.length).toEqual(35);
    });
  });
});