const API = "https://ordem-servico-754x.onrender.com";

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function showLoading() {
    document.getElementById("loading").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}