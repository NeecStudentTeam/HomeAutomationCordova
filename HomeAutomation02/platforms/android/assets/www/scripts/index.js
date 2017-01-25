(function () {
    'use strict'

    angular.module('my-app', ['onsen']);
    angular.module('my-app').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';

    }]);
    angular.module('my-app').controller('MainController', ['$scope', '$http', function ($scope, $http) {
        $scope.init = function () {
            $scope.detail = [{ name: 'hogehoge', onoff: '' }];
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
        function getClick() {
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

        $scope.putClick = function () {
            $scope.detail.splice($scope.numIndex, 1, { name: $scope.startCE, onoff: $scope.onOffName });
            myModal.hide();
        }

        $scope.deleteClick = function () {
            var url = 'http://localhost/api/appliances/';
            $http({
                method: 'POST',
                url: url,
                data: { "name": "家電テスト2" }
            })
            .success(function (headers) {
                alert('status:' + headers);
            })
            .error(function () {
                alert('APIデータ送信失敗');
            });
        }

        $scope.startCE;
        $scope.settingTest = function (i) {
            $scope.startCE = i;
        }

        $scope.onOffName;
        $scope.onOffShow = function (j) {
            $scope.onOffName = j;
        }


        $scope.api = function () {
            myNavigator.pushPage('setting.html');
            getClick();
        }
    }]);
})();

