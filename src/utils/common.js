export function toLoginPage() {
    let url = `/authui/login.html?returnto=${encodeURIComponent(window.location.href)}`;
    return (window.location.href = url);
}

export function toUserCenter() {
    let url = `/console/#/accountInfo`;
    return (window.location.href = url);
}

export function toConsole() {
    let url = `/console`;
    return (window.location.href = url);
}

export function saveNavPath(activePath) {
    window.sessionStorage.setItem("active-path", activePath);
}

// Higher-order function for delay processing
// This function wraps an asynchronous request function and ensures that the response
// (whether successful or failed) is delayed by at least the specified waitTime
// If the request completes before waitTime, it will wait for the remaining time
// If the request takes longer than waitTime, it will resolve/reject immediately upon completion
export function withDelay(requestFn, waitTime = 320) {
    // Record the start time of the request
    const startTime = Date.now();

    const requestPromise = requestFn();
    return new Promise((resolve, reject) => {
        requestPromise
            .then((result) => {
                // Calculate time elapsed since the request started
                const elapsed = Date.now() - startTime;
                // Calculate remaining wait time (ensure it's not negative)
                const remainingWait = Math.max(0, waitTime - elapsed);
                // Resolve with the result after the remaining wait time
                setTimeout(() => {
                    resolve(result);
                }, remainingWait);
            })
            .catch((error) => {
                const elapsed = Date.now() - startTime;
                const remainingWait = Math.max(0, waitTime - elapsed);
                setTimeout(() => {
                    reject(error);
                }, remainingWait);
            });
    });
}
