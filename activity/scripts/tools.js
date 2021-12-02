const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const easeOutQuad = (x) => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

const getIndex = (index, length) => {
    let newIndex = index % length;
    
    if (newIndex < 0) {
        newIndex = length + newIndex;
    }
    else if (newIndex == length) {
        newIndex = 0;
    }

    return newIndex;
}