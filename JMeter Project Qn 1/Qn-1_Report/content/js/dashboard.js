/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.96978851963746, "KoPercent": 0.030211480362537766};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8934333427681856, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.981404958677686, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01"], "isController": false}, {"data": [0.6783681214421252, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action"], "isController": false}, {"data": [0.9902676399026764, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-0"], "isController": false}, {"data": [0.9890510948905109, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff=-1"], "isController": false}, {"data": [0.9930693069306931, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-0"], "isController": false}, {"data": [0.9821782178217822, 500, 1500, "https://petstore.octoperf.com/actions/Account.action-1"], "isController": false}, {"data": [0.9899799599198397, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.9816810344827587, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrderForm="], "isController": false}, {"data": [0.9875, 500, 1500, "https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1"], "isController": false}, {"data": [0.9287128712871288, 500, 1500, "https://petstore.octoperf.com/actions/Account.action"], "isController": false}, {"data": [0.9826254826254827, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signonForm="], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9811946902654868, 500, 1500, "https://petstore.octoperf.com/actions/Order.action"], "isController": false}, {"data": [0.9799107142857143, 500, 1500, "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [0.9379562043795621, 500, 1500, "https://petstore.octoperf.com/actions/Account.action?signoff="], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6620, 2, 0.030211480362537766, 236.14818731117794, 134, 6238, 150.0, 456.0, 601.9499999999998, 1034.79, 11.012776151184456, 46.086951167716094, 8.373664407169118], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=FI-SW-01", 484, 0, 0.0, 193.54752066115694, 137, 1891, 149.0, 311.0, 459.75, 785.5499999999987, 0.8380894331467834, 3.471032505835457, 0.5107107483238211], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action", 527, 0, 0.0, 487.30929791271376, 135, 3695, 570.0, 767.8, 969.5999999999999, 1604.2400000000005, 0.8907714723252347, 4.927079706298954, 0.4688728745930679], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-0", 411, 0, 0.0, 191.06326034063267, 136, 3763, 147.0, 166.8, 444.19999999999993, 1197.1999999999978, 0.7697436435281603, 0.17289163868308288, 0.4517733689066644], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=-1", 411, 0, 0.0, 168.9294403892943, 134, 1360, 145.0, 160.0, 272.4, 821.9599999999996, 0.7697263444928046, 3.7945103388668726, 0.4449980429099027], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-0", 505, 0, 0.0, 182.22772277227722, 136, 3974, 148.0, 166.40000000000003, 439.0, 514.4, 0.8650356034950865, 0.19429510625377916, 0.7704223343628113], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action-1", 505, 0, 0.0, 183.01386138613879, 134, 3113, 145.0, 161.0, 306.79999999999995, 920.7199999999999, 0.8650459759088978, 4.3463491660657025, 0.5414985064039096], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH", 499, 0, 0.0, 196.32865731462925, 134, 6238, 146.0, 410.0, 454.0, 801.0, 0.8579661902862409, 3.40589117530622, 0.5211474319902752], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrderForm=", 464, 0, 0.0, 199.59267241379308, 134, 3335, 146.0, 301.0, 463.75, 1227.6000000000017, 0.8695456623914005, 4.708623728476871, 0.5128960743011777], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=EST-1", 480, 0, 0.0, 178.2354166666667, 136, 3180, 147.0, 162.0, 304.79999999999995, 853.76, 0.8354611484457812, 3.9211194135062737, 0.5091091373341479], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action", 505, 0, 0.0, 365.4950495049508, 272, 4123, 295.0, 576.6000000000001, 610.0, 1730.1999999999985, 0.8648267263996493, 4.539495756248159, 1.311597564549468], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signonForm=", 518, 0, 0.0, 188.72007722007737, 134, 2809, 146.0, 162.10000000000002, 445.2999999999997, 1164.499999999981, 0.8767742830931513, 3.5062243780488216, 0.5171598310432259], "isController": false}, {"data": ["Test", 446, 2, 0.4484304932735426, 2510.8587443946167, 1666, 13158, 2176.5, 3003.9000000000005, 4562.549999999998, 9793.439999999982, 0.8313729583828864, 39.56725383158546, 6.560359893268302], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Order.action", 452, 0, 0.0, 196.3871681415928, 136, 1620, 150.0, 414.9999999999999, 457.34999999999997, 820.9099999999985, 0.847030427506751, 3.862094791043965, 0.9893050696270255], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 448, 2, 0.44642857142857145, 190.0245535714284, 135, 6180, 148.5, 164.0, 280.7499999999998, 1370.51, 0.8395157043780369, 4.436023732481201, 0.5042013263598562], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Account.action?signoff=", 411, 0, 0.0, 360.20924574209255, 270, 4184, 294.0, 564.8, 621.1999999999999, 1474.1199999999997, 0.7695303430869589, 3.9663878425907897, 0.8965329094753338], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 2, 100.0, 0.030211480362537766], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6620, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true", 448, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
