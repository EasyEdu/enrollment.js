(function () {
  function validateParam(value, kind, name) {
    if (!value) throw(name + " param is missing.");
    if (typeof value !== kind) throw(name + " must be a " + kind + ".");
  }

  function enroll(authKey, params, sucessCallback, errorCallback) {
    validateParam(authKey, "string", "authKey");
    validateParam(params, "object", "params");

    params.auth_token = authKey;
    var req = new XMLHttpRequest();

    function onError(e) {
      errorCallback && errorCallback(parsedResponse(e.currentTarget.response));
    }

    function onSuccess(e) {
      sucessCallback && sucessCallback(parsedResponse(e.currentTarget.response));
    }

    function parsedResponse(response) {
      if (!response) { return response; }

      return JSON.parse(response);
    }

    req.addEventListener("error", onError);
    req.addEventListener("load", function (e) {
      if (e.currentTarget.status == 200) {
        onSuccess(e);
      } else {
        onError(e);
      }
    });

    req.open("POST", "http://localhost:9292/classes/enroll");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(params));
  }

  window.easyedu = window.easyedu || {
    enroll: function () {
      enroll.apply(this, arguments);
    }
  };
})();
