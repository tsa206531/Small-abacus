const { createApp } = Vue;

createApp({
    data() {
        return {
            display: '0',
            operator: null,
            firstOperand: null,
            isNewInput: true,
            isCalculating: false,
        };
    },
    methods: {
        // 數字輸入微互動
        appendNumber(number) {
            // 觸發按鈕彈跳動畫
            this.triggerButtonAnimation(event.target);
            
            // 觸發顯示器輸入動畫
            this.triggerDisplayAnimation('number-input');
            
            if (this.isNewInput) {
                this.display = number;
                this.isNewInput = false;
            } else {
                this.display += number;
            }
            
            // 添加打字機效果聲音（視覺反饋）
            this.addVisualFeedback();
        },
        
        // 運算符設置微互動
        setOperator(operator) {
            // 觸發按鈕彈跳動畫
            this.triggerButtonAnimation(event.target);
            
            if (this.firstOperand === null) {
                this.firstOperand = this.display;
                this.operator = operator;
                this.isNewInput = true;
                
                // 觸發運算符選中動畫
                this.triggerDisplayFlash();
            } else if (!this.isNewInput) {
                // 如果有前一個運算，先計算結果
                this.calculate(false);
                this.operator = operator;
                this.firstOperand = this.display;
                this.isNewInput = true;
            } else {
                // 更換運算符
                this.operator = operator;
            }
        },
        
        // 清除操作微互動
        clearDisplay() {
            // 觸發按鈕彈跳動畫
            this.triggerButtonAnimation(event.target);
            
            // 觸發清除動畫
            this.triggerDisplayAnimation('clear-animation');
            
            // 延遲清除，讓動畫先播放
            setTimeout(() => {
                this.display = '0';
                this.firstOperand = null;
                this.operator = null;
                this.isNewInput = true;
            }, 200);
        },
        
        // 計算結果微互動
        calculate(showAnimation = true) {
            // 觸發按鈕彈跳動畫
            if (event && event.target) {
                this.triggerButtonAnimation(event.target);
            }
            
            if (this.firstOperand !== null && this.operator !== null && !this.isNewInput) {
                this.isCalculating = true;
                
                // 顯示加載動畫（短暫）
                if (showAnimation) {
                    this.showLoadingAnimation();
                }
                
                setTimeout(() => {
                    let result;
                    const firstNum = parseFloat(this.firstOperand);
                    const secondNum = parseFloat(this.display);
                    
                    switch (this.operator) {
                        case '+':
                            result = firstNum + secondNum;
                            break;
                        case '-':
                            result = firstNum - secondNum;
                            break;
                        case '*':
                            result = firstNum * secondNum;
                            break;
                        case '/':
                            if (secondNum === 0) {
                                this.showError();
                                return;
                            }
                            result = firstNum / secondNum;
                            break;
                        default:
                            return;
                    }
                    
                    // 格式化結果
                    this.display = this.formatResult(result);
                    this.firstOperand = null;
                    this.operator = null;
                    this.isNewInput = true;
                    this.isCalculating = false;
                    
                    // 觸發結果動畫
                    if (showAnimation) {
                        this.triggerDisplayAnimation('result-animation');
                        this.hideLoadingAnimation();
                    }
                }, showAnimation ? 300 : 0);
            }
        },
        
        // 格式化結果
        formatResult(result) {
            // 處理無限小數
            if (result.toString().length > 12) {
                return parseFloat(result.toFixed(8)).toString();
            }
            return result.toString();
        },
        
        // 錯誤處理微互動
        showError() {
            this.display = 'Error';
            this.isCalculating = false;
            this.hideLoadingAnimation();
            
            // 觸發錯誤動畫
            this.triggerDisplayAnimation('error-animation');
            
            // 3秒後自動清除
            setTimeout(() => {
                this.clearDisplay();
            }, 2000);
        },
        
        // 按鈕動畫效果
        triggerButtonAnimation(buttonElement) {
            buttonElement.classList.add('bounce');
            setTimeout(() => {
                buttonElement.classList.remove('bounce');
            }, 300);
        },
        
        // 顯示器動畫效果
        triggerDisplayAnimation(animationClass) {
            const displayElement = document.querySelector('.display');
            displayElement.classList.add(animationClass);
            
            setTimeout(() => {
                displayElement.classList.remove(animationClass);
            }, animationClass === 'clear-animation' ? 500 : 600);
        },
        
        // 顯示器閃光效果
        triggerDisplayFlash() {
            const displayElement = document.querySelector('.display');
            displayElement.classList.add('flash');
            
            setTimeout(() => {
                displayElement.classList.remove('flash');
            }, 500);
        },
        
        // 視覺反饋效果
        addVisualFeedback() {
            // 創建動態粒子效果
            this.createParticleEffect();
        },
        
        // 粒子效果
        createParticleEffect() {
            const calculator = document.querySelector('.calculator');
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #4CAF50;
                border-radius: 50%;
                pointer-events: none;
                z-index: 100;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particle-float 1s ease-out forwards;
            `;
            
            calculator.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        },
        
        // 顯示加載動畫
        showLoadingAnimation() {
            let overlay = document.querySelector('.loading-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay';
                overlay.innerHTML = '<div class="loading-spinner"></div>';
                document.body.appendChild(overlay);
            }
            overlay.classList.add('show');
        },
        
        // 隱藏加載動畫
        hideLoadingAnimation() {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
        },
        
        // 鍵盤支持微互動
        handleKeyboard(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                this.appendNumber(key);
            } else if (['+', '-', '*', '/'].includes(key)) {
                this.setOperator(key);
            } else if (key === 'Enter' || key === '=') {
                this.calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                this.clearDisplay();
            }
        }
    },
    
    // 生命週期鉤子
    mounted() {
        // 添加鍵盤事件監聽
        document.addEventListener('keydown', this.handleKeyboard);
        
        // 添加粒子動畫CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particle-float {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-30px) scale(0);
                }
            }
            
            @keyframes error-animation {
                0%, 100% { 
                    background: linear-gradient(145deg, #f0f0f0, #ffffff);
                    color: #333;
                }
                25%, 75% { 
                    background: linear-gradient(145deg, #ffebee, #ffcdd2);
                    color: #f44336;
                    transform: translateX(-5px);
                }
                50% { 
                    transform: translateX(5px);
                }
            }
        `;
        document.head.appendChild(style);
        
        // 初始化入場動畫
        setTimeout(() => {
            document.querySelector('.calculator').style.transform = 'scale(1)';
        }, 100);
    },
    
    // 清理事件監聽器
    beforeUnmount() {
        document.removeEventListener('keydown', this.handleKeyboard);
    }
}).mount('#app');
