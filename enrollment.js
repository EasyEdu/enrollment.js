window.easyEdu = {
  enroll: (authKey, params, sucessCallback, errorCallback) => {
    if (!authKey || typeof authKey !== "string") throw "Auth key for EasyEdu class is missing, please pass it as first argument, it must be a string."
    if (!params || typeof params !== "object") throw "Params object is missing, please pass it as second argument, it must be an object."

    let req = new XMLHttpRequest()
    let reqPayload = Object.assign(params, { auth_token: authKey })

    const onError = (e) => {
      errorCallback && errorCallback(JSON.parse(e.currentTarget.response))
    }

    req.addEventListener("load", (e) => {
      if (e.currentTarget.status == 200) {
        sucessCallback && sucessCallback(JSON.parse(e.currentTarget.response))
      } else {
        onError(e)
      }
    })

    req.addEventListener("error", (e) => { onError(e) })

    req.open("POST", "http://localhost:9292/classes/enroll")
    req.send(JSON.stringify(reqPayload))
  }
}