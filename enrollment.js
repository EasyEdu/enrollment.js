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
    var reqPayload = params;

    function onError(e) {
      errorCallback && errorCallback(JSON.parse(e.currentTarget.response));
    }

    function onSuccess(e) {
      sucessCallback && sucessCallback(JSON.parse(e.currentTarget.response));
    }

    req.addEventListener("error", onError);
    req.addEventListener("load", function (e) {
      if (e.currentTarget.status == 200) {
        onSuccess(e);
      } else {
        onError(e);
      }
    })

    req.open("POST", "http://localhost:9292/classes/enroll");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(reqPayload));
  }

  window.easyedu = window.easyedu || {
    enroll: function () {
      enroll.apply(this, arguments);
    }
  }
})();
