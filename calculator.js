document.addEventListener('DOMContentLoaded', function() {
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const dailySalaryInput = document.getElementById('daily-salary');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result');
    const timeInfoDisplay = document.getElementById('time-info');
    
    let updateInterval;
    
    calculateBtn.addEventListener('click', function() {
        // 清除之前的计时器
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        
        // 获取输入值
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const dailySalary = parseFloat(dailySalaryInput.value);
        
        if (!startTime || !endTime || isNaN(dailySalary)) {
            alert('请填写所有字段');
            return;
        }
        
        // 解析时间
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        // 计算每日工作总秒数
        const startDate = new Date();
        startDate.setHours(startHour, startMinute, 0, 0);
        
        const endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);
        
        // 处理跨日情况（如夜班）
        if (endDate <= startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }
        
        const totalWorkSeconds = (endDate - startDate) / 1000;
        
        // 计算每秒工资
        const salaryPerSecond = dailySalary / totalWorkSeconds;
        
        // 更新显示
        function updateEarnings() {
            const now = new Date();
            let workStartToday = new Date();
            workStartToday.setHours(startHour, startMinute, 0, 0);
            
            // 如果还没到上班时间，使用昨天的上班时间
            if (now < workStartToday) {
                workStartToday.setDate(workStartToday.getDate() - 1);
            }
            
            // 计算已工作秒数
            let workedSeconds = (now - workStartToday) / 1000;
            
            // 如果已经超过下班时间，使用总工作秒数
            if (workedSeconds > totalWorkSeconds) {
                workedSeconds = totalWorkSeconds;
                timeInfoDisplay.textContent = '今日工作已完成';
            } else {
                const remainingSeconds = totalWorkSeconds - workedSeconds;
                const remainingHours = Math.floor(remainingSeconds / 3600);
                const remainingMinutes = Math.floor((remainingSeconds % 3600) / 60);
                timeInfoDisplay.textContent = `还需工作: ${remainingHours}小时${remainingMinutes}分钟`;
            }
            
            // 计算已赚金额
            const earned = workedSeconds * salaryPerSecond;
            resultDisplay.textContent = earned.toFixed(2) + ' 元';
        }
        
        // 立即更新一次
        updateEarnings();
        
        // 每秒更新
        updateInterval = setInterval(updateEarnings, 1000);
    });
    
    // 设置默认时间为常见的9:00-18:00
    startTimeInput.value = '09:00';
    endTimeInput.value = '18:00';
});
