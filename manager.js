var result;
var count = 0;
var objectValue;
document.addEventListener('DOMContentLoaded', async function () {
    
    await search;
    console.log(result)
    get(result)
    clickRemove()

})

function clickRemove() {
    $("button").on("click", function () {
        console.log(this.id)
        let obj = findIt(result, this.id)
        if (obj.children){
            removeTree(this.id)
            $("#0" + String(this.id)).remove()
            for (var i=0; i < obj.children.length; i++){
                $("#0" + String(obj.children[i].id)).remove()
            }
        }
        if (!obj.children){
            removed(obj.id)
            $("#0" + String(this.id)).remove()
        }
        
    })
}

function get(data){
    for(var i=0; i < data.length; i++){
        if (data[i].children){  
            let count = checkIncep(data[i])
            printFolder(data[i], count)
            get(data[i].children)
        }
        else if (!data[i].children){
            let count = checkIncep(data[i])
            printBookmark(data[i], count)
        }
    }
}

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
            //console.log(data)
        }
    })
})

var removed = function (id) {
    return new Promise(function (resolve, reject){
        chrome.bookmarks.remove(String(id), function (callback){
            resolve()
        })
    })
}
var removeTree = function (id) {
    return new Promise(function (resolve, reject) {
        chrome.bookmarks.removeTree(String(id), function (callback){
            resolve()
        })
    })
}



function printFolder(folder, incep){
    let div = $("<div>", {
        "class": "p-1",
        "id": "0" + String(folder.id)
    })
    let p = $("<p>", {
        "text": "----".repeat(incep) + folder.title,
        "class": "d-inline"
    })
    let button = $("<button>", {
        "id": folder.id,
        "class": "d-inline btn btn-danger",
        "style": "float: right; font-size: 10px; line-height: 1em; border-radius: 0px"
    })
    button.html("&times;")
    $(div).hover(function () {
        $(this).css("background-color", "#2BBBAD")
        }, function () {
            $(this).css("background-color", "#778899")
        }
    )
    p.appendTo(div)
    button.appendTo(div)
    div.appendTo("#allBookmarks")
}

function printBookmark(bookmark, incep){
    let btext = bookmark.title
    if (btext.length > 80){
        btext = btext.slice(0,80) + "..."
    }
    let div = $("<div>", {
        "class": "p-1",
        "id": "0" + String(bookmark.id)
    })
    let p = $("<a>", {
        "text": "----".repeat(incep) + btext,
        "href": bookmark.url,
        "class": "d-inline",
        "style": "color: #6a1b9a"
    })
    let button = $("<button>", {
        "id": bookmark.id,
        "class": "d-inline btn btn-outline-danger",
        "style": "float: right; font-size: 10px; line-height: 1em; border-radius: 0px;"
    })
    button.html("&times;")
    $(div).hover(function () {
        $(this).css("background-color", "#4285F4")
        }, function () {
            $(this).css("background-color", "#778899")
        })
    p.appendTo(div)
    button.appendTo(div)
    div.appendTo("#allBookmarks")

}

function checkIncep(object) {
    for (var i = 0; i < result.length; i++) {
        if (result[i].id == object.id) {
            return 0
        }
        if (result[i].children) {
            for (var k = 0; k < result[i].children.length; k++) {
                if (result[i].children[k].id == object.id) {
                    return 1
                }
                if (result[i].children[k].children) {
                    for (var j = 0; j < result[i].children[k].children.length; j++) {
                        if (result[i].children[k].children[j].id == object.id) {
                            return 2
                        }
                    }
                }
            }

        }
    }
    return 3
}



function findIt(data, objectId) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
            if (data[i].id == objectId) {
                objectValue = data[i]
            }
            else {
                findIt(data[i].children, objectId)
            }
        }
        else {
            if (data[i].id == objectId) {
                objectValue = data[i]
            }
        }
    }
    if (objectValue !== undefined){
        return objectValue
    }
    
}