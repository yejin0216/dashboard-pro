angular.module('app.mydash')
    .controller('DEVICE_TABLE_WIDGET_Ctrl', deviceTableWdgtCtrl)
    .controller('DEVICE_TABLE_WIDGET_SET_Ctrl', deviceTableWdgtSetCtrl);

function deviceTableWdgtCtrl($translate, myDashService, $scope) {

    var allDevList = [];
    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtInfo = widget;
        $scope.gridCol = JSON.parse(widget.wdgtDataset).ds; //데이터셋

        //나의 디바이스 목록 조회
        myDashService.getDeviceList()
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    allDevList = resp.data;
                    myDashService.getDevWdgtBySbjt($scope.wdgtInfo)
                        .success(function(data){
                            if ( data.responseCode === '200' ) {
                                getSavedDevList(allDevList, data.data);
                            }
                        });
                }
            });

        //변경된 위젯설정 배포
        $scope.$on($scope.wdgtInfo.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.param ) {
                getSavedDevList(allDevList, arg.param.spotDevSeqs);
            }
        });
    };

    //실시간 업데이트
    // $scope.$on('getLastVal', function (e, data) {
    //     $scope.devList = data.data[$scope.wdgtInfo.wdgtSeq].devList;
    // });

    //저장된 디바이스 목록 조회
    function getSavedDevList(allDevList, compare) {
        if ( compare ) {
            $scope.noData = '';
            //전체 디바이스 목록 중 기 저장된 디바이스를 찾는다.
            $scope.devList = [];
            for ( var i=0, iCount=compare.length; i<iCount; i++ ) {
                for ( var j=0, jCount=allDevList.length; j<jCount; j++ ) {
                    if ( compare[i].svcTgtSeq == allDevList[j].svcTgtSeq && compare[i].spotDevSeq == allDevList[j].spotDevSeq ) {
                        $scope.devList.push(allDevList[j]);
                    }
                }
            }
        } else {
            $scope.noData = $translate.instant('comm.eMsgNoData');
        }
    }

    //table col css
    $scope.colWidth = function(grid) {
        if ( grid.id === 'seq' || grid.id === 'sttus' ) {
            return 'col-w40p';
        }
        return '';
    }

    //table td
    $scope.showThisTd = function(flag) {
        if ( $scope.wdgtInfo.wdgtDataset.indexOf(flag) != -1 ) {
            return true;
        }
        return false;
    }
}

function deviceTableWdgtSetCtrl($translate, $scope, $modalInstance, $rootScope, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    $scope.selectedDev = []; //디바이스 목록
    var savedDev = wdgtInfo.devWdgtList; //기저장한 디바이스 정보

    //디바이스 목록 조회
    myDashService.getDeviceList()
        .success(function(resp){
            if ( resp.responseCode === '200' ) {
                setCheckBox(resp.data);
            }
        });

    //checkbox 세팅
    function setCheckBox(resultSet) {
        $scope.devList = resultSet; //디바이스 목록
        if ( savedDev ) {
            savedDev.forEach(function (dev, i) {
                $scope.selectedDev[dev.spotDevSeq] = 'Y';
            });
        }
    }

    //모달 닫기
    $scope.close = function() {
        $modalInstance.close();
    }

   //모달 변경내역 저장
    $scope.save = function() {
        var devs = Object.keys($scope.selectedDev);
        var devList = [];
        devs.forEach(function(v, i){
            if ( $scope.selectedDev[v] == 'Y' ) {
                devList.push({'svcTgtSeq':sessionStorage.getItem('svc_tgt_seq'), 'spotDevSeq':v});
            }
        });

        //validation check
        $scope.invalidMessage = '';
        if ( !devList[0] ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }

        //변경내역 저장
        var param = {'wdgtNm':$scope.wdgtNm
                   , 'wdgtSubnm':$scope.wdgtSubnm
                   , 'wdgtSeq':wdgtInfo.wdgtSeq
                   , 'spotDevSeqs':devList
                   , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertDevWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {param:param});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

}


