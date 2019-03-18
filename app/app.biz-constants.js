angular.module('app')
/**
 * 비즈 API URL
 * */
    .constant("adminConstant", {
        "authPath"         : "http://112.175.172.107",
        "portalPath"       : "http://112.175.172.107/portalapi/v1/",
        "contextPathV1"    : "http://112.175.172.107/api/v1/",
        "contextPathV11"   : "http://112.175.172.107/api/v1.1/"
    })
    .constant("coreConstant", {
        "corePath"         : "http://112.175.172.107/coreapi/v1.1/",
        "contextPathV1"    : "http://112.175.172.107/api/v1/",
        "contextPathV11"   : "http://112.175.172.107/api/v1.1/"
    })
    .constant('messageType', {
        warning  : "warning",
        normal   : undefined,
        info     : "info",
        success  : "success"
    });
