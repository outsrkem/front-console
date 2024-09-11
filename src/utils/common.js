export function toLoginPage() {
    let wl = window.location
    let loginUrl = `${wl.protocol}//${wl.host}/authui/login.html` 
    return window.location.assign(loginUrl);
}