angular.module('app.mydash')
    .controller('SENSOR_LOG_WIDGET_Ctrl', sensorLogWdgtCtrl)
    .controller('SENSOR_LOG_WIDGET_SET_Ctrl', sensorLogWdgtSetCtrl)
    .directive('logChart', function (myDashService, $modal) {
        return {
            restrict:'A',
            template:'<div class="logCalendar" ng-show="showCalendar" ng-click="setDate()"><i class="far fa-calendar-alt"></i></div><div class="fullSizeArea"></div>',
            scope:{
                widget:'='
            },
            link:function (scope, element) {
                var element = element[0];
                var wdgtSeq = scope.widget.wdgtSeq;
                var chart, savedInfo;

                scope.showCalendar = false; //캘린더 버튼 제어

                //chart allocation
                function createChart() {
                    var chartId = 'widget_'+wdgtSeq;
                    element.children[1].id = chartId; //차트ID 세팅
                    chart = Highcharts.chart(chartId, {
                        time:{
                            useUTC:false
                        },
                        chart:{
                            type:'line',
                            zoomType:'x',
                            panning:true,
                            panKey:'shift',
                            style:{
                                fontFamily:'NanumSquare'
                            }
                        },
                        boost:{
                            useGPUTranslations:true
                        },
                        legend:{
                            enabled:false
                        },
                        title:{
                            // text:'2018.01.01~2018.03.03',
                            // align:'left',
                            style:{
                                fontSize:'13px',
                                color:'#666',
                                fontWeight:'bold'
                            }
                        },
                        xAxis:{
                            type:'datetime',
                            title:null
                        },
                        series:[],
                        credits:{
                            enabled:false
                        },
                        exporting:{
                            enabled:false
                        }
                    });

                    getDevSnsrData();
                }

                //디바이스,센서 정보 조회
                function getDevSnsrData() {
                    myDashService.getDevSnsrList(wdgtSeq)
                        .success(function(resp){
                            var result = resp.data; //기저장한 디바이스,센서 정보
                            if ( resp.responseCode === '200' && result ) {
                                savedInfo = result[0];
                                //series 생성
                                var chartData = {
                                    name:savedInfo.devNm+'|'+savedInfo.snsrNm,
                                    color:'#92bcde',
                                    turboThreshold:10000
                                };
                                chart.addSeries(chartData);
                                result, chartData = null;

                                getDevSnsrLogs(savedInfo); //로그 조회
                            }
                        });
                }

                //디바이스,센서 로그 조회
                function getDevSnsrLogs(param) {
                    //차트 타이틀 생성
                    var stDt = param.retvStDt||moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm');
                    var endDt = param.retvEndDt||moment().format('YYYY-MM-DD HH:mm');
                    chart.update({title:{text:stDt + ' ~ ' + endDt}}); //타이틀 변경

                    //로그조회
                    var retvStDt = stDt ? moment(stDt).format('x'):moment().format('x') - 3600000; //1시간
                    var retvFnsDt = endDt ? moment(endDt).format('x'):moment().format('x');
                    var query = '&limit=9999&targetSequence='+param.svcTgtSeq+'&deviceSequence='+param.spotDevSeq+'&groupCode='+param.group+'&sensingTagCode='+param.snsrCd+'&from='+retvStDt+'&to='+retvFnsDt;
                    myDashService.getDevLogs(query)
                        .success(function (result) {
                            retvStDt,retvFnsDt,query = null;
                            var result = result.data;
                            var chartTempData = [];
                            if (result) {
                                for ( var j=result.length-1, k=0; j>=0; j--, k++ ) {
                                    var data = result[j];
                                    chartTempData[k] = {
                                        'x':data.createdOn,
                                        'y':parseFloat(data.response.sensingTags[0].value)
                                    };
                                    data = null;
                                }
                            }
                            chart.series[0].setData(chartTempData, true, false, false); //데이터 매핑
                            result,chartTempData = null;
                        });
                }

                //offsetWidth가 변경될 때 reflow 수행
                scope.$watch(function() {
                    return element.offsetWidth;
                }, function(value) {
                    if ( value > 123 ) {
                        chart.reflow();
                    }
                });

                //날짜 세팅 모달
                scope.setDate = function() {
                   $modal.open({
                        templateUrl:'app/components/dashboard/widget/COMM_LOG_DATE_MODAL.html',
                        scope:scope,
                        resolve:{
                            wdgtInfo:function () {
                                return savedInfo;
                            }
                        },
                        controller:'COMM_LOG_DATE_Ctrl'
                    });
                }

                //변경한 정보 반영
                scope.$on(wdgtSeq+".changeSettings", function(event, arg){
                    if ( arg.refresh ) { //디바이스,센서 변경
                        scope.showCalendar = true;
                        if ( chart.series[0] ) {
                            chart.series[0].remove();
                        }
                        getDevSnsrData();
                    } else if ( arg.param ) { //날짜 변경
                        savedInfo.retvStDt = arg.param.retvStDt;
                        savedInfo.retvFnsDt = arg.param.retvFnsDt;
                        getDevSnsrLogs(arg.param);
                    }
                });

                //chart allocation
                createChart();
            }
        }
    });

