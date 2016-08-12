function HttpUtil() {

}

HttpUtil.getData = function(url, params, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    data: params,
    error: function errorHandler(jqXHR, textStatus, errorThrown) {
      alert("Error");
      callback();
    },
    success: function successHandler(data, status, xhr) {
      callback(data)
    }
  });
};

HttpUtil.postData = function(url, params, callback) {
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    data: JSON.stringify(params),
    error: function errorHandler(jqXHR, textStatus, errorThrown) {
      alert("Error");
      callback();
    },
    success: function successHandler(data, status, xhr) {
      callback(data)
    }
  });
};

HttpUtil.putData = function(url, params, callback) {
  $.ajax({
    url: url,
    type: 'PUT',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    data: JSON.stringify(params),
    error: function errorHandler(jqXHR, textStatus, errorThrown) {
      alert("Error");
      callback("Error");
    },
    success: function successHandler(data, status, xhr) {
      callback(data)
    }
  });
};

HttpUtil.deleteData = function(url, params, callback) {
  $.ajax({
    url: url,
    type: 'DELETE',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    data: JSON.stringify(params),
    error: function errorHandler(jqXHR, textStatus, errorThrown) {
      alert("Error");
      callback("Error");
    },
    success: function successHandler(data, status, xhr) {
      callback(data)
    }
  });
};