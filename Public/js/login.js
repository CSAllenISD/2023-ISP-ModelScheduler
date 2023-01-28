fetch('./login.html')
    .then((response) => response.json())
    .then((data) => console.log(data));
