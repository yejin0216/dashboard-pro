angular.module('app.mydash')
    .controller('SENSOR_CHART_WIDGET_SET_Ctrl', sensorChartWdgtSetCtrl)
    .directive('hcChart', function (myDashService, numberUtil, $filter) {
        return {
            restrict: 'A',
            scope: {
                widget: '='
            },
            link: function (scope, element) {
                var wdgtSeq = scope.widget.wdgtSeq; //위젯일련번호
                var element = element[0];
                var chart;

                //chart option allocation
                function initChart() {
                    element.id = 'widget_'+wdgtSeq; //차트ID 세팅
                    element.identity = 10;

                    var optn = JSON.parse(scope.widget.wdgtOptn);
                    var type = optn.optn[0].id; //차트타입
                    //var dim = optn.dimension; //차원
                    var plotBands = optn.plotBands; //plotband
                    var min = optn.min || 0; //min
                    var max = optn.max || 200; //max
                    optn = null;

                    var xAxisType = {'bar':'category','column':'category','spiderWeb':'category','line':'datetime','area':'datetime','scatter':'datetime','gauge':''};

                    //차트옵션
                    var chartOptions = {
                        time:{
                            useUTC:false
                        },
                        chart:{
                            type:type,
                            style: {
                                fontFamily: 'NanumSquare'
                            }
                        },
                        title:{
                            text:null
                        },
                        legend:{
                            enabled:true
                        },
                        tooltip:{
                            crosshairs:true,
                            shared:true
                        },
                        credits:{
                            enabled:false
                        },
                        plotOptions:{},
                        xAxis:{
                            type:xAxisType[type],
                            title:null
                        },
                        yAxis:{},
                        series:[]
                    };

                    if ( type === 'scatter' ) { //분산형
                        chartOptions.tooltip.headerFormat = '{point.key:%A, %b %e, %H:%M:%S.%L}<br/>';
                        chartOptions.tooltip.pointFormat = '{series.name} : {point.y}';
                    } else if ( type === 'spiderWeb' ) { //방사형
                        chartOptions.chart.type = 'column';
                        chartOptions.chart.polar = true;
                        chartOptions.legend.enabled = false;
                        element.identity = 20;
                    } else if ( type === 'gauge' ) { //게이지
                        chartOptions.chart = {
                            type: 'gauge',
                            plotBackgroundColor: null,
                            plotBackgroundImage: null,
                            plotBorderWidth: 0,
                            plotShadow: false
                        };
                        chartOptions.title = {
                            style: {
                                fontFamily: 'NanumSquare'
                            }
                        };
                        chartOptions.pane = {
                            startAngle: -150,
                            endAngle: 150,
                            background: [{
                                backgroundColor: {
                                    stops: [
                                        [0, '#fff'],
                                        [1, '#fff']
                                    ]
                                },
                                borderWidth: 0,
                                outerRadius: '109%'
                            }, {
                                backgroundColor: {
                                    stops: [
                                        [0, '#fff'],
                                        [1, '#fff']
                                    ]
                                },
                                borderWidth: 1,
                                outerRadius: '107%'
                            }, {
                                backgroundColor: '#DDD',
                                borderWidth: 0,
                                outerRadius: '105%',
                                innerRadius: '103%'
                            }]
                        };
                        chartOptions.yAxis = {
                            min: min,
                            max: max,
                            minorTickInterval: 'auto',
                            minorTickWidth: 1,
                            minorTickLength: 10,
                            minorTickPosition: 'inside',
                            minorTickColor: '#666',
                            tickPixelInterval: 30,
                            tickWidth: 2,
                            tickPosition: 'inside',
                            tickLength: 10,
                            tickColor: '#666',
                            labels: {
                                step: 2,
                                rotation: 'auto'
                            },
                            title: {
                                text: null
                            }
                        };
                        chartOptions.legend.enabled = false;
                        element.identity = 30;
                    } else if ( type === 'bar' || type === 'column' ) {
                        chartOptions.legend.enabled = false;
                        chartOptions.plotOptions.bar = {
                            dataLabels: {
                                enabled: true,
                                color: '#2d2d2d'
                            }
                        };
                        chartOptions.plotOptions.column = {
                            dataLabels: {
                                enabled: true,
                                color: '#2d2d2d'
                            }
                        };
                        element.identity = 20;
                    }

                    // if ( dim ) { //차원정보
                    //     chartOptions.chart.options3d = {enabled:true, alpha:15, beta:15, depth:50, viewDistance:25};
                    // }
                    if ( plotBands ) { // 기준구간
                        chartOptions.yAxis.plotBands = plotBands;
                    }

                    return chartOptions; //차트 옵션
                }

                //차트데이터 조회
                function getDevSnsrList(chartOptions) {
                    chart = Highcharts.chart(element.id, chartOptions); //차트 생성
                    var identity = element.identity;
                    var chartColor = ['#92bcde','#9d9cc9','#b4b8b3','#acd0b4','#d5bc9c','#ffd600','#e0605c','#ed7a3c','#b670a8','#0065ac'];
                    myDashService.getDevSnsrList(wdgtSeq)
                        .success(function(resp){
                            var devList = resp.data; //기저장한 디바이스,센서 정보
                            if ( resp.responseCode === '200' && devList ) {
                                if ( identity === 10 ) {
                                    //로그조회
                                    var toDt = moment().format('x');
                                    var fromDt = toDt - 2629743000; //최대 최근 1개월, 최대 120개 데이터(30초 1패킷 기준 1hr)
                                    var chartData = [];
                                    devList.forEach(function (v, i) {
                                        var param = '&limit=60&targetSequence=' + v.svcTgtSeq + '&deviceSequence=' + v.spotDevSeq + '&sensingTagCode=' + v.snsrCd + '&from=' + fromDt + '&to=' + toDt;
                                        myDashService.getDevLogs(param)
                                            .success(function (result) {
                                                var result = result.data;
                                                var chartTempData = [];
                                                if (result) {
                                                    for ( var j=result.length-1, k=0; j>=0; j--, k++ ) {
                                                        var data = result[j];
                                                        chartTempData[k] = {
                                                            'x': data.createdOn,
                                                            'y': parseFloat(data.response.sensingTags[0].value)
                                                        };
                                                        data = null;
                                                    }
                                                }
                                                chartData.push({
                                                    name:v.devNm + '|' + v.snsrNm,
                                                    id:v.svcTgtSeq+'|'+v.spotDevSeq,
                                                    tag:v.snsrCd,
                                                    seq:v.seq,
                                                    color:chartColor[i],
                                                    data:chartTempData
                                                });
                                                if ( chartData.length === devList.length ) {
                                                    chartData = $filter('orderBy')(chartData, 'seq', false);
                                                    chartData.forEach(function (c, l) {
                                                        chart.addSeries(chartData[l]);
                                                    });
                                                }
                                            });
                                    });

                                } else if ( identity === 20 ) {
                                    var chartTempData = [];
                                    var optmData = [];
                                    devList.forEach(function(v, i){
                                        var name = v.devNm+'<br/>'+v.snsrNm;
                                        chartTempData[i] = {'id':v.svcTgtSeq+'|'+v.spotDevSeq, 'tag':v.snsrCd,'name':name, 'y':numberUtil.nullToNumber(v.lastVal), 'color':chartColor[i]};
                                        optmData[i] = {'id':v.svcTgtSeq+'|'+v.spotDevSeq, 'tag':v.snsrCd, 'name':name, 'y':numberUtil.nullToNumber(v.optmVal)};
                                        name = null;
                                    });
                                    chart.addSeries({ name:'value', data:chartTempData});
                                    chart.addSeries({ type:'line', name:'optimum', color:'#000', lineWidth:1, marker:{fillColor:'#000',symbol:'diamond'}, data:optmData});
                                    chartTempData, optmData = null;
                                } else {
                                    var devInfo = devList[0];
                                    var id = devInfo.svcTgtSeq+'|'+devInfo.spotDevSeq;
                                    var name = devInfo.devNm+'|'+devInfo.snsrNm;
                                    var lastVal = numberUtil.nullToNumber(devInfo.lastVal);
                                    chart.update({title:{text:name}});
                                    chart.addSeries({id:id, tag:devInfo.snsrCd, name:name, data:[lastVal]});
                                    devInfo, name, lastVal = null;
                                }
                            }
                        });
                }

                //위젯 사이즈 변경에 따른 Chart 사이즈 리플로우
                scope.$watch(function() {
                    return element.offsetWidth;
                }, function(value) {
                    if ( value > 123 ) {
                        chart.reflow();
                    }
                });

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, arg){
                    if ( arg.wdgtSize ) return;
                    //차트 시각화 도구
                    var oldOptn = initChart();
                    if ( arg.wdgtOptn ) {
                        var newOptn = arg.wdgtOptn; //차트옵션 편집 모달에서 전달받은 속성값
                        //차트타입이 서로 다를 경우에만
                        if ( newOptn.optn[0].id !== oldOptn.chart.type ) {
                            var type = newOptn.optn[0].id === 'spiderWeb'?'column':newOptn.optn[0].id;
                            oldOptn.chart.type = type;
                        }
                        //dimension
                        // if ( newOptn.dimension === '3d' ) {
                        //     oldOptn.chart.options3d = {
                        //         enabled: true,
                        //         alpha: 15,
                        //         beta: 15,
                        //         depth: 50,
                        //         viewDistance: 25
                        //     };
                        // }
                        //plotband
                        if ( newOptn.plotBands ) {
                            oldOptn.yAxis.plotBands = newOptn.plotBands;
                        }
                        //최솟값,최댓값
                        if (newOptn.min !== '' && typeof newOptn.min != 'undefined' && newOptn.max !== '' && typeof newOptn.max != 'undefined') {
                            oldOptn.yAxis.min = newOptn.min;
                            oldOptn.yAxis.max = newOptn.max;
                        }

                        newOptn = null;
                    }
                    if (chart) {
                        chart.destroy();
                        getDevSnsrList(oldOptn);
                    }
                });

                //실시간 업데이트
                scope.$on('getLastVal', function (e, data) {
                    var pData = data.data,
                        pId = pData.svcTgtSeq+'|'+pData.spotDevSeq,
                        pAttributes = pData.attributes;
                    if ( element.identity === 10 ) {
                        var series = chart.series;
                        for ( var i=0, iCount=series.length; i<iCount; i++ ) {
                            var sData = series[i].userOptions;
                            if ( sData.id == pId && pAttributes && pAttributes[sData.tag] ) {
                                var x = Number(moment(pData.occDt).format("x")),
                                    y = pAttributes[sData.tag];
                                chart.series[i].addPoint([x, y], true, true);
                            }
                        }
                    } else if ( element.identity === 20 ) {
                        var chartData = chart.series[0].data;
                        for ( var i=0, count=chartData.length; i<count; i++ ) {
                            var cData = chartData[i];
                            if ( cData.id === pId && pAttributes && pAttributes[cData.tag] ) { //id가 같을 경우
                                cData.y = pAttributes[cData.tag];
                            }
                        }
                        chart.series[0].setData(chartData);
                    } else {
                        var sData = chart.series[0].userOptions;
                        if ( sData.id == pId && pAttributes && pAttributes[sData.tag] ) {
                            chart.series[0].setData([pAttributes[sData.tag]]);
                        }
                    }
                });

                //신규 Chart 생성
                getDevSnsrList(initChart());
            }
        };
    });

