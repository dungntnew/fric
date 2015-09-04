angular.module('app.services', [])

.factory('SharedService', function($rootScope) {
    var sharedService = {};
    sharedService.message = '';
    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };
    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;
})

.factory('Products', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var products = [{
        id: 0,
        name: 'リラックマ(ピンク水玉)',
        detail: 'みんな仲良し、ピンクの水玉が印象的なデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191656_55d436947f102.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191656_55d436947f102.jpg',
    }, {
        id: 1,
        name: 'デザイン婚姻届用アルバム',
        detail: 'デザイン婚姻届(記念用)を飾ったり保管することができる見開き型のアルバム(婚姻届は別売り)',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191649_55d4350f0ba2e.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191649_55d4350f0ba2e.jpg',
    }, {
        id: 2,
        name: 'リラックマ(ハートがいっぱい)',
        detail: '大きなハートとリラックマ達がいっぱいのデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191638_55d43263c86e6.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191638_55d43263c86e6.jpg'
    }, {
        id: 3,
        name: 'デザイン婚姻届用アルバム',
        detail: 'デザイン婚姻届(記念用)を飾ったり保管することができる見開き型のアルバム(婚姻届は別売り)',
        thumbnail: 'http://konin-todoke.com/upload/save_image/05201453_555c21620d299.jpg',
        template: 'http://konin-todoke.com/upload/save_image/05201453_555c21620d299.jpg'
    }, {
        id: 4,
        name: 'リラックマ(クローバー)',
        detail: '「幸運」の花言葉を持つ、クローバーのデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191652_55d435ac490e3.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191652_55d435ac490e3.jpg'
    }, {
        id: 5,
        name: '世界に一つの婚姻届',
        detail: '写真や名前、記念日を自由に入れられるオーダーメイドの婚姻届',
        thumbnail: 'http://konin-todoke.com/upload/save_image/06240937_5589fbacef9bc.jpg',
        template: 'http://konin-todoke.com/upload/save_image/06240937_5589fbacef9bc.jpg'
    }, {
        id: 6,
        name: 'Little Twin Stars Dreaming',
        detail: 'サンリオキャラクターの婚姻届で入籍しよう♡キキ&ララがきらめく夢のようなデザイン',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08070022_55c37ba4ba709.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08070022_55c37ba4ba709.jpg'
    }];

    return {
        all: function() {
            return products;
        },
        remove: function(product) {
            products.splice(products.indexOf(product), 1);
        },
        get: function(productId) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id === parseInt(productId)) {
                    return products[i];
                }
            }
            return null;
        }
    };
});