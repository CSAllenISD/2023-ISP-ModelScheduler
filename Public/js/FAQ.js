document.addEventListener("DOMContentLoaded", function () {
	//Waits for HTML DOM content to load
	const dmButton = document.getElementById("darkmodeButton"); //Gets darkMode button id

	if (dmButton) {
		//Checks whether or not button was clicked for debug purposes
		dmButton.addEventListener("click", function () {
			console.log("Button was clicked!");
		});
	} else {
		console.error("Element with id 'darkMode' not found");
	}

	dmButton.addEventListener("click", toggleDm);
});

window.onload = function () {
	dmSwitch();
};

function dmSwitch() {
	//    var background = document.body;
	//  var boxes = document.querySelectorAll(".grayBox");
	//   background.classList.toggle("dark-mode");
	//  boxes.forEach(function(box) {
	//	box.classList.toggle("dm-grayBox");
	//  });
	if (getDm() == "true") {
		document.documentElement.classList.remove("light");
		document.documentElement.classList.add("dark");
	} else if (getDm() == "false") {
		document.documentElement.classList.add("light");
		document.documentElement.classList.remove("dark");
	}

	toggleDmButton();
}

function toggleDm() {
	if (
		localStorage.getItem("darkmode") == null ||
		localStorage.getItem("darkmode") == "false"
	) {
		localStorage.setItem("darkmode", "true");
	} else {
		localStorage.setItem("darkmode", "false");
	}

	dmSwitch();
}

function getDm() {
	if (localStorage.getItem("darkmode") == null) {
		return "false";
	} else {
		return localStorage.getItem("darkmode");
	}
}

function toggleDmButton() {
	let dmButton = document.getElementById("darkmode");
	if (getDm() == "false") {
		dmButton.setAttribute("src", "./images/moon.png");
	} else {
		dmButton.setAttribute("src", "./images/sun.png");
	}
}

function darkMode() {
	var dmButton = document.createElement("button");
	dmButton.id = "darkMode";
	dmButton.innerHTML = "Toggle Dark Mode";
	document.body.appendChild(dmButton);
	document.getElementById("darkmode").src = "./images/moon.png";
}

// // Get the modal
// var modal = document.getElementById("myModals");

// // Get the image and insert it inside the modal - use its "alt" text as a caption
// var img = document.getElementById("myImg");
// var modalImg = document.getElementById("img01");
// var captionText = document.getElementById("caption");

// function openModal() {
//     document.getElementById("myModals").style.display = "block";
// }

// function closeModal() {
//     document.getElementById("myModals").style.display = "none";
// }

// img.onclick = function(e){
//     let modal = document.getElementById('modal')
//     if(modal.style.display != "none"){
// 	if(modal == e.target){
// 	    modal.style.display = "none"
// 	}
//     }
// }
// img.onclick = function(){
//     modal.style.display = "block";
//     modalImg.src = this.src;
//     captionText.innerHTML = this.alt;
// }
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }
