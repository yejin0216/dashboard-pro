angular.module('app.mydash')
    .controller('COMPLEX_VIDEO_WIDGET_SET_Ctrl', complexVideoWdgtSetCtrl)
/*    .controller('COMPLEX_VIDEO_WIDGET_Ctrl', complexVideoWdgtCtrl);

function complexVideoWdgtCtrl($translate, myDashService, $scope) {

    //initialize
    $scope.getWdgtInfo = function(widget) {

        //기 저장한 목록이 있는지 조회한다.
        myDashService.getComplexImageWdgtBySbjt(widget)
            .success(function(data){
                if ( data.responseCode === '200' && data.data ) {
                    getVideoInfo(data.data[0]);
                }
            })

        //변경된 위젯설정 배포
        $scope.$on(widget.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.wdgtSize ) {//위젯 사이즈

            }
            if ( arg.param ) {
                getVideoInfo(arg.param);
            }
        });
    };

    function getVideoInfo(imageInfo) {
        $scope.imgFilePath = imageInfo.imgFilePath;
    }
}*/
    .directive('complexVideo', function ($compile, myDashService) {
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

                //복합이미지 조회
                scope.imageInfo;
                //기 저장한 목록이 있는지 조회한다.
                myDashService.getComplexImageWdgtBySbjt(scope.widget)
                    .success(function(data){
                        if ( data.responseCode === '200' && data.data ) {
                            scope.imgFilePath = data.data[0].imgFilePath;
                        }
                    })
                    .finally(function () {
                        makeDom();
                    });

                function makeDom() {
                    var template  = '<object type="text/html" id="video_'+wdgtSeq+'" width="100%" class="videoObj" height="-webkit-fill-available" data="'+scope.imgFilePath+'"></object>';
                        template += '<div ng-if="!imgFilePath" class="noData transparent">noData</div>';
                    element.append(template);
                    element.html($compile(template)(scope));
                }

                //변경된 위젯설정 배포
                scope.$on(wdgtSeq+".changeSettings", function(event, args){
                    if (args.hasOwnProperty('param')) {//위젯 설정 변경
                        scope.imgFilePath = arg.param.imgFilePath;
                        makeDom();
                    }
                });
            }
        }
    });

function complexVideoWdgtSetCtrl($scope, $rootScope, $modal, $modalInstance, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅

    //기저장한 이미지가 있을 경우
    if ( wdgtInfo.imgWdgtList && wdgtInfo.imgWdgtList.length > 0 ) {
        $scope.imgFilePath = wdgtInfo.imgWdgtList[0].imgFilePath;
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
        var param = {'wdgtNm':$scope.wdgtNm
                   , 'wdgtSeq':wdgtInfo.wdgtSeq
                   , 'imgFilePath':$scope.imgFilePath
                   , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertComplexImageWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {param:param});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    };

}