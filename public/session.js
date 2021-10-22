if(! window.localStorage.getItem('token')){
    window.location.href = '/';
}
const logout = () => {
    fetch("/logout",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            token: token
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data["status"] === "Success"){
            window.localStorage.removeItem("token");
            window.location.href = '/'; 
        }
    });
}
const token = window.localStorage.getItem('token');
var u_info = {
    u_name: window.localStorage.getItem('u_name'),
    token: token
};

fetch("/tcheck",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
            token: token
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data["status"] !== "Success"){
                logout();
            } else {
                u_info = data["u_info"];
                window.localStorage.setItem('u_name', data['u_info']['u_name']);
            }
        });
       