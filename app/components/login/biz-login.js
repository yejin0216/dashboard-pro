angular.module('app.auth')
    .controller('LoginController', LoginController);

function LoginController($scope, authDataService, $rootScope, $state, jwtHelper, $stateParams, $translate, messageBox) {

    $('#dashbdView').removeClass('change').addClass('login');
    $('.header').removeClass('showDisplay').addClass('noDisplay');
    //sessionStorage.removeItem('temp_access_token');

    var vm = this;
    vm.savedId = false;
    vm.invalidId = false;
    vm.invalidPwd = false;

    //로그인
    vm.login = function() {
        //아이디 기억하기
        if ( vm.savedId ) {
            localStorage.setItem('saved_id', vm.userId)
        }
        //로그인
        if ( validationInputValue() ) {
            var userInfo = {
                grant_type: 'password',
                username: vm.userId,
                password: vm.userPwd
            };
            authDataService.gwLogin(userInfo)
                .then(function(resp){
                    var token = resp.data.access_token;
                    if ( token ) {
                        sessionStorage.setItem('client_token', token);
                        var decodedToken = jwtHelper.decodeToken(token);

                        //라이선스 유효성 검증
                        userInfo.svcTgtSeq = decodedToken.svc_tgt_seq;
                        userInfo.mbrSeq = decodedToken.mbr_seq;
                        userInfo.mbrId = decodedToken.mbr_id;
                        authDataService.verifyBizLicense(userInfo) //비즈 사용자 인증
                            .then(function(response) {
                                if ( response.data && response.data.responseCode == '200' ) {
                                    if ( response.data.data.loginYn === 'N' ) {
                                        $scope.invalidMessage = $translate.instant('comm.eMsgIdNotExistError'); //아이디나 패스워드를 다시 확인하세요.
                                    } else {
                                        //정상 로그인
                                        sessionStorage.setItem('access_token', token);
                                        sessionStorage.setItem('mbr_id', decodedToken.mbr_id);
                                        sessionStorage.setItem('mbr_seq', decodedToken.mbr_seq);
                                        sessionStorage.setItem('svc_tgt_seq', decodedToken.svc_tgt_seq);
                                        sessionStorage.setItem('rmnd_dt', response.data.data.rmndDt);
                                        $state.go('dashbd'); //main으로 이동
                                    }
                                }
                            });
                    }
                }, function(error) {
                    //로그인 실패
                    $scope.invalidMessage = $translate.instant('comm.eMsgIdNotExistError'); //아이디나 패스워드를 다시 확인하세요.
                    vm.userPwd = '';
                });
        }
    }

    // 로그인 유효성 검증
    function validationInputValue() {
        var returnValue = true;
        if ( !vm.userId ) {//아이디
            vm.invalidId = true;
            returnValue = false;
        }
        if ( !vm.userPwd ) {//비밀번호
            vm.invalidPwd = true;
            returnValue = false;
        }
        if ( !checkBeforeLogin() ) { //reCaptcha2
            $scope.invalidMessage = $translate.instant('comm.eMsgRecaptchaError'); //reCAPCHA를 선택한 뒤 로그인해주세요.
            returnValue = false;
        }
        return returnValue;
    }

    // 라이선스 정보 안내로 이동
    vm.moveLcnsInfoPage = function() {
        window.open('http://iotmakers.kt.com/openp/index.html#/license', '_blank');
    }

    /**
     * 로그인 페이지 기본정보 세팅
     */
    $(document).ready(function(){
        //다국어코드 세팅
        if ( !localStorage.getItem('langCd') ) {
            var gLangCd = (navigator.language || navigator.userLanguage);
            if ( gLangCd.toUpperCase().indexOf('KO') > -1 ) {
                gLangCd = 'KOR';
            } else {
                gLangCd = 'ENG';
            }
            localStorage.setItem('langCd', gLangCd);
        }
        $translate.use(localStorage.getItem('langCd'));

        //아이디 기억 여부
        var savedId = localStorage.getItem('saved_id');
        if ( savedId ) {
            vm.userId = savedId;
            vm.savedId = true;
        }

        //Access Token 확인
        if ( $rootScope.access_token ) {
            $state.go('dashbd');
        } else {
            $rootScope.access_token = null;
            sessionStorage.clear();
        }
    });

}