# FreeCodeCamp URL shortener MicroService

[![Build Status](https://travis-ci.org/ferzerkerx/fcc-url-shortener-ms.svg?branch=master)](https://travis-ci.org/ferzerkerx/fcc-url-shortener-ms)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fcc-url-shortener-ms&metric=alert_status)](https://sonarcloud.io/dashboard?id=fcc-url-shortener-ms)

[Click](https://www.freecodecamp.com/challenges/url-shortener-microservice) For More Information


## Run locally
```
./build.sh && docker-compose up
```
## Test locally
```
curl http://localhost:3000/new/http://wwww.some-domain.com
```

Shortened url Response:
```
{
    "original_url":"http://wwww.some-domain.com",
    "short_url":"http://localhost:3000/C44U9lL"
}
```

Use shortened Url
```
curl http://localhost:3000/C44U9lL
```
Enlarged url Response:
```
Found. Redirecting to http://wwww.some-domain.com 
```