function sensorLogWdgtCtrl($translate, myDashService, $scope) {

    $scope.logList = [];

    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtSeq = widget.wdgtSeq;//위젯일련번호
        $scope.viewType = JSON.parse(widget.wdgtOptn).optn[0].id;

        //로그 조회
        getLogList($scope.wdgtSeq);

        $scope.$on($scope.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.refresh ) {
                getLogList($scope.wdgtSeq);
            }
        });
    };

    //로그 조회
    var devInfo;
    function getLogList(wdgtSeq) {
        $scope.logList = [];
        $scope.noData = '';
        myDashService.getDevSnsrList(wdgtSeq)
            .success(function(resp) {
                if (resp.responseCode === '200' && resp.data) {
                    devInfo = resp.data[0];
                    var toDt = moment().format('x');
                    var fromDt = toDt - 7889229000; //최대 최근 3개월
                    var param = '&limit=60&targetSequence='+devInfo.svcTgtSeq+'&deviceSequence='+devInfo.spotDevSeq+'&groupCode='+devInfo.group+'&sensingTagCode='+devInfo.snsrCd+'&from='+fromDt+'&to='+toDt;
                    myDashService.getDevLogs(param)
                        .success(function (result) {
                            if (result.responseCode === '200' && result.data) {
                                result = result.data;
                                var devNm = devInfo.devNm,
                                    snsrNm = devInfo.snsrNm;
                                for ( var i=0, iCount=result.length; i<iCount; i++ ) {
                                    var item = result[i];
                                    result[i] = { 'createOn':moment(item.createOn).local().format('YYYY-MM-DD HH:mm:ss')
                                                , 'devNm':devNm
                                                , 'snsrNm':snsrNm
                                                , 'value':item.response.sensingTags[0].value };
                                }
                                $scope.logList = result;
                            }
                        });
                }
            });
    }

    // 실시간 업데이트
    $scope.$on('getLastVal', function (e, data) {
        if ( $scope.viewType == 'chart' ) return;

        var pData = data.data,
            pSvcTgtSeq = pData.svcTgtSeq, //서비스 대상 일련번호
            pSpotDevSeq = pData.spotDevSeq, //디바이스 일련번호
            pAttributes = pData.attributes, //센서,최종값정보
            pGroupTagCd = pData.groupTagCd; //그룹태그

        if ( devInfo.svcTgtSeq == pSvcTgtSeq && devInfo.spotDevSeq == pSpotDevSeq && devInfo.group == pGroupTagCd && pAttributes && pAttributes[devInfo.snsrCd] ) {
            $scope.logList.unshift({'createOn':moment(pData.occDt).format("YYYY-MM-DD HH:mm:ss"),'devNm':devInfo.devNm
                                          ,'snsrNm':devInfo.group +'-'+ devInfo.snsrNm,'value':pAttributes[devInfo.snsrCd]});
        }
        if ( $scope.logList.length > 100 ) {
            $scope.logList.pop();
        }
    });

}

