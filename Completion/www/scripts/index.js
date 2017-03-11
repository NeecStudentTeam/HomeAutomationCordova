(function () {
    'use strict'

    angular.module('my-app', ['onsen']);
    angular.module('my-app').config(['$httpProvider', function ($httpProvider) {
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    }]);
    angular.module('my-app').controller('MainController', ['$scope', '$http', function ($scope, $http) {
        /* URL */
        var url;
        var firstUrl = 'http://localhost';
        var settingUrl = '/api/appliance_link_sets/';
        var detailUrl = '/appliance_links/';
        var dataUrl;
        var ConeleUrl = '/api/appliances/';
        var onoff1Url = '/api/appliance_link_actions/';
        var onoff2Url = '/api/appliance_link_triggers/';
        var page;
        var arrayData;
        var urlId;
        var interlockId;
        $scope.appliance;
        $scope.applianceDetail;
        $scope.coneleList;
        $scope.applianceLinkActions;
        $scope.applianceLinkTriggers;
        $scope.applianceConele;
        $scope.settingId;
        $scope.detailId;
        $scope.apiData;
        $scope.coneleId;
        $scope.onoffId;
        $scope.conele1;
        $scope.conele2;
        $scope.onoff1;
        $scope.onoff2;
        $scope.coneleId1;
        $scope.coneleId2;
        $scope.onoffId1;
        $scope.onoffId2;
        $scope.provisional;
        $scope.detailSetId;

        /* ons-list‚Ìinit() */

        $scope.init = function () {
            $scope.appliance;
        }

        $scope.applianceDetInit = function () {
            $scope.applianceDetail;
        }

        $scope.coneleListInit = function () {
            $scope.coneleList;
        }

        /* home */

        $scope.page2Slide = function () {
            page = 'page2.html';
            $http.jsonp(firstUrl + onoff1Url + '?callback=JSON_CALLBACK').then(function (data) {
                $scope.applianceLinkActions = data;
                $http.jsonp(firstUrl + onoff2Url + '?callback=JSON_CALLBACK').then(function (data) {
                    $scope.applianceLinkTriggers = data;
                    $http.jsonp(firstUrl + ConeleUrl + '?callback=JSON_CALLBACK').then(function (data) {
                        $scope.applianceConele = data;
                        url = firstUrl + settingUrl;
                        getClick(1, 1);
                    });
                });
            });
        }

        /* page2 */

        $scope.interlockSetting = function (id) {
            url = firstUrl + settingUrl + id + detailUrl;
            interlockId = id;
            page = 'page3.html';
            getClick(1, 2);
        }

        $scope.interlockDelete = function (id) {
            url = firstUrl + settingUrl + id;
            deleteClick(1);
        }

        $scope.detailsetting = function (name) {
            interlock.hide();
            url = firstUrl + settingUrl;
            $scope.apiData = { name: name, status: 0 };
            page = 'page3.html';
            postClick(1, $scope.apiData, 2);
        }

        /* page3 */

        $scope.ConEleChoice = function (id) {
            url = firstUrl + settingUrl + interlockId + detailUrl + id;
            ConeleSet1.show();
        }

        $scope.detailDelete = function (id) {
            url = firstUrl + settingUrl + interlockId + detailUrl + id;
            deleteClick(2);
        }

        $scope.coneleSetting = function (i) {
            dataUrl = firstUrl + ConeleUrl;
            $scope.coneleId = i;
            getConeleClick();
            Conele.show();
        }

        $scope.onoffSetting = function (i) {
            switch (i) {
                case 1:
                    dataUrl = firstUrl + onoff1Url;
                    break;
                case 2:
                    dataUrl = firstUrl + onoff2Url;
                    break;
            }
            $scope.onoffId = i;
            getConeleClick();
            onoff.show();
        }

        $scope.coneleData = function (i, id) {
            $scope.provisional = i;
            $scope.detailSetId = id;
        }

        $scope.coneleDataSet = function () {
            switch ($scope.coneleId) {
                case 1:
                    $scope.conele1 = $scope.provisional;
                    $scope.coneleId1 = $scope.detailSetId;
                    break;
                case 2:
                    $scope.conele2 = $scope.provisional;
                    $scope.coneleId2 = $scope.detailSetId;
                    break;
            }
            Conele.hide();
        }

        $scope.onoffChange = function (i, id) {
            $scope.provisional = i;
            $scope.detailSetId = id;
        }

        $scope.onoffChangeSet = function () {
            switch ($scope.onoffId) {
                case 1:
                    $scope.onoff1 = $scope.provisional;
                    $scope.onoffId1 = $scope.detailSetId;
                    break;
                case 2:
                    $scope.onoff2 = $scope.provisional;
                    $scope.onoffId2 = $scope.detailSetId;
                    break;
            }
            onoff.hide();
        }

        $scope.detailUpdate = function () {
            arrayData = { appliance_link_set_id: interlockId, trigger_appliance_id: $scope.coneleId1, trigger_id: $scope.onoffId1, action_appliance_id: $scope.coneleId2, action_id: $scope.onoffId2 };
            putClick(0, arrayData);
            ConeleSet1.hide();
        }

        $scope.detailNew = function () {
            arrayData = { appliance_link_set_id: $scope.coneleId1, trigger_appliance_id: $scope.onoffId1, trigger_id: $scope.coneleId2, action_appliance_id: $scope.onoffId2, action_id: 1 };
            postClick(0, arrayData, 2);
            ConeleSet2.hide();
        }

        /* ‚±‚±‚©‚ç‰ºAPIƒNƒŠƒbƒN */
        function getClick(i, j) {
            $http({
                method: 'JSONP',
                url: url,
                params: { callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
                if (j == 1) {
                    $scope.appliance = data;
                }
                else if (j == 2) {
                    var applianceDetails = [];
                    if (i == 0) {
                        angular.forEach(data, function (applianceDetailData) {
                            applianceDetailData.triggerAppliance = $scope.applianceConele.data.filter(function (value) { return value.id == this.trigger_appliance_id; }, applianceDetailData)[0].name;
                            applianceDetailData.trigger = $scope.applianceLinkTriggers.data.filter(function (value) { return value.id == this.trigger_id; }, applianceDetailData)[0].name;
                            applianceDetailData.actionAppliance = $scope.applianceConele.data.filter(function (value) { return value.id == this.action_appliance_id; }, applianceDetailData)[0].name;
                            applianceDetailData.action = $scope.applianceLinkActions.data.filter(function (value) { return value.id == this.action_id; }, applianceDetailData)[0].name;
                        });
                    }
                    $scope.applianceDetail = data;
                }
                if (i == 1) {
                    myNavigator.pushPage(page);
                }
            })
            .error(function () {
                alert('GET: error');
            });
        }
        function setData(data, i, j) {


        }

        function getConeleClick() {
            $http({
                method: 'JSONP',
                url: dataUrl,
                params: { callback: 'JSON_CALLBACK' }
            })
            .success(function (data) {
                $scope.coneleList = data;
            })
            .error(function () {
                alert('GET: error');
            });
        }

        function postClick(i, postData, j) {
            $http({
                method: 'POST',
                url: url,
                data: postData
            })
            .then(function (response) {
                if (i == 1) {
                    url = firstUrl + response.headers("location");
                    getClick(1, j);
                }
                else {
                    getClick(0, j);
                }
            });
        }

        function deleteClick(j) {
            $http({
                method: 'DELETE',
                url: url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;application/json;' }
            })
            .success(function () {
                if (j == 1) {
                    url = firstUrl + settingUrl;
                }
                else if (j == 2) {
                    url = firstUrl + settingUrl + interlockId + detailUrl;
                }
                getClick(0, j);
            })
            .error(function () {
                alert('DELETE: error');
            });
        }

        function putClick(i, putData) {
            $http({
                method: 'PUT',
                url: url,
                data: putData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;application/json;' }
            })
            .success(function () {
                getClick(i, 2);
            })
            .error(function () {
                alert('PUT: error');
            });
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
    }]);
})();