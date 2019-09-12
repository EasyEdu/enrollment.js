[![CircleCI](https://circleci.com/gh/EasyEdu/enrollment.js/tree/master.svg?style=svg)](https://circleci.com/gh/EasyEdu/enrollment/tree/master)

# enrollment
A JS client to allow enroll students on EasyEdu course's classes by integrating it on your sites.  
  
You can integrate this client on your course landing page for example, this way you can collect lead information, and enroll then on your EasyEdu course's class.

## Usage  

First of all, add this tag to your html page, inside the `<head>` element:
```html
  <script type="text/javascript" src="https://scripts.easyedu.co/enrollment.js"></script>
```

Then, in a script you can call:

```js
<script type="text/javascript">
  function successCallback (response) {
    window.alert('Congrats! you are now enrolled on this course! Please check the access information, on your email.');
  }

  function errorCallback (response) {
    // there are two formats of errors, please check the "API errors" section bellow in this readme file to know more:

    // in this example we handle the error messages by showing an alert to the user, but feel free to customize it to your needs, like showing a more gracefully html error element, etc:

    if (response && response.message) {
      window.alert(response.message);
    } else if (response && typeof response[0] === 'string') {
      window.alert(response[0]);
    } else {
      window.alert('Sorry but an error happened, please try again!');
    }
  }

  window.easyedu.enroll('your-class-auth-token-here', {
    email: 'new-student-email@mail.com',
    full_name: 'Full Name'
  }, successCallback, errorCallback);
</script>
  ```
  
Usually you will call this code inside a sign up form callback.

### Arguments
The first argument for the window.easyedu.enroll function is an authorization token of the class you are trying to enroll your users to. You can get the authorization token by editing the class on the EasyEdu app.  

The second argument for the window.easyedu.enroll function is JS object containing user properties:  
* email: the email of the user that will be enrolled to the class (required);  
* full_name: the full name of the user that will be enrolled to the class (optional).

The third argument for the window.easyedu.enroll function is a function that will be called when the user is sucessfully enrolled to the class. The callback will receive the request response as argument.  

The fourth argument for the window.easyedu.enroll function is a function that will be called when the enrollment request to our API gets some error as response. The callback will receive the request response as argument.  

### Client errors
 * If you don't pass the authorization key, it will raise this error: `Uncaught authKey param is missing.`  
 * If you pass a authorization token that is not a string, it will raise this error: `Uncaught authKey must be a string.`  
 * If you don't pass the user properties object, it will raise this error: `Uncaught params param is missing.`  
 * If you pass a user properties object that is not an object, it will raise this error: `Uncaught params param must be a object.`


### API errors
If the given authorization key is not valid, you will get the following error as the first argument on the errorCallback:
```js
["No class found with this auth_token"]
```

If the given user properties object does not contain a key email, you will get the following error as the first argument on the errorCallback:
```js
{ 
   "message":"Parameter is required",
   "errors":{ 
      "email":"Parameter is required"
   }
}
```

If the given user properties object contain a key email, but the value is not a valid email, you will get the following error as the first argument on the errorCallback:
```js
{ 
   "message":"Email format is invalid.",
   "errors":{ 
      "email":"Parameter must match format (?i-mx:\\A([^@\\s]+)@((?:[-a-z0-9]+\\.)+[a-z]{2,})\\z)"
   }
}
```

Last but not least, if the given user properties object contain a key email, but there is already a enrolled student in the given class with the given email, you will get the following error as the first argument on the errorCallback:

```js
["User with the given email is already enrolled to the given class"]
```

## How to collaborate

To help us on this repository, you can fork it, change it, and then send a Pull Request to us, so we can review, discuss and merge it.

## Testing

Before sending a PR, you must add and run the tests for your changes.  

First install the npm modules:  
  `$ npm install`  

To run tests on browser:  
  `$ npm test`  

To run tests on terminal:  
  `$ npm run cypress`  

## Deployment
First, you will have to add some variables to your ~/.bash_profile :  
 * AWS_ACCESS_KEY_ID  
 * AWS_SECRET_ACCESS_KEY  
 * EASYEDU_SCRIPTS_PRODUCTION_DISTRIBUTION  
 * EASYEDU_SCRIPTS_STAGING_DISTRIBUTION  

And then, to staging deploy, run:
  `$ gulp deploy`

To production deploy, run:
  `$ ENV="production" gulp deploy`
