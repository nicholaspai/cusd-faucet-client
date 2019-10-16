
// Async timeout helper
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const sleep = async (ms) => {
    console.time("Slept for")
    await timeout(ms);
    console.timeEnd("Slept for")
    return
}