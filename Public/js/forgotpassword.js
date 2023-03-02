const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const firstName = loginForm.firstName.value;
    const lastName = loginForm.lastName.value;
    const email = loginForm.email.value;

    sendAccountCreate(firstName, lastName, email);
    
})

async function sendAccountCreate(firstName, lastName, email) {
    const response = await fetch("./forgotpassword", {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: JSON.stringify({firstName: firstName, lastName: lastName, email: email}),
    });

    console.log(response);

    response.json().then(data => {
	//const alertString = JSON.parse(data);
	//console.log(data)
	if (data.reason){
	    alert(data.reason);
	}
	else{
	    alert(data.error);
	}
    });
}
