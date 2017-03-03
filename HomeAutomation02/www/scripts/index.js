(function () {
    'use strict'

    angular.module('my-app', ['onsen']);
    angular.module('my-app').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';

    }]);
    angular.module('my-app').controller('MainController', ['$scope', '$http', function ($scope, $http) {
        /* URL */
        var url;
        var firstUrl = "http://localhost/";
        var settingUrl = "api/appliance_link_sets/";
        var detailUrl = "appliance_links/";
        var dataUrl;
        var ConeleUrl = "api/appliances/";
        var onoff1Url = "api/appliance_link_action/";
        var onoff2Url = "api/appliance_link_trigger";
        var page;
        var arrayData;
        $scope.appliance = [{ name: '', status: '' }];
        $scope.applianceDetail = [{ name: '', status: '' }];
        $scope.coneleList;
        $scope.settingId;
        $scope.detailId;
        $scope.apiData;
        $scope.coneleId;
        $scope.onoffId;
        $scope.conele1;
        $scope.conele2;
        $scope.onoff1;
        $scope.onoff2;
        $scope.provisional;

        /* ons-listのinit() */

        $scope.init = function () {
            $scope.appliance;
        }

        $scope.applianceDetInit = function () {
            $scope.applianceDetail;
        }

        $scope.coneleListInit = function () {
            $scope.coneleList;
        }

        

        // home.html
        
        $scope.settingSlide = function () {
            url = firstUrl + settingUrl;
            page = 'setting.html';
            getClick(1);
        }

        /* page2 */

        $scope.interlockSetting = function (id) {
            url = firstUrl + settingUrl + id + "/" + detailUrl;
            page = 'detailsetting.html';
            getClick(1);
            url = firstUrl + settingUrl + id;
        }

        $scope.interlockDelete = function (id) {
            url = firstUrl + settingUrl + id + "/";
            deleteClick();
        }

        $scope.detailsetting = function (name) {
            interlock.hide();
            url = firstUrl + settingUrl;
            $scope.apiData = [{ name: name, status: 0 }];
            page = 'detailsetting.html';
            postClick(1, $scope.apiData);
        }

        /* page3 */

        $scope.ConEleChoice = function (id) {
            url = firstUrl + detailUrl + id;
            ConeleSet1.show();
        }

        $scope.detailDelete = function (id) {
            url = firstUrl + detailUrl + id;
            $scope.deleteClick();
        }

        $scope.coneleSetting = function (i) {
            dataUrl = firstUrl + coneleUrl;
            $scope.coneleId = i;
            getConeleClick();
            Conele.show();
        }

        $scope.onoffSetting = function (i) {
            switch (i) {
                case 0:
                    dataUrl = firstUrl + onoff1Url;
                case 1:
                    dataUrl = firstUrl + onoff2Url;
            }
            $scope.onoffId = i;
            getConeleClick();
            onoff.show();
        }

        $scope.coneleDate = function (i) {
            $scope.provisional = i;
        }

        $scope.coneleDataSet = function () {
            switch ($scope.coneleId) {
                case 1:
                    $scope.conele1 = $scope.provisional;
                    break;
                case 2:
                    $scope.conele2 = $scope.provisional;
                    break;
            }
            Conele.hide();
        }

        $scope.onoffChange = function (i) {
            $scope.provisional = i;
        }

        $scope.onoffChangeSet = function () {
            switch ($scope.onoffId) {
                case 1:
                    $scope.onoff1 = $scope.provisional;
                    break;
                case 2:
                    $scope.onoff2 = $scope.provisional;
                    break;
            }
            onoff.hide();
        }

        $scope.detailUpdata = function () {
            arrayData = [{ trigger_appliance_id: $scope.conele1, trigger_id: $scope.onoff1, action_appliance_id: $scope.conele2, action_appliance_id: onoff2 }];
            putclick(0, arrayData);
        }

        $scope.detailNew = function () {
            arrayData = [{ trigger_appliance_id: $scope.conele1, trigger_id: $scope.onoff1, action_appliance_id: $scope.conele2, action_appliance_id: onoff2 }];
            postclick(0, arrayData);
        }

        /* ここから下APIクリック */
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

        function getClick(i) {
            $http({
                method: 'JSONP',
                url: url,
                params: { callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
                $scope.appliance = data;
                $scope.applianceDetail = data;
                if (i == 1) {
                    myNavigator.pushPage(page);
                }
                alert('GET: ok');
            })
            .error(function () {
                alert('GET: error');
            });
        }

        function getConeleClick() {
            $http({
                method: 'JSONP',
                url: dataUrl,
                params: { callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
                $scope.coneleList = data;
                alert('GET: ok');
            })
            .error(function () {
                alert('GET: error');
            });
        }

        //設定名

        function postClick(i, postData) {
            $http({
                method: 'POST',
                url: url,
                data: postData
            })
            .then(function (response) {
                alert(response.status);
                alert(response.headers("location"));
                if (i == 1) {
                    url = firstUrl + response.headers("location");
                    getClick(1);
                }
                else {
                    getClick(0);
                }
            });
        }

        //設定内容

        function postDetailClick(postname) {
            $http({
                method: 'POST',
                url: url,
                data: { name: postname, status: 0 }
            })
            .then(function (response) {
                alert(response.status);
                alert(response.headers("location"));
                getClick(0);
            });
        }

        function deleteClick() {
            $http({
                method: 'DELETE',
                url: url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;application/json;' }
            })
            .success(function () {
                alert('DELETE: ok');
            })
            .error(function () {
                alert('DELETE: error');
            });
        }

        function putClick(putData) {
            $http({
                method: 'PUT',
                url: url,
                data: putData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;application/json;' }
            })
            .success(function () {
                alert('PUT: ok');
            })
            .error(function () {
                alert('PUT: error');
            });
        }
    }]);
})();

