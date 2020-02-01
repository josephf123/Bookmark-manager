//Things to do before release,
//Fix tag manager (can't add folder tags)
//Make sticky nav bar
//Add settings to change colours of bookmarks etc.

var result;

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
        }
    })
})

chrome.runtime.onInstalled.addListener(async function() {
    await makeStorage("tags", "Work,Entertainment,For Later,")
})

document.addEventListener('DOMContentLoaded', async function () {
    await search;
    console.log(result)
    initialize(); 
    onPopClick();
    iconEvent();
    stickyNav();
    clicka();
    console.log(await stored("7"))
    $("#tags").on("click", function (){
        window.location.href = "tagManage.html"
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
    // $('#allTagsModal').on('shown.bs.modal', function (e) {
    //     $(".delete-tag").on("click", function(){
    //         let id = this.id
    //         console.log(id)
    //         deleteTag(id)
    //     })
    //     $("#confirmButton").on("click", function(){
    //         let input = $("#newTag").val()
    //         addTag(input)
    //         $("#newTag").val("")
    //     })
    //   });
    $("#allTagsModal").on("click", ".delete-tag", function(){
        deleteTag(this.id)
    })
    $("#allTagsModal").on("click", "#confirmButton", function(){
        let input = $("#newTag").val()
        addTag(input)
        $("#newTag").val("")
    })
    

    $("#saveChangesInfoModal").on("click", function(){
        //This has to be changed when the data structure changes because it is specific
        let textModal = $("textarea")[0].value
        let id = $("textarea")[0].id.substring(1)
        saveChangesModal(id,textModal)
    })
    $("#searchButton").on("keyup", function(e) {
        console.log(e.target.value)
        searchFun(e.target.value)
    })
    //await makeStorage("tags", "Work,Entertainment,For Later,")
})
function clicka(){
    $("a.clickable").on("click", ".icon", function(e){
        e.preventDefault();
    })
}


function stickyNav(){
    let navbar = $("#theNav")
    console.log(navbar[0])
    var sticky = navbar[0].offsetTop
    console.log(sticky)
    if (window.pageYOffset >= sticky) {
        navbar[0].classList.add("sticky")
    } 
    else {
        navbar[0].classList.remove("sticky");
    }
}

async function addTag(input){
    let tags = await stored("tags")
    let newIn = input.charAt(0).toUpperCase() + input.slice(1)
    let newTag = tags + newIn + ","
    await makeStorage("tags", newTag)
    launchTagModal()
    console.log(newTag)
}

async function deleteTag(identification){
    let tags = await stored("tags")
    console.log(tags)
    let regString =  identification + ","
    let regex = new RegExp(regString)
    let newTag = tags.replace(regex, "")
    await makeStorage("tags", newTag)
    launchTagModal()
    console.log(newTag)    
}

async function searchFun(input){
    let all = $("#load").children()
    for(var i=0; i < all.length; i++){
        all[i].remove()
    }
    input = String(input).toLowerCase();
    
    for(var i=0; i < result.length; i++){
        let title = result[i].title.toLowerCase()
        let tags = await stored(result[i].id)
        tags = tags.toLowerCase()
        let info = await stored("i" + result[i].id)
        info = info.toLowerCase()
        let all = tags + title + info
        console.log(all)
        if (all.includes(input)){
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
                let tags = await stored(data[x].id)
                tags = tags.toLowerCase()
                let info = await stored("m" + data[x].id)
                info = info.toLowerCase()
                let all = tags + title + info
                if (all.includes(input)){
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
    $("#modalContentInfo").attr('id', identification)
    console.log("testing")
    let data = findIt(result, identification)
    console.log(data)
    let tags = await stored(identification)
    tags = tags.split(",")
    tags.pop()
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
    if (tags.length == 0){
        let tag = $("<li>", {
            text: "None so far!",
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
        class : "form-control",
        id: "m" + identification
    })
    $("#modal-information").append(tagParagraph)
    $("#modal-information").append(ul)
    $("#modal-information").append(infoTitle)
    $("#modal-information").append(infoSubscript)
    $("#modal-information").append(textbox)
    $("#infoModal").modal('show')
}



function iconEvent(){
    $(".item-info").on("click", function(){
    }, false)
    $(".item-info").on("click", function(){
        let id = this.id.slice(1)
        displayModalInfo(id)
    })
}

async function launchTagModal(){
    $("#modal-tag-information").empty()
    $("#modalTagTitle").text("Tags")
    let tag = await stored("tags")
    tag = tag.split(',')
    console.log(tag)

    tag.pop()
    console.log(tag)
    for(var i=0; i < tag.length; i++){
        let tagName = $("<div>", {
            "class": "d-flex",
            "style": "display: table"
        })
        let button = $("<button>", {
            "class": "d-flex btn btn-danger ml-auto delete-tag",
            "text": "delete",
            "style": "float:left",
            "id": tag[i], 
        })
        let tagText = $("<div>", {
            "text": tag[i], 
            "style": "display:table-cell; vertical-align: middle",
            "class": "mt-1 ml-1"
        })
        tagName.append(tagText)
        tagName.append(button)

        if ((i + 1) % 2 == 0){
            tagName.css("border-top", "1px solid #dee2e6")
            tagName.css("border-bottom", "1px solid #dee2e6")
        }
        $("#modal-tag-information").append(tagName)
    }
    let bigDiv = $("<div>", {
        "class": "d-flex flex-row my-2",
        "id": "bigDiv"
    })
    let tagInput = $("<input>", {
        "id": "newTag",
        "class": "d-flex form-control",
        "placeholder": "Enter new tag name"
    })
    let confirmButton = $("<button>", {
        "id": "confirmButton",
        "text": "Confirm",
        "class": "d-flex btn btn-success",
    })
    $("#modal-tag-information").append(bigDiv)
    $("#bigDiv").append(tagInput)
    $("#bigDiv").append(confirmButton)
    
    $("#allTagsModal").modal('show')

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
                resolve("")
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
                    printFolder(folder)
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
        $("#a" + obj.children[i].id).remove()
        $("#b" + obj.children[i].id).remove()
        console.log("successfully killed" + stringId)

    }
    $(objId).removeClass("open");
    if (arguments.length == 1) {
        $(objId).remove();
    }


}




