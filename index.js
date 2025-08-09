const { createApp } = Vue;

createApp({
    data() {
        return {
            display: '',
            operator: null,
            firstOperand: null,
        };
    },
    methods: {
        appendNumber(number) {
            this.display += number;
        },
        setOperator(operator) {
            if (this.firstOperand === null) {
                this.firstOperand = this.display;
                this.operator = operator;
                this.display = '';
            }
        },
        clearDisplay() {
            this.display = '';
            this.firstOperand = null;
            this.operator = null;
        },
        calculate() {
            if (this.firstOperand !== null && this.operator !== null) {
                let result;
                switch (this.operator) {
                    case '+':
                        result = parseFloat(this.firstOperand) + parseFloat(this.display);
                        break;
                    case '-':
                        result = parseFloat(this.firstOperand) - parseFloat(this.display);
                        break;
                    case '*':
                        result = parseFloat(this.firstOperand) * parseFloat(this.display);
                        break;
                    case '/':
                        result = parseFloat(this.firstOperand) / parseFloat(this.display);
                        break;
                    default:
                        return;
                }
                this.display = result.toString();
                this.firstOperand = null;
                this.operator = null;
            }
        }
    }
}).mount('#app');