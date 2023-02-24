const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const password = loginForm.password.value;
    const confirmPassword = loginForm.confirmPassword.value;
    const token = getToken(window.location.pathname)
    //console.log(token)
    
    sendAccountVerify(password, confirmPassword, token);
    
})

function getToken(str) {
    return str.split(':')[1];
}

async function sendAccountVerify(password, confirmPassword, token) {
    const response = await fetch("../verify", {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: `{"password": "${password}", "confirmPassword": "${confirmPassword}", "token": "${token}"}`,
    });

    response.json().then(data => {
	//const alertString = JSON.parse(data);
	console.log(data)
	if (data.reason){
	    alert(data.reason);
	}
	else if (data.error){
	    if (data.error == "Account successfully created."){
		window.location.href = "../login";
	    }
	    else if (data.error == "Account already verified."){
		window.location.href = "../login";
	    }
	    else {
		alert(data.error)
	    }
	}
    });
}
