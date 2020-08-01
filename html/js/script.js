document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    /*
     |  ENABLE BOOTSTRAP 5 TOOLTIPs
     */
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    /*
     |  UPDATE FORM FIELD
     */
    function update(field, callback) {
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if(this.readyState === 4) {
                return callback(this.status === 200, this.responseText);
            }
        }
        xml.open("POST", "/translate");
        xml.send(field.name + "=" + field.value);
    }

    /*
     |  UPDATE ITEM COUNTER
     */
    function updateItems() {
        let field = document.querySelector('[data-value="length"]');
        let length = document.querySelectorAll("textarea.is-valid");
        if(field && length) {
            field.innerText = length.length;
        }
    }

    /*
     |  HANDLE TEXTAREA FIELDs
     */
    [].map.call(document.querySelectorAll("form textarea"), function(item) {
        item.addEventListener("focus", function() {
            if(!this.dataset.source) {
                this.dataset.source = this.value;
            }
        });
        item.addEventListener("blur", function() {
            if(this.dataset.source && this.dataset.source === this.value) {
                return;
            }
            this.disabled = true;

            update(this, (status, response) => {
                if(response !== this.placeholder) {
                    this.classList.add("is-valid");

                    let parent = this;
                    while(!parent.classList.contains("row")) {
                        parent = parent.parentElement;
                    }
                    parent.classList.add("translated");

                    if(this.nextElementSibling && this.nextElementSibling.tagName.toUpperCase() === "BUTTON") {
                        this.nextElementSibling.classList.add("d-none");
                    }
                } else {
                    this.classList.remove("is-valid");

                    let parent = this;
                    while(!parent.classList.contains("row")) {
                        parent = parent.parentElement;
                    }
                    parent.classList.remove("translated");

                    if(this.nextElementSibling && this.nextElementSibling.tagName.toUpperCase() === "BUTTON") {
                        this.nextElementSibling.classList.remove("d-none");
                    }
                }
                this.value = response;
                this.dataset.source = response;
                this.disabled = false;

                // Update Items
                updateItems();
            });
        });
    });

    /*
     |  HANDE CHECKBOX
     */
    let hideME = document.querySelector("#hideTranslated");
    if(hideME) {
        hideME.checked = false;
        hideME.addEventListener("change", function() {
            let form = document.querySelector("form");
            if(!form.classList.contains("hide-translated") && this.checked) {
                form.classList.add("hide-translated");
            } else if(form.classList.contains("hide-translated") && !this.checked) {
                form.classList.remove("hide-translated");
            }
        });
    }

    /*
     |  MARK AS TRANSLATED
     */
    function mark(field, callback) {
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function() {
            if(this.readyState === 4) {
                return callback(this.status === 200, this.responseText);
            }
        }
        xml.open("POST", "/mark");
        xml.send("field=" + field.name);
    }

    /*
     |  LOAD MARK BUTTONs
     */
    [].map.call(document.querySelectorAll('[data-type="mark"]'), function(item) {
        item.addEventListener("click", function(event) {
            event.preventDefault();
            mark(this.previousElementSibling, function(status, text) {
                if(!status) {
                    return false;
                }

                // Destroy Tooltip
                bootstrap.Tooltip.getInstance(item).dispose();

                // Mark as Translate
                item.previousElementSibling.classList.add("is-valid");
                let parent = item.previousElementSibling;
                while(!parent.classList.contains("row")) {
                    parent = parent.parentElement;
                }
                parent.classList.add("translated");

                // Remove Button
                item.parentElement.removeChild(item);

                // Update Counter
                updateItems();
            });
        });
    });
});
