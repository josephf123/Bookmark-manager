//Look at line 86
//Maybe make it display the page and then after change the colours bcz its taking a while to load
var result;
var count = 0;
var objectValue;
var colours = ["#ED6A5A", "#F4F1BB", "#9BC1BC", "#2CC1CC", "#E6EBE0", "#4C56DB", "#916482"]
var alph = "abcdefghijklmnopqrstuvwxyz".split("")
document.addEventListener('DOMContentLoaded', async function () {
    console.log(document.readyState)
    await search;
    console.log(result)
    let colNum = await findColNum()
    await title()
    await grid(colNum + 1,counting(result))
    clickRemove()
    $("#why").on("click"), function(){
        console.log("testing baby")
    }
    // $(".grid").on("click", function() {
    //     console.log("test")
    //     let col = this.id.slice(0,1)
    //     let rowId = this.id.slice(1)
    //     setStorage(rowId, col)

    // });
    //findBox()
})
window.onload = function (){
    console.log(document.readyState)

    $("#why").on("click"), function(){
        console.log("testing baby")
    }
}
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    $("#why").on("click"), function(){
        console.log("testing baby")
    }
});


async function title(){
    console.log("hihihi")

    let colNames = await stored("tags")
    colNames = colNames.split(",")
    colNames.pop()
    console.log(colNames)
    let $row = $("<div>", {"class": "row d-flex", "style": "flex:1"})
    let $title = $("<div>", {"class": "col-5 p-1", "text": "Bookmark title", "style": "border-style:solid none solid solid; border-width: 1px"})
    $title.appendTo($row)
    for(var i=0; i < colNames.length; i++){
        let styleAttribute = "flex:1;text-align:center; border-top: 1px solid;border-bottom:1px solid;"
        if (i%2 == 0){
            styleAttribute += ";border-left: 1px solid;border-right: 1px solid"
        }
        let $name = $("<div>", {"class": "", "text": colNames[i], "style": styleAttribute})
        $name.css("background-color", colours[i])
        $name.appendTo($row)
    }
    $row.appendTo("#grid")
}
async function tagDisplay(){
    let tag = await stored("tags")
    tag = tag.split(',')
    tag.pop()
    let encomp = $("<div>", {
        "class": "d-flex flex-row-reverse"
    })
    for(var i=tag.length -1; i >= 0; i--){
        console.log("hi")
        let div = $("<div>", {
            "text": tag[i],
            "class": "col-2",
            "style": "text-align: center"
        })
        encomp.append(div)
    }
    $("#anch").after(encomp)
}

function counting(result){
    let counts = 0
    for(var i=0; i < result.length; i++){
        if (result[i].children){ 
            for(var j=0; j < result[i].children.length;j++){
                counts += 1
            }
        }
        counts +=1
    }
    return counts
}


async function findColNum(){
    let colNum = await stored("tags")
    colNum = colNum.split(",").length -1
    return colNum
}

// function findBox(){
//     $(".grid").on("click", function() {
//         console.log("test")
//         let col = this.id.slice(0,1)
//         let rowId = this.id.slice(1)
//         setStorage(rowId, col)

//     });
// }
//Work on this to make it set the storage as the old one plus the new one
async function setStorage(element, id, type){
    let index = typeToIndex(type)
    let tags = await stored("tags")
    let tagIndex, newTag;
    tags = tags.split(",")
    tags.pop()
    console.log(tags)
    
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            tagIndex = i
            break
        }
        
    }
    let prev = await stored(id)
    console.log(prev)
    if(prev && prev != ","){
        newTag = prev + tags[tagIndex] + "," 
    }
    else {
        newTag = tags[tagIndex] + ","
    }
    await makeStorage(id, newTag)
    console.log(newTag)
    element.css("background-color", colours[index])
    element.on("mouseout", function(){
        simpleHover(element, true, colours[i], "#778899")
    })
    
}

var makeStorage = function (id, text){
    return new Promise(function (resolve, reject){
        chrome.storage.local.set({[id]: text})
        resolve(text)
    })
}

