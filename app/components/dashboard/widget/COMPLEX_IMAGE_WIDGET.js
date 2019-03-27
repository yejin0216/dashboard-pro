angular.module('app.mydash')
    .controller('COMPLEX_IMAGE_WIDGET_SET_Ctrl', complexImageWidgetSetCtrl)
    .directive('complexImage', function ($compile, myDashService, $translate) {
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

                init();
                function init() {
                    myDashService.getComplexImageWdgtBySbjt(scope.widget)
                        .success(function(data){
                            if ( data.responseCode === '200' && data.data ) {
                                scope.imageInfo = data.data[0];
                            }
                        })
                        .finally(function () {
                            makeDom();
                        });
                }

                /**
                 * 이미지 사이즈
                 * 1) 0001 auto : original size 원본 사이즈
                 * 2) 0002 contain : fully visible 꽉 차게
                 */
                //directive dom 생성
                function makeDom() {
                    var template = '';
                    if ( scope.imageInfo ) {
                        var bgSize = scope.imageInfo.bgrdSizeCd;
                        var fontColor = scope.imageInfo.titleTextColor;
                        template  = '<div class="coverDiv" id="image_div'+wdgtSeq+'" style="background-color:'+scope.imageInfo.bgrdColor+'"></div>';
                        if ( bgSize === '0001' ) {//원본 사이즈
                            template += '<div class="imgDiv originImg" id="image_cover'+wdgtSeq+'" style="background-image:url('+scope.imageInfo.imgFilePath+');"></div>';
                        }
                        if ( bgSize === '0002' ) {//꽉 차게
                            template += '<div class="imgDiv fullImg" id="image_cover'+wdgtSeq+'" style="background-image:url('+scope.imageInfo.imgFilePath+');"></div>';
                        }
                        template += '<div class="wordDiv headerDiv" style="color:'+fontColor+'"><b>{{imageInfo.title}}</b></div>';
                        template += '<div class="wordDiv contentsDiv" style="color:'+fontColor+'">{{imageInfo.descComments}}</div>';
                        template += '<div class="wordDiv footerDiv" style="color:'+fontColor+'">{{imageInfo.tailComments}}</div>';
                    } else {
                        template = '<div class="noData transparent">'+$translate.instant('comm.eMsgNoData')+'</div>';
                    }
                    element.append(template);
                    element.html($compile(template)(scope));
                }

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, args){
                    if (args.hasOwnProperty('param')) {//위젯 설정 변경
                        scope.imageInfo = args.param;
                        makeDom();
                    }
                });
            }
        }
    });

function complexImageWidgetSetCtrl($scope, $rootScope, $modal, $modalInstance, myDashService, wdgtInfo) {

    // $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅

    function init() {
        var savedInfo = wdgtInfo.imgWdgtList;
        if ( !savedInfo || savedInfo.length === 0 ) { //저장한 정보가 없을 경우
            $scope.button = { upload:true, input:false };
            $scope.savedImageInfo = {
                fontColor:'rgba(0,0,0,1)',
                bgrdColor:'rgba(255,255,255,0)',
                bgrdSizeCd:'0001' //정비율 0001, 위젯사이즈 0002
            };
        } else { //저장한 정보가 있을 경우
            $scope.button = { upload:false, input:true };
            $scope.savedImageInfo = savedInfo[0]; //기저장한 이미지 정보
            $scope.updateBgSize(false); //이미지 사이즈 변경
        }
    }

    /**
     * 이미지 사이즈
     * 1) 0001 auto : original size 원본 사이즈
     * 2) 0002 contain : fully visible 꽉 차게
     */
    //사이즈 변경
    $scope.updateBgSize = function(t){
        if ( t ) {
            if ( $scope.savedImageInfo.bgrdSizeCd === '0001' ) {
                $scope.savedImageInfo.bgrdSize = 'contain';
                $scope.savedImageInfo.bgrdSizeCd = '0002';
            } else {
                $scope.savedImageInfo.bgrdSize = 'auto';
                $scope.savedImageInfo.bgrdSizeCd = '0001';
            }
        } else { //배경크기
            if ( $scope.savedImageInfo.bgrdSizeCd === '0001' ) {
                $scope.savedImageInfo.bgrdSize = 'auto';
            } else { //배경크기
                $scope.savedImageInfo.bgrdSize = 'contain';
            }
        }
    }

    //이미지 업로드
    var imageNm = '';
    $scope.uploadFile = function(file, errFiles) {
        //convert to base64
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            imageNm = file.name;
            $scope.savedImageInfo.imgFilePath = e.target.result;
            $scope.button.upload = false;
            $scope.button.input = true;
            $scope.$apply();
        };
        fileReader = null;
    }

    /**
     * 모달 닫기
     */
    $scope.close = function() {
        $modalInstance.close();
    };

    /**
     * 모달 저장
     */
    $scope.save = function() {
        var param = $scope.savedImageInfo;
        param.wdgtNm = '';
        param.wdgtSeq = wdgtInfo.wdgtSeq;
        param.imgFileNm = imageNm;
        param.fontColor = param.titleTextColor;
        param.mbrId = sessionStorage.getItem('mbr_id');

        myDashService.insertComplexImageWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                imageNm = null;
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {param:param});
                $rootScope.$emit('changeWdgtInfo', {/*wdgtNm:$scope.wdgtNm, */wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    };

    init();

}