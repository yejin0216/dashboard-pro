angular.module('app.mydash')
    .controller('DEVICE_IMAGE_WIDGET_Ctrl', deviceImageWdgtCtrl)
    .controller('DEVICE_IMAGE_WIDGET_SET_Ctrl', deviceImageWdgtSetCtrl);

function deviceImageWdgtCtrl($scope, myDashService, $interval) {

    var flux;

    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtInfo = widget;
        getDevInfo(widget); //저장된 디바이스 정보 조회

        //변경된 위젯설정 배포
        $scope.$on(widget.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.refresh ) {
                getDevInfo(widget);
            }
        });
    };

    $scope.$on('$destroy', function() {
        if (angular.isDefined(flux)) {
            $interval.cancel(flux);
            flux = undefined;
        }
    });

    //데이터 표출 영역 block/none 여부 결정
    $scope.showThisDiv = function(flag) {
        if ( $scope.wdgtInfo.wdgtDataset.indexOf(flag) != -1 ) {
            return true;
        }
        return false;
    }

    //저장된 디바이스 정보 조회
    function getDevInfo(widget) {
        myDashService.getDevWdgtBySbjt(widget)
            .success(function(data){
                if ( data.responseCode === '200' && data.data ) {
                    var savedDevInfo = data.data[0];
                    myDashService.getDeviceSttusInfo(savedDevInfo.spotDevSeq)
                        .success(function(resp){
                            if ( resp.responseCode === '200' ) {
                                $scope.devInfo = resp.data[0];
                                if ( widget.wdgtDataset.indexOf('icon') > -1 ) {
                                    $scope.iconOtPut = true; //아이콘 출력여부
                                    if ( $scope.devInfo.imageUrl ) {
                                        myDashService.getDeviceImg($scope.devInfo.imageUrl)
                                            .success(function (response) {
                                                if (response.responseCode == 'OK') {
                                                    $scope.devInfo.icon = response.data;
                                                }
                                            });
                                    }
                                }
                            }
                        });
                }
            });
    }

}
function deviceImageWdgtSetCtrl($translate, $scope, $modalInstance, $rootScope, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    var savedDev = wdgtInfo.devWdgtList; //기저장한 디바이스 정보
    $scope.selectedDev = {spotDevSeq:0};

    //디바이스 목록 조회
    myDashService.getDeviceList()
        .success(function(resp){
            if ( resp.responseCode === '200' ) {
                $scope.devList = resp.data;
                setCheckBox();
            }
        });

    //checkbox 세팅
    function setCheckBox() {
        if ( savedDev.length === 1 ) {
            $scope.selectedDev.spotDevSeq = savedDev[0].spotDevSeq;
        }
    }

    //모달 닫기
    $scope.close = function() {
        $modalInstance.close();
    }

    //모달 변경내역 저장
    $scope.save = function() {
        //validation check
        $scope.invalidMessage = '';
        var selectedDev = $scope.selectedDev.spotDevSeq;

        if ( !selectedDev || selectedDev === 0 ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }

        var param = {'wdgtNm':$scope.wdgtNm
            , 'wdgtSubnm':$scope.wdgtSubnm
            , 'wdgtSeq':wdgtInfo.wdgtSeq
            , 'spotDevSeqs':[{'svcTgtSeq':sessionStorage.getItem('svc_tgt_seq'),'spotDevSeq':selectedDev}]
            , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertDevWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

}