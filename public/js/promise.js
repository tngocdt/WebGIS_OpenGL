function fetchJSONFile(path, callback) {
    var delayInMilliseconds = 50; //1 second
    setTimeout(function() {
        //your code to be executed after 1 second
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    console.log('fetchJSONFile ajax data: ',JSON.stringify(data));
                    // alert(JSON.stringify(data));
                    //alert("go ajax");
                    // tasks=data;
                    if (callback) callback(data);
                    return (data);//data;
                }
            }
        };
        httpRequest.open('get', path);
        httpRequest.send(); 
        }, delayInMilliseconds);
    }

var url= "http://localhost:1880/{{{payload.url}}}"

// var rs="";
// var tasks;
// var gantt_chart;

    var firstMethod = function() {
    return new Promise(function(resolve, reject){
    setTimeout(function() {
    console.log('first method completed');
        //--code here- start
    let userurl=url;
    fetchJSONFile(userurl, function(data){});
        //--code here-end
        
    resolve();
    //- });
    }, 10);
    });
    };
    var secondMethod = function(someStuff) {
    var promise = new Promise(function(resolve, reject){
    setTimeout(function() {
    console.log('second method completed');
    //do 
    
    //--code here- start

    //--code here-end
    
    resolve();
    }, 100);
    });
    return promise;
    };
    var thirdMethod = function(someStuff) {
    var promise = new Promise(function(resolve, reject){
    setTimeout(function() {

    //--code here- start
  
    //--code here-end
    console.log('All method completed');
    
    resolve();
    }, 500);
    });
    return promise;
    };

    

    firstMethod()
    .then(secondMethod)
    .then(thirdMethod);
