{ // limit scope...
d3.json("/assets/presidential_data_2.json").then(function(data) {
    const button = document.getElementById("similarity-button");
    const button_text = document.createTextNode("");
    button.appendChild(button_text);

    const nearest = [
        "tfidf",
        "openai-ada-002",
        "openai-3-small"
    ].map(d => ({
        "data_key": d,
        "element": document.getElementById(`nearest-${d}`)
    }));

    let buttons = {};
    let active_key = 0;

    function setActive(key) {
        // Update selector button text and set active.
        const val = `${data[key][0]["author"]}-${data[key][0]["year"]}`;
        button_text.nodeValue = val;

        buttons[active_key].classList.remove("active");
        buttons[key].classList.add("active");
        active_key = key;

        // Update lists.
        nearest.forEach(l => {
            // Clear list.
            while(l["element"].lastChild) {
                l["element"].removeChild(l["element"].lastChild);
            }

            // Start at index 1, since index 0 is the same document...
            data[key].slice(1, 11).map(d => {
                let entry = document.createElement("li");
                entry.classList.add("list-group-item");
                entry.classList.add("align-items-start");
                l["element"].appendChild(entry);

                distance = d[`${l["data_key"]}_distance`];
                author = d[`${l["data_key"]}_author`];
                year = d[`${l["data_key"]}_year`];
                entry.appendChild(
                    document.createTextNode(
                        `(${distance.toFixed(3)}) ${author}-${year}`
                    )
                );
            });
        });
    }

    function selectHandler(e) {
        setActive(this.getAttribute("key"));
    }

    // Populate dropdown menu.
    const selector_list = document.getElementById("similarity-selector-list");
    for (let key in data) {
        let address = document.createElement("li");
        selector_list.appendChild(address)

        let button = document.createElement("button");
        button.classList.add("dropdown-item");
        button.setAttribute("key", key);
        address.appendChild(button);

        const val = `${data[key][0]["author"]}-${data[key][0]["year"]}`;
        let content = document.createTextNode(val);
        button.appendChild(content);
        button.addEventListener("click", selectHandler, key);

        buttons[key] = button;
    };

    // Set the first key active.
    setActive(0);
});
}
