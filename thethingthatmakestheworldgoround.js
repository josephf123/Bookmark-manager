function printFolder(folder, x){
    let alph = "abcdefghijklmnopqrstuvwxyz".split("")
    let incep = checkIncep(folder)
    let rowDiv = $("<div>", {"class":"row", id: "r" + String(folder.id)})
    let div = $("<div>", {
        "class": "py-1 pl-1",
        "id": "a" + String(folder.id)
    })
    let p = $("<p>", {
        "text": "----".repeat(incep) + folder.title,
        "class": "agrid",
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
        let $a = $("<a>", {"class":"agrid"})
        let $div = $("div", {"class":"grid p-1", id: String(alph[j]) + folder.id})
        $a.appendTo($div)
        $div.appendTo(rowDiv)
    }
    rowDiv.appendTo("#grid")
}

function printBookmark(bookmark, x){
    let alph = "abcdefghijklmnopqrstuvwxyz".split("")
    let incep = checkIncep(bookmark)
    let btext = bookmark.title
    if (btext.length > 80){
        btext = btext.slice(0,80) + "..."
    }
    let rowDiv = $("<div>", {"class": "row", id: "r" + String(bookmark.id)})
    let div = $("<div>", {
        "class": "py-1 pl-1",
        "id": "a" + String(bookmark.id),
    })
    let a = $("<a>", {
        "text": "----".repeat(incep) + btext,
        "href": bookmark.url,
        "class": "agrid",
        "style": "color: #6a1b9a"
    })

    $(div).hover(function () {
        $(this).css("background-color", "#4285F4")
        }, function () {
            $(this).css("background-color", "#778899")
        })
    a.appendTo(div)
    div.appendTo(rowDiv)
    console.log("testing this works")
    for(var i=0; i < (x - 1); i++){
        let $a = $("<a>", {"class":"agrid"})
        let $div = $("div", {"class":"grid p-1", id: String(alph[j]) + bookmark.id})
        $a.appendTo($div)
        $div.appendTo(rowDiv)
    }
    rowDiv.appendTo("#grid")

}







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