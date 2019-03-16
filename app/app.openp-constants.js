angular.module('app')
/**
 * 개방형 API URL
 * */
    .constant("adminConstant", {
        "authPath"         : "http://112.175.172.116",
        "portalPath"       : "http://112.175.172.116/portalapi/v1/",
        "contextPathV1"    : "http://112.175.172.116/api/v1/",
        "contextPathV11"   : "http://112.175.172.116/api/v1.1/"
    })
    .constant("coreConstant", {
        "corePath"         : "http://112.175.172.116/coreapi/v1.1/",
        "contextPathV1"    : "http://112.175.172.116/api/v1/",
        "contextPathV11"   : "http://112.175.172.116/api/v1.1/"
    })
    .constant('messageType', {
        warning  : "warning",
        normal   : undefined,
        info     : "info",
        success  : "success"
    });
