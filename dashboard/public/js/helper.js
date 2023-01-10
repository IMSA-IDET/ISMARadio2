const GetSocketURL = containPassword => {
    let password = "";
    if (containPassword) {
        password = `/?password=${localStorage.getItem("PasswordSet")}`;
    }

    let protocol = "ws:";
    if (localStorage.getItem("HostSet").includes("https:")) {
        protocol = "wss:";
    }

    return `${protocol}//${localStorage.getItem("HostSet").replace("http://", "").replace("https://", "")}:${localStorage.getItem("PortSet")}${password}`;
}

const GetServerURL = () => `${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}`;

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