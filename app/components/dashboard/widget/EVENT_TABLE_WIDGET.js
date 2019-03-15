angular.module('app.mydash')
    .controller('EVENT_TABLE_WIDGET_Ctrl', eventTableWdgtCtrl)
    .controller('EVENT_TABLE_WIDGET_SET_Ctrl', eventTableWdgtSetCtrl);

function eventTableWdgtCtrl($scope, myDashService, $translate, $rootScope) {

    var checkLog = false;

    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtInfo = widget;
        $scope.gridCol = JSON.parse(widget.wdgtDataset).ds; //데이터셋
        $scope.gridOptn = widget.wdgtOptn; //옵션

        if ( widget.wdgtDataset.indexOf('occurDtt') > -1 ) { //로그API호출여부
            checkLog = true;
        }
        getEvetList();//이벤트 목록 조회

        //변경된 위젯설정 배포
        $scope.$on($scope.wdgtInfo.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.refresh ) {
                getEvetList();//이벤트 목록 조회
            }
        });
    };

    //이벤트 목록 조회
    function getEvetList(){
        $scope.noData = '';
        $scope.eventList = []; //위젯에 출력되는 이벤트 목록

        var checkLog = false;
        if ( $scope.wdgtInfo.wdgtDataset.indexOf('occurDtt') > -1 ) { //로그API호출여부
            checkLog = true;
        }

        myDashService.getEventList()
            .success(function(data){
                if ( data.responseCode === 'OK' ) {
                    var allEventList = data.data.rows;
                    if (data.data.total > 0) {
                        myDashService.getEventWdgtBySbjt($scope.wdgtInfo)
                            .success(function(resp){
                                if ( resp.responseCode === '200' && resp.data ) {
                                    var index = 1; //순번 생성용
                                    var result = resp.data; //기저장된 이벤트
                                    for (var i=0, iCount=result.length; i<iCount; i++) {
                                        var savedEvent = result[i];
                                        for (var j=0, jCount=allEventList.length; j<jCount; j++) {
                                            var allEvent = allEventList[j];
                                            if ( savedEvent.evetSeq == allEvent.epl_seq ) {
                                                $scope.eventList.push({'seq':index, 'eventSeq':allEvent.epl_seq, 'eventNm':allEvent.statEvetNm, 'occurDtt':'-', 'power':allEvent.stat_epl});
                                                index++;
                                            }
                                        }
                                    }
                                    if ( $scope.eventList && checkLog ) {
                                        var lastTime = new Date().getTime()-(30*1000*60*60*24);
                                        for ( var k=0, kCount=$scope.eventList.length; k<kCount; k++ ) {
                                            getEventLog(k, lastTime);
                                        }
                                    }
                                } else {
                                    $scope.noData = $translate.instant('comm.eMsgNoData');
                                }
                            });
                    } else {
                        $scope.noData = $translate.instant('comm.eMsgNoData');
                    }
                }
            });
    }

    //최근발생일시 세팅을 위한 이벤트 로그 호출
    function getEventLog(k, lastTime) {
        myDashService.getEventLogByRuleSeq($scope.eventList[k].eventSeq,lastTime)
            .success(function(data){
                if ( data.responseCode === 'OK' && data.data.rows.length > 0 ) {
                    $scope.eventList[k].occurDtt = moment(data.data.rows[0].outbDtm).format('YY-MM-DD HH:mm:ss');//최근발생일시
                }
            });
    }

    //Polling 값 수신
    // $scope.$on('getDevLastVal', function (e, data) {
    //     //console.log(data.data);
    //     //getDevList(data.data);
    // });

    //table col css
    $scope.colWidth = function(grid) {
        if ( grid.id === 'power' ) {
            return 'col-w100p';
        } else if ( grid.id === 'seq' ) {
            return 'col-w40p';
        }
        return '';
    }

    //이벤트 상태 변경
    $scope.changeSwitch = function(eventSeq, value) {
        var sttus = 'stop';
        if ( value === '01' ) { //on
            sttus = 'start';
        }
        myDashService.updateEventStatus(eventSeq,sttus)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    //변경된 이벤트 상태 정보 배포
                    $rootScope.$broadcast('sendEventSttus', {
                        eventSeq : eventSeq,
                        eventSttus: value
                    });
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    //변경된 이벤트 상태 정보 적용
    $scope.$on('sendEventSttus', function(event, arg){
        for ( var i=0, iCount=$scope.eventList.length; i<iCount; i++ ) {
            var event = $scope.eventList[i];
            if ( arg.eventSeq === event.eventSeq ) {
                event.power = arg.eventSttus;
            }
        }
    });

}

function eventTableWdgtSetCtrl($translate, $scope, $rootScope, $modalInstance, myDashService, wdgtInfo) {

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
            if( resp.responseCode == 'OK') {
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
                    ,'mbrId':sessionStorage.getItem('dash_mbr_id')};
        myDashService.insertEventWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

}