/**
 * 1. load() : 처음 사용자의 현재 위치를 받아온다.
 * 2. successCallback() : load()가 성공하면 실행됨.
 *  - 현재 위도, 경도와 DB에 저장된 위도, 경도를 비교하여 가장 가까운 거리의 Location을 찾는다.
 *  - loc_id에 Location._id 를 저장.
 * 3.
 *
 *
 */
$( document ).ready(function() {
  var
    result
    , cur_latitude
    , cur_longitude
    , loc_id
    , loc_name;

  setTimeout(function() {
    if (!cur_latitude || !cur_longitude) {
      $('#get_location_success_image').hide();
      $('#get_location_fail_image').show();
      alert("위치를 가져올 수 없습니다.");
    }
  }, 5000);


  function successCallback(position) {
    cur_latitude = position.coords.latitude;
    cur_longitude = position.coords.longitude;

    // TODO: 그나마 좀 가까운 Location만 가져오기
    $.ajax('/locations', {
      type: 'GET',
      async: true
    }).then( result => {
      var min_dist = 20000000;

    result.forEach( (loc) => {
      var dist = distance(cur_latitude, cur_longitude, loc.latitude, loc.longitude);
    if (dist < min_dist) {
      min_dist = dist;
      loc_id = loc._id;
      loc_name = loc.name;
    }
  });

    console.log(`closest: ${cur_latitude}, ${cur_longitude} ~ ${loc_id} : ${loc_name}`);

    setTimeout(function() {
      location.href = "/board?loc_id="+loc_id;
    }, 1000);

  });
  }


  function errorCallback(error) {
    $('#get_location_success_image').hide();
    $('#get_location_fail_image').show();
    alert(error.message);
  }

  // need authrization
  function load(){
    if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      $('#get_location_success_image').hide();
      $('#get_location_fail_image').show();
      alert("위치를 가져올 수 없습니다.");
    }
  }

  function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  load();
});

