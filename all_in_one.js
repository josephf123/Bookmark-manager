var result;

class Folder {
    constructor(data, object) {
        this.data = data
        this.object = object
        this.id = this.object.id
        this.parentId = this.object.parentId
        this.title = this.object.title
        this.index = this.object.index
        this.incep = checkIncep(this.object)
    }
}

class Bookmark {
    constructor(data, object) {
        this.data = data
        this.object = object
        this.id = this.object.id
        this.parentId = this.object.parentId
        this._title = this.object.title
        this.url = this.object.url
        this.index = this.object.index
        this.incep = checkIncep(this.object)
    }

    get title() {
        if (this.object.title == "") {
            return this.object.url
        }
        else {
            return this.object.title
        }

    }
    set title(x) {
        this._title = x
    }
}

function printFolder(object) {

    switch (object.incep) {
        // Depending on the nestedness of a certain folder, a certain colour will be given to it
        case 1:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-4 btn-outline-primary btn-lg",
                "id": object.id
            })
            break;
        case 2:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-4 btn-outline-warning btn-lg text-dark",
                "id": object.id
            })
            break;
        case 3:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-4 btn-outline-success btn-lg",
                "id": object.id
            })
            break;
        case 4:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-4 btn-lg",
                "id": object.id,
                "style": "background-color: #2BBBAD "
            })
            break;

    }
    let bookmarkTitle = $("<p>" + object.title + "</p>")
    bookmarkTitle.appendTo(newDiv);
    if (arguments.length == 2) {
        // If another argument is given to function, this means that it belongs to a folder and it will be right after the folder (if the folder is opened)
        var parent = "#" + String(arguments[1].id)
        $(parent).after(newDiv)
    }
    else {
        var parent = "#load"
        newDiv.appendTo(parent)
    }
}

function printBookmark(object) {
    // Depending on the nestedness of a certain bookmark, a certain colour will be given to it
    switch (object.incep) {
        case 1:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-4 btn-sm",
                "style": "background-color: #ff5722; font-size: 120%; ",
                "text": object.title,
                "id": object.id
            })
            break;
        case 2:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-4 btn-danger btn-sm",
                "style": "font-size: 120%; color: black",
                "text": object.title,
                "id": object.id

            })
            break;
        case 3:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-4 btn-sm",
                "style": "background-color: #2BBBAD;font-size: 120% ",
                "text": object.title,
                "id": object.id
            })
            break;
        case 4:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-4 btn-dark-green btn-sm text-light",
                "style": "background-color: #673ab7; font-size: 120%",
                "text": object.title,
                "id": object.id
            })
    }
    // By clicking on the bookmark, it will go to it's respective website
    let newClickable = $('<a>', {
        "href": object.url,
        "style": "text-decoration: none;",

    })
    // While hovering over the bookmark, the text will go from black to white
    $(newDiv).hover(function () {
        $(this).css("color", "white");
    }, function () {
        $(this).css("color", "black");
    });

    newDiv.appendTo(newClickable);
    if (arguments.length == 2) {
        // If two arguments are given to the function, this means that the user wants to see the most popular bookmarks so the bookmarks will be appended to a "popDiv"
        if (arguments[1] == 1){
            let popDiv = "#popDiv"
            newClickable.appendTo(popDiv)
        }
        let parent = "#" + String(arguments[1].id)
        $(parent).after(newClickable)
    }
    else {
        let parent = "#load"
        newClickable.appendTo(parent)
    }
}


var search = new Promise(function (resolve, reject) {
    // Turns this built in chrome function into an asynchronous that returns all bookmarks of a user
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
            //console.log(data)
        }
    })
})

document.addEventListener('DOMContentLoaded', async function () {
    // Waits for chrome to get the bookmarks of the user
    await search;
    console.log(result)
    initialize(); 
    onPopClick();
    renderPop();
    $("#tags").on("click", function (){
        window.location.href = "test.html"
    })

})