function sensorLogWdgtSetCtrl($translate, $rootScope, $scope, $modalInstance, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    //초기화
    function init() {
        var savedDevSnsr = wdgtInfo.devSnsrWdgtList; //기저장한 디바이스/센서 정보
        if ( savedDevSnsr ) {
            $scope.selectedList = savedDevSnsr; //디바이스명, 센서명을 찾아서 목록에 넣는다.
        } else {
            $scope.selectedList = []; //디바이스/센서 목록
        }
        savedDevSnsr = null;

        //디바이스 목록 조회
        myDashService.getDeviceList()
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.devList = resp.data; //디바이스 목록
                }
            });
    }

    /**
     * 디바이스 센서 조회
     * @param selectedDev 선택한 디바이스
     */
    $scope.getSnsrGroupByDev = function(selectedDev) {
        myDashService.getSnsrGroupList(selectedDev.devModelSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.selectedSnsrGroup = []; //센서목록 초기화
                    $scope.snsrGroupList = resp.data; //DB에서 불러온 센서그룹 목록
                }
            });
    }

    /**
     * 디바이스 센서그룹 조회
     * @param selectedSnsrGroup 선택한 센서그룹
     */
    $scope.setSnsrList = function(selectedSnsrGroup) {
        var selectedGroup = selectedSnsrGroup.code;
        myDashService.getDeviceModel($scope.selectedDev.devModelSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.selectedSnsr = []; //센서목록 초기화
                    $scope.snsrList = resp.data.sensingTags
                        .filter(function(snsr){
                            if (snsr.group === selectedGroup) {
                                return true;
                            }
                        });
                }
            });
    }

    /**
     * 추가한 센서 목록
     * @description 선택한 디바이스, 센서 목록 세팅
     */
    $scope.setSelectedList = function() {
        if ( !$scope.selectedSnsr.code ) return;

        var addItem = { 'svcTgtSeq':$scope.selectedDev.svcTgtSeq
                      , 'spotDevSeq':$scope.selectedDev.spotDevSeq
                      , 'devNm':$scope.selectedDev.devNm
                      , 'group' : $scope.selectedSnsrGroup.code
                      , 'groupNm' : $scope.selectedSnsrGroup.name
                      , 'snsrCd':$scope.selectedSnsr.code
                      , 'snsrNm':$scope.selectedSnsr.name };
        $scope.selectedList[0] = addItem; //최대 1개만 등록가능하다.
    }

    /**
     * 모달 변경내역 저장
     */
    $scope.save = function() {
        //현재 추가된 목록이 없을 경우
        if ($scope.selectedList.length === 0) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }
        if ($scope.selectedList.length > 1) {
            $scope.doNotSaveMessage = $translate.instant('wdgt.eMsgTooManyInput1', {value:1});
            return;
        }

        var param = {
            'wdgtNm':$scope.wdgtNm
            , 'wdgtSubnm':$scope.wdgtSubnm
            , 'wdgtSeq':wdgtInfo.wdgtSeq
            , 'sensors':$scope.selectedList
            , 'mbrId':sessionStorage.getItem('mbr_id')
        };
        myDashService.insertDevSnsrWdgtBySbjt(param)
            .success(function (resp) {
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {
                    wdgtNm:$scope.wdgtNm,
                    wdgtSubnm:$scope.wdgtSubnm,
                    wdgtSeq:wdgtInfo.wdgtSeq
                }); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

    /**
     * 선택한 행 삭제
     * @param index 선택한 행 인덱스
     */
    $scope.delRow = function(index) {
        $scope.selectedList.splice(index,1);
    }

    /**
     * 모달 닫기
     */
    $scope.close = function() {
        $modalInstance.close();
    }

    init();
}
