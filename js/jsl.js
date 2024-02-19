/**
 * Created by master on 01.03.16.
 * Updated for W22, use ViewController class and instance methods
 */

class ViewController {

    // this is the constructor for the controller instance that is created once the document has been loaded
    constructor(props) {
        this.listenersSet = false;
    }

    // this method is called after the constructor call and after the root view
    // has been set on the controller instance. The method will initialise the view,
    // mainly preparing the setting of listeners - the separation between the constructor
    // call, the setting of root and the call to the oncreate() method prepares the way
    // view controllers will be handled within the mwf framework
    oncreate() {
        console.log("oncreate(): root is: ", this.root);
        this.prepareListeners();
    }

    prepareListeners() {
        // instance methods that implement listener functionality are wrapped
        // into functions, within which the reference of "this" is the actual
        // controller instance
        // once listeners are supposed to be removable, they cannot
        // be declared as anonymous functions as the removeEventListener method
        // requires passing a reference to the listener that shall be removed
        this.fadeoutToastHandler = (evt) => this.fadeoutToast(evt);
        this.finaliseToastHandler = (evt) => this.finaliseToast(evt);
        this.onListItemSelectedHandler = (evt) => this.onListItemSelected(evt);
        // the loadNewItems function from the jsr.js script will be passed the root element
        this.loadNewItemsHandler = (evt) => loadNewItems(this.root);

        // prepare switching on/off the listeners
        this.toggleListenersElement = this.root.getElementsByClassName("toggle-listeners")[0];
        this.toggleListenersElement.onclick = () => {
            this.toggleListeners();
        }
    }

    // a method that reacts to the selection of a list item
    onListItemSelected(event) {
        // check in which phase we are
        if (event.eventPhase == Event.BUBBLING_PHASE) {
            // a helper function that looks up the target li element of the event
            function lookupEventTarget(el) {
                // rather than implement the lookup as a recursive function,
                // we could use the closest() function:
                // return el.closest("li");

                if (el.tagName.toLowerCase() == "li") {
                    return el;
                } else if (el.tagName.toLowerCase() == "ul") {
                    console.warn("lookupEventTarget(): we have already reached the list root!");
                    return null;
                } else if (el.parentNode) {
                    return lookupEventTarget(el.parentNode);
                }
            }

            // lookup the target of the event
            var eventTarget = lookupEventTarget(event.target);
            if (eventTarget) {
                // from the eventTarget, we find out the title of the list item, which is simply the text content of the li element
                this.showToast("selected: " + eventTarget.textContent);
            } else {
                this.showToast("list item target of event could not be determined!");
            }
        }
    }

    toggleListeners() {

        // we set an onclick listener on the list view and check from which item the event was generated
        // we also set a listener on the '+'-button that loads content from the server!
        var ul = this.root.getElementsByTagName("ul")[0];
        var newItem = this.root.querySelector(".new-item");

        this.root.classList.toggle("listeners-active");

        if (this.listenersSet) {
            newItem.removeEventListener("click", this.loadNewItemsHandler);
            newItem.setAttribute("disabled", "disabled");
            console.log("newItem.disabled: " + newItem.disabled);
            ul.removeEventListener("click", this.onListItemSelectedHandler);
            this.showToast("event listeners have been removed");
            this.listenersSet = false;
        } else {
            newItem.addEventListener("click", this.loadNewItemsHandler);
            newItem.removeAttribute("disabled");
            console.log("newItem.disabled: " + newItem.disabled);
            ul.addEventListener("click", this.onListItemSelectedHandler);
            this.showToast("event listeners have been set");
            this.listenersSet = true;
        }
    }

    /* show a toast and use a listener for transitionend for fading out */
    showToast(msg) {
        var toast = this.root.querySelector(".toast");
        if (toast.classList.contains("active")) {
            console.info("will not show toast msg " + msg + ". Toast is currently active, and no toast buffering has been implemented so far...");
        } else {
            console.log("showToast(): " + msg);
            toast.textContent = msg;
            /* initiate fading out the toast when the transition has finished nach Abschluss der Transition */
            toast.addEventListener("transitionend", this.fadeoutToastHandler);
            toast.classList.add("shown");
            toast.classList.add("active");
        }
    }

    finaliseToast(event) {
        var toast = event.target;
        console.log("finaliseToast(): " + toast.textContent, toast);
        toast.removeEventListener("transitionend", this.finaliseToastHandler);
        toast.classList.remove("active");
    }

    /* trigger fading out the toast and remove the event listener  */
    fadeoutToast(event) {
        var toast = event.target;
        console.log("fadeoutToast(): " + toast.textContent);
        /* remove tranistionend listener */
        toast.addEventListener("transitionend", this.finaliseToastHandler);
        toast.removeEventListener("transitionend", this.fadeoutToastHandler);
        toast.classList.remove("shown");
    }

}

window.onload = () => {
    const vc = new ViewController();
    vc.root = document.body;
    vc.oncreate();
}
