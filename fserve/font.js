var fonts = [{
    family: 'YasashisaGothic',
    path: 'YasashisaGothic.otf',
    faces: []
  }, {
    family: 'Desyrel',
    path: 'Desyrel.ttf',
    faces: []
  }, {
    family: 'GoudyBookletter1911',
    path: 'GoudyBookletter1911.otf',
    faces: []
  }, {
    family: 'YasashisaGothic',
    path: 'YasashisaGothic.otf',
    faces: []
  }, {
    family: 'Hannari',
    path: 'Hannari.otf',
    faces: []
  }, {
    family: 'Italianno',
    path: 'Italianno.otf',
    faces: []
  }, {
    family: 'Oswald Regular',
    path: 'Oswald Regular.ttf',
    faces: []
  }, {
    family: 'Playtime With Hot Toddies',
    path: 'Playtime With Hot Toddies.ttf',
    faces: []
  },

  {
    family: 'Print Clearly',
    path: 'Print Clearly.otf',
    faces: []
  },

  {
    family: 'Qikki Reg',
    path: 'Qikki Reg.ttf',
    faces: []
  },

  {
    family: 'Spin Cycle OT',
    path: 'Spin Cycle OT.otf',
    faces: []
  }
];
fonts.forEach(function(f) {
  f.path = __dirname + '/fonts/' + f.path;
});

exports.load = function() {
  f = [];
  f.push(fonts[0]);
  return fonts;
};