async function removeStorage(element, id, type){
    let index = typeToIndex(type)
    let tags = await stored("tags")
    let tagIndex, newTag;
    tags = tags.split(",")
    tags.pop()
    console.log(tags)
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            tagIndex = i
            break
        }
        
    }
    let prev = await stored(id)
    let str = tags[tagIndex] + ","
    newTag = prev.replace(str, "")
    console.log("this is the new tag", newTag)
    if ((newTag.charAt(newTag.length) != ",")){
        newTag.concat(",")
    }
    console.log(newTag)
    console.log(typeof newTag)
    await makeStorage(id, newTag)
    element.css("background-color", "#778899")
    element.on("mouseout", function(){
        simpleHover(element, false, colours[index], "#778899")
    })

}

async function grid(x,y){
    let size = 0;
    let index;
    let total = 0;
    let sizeCount;
    let inside = false;
    let val;
    let bookmark;
    for (var i = 0; i < y; i++) {      
        if (inside){
            val = result[index].children[size]
            bookmark = true
            size++
            if (size == sizeCount){
                inside = false
                size = 0
            }
        }
        else {
            if (result[i - total].children){
                index = i - total
                val = result[i - total]
                bookmark = false
                inside = true
                sizeCount = result[index].children.length
                total += sizeCount
            }
            else {
                val = result[i - total]
                bookmark = true
            }
            
        }
        if (bookmark){
            await printBookmark(val, x)
        }
        else {
            await printFolder(val, x)
        }
    }
}



// function grid(x,y){
//     // Use this for finding the button pressed
//     // function logNumber() {
//     //     $("#grids").on("click", ".grid", function() {
//     //         var value = $(this).text();
//     //         alert("You click "  +value);
//     //     });
//     // }
//     var content = "";
//     var num = 1;
//     for (var i = 1; i <= y; i++) {
//         for (var j = 1; j <= x; j++) {
//             if (j === 1) {
//                 content += "<div class='row'> <a class='agrid' href='#'><div class='grid p-1' id=" + num + "></div></a>";
//             } else if (j === x) {
//                 content += "<a class='agrid' href='#'> <div class='grid p-1 ' id=" + num + "></div></a></div>";
//             } else {
//                 content += "<a class='agrid' href='#'> <div class='grid p-1 ' id=" + num + "></div> </a>";
//             }
//             num++;
//         }
//     }
//     $("#grid").html(content);
// }

//Doesn't work right now (not sure if I even want it in)
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

// function get(data){
//     for(var i=0; i < data.length; i++){
//         if (data[i].children){  
//             let count = checkIncep(data[i])
//             printFolder(data[i], count)
//             get(data[i].children)
//         }
//         else if (!data[i].children){
//             let count = checkIncep(data[i])
//             printBookmark(data[i], count)
//         }
//     }
// }

var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
            //console.log(data)
        }
    })
})

var stored = function (id){
    return new Promise(function (resolve, reject){
        chrome.storage.local.get([id], function (res) {
            resolve(res[id])
    
        })
    })
}


async function printFolder(folder, x){
    let globOnline;
    let folderTag = await stored(String(folder.id))
    if (folderTag == undefined){
        globOnline = false
    }
    let incep = checkIncep(folder)
    let rowDiv = $("<div>", {"class":"row d-flex", id: "r" + String(folder.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "@" + String(folder.id)
    })
    let p = $("<p>", {
        "text": "----".repeat(incep) + folder.title,
        "class": "agrid",
        "style": "flex: 1; display: flex"
    })

    $(div).hover(function () {
        $(this).css("background-color", "#2BBBAD")
        }, function () {
            $(this).css("background-color", "#778899")
        }
    )
    p.appendTo(div)
    div.appendTo(rowDiv)
    for(var i=0; i < (x - 1); i++){
        let online;
        if (!globOnline){
            online = false
        }
        else{
            online = await checkIfTagged(bookmarkTag, i)
        }
        let identification = String(alph[i]) + String(folder.id)
        let styleAttribute = "border-bottom: 1px solid; "
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid;"
        }
        let $div = $("<div>", {"class":"grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.on("click", async function(){
            let type = identification.charAt(0)
            let id = identification.slice(1)
            let alreadyThere = checkIfTagged(folderTag, i)
            if (alreadyThere){
                console.log("testing")
                await removeStorage($div, id, type, i)
            }
            else{
                console.log("testing1")
                await setStorage($div, id, type, i)
            }
            
        })
        $div.appendTo(rowDiv)
        //First check if it has any tag at all bcz most of them won't
        simpleHover($div, online, colours[i], "#778899")
    }
    rowDiv.appendTo("#grid")
}