function initialize(){
    for(var i=0; i < result.length; i++){
        if (result[i].children){  
            // If the certain result has children, it means that it is a folder, the folder is then converted into an object which is then displayed using the "printFolder" function
            let folder = new Folder(result, result[i])
            printFolder(folder)
            
        }
        else if (!result[i].children){
            // If the certain result has no children, it means that it is a bookmark, the bookmark is then converted into an object which is then displayed using the "printBookmark" function
            let bookmark = new Bookmark(result, result[i])
            printBookmark(bookmark)
        }
    }
    // Using jquery, each folder now has a function that will execute when clicked on
    $(".folder").each( function () {
        let object = findIt(result, this.id)
        onClickOpen(object)

    }) 
}


function findIt(data, objectId) {
    // Using a recursive loop, this function gets data and and id and tries to return the actual object (with all the properties)
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
    if (objectValue) {
        return objectValue
    }
}


function checkIncep(object) {
    // This function sees how nested a cetain folder or bookmark is
    for (var i = 0; i < result.length; i++) {
        if (result[i].id == object.id) {
            return 1
        }
        if (result[i].children) {
            for (var k = 0; k < result[i].children.length; k++) {
                if (result[i].children[k].id == object.id) {
                    return 2
                }
                if (result[i].children[k].children) {
                    for (var j = 0; j < result[i].children[k].children.length; j++) {
                        if (result[i].children[k].children[j].id == object.id) {
                            return 3
                        }
                    }
                }
            }

        }
    }
    return 4
}

function onClickOpen(object) {
    // Once a folder is clicked, the bookmarks inside the folder will be displayed
    let buttonId = "#" + String(object.id)
    $(buttonId).on("click", function () {
        if (!$(buttonId).hasClass("open")) {
            for (var i = object.children.length - 1; i >= 0; i--) {
                if (!object.children[i].children) {
                    let bookmark = new Bookmark(result, object.children[i])
                    printBookmark(bookmark, object);

                }
                else {
                    let folder = new Folder(result, object.children[i])
                    printFolder(folder, object)
                    onClickOpen(findIt(result, folder.id))
                }
            }
            // If the folder is open, the class 'open' is added to it
            $(buttonId).addClass("open")

        }
        else {
            clickClose(object, 1)
        }

    })

}

function clickClose(obj) {
    let objId = "#" + String(obj.id)
    for (var i = 0; i < obj.children.length; i++) {
        if (obj.children[i].children) {
            clickClose(obj.children[i])

        }
        let stringId = "#" + String(obj.children[i].id)
        //Once the folder is clicked again, it is closed so the class 'open' is removed, the bookmarks are also removed
        $(stringId).removeClass("open")
        $(stringId).remove()

    }
    $(objId).removeClass("open");
    if (arguments.length == 1) {
        $(objId).remove();
    }


}

function onPopClick() {
    //If a button is clicked to see the most popular bookmarks is clicked, the 'load' div becomes hidden and the 'popDiv' is now displayed
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
    //The list will have all the bookmarks and their respective visit count
    let list = [];
    // getAllInside function gets all the bookmarks and their respective visit counts and puts it in the list above
    await getAllInside(list, result)
    //sorts the list from most visited to least visited
    let newList = sortDescend(list)
    for (var i=0; i < newList.length; i++){
        let object = findIt(result,newList[i].id)
        let bookmark = new Bookmark(result, object)
        // Prints the bookmark inside the 'popDiv' instead of the 'load' div
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
        // Finds the amount of visits a bookmark has and adds it to 'list'
        chrome.history.getVisits({ 'url': theURL }, function (res) {
            list.push({"id": id, "visits": res.length})
            resolve(res.length)
    
        })
    })
}

function sortDescend(list) {
    // Sorts the list from most visits to least visits
    let sortedList = list.slice(0)
    sortedList.sort(function(a,b){
        return b.visits - a.visits
    })
    console.log(sortedList)
    return sortedList
    
}

