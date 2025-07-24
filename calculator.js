document.addEventListener('DOMContentLoaded', function() {
    // 输入页面元素
    const workDateInput = document.getElementById('work-date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const salaryTypeInput = document.getElementById('salary-type');
    const salaryAmountInput = document.getElementById('salary-amount');
    const calculateBtn = document.getElementById('calculate-btn');
    
    // 结果页面元素
    const endWorkBtn = document.getElementById('end-work-btn');
    const inputPage = document.getElementById('input-page');
    const resultPage = document.getElementById('result-page');
    const workedTimeDisplay = document.getElementById('worked-time');
    const remainingTimeDisplay = document.getElementById('remaining-time');
    const earnedMoneyDisplay = document.getElementById('earned-money');
    const currentTimeDisplay = document.getElementById('current-time');
    
    let updateInterval;
    let scheduledStartTime;
    let scheduledEndTime;
    let salaryPerSecond = 0;
    
    // 设置默认值
    function setDefaultValues() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        workDateInput.value = `${year}-${month}-${day}`;
        startTimeInput.value = '09:00';
        endTimeInput.value = '18:00';
    }
    
    setDefaultValues();
    
    // 开始牛马生活按钮点击事件
    calculateBtn.addEventListener('click', function() {
        // 获取输入值
        const workDate = workDateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const salaryType = salaryTypeInput.value;
        const salaryAmount = parseFloat(salaryAmountInput.value);
        
        if (!workDate || !startTime || !endTime || isNaN(salaryAmount)) {
            alert('请填写所有必填字段（标有 * 的字段）');
            return;
        }
        
        // 计算日薪
        let dailySalary;
        switch(salaryType) {
            case 'monthly':
                dailySalary = salaryAmount / 21.75; // 平均每月工作日
                break;
            case 'yearly':
                dailySalary = salaryAmount / 261; // 平均年工作日
                break;
            default: // daily
                dailySalary = salaryAmount;
        }
        
        // 解析计划上班和下班时间
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const [year, month, day] = workDate.split('-').map(Number);
        
        // 创建计划上班和下班时间对象
        scheduledStartTime = new Date(year, month - 1, day, startHour, startMinute);
        scheduledEndTime = new Date(year, month - 1, day, endHour, endMinute);
        
        // 处理跨日情况（如夜班）
        if (scheduledEndTime <= scheduledStartTime) {
            scheduledEndTime.setDate(scheduledEndTime.getDate() + 1);
        }
        
        // 计算每日工作总秒数
        const totalWorkSeconds = (scheduledEndTime - scheduledStartTime) / 1000;
        salaryPerSecond = dailySalary / totalWorkSeconds;
        
        // 切换到结果页面
        inputPage.style.display = 'none';
        resultPage.style.display = 'block';
        
        // 开始实时更新
        updateDisplay();
        updateInterval = setInterval(updateDisplay, 1000);
    });
    
    // 结束牛马生活按钮点击事件
    endWorkBtn.addEventListener('click', function() {
        // 停止计时
        clearInterval(updateInterval);
        
        // 计算总工作时长和总薪资
        const now = new Date();
        const workedSeconds = Math.max(0, (now - scheduledStartTime) / 1000);
        const totalEarnings = workedSeconds * salaryPerSecond;
        
        // 显示总结信息
        alert(`今日牛马生活结束！\n\n上班时间: ${scheduledStartTime.toLocaleTimeString()}\n下班时间: ${scheduledEndTime.toLocaleTimeString()}\n已工作时间: ${formatTime(workedSeconds)}\n已赚金额: ${totalEarnings.toFixed(2)} 元`);
        
        // 返回输入页面
        resultPage.style.display = 'none';
        inputPage.style.display = 'block';
        
        // 重置默认值
        setDefaultValues();
    });
    
    // 更新显示内容
    function updateDisplay() {
        const now = new Date();
        
        // 更新当前时间显示
        currentTimeDisplay.textContent = now.toLocaleTimeString('zh-CN');
        
        // 计算已工作时间（秒），确保不小于0
        const workedSeconds = Math.max(0, (now - scheduledStartTime) / 1000);
        
        // 计算还需工作时间（秒），确保不小于0
        const remainingSeconds = Math.max(0, (scheduledEndTime - now) / 1000);
        
        // 格式化工作时间显示
        workedTimeDisplay.textContent = formatTime(workedSeconds);
        remainingTimeDisplay.textContent = formatTime(remainingSeconds);
        
        // 计算并显示已赚金额
        const earned = workedSeconds * salaryPerSecond;
        earnedMoneyDisplay.textContent = `${earned.toFixed(2)} 元`;
        
        // 如果已经超过下班时间，改变剩余时间颜色
        if (remainingSeconds <= 0) {
            remainingTimeDisplay.style.color = '#e74c3c';
        } else {
            remainingTimeDisplay.style.color = '#3498db';
        }
    }
    
    // 格式化时间为 HH:MM:SS
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
});
