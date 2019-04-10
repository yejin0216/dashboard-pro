angular.module('app.mydash')
    .controller('SENSOR_TABLE_WIDGET_Ctrl', sensorTableWdgtCtrl)
    .controller('SENSOR_TABLE_WIDGET_SET_Ctrl', sensorTableWdgtSetCtrl)
    .filter('snsrTypeNm', function($translate) {
        return function (input) {
            if (input === '0000010' || '1000') {
                return $translate.instant('comm.colec');
            } else if (input === '0000020' || '3000') {
                return $translate.instant('comm.cntrl');
            }
        };
    })
    .filter('ctrlStr', function() {
        return function (input) {
            if ( typeof input === 'string' ) {
                return input.replace(/"/g,"");
            }
            return input;
        };
    });

function sensorTableWdgtCtrl($scope, $rootScope, $modal, $translate, myDashService) {

    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtInfo = widget;
        $scope.gridCol = JSON.parse(widget.wdgtDataset).ds; //데이터셋
        $scope.gridOptn = widget.wdgtOptn; //옵션

        getDevSnsrList(widget.wdgtSeq);//디바이스/센서 목록 조회

        //변경된 위젯설정 배포
        $scope.$on($scope.wdgtInfo.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.refresh ) {
                getDevSnsrList($scope.wdgtInfo.wdgtSeq);
            }
        });
    };

    function getDevSnsrList(wdgtSeq) {
        $scope.noData = '';
        myDashService.getDevSnsrList(wdgtSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' && resp.data ) {
                    $scope.devList = resp.data;
                } else {
                    $scope.noData = $translate.instant('comm.eMsgNoData');
                }
            });
    }

    //table col css
    $scope.colWidth = function(grid) {
        if ( grid.id === 'seq' || grid.id === 'snsrType' ) {
            return 'col-w40p';
        } else if ( grid.id === 'icon' ) {
            return 'col-w50p';
        }
        return '';
    }

    //table td css
    $scope.tdPadding = function(grid) {
        if ( grid.id === 'icon' ) {
            return 'col-w50p pointer';
        }
        return '';
    }

    //센서 아이콘 변경
    $scope.updateIcon = function(list) {
        //아이콘 업데이트 모달 호출
        list.wdgtSeq = $scope.wdgtInfo.wdgtSeq; //위젯일련번호 세팅

        $modal.open({
            templateUrl:'app/components/dashboard/widget/SENSOR_ICON_VIEW_MODAL.html',
            scope:$scope,
            resolve:{
                wdgtInfo: function() {
                    return list;
                }
            },
            controller:'SENSOR_ICON_VIEW_MODAL_Ctrl'
        });
    }

    //제어센서 상태 변경
    $scope.$on('sendCapabilityCtr', function (event, args) {
        var ctrlDev = args.ctrlDev;
        for (var i=0, iCount=$scope.devList.length; i<iCount; i++) {
            var dev = $scope.devList[i];
            if ( ctrlDev.svcTgtSeq == dev.svcTgtSeq && ctrlDev.spotDevSeq == dev.spotDevSeq && ctrlDev.snsrCd == dev.snsrCd ) {
                $scope.devList[i].lastVal = args.ctrlMsg;
                $scope.devList[i].amdDtt = ctrlDev.amdDtt;
            }
        }
    });

    // 실시간 업데이트
    $scope.$on('getLastVal', function (e, data) {
        if ( !$scope.devList ) return; //저장된 정보가 없을 경우 푸시 받지 않는다.

        var pData = data.data,
            pSvcTgtSeq = pData.svcTgtSeq, //서비스 대상 일련번호
            pSpotDevSeq = pData.spotDevSeq, //디바이스 일련번호
            pAttributes = pData.attributes, //센서,최종값정보
            pGroupTagCd = pData.groupTagCd; //그룹태그
        for ( var i=0, count=$scope.devList.length; i<count; i++ ) {
            var devItem = $scope.devList[i];
            //서비스대상일련번호, 디바이스일련번호, 그룹태그가 동일할 경우
            //개방형은 푸시 데이터셋이 다르므로 그룹태그가 어떻게 들어오는지 체크하고 수정이 필요하다.
            if ( devItem.svcTgtSeq == pSvcTgtSeq && devItem.spotDevSeq == pSpotDevSeq && devItem.group == pGroupTagCd ) {
                if ( pAttributes && pAttributes[devItem.snsrCd] ) {
                    $scope.devList[i].lastVal = pAttributes[devItem.snsrCd];
                    $scope.devList[i].amdDtt = moment(pData.occDt).format("YYYY-MM-DD HH:mm:ss");
                }
            }
            devItem = null;
        }

        $scope.$apply();
    });
}

function sensorTableWdgtSetCtrl($translate, $rootScope, $scope, $modalInstance, myDashService, wdgtInfo) {

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

        //중복 데이터가 있는지 유효성 검증한다.
        $scope.invalidMessage = '';
        var dupFlag = false;
        for ( var i=0, count=$scope.selectedList.length; i<count; i++ ) {
            var item = $scope.selectedList[i];
            if ( item.svcTgtSeq == $scope.selectedDev.svcTgtSeq && item.spotDevSeq == $scope.selectedDev.spotDevSeq &&
                 item.group == $scope.selectedSnsrGroup.code && item.snsrCd == $scope.selectedSnsr.code ) {
                dupFlag = true;
            }
        }
        if ( dupFlag ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgSnsrDupError');
            return;
        }

        var addItem = { 'svcTgtSeq': $scope.selectedDev.svcTgtSeq
                      , 'spotDevSeq': $scope.selectedDev.spotDevSeq
                      , 'devNm': $scope.selectedDev.devNm
                      , 'group' : $scope.selectedSnsrGroup.code
                      , 'groupNm' : $scope.selectedSnsrGroup.name
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

        var param = {'wdgtNm':$scope.wdgtNm
                   , 'wdgtSubnm':$scope.wdgtSubnm
                   , 'wdgtSeq':wdgtInfo.wdgtSeq
                   , 'sensors':$scope.selectedList
                   , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertDevSnsrWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }
}