function sensorChartWdgtSetCtrl($translate, $rootScope, $scope, $modalInstance, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    var savedDevSnsr = wdgtInfo.devSnsrWdgtList; //기저장한 디바이스/센서 정보
    $scope.selectedList = []; //디바이스/센서 목록
    if ( savedDevSnsr ) {
        $scope.selectedList = savedDevSnsr; //디바이스명, 센서명을 찾아서 목록에 넣는다.
        savedDevSnsr = null;
    }

    //디바이스 목록 조회
    myDashService.getDeviceList()
        .success(function(resp){
            if ( resp.responseCode === '200' ) {
                $scope.devList = resp.data; //디바이스 목록
            }
        });

    /**
     * 디바이스 센서 조회
     * @param selectedDev 선택한 디바이스
     */
    $scope.getSnsrByDev = function(selectedDev) {
        myDashService.getDeviceModel(selectedDev.devModelSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.selectedSnsr = []; //센서목록 초기화
                    $scope.snsrList = resp.data.sensingTags;
                }
            });
    }

    /**
     * 추가한 센서 목록
     * @description 선택한 디바이스, 센서 목록 세팅
     */
    $scope.setSelectedList = function() {
        if ( !$scope.selectedSnsr.code ) return;

        //중복 데이터가 있는지 유효성 검증한다.
        $scope.invalidMessage = '';
        var dupFlag = false;
        for ( var i=0, count=$scope.selectedList.length; i<count; i++ ) {
            var item = $scope.selectedList[i];
            if ( item.svcTgtSeq == $scope.selectedDev.svcTgtSeq && item.spotDevSeq == $scope.selectedDev.spotDevSeq && item.snsrCd == $scope.selectedSnsr.code ) {
                dupFlag = true;
            }
        }
        if ( dupFlag ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgSnsrDupError'); //이미 추가한 센서입니다.
            return;
        }
        //게이지차트는 최대 1개의 센서만 저장가능하다.
        if ( JSON.parse(wdgtInfo.wdgtOptn).optn[0].id === 'gauge' ) {
            $scope.selectedList = [];
        }

        var addItem = { 'svcTgtSeq': $scope.selectedDev.svcTgtSeq
            , 'spotDevSeq': $scope.selectedDev.spotDevSeq
            , 'devNm': $scope.selectedDev.devNm
            , 'snsrCd': $scope.selectedSnsr.code
            , 'snsrNm': $scope.selectedSnsr.name };
        $scope.selectedList.push(addItem);
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

    /**
     * 모달 변경내역 저장
     */
    $scope.save = function() {
        //현재 추가된 목록이 없을 경우
        if ( $scope.selectedList.length === 0 ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }

        var wdgtSeq = wdgtInfo.wdgtSeq;
        var param = {'wdgtNm':$scope.wdgtNm
            , 'wdgtSubnm':$scope.wdgtSubnm
            , 'wdgtSeq':wdgtSeq
            , 'sensors':$scope.selectedList
            , 'mbrId':sessionStorage.getItem('dash_mbr_id')};
        myDashService.insertDevSnsrWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }
}
