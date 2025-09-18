// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- SCIENTIFIC CALCULATOR ---
    const display = document.getElementById('result');
    const buttonsContainer = document.querySelector('.calculator .buttons');

    // A single event listener for all scientific calculator buttons
    buttonsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return; // If something other than a button is clicked, do nothing

        const value = button.dataset.value; // Get the action from the data-value attribute
        const currentDisplay = display.value;

        try {
            switch (value) {
                case 'C':
                    display.value = '';
                    break;
                case 'DEL':
                    display.value = currentDisplay.slice(0, -1);
                    break;
                case '=':
                    // Replace user-friendly symbols before evaluating
                    const expression = currentDisplay.replace(/×/g, '*').replace(/÷/g, '/');
                    // Use Function constructor for a safer evaluation than direct eval
                    const result = new Function('return ' + expression)();
                    display.value = result;
                    break;
                case '1/': // Reciprocal
                    display.value = 1 / parseFloat(currentDisplay);
                    break;
                case 'Math.pow(val, 3)': // Cube
                    display.value = Math.pow(parseFloat(currentDisplay), 3);
                    break;
                case '/100': // Percentage
                    display.value = parseFloat(currentDisplay) / 100;
                    break;
                default:
                    // For numbers and operators
                    display.value += value;
            }
        } catch (error) {
            display.value = 'Error';
        }
    });


    // --- MATRIX CALCULATOR ---
    const matrixAInput = document.getElementById('matrixA');
    const matrixBInput = document.getElementById('matrixB');
    const matrixResultOutput = document.getElementById('matrixResult');
    const matrixOps = document.querySelector('.matrix-operations');

    const getMatrix = (textarea) => {
        try {
            // Trim whitespace, split by new lines, then split by commas and convert to numbers
            const rows = textarea.value.trim().split('\n');
            const matrix = rows.map(row => row.split(',').map(Number));
            // Validate that all elements are numbers
            if (matrix.some(row => row.some(isNaN))) {
                return null;
            }
            return math.matrix(matrix);
        } catch {
            return null; // Return null if parsing fails
        }
    };

    const formatMatrix = (matrix) => {
        // Convert matrix array back to a string format
        return matrix.toArray().map(row => row.join(', ')).join('\n');
    };
    
    // A single event listener for all matrix operation buttons
    matrixOps.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const matrixA = getMatrix(matrixAInput);
        const matrixB = getMatrix(matrixBInput);
        let result;

        try {
            switch (button.id) {
                case 'add':
                    if (!matrixA || !matrixB) throw new Error("Invalid Matrix A or B");
                    result = math.add(matrixA, matrixB);
                    matrixResultOutput.value = formatMatrix(result);
                    break;
                case 'subtract':
                    if (!matrixA || !matrixB) throw new Error("Invalid Matrix A or B");
                    result = math.subtract(matrixA, matrixB);
                    matrixResultOutput.value = formatMatrix(result);
                    break;
                case 'multiply':
                    if (!matrixA || !matrixB) throw new Error("Invalid Matrix A or B");
                    result = math.multiply(matrixA, matrixB);
                    matrixResultOutput.value = formatMatrix(result);
                    break;
                case 'determinant':
                    if (!matrixA) throw new Error("Invalid Matrix A");
                    result = math.det(matrixA);
                    matrixResultOutput.value = result;
                    break;
                case 'inverse':
                    if (!matrixA) throw new Error("Invalid Matrix A");
                    result = math.inv(matrixA);
                    matrixResultOutput.value = formatMatrix(result);
                    break;
            }
        } catch (error) {
            matrixResultOutput.value = `Error: ${error.message}`;
        }
    });
});
