import express from 'express';
import * as apimodel from '../app/models/apimodel.js';
import * as apicontroller from '../app/controllers/apicontroller.js';

const apiRouteApp = function(app){
   
    // get a list of record from the db
    app.get('/api/GetLayerStyle', apicontroller.api_getlayerstyle);

    // add a new record to the db
    app.post('/api/kittinglocs', function(req, res, next){
        // Ninja.create(req.body).then(function(ninja){
        //     res.send(ninja);
        // }).catch(next);
        res.send({type: 'POST'});
    });

    // update a record in the db
    app.put('/api/kittinglocs/:id', function(req, res, next){
        // Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        //     Ninja.findOne({_id: req.params.id}).then(function(ninja){
        //         res.send(ninja);
        //     });
        // }).catch(next);
        res.send({type: 'PUT'});
    });

    // delete a record from the db
    app.delete('/api/kittinglocs/:id', function(req, res, next){
        // Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja){
        //     res.send(ninja);
        // }).catch(next);
        res.send({type: 'DELETE'});
    });

    app.get('/api/geoserver/WebGISDBdev/wms', apicontroller.api_geoserver_url);
    app.get('/api/geoserver/WebGISDBdev/livesearch', apicontroller.api_geoserver_livesearch);

    return app;
};

export default apiRouteApp;