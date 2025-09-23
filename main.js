//https://processsystech.azurewebsites.net/Subscriber/Subscriber/52134?parkId=16

// Imaginary set of customer data
import {customers} from "./dataset.js";

// List element to contain the customer data
const list = document.querySelector("#customerList");

// Load list of checked license plates from memory
let checkedPlates = loadMemory() || [];
console.log("Memory loaded: ", checkedPlates);

// Build list with the data set
displayCustomers(customers);
console.log("List created: ", customers);

// Mark checkboxes with data fetched from memory
const checkboxes = document.querySelectorAll("input[type='checkbox']");
console.log("Check boxes loaded: ",checkboxes);
checkboxes.forEach(checkbox => {
	if(checkedPlates.includes(checkbox.id)){
		checkbox.checked = true;
	}
});


// Add event listener to the checkboxes so that they can save/delete license plate
checkboxes.forEach(checkbox => {
	checkbox.addEventListener("change", (e)=>{
		if(!checkedPlates.includes(e.target.id) && e.target.checked){
			checkedPlates.push(e.target.id);
			updateMemory();
			console.log("Plate saved: ", e.target.id)
		}
		else{
			checkedPlates.splice(checkedPlates.indexOf(e.target.id), 1);
			updateMemory();
			console.log("Plate deleted: ", e.target.id)
		}
	});
});

// If more than one plate in card is ticket off, the card must turn gray
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", (e) => {
    const card = e.target.closest(".card"); // parent card element
    const checked = card.querySelectorAll("input[type=checkbox]:checked");

    if (checked.length > 0) {
      card.classList.add("crossed"); // add gray style
    } else {
      card.classList.remove("crossed"); // restore normal
    }
  });
});

// Implement clear button
const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", (e)=>{
	const searchField = document.querySelector("#searchField");
	const cards = document.querySelectorAll(".card");
	searchField.value = "";
	cards.forEach(card => {
		card.classList.remove("hidden");
	});
});

// Implement a reset button to clear memory and refresh the page.
// Button must confirm action
const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", (e) => {
	if(window.confirm("Are you sure you want to reset the app?")){
		localStorage.clear();
		loadMemory();
		window.location.reload();
	}
});


// Implement the search field filteration
const cards = document.querySelectorAll(".card");
const searchField = document.querySelector("#searchField");

// better to use 'input' event so it reacts as you type
searchField.addEventListener("input", (e) => {
  const search = e.target.value.trim().toLowerCase();
  console.log("s");
  cards.forEach(card => {
    // get all checkboxes inside this card
    const checkboxes = card.querySelectorAll("input[type=checkbox]");
    
    // check if any checkbox id includes the search text
    const match = Array.from(checkboxes).some(cb =>
      cb.id.toLowerCase().startsWith(search)
    );

    if (match || search === "") {
      card.classList.remove("hidden"); // show matching cards
    } else {
      card.classList.add("hidden"); // hide non-matching
    }
  });
});


function displayCustomers(customerList){
	list.innerHTML = "";	
	customers.forEach(customer => {
		const card = document.createElement("div");
		card.classList.add("card");
		const idField = document.createElement("span");
		idField.textContent = "#" + customer.id;
		card.append(idField);
		customer.plates.forEach(plate => {
			const label = document.createElement('label');
		    label.setAttribute("for", plate);
		    label.textContent = plate;
		    const checkbox = document.createElement('input');
		    checkbox.setAttribute("id", plate);
		    checkbox.type = 'checkbox';
		    if(checkedPlates.includes(plate)){
		    	card.classList.add("crossed");
		    }
		    card.append(checkbox,label)

		});
		list.append(card);
	});
}

function updateMemory(){
	localStorage.setItem("checkedPlates", JSON.stringify(checkedPlates))
}

function loadMemory(){
	if(localStorage.getItem("checkedPlates")){
		return JSON.parse(localStorage.getItem("checkedPlates"))
	}
}

//localStorage.clear();



// checkbox.addEventListener("change", e => {
// 	e.preventDefault();
// 	if(e.target.checked && !checkedPlates.includes(e.target.id)){
// 		checkedPlates.push(e.target.id);
// 	} else if(!e.target.checked && checkedPlates.includes(e.target.id)){
// 		checkedPlates.splice(checkedPlates.indexOf(e.target.id , 1));
// 	}
// 	saveCheckedPlates();
// 	console.log(checkedPlates);
// });
