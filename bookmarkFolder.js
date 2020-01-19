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
    let emptySpace = $('<p>',{
        "style": "width:20%"
    })
    let bookmarkTitle = $("<p class='p-2'>" + object.title + "</p>")
    bookmarkTitle.appendTo(newDiv);
    let icon = $('<i>',{
        "class": "d-inline-flex material-icons icon mt-1 item-info",
        "id": "b" + object.id,
        "text": "info",
        "style": "z-index:1;position:relative;"
    })
    icon.appendTo(newDiv)
    
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

    switch (object.incep) {
        case 1:
            newDiv = $('<div>', {
                "class": "bookmark btn col-2 m-3 btn-sm",
                "style": "background-color: #2BBBAD; font-size: 120%;",
                "id": object.id
            })
            break;
        case 2:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-3 btn-danger btn-sm",
                "style": "font-size: 120%; color: black",
                "id": object.id

            })
            break;
        case 3:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-3 btn-sm",
                "style": "background-color: #ff5722;font-size: 120% ",
                "id": object.id
            })
            break;
        case 4:
            newDiv = $('<button>', {
                "class": "bookmark btn d-inline-flex col-2 m-3 btn-dark-green btn-sm text-light",
                "style": "background-color: #673ab7; font-size: 120%",
                "id": object.id,
            })
    }
    let newClickable = $('<a>', {
        "href": object.url,
        "style": "text-decoration: none;",
        "class": "m-0",
        "id": "a" + object.id
        
    })    
    

    let rowDivision = $("<div class='row margin' style='overflow-wrap: break-word;'></div>")
    let textOnly = $("<p>",{
        "style": "width:70%;",
        "class":"d-flex",
        "text": object.title
    })

    if (object.title.length >= 50){
        textOnly.css("font-size", "80%")
    }
    
    let icon = $('<i>',{
        "class": "d-inline-flex material-icons icon mt-1 item-info",
        "id": "b" + object.id,
        "text": "info",
        "style": "z-index:1;position:relative;right:60px"
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
    newClickable.after(icon)

}

