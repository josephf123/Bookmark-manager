let result;
var search = new Promise(function (resolve, reject) {
    chrome.bookmarks.getTree(function (data) {
        if (data) {
            result = data[0].children[0].children;
            resolve(data)
        }
    })
})
document.addEventListener('DOMContentLoaded', async function(){
    await search
    $("#clearTags").on("click", function (){
        clearTags(result)
        document.location.reload()
    })
    $("#clearInfo").on("click", function (){
        clearInfo(result)
    })
})
function clearInfo(res){
    for(var i=0; i < res.length;i++){
        if(res[i].children){
            clearInfo(res[i].children)
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
                console.log("All are cleared!")
            })
        }
    }
}
