angular.module('app.mydash')
    .controller('COMM_DEV_LO_HST_Ctrl', commDevLoHstCtrl)
    .directive('commPopupMaparea', function ($compile, $timeout, myDashService) {
        return {
            restrict: 'E',
            scope:{
                mapInfo:'=mapInfo'
            },
            // template: '<div class="mapArea" id="map_div"/>',
            template: '',
            controller: function($scope){
            },
            link: function (scope, element) {
                var maptemplate  = '<div class="mapArea" id="map_div"/>';
                    maptemplate += '<div class="table-type02">';
                    // maptemplate += '<h4>[{{mapInfo.devNm}}] {{"wdgt.dtlMvPath" | translate}}</h4>';
                    maptemplate += '<table><colgroup><col/><col/><col/></colgroup>';
                    maptemplate += '<thead><tr><th>no</th><th>{{"wdgt.gpsTime" | translate}}</th><th>{{"wdgt.gpsLo" | translate}}</th></tr></thead>';
                    maptemplate += '<tbody><tr ng-repeat="item in devDtlLoList"><td>{{$index+1}}</td><td>{{item.createOn}}</td>';
                    maptemplate += '<td class="text-left"><span class="color-red3">{{item.latitSnsrVal}}°</span>, <span class="color-red3">{{item.lngitSnsrVal}}°</span></td></tr>';
                    maptemplate += '<tr ng-if="devDtlLoList.length==0"><td class="text-center" colspan="3">{{"wdgt.eMsgSelTrobjLo" | translate}}</td></tr></tbody></table></div>';
                element.append(maptemplate);
                element.html($compile(maptemplate)(scope));

                var map, infoWindow;
                $timeout(function() {
                    map = new olleh.maps.Map(document.getElementById("map_div"),
                                            {zoom:9, center:new olleh.maps.UTMK(958393.017494383, 1941487.7083653274)});
                    infoWindow = new olleh.maps.overlay.InfoWindow({});
                    getDevLoLog(); //디바이스위치이력
                }, 500);

                //디바이스 위치 로그 조회
                var devMarkers = [];
                function getDevLoLog() {
                    var latitSnsrCd = scope.mapInfo.latitSnsrCd; //위도센서코드
                    var lngitSnsrCd = scope.mapInfo.lngitSnsrCd; //경도센서코드
                    var fromDt = moment(scope.mapInfo.stTime).format('x');
                    var toDt = moment(scope.mapInfo.endTime).format('x');

                    //최대 1일 데이터만 조회
                    var param = '&targetSequence='+scope.mapInfo.svcTgtSeq+'&deviceSequence='+scope.mapInfo.spotDevSeq+'&from='+fromDt+'&to='+toDt+'&offset=1&limit=5760&logCondition=%5b-90%3c%3d'+latitSnsrCd+'%3c0%2c0%3c'+latitSnsrCd+'%3c%3d90%2c-180%3c%3d'+lngitSnsrCd+'%3c0%2c0%3c'+lngitSnsrCd+'%3c%3d180%5d';
                    myDashService.getDevLogs(param)
                        .success(function (resp) {
                            if ( resp.responseCode === '200' && resp.data ) {
                                devMarkers = resp.data; //로그
                                for ( var i=0, iCount=devMarkers.length-1; i<=iCount; i++ ) {
                                    var markerDtl = devMarkers[i].response.sensingTags;//로그의 센서정보
                                    for ( var j=0, jCount=markerDtl.length; j<jCount; j++ ) {
                                        var item = markerDtl[j];
                                        if ( item.code === latitSnsrCd ) { //위도값 매핑
                                            devMarkers[i].latitSnsrVal = item.value;
                                        } else if ( item.code === lngitSnsrCd ) { //경도값 매핑
                                            devMarkers[i].lngitSnsrVal = item.value;
                                        }
                                        makeDevMap(devMarkers[i], i, iCount); //Marker 생성
                                    }
                                }
                                //가장 최근 위치로 포커싱
                                var latLng = new olleh.maps.LatLng(devMarkers[0].latitSnsrVal, devMarkers[0].lngitSnsrVal);
                                map.setCenter(latLng);
                            }
                        });
                }

                //Map에 Marker 생성
                var preMarker = [];
                function makeDevMap(devMarker, index, total) {
                    var latLng = new olleh.maps.LatLng(devMarker.latitSnsrVal, devMarker.lngitSnsrVal);//UTMK가 더 정확하기 때문에 변환함.
                    var marker;
                    if ( index === 0 ) { //시작점
                        marker = new olleh.maps.overlay.Marker({
                            position:new olleh.maps.UTMK.valueOf(latLng),
                            icon:{
                                url: 'assets/image/ico_end_marker.png',
                                size:new olleh.maps.Size(40,40)
                            },
                            flat:true,
                            map:map
                        });
                        marker.bringToFront();
                    } else if ( index === total ) { //종료점
                        marker = new olleh.maps.overlay.Marker({
                            position:new olleh.maps.UTMK.valueOf(latLng),
                            icon:{
                                url: 'assets/image/ico_start_marker.png',
                                size:new olleh.maps.Size(40,40)
                            },
                            flat:true,
                            map:map
                        });
                        marker.bringToFront();
                    } else {
                        marker = new olleh.maps.overlay.Marker({
                            position:new olleh.maps.UTMK.valueOf(latLng),
                            icon:{ //시작~종료
                                url: 'assets/image/ico_realtime_marker.png',
                                size:new olleh.maps.Size(10,10)
                            },
                            flat:true,
                            map:map
                        });
                    }

                    //info window
                    marker.info = scope.mapInfo.devNm;
                    marker.index = index;
                    marker.onEvent('click', function () {
                        infoWindow.close();
                        infoWindow.setContent(this.info);
                        infoWindow.open(this.getMap(), this);
                        getDevDtlLoLog(index); //상세이동경로
                    }, marker);

                    preMarker[index] = marker; //이전 마커정보 할당
                }

                //클릭한 마커의 상세이동경로 조회
                scope.devDtlLoList = [];
                function getDevDtlLoLog(index) {
                    // 기준 마커로부터 전후 5개씩 조회, index가 작을 수록 최신 값이다.
                    var list = devMarkers;
                    var stdNo = list.length-11;
                    if ( index > stdNo ) {
                        list = list.slice(stdNo, stdNo+11);
                    } else if ( index < 5 ) {
                        list = list.slice(0, index+6);
                    } else {
                        list = list.slice(index-5, index+6);
                    }
                    for ( var i =0, iCount=list.length; i<iCount; i++ ) {
                        list[i].createOn = moment(list[i].createOn).format('YYYY-MM-DD HH:mm:ss');
                    }
                    scope.devDtlLoList = list;
                    scope.$apply();
                }

                //디바이스 위치로그 재조회
                scope.$parent.getDevNewLoLog = function(stTime, endTime) {
                    scope.mapInfo.stTime = stTime;
                    scope.mapInfo.endTime = endTime;
                    //이전 마커 삭제
                    for ( var i=0, iCount=preMarker.length;i<iCount;i++ ) {
                        preMarker[i].setMap(null);
                    }
                    getDevLoLog();
                };

                // scope.$parent.clearAll = function() {
                //     //전역변수 초기화
                //     maptemplate, map, infoWindow, devMarkers = null;
                //     scope.devDtlLoList = null;
                // };
            }
        }
    });

    function commDevLoHstCtrl($translate, $modalInstance, $modal, $scope, $rootScope, devInfo, myDashService, $filter, messageBox) {

        //parent에서 전달받은 파라미터를 세팅한다.
        function init() {
            $scope.parentMapInfo = devInfo;
            devInfo.stTime = moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm');
            devInfo.endTime = moment().format('YYYY-MM-DD HH:mm');

            //트래커 이미지
            if ( devInfo.imageUrl ) {
                myDashService.getDeviceImg(devInfo.imageUrl)
                    .success(function (resp) {
                        if (resp.responseCode == 'OK') {
                            $scope.parentMapInfo.icon = resp.data;
                        }
                    });
            }

            //지도위젯 자산정보 조회
            myDashService.selectComplexMapAsset(devInfo)
                .success(function(data){
                    if ( data.responseCode === '200' && data.data[0] && data.data[0].mapExpnsnInfo) {
                        $scope.parentMapInfo.mapExpnsnInfo = JSON.parse(data.data[0].mapExpnsnInfo).asset;
                    }
                });
        }

        /**
         * 조회일시 감지
         */
        //검색날짜 설정
        $scope.$watch('parentMapInfo.stTime', function (newValue, oldValue) {
            if(newValue === oldValue){ return; }
            $scope.parentMapInfo.stTime =newValue;
        });
        $scope.$watch('parentMapInfo.endTime', function (newValue, oldValue) {
            if(newValue === oldValue){ return; }
            $scope.parentMapInfo.endTime =newValue;
        });
        $(document).on("dp.change", function(e){
            if(e.target.id === 'datetimepicker1'){
                $scope.parentMapInfo.stTime = $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm');
            } else if(e.target.id === 'datetimepicker2'){
                $scope.parentMapInfo.endTime = $filter('date')(e.date._d, 'yyyy-MM-dd HH:mm');
            }
        });

        //로그 조회
        $scope.search = function(e) {
            //최대 2일 정보만 조회 가능
            var xStTime = moment($scope.parentMapInfo.stTime).format('x');
            var xEndTime = moment($scope.parentMapInfo.endTime).format('x');
            if ( (xEndTime - xStTime) > 172800000 || (xStTime - xEndTime) > 172800000 ) { //최대 48시간 검색가능
                messageBox.open($translate.instant('wdgt.eMsgFindTrackerHisCond'), {
                    type: "warning"
                });
                return;
            }
            $scope.getDevNewLoLog($scope.parentMapInfo.stTime, $scope.parentMapInfo.endTime); //새로운 시간에 대한 위치 재조회
        }
       
       //모달닫기
        $scope.close = function() {
            //$scope.clearAll();
            $modalInstance.close();
        };

        //이동체 정보 수정
        $scope.updateDev = function() {
            $modal.open({
                templateUrl: 'components/dashboard/widget/COMM_MAP_TOOLS_MODAL.html',
                scope: $scope,
                resolve: {
                    wdgtInfo: function () {
                        return $scope.parentMapInfo;
                    }
                },
                controller: 'COMM_MAP_TOOLS_Ctrl'
            });
        }

        $scope.$on(devInfo.wdgtSeq+'.changeMapAsset', function(event,arg) {
            if ( arg.asset ) { //변경된 자산정보 업데이트
                $scope.parentMapInfo.mapExpnsnInfo = arg.asset;
            }
        });

        init();
    }


