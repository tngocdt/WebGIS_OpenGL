function showResult(strSearchedValue) {        
    if (strSearchedValue.length==0) {
        document.getElementById("idLiveSearch").innerHTML = "";
        document.getElementById("idLiveSearch").style.border="Opx";
        return;    
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            // console.log(this.responseText);
            document.getElementById("idLiveSearch").innerHTML = this.responseText;
	        document.getElementById("idLiveSearch").style.border = "1px solid #A5ACB2";
        }
    }

    xmlhttp.open("GET", "api/geoserver/WebGISDBdev/livesearch?strSearchedValue=" + strSearchedValue);
    xmlhttp.send(null);
}