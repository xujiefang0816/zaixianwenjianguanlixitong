// 数据存储模块 - 模拟数据库功能

// 初始数据配置
const INITIAL_DATA = {
    // 系统设置
    settings: {
        fileTypes: [
            '采购计划审批表',
            '合同（协议）签订审批表',
            '付款申请单',
            '用印审批表',
            '付款单+用印审批（仅限验收报告）',
            '工作联系单',
            '固定资产验收单',
            '会议议题',
            '借印审批表',
            '请假申请表',
            '差旅申请表',
            '其他'
        ],
        departments: [
            '前厅FO',
            '客房HSKP',
            '西餐厅',
            '中餐厅',
            '大堂吧',
            '宴会厅',
            '迷你吧',
            '餐饮办公室',
            '管事部',
            '饼房',
            '财务FIN',
            '行政EO',
            '人事HR',
            '员工餐厅',
            '销售S&M',
            '工程ENG'
        ],
        units: [
            '/',
            '批',
            '个（支）',
            '件',
            '套',
            '份',
            '只',
            '台',
            '桶',
            '次',
            '块',
            '人',
            '盒',
            '瓶',
            '双',
            '张',
            '月',
            '年',
            '克（g）',
            '千克（kg）',
            '箱',
            '米',
            '平方米',
            '包',
            '袋',
            '家',
            'PCS',
            'PAC',
            '佣金（%）',
            '其他'
        ],
        statuses: [
            '完毕',
            '总秘（酒店总经理）',
            '待送集团',
            '业主代表',
            '陆总及彭总（盖章处）',
            '集团审核',
            '集团经理待签',
            '退回',
            '未盖章',
            '重签',
            '作废',
            '资产管理部',
            '招采办',
            '酒店内部走签',
            '急单',
            '已签未付'
        ]
    },
    // 用户信息
    users: [
        {
            id: '1',
            username: 'TYL2025',
            password: '941314aA',
            role: 'superadmin', // superadmin, admin, user
            roleName: '总管理员'
        },
        {
            id: '2',
            username: '8888',
            password: '8888',
            role: 'admin',
            roleName: '普通管理员'
        },
        {
            id: '3',
            username: '1001',
            password: '1001',
            role: 'user',
            roleName: '普通账号'
        }
    ],
    // 文件数据
    files: []
};

// 数据管理类
class DataManager {
    constructor() {
        // 初始化数据
        this.initializeData();
    }

    // 初始化数据 - 从localStorage加载或使用默认数据
    initializeData() {
        // 加载设置
        const savedSettings = localStorage.getItem('fileSystemSettings');
        this.settings = savedSettings ? JSON.parse(savedSettings) : INITIAL_DATA.settings;

        // 加载用户
        const savedUsers = localStorage.getItem('fileSystemUsers');
        this.users = savedUsers ? JSON.parse(savedUsers) : INITIAL_DATA.users;

        // 加载文件
        const savedFiles = localStorage.getItem('fileSystemFiles');
        this.files = savedFiles ? JSON.parse(savedFiles) : INITIAL_DATA.files;
    }

    // 保存设置到localStorage
    saveSettings() {
        localStorage.setItem('fileSystemSettings', JSON.stringify(this.settings));
    }

    // 保存用户到localStorage
    saveUsers() {
        localStorage.setItem('fileSystemUsers', JSON.stringify(this.users));
    }

    // 保存文件到localStorage
    saveFiles() {
        localStorage.setItem('fileSystemFiles', JSON.stringify(this.files));
    }

    // 获取设置
    getSettings() {
        return this.settings;
    }

    // 用户认证
    authenticate(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        return user || null;
    }

    // 获取当前登录用户
    getCurrentUser() {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return null;
        return this.users.find(u => u.id === userId);
    }

    // 设置当前登录用户
    setCurrentUser(userId) {
        localStorage.setItem('currentUserId', userId);
    }

    // 登出用户
    logout() {
        localStorage.removeItem('currentUserId');
    }

    // 文件操作
    // 添加文件
    addFile(fileData) {
        const newFile = {
            id: Date.now().toString(),
            ...fileData,
            createTime: new Date().toISOString(),
            status: '酒店内部走签', // 默认状态
            returnReason: ''
        };
        this.files.unshift(newFile); // 添加到数组开头
        this.saveFiles();
        
        // 触发数据更新事件
        this.notifyDataChange();
        
        return newFile;
    }

    // 获取所有文件
    getAllFiles() {
        return this.files;
    }

    // 根据ID获取文件
    getFileById(id) {
        return this.files.find(file => file.id === id);
    }

    // 更新文件
    updateFile(id, updatedData) {
        const index = this.files.findIndex(file => file.id === id);
        if (index !== -1) {
            // 如果更新了状态，添加状态设置时间
            if (updatedData.status && updatedData.status !== this.files[index].status) {
                updatedData.statusUpdateTime = new Date().toISOString();
            }
            
            this.files[index] = { ...this.files[index], ...updatedData };
            this.saveFiles();
            
            // 触发数据更新事件
            this.notifyDataChange();
            
            return this.files[index];
        }
        return null;
    }

