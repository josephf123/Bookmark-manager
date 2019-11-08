function onPopClick() {
    $("#mostPop").click(function () {
        if ($("#load").css("display") == "block") {
            $("#load").css("display", "none")
            $("#popDiv").css("display", "block")
            

        }
        else if ($("#load").css("display") == "none") {
            $("#load").css("display", "block")
            $("#popDiv").css("display", "none")

        }
    })
}

async function renderPop(){
    let list = [];
    await getAllInside(list, result)
    let newList = sortDescend(list)
    for (var i=0; i < newList.length; i++){
        let object = findIt(result,newList[i].id)
        let bookmark = new Bookmark(result, object)
        printBookmark(bookmark, 1)
    }
}

async function getAllInside(list, data){
    for (var i=0; i < data.length; i++){
        if(!data[i].children){
            let theURL = String(data[i].url)
            await find(list, data[i].id, theURL)
        }
        else if (data[i].children){
            getAllInside(list, data[i].children)
        }
    }
}

var find = function (list, id, theURL){
    return new Promise(function (resolve, reject){
        chrome.history.getVisits({ 'url': theURL }, function (res) {
            list.push({"id": id, "visits": res.length})
            resolve(res.length)
    
        })
    })
}

function sortDescend(list) {
    let sortedList = list.slice(0)
    sortedList.sort(function(a,b){
        return b.visits - a.visits
    })
    console.log(sortedList)
    return sortedList
    
}

