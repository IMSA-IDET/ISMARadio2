const GetSocketURL = containPassword => {
    let password = "";
    if (containPassword) {
        password = `/?password=${localStorage.getItem("PasswordSet")}`;
    }

    return `ws://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}${password}`;
}

const GetServerURL = () => `http://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}`;