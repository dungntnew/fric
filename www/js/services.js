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
        id: 6,
        name: 'Little Twin Stars Jewel',
        detail: 'キキとララのように、仲の良いふたりでいよう',
        thumbnail: ' http://konin-todoke.com/upload/save_image/08261626_55dd6a26556d4.jpg',
        template: ' http://konin-todoke.com/upload/save_image/08261626_55dd6a26556d4.jpg'
    },
    {
        id: 0,
        name: 'リラックマ(ピンク水玉)',
        detail: 'みんな仲良し、ピンクの水玉が印象的なデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191656_55d436947f102.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191656_55d4369d52dea.jpg',
    }, {
        id: 1,
        name: 'リラックマ(ハートがいっぱい)',
        detail: '大きなハートとリラックマ達がいっぱいのデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191638_55d43263c86e6.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191649_55d43517ccd65.jpg'
    }, {
        id: 2,
        name: 'リラックマ(クローバー)',
        detail: '「幸運」の花言葉を持つ、クローバーのデザイン。',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08191652_55d435ac490e3.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08191652_55d435b9bbeca.jpg'
    }, {
        id: 3,
        name: '世界に一つの婚姻届',
        detail: '写真や名前、記念日を自由に入れられるオーダーメイドの婚姻届',
        thumbnail: 'http://konin-todoke.com/upload/save_image/06240937_5589fbacef9bc.jpg',
        template: 'http://konin-todoke.com/upload/save_image/06240937_5589fbacef9bc.jpg'
    }, {
        id: 4,
        name: 'Little Twin Stars Dreaming',
        detail: 'サンリオキャラクターの婚姻届で入籍しよう♡キキ&ララがきらめく夢のようなデザイン',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08070022_55c37ba4ba709.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08071541_55c45334c0b76.jpg'
    }, {
        id: 5,
        name: 'My Melody Retro',
        detail: 'マイメロディが、結婚するふたりをお祝いする',
        thumbnail: 'http://konin-todoke.com/upload/save_image/08071650_55c4635c16d45.jpg',
        template: 'http://konin-todoke.com/upload/save_image/08071650_55c4635c16d45.jpg'
    }];
    
    var thumbnaiFakes = [
        'img/assets/products/thumbnails/08261626_55dd6a26556d4.jpg',
        'img/assets/products/thumbnails/08191656_55d436947f102.jpg',
        'img/assets/products/thumbnails/08191638_55d43263c86e6.jpg',
        'img/assets/products/thumbnails/08191652_55d435ac490e3.jpg',
        'img/assets/products/thumbnails/06240937_5589fbacef9bc.jpg',
        'img/assets/products/thumbnails/08070022_55c37ba4ba709.jpg',
        'img/assets/products/thumbnails/08071650_55c4635c16d45.jpg'
    ]
    var templateFakes = [
        'img/assets/products/templates/08261626_55dd6a26556d4.jpg',
        'mg/assets/products/templates/08191656_55d4369d52dea.jpg',
        'mg/assets/products/templates/08191649_55d43517ccd65.jpg',
        'mg/assets/products/templates/08191652_55d435b9bbeca.jpg',
        'mg/assets/products/templates/06240937_5589fbacef9bc.jpg',
        'mg/assets/products/templates/08071541_55c45334c0b76.jpg',
        'img/assets/products/templates/08071650_55c4635c16d45.jpg'
    ]
    _.each(products, function(p, i){
        p.template = templateFakes[i];
        p.thumbnail = thumbnaiFakes[i];
    })

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