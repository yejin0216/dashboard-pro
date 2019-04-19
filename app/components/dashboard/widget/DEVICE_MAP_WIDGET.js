angular.module('app.mydash')
    .controller('DEVICE_MAP_WIDGET_SET_Ctrl', deviceMapWdgtSetCtrl)
    .directive('deviceWdgtMaparea', function ($compile, $timeout, myDashService, $translate) {
        return {
            template: '',
            replace: true,
            scope:{
                widget : "="
            },
            controller: function($scope, $element, $attrs, $translate){
            },
            link: function (scope, element, rootScope) {
                var wdgtSeq = scope.widget.wdgtSeq;
                var map, infoWindow, clusterer; //Map 생성

                drawMap(); //지도 생성
                function drawMap() {
                    var maptemplate  = '<div class="mapDevList hidden-mobile">';
                    maptemplate += '<ul><li ng-repeat="dev in savedDevList track by $index" ng-class="{selected:selectedDev==dev.spotDevSeq}" ng-click="moveFocus(dev, roadAddr[$index])"><p class="ellipsis">';
                    maptemplate += '<i ng-if="dev.sttus" class="fas fa-circle color-red1"></i>';
                    maptemplate += '<i ng-if="!dev.sttus" class="fas fa-ban color-gray2"></i><b> {{dev.devNm}}</b></p>';
                    maptemplate += '<p class="devDtl"><i class="glyphicon glyphicon-map-marker"></i> {{roadAddr[$index].addr || \'No Data\'}}<br/>';
                    maptemplate += '<i class="glyphicon glyphicon-time"></i> {{dev.amdDtt || \'No Data\'}}</li></ul>';
                    maptemplate += '<div ng-if="savedDevList.length===0" class="noData transparent">{{"comm.eMsgNoData" | translate}}</div>';
                    maptemplate += '</div><div class="mapDevCount hidden-mobile">Total {{savedDevList.length}}</div>';
                    maptemplate += '<div class="mapArea" id="map_div'+ wdgtSeq +'"/>';
                    element.append(maptemplate);
                    element.html($compile(maptemplate)(scope));
                }

                //Marker를 생성할 디바이스 목록 조회
                var allDevList = scope.$root.myDevList; //나의 디바이스 목록
                function getSavedDevInfo() {
                    scope.savedDevList = [];
                    scope.roadAddr = [];
                    myDashService.getDevWdgtBySbjt(scope.widget)
                        .success(function(data){
                            if ( data.responseCode === '200' && data.data ) {
                                var savedDevList = data.data; //위젯에 등록한 디바이스
                                for ( var i=0, iCount=savedDevList.length; i<iCount; i++ ) {
                                    var savedDev = savedDevList[i];
                                    for (var j = 0, jCount = allDevList.length; j < jCount; j++) {
                                        var allDev = allDevList[j];
                                        if (savedDev.svcTgtSeq == allDev.svcTgtSeq && savedDev.spotDevSeq == allDev.spotDevSeq) {
                                            scope.savedDevList[i] = allDev;
                                            if (map) {
                                                makeDevMap(scope.savedDevList[i], i);
                                            }
                                        }
                                    }
                                }
                                clusterer.setMap(map);
                            }
                        });
                }

                function makeDevMap(devInfo, k) {
                    var lat = devInfo.latitVal;
                    var lng = devInfo.lngitVal;

                    if ( !lat || !lng ) return;//위경도 값이 있을 경우에만 지도 표시

                    var latLng = new olleh.maps.LatLng(lat, lng);//UTMK가 더 정확하기 때문에 변환함.
                    var marker = new olleh.maps.overlay.Marker({
                        position:new olleh.maps.UTMK.valueOf(latLng),
                        map:map
                    });
                    clusterer.add(marker);
                    scope.savedDevList[k].marker = marker;

                    //info window
                    marker.info = devInfo.devNm +'<br/>'+ $translate.instant('wdgt.latit')+': ' + lat+' | '+$translate.instant('wdgt.lngit')+': '+lng;
                    marker.onEvent('mouseover', function () {
                        infoWindow.close();
                        infoWindow.setContent(this.info);
                        infoWindow.open(this.getMap(), this);
                    }, marker);

                    //geocode 검색
                    var param = 'point.lat='+lat +'&point.lng='+lng;
                    myDashService.getRoadAddress(param)
                        .success(function(data){
                            scope.roadAddr[k] = { latitVal:lat
                                                , lngitVal:lng
                                                , addr:data.residentialAddress[0].parcelAddress[0].fullAddress};
                        });

                    if ( k === 0 ) { //첫번째 마커로 포커스 이동
                        var firstMarker = scope.savedDevList[0];
                        scope.moveFocus(firstMarker, firstMarker);
                    }
                    // if ( k === (scope.savedDevList.length-1) ) { //모든 마커 정보를 생성한 후, 클러스터 생성
                    //     clusterer.setMap(map);
                    // }
                }
                $timeout(function() {
                    map = new olleh.maps.Map(document.getElementById("map_div"+ wdgtSeq), {zoom:9, center:new olleh.maps.UTMK(958393.017494383, 1941487.7083653274)});
                    infoWindow = new olleh.maps.overlay.InfoWindow({});
                    clusterer = new olleh.maps.overlay.MarkerClusterer();
                    getSavedDevInfo(); //Map 생성
                }, 500);

                //디바이스를 클릭하면 해당 디바이스 위치로 포커스를 이동한다.
                scope.moveFocus = function(dev, addr) {
                    scope.selectedDev = dev.spotDevSeq; //선택한 디바이스
                    var latLng = new olleh.maps.LatLng(addr.latitVal, addr.lngitVal); //선택한 위치로 이동
                    map.setCenter(latLng);
                    //infoWindow를 열기 위한 Click Event 호출
                    // var customEvent = new olleh.maps.event.Event('click', dev.marker);
                    // dev.marker.fireEvent(customEvent, {x:1, y:1});
                }

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, arg){
                    if ( arg.wdgtSize ) {//위젯 사이즈
                        map.resize();
                    }
                    if ( arg.refresh ) {//위젯 설정 변경
                        clusterer.clear();
                        getSavedDevInfo();
                    }
                });
            }
        }
    });

function deviceMapWdgtSetCtrl($translate, $scope, $modalInstance, $rootScope, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    $scope.selectedDev = []; //디바이스 목록
    var savedDev = wdgtInfo.devWdgtList; //기저장한 디바이스 정보
    savedDev.forEach(function (dev) {
        $scope.selectedDev[dev.spotDevSeq] = 'Y';
    });

    //모달 변경내역 저장
    $scope.save = function() {
        var devs = Object.keys($scope.selectedDev);
        var devList = [];
        devs.forEach(function(v, i){
            if ( $scope.selectedDev[v] === 'Y' ) {
                devList.push({'svcTgtSeq':sessionStorage.getItem('svc_tgt_seq'), 'spotDevSeq':v});
            }
        });

        //validation check
        $scope.invalidMessage = '';
        if ( !devList[0] ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }

        var param = {'wdgtNm':$scope.wdgtNm
                   , 'wdgtSubnm':$scope.wdgtSubnm
                   , 'wdgtSeq':wdgtInfo.wdgtSeq
                   , 'spotDevSeqs':devList
                   , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertDevWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }

    //모달 닫기
    $scope.close = function() {
        $modalInstance.close();
    }
}


