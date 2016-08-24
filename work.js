/*Logic I am using is 
I create a columns array which takes the first object of previous array as input
I call the objects inside recursively using getDeeperKeys function
After creating that, i push all this in the table with TH element
Then I scan prev array. I create a rowArray which is basically an array of arrays.
Each array denotes the row values
The first value in each is the index value
Now after filling this, I scan the currArray and check if I need to fill the rowArray 
taking it as a new entry o should I update the already existing entry in the rowArray
*/


var rowArray;//array of arrays, each array inside has a row
var indexArray = [];//maintaines the index in the rowArray to avoid overhead

function arrayDiffToHtmlTable( prevArray, currArray) {

    var table = document.createElement("TABLE");
    table.border = "1";
 
    //Get the count of columns.
    var firstObject = prevArray[0];
    //get all keys of the first object in the array, assuming prevarray and currarray have the same structure
    var keys = Object.keys(firstObject);
    var colarray = [];//array for maintinaing column headers
    //this will create the column headers and fill the table
    for(var i=0;i<keys.length;i++){
        //to check for deepness
        if(typeof prevArray[0][keys[i]] == "object"){
            var emptyarr = [];
            //everytime we pass an empty array to get it fill by deep objec keys
            var deepArr = getDeeperKeys(firstObject[keys[i]], keys[i], emptyArr);
            //concatenate the array of column headers to our old header array
            colarray.concat(deeparr);
        }
        else{
            //just pushing key to the col array if value if not an object
            colarray.push(keys[i]);
        }
    }

    //count of rowArray array
    var columnCount = colarray.length;
 
    //Add the header row.
    /*colarray is of the format ["_id", "meta1sub", "meta2sub", "signature", "value"], these
    are the column headers*/
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = colarray[i];
        row.appendChild(headerCell);
    }
 
    //this will make an array of arrays with each array having a row and each received array for the objects are concatenated to the global array pf column values
    for(var j=0j<prevArray.length;j++){
        var emptyColArray = [];
        rowarrayfilled = fillTable(prevArray[j], emptyColArray);
        rowArray.concat(rowarrayfilled);
    }

    //call updateTable for currArray
    for(var k =0;k<currArray.length;k++){
        var emptyColArray = [];

        //this check prevents to scan the whole columnsArray again when considering currArray
        if(alreadyInTable(currArray[k]["_id"])){
            var idx = findIndexInColArray(rowArray, currArray[k]["_id"]);
            var updatedarray = updateTable(currArray[k], emptyColArray);
            rowArray[idx] = updatedarray;
        }
        else
            rowArray.concat(fillTable(currArray[k]));
    }

    //Add the data rows
    /*rowArray is an array of arrays == [[1,2,3,4,5][5,6,7,8,9][2,3,4,5,6][9,5,4,3,2][7,8,9,7,5]] -- this is 
    the format where 1, 5, 2, 9, 7 are the id in each row, here there will be five rows*/
    for (var i = 1; i < rowArray.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < rowArray[i]; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = rowArray[i][j];
        }
    }
 
    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}

//first filll prevArray
/*This function takes the newid of currArray object as input and checks in the indexArray if it exists or not*/
function alreadyInTable(newid){
    if(indexArray.indexOf(newid)>-1)//for update
        return true;//if already exists, so update
    else
        return false;//else, for fill table
}

/*This function finds the index of the row with id as the first value*/
function findIndexInColArray(rowArray, id){
    for(var i=0;i<rowArray;i++){
        if(rowArray[i][0] == id)
            return i;
    }
}


/*This function takes the object which further has an object as value as an input, key is the string whose value we sent as 
the first argument, newArray is an empty object to be filled*/
function getDeeperKeys(deeperobj, key, deeperKeys){

    var keys = Object.keys(deeperobj);
    for(var i=0;i<keys.length;i++){
        if(typeof prevArray[0][keys[i]] == "object"){
            var deeparr = getDeeperKeys(prevArray[0][keys[i]], keys[i], deeperKeys);
            deeperKeys.concat(deeparr);
        }
        else{
            deeperKeys.push(key+"_"+keys[i]);
        }
    }
    return deeperKeys;

}


//update and add using currArray
/*This function takes prevArrays individual elements as input and produces arrays of values to update in
the table. It does this recursively*/
function updateTable(currArray, idx, emptyColArray){

    //search in the columns array and update here
    var keys = Object.keys(prevArray);
    for(var i=0;i<keys.length;i++){
        if(typeof prevArray[0][keys[i]] == "object"){
            var newarray=[];
            var deeparr = getDeeperKeys(prevArray[0][keys[i]], keys[i], emptyColArray);
            emptyColArray.concat(deeparr);
        }
        else{
            //push values in the order of keys added in getDeeperKeys function
            emptyColArray.push(keys[i]);
        }
    }
    return emptyColArray;

}


/*This function takes prevArrays individual elements as input and produces arrays of values to put in
the table. It does this recursively*/
function fillTable(prevArray, emptyColArray){

    var keys = Object.keys(prevArray);
    indexArray.push(prevArray["_id"]);//maintain an index array to know if we have to update or fill the table
    for(var i=0;i<keys.length;i++){
        if(typeof prevArray[0][keys[i]] == "object"){
            var deeparr = getDeeperKeys(prevArray[0][keys[i]], keys[i], emptyColArray);
            emptyColArray.concat(deeparr);
        }
        else{
            //push values in the order of keys added in getDeeperKeys function
            emptyColArray.push(keys[i]);
        }
    }
    return emptyColArray;

}



