angular.module('app')
    .controller('TopController', TopController);

function TopController($rootScope, $state, $stateParams, $scope, $filter, $translate, $interval, messageBox, myDashService) {

    $rootScope.dashbdSeq = 0;

    $scope.topMenuModal = false;
    $scope.isExpanded = true;
    $scope.hideDashbd = false;
    $scope.showFooter = true;
    $scope.navigationName = '';
    $scope.liClasses = [false,false,false,false,false,false];
    $scope.pushMsgList = [];
    $scope.showEvetPushMsg = sessionStorage.getItem('evet_push_msg')||'N';

    var vm = this;
    var pushCnct;
    vm.selected = {'sbjtSeq':0
                  ,'sbjtNm':''
                  ,'bmarkYn':'N'
                  ,'lockYn':'N'};
    vm.profileFile = 'assets/image/svg/user.svg';//프로필파일

    $rootScope.$on('showDashbdSttus', function(event, args){//상위메뉴 호출
        $scope.showDashbdSttus = args;
    });
    $rootScope.$on('changeUserImg', function (event, args) {//사용자 프로필 이미지 변경
        vm.profileFile = args.profileImgFilePath
    });
    $rootScope.$on('expandLeftMenu', function (event, args) {//좌측메뉴 펼치기
        $scope.isExpanded = true;
    });

    // 로그인 성공시 사용자 대시보드 정보 호출
    $rootScope.$watch('access_token', function(){
        if ( $rootScope.access_token ) {
            //layout 수정
            $('#dashbdView').removeClass('change').removeClass('login');
            $('.header').removeClass('noDisplay').addClass('showDisplay');

            //정보보안단 권고사항, 사용자계정 Masking 처리
            var tempUserNm = sessionStorage.getItem('dash_mbr_id');
            vm.userNm = tempUserNm.substr(0,tempUserNm.length-1);
            tempUserNm = null;

            vm.rmndDt = sessionStorage.getItem('dash_rmnd_dt');//Trial 사용자 잔여일 체크

            getDashbdList(); //대시보드 목록 조회
            //makePushSession(); //PC일 경우, Push 연결
        }
    });

    //Push Session 연결
    function makePushSession() {
        if ( !pushCnct ) {
            var svcTgtSeq = sessionStorage.getItem('dash_svc_tgt_seq');
            var mbrSeq = sessionStorage.getItem('dash_mbr_seq');
            var scpt = [{'svcTgtSeq':svcTgtSeq,'msgTypeCd':'01'}
                       ,{'svcTgtSeq':svcTgtSeq,'msgTypeCd':'03'}];
            pushCnct =
            new PnsClient('https://iotmakers.kt.com/stomp', 'https://iotmakers.kt.com/pushapi/v1/sessions', mbrSeq, 'YjZjZGEyODk0OWQwNDFhMGE0MDI3MWVjZmVkNGQ5MTQxNDMxMjI5NTAyMTk4', scpt);
            //new PnsClient('http://112.175.172.8:15674/stomp', 'http://112.175.172.8/pushapi/v1/sessions', mbrSeq, 'gqdmd4c8pwm1BqAJ', scpt);
            //new PnsClient('http://112.175.172.106:15674/stomp', 'http://112.175.172.105:8080/pushapi/v1/sessions', mbrSeq, 'gqdmd4c8pwm1BqAJ', scpt);
            pushCnct.setUsername("testuser6");
            pushCnct.setPassword("testuser6!");
            pushCnct.setKeepAlive(30000);
            pushCnct.setAccessToken(sessionStorage.getItem('dash_access_token'));//엑세스토큰
            pushCnct.connect(onPushCnctCallback); //STOMP 연결
        }
    }

    //push callback
    function onPushCnctCallback() {
        pushCnct.subscribe(function (resp) {
            var pData = JSON.parse(resp.body);
            var message = pData.message;
            console.log(message)
            if (pData.type === '03'){ //이벤트
                $scope.pushMsgList.push({'evetNm':message.evetNm,'outbDtm':message.outbDtm});
                if ($scope.pushMsgList.length>5) {
                    $scope.pushMsgList.shift();
                }
            } else {
                $rootScope.$broadcast('getLastVal', {data:message});
            }
            message = null;
        });
    };

    //notification 제거
    vm.closeNoti = function(index) {
        $scope.pushMsgList.splice(index,1);
    };

    //자세히 보기
    vm.seeAllNoti = function() {
        $state.go('log');//이벤트 타임라인으로 이동
    };

    //대시보드 목록 조회
    function getDashbdList() {
        myDashService.getDashbdInfo('0001')
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    var rows = resp.data.rows[0];
                    $rootScope.dashbdSeq = rows.dashbdSeq; //대시보드 일련번호
                    if ( rows.profileImgFilePath != null ) {
                        vm.profileFile = rows.profileImgFilePath;
                    } //프로필이미지 BASE64

                    vm.sbjtList = vm.selectedDashbd(rows.sbjtList, rows.sbjtList[0].sbjtSeq);
                    rows = null;
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    //개별 대시보드 선택
    vm.selectedDashbd = function(list, sequence) {
        angular.forEach(list, function(item, i){
            item.checked = false;
            if ( item.sbjtSeq == sequence ) {
                item.checked = true;
                vm.selected = item;
            }
        });
        vm.changeNav('dashbd'); //네비게이션 변경

        //push 연결
        if ( vm.selected.cnctTypeCd == 'PS' && !pushcnct ) { //진입 후 처음으로 푸시 연결
            makePushSession();
        } else {
            if ( pushCnct ) {
                pushCnct.disconnect(function(){
                    console.log('push disconnect');
                    pushCnct = undefined;
                });
            }
        }

        $state.go('mydashboard', {sequence:sequence});//테마판 호출
        return list;
    }

    //대시보드 삭제, 수정
    vm.updateDashbd = function(flag) {
        if ( flag === 'delete' ) {
            deleteDashbd(flag);
        } else if ( flag === 'bookmark' ) {
            if ( vm.selected.bmarkYn == 'N' ) {
                vm.selected.bmarkYn = 'Y';
            } else {
                vm.selected.bmarkYn = 'N';
            }
            updateDashbd(); //대시보드 업데이트
        } else if ( flag === 'lock' ) {
            if ( vm.selected.lockYn == 'N'  ) {
                vm.selected.lockYn = 'Y';
            } else {
                vm.selected.lockYn = 'N';
            }
            updateDashbd(); //대시보드 업데이트
        }
    }

    //대시보드 수정 API 호출
    function updateDashbd() {
        var param = {
            'sbjtSeq':vm.selected.sbjtSeq,
            'bmarkYn':vm.selected.bmarkYn,
            'lockYn':vm.selected.lockYn
        };
        myDashService.updateSbjtItem(param)
            .success(function(resp) {
                if (resp.responseCode === '200') {
                    angular.forEach(resp.data.rows, function(item, i){
                        item.checked = false;
                        if ( item.sbjtSeq == vm.selected.sbjtSeq ) {
                            item.checked = true;
                            vm.selected = item;
                        }
                    });
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    //대시보드 삭제 API 호출
    function deleteDashbd() {
        messageBox.open($translate.instant('comm.eMsgConfDel'), {
            type:"info",
            confirm : true
        }).result.then(function(confirm) {
            if (!confirm) return; //컨펌하지 않을 경우
            var param = {'sbjtSeq':vm.selected.sbjtSeq};
            myDashService.deleteSbjtItem(param)
                .success(function(resp) {
                    if (resp.responseCode === '200') {
                        //대시보드 재조회
                        vm.sbjtList = vm.selectedDashbd(resp.data, resp.data[0].sbjtSeq);
                    }
                })
                .error(function(resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        });
    }

    //위젯 추가 모달 호출
    vm.openWdgtAddModal = function() {
        $rootScope.$broadcast('openWdgtAddModal');
    };

    //대시보드 상위메뉴 모달 호출
    vm.openTopModal = function(flag) {
        vm.currentModal = flag;
        if ( flag == 10 ) {
            vm.modaltitle = $translate.instant('dash.copyDashbd');
            vm.copyDashbdNm = vm.selected.sbjtNm+'_Copy';
            vm.msgDashbdNm = '';
        } else if ( flag == 11 ) {
            vm.modaltitle = $translate.instant('dash.dashbdPerfInspr');
            vm.inspResult = [];
            exeInspection();
        } else if ( flag == 12 ) {
            vm.modaltitle = $translate.instant('dash.dataCnct');
            vm.msgCnctInfo = '';
            vm.selectCnctTypeCd = vm.selected.cnctTypeCd; //주기타입
        }
        $scope.topMenuModal = true;
    }

    //대시보드 상위메뉴 모달 닫기
    vm.closeModal = function() {
        $scope.topMenuModal = false;
    }

    //대시보드 설정을 위한 상위메뉴
    vm.setDashbd = function(flag) {
        if ( flag == 13 ) {
            $scope.showEvetPushMsg = $scope.showEvetPushMsg ==='Y'?'N':'Y';
            sessionStorage.setItem('evet_push_msg', $scope.showEvetPushMsg);
        } else if ( flag == 14 ) {
            $rootScope.$broadcast('refreshCustDashbd'); //Dashboard Reload
        }
    }

    //대시보드 상위메뉴 변경사항 적용
    vm.updateModal = function() {
        // 대시보드 복제
        if ( vm.currentModal == 10 ) {
            if ( typeof vm.copyDashbdNm == 'undefined' || vm.copyDashbdNm == '' ) {
                vm.msgDashbdNm = $translate.instant("comm.eMsgMustValueColumn");
                return;
            }
            var param = { 'sbjtSeq':vm.selected.sbjtSeq
                        , 'sbjtNm':vm.copyDashbdNm };
            myDashService.copySbjt(param)
                .success(function(resp) {
                    if (resp.responseCode === '200') {
                        vm.sbjtList = vm.selectedDashbd(resp.data, vm.selected.sbjtSeq);//대시보드 재조회
                    }
                })
                .error(function(resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
            //대시보드 연결설정
        } else if ( vm.currentModal == 12 ) {
            var param = {
                 'sbjtSeq':vm.selected.sbjtSeq
                ,'cnctTypeCd':vm.selectCnctTypeCd
                //,'cnctCycl':Number(vm.selectPollingPerd)
            };
            myDashService.updateSbjtItem(param)
                .success(function(resp) {
                    if (resp.responseCode === '200') {
                        vm.selected.cnctTypeCd = vm.selectCnctTypeCd;
                        // vm.selected.cnctCycl = vm.selectPollingPerd;

                        if ( vm.selectCnctTypeCd != 'PS' && pushCnct ) { //push 연결 삭제
                            pushCnct.disconnect(function(){
                                console.log('push disconnect');
                                pushCnct = undefined;
                            });
                        } else { //push 연결
                            makePushSession();
                        }
                        messageBox.open($translate.instant('comm.eMsgPrpRefresh'), {type:"info"});
                        // $state.reload(); //페이지 새로고침, Dom Node가 너무 올라감! 사용 비추천!
                        // location.reload(); //페이지 새로고침
                        vm.setDashbd(14);
                    }
                })
                .error(function(resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        }

        $scope.topMenuModal = false; //모달닫기
    }

    //네비게이션 변경
    vm.changeNav = function(flag) {
        var index;
        $scope.preName = ''; //prefix
        if ( flag === 'bmark' ) { //즐겨찾기
            $scope.navigationName = $translate.instant('comm.bmark');
            index = 0;
        } else if ( flag === 'guide' ) { //이용가이드
            $scope.navigationName = $translate.instant('comm.userGuide');
            index = 4;
            var page = (localStorage.getItem('langCd')||'KOR').toLowerCase()+'UserGuide';
            $state.go(page);
        } else if ( flag === 'manage' ) { //관리
            $scope.navigationName = $translate.instant('comm.settings');
            index = 5;
        } else if ( flag === 'dashbdList' ) { //대시보드목록
            $scope.navigationName = $translate.instant('comm.dashbdList');
            index = 2;
            //대시보드 목록 Open/Close
            if ($scope.hideDashbd) {
                $scope.hideDashbd = false;
            } else {
                $scope.hideDashbd = true;
            }
        } else if ( flag === 'myDev' ) { //나의 디바이스
            $scope.navigationName = $translate.instant('comm.myDev');
            index = 1;
        } else if ( flag === 'dashbd' ) {
            $scope.preName = $translate.instant('comm.dashbd')+' / ';
            $scope.navigationName = vm.selected.sbjtNm;
            index = 2;
        } else if ( flag === 'log' ) {
            $scope.navigationName = $translate.instant('comm.evetTimeLine');
            index = 3;
        }
        setOn(index);
    }

    //선택한 목록의 class 변경
    function setOn(index) {
        if ( index != 2 ) {
            angular.forEach(vm.sbjtList, function(item, i){
                item.checked = false;
            });
        }
        angular.forEach($scope.liClasses, function(item, i){
            if ( i === index ) {
                $scope.liClasses[i] = true;
            } else {
                $scope.liClasses[i] = false;
            }
        });
    }

    //개별 대시보드로 이동
    $rootScope.$on('moveDashbd', function(event, args){
        vm.selectedDashbd(vm.sbjtList, args.sequence); //대시보드 목록 조회
    });

    //테마 목록 변경
    $rootScope.$on('refreshSbjtList', function (event, args) {
        vm.sbjtList = args.sbjtList;
    });

    //로그아웃
    vm.signOut = function() {
        $rootScope.access_token = null;
        sessionStorage.clear();

        if ( pushCnct ) {
            pushCnct.disconnect(function(){
                console.log('push disconnect');
                pushCnct = undefined;
            });
        }

        $state.go('auth.login', {toState:'',toParams:''});
    }

    //즐겨찾기 아이콘 CSS
    vm.bookmark = function() {
        if ( vm.selected.bmarkYn == 'Y' ) {
            return 'fas fa-bookmark icon color-yellow1';
        }
        return 'far fa-bookmark icon';
    }

    //이벤트수신함 아이콘 CSS
    vm.inbox = function() {
        if ( $scope.showEvetPushMsg === 'Y' ) {
            return 'fas fa-envelope-open-text icon color-yellow1';
        }
        return 'fas fa-envelope-open-text icon';
    }

    //데이터 수신 아이콘 CSS
    vm.cnct = function() {
        if ( vm.selected.cnctTypeCd == 'PS' ) {
            return 'fas fa-toggle-on icon color-yellow1';
        }
        return 'fas fa-toggle-off icon';
    }

    //잠김여부 아이콘 CSS
    // vm.lock = function() {
    //     if ( vm.selected.lockYn == 'Y' ) {
    //         return 'glyphicon glyphicon-pushpin icon color-yellow1';
    //     }
    //     return 'glyphicon glyphicon-pushpin icon';
    // }

    //대시보드 LNB 확장, 축소
    vm.isExpanded = function() {
        if ( $scope.isExpanded ) {
            $scope.isExpanded = false;
            $('#dashbdView').addClass('change');
            $('.footer').addClass('change')
        } else {
            $scope.isExpanded = true;
            $('#dashbdView').removeClass('change');
            $('.footer').removeClass('change');
        }
    }

    //LNB CSS
    vm.lnb = function() {
        if ( $scope.isExpanded ) {
            return ''
        }
        return 'lnb';
    }

    //Inner CSS
    vm.inner = function() {
        if ( $scope.isExpanded ) {
            return 'inner row';
        }
        return 'noinner row';
    }

    //대시보드 목록 CSS
    vm.dashbd = function() {
        if ($scope.hideDashbd) {
            return 'off';
        }
        return 'on';
    }

}