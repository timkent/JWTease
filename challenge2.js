var fs = require('fs');
var express = require('express');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');

var app = express();
app.disable('x-powered-by');
app.set('etag', false);
app.use(cookieParser())

var privCert = fs.readFileSync(__dirname + '/private.pem', 'utf8');
var pubCert = fs.readFileSync(__dirname + '/public.pem', 'utf8');

var port = process.env.PORT || 8002;

var preContent = '<!DOCTYPE html>\n<html>\n  <head>\n    <title>JWTease 2</title>\n  </head>\n  <body>\n';
var postContent = '  </body>\n</html>\n';

app.get('/', function(req, res) {
  content = '    <h1>JWTease 2</h1>\n    <p>You can get a token here:<br>\n    <a href=/token>token</a></p>\n    <p>You can log in here:<br>\n    <a href=/admin>admin</a></p>\n';
  content += '    <p>You can verify your token signature with our public key available here:<br>\n    <a href=/public.pem>public.pem</a></p>\n';
  res.send(preContent + content + postContent);
});

app.get('/admin', function(req, res) {
  if (req.cookies.Authorization) {
    token = req.cookies.Authorization;
    jwt.verify(token, pubCert, { algorithms: ['HS256', 'RS256'] }, function(err, decoded) {
      if (err) {
        res.status(403).send(preContent + '    <p>Error processing token.</p>\n' + postContent);
      } else {
        if (decoded.admin) {
          res.send(preContent + '    <p>flag{UYrREPa3SbDpoK8C}</p>\n' + postContent);
        } else {
          res.send(preContent + '    <p>You are now logged in with guest privileges.</p>\n' + postContent);
        }
      }
    });
  } else {
    res.status(403).send(preContent + '    <p>No token provided.</p>\n' + postContent);
  }
});

app.get('/public.pem', function(req, res) {
  res.download(__dirname + '/public.pem');
});

app.get('/token', function(req, res) {
  const payload = {
    admin: false
  };
  var token = jwt.sign(payload, privCert, { algorithm: 'RS256', expiresIn: 60*5 });
  res.cookie('Authorization', token, { maxAge: 300000, httpOnly: true });
  res.send(preContent + '    <p>Token saved.</p>\n' + postContent);
});

app.listen(port);
