angular.module('app.mydash')
    .controller('COMM_LOG_DATE_Ctrl', commLogDateCtrl);

function commLogDateCtrl($translate, $modalInstance, $scope, wdgtInfo, myDashService, $filter, $rootScope) {

    var wdgtSeq = $scope.$parent.widget.wdgtSeq;
    $scope.warningMsg = false;
    $scope.logInfo = {
        'retvStDt':wdgtInfo.retvStDt || moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm'), //1시간 전
        'retvFnsDt':wdgtInfo.retvFnsDt || moment().format('YYYY-MM-DD HH:mm'),
        'wdgtSeq':wdgtSeq,
        'svcTgtSeq':wdgtInfo.svcTgtSeq,
        'spotDevSeq':wdgtInfo.spotDevSeq,
        'snsrCd':wdgtInfo.snsrCd
    };

    /**
     * 저장
     */
    $scope.save = function() {
        var stDt = moment($scope.logInfo.retvStDt).format('x');
        var endDt = moment($scope.logInfo.retvFnsDt).format('x');
        var param = '&limit=9999&targetSequence='+wdgtInfo.svcTgtSeq+'&deviceSequence='+wdgtInfo.spotDevSeq+'&sensingTagCode='+wdgtInfo.snsrCd+'&from='+stDt+'&to='+endDt;
        myDashService.getDevLogs(param)
            .success(function (result) {
                var logCount = result.data.length;
                if ( logCount > 4000 && !$scope.warningMsg) {
                    //데이터가 일정량을 초과하는 경우 Highchart Boost Module을 사용해야 한다.
                    //크롬에서 Boost Module을 사용하려면 GPU 가속기를 활성화시켜야 합니다.
                    $translate('wdgt.eMsgRetvLogWarn01',{value:logCount})
                        .then(function(words) {
                            $scope.invalidMessage = words;
                        });
                    $scope.warningMsg = true;
                    logCount = null;
                    return;
                } else {
                    //parameter
                    logCount = null;
                    var param = {'wdgtSeq':wdgtSeq
                                ,'mbrId':sessionStorage.getItem('dash_mbr_id')
                                ,'devSnsrList':[$scope.logInfo]};
                    //디바이스,센서 위젯 수정
                    myDashService.updateDevSnsrWdgtBySbjt(param)
                        .success(function(resp){
                            if ( resp.responseCode === '200' ) {
                                $rootScope.$broadcast(wdgtSeq+'.changeSettings',{param:$scope.logInfo});
                                $modalInstance.close();
                                wdgtSeq = null;
                            }
                        })
                        .error(function(resp) {
                            console.log("API Service Error : " + resp.status + " " + resp.error);
                        });
                }
            });
    }

    //모달닫기
    $scope.close = function() {
        $modalInstance.close();
    };

    /**
     * 조회일시 감지
     */
    $scope.$watch('logInfo.retvStDt', function (newValue, oldValue) {
        if(newValue === oldValue){ return; }
        $scope.logInfo.retvStDt =newValue;
    });
    $scope.$watch('logInfo.retvFnsDt', function (newValue, oldValue) {
        if(newValue === oldValue){ return; }
        $scope.logInfo.retvFnsDt =newValue;
    });
    $(document).on("dp.change", function(e){
        if(e.target.id === 'datetimepicker1'){
            $scope.logInfo.retvStDt = $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm');
        } else if(e.target.id === 'datetimepicker2'){
            $scope.logInfo.retvFnsDt = $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm');
        }
    });

}