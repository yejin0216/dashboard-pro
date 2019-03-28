angular.module('app.mydash')
    // .controller('EVENT_CHART_WIDGET_Ctrl', eventChartWdgtCtrl)
    .controller('EVENT_CHART_WIDGET_SET_Ctrl', eventChartWdgtSetCtrl)
    .directive('evChart', function (myDashService, $filter) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                widget: '='
            },
            link: function (scope, element) {

                var wdgtSeq = scope.widget.wdgtSeq; //위젯일련번호

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, arg){
                    if ( arg.refresh ) {
                        getEventChart();//word cloud 생성
                    }
                });

                //word cloud 차트를 생성한다.
                function getEventChart() {
                    var newData = [];
                    myDashService.getEventWdgtBySbjt(scope.widget) //기저장한 이벤트 목록 조회
                        .success(function(resp) {
                            if (resp.responseCode === '200' && resp.data) {
                                var resp = resp.data
                                var toDt = moment().format('x');
                                var fromDt = moment(moment().format('YYYY-MM-DD 00:00')).format('x'); //금일 0시 0분부터
                                var param = '&svcTgtSeq='+sessionStorage.getItem('svc_tgt_seq')+'&from='+fromDt+'&to='+toDt;
                                myDashService.getEventCount(param)
                                    .success(function(list) {
                                        if (list.responseCode === 'OK') {
                                            var list = list.data;
                                            for ( var i=0, iCount=resp.length; i<iCount; i++ ) { //저장한 이벤트 목록
                                                var savedItem = resp[i];
                                                savedItem.weight = 0;
                                                for ( var j=0, jCount=list.length; j<jCount; j++ ) { //카운트 조회한 이벤트 목록
                                                    var retvItem = list[j];
                                                    if ( savedItem.evetSeq == retvItem.ruleSequence ) {
                                                        savedItem.weight += Number(retvItem.count);
                                                        savedItem.name = retvItem.eventName;
                                                    }
                                                }
                                                newData.push({name:savedItem.name,weight:savedItem.weight});
                                            }
                                            newData = $filter('orderBy')(newData, 'weight', true);

                                            var chartOptions = {
                                                series: [{
                                                    type: 'wordcloud',
                                                    data: newData,
                                                    name: 'Occurrences'
                                                }],
                                                title: {
                                                    text: null
                                                },
                                                credits: {
                                                    enabled:false
                                                }
                                            }

                                            element[0].id = 'widget_'+wdgtSeq;
                                            Highcharts.chart(element[0], chartOptions);
                                            $('#'+element[0].id).highcharts();
                                        }
                                    });
                            }
                        });
                }

                getEventChart(); //word cloud 호출

            }
        };
    });

// function eventChartWdgtCtrl($scope, myDashService) {
// }

function eventChartWdgtSetCtrl($translate, $scope, $rootScope, $modalInstance, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    //선택한 이벤트구분
    $scope.selectedType = '';
    //이벤트 목록
    $scope.eventList = [];
    //추가한 이벤트 목록
    $scope.selectedList = [];
    //유효성검증 메시지
    $scope.invalidMessage = '';

    //이벤트목록 조회
    myDashService.getEventList()
        .success(function(resp){
            if( resp.responseCode == 'OK' ) {
                var result = resp.data;
                $scope.eventList = result.rows;

                //기저장한 이벤트 목록이 있을 경우 이벤트 목록을 세팅한다.
                if ( wdgtInfo.eventWdgtList && result.total > 0 ) {
                    var savedEvent = wdgtInfo.eventWdgtList;
                    var allEvent = result.rows;
                    for ( var i=0, iCount=result.total; i<iCount; i++ ) {
                        for ( var j=0, jCount=savedEvent.length; j<jCount; j++ ) {
                            if ( allEvent[i].epl_seq == savedEvent[j].evetSeq ) {
                                $scope.selectedList.push({'evetSeq':allEvent[i].epl_seq,'evetNm':allEvent[i].statEvetNm});
                            }
                        }
                    }
                }
            }
        });

    /**
     * 모달 닫기
     */
    $scope.close = function() {
        $modalInstance.close();
    }

    //선택한 디바이스, 센서 목록 세팅
    $scope.setSelectedList = function() {
        if ( !$scope.selectedEvent ) return;

        //중복 데이터가 있는지 유효성 검증한다.
        var dupFlag = false;
        for ( var i=0, count=$scope.selectedList.length; i<count; i++ ) {
            var item = $scope.selectedList[i];
            if ( item.evetSeq == $scope.selectedEvent.epl_seq ) {
                dupFlag = true;
            }
        }
        if ( dupFlag ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgEventDupError');
            return;
        }

        var addItem = { 'evetSeq': $scope.selectedEvent.epl_seq
                      , 'evetNm': $scope.selectedEvent.statEvetNm};
        $scope.selectedList.push(addItem);
    }

    /**
     * 선택한 행 삭제
     * @param index 선택한 행 인덱스
     */
    $scope.delRow = function(index) {
        $scope.selectedList.splice(index,1);
    }

    //모달 변경내역 저장
    $scope.save = function() {
        //현재 추가된 목록이 없을 경우
        if ( $scope.selectedList.length == 0 ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }
        //추가한 이벤트 저장
        var param = {'wdgtNm':$scope.wdgtNm
                    ,'wdgtSubnm':$scope.wdgtSubnm
                    ,'wdgtSeq':wdgtInfo.wdgtSeq
                    ,'events':$scope.selectedList
                    ,'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertEventWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

}