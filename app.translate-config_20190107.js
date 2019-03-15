(function() {
  angular
    .module('app')
    .config(translateConfig)
      .factory('customLoader', function ($http, $q) {
        return function (options) {
          return $q.defer().promise;
        }
      });

  function translateConfig($translatePartialLoaderProvider, $translateProvider) {
    $translatePartialLoaderProvider.addPart('comm_code');
    $translatePartialLoaderProvider.addPart('comm_msg');

    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'assets/translation/{lang}/locale_{part}.json'
    });
    
    if (localStorage.getItem('langCd')) {
      $translateProvider.preferredLanguage(localStorage.getItem('langCd'));
    } else{
      $translateProvider.preferredLanguage('KOR');
    }
  }
})();