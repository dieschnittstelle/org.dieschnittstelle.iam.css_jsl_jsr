/**
 * Created by master on 01.03.16.
 * Updated for W19, demonstrate alternatives for accessing server-side content and processing the result
 * Updated for W22, the root element will be passed by the view controller instance (see jsl.js)
 */
function loadNewItems(root) {
    console.log("loadNewItems()");

    var mode = "arg"; // alternatives: arg, promise, fetch

    var callbackfunction = function (textContent) {
        console.log("loaded textContent from server: " + textContent);
        var jsonContent = JSON.parse(textContent);

        // we assume jsonContent is an array and iterate over its members
        jsonContent.forEach(function (contentItem) {
            createListElementForContentItem(contentItem,root);
        });
    }

    console.log("mode: " + mode);

    const errormsg = "got error status accessing server-side data: ";

    if (mode == "promise") {
        xhr("GET", "data/listitems.json", null)
            .then(xhr => callbackfunction(xhr.responseText),
                xhr => alert(errormsg + xhr.status));
    }
    else if (mode == "fetch") {
        // note that the text() method on the response object returns a promise itself
        dofetch("GET", "data/listitems.json")
            .then(response => response.text(),
                response => alert(errormsg + response.status))
            .then(txt => {
                if (txt) {
                    callbackfunction(txt);
                }
            });
    }
    else {
        // we initiate an xmlhttprequest and read out its body
        xhr("GET", "data/listitems.json", null,
            xhr => callbackfunction(xhr.responseText),
            xhr => alert(errormsg + xhr.status));
    }

}

function createListElementForContentItem(item,root) {

    var li = document.createElement("li");
    li.textContent = item.title;
    var button = document.createElement("button");
    li.appendChild(button);
    button.classList.add("edit-item");
    button.classList.add("imgbutton");

    // add the element to the list
    root.getElementsByTagName("ul")[0].appendChild(li);

}
