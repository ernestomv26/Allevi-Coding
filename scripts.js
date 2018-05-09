(function($) {
	$.extend({
		tablesorterPager: new function() {

			function updatePageDisplay(c) {
				var s = $(c.cssPageDisplay,c.container).val((c.page+1) + c.seperator + c.totalPages);
			}

			function setPageSize(table,size) {
				var c = table.config;
				c.size = size;
				c.totalPages = Math.ceil(c.totalRows / c.size);
				c.pagerPositionSet = false;
				moveToPage(table);
				fixPosition(table);
			}

			function fixPosition(table) {
				var c = table.config;
				if(!c.pagerPositionSet && c.positionFixed) {
					var c = table.config, o = $(table);
					if(o.offset) {
						c.container.css({
							top: o.offset().top + o.height() + 'px',
							position: 'absolute'
						});
					}
					c.pagerPositionSet = true;
				}
			}

			function moveToFirstPage(table) {
				var c = table.config;
				c.page = 0;
				moveToPage(table);
			}

			function moveToLastPage(table) {
				var c = table.config;
				c.page = (c.totalPages-1);
				moveToPage(table);
			}

			function moveToNextPage(table) {
				var c = table.config;
				c.page++;
				if(c.page >= (c.totalPages-1)) {
					c.page = (c.totalPages-1);
				}
				moveToPage(table);
			}

			function moveToPrevPage(table) {
				var c = table.config;
				c.page--;
				if(c.page <= 0) {
					c.page = 0;
				}
				moveToPage(table);
			}


			function moveToPage(table) {
				var c = table.config;
				if(c.page < 0 || c.page > (c.totalPages-1)) {
					c.page = 0;
				}

				renderTable(table,c.rowsCopy);
			}

			function renderTable(table,rows) {

				var c = table.config;
				var l = rows.length;
				var s = (c.page * c.size);
				var e = (s + c.size);
				if(e > rows.length ) {
					e = rows.length;
				}


				var tableBody = $(table.tBodies[0]);

				// clear the table body

				$.tablesorter.clearTableBody(table);

				for(var i = s; i < e; i++) {

					//tableBody.append(rows[i]);

					var o = rows[i];
					var l = o.length;
					for(var j=0; j < l; j++) {

						tableBody[0].appendChild(o[j]);

					}
				}

				fixPosition(table,tableBody);

				$(table).trigger("applyWidgets");

				if( c.page >= c.totalPages ) {
        			moveToLastPage(table);
				}

				updatePageDisplay(c);
			}

			this.appender = function(table,rows) {

				var c = table.config;

				c.rowsCopy = rows;
				c.totalRows = rows.length;
				c.totalPages = Math.ceil(c.totalRows / c.size);

				renderTable(table,rows);
			};

			this.defaults = {
				size: 10,
				offset: 0,
				page: 0,
				totalRows: 0,
				totalPages: 0,
				container: null,
				cssNext: '.next',
				cssPrev: '.prev',
				cssFirst: '.first',
				cssLast: '.last',
				cssPageDisplay: '.pagedisplay',
				cssPageSize: '.pagesize',
				seperator: "/",
				positionFixed: true,
				appender: this.appender
			};

			this.construct = function(settings) {

				return this.each(function() {

					config = $.extend(this.config, $.tablesorterPager.defaults, settings);

					var table = this, pager = config.container;

					$(this).trigger("appendCache");

					config.size = parseInt($(".pagesize",pager).val());

					$(config.cssFirst,pager).click(function() {
						moveToFirstPage(table);
						return false;
					});
					$(config.cssNext,pager).click(function() {
						moveToNextPage(table);
						return false;
					});
					$(config.cssPrev,pager).click(function() {
						moveToPrevPage(table);
						return false;
					});
					$(config.cssLast,pager).click(function() {
						moveToLastPage(table);
						return false;
					});
					$(config.cssPageSize,pager).change(function() {
						setPageSize(table,parseInt($(this).val()));
						return false;
					});
				});
			};

		}
	});
	// extend plugin scope
	$.fn.extend({
        tablesorterPager: $.tablesorterPager.construct
	});

})(jQuery);
function tableSearch() {
  var input, filter, table, tr, td, i;
  //gets the  query to search by
  input = document.getElementById("myInput");
  //makes query non-case senstive, remove line below to make it case senstive
  filter = input.value.toUpperCase();
  table = document.getElementById("jsonTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

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

function parseJSON(json) {
    //console.log(json[0])
    var headers = ["email", "serial","Dead Percent", "elasticity", "Live Percent",
    "Cl Duration","Cl Enabled", "Cl Intensity", "Input", "Output", "Extruder 1",
    "Extruder 2", "Layer Height", "Layer Number", "Wellplate"];
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
        //var table = document.getElementById("jsonTable")
        tr = document.createElement('tr');
            for (var j = 0; j < printArray.length; j++) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(printArray[j]))
                tr.appendChild(td)
            }
        body.appendChild(tr)
    }
    $(document).ready(function () {
        $(document.getElementById("loading")).remove();
        jsonTable.appendChild(body);
        //jsonTable.setAttribute('class', 'sortable');
        var table = $('#jsonTable').DataTable({
            //scrollY: window.innerHeight*.65,
            deferRender: true,
            //scroller: true,
            initComplete : function() {
                $("#jsonTable_filter").detach()
            }
        });
        $('#myInputTextField').keyup(function(){
            table.search($(this).val()).draw();
        });
    });


}
