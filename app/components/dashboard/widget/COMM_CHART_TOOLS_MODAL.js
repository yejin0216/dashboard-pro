angular.module('app.mydash')
    .controller('COMM_CHART_TOOLS_Ctrl', commChartToolsCtrl)
    .directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value, 10);
                });
            }
        };
    });

function commChartToolsCtrl($translate, $modalInstance, $scope, $rootScope, wdgtInfo, myDashService, stringUtil, numberUtil) {

    var wdgtOptn = JSON.parse(wdgtInfo.wdgtOptn);
    $scope.uiCode = '10';
    $scope.savedAttr = stringUtil.nullToString(wdgtOptn.dimension)+wdgtOptn.optn[0].id;//기저장된 차트타입

    //최초 조회
    function init() {
        var imgPath = 'assets/image/';
        var chartType = wdgtOptn.optn[0].id;//차트 타입

        //막대형
        if ( chartType === 'bar' || chartType === 'column' ) {
            var msgBar = $translate.instant('wdgt.bar');
            var msgColumn = $translate.instant('wdgt.column');
            $scope.allEffectList = [{'name':msgBar,'attr':'bar','optn':{"optn":[{"id":"bar"}]},'src':imgPath+'svg/bar.svg'}
                ,{'name':msgColumn,'attr':'column','optn':{"optn":[{"id":"column"}]},'src':imgPath+'svg/column.svg'}
                /*,{'name':'3D '+msgBar,'attr':'3dbar','optn':{"optn":[{"id":"bar"}],"dimension":"3d"},'src':imgPath+'svg/3d_bar.svg'}
                ,{'name':'3D '+msgColumn,'attr':'3dcolumn','optn':{"optn":[{"id":"column"}],"dimension":"3d"},'src':imgPath+'svg/3d_column.svg'}*/];
            //목록 조회
            $scope.snsrList = wdgtInfo.devSnsrWdgtList;
        }
        //방사형
        else if ( chartType === 'spiderWeb' ) {
            $scope.allEffectList = [{'name':$translate.instant('wdgt.spiderWeb'),'attr':'spiderWeb','optn':{"optn":[{"id":"spiderWeb"}]},'src':imgPath+'spiderWeb.png'}];
            //목록 조회
            $scope.snsrList = wdgtInfo.devSnsrWdgtList;
        }
        //꺽은선형
        else if ( chartType === 'line' || chartType === 'area' ) {
            $scope.allEffectList = [{'name':$translate.instant('wdgt.line'),'attr':'line','optn':{"optn":[{"id":"line"}]},'src':imgPath+'svg/line.svg'}
                ,{'name':$translate.instant('wdgt.area'),'attr':'area','optn':{"optn":[{"id":"area"}]},'src':imgPath+'svg/area.svg'}];
            $scope.plotBands = wdgtOptn.plotBands;
            if ( !$scope.plotBands ) { //plotband 정보가 없는 경우
                $scope.plotBands = [{'color':'#fff9ae','from':'','to':''}];
            }
            $scope.uiCode = '20';
        }
        //분산형
        else if ( chartType === 'scatter' ) {
            $scope.allEffectList = [{'name':$translate.instant('wdgt.scatter'),'attr':'scatter','optn':{"optn":[{"id":"scatter"}]},'src':imgPath+'scatter.png'}];
            $scope.plotBands = wdgtOptn.plotBands;
            if ( !$scope.plotBands ) { //plotband 정보가 없는 경우
                $scope.plotBands = [{'color':'#fff9ae','from':'','to':''}];
            }
            $scope.uiCode = '20';
        }
        //게이지형
        else if ( chartType === 'gauge' ) {
            $scope.allEffectList = [{'name':$translate.instant('wdgt.gauge'),'attr':'gauge','optn':{"optn":[{"id":"gauge"}]},'src':imgPath+'gauge1.png'}];
            $scope.plotBands = wdgtOptn.plotBands;
            if ( !$scope.plotBands ) { //plotband 정보가 없는 경우
                $scope.plotBands = [{'type':'normal','color':'#55BF3B','from':'','to':''}
                    ,{'type':'warning','color':'#DDDF0D','from':'','to':''}
                    ,{'type':'danger','color':'#DF5353','from':'','to':''}];
            }
            var min = wdgtOptn.min || 0;
            var max = wdgtOptn.max || 200;
            $scope.valueBand = [{'min':min, 'max':max}];
            $scope.uiCode = '30';
        }
    }

    //선택한 시각화 효과
    var selectedItem = {'optn':wdgtOptn};
    $scope.selectedEffect = function(item) {
        $scope.savedAttr = item.attr;
        selectedItem = item;
    }

    //저장 후 닫기
    $scope.save = function() {
        //유효성 검증
        $scope.invalidMessage = '';
        if ( $scope.uiCode === '30' ) {
            //min,max 유효성 검증
            var min = numberUtil.nullToString($scope.valueBand[0]['min']);
            var max = numberUtil.nullToString($scope.valueBand[0]['max']);
            if ( min === '' || max === '') {
                $scope.invalidMessage = $translate.instant('wdgt.eMsgInvalidRange2'); //기준구간 값을 입력하세요.
                return;
            }
            //유효성 검증을 통과하면 min,max 값을 추가한다.
            selectedItem.optn['min'] = min;
            selectedItem.optn['max'] = max;
        }
        if ( $scope.plotBands ) {
            //plotband 유효성 검증
            //1.시작값이 종료값보다 작아야 한다.
            var invalidRange = false;
            var invalidInput = false;
            for ( var i=0,iCount=$scope.plotBands.length; i<iCount; i++ ) {
                $scope.plotBands[i].from = numberUtil.nullToNumber($scope.plotBands[i].from);
                $scope.plotBands[i].to = numberUtil.nullToNumber($scope.plotBands[i].to);
                var band = $scope.plotBands[i];

                if ( band.from !='' && band.to !='' & (band.from > band.to) ) {
                    invalidRange = true;
                    break;
                }
                if ( (typeof band.from == 'string' && band.from=='' && band.to!='') || (typeof band.to == 'string' && band.from!='' && band.to=='') ) {
                    invalidInput = true;
                    break;
                }
            }
            if ( invalidRange ) {
                $scope.invalidMessage = $translate.instant('wdgt.eMsgInvalidRange1'); //From 입력값은 To 입력값보다 작아야 합니다.
                return;
            }
            if ( invalidInput ) {
                $scope.invalidMessage = $translate.instant('wdgt.eMsgInvalidInput1'); //From 입력값 또는 To 입력값을 입력하세요.
                return;
            }
            //유효성 검증을 통과하면 Plotband를 옵션에 추가한다.
            selectedItem.optn['plotBands'] = $scope.plotBands;
        }

        //parameter
        var param = {'wdgtSeq':wdgtInfo.wdgtSeq
                    ,'mbrId':sessionStorage.getItem('dash_mbr_id')
                    ,'modalId':'chartOption'
                    ,'wdgtOptn':JSON.stringify(selectedItem.optn)
                    ,'devSnsrList':$scope.snsrList};
        //디바이스,센서 위젯 수정
        myDashService.updateDevSnsrWdgtBySbjt(param)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings',{wdgtOptn:selectedItem.optn});
                    $modalInstance.close();
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    //모달 닫기
    $scope.close = function() {
        $modalInstance.close();
    }

    init(); //최초조회
}