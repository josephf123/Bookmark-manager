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
    let newDiv;
    switch (object.incep) {
        case 1:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-3 btn-outline-primary btn-lg notIcon",
                "id": object.id
                
            })
            break;
        case 2:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-3 btn-outline-warning btn-lg text-dark notIcon",
                "id": object.id
            })
            break;
        case 3:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 m-3 btn-outline-success btn-lg notIcon",
                "id": object.id
            })
            break;
        case 4:
            newDiv = $('<button>', {
                "class": "folder btn d-inline-flex col-2 my-3 btn-lg notIcon",
                "id": object.id,
                "style": "background-color: #2BBBAD; margin: 0px 18px 0px 18px "
            })
            break;

    }
    let rowDivision = $("<div class='d-flex flex-row flex-fill notIcon' style='overflow-wrap: break-word;'></div>")
    let emptySpace = $('<p>',{
        "style": "width:20%",
        "class": "notIcon flex-fill"
    })
    let bookmarkTitle = $("<p class='pl-1 py-2 notIcon flex-fill'>" + object.title + "</p>")
    let icon = $('<i>',{
        "class": "material-icons icon mt-1 item-info flex-fill",
        "id": "b" + object.id,
        "text": "info",
    })
    bookmarkTitle.appendTo(rowDivision);
    emptySpace.appendTo(rowDivision)
    icon.appendTo(rowDivision)
    rowDivision.appendTo(newDiv)
    if (arguments.length == 2) {
        var parent = "#" + String(arguments[1].id)
        $(parent).after(newDiv)
    }
    else {
        var parent = "#load"
        newDiv.appendTo(parent)
    }
}

function printBookmark(object) {
    let newDiv;
    switch (object.incep) {
        case 1:
            newDiv = $('<div>', {
                "class": "bookmark btn col-2 mx-0 my-3 btn-sm",
                "style": "background-color: #2BBBAD; font-size: 120%;",
                "id": object.id
            })
            break;
        case 2:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 mx-0 my-3 btn-danger btn-sm",
                "style": "font-size: 120%; color: black",
                "id": object.id

            })
            break;
        case 3:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 mx-0 my-3 btn-sm",
                "style": "background-color: #ff5722;font-size: 120% ",
                "id": object.id
            })
            break;
        case 4:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 mx-0 my-3 btn-dark-green btn-sm text-light",
                "style": "background-color: #673ab7; font-size: 120%",
                "id": object.id,
            })
    }
    let newClickable = $('<a>', {
        "href": object.url,
        "style": "text-decoration: none;",
        "class": "m-3 clickable",
        "id": "a" + object.id
        
    })    
    

    let rowDivision = $("<div class='d-flex flex-row margin' style='overflow-wrap: break-word;'></div>")
    let textOnly = $("<p>",{
        "style": "width:70%;",
        "class":"d-inline-flex",
        "text": object.title
    })

    if (object.title.length >= 50){
        textOnly.css("font-size", "80%")
    }
    
    let icon = $('<i>',{
        "class": "d-inline-flex material-icons icon mt-1 item-info ml-auto",
        "id": "b" + object.id,
        "text": "info",
    })
    icon.hover(function(){
        icon.css("cursor", "pointer")
        icon.css("color", "white")
    }, function(){
        icon.css("cursor", "default")
        icon.css("color", "black")

    })


    let emptySpace = $('<p>',{
        "style": "width:20%"
    })
    
    textOnly.appendTo(rowDivision)
    emptySpace.appendTo(rowDivision)
    icon.appendTo(rowDivision)
    rowDivision.appendTo(newDiv)
    newDiv.appendTo(newClickable);
    newDiv.hover(function () {
        textOnly.css("color", "white");
    }, function () {
        textOnly.css("color", "black");
    });

    if (arguments.length == 2) {
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

