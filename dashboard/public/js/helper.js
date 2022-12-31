const GetSocketURL = () => `ws://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}/?password=${localStorage.getItem("PasswordSet")}`;

const GetServerURL = () => `http://${localStorage.getItem("HostSet")}:${localStorage.getItem("PortSet")}`;