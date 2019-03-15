angular.module('app.mydash')
    .controller('COMPLEX_MAP_WIDGET_SET_Ctrl', complexMapWdgtSetCtrl)
    .directive('complexWdgtMaparea', function ($compile, $timeout, $modal, myDashService, $translate) {
        return {
            template: '',
            replace: true,
            scope:{
                widget : "="
            },
            controller: function($scope, $element, $attrs, $translate){
            },
            link: function (scope, element) {
                var wdgtSeq = scope.widget.wdgtSeq;

                //지도 생성
                drawMap();
                function drawMap() {
                    var maptemplate  = '<div class="mapDevList hidden-mobile">';
                    maptemplate += '<ul><li ng-repeat="dev in savedDevList" ng-class="{selected:selectedDev==dev.spotDevSeq}" ng-click="moveFocus(dev)"><p class="ellipsis">';
                    maptemplate += '<i ng-if="dev.sttus" class="fas fa-circle color-red1"></i>';
                    maptemplate += '<i ng-if="!dev.sttus" class="fas fa-ban color-gray2"></i><b> {{dev.devNm}}</b></p>';
                    maptemplate += '<p class="devDtl"><i class="glyphicon glyphicon-map-marker"></i> {{roadAddr[$index]||\'No Data\'}}<br/>';
                    maptemplate += '<i class="glyphicon glyphicon-time"></i> {{dev.modifiedOn||\'No Data\'}}<button class="btn btn-small custom" ng-click="popLoHstDtl(dev)">{{"comm.dtlView" | translate}}</button></p></li></ul>';
                    maptemplate += '<div ng-if="savedDevList.length===0" class="noData transparent">{{"comm.eMsgNoData" | translate}}</div>';
                    maptemplate += '</div><div class="mapDevCount hidden-mobile">Total {{savedDevList.length}}</div>';
                    maptemplate += '<div class="mapArea" id="map_div'+wdgtSeq+'"/>';
                    element.append(maptemplate);
                    element.html($compile(maptemplate)(scope));
                }

                $timeout(function() {
                    map = new olleh.maps.Map(document.getElementById("map_div"+wdgtSeq), {zoom:9, center:new olleh.maps.UTMK(958393.017494383, 1941487.7083653274)});
                    infoWindow = new olleh.maps.overlay.InfoWindow({});
                    // clusterer = new olleh.maps.overlay.MarkerClusterer();
                    getSavedDevInfo();
                    //makeDevMap(); //Map 생성
                }, 500);

                //Map
                var map, infoWindow, clusterer;

                //Marker를 생성할 디바이스 목록 조회
                function getSavedDevInfo() {
                    scope.savedDevList = [];
                    scope.roadAddr = [];
                    var param = {'viewType':'dev','sbjtSeq':scope.widget.sbjtSeq,'wdgtSeq':scope.widget.wdgtSeq};
                    myDashService.getComplexMapWdgtBySbjt(param)
                        .success(function(data){
                            if ( data.responseCode === '200' && data.data ) {
                                scope.savedDevList = data.data;
                                var toDt = moment().format('x');
                                var fromDt = toDt - 86400000; //최근 1일
                                // 최종 좌표 조회
                                for ( var i=0, iCount=scope.savedDevList.length; i<iCount; i++ ) {
                                    getLastDevLo(scope.savedDevList[i], toDt, fromDt, i); //이동체의 최종위치를 조회한다.
                                }
                            }
                        });
                }

                //이동체의 최종위치 조회
                function getLastDevLo(devInfo, toDt, fromDt, index) {
                    var latitSnsrCd = devInfo.latitSnsrCd; //위도센서코드
                    var lngitSnsrCd = devInfo.lngitSnsrCd; //경도센서코드
                    var param = '&targetSequence='+devInfo.svcTgtSeq+'&deviceSequence='+devInfo.spotDevSeq+'&from='+fromDt+'&to='+toDt+'&offset=1&limit=1&logCondition=%5b-90%3c%3d'+latitSnsrCd+'%3c0%2c0%3c'+latitSnsrCd+'%3c%3d90%2c-180%3c%3d'+devInfo.lngitSnsrCd+'%3c0%2c0%3c'+lngitSnsrCd+'%3c%3d180%5d';
                    myDashService.getDevLogs(param)
                        .success(function (resp) {
                            if ( resp.responseCode === '200' && resp.data ) {
                                var log = resp.data[0]; //로그
                                var logDtl = log.response.sensingTags;//로그의 센서정보
                                devInfo.modifiedOn = moment(log.createOn).local().format('YYYY-MM-DD HH:mm:ss'); //로그 발생시간
                                for ( var j=0, jCount=logDtl.length; j<jCount; j++ ) {
                                    var item = logDtl[j];
                                    if ( item.code === latitSnsrCd ) { //위도값 매핑
                                        devInfo.latitSnsrVal = item.value;
                                    } else if ( item.code === lngitSnsrCd ) { //경도값 매핑
                                        devInfo.lngitSnsrVal = item.value;
                                    }
                                }
                                //console.log(map)
                                if ( map ) {
                                    makeDevMap(devInfo, index, latitSnsrCd, lngitSnsrCd); //Marker 생성
                                }
                                scope.savedDevList[index] = devInfo;
                            }
                        });
                }

                //Map 생성
                var markers = [];
                function makeDevMap(devInfo, index, latitSnsrCd, lngitSnsrCd) {
                    var mKey = devInfo.svcTgtSeq+'|'+devInfo.spotDevSeq;
                    var lat = devInfo.latitSnsrVal;
                    var lng = devInfo.lngitSnsrVal;
                    var latLng = new olleh.maps.LatLng(lat, lng);//UTMK가 더 정확하기 때문에 변환함.
                    markers[mKey] = new olleh.maps.overlay.Marker({
                        position:new olleh.maps.UTMK.valueOf(latLng),
                        map:map
                    });
                    scope.savedDevList[index].marker = markers[mKey];
                    // clusterer.add(markers[mKey]);

                    //marker identification
                    markers[mKey].latitSnsrCd = latitSnsrCd;
                    markers[mKey].lngitSnsrCd = lngitSnsrCd;

                    //info window
                    markers[mKey].info = devInfo.devNm +'<br/>'+ $translate.instant('wdgt.latit')+': ' + lat+' | '+$translate.instant('wdgt.lngit')+': '+lng;
                    markers[mKey].onEvent('mouseover', function () {
                        infoWindow.close();
                        infoWindow.setContent(this.info);
                        infoWindow.open(this.getMap(), this);
                    }, markers[mKey]);

                    //geocode 검색
                    var param = 'point.lat='+lat +'&point.lng='+lng;
                    myDashService.getRoadAddress(param)
                        .success(function(data){
                            scope.roadAddr[index] = data.residentialAddress[0].parcelAddress[0].fullAddress;
                            //scope.savedDevList[index].roadAddr = data.residentialAddress[0].parcelAddress[0].fullAddress;
                        });


                    if ( index === 0 ) { //첫번째 마커로 포커스 이동
                        scope.moveFocus(scope.savedDevList[index]);
                    }
                    //if ( index === (scope.savedDevList.length-1) ) { //모든 마커 정보를 생성한 후, 클러스터 생성
                    //     clusterer.setMap(map);
                    //}
                }

                //디바이스를 클릭하면 해당 디바이스 위치로 포커스를 이동한다.
                scope.moveFocus = function(dev) {
                    scope.selectedDev = dev.spotDevSeq; //선택한 디바이스
                    //선택한 위치로 이동
                    var latLng = new olleh.maps.LatLng(dev.latitSnsrVal, dev.lngitSnsrVal);
                    map.setCenter(latLng);
                    //infoWindow를 열기 위한 Click Event 호출
                    // var customEvent = new olleh.maps.event.Event('click', dev.marker);
                    // dev.marker.fireEvent(customEvent, {x:1, y:1});
                }

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, arg){
                    if (arg.wdgtSize) {//위젯 사이즈
                        map.resize();
                    } else if (arg.refresh) {//위젯 설정 변경
                        // clusterer.clear();
                        var mKey = Object.keys(markers);
                        for ( var i=0, iCount=mKey.length; i<iCount; i++ ) {
                            markers[mKey[i]].setMap(null);
                        }
                        getSavedDevInfo();
                    }
                });

                //실시간 업데이트
                scope.$on('getLastVal', function (e, data) {
                    var pData = data.data,
                        pSvcTgtSeq = pData.svcTgtSeq,
                        pSpotDevSeq = pData.spotDevSeq,
                        pAttributes = pData.attributes,
                        marker = markers[pSvcTgtSeq+'|'+pSpotDevSeq];

                    if ( marker && pAttributes && pAttributes[marker.latitSnsrCd] && pAttributes[marker.lngitSnsrCd] ) {
                        var latitSnsrVal = pAttributes[marker.latitSnsrCd],
                            lngitSnsrVal = pAttributes[marker.lngitSnsrCd],
                            position = new olleh.maps.LatLng(latitSnsrVal, lngitSnsrVal);
                        markers[pSvcTgtSeq+'|'+pSpotDevSeq].setPosition(position);
                        markers[pSvcTgtSeq+'|'+pSpotDevSeq].lo = $translate.instant('wdgt.latit')+':'+latitSnsrVal+' | '+$translate.instant('wdgt.lngit')+': '+lngitSnsrVal;
                        latitSnsrVal, lngitSnsrVal, position;
                    }
                    scope.$apply();
                });

                //위치이력팝업 띄우기
                scope.popLoHstDtl = function(dev) {
                    dev.marker = null;
                    dev.sbjtSeq = scope.widget.sbjtSeq;
                    dev.wdgtSeq = wdgtSeq; //이후삭제필요
                    $modal.open({
                        templateUrl: 'components/dashboard/widget/COMM_DEV_LO_HST_MODAL.html',
                        scope: scope,
                        resolve: {
                            devInfo: function () {
                                return dev;
                            }
                        },
                        controller: 'COMM_DEV_LO_HST_Ctrl'
                    });
                };

            }
        }
    });

