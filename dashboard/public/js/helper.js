const GetSocketURL = containPassword => {
    let password = "";
    if (containPassword) {
        password = `/?password=${localStorage.getItem("PasswordSet")}`;
    }

    return `ws://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}${password}`;
}

const GetServerURL = () => `http://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}`;

const CheckPassword = () => {
    return new Promise((resolve, reject) => {
        fetch(GetServerURL() + "/checkPassword", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: localStorage.getItem("PasswordSet")
            })
        }).then(data => data.json()).then(json => {
            resolve(json);
        }).catch(err => {
            console.log(err);
        });
    });
}