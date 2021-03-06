# Angular-Notes-App

<img src="http://www.edrodriguez.com/notes/img/readme/icon.png?v1" width="64" height="64" align="left" style="margin:0px 20px 10px 0px" />

A notes application built with **AngularJS** using **Firebase** for the backend. **[Angular Material](https://material.angularjs.org/)** (an implementeation Google's Material Design Specification) was used for the frontend user interface.

<div style="clear:both"></div>

&nbsp;

## Demos

The following demos display how the application can be hosted on static servers without any databases.

1. [View Demo &raquo;](http://www.edrodriguez.com/notes/#/signup)  
_(Amazon S3 Hosting)_

2. [View Demo &raquo;](http://rockrockinit.github.io/angular-notes-app/#signup)  
_(GitHub Pages Hosting)_

##Overview

This application works responsively on both mobile and desktop browsers. It encrypts user notes and [saves](https://www.firebase.com/docs/web/guide/saving-data.html) them them to reference objects using the [Firebase API](https://www.firebase.com/docs/web/api/). Users are also managed through Firebase with their simple [Email & Password Authentication](https://www.firebase.com/docs/web/guide/login/password.html) feature.

[![Mobile Screenshot](http://www.edrodriguez.com/notes/img/readme/screenshot.png?v1)](http://www.edrodriguez.com/notes/#/signup)

### Tested Browsers

![Chrome](http://www.edrodriguez.com/img/icons/chrome.png)&nbsp;&nbsp;
![FireFox](http://www.edrodriguez.com/img/icons/firefox.png)&nbsp;&nbsp;
![Internet Explorer](http://www.edrodriguez.com/img/icons/ie.png)&nbsp;&nbsp;
![Safari](http://www.edrodriguez.com/img/icons/safari.png)&nbsp;&nbsp;
![Opera](http://www.edrodriguez.com/img/icons/opera.png)&nbsp;&nbsp;

### Features
This application is currently in beta. As new features are completed, they will be listed here. At the moment, you can **add**, **edit** and **delete** notes. I also added an **export** feature which exports the application data to json. This feature was essential, since the data schema has been in a constant flux during development.

There is a simple **search** feature if you have a lot of notes. The search feature currently only searches by note name. Below is a code snippet of the simple search logic.

```js
$scope.hide = function(note){
  if($scope.search){
    var regexp = new RegExp($scope.search, 'gi');
    return !regexp.test(note.name);
  }
  return false;
};
```

### Dependencies

Dependencies are managed via bower. Here is a list of the main dependencies:

* [angular](https://code.angularjs.org/1.5.0/docs/api) *1.5.0*
* [firebase](https://www.firebase.com/docs/web/api/) *2.2.1*
* [crypto-js](http://cryptojs.altervista.org/api/) *3.1.12*
* [angular-material](https://material.angularjs.org/latest/api/) *1.0.5*
* [angular-material-icons](https://klarsys.github.io/angular-material-icons/) *0.6.0*
* [jquery](https://api.jquery.com/) *1.12.0*
* [moment](http://momentjs.com/docs/) *2.11.1*
* [underscore](http://underscorejs.org/) *1.8.3*

Use the following commands to install all dependancies & build sources:

```sh
$ npm install
$ bower install
$ gulp build
```

### License

MIT

<br />

## About Me
<a href="http://www.edrodriguez.com/"><img src="http://www.edrodriguez.com/img/icons/ed.png" align="left" style="margin:0px 40px 10px 0px" /></a>
I am a Web Developer with experience in building both web and mobile solutions. This project allowed me to explore integrating a BaaS solution like [Firebase](https://www.firebase.com/docs/web/api/) with a web application framework like [AngularJS](https://code.angularjs.org/1.5.0/docs/api).

[![LinkedIn](http://www.edrodriguez.com/img/icons/linkedin.gif)](https://www.linkedin.com/in/edhome)
[![Twitter](http://www.edrodriguez.com/img/icons/twitter.gif)](https://twitter.com/edwinrodriguez)
[![Facebook](http://www.edrodriguez.com/img/icons/facebook.gif)](https://www.facebook.com/ed.home)
[![Instagram](http://www.edrodriguez.com/img/icons/instagram.gif)](https://www.instagram.com/rockrockinit/)

<br />
<br />
