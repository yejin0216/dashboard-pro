angular.module('app.mydash')
    .controller('DashboardLogController', DashboardLogController)
    .filter('eventGradeNm', function($translate) {
        return function (input) {
            if ( input == '01' ) {
                return $translate.instant('comm.caution'); //주의
            }
            if ( input == '02' ) {
                return $translate.instant('comm.risk'); //위험
            }
            if ( input == '03' ) {
                return $translate.instant('comm.urgency'); //긴급
            }
        };
    });

function DashboardLogController($rootScope, $scope, myDashService, messageBox, $translate) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    $scope.today = moment().format('dddd, MM-DD-YYYY');
    $scope.moreData = false;
    $scope.limit = 10;
    var refreshTime = moment().format('x');

    //이벤트 로그
    getDevEvent();
    function getDevEvent() {
        //이벤트 목록 조회
        var fromDt = refreshTime - 86400000; //최근 1일
        myDashService.getEventList()
            .success(function(resp){
                if( resp.responseCode == 'OK' && resp.data ) {
                    $scope.eventLogs = [];
                    for ( var i=0, iCount=resp.data.total; i<iCount; i++ ) {
                        var eplSeq = resp.data.rows[i].epl_seq;
                        myDashService.getEventLogByRuleSeq(eplSeq, fromDt)
                            .success(function(data){
                               var logs = data.data.rows;
                               for ( var j=0, jCount=logs.length; j<jCount; j++ ) {
                                   $scope.eventLogs.push(logs[j]);
                               }
                               if ( $scope.eventLogs.length > 10 ) { //limit이 10개 이상일 경우 "더보기" 활성화
                                   $scope.moreData = true;
                               }
                            });
                    }
                }
            });
    }

    //로그 갱신
    $scope.refreshLog = function() {
        //이벤트 목록 조회
        myDashService.getEventList()
            .success(function(resp){
                if( resp.responseCode == 'OK' && resp.data ) {
                    var logCount = 0;
                    for ( var i=0, iCount=resp.data.total; i<iCount; i++ ) {
                        var eplSeq = resp.data.rows[i].epl_seq;
                        var k = 1;
                        myDashService.getEventLogByRuleSeq(eplSeq, refreshTime)
                            .success(function(data){
                                var logs = data.data.rows;
                                logCount = logs.length;
                                if (logCount > 0) {
                                    for ( var j=0, jCount=logs.length; j<jCount; j++ ) {
                                        $scope.eventLogs.shift();
                                        $scope.eventLogs.push(logs[j]);
                                    }
                                    if ( $scope.eventLogs.length > 10 ) { //limit이 10개 이상일 경우 "더보기" 활성화
                                        $scope.moreData = true;
                                    }
                                }
                                k++
                            })
                            .finally(function(){
                                if ( k===resp.data.total ) {
                                    messageBox.open($translate.instant('dash.eMsgRefreshLog01', {value:logCount}), {
                                        type: "info"
                                    });
                                }
                            });
                    }
                }
            });
    }

    //더보기
    $scope.getMoreData = function() {
        var added = $scope.limit + 10;
        if ( added >= $scope.eventLogs.length ) {
            $scope.moreData = false;
            $scope.limit = $scope.eventLogs.length;
        } else {
            $scope.limit = added;
        }
    }

    //이벤트 상세보기
    $scope.showEventDetail = function(index, event, flag) {
        //로그
        if ( flag === 'log' ) {
            $scope.logArea = index;
            $scope.infoArea = null;

            var complexInfo = JSON.parse(event.complexEventObj)[0];
            var collectInfo = JSON.parse(event.collectEventObj)[0];
            if ( complexInfo ) { //복합이벤트
                $scope.eventDetail = $translate.instant('comm.eMsgEvetLogInfo') + ' : ' + complexInfo.evtId;
            }
            if ( collectInfo ) { //수집이벤트
                $scope.eventDetail = collectInfo.attributes;
            }

            complexInfo, collectInfo = null;
        }

        //연관정보
        if ( flag === 'info' ) {
            $scope.logArea = null;
            $scope.infoArea = index;
            $scope.evetRelList = [];
            $scope.deviceRelList = [];
            $scope.tagStrmRelList = [];
            $scope.evetActScrtBasList = [];

            myDashService.getEventEditorData(event.ruleSeq)
                .success(function(data){
                    if ( data.responseCode === 'OK' && data.data ) {
                        var eventInfo = data.data;
                        if( eventInfo && eventInfo.evetRelList && eventInfo.evetRelList.length > 0){
                            $scope.evetRelList = eventInfo.evetRelList;
                            $scope.evetRelView = true;
                        }
                        if( eventInfo && eventInfo.deviceRelList && eventInfo.deviceRelList.length > 0){
                            $scope.deviceRelList = eventInfo.deviceRelList;
                            $scope.deviceRelView = true;
                        }
                        if( eventInfo && eventInfo.tagStrmRelList && eventInfo.tagStrmRelList.length > 0){
                            $scope.tagStrmRelList = eventInfo.tagStrmRelList;
                            $scope.tagStrmRelView = true;
                        }
                        if( eventInfo && eventInfo.evetActScrtBasList && eventInfo.evetActScrtBasList.length > 0){
                            $scope.evetActScrtBasList = eventInfo.evetActScrtBasList;
                            $scope.workflowRelView = true;
                        }
                        eventInfo = null;
                    }
                })
                .error(function(resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        }
    }

    //이벤트 등급에 따른 컬러
    $scope.eventGradeColor = function(eventGrade) {
        if ( eventGrade === '01' ) {
            return 'bs-callout waring';
        }
        if ( eventGrade === '02' ) {
            return 'bs-callout risk';
        }
        if ( eventGrade === '03' ) {
            return 'bs-callout urgency';
        }
        return 'bs-callout';
    }
}