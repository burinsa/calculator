let dist = document.getElementById('outText');
//let adFr = document.getElementById('from').value;
//let adTo = document.getElementById('to').value;
let liftFrom = document.getElementById('elevator-from');
let liftTo = document.getElementById('elevator-to');
let form = document.querySelector('.form');
let btnNext = document.getElementById("nextBtn");
//let btnSubmit = document.getElementById('btn-submit');
let btnPrev = document.getElementById("prevBtn");


let addressFrom = document.querySelector('.address-start__value');
let addressTo = document.querySelector('.address-end__value');
var zaMkad;

ymaps.ready(init);
let suggestViewFrom, suggestViewTo;
var myMap
var moscowPolygon, myRoute;

function init() {
    myMap = new ymaps.Map("map", {
            center: [55.73, 37.75],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),
        moscowPolygon;

        suggestViewFrom = new ymaps.SuggestView('from');
        suggestViewTo = new ymaps.SuggestView('to');



        // form.addEventListener('submit', (e) => {
        //     e.preventDefault();
        form.onchange = function(e) {

                        // точка отправления
      const from = document.getElementById('from').value; 
      // адрес доставки
      const to = document.getElementById('to').value;

      if(myMap) {
        myMap.destroy();
        myMap = null
      }

      myMap = new ymaps.Map("map", {
        center: [55.73, 37.75],
        zoom: 9
    }, {
        searchControlProvider: 'yandex#search'
    }),
    moscowPolygon;
      // // точка отправления
      // const from = document.getElementById('from').value; 
      // // адрес доставки
      // const to = document.getElementById('to').value;
      addressFrom.textContent = from;
      addressTo.textContent = to;

    function onPolygonLoad (json) {

        moscowPolygon = new ymaps.Polygon(json.coordinates);
        // Если мы не хотим, чтобы контур был виден, зададим соответствующую опцию.
        moscowPolygon.options.set('visible', false);
        // Чтобы корректно осуществлялись геометрические операции
        // над спроецированным многоугольником, его нужно добавить на карту.
        myMap.geoObjects.add(moscowPolygon);
        
        ymaps.route([from, to]).then(
            function (res) {

          var points = res.getWayPoints(),
          lastPoint = points.getLength() - 1;
          // Задаем стиль метки - иконки будут красного цвета, и
          // их изображения будут растягиваться под контент.
          points.options.set('preset', 'islands#redStretchyIcon');
          // Задаем контент меток в начальной и конечной точках.
          points.get(0).properties.set('iconContent', 'Точка отправления');
          points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');
              
                // Объединим в выборку все сегменты маршрута.
                var pathsObjects = ymaps.geoQuery(res.getPaths()),
                    edges = [];
                    
                // Переберем все сегменты и разобьем их на отрезки.
                pathsObjects.each(function (path) {
                    var coordinates = path.geometry.getCoordinates();
                    for (var i = 1, l = coordinates.length; i < l; i++) {
                        edges.push({
                            type: 'LineString',
                            coordinates: [coordinates[i], coordinates[i - 1]]
                        });
                    }
                });
                
                // Создадим новую выборку, содержащую:
                // - отрезки, описываюшие маршрут;
                // - начальную и конечную точки;
                // - промежуточные точки.
                var routeObjects = ymaps.geoQuery(edges)
                        .add(res.getWayPoints())
                        // .add(res.getViaPoints())
                        .setOptions('strokeWidth', 3)
                        .addToMap(myMap),
                    // Найдем все объекты, попадающие внутрь МКАД.
                    objectsInMoscow = routeObjects.searchInside(moscowPolygon),
                    // Найдем объекты, пересекающие МКАД.
                    boundaryObjects = routeObjects.searchIntersect(moscowPolygon);
                    // let lastBoundary = boundaryObjects.get(0);
                    // console.log(boundaryObjects.getLength());
                    // console.log(routeObjects);
                // Раскрасим в разные цвета объекты внутри, снаружи и пересекающие МКАД.
                boundaryObjects.setOptions({
                    // strokeColor: '#06ff00',
                    preset: 'islands#greenIcon'
                });
                objectsInMoscow.setOptions({
                    // strokeColor: '#ff0005',
                    preset: 'islands#redStretchyIcon'
                });

               

                
                let lastWay = routeObjects.remove(objectsInMoscow).remove(boundaryObjects);
                // Объекты за пределами МКАД получим исключением полученных выборок из
                // исходной.
                // console.log(lastWay._objects[0].geometry._bounds[0]);

                /////// получаем расстояние за МКАДом
                var points = [];
                for (var i = 0; i < lastWay._objects.length; i++) {
                    points.push(
                      lastWay._objects[i].geometry._bounds[0]
                    );
                }
                var lineStringGeometry = new ymaps.geometry.LineString(points),
                    geoObject = new ymaps.GeoObject({
                        geometry: lineStringGeometry
                    });
                myMap.geoObjects.add(geoObject);
                zaMkad = Math.round((geoObject.geometry.getDistance()) / 1000);
                // console.log(zaMkad);
                dist.value = zaMkad;

                    ////////
                var geopoint = new ymaps.GeoObject({
                  // Описание геометрии.
                  geometry: {
                      type: "Point",
                      coordinates: lastWay._objects[0].geometry._bounds[0]
                  },
                  // Свойства.
                  properties: {
                      // Контент метки.
                      iconContent: 'Тут МКАД'
                      // hintContent: 'Ну давай уже тащи'
                  }
              }, {
                  // Опции.
                  // Иконка метки будет растягиваться под размер ее содержимого.
                  preset: 'islands#blackStretchyIcon',
                  // Метку можно перемещать.
                  draggable: false
              });
                  ymaps.geoQuery(geopoint).addToMap(myMap);

                  // ////
              
                // ..........///

                // тут пробую

                var myGeoObjects = new ymaps.GeoObjectCollection({}, {
                  preset: "islands#redStretchyIcon",
                  geodesic: true
              });


              var geopointEnd = new ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                    type: "Point",
                    coordinates: lastWay._objects[lastWay._objects.length - 1].geometry._bounds[0]
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    iconContent: 'Точка прибытия'
                    // hintContent: 'Ну давай уже тащи'
                }
            }, {
                // Опции.
                // Иконка метки будет растягиваться под размер ее содержимого.
                preset: 'islands#redStretchyIcon',
                // Метку можно перемещать.
                draggable: false
            });

            var geopointStart = new ymaps.GeoObject({
              // Описание геометрии.
              geometry: {
                  type: "Point",
                  coordinates: objectsInMoscow._objects[0].geometry._bounds[0]
              },
              // Свойства.
              properties: {
                  // Контент метки.
                  iconContent: 'Точка отправления'
                  // hintContent: 'Ну давай уже тащи'
              }
          }, {
              // Опции.
              // Иконка метки будет растягиваться под размер ее содержимого.
              preset: 'islands#redStretchyIcon',
              // Метку можно перемещать.
              draggable: false
          });
              
              // // Добавление меток и полилинии в коллекцию.
              myGeoObjects.add(geopointEnd);
              myGeoObjects.add(geopointStart);             
              // // Добавление коллекции на карту.
              myMap.geoObjects.add(myGeoObjects);
              myMap.setBounds(myGeoObjects.getBounds(), {checkZoomRange:true, zoomMargin: 30});

              //////////

                routeObjects.remove(objectsInMoscow).remove(boundaryObjects).setOptions({
                    // strokeColor: '#0010ff',
                    preset: 'islands#redStretchyIcon'
                });
            }
        );
    }
    
    // $.ajax({
    //     url: 'https://perevozkapianinomoskva.ru/wp-content/themes/bizcraft/assets/js/mkad.json',
    //     dataType: 'json',
    //     success: onPolygonLoad
    // });

    $.ajax({
      url: 'js/mkad.json',
      dataType: 'json',
      success: onPolygonLoad
  });

    // форма

    if(e.target.name == 'type') {
        for(let royal of royals) {
          if(royal.checked) {
            royalPrice = royal.value;
            royalMin = priceMap[royal.id];
            orderTitle.textContent = "Заказ перевозки  " + nameOrderMap[royal.id];
            forteType.value = "Заказ перевозки  " + nameOrderMap[royal.id];
            console.log(priceMap[royal.id]);
            if (royal.id === 'small_koncert_215_240' || royal.id === 'big_koncert_215_240'){
              noLift = true;
            }
          }
        }
      }
    
      if(e.target.name == 'floor-from') {
        amoutFloorFrom = document.getElementById('floor-from').value;
        console.log(amoutFloorFrom);
      }
      if(e.target.name == 'floor-to') {
        amoutFloorTo = document.getElementById('floor-to').value;
        console.log(amoutFloorTo);
      }

    btnNext.classList.remove('disabled');
  };
// });


    
}
