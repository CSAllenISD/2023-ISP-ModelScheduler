const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const email = loginForm.username.value;
    const password = loginForm.password.value;
    
    sendLogin(email, password);
    
})

async function sendLogin(email, password) {
    var details = JSON.stringify({username: email, password: password});
    var formBody = new URLSearchParams();
    formBody.append('username', email);
    formBody.append('password', password);
    const response = await fetch("./login", {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: formBody.toString()
    });

    console.log(response);

    response.json().then(data => {
	//const alertString = JSON.parse(data);
	//console.log(data)
	if (data.reason){
	    alert(data.reason);
	}
	else if (data.error == "Success"){
	    window.location.href = "./classes";
	}
	else{
	    alert(data.error);
	}
    });
}
