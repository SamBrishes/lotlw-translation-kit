document.addEventListener("DOMContentLoaded", function() {

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
        console.log(field, length.length);
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
                    this.parentElement.parentElement.classList.add("translated");
                } else {
                    this.classList.remove("is-valid");
                    this.parentElement.parentElement.classList.remove("translated");
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
});
