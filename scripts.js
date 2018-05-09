/*
Builds a table using JSON data that turns the json into arrays, then each row
is appended into the table and then the datatables package is called to
add pagination and sorting to the table
*/

//access the json file and turns it into an array of json objects
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'allevi-data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

loadJSON(function(response) {
    var json = JSON.parse(response);
    parseJSON(json)
    //console.log(obj.response)
});
//turn each json element into an array that gets turned into table rows
function parseJSON(json) {
	//creates the headers for the table
    var headers = ["Email", "Serial Number","Dead Percent", "Elasticity (kPa)",
	 "Live Percent","Cl Duration (ms)","Cl Enabled", "Cl Intensity", "Input",
	 "Output", "Extruder 1", "Extruder 2", "Layer Height", "Layer Number",
	 "Wellplate"];
    var jsonTable = document.getElementById("jsonTable")
    var tr = document.createElement('tr');
    for(var k=0; k < headers.length; k++){
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(headers[k]));
        tr.appendChild(th);
    }
    var header = document.createElement("thead");
    header.appendChild(tr);
    jsonTable.appendChild(header);
    var body = document.createElement("tbody");
    for(var i = 0; i < json.length; i++){
		//puts each value from the json into an array
		var print_data = json[i].print_data;
        var deadPercent = print_data.deadPercent;
        var elasticity = print_data.elasticity;
        var livePercent = print_data.livePercent;
        var user_info = json[i].user_info;
        var email = user_info.email;
        var serial = user_info.serial;
        var printInfo = json[i].print_info;
        var clDuration = printInfo.crosslinking.cl_duration;
        var clEnabled = printInfo.crosslinking.cl_enabled;
        var clIntensity = printInfo.crosslinking.cl_intensity;
        var input = printInfo.files.input;
        var output = printInfo.files.output;
        var extruder1 = printInfo.pressure.extruder1;
        var extruder2 = printInfo.pressure.extruder2;
        var layerHeight = printInfo.resolution.layerHeight;
        var layerNum = printInfo.resolution.layerNum;
        var wellplate = printInfo.wellplate;
        var printArray = [email, serial, deadPercent, elasticity, livePercent,
        clDuration,clEnabled,clIntensity,input, output, extruder1,extruder2,
        layerHeight,layerNum,wellplate];
		//each array get puts into a row element and then appended into the table
        tr = document.createElement('tr');
            for (var j = 0; j < printArray.length; j++) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(printArray[j]))
                tr.appendChild(td)
            }
        body.appendChild(tr)
    }
	//when the document is ready, the table is rendered
    $(document).ready(function () {
		//removes the loading text when the table is done loading
        $(document.getElementById("loading")).remove();
        jsonTable.appendChild(body);
        //DataTable calls the datatables package to add features to the table
        var table = $('#jsonTable').DataTable({
            deferRender: true,
			//moves the search bar from its default spot
            initComplete : function() {
                $("#jsonTable_filter").detach()
            }
        });
		//lets the user search through the table
        $('#searchField').keyup(function(){
            table.search($(this).val()).draw();
        });
    });


}