    // 删除文件
    deleteFile(id) {
        const index = this.files.findIndex(file => file.id === id);
        if (index !== -1) {
            this.files.splice(index, 1);
            this.saveFiles();
            
            // 触发数据更新事件
            this.notifyDataChange();
            
            return true;
        }
        return false;
    }

    // 批量删除文件
    batchDeleteFiles(ids) {
        this.files = this.files.filter(file => !ids.includes(file.id));
        this.saveFiles();
        
        // 触发数据更新事件
        this.notifyDataChange();
        
        return true;
    }

    // 批量更新文件状态
    batchUpdateStatus(ids, status) {
        const currentTime = new Date().toISOString();
        
        this.files.forEach(file => {
            if (ids.includes(file.id)) {
                file.status = status;
                file.statusUpdateTime = currentTime; // 添加状态设置时间
                
                if (status === '完毕') {
                    file.endDate = new Date().toISOString().split('T')[0];
                } else if (file.status === '完毕') {
                    file.endDate = '';
                }
            }
        });
        this.saveFiles();
        
        // 触发数据更新事件
        this.notifyDataChange();
        
        return true;
    }

    // 用户管理
    // 添加用户
    addUser(userData) {
        // 检查用户名是否已存在
        if (this.users.find(u => u.username === userData.username)) {
            return { success: false, message: '用户名已存在' };
        }
        
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            roleName: this.getRoleName(userData.role)
        };
        this.users.push(newUser);
        this.saveUsers();
        return { success: true, user: newUser };
    }

    // 删除用户
    deleteUser(id) {
        // 不能删除最后一个总管理员
        const superAdmins = this.users.filter(u => u.role === 'superadmin');
        const userToDelete = this.users.find(u => u.id === id);
        
        if (userToDelete && userToDelete.role === 'superadmin' && superAdmins.length <= 1) {
            return { success: false, message: '至少需要保留一个总管理员' };
        }
        
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveUsers();
            return { success: true };
        }
        return { success: false, message: '用户不存在' };
    }

    // 获取角色名称
    getRoleName(role) {
        const roleMap = {
            'superadmin': '总管理员',
            'admin': '普通管理员',
            'user': '普通账号'
        };
        return roleMap[role] || role;
    }

    // 设置管理
    // 添加文件类型
    addFileType(type) {
        if (!this.settings.fileTypes.includes(type)) {
            this.settings.fileTypes.push(type);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 删除文件类型
    deleteFileType(type) {
        const index = this.settings.fileTypes.indexOf(type);
        if (index !== -1) {
            this.settings.fileTypes.splice(index, 1);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 添加部门
    addDepartment(dept) {
        if (!this.settings.departments.includes(dept)) {
            this.settings.departments.push(dept);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 删除部门
    deleteDepartment(dept) {
        const index = this.settings.departments.indexOf(dept);
        if (index !== -1) {
            this.settings.departments.splice(index, 1);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 添加计量单位
    addUnit(unit) {
        if (!this.settings.units.includes(unit)) {
            this.settings.units.push(unit);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 删除计量单位
    deleteUnit(unit) {
        const index = this.settings.units.indexOf(unit);
        if (index !== -1) {
            this.settings.units.splice(index, 1);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 添加送签状态
    addStatus(status) {
        if (!this.settings.statuses.includes(status)) {
            this.settings.statuses.push(status);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 删除送签状态
    deleteStatus(status) {
        const index = this.settings.statuses.indexOf(status);
        if (index !== -1) {
            this.settings.statuses.splice(index, 1);
            this.saveSettings();
            return true;
        }
        return false;
    }

    // 通知数据变更
    notifyDataChange() {
        // 创建自定义事件通知UI更新
        const event = new CustomEvent('fileDataChanged');
        if (typeof window !== 'undefined') {
            window.dispatchEvent(event);
        }
        
        // 复制一份数据到sessionStorage，触发storage事件（用于跨标签页同步）
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('fileSystemDataSync', Date.now().toString());
        }
    }
    
    // 导出数据为Excel格式
    exportToExcel() {
        const files = this.getAllFiles();
        if (files.length === 0) {
            return null;
        }
        
        // 创建CSV内容
        let csv = '日期,文件类型,文件编号,申请部门,申请人,文件内容,计量单位,数量,金额,结束日期,送签状态,退回原因\n';
        
        files.forEach(file => {
            const row = [
                file.date || '',
                file.fileType || '',
                file.fileNumber || '',
                file.department || '',
                file.applicant || '',
                `"${file.content || ''}"`, // 处理包含逗号的内容
                file.unit || '',
                file.quantity === 0 ? '/' : (file.quantity || ''),
                file.amount === 0 ? '/' : (file.amount || ''),
                file.endDate || '',
                file.status || '',
                `"${file.returnReason || ''}"`
            ].join(',');
            csv += row + '\n';
        });
        
        // 创建Blob并下载
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `文件管理系统_导出_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    }
}

// 创建数据管理器实例
dataManager = new DataManager();

// 为了方便调试，将dataManager暴露到window对象
if (typeof window !== 'undefined') {
    window.dataManager = dataManager;
}