async function checkIfTagged(fold, index){
    if (fold != undefined){
        console.log("this is it bois", fold)
        let tags = await stored("tags")
        tags = tags.split(",")
        tags.pop()
        console.log(index, "this is index")
        let thisTag = tags[index]
        console.log(thisTag)
        if (fold.includes(thisTag)){
            console.log("yea baby")
            return true
        }
        else{
            console.log("who")

            return false
        }
    }
    else {
        console.log("whaa")
        return false
    }
}

function typeToIndex(type){
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            return i
        }    
    }
    return false
}

async function checkIfAlready(fold, type){
    if (fold != undefined){
        let tags = await stored("tags")
        let tagIndex
        tags = tags.split(",")
        tags.pop()
        console.log(tags)
        for(var i=0; i < alph.length;i++){
            if(alph[i] == type){
                tagIndex = i
                break
            }    
        }
        let thisTag = tags[tagIndex]

        if (fold.includes(thisTag)){
            console.log("yea babes")
            return true
        }
        else{
            console.log("who")

            return false
        }
    }
    else{
        console.log("this is epic")
        console.log(fold)
        return false
    }

}

function simpleHover(element, bool, col1, col2){
    if (!bool){
        let temp;
        temp = col1
        col1 = col2
        col2 = temp
    }
    element.css("background-color", col1)
    element.hover(function(){
        $(this).css("background-color", col2)
    }, function () {
        $(this).css("background-color", col1)  
    })

}

async function printBookmark(bookmark, x){
    let globOnline = true;
    let bookmarkTag = await stored(String(bookmark.id))
    if (bookmarkTag == undefined){
        globOnline = false
    }
    let incep = checkIncep(bookmark)
    let btext = bookmark.title
    if (btext.length > 80){
        btext = btext.slice(0,80) + "..."
    }
    if (btext.length > 75 && incep > 0) {
        btext = btext.slice(0,75) + "..."
    }
    let rowDiv = $("<div>", {"class": "row d-flex", id: "r" + String(bookmark.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "@" + String(bookmark.id)
    })
    let a = $("<a>", {
        "text": "----".repeat(incep) + btext,
        "href": bookmark.url,
        "class": "agrid",
        "style": "color: #6a1b9a;"
    })

    $(div).hover(function () {
        $(this).css("background-color", "#4285F4")
        }, function () {
            $(this).css("background-color", "#778899")
        })
    a.appendTo(div)
    div.appendTo(rowDiv)
    //What is this x for?
    //x is the number of columns needed
    for(var i=0; i < (x - 1); i++){
        let online;
        if (!globOnline){
            online = false
        }
        else{
            online = await checkIfTagged(bookmarkTag, i) 
        }
        let identification = String(alph[i]) + String(bookmark.id)
        let styleAttribute = "border-bottom: 1px solid; "
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid;"
        }
        let $div = $("<div>", {"class": "grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.on("click", async function(){
            let type = identification.charAt(0)
            let id = identification.slice(1)
            let bookmarkTag = await stored(String(id))
            let alreadyThere = await checkIfAlready(bookmarkTag, type)
            console.log(alreadyThere, "Spanish inquistion")
            if (alreadyThere){
                console.log("testing")
                await removeStorage($div, id, type)
            }
            else{
                console.log("testing1")
                await setStorage($div, id, type)
            }            

        })
        $div.appendTo(rowDiv)
        //First check if it has any tag at all bcz most of them won't
        simpleHover($div, online, colours[i], "#778899")
    }
    rowDiv.appendTo("#grid")

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