function complexMapWdgtSetCtrl($translate, $scope, $modalInstance, $rootScope, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    var savedDevSnsr = wdgtInfo.mapWdgtList; //기저장한 디바이스/센서 정보
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
    $scope.getSnsrByDev = function(selectedDev, flag) {
        if ( flag === 'latit' ) { //위도
            $scope.latitSnsr = []; //센서목록 초기화
            myDashService.getDeviceModel(selectedDev.devModelSeq)
                .success(function(resp){
                    if ( resp.responseCode === '200' ) {
                        $scope.latitSnsr = resp.data.sensingTags;
                    }
                });
        } else if ( flag === 'lngit' ) { //경도
            $scope.lngitSnsr = []; //센서목록 초기화
            $scope.lngitSnsr = $scope.latitSnsr.filter(function(snsr){
                return snsr.sequence != $scope.selectedLatitSnsr.sequence;
            });
        }
    }

    /**
     * 추가한 센서 목록
     * @description 선택한 디바이스, 센서 목록 세팅
     */
    $scope.setSelectedList = function() {
        if ( !$scope.selectedLatitSnsr.code ) return;
        if ( !$scope.selectedLngitSnsr.code ) return;

        var dupFlag = false;
        for ( var i=0, count=$scope.selectedList.length; i<count; i++ ) {
            var item = $scope.selectedList[i];
            if ( item.svcTgtSeq == $scope.selectedDev.svcTgtSeq && item.spotDevSeq == $scope.selectedDev.spotDevSeq ) {
                dupFlag = true;
            }
        }
        if ( dupFlag ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgTrackerDupError');
            return;
        }
        var addItem = { 'svcTgtSeq': $scope.selectedDev.svcTgtSeq
                       ,'spotDevSeq': $scope.selectedDev.spotDevSeq
                       ,'devNm': $scope.selectedDev.devNm
                       ,'latitSnsrCd': $scope.selectedLatitSnsr.code
                       ,'latitSnsrNm': $scope.selectedLatitSnsr.name
                       ,'lngitSnsrCd': $scope.selectedLngitSnsr.code
                       ,'lngitSnsrNm': $scope.selectedLngitSnsr.name };
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
                   , 'sensors':$scope.selectedList};
        myDashService.insertComplexMapWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

}


