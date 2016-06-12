'use strict';


function URLService () {


    this.shortenUrl = function (req, res) {
        var data = req.params.data;
        //TODO do shortening
        res.json(data);
    };

}

module.exports = URLService;