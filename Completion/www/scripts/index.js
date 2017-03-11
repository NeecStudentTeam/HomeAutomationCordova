(function () {
    'use strict'

    angular.module('my-app', ['onsen']);
    angular.module('my-app').config(['$httpProvider', function ($httpProvider) {
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    }]);
    angular.module('my-app').controller('MainController', ['$scope', '$http', function ($scope, $http) {
        /* URL */
        var url;
        var firstUrl = 'http://192.168.0.128';
        var settingUrl = '/api/appliance_link_sets/';
        var detailUrl = '/appliance_links/';
        var dataUrl;
        var ConeleUrl = '/api/appliances/';
        var onoff1Url = '/api/appliance_link_triggers/';
        var onoff2Url = '/api/appliance_link_actions/';
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

        /* ons-list��init() */

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
            $scope.reloadPage2Data(function(){
              page = 'page2.html';
              url = firstUrl + settingUrl;
              getClick(1, 1);
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
            url = firstUrl + settingUrl;
            $scope.apiData = { name: name, status: 0 };
            // 連動設定グループを追加 追加後、連動設定グループを開く
            postClick($scope.apiData, function(response){
                interlock.hide();
                var arr = response.headers("location").split('/');
                $scope.interlockSetting(arr[arr.length-1]);
            });
        }

        /* page3 */
        
        $scope.applianceDetailClick = function(index) {
          ConEleChoice($scope.applianceDetail[index].id);
        }

        $scope.ConEleChoice = function (id) {
            $scope.detailId = id;
            var applianceDetail = $scope.applianceDetail.filter(function (value) { return value.id == this; }, id)[0];
            if(applianceDetail) {
              $scope.coneleId1 = applianceDetail.trigger_appliance_id;
              $scope.coneleId2 = applianceDetail.action_appliance_id;
              $scope.onoffId1 = applianceDetail.trigger_id;
              $scope.onoffId2 = applianceDetail.action_id;
              $scope.conele1 = applianceDetail.triggerAppliance;
              $scope.onoff1 = applianceDetail.trigger;
              $scope.conele2 = applianceDetail.actionAppliance;
              $scope.onoff2 = applianceDetail.action;
            }
            else {
                $scope.coneleId1 = null;
                $scope.coneleId2 = null;
                $scope.onoffId1 = null;
                $scope.onoffId2 = null;
                $scope.conele1 = "家電を選択";
                $scope.conele2 = "家電を選択";
                $scope.onoff1 = "条件を選択";
                $scope.onoff2 = "動作を選択";
            }
            ConeleSet1.show();
        }
        
        $scope.ConEleChoice2 = function (id) {
            $scope.coneleId1 = null;
            $scope.coneleId2 = null;
            $scope.onoffId1 = null;
            $scope.onoffId2 = null;
            $scope.conele1 = "家電を選択";
            $scope.conele2 = "家電を選択";
            $scope.onoff1 = "条件を選択";
            $scope.onoff2 = "動作を選択";
            ConeleSet2.show();
        }

        $scope.detailDelete = function (id) {
            url = firstUrl + settingUrl + interlockId + detailUrl + id;
            deleteClick(2);
        }

        $scope.coneleSetting = function (i) {
            $scope.coneleList = $scope.applianceConele;
            $scope.coneleId = i;
            Conele.show();
        }

        $scope.onoffSetting = function (i) {
            switch (i) {
                case 1:
                    $scope.coneleList = $scope.applianceLinkTriggers;
                    break;
                case 2:
                    $scope.coneleList = $scope.applianceLinkActions;
                    break;
            }
            $scope.onoffId = i;
            onoff.show();
        }

        $scope.coneleData = function (i, id) {
            $scope.provisional = i;
            $scope.detailSetId = id;
            $scope.coneleDataSet();
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
            $scope.onoffChangeSet();
            onoff.hide()
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
        
        $scope.reloadDetailPage = function() {
          url = firstUrl + settingUrl + interlockId + detailUrl;
          getClick(0, 2);
        }

        $scope.detailUpdate = function () {
            url = firstUrl + settingUrl + interlockId + detailUrl + $scope.detailId;
            arrayData = { appliance_link_set_id: interlockId, trigger_appliance_id: $scope.coneleId1, trigger_id: $scope.onoffId1, action_appliance_id: $scope.coneleId2, action_id: $scope.onoffId2 };
            // 連動設定を更新 更新後、表示を更新
            putClick(arrayData, function(){
              $scope.reloadDetailPage();
              ConeleSet1.hide();
            });
        }

        $scope.detailNew = function () {
            url = firstUrl + settingUrl + interlockId + detailUrl;
            arrayData = { appliance_link_set_id: interlockId, trigger_appliance_id: $scope.coneleId1, trigger_id: $scope.onoffId1, action_appliance_id: $scope.coneleId2, action_id: $scope.onoffId2 };
            // 連動設定を追加 追加後、表示を更新
            postClick(arrayData, function(response){
              $scope.reloadDetailPage();
              ConeleSet2.hide();
            });
        }
        
        $scope.reloadPage2Data = function(callback) {
          $http.jsonp(firstUrl + onoff1Url + '?callback=JSON_CALLBACK').then(function (data) {
              $scope.applianceLinkTriggers = data.data;
              $http.jsonp(firstUrl + onoff2Url + '?callback=JSON_CALLBACK').then(function (data) {
                  $scope.applianceLinkActions = data.data;
                  $http.jsonp(firstUrl + ConeleUrl + '?callback=JSON_CALLBACK').then(function (data) {
                      $scope.applianceConele = data.data;
                      if(callback) {
                        callback();
                      }
                  });
              });
          });
        }

        /* �������牺API�N���b�N */
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
                    // 取得した連動設定に表示用の値を設定する
                    angular.forEach(data, function (applianceDetailData) {
                        var triggerAppliance = $scope.applianceConele.filter(function (value) { return value.id == this.trigger_appliance_id; }, applianceDetailData)[0];
                        applianceDetailData.triggerAppliance = triggerAppliance ? triggerAppliance.name : 'データがありません';
                        var applianceLinkTrigger = $scope.applianceLinkTriggers.filter(function (value) { return value.id == this.trigger_id; }, applianceDetailData)[0];
                        applianceDetailData.trigger = applianceLinkTrigger ? applianceLinkTrigger.name : 'データがありません';
                        var actionAppliance = $scope.applianceConele.filter(function (value) { return value.id == this.action_appliance_id; }, applianceDetailData)[0];
                        applianceDetailData.actionAppliance = actionAppliance ? actionAppliance.name : 'データがありません';
                        var applianceLinkAction = $scope.applianceLinkActions.filter(function (value) { return value.id == this.action_id; }, applianceDetailData)[0];
                        applianceDetailData.action = applianceLinkAction ? applianceLinkAction.name : 'データがありません';
                    });
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

        function postClick(postData, callback) {
            $http({
                method: 'POST',
                url: url,
                data: postData
            })
            .then(function (response) {
                if(callback) {
                  callback(response);
                }
            }).catch(function(fallback) {
                alert('POST ERROR:' + fallback.status + '\n' +
                      'RESPONSE:\n' +
                      JSON.stringify(fallback.data) + '\n'
                );
            });;
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

        function putClick(putData, callback) {
            $http({
                method: 'PUT',
                url: url,
                data: putData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;application/json;' }
            })
            .success(function () {
                if(callback) {
                  callback();
                }
            })
            .error(function (data) {
                alert('PUT ERROR:' + data.status + '\n' +
                      'RESPONSE:\n' +
                      JSON.stringify(data) + '\n'
                );
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
