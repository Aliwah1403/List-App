import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Loader
document.addEventListener('DOMContentLoaded', function () {
    let loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 2000);
})

const appSettings = {
    databaseURL: "https://peach-list-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "list")


const inputField = document.getElementById('input-field');
const addButton = document.getElementById('add-button');
const shoppingList = document.getElementById('shopping-list')


// Fetching and Updating DB in realtime
onValue(itemsInDB, (snapshot) => {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearList();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendShoppingList(currentItem)
        }
    } else {
        shoppingList.innerHTML = "No items here... yet";
    }
})



// Button Functionality
addButton.addEventListener('click', () => {
    let inputValue = inputField.value;

    if (inputValue === "") {
        return;
    }
    push(itemsInDB, inputValue)

    clearInputField()

})


// Needed Functions
const clearInputField = () => {
    inputField.value = "";
}

const appendShoppingList = (item) => {
    let itemID = item[0]
    let itemValue = item[1]

    let newElement = document.createElement("li")

    newElement.textContent = itemValue;



    newElement.addEventListener('click', () => {
        let itemLocation = ref(database, `list/${itemID}`);
        remove(itemLocation);


    })
    shoppingList.append(newElement)
}

const clearList = () => {
    shoppingList.innerHTML = "";
}
