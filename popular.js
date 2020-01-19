function onPopClick() {
    $("#mostPop").click(function () {
        let filteredList = []
        let searchVal = $("#searchButton")[0].value
        searchVal = searchVal.toLowerCase()
        if ($("#load").css("display") == "block") {
            $("#load").css("display", "none")
            $("#popDiv").css("display", "block")
            for (var i=0; i < result.length; i++){
                let title = result[i].title.toLowerCase()
                if (title.includes(searchVal)){
                    filteredList.push(result[i])
                }
                if (result[i].children){
                    for (var x=0; x < result[i].children.length; x++){
                        let data = result[i].children
                        let title = data[x].title.toLowerCase()
                        if (title.includes(input)){
                            filteredList.push(data[x])
                        }
                    }
                }
            }
            renderPop(filteredList)

        }
        else if ($("#load").css("display") == "none") {
            $("#load").css("display", "block")
            $("#popDiv").css("display", "none")

        }
    })
}

async function renderPop(data){
    let list = [];
    await getAllInside(list, data)
    let newList = sortDescend(list)
    for (var i=0; i < newList.length; i++){
        let object = findIt(data,newList[i].id)
        let bookmark = new Bookmark(data, object)
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

