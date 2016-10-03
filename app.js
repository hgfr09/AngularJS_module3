(function () {
        'use strict';


        angular.module('NarrowItDownApp', [])
                .controller('NarrowItDownController', NarrowItDownController)
                .service('MenuSearchService', MenuSearchService)
                .directive('foundItems', FoundItems);

        function FoundItems() {
                var ddo = {
                        templateUrl: 'foundItems.html',
                        scope: {
                                list: '<',
                                onRemove: '&'
                        }
                };

                return ddo;
        }


        NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService) {
                var list = this;
              
                list.searchTerm = '';
                list.items = [];
                var promise = MenuSearchService.getPromise();
                list.foundItems = function () {
                        promise.then(function (response) {
                                var dataArray = response.data;
                                MenuSearchService.getMatchedMenuItems(dataArray.menu_items, list.searchTerm);
                                list.items = MenuSearchService.getFoundItems();
                                if (list.items.length === 0) {
                                        list.message = 'Nothing Found!';
                                }
                        }).catch(function (error) {
                                console.log("An error occured : ", error.message);
                        });

                };
                list.removeItem = function (index) {
                        MenuSearchService.removeItem(index);
                        list.searchTerm = '';
                };

        }


        MenuSearchService.$inject = ['$http', '$filter'];
        function MenuSearchService($http, $filter) {

                var service = this;
                var foundItems = [];

                service.getFoundItems = function () {
                        return foundItems;
                };

                service.removeItem = function (index) {
                        foundItems.splice(index, 1);
                };

                service.getPromise = function () {
                        return $http({
                                method: 'GET',
                                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
                        });
                };

                /**
                 * 
                 * @param {Array of Objects} dataArray
                 * @param {String} searchTerm 
                 * @returns {Array}
                 */
                service.getMatchedMenuItems = function (dataArray, searchTerm) {
                        if (searchTerm.trim() === '') {
                                return foundItems;
                        }
                        foundItems = $filter('filter')(dataArray, {'description': searchTerm});
                };
        }
})();
