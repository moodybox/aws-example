$(document).ready(function () {

    // Initialize page with all records in table
    populateTable();

    // Switch from details to modify modal 
    $("#switch-modify").click(function () {
        // Close details modal
        $("#detailsModal").modal('hide');

        // Get current item by ID and populate modify modal with records. 
        modifyModal($("#dm-id").text())
    });

});

// Get target list from API and send to next function to be added to page appropriately
function getData(method, url, OnCompletionFunction) {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest();

    // Open a new connection, using the GET request on the URL endpoint
    request.open(method, url, true);

    // Send json response to populateTable function when received
    request.onload = function () {
        // Return list of item(s) as json
        OnCompletionFunction(JSON.parse(this.responseText));
    }

    // Send request
    request.send();
}

function checkForData() {
    // Variables
    var table, tr, td, i;
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");
    var allHidden = true;
    // Check for data
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (tr[i].style.display == "") {
                allHidden = false;
            }
        }
    }

    // Show "No Data" if applicable
    if (allHidden == true) {
        $("#noDataError").show();
    }
    else {
        $("#noDataError").hide();
    }
}

// Enter items into table
function updateTable(itemList) {

    // Create HTML table rows from itemList JSON
    var r = new Array(), j = -1;
    for (var key = 0, size = itemList.length; key < size; key++) {
        r[++j] = '<tr><td>';
        r[++j] = itemList[key]["assetID"];
        r[++j] = '</td><td style="display:none;">'
        r[++j] = itemList[key]["id"]
        r[++j] = '</td><td>';
        r[++j] = itemList[key]["assetLocation"];
        r[++j] = '</td><td>';
        r[++j] = itemList[key]["organizationalTag"];
        r[++j] = '</td><td>';
        r[++j] = itemList[key]["manufacturer"];
        r[++j] = '</td><td>';
        r[++j] = itemList[key]["description"];
        r[++j] = '</td><td>';
        r[++j] = itemList[key]["implementationMonth"];
        r[++j] = ', ';
        r[++j] = itemList[key]["implementationYear"];
        r[++j] = '</td><td><a href="#" onclick=detailsModal("' + itemList[key]["id"] + '")>Details</a> | <a href="#" onclick=modifyModal("' + itemList[key]["id"] + '")>Modify</a></td></tr>';
    }

    // Insert dynamically created rows into table
    $('#tableBody').html(r.join(''));

    // Remove no data warning if data exists
    checkForData();
}

function showDetailsModal(item) {

    // Populate details modal with item information
    $("#dm-id").text(item["id"]);
    $("#dm-itemID").text(item["assetID"]);
    $("#dm-itemLocation").text(item["assetLocation"]);
    $("#dm-itemTag").text(item["organizationalTag"]);
    $("#dm-itemManufacturer").text(item["manufacturer"]);
    $("#dm-itemPartNumber").text(item["manufacturerPart"]);
    $("#dm-itemDescription").text(item["description"]);
    $("#dm-itemImplemented").text(item["implementationMonth"] + '/' + item["implementationYear"]);
    $("#dm-itemNotes").text(item["maintenanceNotes"]);

    // Show modal
    $("#detailsModal").modal('show');
}

function showModifyModal(item) {

    // Populate form input fields with existing values
    $("#id").val(item["id"]);
    $("#assetID").val(item["assetID"])
    $("#assetLocation").val(item["assetLocation"])
    $("#organizationalTag").val(item["organizationalTag"])
    $("#manufacturer").val(item["manufacturer"])
    $("#manufacturerPart").val(item["manufacturerPart"])
    $("#description").val(item["description"])
    $("#implementationMonth").val(item["implementationMonth"])
    $("#implementationYear").val(item["implementationYear"])
    $("#maintenanceNotes").val(item["maintenanceNotes"])

    // Show modal
    $("#modifyModal").modal('show');
}

// Refine table
function refineTable() {
    // Variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchAssetID");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");
    // Toggle visibility based on filter match
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

    // Show "No Data" message if there is no data
    checkForData();
}

// Populate table with list of items
function populateTable() {
    // Call list-items API to get list of all items and send data to updateTable function to fill table
    getData('GET', 'https://bll0hoveu3.execute-api.us-east-1.amazonaws.com/prod/list-items', updateTable)
}

// Display details modal with appropriate information 
function detailsModal(id) {
    // Call list-items API to get item and send data to showDetailsModal function to fill modal
    getData('POST', 'https://bll0hoveu3.execute-api.us-east-1.amazonaws.com/prod/get-items?id=' + id, showDetailsModal)
}

// Populate modify modal with appropariate information
function modifyModal(id) {
    // Call list-items API to get item and send data to showModifyModal function to fill modal
    getData('POST', 'https://bll0hoveu3.execute-api.us-east-1.amazonaws.com/prod/get-items?id=' + id, showModifyModal)
}

