//Look at line 86
var result;
var count = 0;
var objectValue;
document.addEventListener('DOMContentLoaded', async function () {
    
    await search;
    console.log(result)
    let colNum = await findColNum()
    await title()
    grid(colNum + 1,counting(result))
    clickRemove()
    findBox(colNum)
})



async function title(){
    console.log("hihihi")
    let colours = ["#ED6A5A", "#F4F1BB", "#9BC1BC", "#2CC1CC", "#E6EBE0", "#4C56DB", "#916482"]
    let colNames = await stored("tags")
    colNames = colNames.split(",")
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
    colNum = colNum.split(",").length
    return colNum
}

function findBox(num){
    $(".grid").on("click", function() {
        let col = this.id.slice(0,1)
        let rowId = this.id.slice(1)
        setStorage(rowId, col)

        
    });
}
//Work on this to make it set the storage as the old one plus the new one
async function setStorage(id, type){
    let tags = await stored("tags")
    let tagIndex, newTag;
    tags = tags.split(",")
    console.log(tags)
    let alph = "abcdefghijklmnopqrstuvwxyz".split("")
    console.log(typeof alph)
    console.log(alph)
    for(var i=0; i < alph.length;i++){
        if(alph[i] == type){
            tagIndex = i
            break
        }
        
    }
    let prev = await stored(id)
    console.log(prev)
    if(prev){
        newTag = prev + "," + tags[tagIndex]
    }
    else {
        newTag = tags[tagIndex]
    }
    chrome.storage.local.set({[id]: newTag}, function() {
        console.log(newTag)
    })

    
}


function grid(x,y){
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
            printBookmark(val, x)
        }
        else {
            printFolder(val, x)
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
            console.log(res[id])
            console.log("///////////////////////////")
            resolve(res[id])
    
        })
    })
}


function printFolder(folder, x){
    let alph = "abcdefghijklmnopqrstuvwxyz".split("")
    let incep = checkIncep(folder)
    let rowDiv = $("<div>", {"class":"row d-flex", id: "r" + String(folder.id)})
    let div = $("<div>", {
        "class": "p-1 col-5",
        "id": "a" + String(folder.id)
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
        let identification = String(alph[i]) + String(folder.id)
        let styleAttribute = ""
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid"
        }
        let $div = $("<div>", {"class":"grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.appendTo(rowDiv)
        switch(i){    
            case 0: 
                $($div).hover(function () {
                    $(this).css("background-color", "#ED6A5A")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 1:
                $($div).hover(function () {
                    $(this).css("background-color", "#F4F1BB")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 2:
                $($div).hover(function () {
                    $(this).css("background-color", "#9BC1BC")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 3:
                $($div).hover(function () {
                    $(this).css("background-color", "#2CC1CC")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 4:
                $($div).hover(function () {
                    $(this).css("background-color", "#E6EBE0")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 5:
                $($div).hover(function () {
                    $(this).css("background-color", "#4C56DB")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 6:
                $($div).hover(function () {
                    $(this).css("background-color", "#916482")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            default:
                console.log("What the mario")
                break
                
        }
    }
    rowDiv.appendTo("#grid")
}



async function printBookmark(bookmark, x){
    let alph = "abcdefghijklmnopqrstuvwxyz".split("")
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
        "id": "a" + String(bookmark.id)
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
    for(var i=0; i < (x - 1); i++){
        let identification = String(alph[i]) + String(bookmark.id)
        let styleAttribute = ""
        if (i%2==0){
            styleAttribute += "border-left: 1px solid;border-right: 1px solid"
        }
        let $div = $("<div>", {"class": "grid p-1 flex-fill", id: identification, "style": styleAttribute})
        $div.appendTo(rowDiv)
        switch(i){    
            case 0: 
                $($div).hover(function () {
                    $(this).css("background-color", "#ED6A5A")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 1:
                $($div).hover(function () {
                    $(this).css("background-color", "#F4F1BB")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 2:
                $($div).hover(function () {
                    $(this).css("background-color", "#9BC1BC")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 3:
                $($div).hover(function () {
                    $(this).css("background-color", "#2CC1CC")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 4:
                $($div).hover(function () {
                    $(this).css("background-color", "#E6EBE0")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 5:
                $($div).hover(function () {
                    $(this).css("background-color", "#4C56DB")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            case 6:
                $($div).hover(function () {
                    $(this).css("background-color", "#916482")
                }, function () {
                        $(this).css("background-color", "#778899")
                })
                break
            default:
                console.log("What the mario")
                break
                
        }
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