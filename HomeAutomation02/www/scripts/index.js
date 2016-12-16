(function () {
    'use strict'

    angular.module('my-app', ['onsen']);
    angular.module('my-app').controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $scope.init = function () {
            $scope.detail = [{ name: 'hogehoge' }];
        }

        $scope.onclick = function (num) {
            var pass = num;
            var url = 'http://192.168.0.128/api/remocons/1/remocon_buttons/' + pass + '/send';
            $http({
                method: 'JSONP',
                url: url,
                params: { line_cd: num, callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
            })
            .error(function () {
            });
        }
        function click() {
            var url = 'https://api.loctouch.com/v1/railway/stations';
            $http({
                method: 'JSONP',
                url: url,
                params: { callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
                $scope.items = data.stations;
            })
            .error(function () {
                alert('APIデータ取得失敗');
            });
        }

        $scope.numIndex;
        $scope.detailClick = function (i) {
            $scope.numIndex = i;
            myModal.show();
        }

        $scope.settingTest = function (i, set) {
            $scope.detail.splice(i, 1, { name: set });
        }

        $scope.api = function () {
            myNavigator.pushPage('setting.html');
            click();
        }
    }]);
})();