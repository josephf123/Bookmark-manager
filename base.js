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
    renderPop();
    $("#tags").on("click", function (){
        window.location.href = "test.html"
    })
    chrome.storage.local.set({["tags"]:"Work,Entertainment,For Later,Sports,Philosophy,Music,Funny"})
    //Make sure there is a way I can access the stored value with the id as the key
    //store("430")
    

})

function saveData(obj){
    let id = obj.id
    chrome.storage.local.set({[id]: "bookmark"}, function(){
        console.log("The value is bookmark lol")
    })
    
}

var store = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            console.log(res[id])
            console.log("///////////////////////////")
            resolve(res[id])
    
        })
    })
}

function initialize(){
    for(var i=0; i < result.length; i++){
        if (result[i].children){  
            let folder = new Folder(result, result[i])
            printFolder(folder)
            saveData(folder.object)
            
        }
        else if (!result[i].children){
            let bookmark = new Bookmark(result, result[i])
            printBookmark(bookmark)
            saveData(bookmark.object)
        }
    }
    $(".folder").each( function () {
        let object = findIt(result, this.id)
        onClickOpen(object)

    })
    $(".btn").each( function(){
        let testId = this.id
        let object = findIt(result, testId)
        tagOpen(object, testId)
    }) 
    
}

async function tagOpen(object, id){
    let tags = ["Work", "Entertainment", "For later"]
    let tagList = []
    let text = "HI there it's a me " + await store(id)
    let test = $('<div>',{
        "class":  "btn-primary test d-block-flex",
        "text": "Tags: "
    })
    $('#' + id).mouseenter(function() {
        window.el = $(this);
          myTimeout = setTimeout(function() {
            $("#b" + id).after(test)
            for(var i=tags.length -1 ; i >= 0; i--){
                let tag = $('<div>',{
                    "class": "btn-danger test d-inline-flex my-3 p-2",
                    "text": tags[i]
                })
                tagList.push(tag)
                test.after(tag)
            }
          }, 500);
      }).mouseleave(function() {
          clearTimeout(myTimeout);
          test.remove()
          for(var i=0; i < tagList.length;i++){
              tagList[i].remove()
          }

      });
    
    
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

    }
    $(objId).removeClass("open");
    if (arguments.length == 1) {
        $(objId).remove();
    }


}




