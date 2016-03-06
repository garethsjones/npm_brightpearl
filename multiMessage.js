var _ = require('lodash');
var uuid = require('uuid');

module.exports = function(brightpearl, processingMode, onFail) {

    var message = null;
    var callbacks = {};
    var flushed = false;

    function emptyMessage () {
        return {
            processingMode: processingMode,
            onFail: onFail,
            messages: []
        }
    }

    var call = function (method, path, postData, callback) {

        if (flushed) {
            console.log('Sending 1');
            brightpearl.call(method, path, postData, callback);
            return;
        }

        if (message == null) {
            message = emptyMessage();
        }

        var label = uuid.v4();

        message.messages.push({
            label: label,
            uri: path,
            httpMethod: method,
            body: postData
        });

        callbacks[label] = callback;

        if (message.messages.length == 10) {
            send();
        }
    };

    var send = function(){
        console.log("Sending " + message.messages.length);
        brightpearl.call('POST', '/multi-message', message, parseResponse);
        message = null;
    };

    var parseResponse = function(error, statusCode, response) {
        if (error) {
            _.each(_.values(callbacks), function(callback){
                callback(error, statusCode, null);
            });
            return;
        }

        _.each(response.processedMessages, function(messageResponse){
            var callback = callbacks[messageResponse.label];
            if (messageResponse.statusCode >= 400) {
                callback(JSON.parse(messageResponse.body.content).errors, messageResponse.statusCode, null);
            } else {
                callback(null, messageResponse.statusCode, JSON.parse(messageResponse.body.content).response);
            }
            delete callbacks[messageResponse.label];
        })
    };

    var close = function() {
        console.log('Flushing');
        flushed = true;
        clear();
        clearInterval(interval);
    };

    var clear = function(){

        if (message == null) {
            return;
        }

        if (message.messages.length > 1) {
            send();
            return;
        }

        var request = _.head(message.messages);

        console.log("Sending 1");
        brightpearl.call(request.httpMethod, request.uri, request.body, callbacks[request.label]);
        message = null;
    };

    var interval = setInterval(clear, 5000);

    return {
        call: call,
        close: close
    }
};