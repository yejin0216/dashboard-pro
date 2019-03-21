
angular.module('app.mydash', ['kt.ui'])
    .controller('MyDashCtrl',
        function($scope, $modal, $log, $rootScope, $state, $stateParams, $http, $translate, $timeout, $interval, adminConstant, myDashService, messageBox, stringUtil) {

            var sbjtSeq = $stateParams.sequence; //선택한 테마일련번호
            if ( sbjtSeq == 0 ) return; //테마일련번호가 0일 경우 리턴

            var vm = this;
            var flux; //$interval을 위한 변수
            var wdgtTmplt = []; //위젯템플릿목록
            $scope.widgetlist = []; //위젯 목록

            //PC버전 그리드(위젯) 속성
            $scope.gridsterOptions = {
                margins: [10, 10],
                minColumns: 2,
                outerMargin: false,
                pushing: true,
                floating: true,
                rowHeight: 180,
                draggable: {enabled:false},
                resizable: {enabled:false}
            };

            //15인치 이하
            if ( document.body.clientWidth < 1527 ) {
                $scope.gridsterOptions.dynamicColumns = true;
                $scope.gridsterOptions.minWidthToAddANewColumn = 200;
            }
            //15인치 이상
            else {
                $scope.gridsterOptions.draggable = {
                    enabled: true,
                    handle: '.box-header',
                    stop: function(event, $element, widget) {
                        myDashService.updateWdgtSettingBySbjt({wdgtList:$scope.widgetlist});//변경사항 저장
                    }
                };
                $scope.gridsterOptions.resizable = {
                    enabled: true,
                    handles: ['se'],
                    stop: function(event, $element, widget) {
                        myDashService.updateWdgtSettingBySbjt({wdgtList:$scope.widgetlist});//변경사항 저장
                        $scope.$broadcast(widget.wdgtSeq+'.changeSettings', {wdgtSize:true});
                    }
                }
            }

            //현재 Dashboard Reload
            $scope.$on('refreshCustDashbd', function() {
                initDashbd();
            });

            //대시보드 onload
            initDashbd();
            function initDashbd() {
                //위젯 템플릿 조회
                myDashService.getWdgtTmplt()
                    .success(function(resp) {
                        if (resp.responseCode === '200') {
                            wdgtTmplt = resp.data; //위젯 템플릿 목록
                        }
                    })
                    .error(function(resp) {
                        console.log("API Service Error : " + resp.status + " " + resp.error);
                    });
                //대시보드별 위젯 조회
                myDashService.getWdgtListBySbjt(sbjtSeq)
                    .success(function(resp){
                        if ( resp.responseCode === '200' ) {
                            var rtnWdgt = resp.data;
                            $scope.widgetlist = rtnWdgt.rows[0]; //위젯목록
                            vm.widgetarea = rtnWdgt.rows[1]; //위젯이 차지하는 총 넓이
                            // setCnctInfo(rtnWdgt.rows[2]); //연결설정
                            cntlsbjtArea(rtnWdgt.total); //테마영역 Style Display 제어

                            rtnWdgt = null;
                            $rootScope.$emit('showDashbdSttus', true); //상단 바 출력
                        }
                    })
                    .error(function(resp) {
                        console.log("API Service Error : " + resp.status + " " + resp.error);
                    });

                //1시간 주기 대시보드 refresh
                // if ( angular.isDefined(reload) ) return;
                // reload = $interval(function() {
                //     $state.reload(); //페이지 새로고침
                // }, 3600000);
            }

            //연결설정 정보 세팅
            // function setCnctInfo(cnctInfo) {
            //     var cnctType = cnctInfo[0].cncttypecd; //연결방식
            //     if ( cnctType === 'PL' ) { //폴링
            //         var cnctCycle = cnctInfo[0].cnctcycl*1000; //폴링 주기
            //         if ( angular.isDefined(flux) ) return;
            //         flux = $interval(function() {
            //             getLastVal(); //디바이스 최종 값 조회
            //         }, cnctCycle);
            //     } else {
            //         flux = undefined;
            //     }
            // }
            // $scope.$on('$destroy', function() {
            //     if (angular.isDefined(flux)) {
            //         $interval.cancel(flux);
            //         flux = undefined;
            //     }
            //     // if (angular.isDefined(reload)) {
            //     //     $interval.cancel(reload);
            //     //     reload = undefined;
            //     // }
            // });

            //디바이스 최종 값 조회
            //getLastVal();
            // function getLastVal() {
            //     myDashService.getLastVal({'sbjtSeq':sbjtSeq})
            //         .success(function(resp) {
            //             if (resp.responseCode === '200' && resp.data) {
            //                 $rootScope.$broadcast('getLastVal', {broadcast:true, data:resp.data});
            //             }
            //         })
            //         .error(function(resp) {
            //             console.log("API Service Error : " + resp.status + " " + resp.error);
            //         });
            // }

            //테마영역 Style Display 제어
            function cntlsbjtArea(totalWdgtCnt){
                if ( totalWdgtCnt > 0 ) {
                    //document.getElementById('sbjtTab').style.display = 'flex';
                    document.getElementById('sbjtGrid').style.display = 'flex';
                    document.getElementById('noSbjt').style.display = 'none';
                } else {
                    //document.getElementById('sbjtTab').style.display = 'none';
                    document.getElementById('sbjtGrid').style.display = 'none';
                    document.getElementById('noSbjt').style.display = 'block';
                }
            };

            //"위젯추가" 모달 호출
            vm.dsId, vm.optId = [];
            $scope.selectedSorc = '0001';
            vm.addwdgtModal = function() {
                vm.nextstep('0001', '0001'); //초기는 무조건 디바이스 리소스로 세팅한다.
                $scope.disabledBtn = false;
                $scope.wdgtAddModal = true;
            };

            //"위젯추가" 모달 호출
            $scope.$on('openWdgtAddModal', function (event, args) {
                //area는 총 36까지 사용할 수 있다.
                if ( vm.widgetarea >= 36 ) {
                    // 위젯을 추가할 타일 영역이 부족합니다.
                    // 필요 없는 위젯을 삭제하거나 신규 대시보드를 추가하여 사용하시기 바랍니다.
                    messageBox.open($translate.instant('dash.eMsgChkWdgtArea'), {
                        type: "warning"
                    });
                    return;
                }
                vm.addwdgtModal();
            });

            //"위젯추가" 모달 닫기
            vm.closeWdgtAddModal = function () {
                $scope.wdgtAddModal = false;
                vm.dsId = [], vm.optId = []; //선택항목 초기화
            };

            //"위젯추가" 모달, Step 별 데이터 소팅
            vm.nextstep = function(curstep, flag) {
                vm.dsId = [], vm.optId = []; //선택항목 초기화
                $scope.invalidMessage = ''; //유효성검증 메시지 초기화

                if ( curstep == '0001' ) { //리소스
                    $scope.selectedSorc = flag;
                    vm.selectedTmplt = wdgtTmplt[flag];
                    vm.nextstep('0002', vm.selectedTmplt[0].compCtgTypeCd);
                } else if ( curstep == '0002' ) { //컴포넌트
                    $scope.compCtgr = flag;
                    vm.selectedComp = vm.selectedTmplt.filter(function(item){return item.compCtgTypeCd == flag})[0].wdgtTmpltByCompList;
                    vm.selectedWdgtType  = '0001'; //초기는 무조건 위젯타입:위젯으로 세팅한다.
                    vm.nextstep('0003', vm.selectedWdgtType);
                    vm.previewData = vm.selectedComp[0].wdgtTmpltId;
                } else if ( curstep == '0003' ) { //데이터셋,옵션
                    var comp = vm.selectedComp.filter(function(item){return item.wdgtTmpltTypeCd == flag;})[0];
                    var dataset = JSON.parse(comp.wdgtTmpltDataset)['ds']; //데이터셋
                    var optn = JSON.parse(comp.wdgtTmpltOptn)['optn']; //옵션

                    vm.selectedDs = []; //데이터셋
                    dataset.forEach(function(v, i){
                        vm.selectedDs[i] = {"id":v.id+'_'+v.ordr, "name":$translate.instant('addWdgt.ds.'+v.id)};
                    });

                    vm.selectedOpts = []; //옵션
                    optn.forEach(function(v, i){
                        vm.selectedOpts[i] = {"id":v.id, "name":$translate.instant('addWdgt.optn.'+v.id)};
                    });
                }
            }

            //사각화옵션에 따른 미리보기
            vm.setOptnView = function(opt) {
                vm.previewData = vm.selectedComp[0].wdgtTmpltId+opt.id;
            }

            //"위젯추가"모달, 위젯 추가
            //수정필요, 이중클릭방지
            vm.addWdgt = function() {
                $scope.invalidMessage = '';
                $scope.disabledBtn = true;

                var dsId = Object.keys(vm.dsId); //선택한 데이터셋
                var paramDs = {"ds":[]};
                dsId.forEach(function(v, i){
                    if ( vm.dsId[v] == 'Y' ) {
                        paramDs.ds.push({"id":v.split('_')[0],"ordr":v.split('_')[1]});
                    }
                });

                //데이터셋 유효성 검증(디바이스목록,디바이스이미지,센서목록,센서이미지,이벤트목록)
                var allDs = JSON.parse(vm.selectedComp[0].wdgtTmpltDataset).ds;
                if ( allDs.length > 0 && paramDs.ds.length===0 ) {
                    $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
                    $scope.disabledBtn = false;
                    return;
                }
                allDs = null;

                var optId = Object.keys(vm.optId); //선택한 옵션
                var paramOpts = {"optn":[]};
                optId.forEach(function(v, i){
                    if ( vm.optId[v] == 'Y' ) {
                        paramOpts.optn.push({"id": v});
                    }
                });
                //시각화옵션 유효성 검증
                var allOptn = JSON.parse(vm.selectedComp[0].wdgtTmpltOptn).optn;
                if ( allOptn.length > 0 && paramOpts.optn.length===0 ) {
                    $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
                    $scope.disabledBtn = false;
                    return;
                }
                if ( allOptn.length > 0 && paramOpts.optn.length>1 ) {
                    $scope.invalidMessage = $translate.instant('wdgt.eMsgTooManyOptn');
                    $scope.disabledBtn = false;
                    return;
                }
                allOptn = null;

                var v_length = $scope.widgetlist.length;
                var item = [];
                if ( vm.selectedWdgtType == '0001' ) {
                    //위젯
                    if ( v_length == 0 ) {
                        $scope.widgetlist.push({
                            wdgtNm:vm.selectedComp[0].wdgtTmpltNm,
                            name:vm.selectedComp[0].wdgtTmpltNm,
                            sizeX:vm.selectedComp[0].minSizeX,
                            sizeY:vm.selectedComp[0].minSizeY,
                            col:0,
                            row:0
                        });
                    } else {
                        $scope.widgetlist.push({
                            wdgtNm:vm.selectedComp[0].wdgtTmpltNm,
                            name:vm.selectedComp[0].wdgtTmpltNm,
                            sizeX:vm.selectedComp[0].minSizeX,
                            sizeY:vm.selectedComp[0].minSizeY
                        });
                    }
                    v_length = $scope.widgetlist.length;
                    item = $scope.widgetlist[v_length-1];
                };

                //신규 위젯이 추가되면 transaction을 실행한다.
                $timeout(function() {
                    var param = { 'sbjtSeq':sbjtSeq //테마 일련번호
                        , 'wdgtTmpltId':vm.selectedComp[0].wdgtTmpltId //템플릿아이디
                        , 'wdgtTmpltTypeCd':vm.selectedWdgtType //템플릿타입코드
                        , 'wdgtNm':item.name //위젯템플릿명
                        , 'wdgtDataset':JSON.stringify(paramDs) //데이터셋
                        , 'wdgtDatasetSize':paramDs.ds.length //데이터셋 사이즈
                        , 'wdgtOptn':JSON.stringify(paramOpts) //옵션
                        , 'sizeX':item.sizeX //초기 X사이즈
                        , 'sizeY':item.sizeY //초기 Y사이즈
                        , 'col': item.col //컬럼 위치
                        , 'row': item.row //로우 위치
                        , 'mbrId':sessionStorage.getItem('dash_mbr_id') };
                    myDashService.insertWdgtBySbjt(param)
                        .success(function(resp) {
                            if (resp.responseCode === '200') {
                                var sbjtInfo = resp.data.rows;
                                var wdgtCnt = resp.data.total;
                                var index = wdgtCnt - 1;

                                vm.widgetarea = sbjtInfo[1]; //위젯이 차지하는 총 넓이
                                $scope.widgetlist[index] = sbjtInfo[0][index]; //위젯 목록
                                cntlsbjtArea(wdgtCnt); //위젯총건수

                                sbjtInfo, wdgtCnt, index = null;
                                vm.closeWdgtAddModal(); //모달 닫기
                            }
                        })
                        .error(function(resp) {
                            console.log("API Service Error : " + resp.status + " " + resp.error);
                        })
                        .finally(function () {
                            dsId, optId, paramDs, paramOpts, v_length, item, param = null; //초기화
                        });
                }, 500);
            };

            //위젯 세부정보 편집
            vm.updateWdgt = function(wdgt) {
                myDashService.getWdgtBySbjt(wdgt)
                    .success(function (resp) {
                        $modal.open({
                            templateUrl: 'app/components/dashboard/widget/' + wdgt.wdgtTmpltId + '-Settings.html',
                            scope: $scope,
                            resolve: {
                                wdgtInfo: function () {
                                    return resp.data;
                                }
                            },
                            controller: wdgt.wdgtTmpltId + '_SET_Ctrl'
                        });
                    });
            };

            //위젯 차트도구모음
            vm.updateOptn = function(wdgt) {
                myDashService.getWdgtBySbjt(wdgt)
                    .success(function (resp) {
                        $modal.open({
                            templateUrl: 'app/components/dashboard/widget/COMM_CHART_TOOLS_MODAL.html',
                            scope: $scope,
                            resolve: {
                                wdgtInfo: function () {
                                    return resp.data;
                                }
                            },
                            controller: 'COMM_CHART_TOOLS_Ctrl'
                        });
                    });
            };

            //위젯 삭제
            vm.deleteWdgt = function(wdgt) {
                messageBox.open($translate.instant('comm.eMsgConfDel'), { //삭제하겠습니까?
                    type:"info",
                    confirm : true
                }).result.then(function(confirm) {
                    if (!confirm) return; //컨펌하지 않을 경우
                    var delInfo = {'sbjtSeq':wdgt.sbjtSeq,
                        'wdgtSeq':wdgt.wdgtSeq}
                    myDashService.deleteWdgtBySbjt(delInfo)
                        .success(function(resp) {
                            if (resp.responseCode === '200') {
                                var sbjtInfo = resp.data.rows;
                                var wdgtCnt = resp.data.total;

                                $scope.widgetlist.forEach(function(v, i){
                                    if ( v.wdgtSeq === wdgt.wdgtSeq ) {
                                        $scope.widgetlist.splice(i,1);
                                    }
                                });
                                vm.widgetarea = sbjtInfo[1]; //위젯이 차지하는 총 넓이
                                cntlsbjtArea(wdgtCnt); //위젯총건수
                            }
                        })
                        .error(function(resp) {
                            console.log("API Service Error : " + resp.status + " " + resp.error);
                        });
                });
            };

            //한눈 가이드 보기
            vm.sumryGuide = function() {
                $modal.open({
                    templateUrl:'app/components/guide/sumryGuide.html',
                    scope:$scope,
                    controller:'sumryGuideController',
                    backdropClass: 'dark-backdrop'
                });
                $rootScope.$emit('expandLeftMenu');
            };

            //이용 가이드 보기
            vm.userGuide = function() {
                $rootScope.navigationName = $translate.instant('comm.dashbdList');
                var page = (localStorage.getItem('langCd')||'KOR').toLowerCase()+'UserGuide';
                $state.go(page);
            };

            //위젯 정보 변경
            $rootScope.$on('changeWdgtInfo', function (event, args) {
                angular.element('#wdgt'+args.wdgtSeq+'-title').text(stringUtil.nullToString(args.wdgtNm));
                angular.element('#wdgt'+args.wdgtSeq+'-subtitle').text(stringUtil.nullToString(args.wdgtSubnm));
            });

        });
