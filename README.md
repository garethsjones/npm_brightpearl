A fairly simple client for making RESTy calls to your [Brightpearl API](https://www.brightpearl.com/).

## Quick example

```js
var Brightpearl = require('brightpearl');

var datacenter = 'eu1',
    accountId = 'acme',
    appRef = 'acme_app',
    token = 'xxxxxxxx';

var bp = Brightpearl(datacenter, accountId, appRef, token);

bp.call('GET', '/warehouse-service/warehouse/4', null, function(error, httpStatus, response){

    if (error) {
        return console.error(error);
    }

    console.log('Status: ' + httpStatus);
    console.log(response);
});
```

### Example output

```bash
$ node index.js
Status: 200
[ { name: 'Finishing Warehouse',
    id: 4,
    address:
     { addressId: 215,
       customerId: 0,
       streetAddress: '66 Wells',
       postcode: 'CA11 3HT',
       city: 'Cardiff',
       state: 'Wales',
       countryId: 237,
       countryIsoCode2: 'GB' } } ]
```

## Installation

```bash
$ npm install brightpearl
```

## Features

  * Takes care of request back-off & retry when the [rate limit](https://www.brightpearl.com/support/documentation/request-throttling) is hit
  * Makes maximum use of each request by combining up to 10 destructive actions in each [multi-message](https://www.brightpearl.com/support/documentation/multi-message)
  
## Brightpearl resources

  * [Brightpearl website](https://www.brightpearl.com/)
  * [Brightpearl API support](https://www.brightpearl.com/support/documentation/api-developer)
  * [Brightpearl API docs](https://www.brightpearl.com/developer/latest/)
  
## Usage

### Prerequisites

  * A live [Brightpearl](https://www.brightpearl.com/) account (not a trial account)
  * [A private app installed](https://www.brightpearl.com/support/documentation/creating-app-single-account-private)

### Constructor params

  * datacenter - Brightpearl data center code (eu1)
  * accountId - Brightpearl account ID
  * appRef - Private app reference
  * token - Private app token
  
### Basic calls

```js
brightpearl.call(method, path, body, callback);
```
  * method - GET/POST/PUT/DELETE/PATCH/OPTIONS
  * path - path to resource
  * body - JSON request body or null
  * callback - callback function (see below)
  
The callback will be called with the following params:

  * error - error message or null
  * httpStatus - HTTP response code for request
  * body - JSON HTTP response body
  
### Multi-message

```js
multimessage = brightpearl.multiMessage(mode, onFail);
```

  * mode - processing mode (SEQUENTIAL or PARALLEL)
  * onFail - on-fail behaviour (STOP or CONTINUE)
  
A multi-message client exposes the same .call() method as above 
but it waits until it has been called 10 times before dispatching 
all 10 requests as a single multi-message request. The pending 
requests are flushed every 5 seconds to prevent hanging in systems 
making few requests.

When multi-message requests are finished you can call .close() which 
will flush any pending requests and cause any further incoming 
requests to be made immediately.

## License

  [MIT](LICENSE)
  
## Disclaimer

This package was originally intended for personal use and as 
such was not designed to meet every possible use case for the 
Brightpearl API nor has it been thoroughly tested but it has been 
used in anger to great success.

I am little more than a hobbyist when it comes to Node and this 
is my first published NPM package so I can only apologise if 
anything is hard to follow due to failure to follow convention.

If you have any questions about usage/updates/etc feel free to 
get in touch.