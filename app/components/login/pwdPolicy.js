angular.module('app.auth')
    .controller('pwdPolicyController', pwdPolicyController);

function pwdPolicyController($scope, authDataService, $rootScope, $state, $translate, jwtHelper, messageBox) {

    if ( !sessionStorage.getItem('temp_access_token') ) {
        $state.go('auth.login');
    }

    var vm = this;

    //다음에 변경
    vm.nxtChg = function() {
        var token = sessionStorage.getItem('temp_access_token');
        var decodedToken = jwtHelper.decodeToken(token);
        sessionStorage.setItem('mbr_id', decodedToken.mbr_id);
        sessionStorage.setItem('mbr_seq', decodedToken.mbr_seq);
        sessionStorage.setItem('svc_tgt_seq', decodedToken.svc_tgt_seq);
        sessionStorage.setItem('access_token', token);
        $state.go('dashbd'); //main으로 이동
    }

    //확인
    vm.cnf = function() {
        //필수값 검증 check
        //현재 비밀번호 맞는지 체크 check
        //새 비밀번호와 새 비밀번호 확인이 같은지 체크
        //현재 비밀번호와 새 비밀번호가 다른지 체크
        //영문,숫자,특수문자 8-18자리 체크
        //아이디, 전화번호 등 개인정보 체크
        //연속적인 숫자 체크

        $scope.invalidMessage = '';
        vm.invalidNowPwd = false;
        vm.invalidNewPwd = false;
        vm.invalidNewPwdCnf = false;

        //필수값 검증
        var validation = true;
        if ( !vm.nowPwd ) {
            vm.invalidNowPwd = true;
            validation = false;
        }
        if ( !vm.newPwd ) {
            vm.invalidNewPwd = true;
            validation = false;
        }
        if ( !vm.newPwdCnf ) {
            vm.invalidNewPwdCnf = true;
            validation = false;
        }

        if ( validation ) {
            var result = true;
            var newPwd = vm.newPwd;
            var token = sessionStorage.getItem('temp_access_token');
            var decodedToken = jwtHelper.decodeToken(token);

            var userInfo = {
                grant_type: 'password',
                username: decodedToken.mbr_id,
                password: vm.nowPwd
            };
            //현재 비밀번호 맞는지 체크
            authDataService.gwLogin(userInfo)
                .then(function(resp){
                    //현재 비밀번호와 새 비밀번호가 같은지 체크
                    if ( vm.nowPwd === newPwd ) {
                        result = false;
                        $scope.invalidMessage = $translate.instant("comm.eMsgMtchNowPwdNewPwd");
                        return;
                    }
                    //새 비밀번호와 새 비밀번호 확인이 다른지 체크
                    if ( newPwd != vm.newPwdCnf ) {
                        result = false;
                        $scope.invalidMessage = $translate.instant("comm.eMsgNtMtchNewPwdNewPwdCf");
                        return;
                    }
                    //영문,숫자,특수문자 8-18자리 체크, 연속적인 숫자 체크
                    var regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]{4,}).{8,18}/;
                    result = regex.test(newPwd);
                    if ( !result ) {
                        $scope.invalidMessage = $translate.instant("comm.eMsgUseFaluPwd");
                        return;
                    }

                    //아이디, 전화번호 등 개인정보 체크
                    var param = 'mbrId='+decodedToken.mbr_id+'&mbrSeq='+decodedToken.mbr_seq;
                    authDataService.findMbrId(param)
                        .success(function(resp) {
                            if ( resp.responseCode === '200' && resp.data.total > 0 ) {
                                var mbrInfo = resp.data.rows[0];
                                //아이디, 전화번호 등 개인정보 체크
                                if ( vm.newPwd.indexOf(mbrInfo.telNo) > -1 || vm.newPwd.indexOf(mbrInfo.mbrId) > -1 ) {
                                    result = false;
                                    $scope.invalidMessage = $translate.instant("comm.eMsgUseFaluPwd");
                                    return;
                                }
                                if ( result ) {
                                    var param = {
                                        oldMbrPwd: vm.nowPwd,
                                        mbrPwd: newPwd,
                                        tmpPwdIssYn: 'N'
                                    };
                                    authDataService.changeUserPwd(param)
                                        .success(function (data) {
                                            if ( data.responseCode === '200' ) {
                                                messageBox.open($translate.instant("comm.eMsgPwdChged"), {
                                                    type: "info"
                                                });
                                                $state.go('auth.login');
                                            }
                                        }).error(function (data) {
                                        console.log("API Service Error : " + data.status + " " + data.error);
                                    });
                                }
                            } else {
                                result = false;
                            }
                        })
                        .error(function(error){
                            console.log("API Service Error : " + error.status + " " + error.error);
                            result = false;
                        });
                }, function(error) {
                    result = false;
                    $scope.invalidMessage = $translate.instant("comm.eMsgNtMtchNowPwd");
                });
        }

    }
}