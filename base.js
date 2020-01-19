var result;

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
        }
    })
})

document.addEventListener('DOMContentLoaded', async function () {
    await search;
    console.log(result)
    initialize(); 
    onPopClick();
    iconEvent();
    $("#tags").on("click", function (){
        window.location.href = "test.html"
    })
    $("#clearTags").on("click", function (){
        clearTags(result)
        document.location.reload()
    })

    $("#clearInfo").on("click", function (){
        clearInfo(result)
    })

    $("#launchTagModal").on("click", function(){
        launchTagModal()
    })

    $(".delete-tag").on("click", function(){
        console.log("hihihih")
        let id = this.id
        console.log(id)
    })

    $("#saveChangesModal").on("click", function(){
        let modalInfo = $("#modal-information")
        let modalContentId = $(".modal-content")[0].id
        let modalObject = findIt(result, modalContentId)
        let textModal = modalInfo[0].children[5].value
        let titleModal = modalObject.title
        let urlModal = modalObject.url
        saveChangesModal(modalContentId,textModal)
    })
    $("#searchButton").on("keyup", function(e) {
        console.log(e.target.value)
        searchFun(e.target.value)
    })
    chrome.storage.local.set({"tags":"Work,Entertainment,For Later,Sports,Philosophy,Music,Funny"})
    

    


})

function searchFun(input){
    let all = $("#load").children()
    for(var i=0; i < all.length; i++){
        all[i].remove()
    }
    input = String(input).toLowerCase();
    for(var i=0; i < result.length; i++){
        let title = result[i].title.toLowerCase()
        if (title.includes(input)){
            console.log("The thing is " + result[i].title)
            if (!result[i].children){
                let bookmark = new Bookmark(result, result[i])
                printBookmark(bookmark)
            }
            else if (result[i].children){
                let folder = new Folder(result, result[i])
                printFolder(folder)
            }
    
        }
        else{
            $("#a" + result[i].id).remove()
            $("#b" + result[i].id).remove()
        }
        if(result[i].children){
            console.log(result[i].children)
            for (var x=0; x < result[i].children.length; x++){
                let data = result[i].children
                let title = data[x].title.toLowerCase()
                if (title.includes(input)){
                    //Make it so that if input matches with child of folder, only output folder. Right now there is a problem with duplication so try and fix that
                    console.log("The thing is " + data[x].title)
                    let bookmark = new Bookmark(result, data[x])
                    printBookmark(bookmark)

                }
                else{
                    if (data[x].children){
                        $("#" + result[i].id).remove()
                    }
                    else {
                        $("#a" + result[i].id).remove()
                        $("#b" + result[i].id).remove()
                    }

                }
            }

        }

        
            

    
    }
    
    iconEvent()
    initializeFolderOpen()
}





function clearInfo(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearTags(res[i].children)
        }
        else{
            let resId = "i" + res[i].id
            chrome.storage.local.remove(resId, function(){
                console.log("All are cleared")
            })
        }
    }
}


function clearTags(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearTags(res[i].children)
        }
        else{
            let resId = res[i].id
            chrome.storage.local.remove(resId, function(){
                console.log("All are cleared")
            })
        }
    }
    
    
}

async function saveChangesModal(id, text){
    let key = "i" + id
    await makeStorage(key, text)

}


async function displayModalInfo(identification) {
    $("#modal-information").empty()
    $(".modal-content").attr('id', identification)
    let data = findIt(result, identification)
    console.log(data)
    let tags = await stored(identification)
    tags = tags.split(",")
    let row = $("<div class='row margin'></div>")
    let urlTitle = $("<div>URL: </div>")
    let url = $("<a>",{
        href: data.url,
        text: data.url
    })
    urlTitle.appendTo(row)
    url.appendTo(row)
    $("#modalTitle").text(data.title)
    $("#modal-information").append(row)
    let tagParagraph = $("<p class='margin' style='margin-bottom:0px'>Tags:</p>")
    let ul = $("<ul class='margin' style='margin-bottom:-10px'>")
    for(var i=0;i < tags.length; i++){
        let tag = $("<li>", {
            text: tags[i],
            class: "margin"
        })
        tag.appendTo(ul)
    }
    let infoTitle = $("<p class='margin d-inline-flex'>Info:</p>")
    let infoSubscript = $("<p class='margin d-inline-flex' style='float:right; color: #A9A9A9'>max chars: 200</p>")
    let textInformation = await stored("i" + identification)
    if (textInformation == "none"){
        textInformation = ""
    }
    let textbox = $("<textarea>", {
        row: "5",
        style: "margin-left: 45px; width:405px;", 
        text: textInformation, maxlength: "200", 
        class : "form-control"})
    $("#modal-information").append(tagParagraph)
    $("#modal-information").append(ul)
    $("#modal-information").append(infoTitle)
    $("#modal-information").append(infoSubscript)
    $("#modal-information").append(textbox)
    $("#exampleModalCenter").modal('show')
}



