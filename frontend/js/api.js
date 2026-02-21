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

const originalFetch = window.fetch;

window.fetch = async function (...args) {
    try {
        const response = await originalFetch(...args);

        if (response.status === 401) {
            logout();
            return Promise.reject("Unauthorized");
        }

        return response;

    } catch (error) {
        if (error instanceof TypeError) {
            console.warn("Servidor pode estar iniciando :: " + error);
        }

        throw error;
    }
};