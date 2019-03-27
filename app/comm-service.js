angular.module('app.commSvc', [])
/* messageBox */
    .factory('messageBox', function($modal, $rootScope, messageType, focus){
        return{
            open : function (message, opts) {
                var newScope = $rootScope.$new(),
                    templateUrl = "app/shared/messages/messageBox.html",
                    modalInstance,
                    options = angular.extend({}, opts);

                if(options.title){
                    templateUrl = "app/shared/messages/messageTitleBox.html",
                        newScope.title = options.title;
                }

                if(options.confirm){
                    templateUrl = "app/shared/messages/messageBoxConfim.html";
                }

                if(options.result){
                    templateUrl = "app/shared/messages/messageBoxResult.html";
                    newScope.title = options.title;
                }

                newScope.message = message;
                newScope.type = messageType[options.type] || undefined;

                modalInstance = $modal.open({
                    templateUrl : templateUrl,
                    dialogClass : "dialogue",
                    scope : newScope,
                    backdrop : true,
                    dialogFade : false
                });
                modalInstance.opened.then(function(d) {
                    $('.modal #defaultBtn').focus();
                });
                newScope.ok = function() {
                    modalInstance.close(true);
                };

                newScope.notOk = function() {
                    modalInstance.close(false);
                };
                newScope.close = function() {
                    modalInstance.dismiss('cancle');
                    focus(options.focus);

                };
                return modalInstance;
            }
        }
    })
    .directive('focusOn', function() {
        return function(scope, elem, attr) {
            scope.$on('focusOn', function(e, name) {
                if(name === attr.focusOn) {
                    elem[0].focus();
                }
            });
        };
    })
    .factory('focus', function($rootScope, $timeout) {
        return function(name) {
            $timeout(function (){
                $rootScope.$broadcast('focusOn', name);
            });
        }
    })
    .factory('stringUtil', function() {
        return{
            nullToString : function (str) {
                if ( str === '' || str === 'null' || str === null || typeof str === 'undefined' || typeof str === undefined ) {
                    return '';
                }
                return str;
            }
        }
    })
    .factory('numberUtil', function() {
        return{
            nullToString : function (num) {
                if ( num === '' || num === 'null' || num === null || typeof num === 'undefined' || typeof num === undefined ) {
                    return '';
                }
                return parseFloat(num);
            },
            nullToNumber : function (num) {
                if ( num === '' || num === 'null' || num === null || typeof num === 'undefined' || typeof num === undefined ) {
                    return null;
                }
                return parseFloat(num);
            },
            nullToZero : function (num) {
                if ( num === '' || num === 'null' || num === null || typeof num === 'undefined' || typeof num === undefined ) {
                    return 0;
                }
                return parseFloat(num);
            }
        }
    })
    .directive('capabilityUi', function($rootScope, $compile, $translate, myDashService, messageBox) {
        return {
            restrict: 'E',
            scope: {
                list:"=",
                dev:"="},
            replace: true,
            template: '',
            link: function(scope, element) {
                var selectedDataList = scope.list;
                var savedDev = selectedDataList.filter(function(data){
                                    return data.svcTgtSeq == scope.dev.svcTgtSeq
                                        && data.spotDevSeq == scope.dev.spotDevSeq
                                        && data.snsrCd == scope.dev.snsrCd })[0]; //저장된 정보

                if ( !savedDev ) return;//저장된 디바이스 정보 없을 경우
                if ( savedDev.values ) {//Capability value list
                    scope.valList = JSON.parse(JSON.stringify(savedDev.values));
                    scope.valList.sort(function (a, b) { // 정렬
                        return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
                    });
                }

                scope.devInfo = savedDev; //allocation
                scope.ctrlAmdDtt = savedDev.amdDtt||''; //최근 제어일시
                if ( savedDev.uiType === 'TEXT' ) { //대부분 TEXT이기 때문에 제일 앞에 둔다.
                    scope.ctrlText = scope.devInfo.lastVal? scope.devInfo.lastVal.replace(/"/g,""):'';
                    var template  = '<div class="capaUi"><textarea rows="2" cols="16" ng-model="ctrlText"></textarea><button type="button" class="btn btn-normal btn-ctrl" ng-click="sendCtr(devInfo, ctrlText, devInfo.value)">SET</button></div>';
                        template += '<div class="amdDtt">{{ctrlAmdDtt}}</div>';
                } else if ( savedDev.uiType === 'COMBO' ) {
                    var template  = '<div class="capaUi"><select class="form-control" ng-model="selectedVal" ng-options="val as val.name for val in valList"><option value="">{{"comm.choise" | translate}}</option></select><button type="button" class="btn btn-normal btn-ctrl" ng-click="sendCtr(devInfo, selectedVal.data, devInfo.value)">SET</button></div>';
                        template += '<div class="amdDtt">{{ctrlAmdDtt}}</div>';
                    if (savedDev.lastVal) {// 마지막 제어값이 있는 경우
                        var index = 0;
                        angular.forEach(scope.valList, function(val, idx){
                            if(val.data == savedDev.lastVal){
                                index = idx;
                            }
                        });
                        scope.selectedVal = scope.valList[index];
                    } else {
                        scope.selectedVal = scope.valList[0];
                    }
                } else if ( savedDev.uiType === 'BUTTON' ) {
                    scope.ctrlText = scope.devInfo.lastVal||'';
                    var template  = '<div class="capaUi"><p class="btn-capa h30" ng-class="{on:ctrlText==val.data}" ng-repeat="val in valList" ng-click="sendCtr(devInfo, val.data, devInfo.value)">{{val.name}}</p></div>';
                        template += '<div class="amdDtt">{{ctrlAmdDtt}}</div>';
                }

                // 제어버튼 클릭
                scope.sendCtr = function(dev, ctrlMsg, currentVal){
                    if(ctrlMsg == undefined || ctrlMsg == ''){
                        messageBox.open($translate.instant('wdgt.eMsgNeedSensorCtrlValue'), {
                            type: "info"
                        });
                        return false;
                    }
                    if(currentVal == ctrlMsg){
                        messageBox.open($translate.instant('wdgt.eMsgSetSameValue'), {
                            type: "info"
                        });
                        return false;
                    }

                    var value = ctrlMsg;
                    if ( (ctrlMsg).indexOf('"') !== -1 ) {
                        value = ctrlMsg.replace(/"/g,"");
                    }
                    if (savedDev.snsrValType === '0000030') {
                        value = parseInt(value);
                    } else if (savedDev.snsrValType === '0000010') {
                        value = parseFloat(value);
                    }
                    var param = {targetSequence:sessionStorage.getItem('svc_tgt_seq'), sequence:dev.spotDevSeq, sync:false, sensingTags:[{code:dev.snsrCd, value:value, group:dev.group}] };
                    myDashService.putCtrlLogs(param)
                        .success(function(respData){
                            var resultData = '';
                            if(respData && respData.responseCode=="200" && respData.message ? resultData= respData.message : resultData){
                                messageBox.open($translate.instant('wdgt.eMsgExcutedCtrlCmd'), {
                                    type: "info"
                                });
                                // 다른 위젯에도 동일한 제어 상태를 반영하기 위하여 broadcast
                                dev.value = ctrlMsg;
                                dev.amdDtt = moment().format('YYYY-MM-DD HH:mm:ss');
                                $rootScope.$broadcast('sendCapabilityCtr', {
                                    ctrlDev:dev,
                                    ctrlMsg:ctrlMsg
                                });
                            }else{
                                setLastVal(dev, currentVal); //실패 시 제어 성공 마지막 값으로 셋팅
                                messageBox.open($translate.instant('wdgt.eMsgNotExcutedCtrlCmd'), {
                                    type: "info"
                                });
                            }
                        }).error(function(errData,status,header,config){
                            setLastVal(dev, currentVal); //실패 시 제어 성공 마지막 값으로 셋팅
                            messageBox.open($translate.instant('wdgt.eMsgNotExcutedCtrlCmd'), {
                                type: "info"
                            });
                        });
                }
                element.append(template);
                element.html($compile(template)(scope));

                scope.$on('sendCapabilityCtr', function(event, arg){
                    if(scope.devInfo.svcTgtSeq == arg.ctrlDev.svcTgtSeq && scope.devInfo.spotDevSeq == arg.ctrlDev.spotDevSeq && scope.devInfo.snsrCd == arg.ctrlDev.snsrCd){
                        setLastVal(scope.devInfo, arg.ctrlMsg);
                    }
                });

                // Capability UI Type에 따른 마지막 값 setting
                function setLastVal(devInfo, compareVal){
                    scope.ctrlAmdDtt = moment().format('YYYY-MM-DD HH:mm:ss'); //제어일시
                    if (devInfo.uiType === 'COMBO' ){
                        if(compareVal !=''){
                            var index = 0;
                            angular.forEach(scope.valList, function(val, idx){
                                // var value = val.data.replace(/"/g,"");
                                var value = val.data;
                                if(value == compareVal){
                                    index = idx;
                                }
                            })
                            scope.selectedVal = scope.valList[index];
                        }else{
                            scope.selectedVal = scope.valList[0];
                        }
                    } else { //TEXT,BUTTON
                        scope.ctrlText = compareVal;
                    }
                }
            }
        }
    })