function iconEvent(){
    $(".item-info").on("click", function(){
        let id = this.id.slice(1)
        displayModalInfo(id)
    })
}

async function launchTagModal(){
    $("#modal-information").empty()
    $("#modalTitle").text("Tags")
    let tag = await stored("tags")
    tag = tag.split(',')
    console.log(tag)
    for(var i=0; i < tag.length; i++){

        let tagName = $("<div>", {
            "text": tag[i],
            "class": "d-flex ",
            "style": "vertical-align: middle"
        })
        let button = $("<button>", {
            "class": "d-flex btn ml-auto delete-tag",
            "text": "delete",
            "style": "float:left",
            "id": tag[i], 
        })
        
        tagName.append(button)
        // let icon = $('<i>',{
        //     "class": "d-inline-flex material-icons icon align-middle delete-tag",
        //     "id": tag[i],
        //     "text": "delete",
        //     "style": "z-index:1"
        // })
        if ((i + 1) % 2 == 0){
            tagName.css("border-top", "1px solid #dee2e6")
            tagName.css("border-bottom", "1px solid #dee2e6")
        }
        $("#modal-information").append(tagName)
    }
    $("#exampleModalCenter").modal('show')

}



function clearTags(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearTags(res[i].children)
        }
        else{
            let resId = res[i].id
            chrome.storage.local.remove(resId, function(){
                console.log("All are cleared")
            })
        }
    }
    
    
}

var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            if (res[id]){
                resolve(res[id])
            }
            else{
                resolve("none")
            }
    
        })
    })
}

var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
    })
}

function initialize(){
    for(var i=0; i < result.length; i++){
        if (result[i].children){  
            let folder = new Folder(result, result[i])
            printFolder(folder)
            //removeData(folder.object)
            
        }
        else if (!result[i].children){
            let bookmark = new Bookmark(result, result[i])
            printBookmark(bookmark)
            //removeData(bookmark.object)
        }
    }
    initializeFolderOpen()
    
    
}

function initializeFolderOpen(){
    $(".folder").each( function () {
        let object = findIt(result, this.id)
        onClickOpen(object)

    })
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
    if (objectValue) {
        return objectValue
    }
}

function reverseFindIt(data, title, url){
    for (var i = 0; i < data.length; i++) {
        if (data[i].children) {
            if (data[i].title == title && data[i].url == url) {
                identification = data[i].id
            }
            else {
                reverseFindIt(data[i].children, title, url)
            }
        }
        else {
            if (data[i].title == title && data[i].url == url) {
                identification = data[i].id
            }
        }
    }
    if (identification) {
        return identification
    }
    
}


function checkIncep(object) {
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
            $(buttonId).addClass("open")

        }
        else {
            clickClose(object, 1)
        }
        $("i").off("click")
        iconEvent()

    })

}



function clickClose(obj) {
    let objId = "#" + String(obj.id)
    for (var i = 0; i < obj.children.length; i++) {
        if (obj.children[i].children) {
            clickClose(obj.children[i])
        }
        let stringId = "#" + String(obj.children[i].id)
        $(stringId).removeClass("open")
        $(stringId).remove()
        $("#b" + obj.children[i].id).remove()
        console.log("successfully killed" + stringId)

    }
    $(objId).removeClass("open");
    if (arguments.length == 1) {
        $(objId).remove();
    }


}




