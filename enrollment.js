(function () {
  function validateParam(value, kind, name) {
    if (!value) throw(name + " param is missing.");
    if (typeof value !== kind) throw(name + " must be a " + kind + ".");
  }

  function enroll(authKey, params, sucessCallback, errorCallback) {
    validateParam(authKey, "string", "authKey");
    validateParam(params, "object", "params");

    var req = new XMLHttpRequest();
    var reqPayload = Object.assign(params, { auth_token: authKey });

    function onError(e) {
      errorCallback && errorCallback(JSON.parse(e.currentTarget.response));
    }

    function onSucces(e) {
      sucessCallback && sucessCallback(JSON.parse(e.currentTarget.response));
    }

    req.addEventListener("error", onError);
    req.addEventListener("load", function (e) {
      if (e.currentTarget.status == 200) {
        onSucces(e);
      } else {
        onError(e);
      }
    })

    req.open("POST", "https://api.easyedu.co/classes/enroll");
    req.send(JSON.stringify(reqPayload));
  }

  window.easyedu = window.easyedu || {
    enroll: function () {
      enroll.apply(this, arguments);
    }
  }
})();
