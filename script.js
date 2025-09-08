// 主逻辑脚本 - 处理界面交互和业务逻辑

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化系统
    initSystem();
    
    // 添加localStorage变化监听，实现跨标签页数据同步
    window.addEventListener('storage', handleStorageChange);
    
    // 添加文件数据变化监听，实现同标签页数据即时刷新
    window.addEventListener('fileDataChanged', handleFileDataChange);
});

// 处理localStorage变化事件
function handleStorageChange(event) {
    // 只有当文件数据发生变化或同步标记发生变化且当前在文件相关页面时才刷新
    if ((event.key === 'fileSystemFiles' || event.key === 'fileSystemDataSync') && event.newValue !== event.oldValue) {
        const currentPage = document.querySelector('.menu-item.bg-primary\/10').getAttribute('data-page');
        if (currentPage === 'file-info' || currentPage === 'file-process') {
            // 重新初始化数据管理器
            dataManager.initializeData();
            // 重新加载文件数据
            loadFilesData();
        }
    }
}

// 处理文件数据变化事件（同标签页）
function handleFileDataChange() {
    const currentPage = document.querySelector('.menu-item.bg-primary\/10').getAttribute('data-page');
    if (currentPage === 'file-info' || currentPage === 'file-process') {
        // 重新加载文件数据
        loadFilesData();
    }
}

// 系统初始化
function initSystem() {
    // 获取DOM元素引用
    initDOMReferences();
    
    // 初始化日期选择器（默认当前日期）
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('register-date').value = today;
    
    // 初始化登录表单
    initLoginForm();
    
    // 初始化密码显示切换
    initPasswordToggle();
    
    // 检查是否已登录
    checkLoginStatus();
    
    // 初始化侧边栏菜单
    initSidebar();
    
    // 初始化文件登记表单
    initFileRegisterForm();
    
    // 初始化模态框
    initModals();
    
    // 初始化确认对话框
    initConfirmDialog();
    
    // 初始化文件类型、部门、计量单位等下拉列表
    loadSystemSettings();
    
    // 绑定刷新按钮事件
    document.getElementById('refresh-file-info-btn')?.addEventListener('click', function() {
        loadFilesData();
        showToast('文件信息已刷新', 'success');
    });
    
    document.getElementById('refresh-file-process-btn')?.addEventListener('click', function() {
        loadFilesData();
        showToast('文件信息已刷新', 'success');
    });
}

// 获取DOM元素引用
function initDOMReferences() {
    // 登录相关
    window.loginContainer = document.getElementById('login-container');
    window.mainContainer = document.getElementById('main-container');
    window.loginForm = document.getElementById('login-form');
    window.loginError = document.getElementById('login-error');
    window.usernameInput = document.getElementById('username');
    window.passwordInput = document.getElementById('password');
    window.togglePasswordBtn = document.getElementById('toggle-password');
    window.logoutBtn = document.getElementById('logout-btn');
    window.currentUsername = document.getElementById('current-username');
    window.currentRole = document.getElementById('current-role');
    
    // 页面相关
    window.pageContents = document.querySelectorAll('.page-content');
    window.menuItems = document.querySelectorAll('.menu-item');
    
    // 文件登记表单
    window.fileRegisterForm = document.getElementById('file-register-form');
    window.fileTypeContainer = document.getElementById('file-type-container');
    window.otherFileTypeContainer = document.getElementById('other-file-type-container');
    window.otherFileTypeInput = document.getElementById('other-file-type');
    window.departmentSelect = document.getElementById('department');
    window.applicantInput = document.getElementById('applicant');
    window.fileContentInput = document.getElementById('file-content');
    window.unitSelect = document.getElementById('unit');
    window.otherUnitContainer = document.getElementById('other-unit-container');
    window.otherUnitInput = document.getElementById('other-unit');
    window.quantityInput = document.getElementById('quantity');
    window.amountInput = document.getElementById('amount');
    window.resetBtn = document.getElementById('reset-btn');
    
    // 文件信息页面
    window.fileInfoTableBody = document.getElementById('file-info-table-body');
    window.noFilesMessage = document.getElementById('no-files-message');
    
    // 文件处理页面
    window.fileProcessTableBody = document.getElementById('file-process-table-body');
    window.noProcessFilesMessage = document.getElementById('no-process-files-message');
    window.exportExcelBtn = document.getElementById('export-excel-btn');
    window.selectAllCheckbox = document.getElementById('select-all');
    window.batchStatusSelect = document.getElementById('batch-status-select');
    window.batchStatusBtn = document.getElementById('batch-status-btn');
    window.batchDeleteBtn = document.getElementById('batch-delete-btn');
    
    // 系统设置页面
    // 文件类型
    window.newFileTypeInput = document.getElementById('new-file-type');
    window.addFileTypeBtn = document.getElementById('add-file-type-btn');
    window.fileTypesList = document.getElementById('file-types-list');
    // 部门
    window.newDepartmentInput = document.getElementById('new-department');
    window.addDepartmentBtn = document.getElementById('add-department-btn');
    window.departmentsList = document.getElementById('departments-list');
    // 计量单位
    window.newUnitInput = document.getElementById('new-unit');
    window.addUnitBtn = document.getElementById('add-unit-btn');
    window.unitsList = document.getElementById('units-list');
    // 送签状态
    window.newStatusInput = document.getElementById('new-status');
    window.addStatusBtn = document.getElementById('add-status-btn');
    window.statusesList = document.getElementById('statuses-list');
    // 用户管理
    window.newUsernameInput = document.getElementById('new-username');
    window.newPasswordInput = document.getElementById('new-password');
    window.newRoleSelect = document.getElementById('new-role');
    window.addUserBtn = document.getElementById('add-user-btn');
    window.usersList = document.getElementById('users-list');
    
    // 模态框
    window.editFileModal = document.getElementById('edit-file-modal');
    window.closeModalBtn = document.getElementById('close-modal-btn');
    window.cancelEditBtn = document.getElementById('cancel-edit-btn');
    window.editFileForm = document.getElementById('edit-file-form');
    window.editFileIdInput = document.getElementById('edit-file-id');
    window.editDateInput = document.getElementById('edit-date');
    window.editFileTypeSelect = document.getElementById('edit-file-type');
    window.editFileNumberInput = document.getElementById('edit-file-number');
    window.editDepartmentSelect = document.getElementById('edit-department');
    window.editApplicantInput = document.getElementById('edit-applicant');
    window.editContentInput = document.getElementById('edit-content');
    window.editUnitSelect = document.getElementById('edit-unit');
    window.editQuantityInput = document.getElementById('edit-quantity');
    window.editAmountInput = document.getElementById('edit-amount');
    window.editStatusSelect = document.getElementById('edit-status');
    window.editReturnReasonContainer = document.getElementById('edit-return-reason-container');
    window.editReturnReasonInput = document.getElementById('edit-return-reason');
    
    // 确认对话框
    window.confirmDialog = document.getElementById('confirm-dialog');
    window.confirmMessage = document.getElementById('confirm-message');
    window.cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
    window.confirmBtn = document.getElementById('confirm-btn');
    
    // Toast提示
    window.toast = document.getElementById('toast');
    window.toastIcon = document.getElementById('toast-icon');
    window.toastMessage = document.getElementById('toast-message');
    
    // 加载中
    window.loading = document.getElementById('loading');
}

// 初始化登录表单
function initLoginForm() {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // 隐藏之前的错误信息
        loginError.classList.add('hidden');
        
        // 用户认证
        const user = dataManager.authenticate(username, password);
        if (user) {
            // 保存用户信息
            dataManager.setCurrentUser(user.id);
            
            // 显示主界面
            showMainInterface(user);
            
            // 清空表单
            loginForm.reset();
        } else {
            // 显示错误信息
            loginError.classList.remove('hidden');
        }
    });
}

// 初始化密码显示切换
function initPasswordToggle() {
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // 切换图标
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// 检查登录状态
function checkLoginStatus() {
    const user = dataManager.getCurrentUser();
    if (user) {
        showMainInterface(user);
    } else {
        showLoginInterface();
    }
}

// 显示登录界面
function showLoginInterface() {
    loginContainer.classList.remove('hidden');
    mainContainer.classList.add('hidden');
}

// 显示主界面
function showMainInterface(user) {
    // 更新用户信息显示
    currentUsername.textContent = user.username;
    currentRole.textContent = user.roleName;
    
    // 根据用户角色控制菜单显示
    updateMenuByRole(user.role);
    
    // 隐藏登录界面，显示主界面
    loginContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    
    // 默认显示文件登记页面
    showPage('file-register');
    
    // 加载文件数据
    loadFilesData();
    
    // 加载用户列表（如果是超级管理员）
    if (user.role === 'superadmin') {
        loadUsersList();
    }
}

// 根据用户角色更新菜单
function updateMenuByRole(role) {
    // 显示所有菜单
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('hidden');
    });
    
    // 根据角色隐藏相应菜单
    if (role === 'user') {
        document.querySelectorAll('.admin-only, .super-admin-only').forEach(item => {
            item.classList.add('hidden');
        });
    } else if (role === 'admin') {
        document.querySelectorAll('.super-admin-only').forEach(item => {
            item.classList.add('hidden');
        });
    }
}

// 初始化侧边栏菜单
function initSidebar() {
    // 侧边栏菜单点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // 退出按钮点击事件
    logoutBtn.addEventListener('click', function() {
        dataManager.logout();
        showLoginInterface();
        showToast('已成功退出登录', 'info');
    });
}

// 显示指定页面
function showPage(pageId) {
    // 隐藏所有页面
    pageContents.forEach(page => {
        page.classList.add('hidden');
    });
    
    // 显示指定页面
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        
        // 添加动画效果
        setTimeout(() => {
            targetPage.classList.add('fade-in');
        }, 10);
        
        // 移除其他页面的动画效果
        setTimeout(() => {
            targetPage.classList.remove('fade-in');
        }, 300);
    }
    
    // 更新菜单项高亮
    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('bg-primary/10', 'text-primary');
        } else {
            item.classList.remove('bg-primary/10', 'text-primary');
        }
    });
    
    // 如果切换到文件信息或文件处理页面，重新加载数据
    if (pageId === 'file-info' || pageId === 'file-process') {
        loadFilesData();
    }
    
    // 如果切换到系统设置页面，重新加载设置
    if (pageId === 'system-settings') {
        loadSystemSettings();
        const user = dataManager.getCurrentUser();
        if (user && user.role === 'superadmin') {
            loadUsersList();
        }
    }
}

// 加载系统设置（文件类型、部门、计量单位、送签状态）
function loadSystemSettings() {
    const settings = dataManager.getSettings();
    
    // 加载文件类型
    loadFileTypes(settings.fileTypes);
    
    // 加载部门
    loadDepartments(settings.departments);
    
    // 加载计量单位
    loadUnits(settings.units);
    
    // 加载送签状态
    loadStatuses(settings.statuses);
    
    // 加载系统设置页面的列表
    loadSettingsLists(settings);
}

// 加载文件类型
function loadFileTypes(fileTypes) {
    // 清空文件类型容器
    fileTypeContainer.innerHTML = '';
    
    // 添加文件类型复选框
    fileTypes.forEach(type => {
        const checkbox = document.createElement('label');
        checkbox.className = 'flex items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-custom';
        checkbox.innerHTML = `
            <input type="checkbox" name="fileType" value="${type}" class="mr-2 h-4 w-4 text-primary border-gray-300 rounded file-type-checkbox">
            <span>${type}</span>
        `;
        fileTypeContainer.appendChild(checkbox);
    });
    
    // 添加文件类型选择事件
    document.querySelectorAll('.file-type-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFileTypeChange);
    });
    
    // 更新编辑文件模态框中的文件类型下拉列表
    updateSelectOptions(editFileTypeSelect, fileTypes);
}

// 处理文件类型选择变化
function handleFileTypeChange() {
    const checkboxes = document.querySelectorAll('.file-type-checkbox');
    const hasOtherSelected = Array.from(checkboxes).some(cb => cb.value === '其他' && cb.checked);
    
    // 显示或隐藏其他文件类型输入框
    if (hasOtherSelected) {
        otherFileTypeContainer.classList.remove('hidden');
    } else {
        otherFileTypeContainer.classList.add('hidden');
        otherFileTypeInput.value = '';
    }
    
    // 检查是否选择了需要特殊处理的文件类型
    const hasPaymentType = Array.from(checkboxes).some(cb => 
        (cb.value === '付款申请单' || cb.value === '付款单+用印审批（仅限验收报告）') && cb.checked
    );
    
    // 显示或隐藏普通内容区域和摘要区域
    const normalContentContainer = document.getElementById('normal-content-container');
    const summaryContainer = document.getElementById('summary-container');
    
    if (hasPaymentType) {
        normalContentContainer.classList.add('hidden');
        summaryContainer.classList.remove('hidden');
    } else {
        normalContentContainer.classList.remove('hidden');
        summaryContainer.classList.add('hidden');
    }
}

// 处理期间类型选择变化
function handlePeriodTypeChange() {
    const singlePeriodContainer = document.getElementById('single-period-container');
    const rangePeriodContainer = document.getElementById('range-period-container');
    const singlePeriodRadio = document.querySelector('input[name="periodType"][value="single"]');
    const rangePeriodRadio = document.querySelector('input[name="periodType"][value="range"]');
    
    if (singlePeriodRadio.checked) {
        singlePeriodContainer.classList.remove('hidden');
        rangePeriodContainer.classList.add('hidden');
        document.getElementById('single-period').setAttribute('required', 'required');
        document.getElementById('start-period').removeAttribute('required');
        document.getElementById('end-period').removeAttribute('required');
    } else {
        singlePeriodContainer.classList.add('hidden');
        rangePeriodContainer.classList.remove('hidden');
        document.getElementById('single-period').removeAttribute('required');
        document.getElementById('start-period').setAttribute('required', 'required');
        document.getElementById('end-period').setAttribute('required', 'required');
    }
}

// 加载部门
function loadDepartments(departments) {
    // 清空部门选择框
    departmentSelect.innerHTML = '';
    
    // 添加部门选项
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        departmentSelect.appendChild(option);
    });
    
    // 更新编辑文件模态框中的部门下拉列表
    updateSelectOptions(editDepartmentSelect, departments);
}

// 加载计量单位
function loadUnits(units) {
    // 清空计量单位选择框
    unitSelect.innerHTML = '';
    
    // 添加计量单位选项
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });
    
    // 添加计量单位选择事件
    unitSelect.addEventListener('change', handleUnitChange);
    
    // 更新编辑文件模态框中的计量单位下拉列表
    updateSelectOptions(editUnitSelect, units);
}

// 处理计量单位选择变化
function handleUnitChange() {
    if (unitSelect.value === '其他') {
        otherUnitContainer.classList.remove('hidden');
    } else {
        otherUnitContainer.classList.add('hidden');
        otherUnitInput.value = '';
    }
}

// 加载送签状态
function loadStatuses(statuses) {
    // 更新批量状态选择框
    updateSelectOptions(batchStatusSelect, statuses, true);
    
    // 更新编辑文件模态框中的送签状态下拉列表
    updateSelectOptions(editStatusSelect, statuses);
    
    // 添加送签状态变化事件
    editStatusSelect.addEventListener('change', handleEditStatusChange);
}

// 处理编辑页面送签状态变化
function handleEditStatusChange() {
    if (editStatusSelect.value === '退回') {
        editReturnReasonContainer.classList.remove('hidden');
    } else {
        editReturnReasonContainer.classList.add('hidden');
        editReturnReasonInput.value = '';
    }
}

// 更新选择框选项
function updateSelectOptions(selectElement, options, includeEmpty = false) {
    // 清空选择框
    selectElement.innerHTML = '';
    
    // 如果需要包含空选项
    if (includeEmpty) {
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- 请选择 --';
        selectElement.appendChild(emptyOption);
    }
    
    // 添加选项
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

// 加载系统设置页面的列表
function loadSettingsLists(settings) {
    // 加载文件类型列表
    loadSettingsList(fileTypesList, settings.fileTypes, 'fileType');
    
    // 加载部门列表
    loadSettingsList(departmentsList, settings.departments, 'department');
    
    // 加载计量单位列表
    loadSettingsList(unitsList, settings.units, 'unit');
    
    // 加载送签状态列表
    loadSettingsList(statusesList, settings.statuses, 'status');
}

// 加载设置列表
function loadSettingsList(container, items, type) {
    // 清空容器
    container.innerHTML = '';
    
    // 添加列表项
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bg-white px-3 py-1 rounded-lg flex items-center justify-between text-sm';
        
        // 特殊处理：不能删除初始的"其他"选项
        const canDelete = !(item === '其他' && ['fileType', 'unit'].includes(type));
        
        itemElement.innerHTML = `
            <span>${item}</span>
            <button class="delete-${type}-btn text-info hover:text-danger transition-custom ${canDelete ? '' : 'hidden'}">
                <i class="fa fa-times"></i>
            </button>
        `;
        
        container.appendChild(itemElement);
    });
    
    // 添加删除按钮事件
    document.querySelectorAll(`.delete-${type}-btn`).forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.parentElement.querySelector('span').textContent;
            confirmAction(`确定要删除"${item}"吗？`, () => {
                let success = false;
                
                switch(type) {
                    case 'fileType':
                        success = dataManager.deleteFileType(item);
                        break;
                    case 'department':
                        success = dataManager.deleteDepartment(item);
                        break;
                    case 'unit':
                        success = dataManager.deleteUnit(item);
                        break;
                    case 'status':
                        success = dataManager.deleteStatus(item);
                        break;
                }
                
                if (success) {
                    showToast(`已成功删除"${item}"`, 'success');
                    loadSystemSettings();
                } else {
                    showToast(`删除"${item}"失败`, 'error');
                }
            });
        });
    });
}

// 初始化文件登记表单
function initFileRegisterForm() {
    // 设置默认日期
    document.getElementById('register-date').value = new Date().toISOString().split('T')[0];
    
    // 期间类型选择事件监听
    document.querySelectorAll('.period-type-radio').forEach(radio => {
        radio.addEventListener('change', handlePeriodTypeChange);
    });
    
    // 表单提交事件
    fileRegisterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const date = document.getElementById('register-date').value;
        const selectedFileTypes = Array.from(document.querySelectorAll('.file-type-checkbox:checked')).map(cb => cb.value);
        const department = departmentSelect.value;
        const applicant = applicantInput.value.trim();
        const unit = unitSelect.value;
        const quantity = quantityInput.value ? parseFloat(quantityInput.value) : 0;
        const amount = amountInput.value ? parseFloat(amountInput.value) : 0;
        
        // 检查是否选择了付款相关文件类型
        let content = '';
        const hasPaymentType = selectedFileTypes.some(type => 
            type === '付款申请单' || type === '付款单+用印审批（仅限验收报告）'
        );
        
        if (hasPaymentType) {
            // 合并摘要内容
            const paymentType = document.querySelector('input[name="paymentType"]:checked')?.value;
            const paymentContent = document.getElementById('payment-content').value.trim();
            const periodType = document.querySelector('input[name="periodType"]:checked')?.value;
            const paymentCompany = document.getElementById('payment-company').value.trim();
            
            // 验证摘要必填项
            if (!paymentType || !paymentContent || !paymentCompany) {
                showToast('请填写所有必填的摘要信息', 'error');
                return;
            }
            
            // 构建摘要内容
            content = `${paymentType}${paymentContent}`;
            
            // 添加期间信息
            if (periodType === 'single') {
                const singlePeriod = document.getElementById('single-period').value;
                if (singlePeriod) {
                    const [year, month] = singlePeriod.split('-');
                    content += ` ${year}年${month}月`;
                }
            } else {
                const startPeriod = document.getElementById('start-period').value;
                const endPeriod = document.getElementById('end-period').value;
                if (startPeriod && endPeriod) {
                    const [startYear, startMonth] = startPeriod.split('-');
                    const [endYear, endMonth] = endPeriod.split('-');
                    content += ` ${startYear}年${startMonth}月-${endYear}年${endMonth}月`;
                }
            }
            
            // 添加付款单位
            content += ` ${paymentCompany}`;
        } else {
            // 使用普通文件内容
            content = fileContentInput.value.trim();
            
            // 验证文件内容
            if (!content) {
                showToast('请输入文件内容', 'error');
                return;
            }
        }
        
        // 验证其他必填项
        if (!date || selectedFileTypes.length === 0 || !department || !applicant || !unit) {
            showToast('请填写所有必填项', 'error');
            return;
        }
        
        // 处理"其他"文件类型
        let fileType = selectedFileTypes.join('、');
        if (selectedFileTypes.includes('其他') && otherFileTypeInput.value.trim()) {
            fileType = fileType.replace('其他', `其他(${otherFileTypeInput.value.trim()})`);
        }
        
        // 处理"其他"计量单位
        let finalUnit = unit;
        if (unit === '其他' && otherUnitInput.value.trim()) {
            finalUnit = `其他(${otherUnitInput.value.trim()})`;
        }
        
        // 创建文件数据
        const fileData = {
            date,
            fileType,
            department,
            applicant,
            content,
            unit: finalUnit,
            quantity,
            amount
        };
        
        // 添加文件
        dataManager.addFile(fileData);
        
        // 显示成功提示
        showToast('文件登记成功', 'success');
        
        // 重置表单
        fileRegisterForm.reset();
        document.getElementById('register-date').value = new Date().toISOString().split('T')[0];
        otherFileTypeContainer.classList.add('hidden');
        otherUnitContainer.classList.add('hidden');
        
        // 切换到文件信息页面
        showPage('file-info');
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', function() {
        // 重置表单
        fileRegisterForm.reset();
        document.getElementById('register-date').value = new Date().toISOString().split('T')[0];
        
        // 隐藏"其他"输入框
        otherFileTypeContainer.classList.add('hidden');
        otherUnitContainer.classList.add('hidden');
        
        // 重置摘要相关字段
        document.querySelector('input[name="paymentType"][value="支付"]').checked = true;
        document.querySelector('input[name="periodType"][value="single"]').checked = true;
        
        // 重置期间显示
        const singlePeriodContainer = document.getElementById('single-period-container');
        const rangePeriodContainer = document.getElementById('range-period-container');
        singlePeriodContainer.classList.remove('hidden');
        rangePeriodContainer.classList.add('hidden');
        
        // 重置内容区域显示
        const normalContentContainer = document.getElementById('normal-content-container');
        const summaryContainer = document.getElementById('summary-container');
        normalContentContainer.classList.remove('hidden');
        summaryContainer.classList.add('hidden');
    });
}

// 加载文件数据
function loadFilesData() {
    const files = dataManager.getAllFiles();
    
    // 更新文件信息页面
    updateFileInfoTable(files);
    
    // 更新文件处理页面
    updateFileProcessTable(files);
}

// 更新文件信息表格
function updateFileInfoTable(files) {
    // 清空表格内容
    fileInfoTableBody.innerHTML = '';
    
    // 检查是否有文件数据
    if (files.length === 0) {
        noFilesMessage.classList.remove('hidden');
        return;
    }
    
    // 隐藏无文件提示
    noFilesMessage.classList.add('hidden');
    
    // 添加文件数据到表格
    files.forEach(file => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-custom';
        
        // 格式化数量和金额（零值显示为"/"）
        const formattedQuantity = file.quantity === 0 ? '/' : file.quantity;
        const formattedAmount = file.amount === 0 ? '/' : file.amount;
        
        // 格式化日期
        const endDate = file.endDate ? file.endDate : '';
        
        // 根据送签状态设置不同颜色
        const getStatusColorClass = (status) => {
            if (status === '完毕') return 'text-success';
            if (status === '退回') return 'text-danger';
            if (status === '急单') return 'text-warning';
            return 'text-info';
        };
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.fileType}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.fileNumber || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.department}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.applicant}</td>
            <td class="px-6 py-4 text-sm text-dark max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">${file.content}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${formattedQuantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${formattedAmount}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${endDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${getStatusColorClass(file.status)}">${file.status}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.returnReason || ''}</td>
        `;
        
        fileInfoTableBody.appendChild(row);
    });
}

// 更新文件处理表格
function updateFileProcessTable(files) {
    // 清空表格内容
    fileProcessTableBody.innerHTML = '';
    
    // 检查是否有文件数据
    if (files.length === 0) {
        noProcessFilesMessage.classList.remove('hidden');
        selectAllCheckbox.checked = false;
        return;
    }
    
    // 隐藏无文件提示
    noProcessFilesMessage.classList.add('hidden');
    
    // 添加文件数据到表格
    files.forEach(file => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-custom';
        row.setAttribute('data-id', file.id);
        
        // 格式化数量和金额（零值显示为"/"）
        const formattedQuantity = file.quantity === 0 ? '/' : file.quantity;
        const formattedAmount = file.amount === 0 ? '/' : file.amount;
        
        // 格式化日期
        const endDate = file.endDate ? file.endDate : '';
        
        // 根据送签状态设置不同颜色
        const getStatusColorClass = (status) => {
            if (status === '完毕') return 'text-success';
            if (status === '退回') return 'text-danger';
            if (status === '急单') return 'text-warning';
            return 'text-info';
        };
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" class="file-checkbox h-4 w-4 text-primary border-gray-300 rounded" value="${file.id}">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.fileType}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.fileNumber || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.department}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.applicant}</td>
            <td class="px-6 py-4 text-sm text-dark max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">${file.content}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${file.unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${formattedQuantity}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${formattedAmount}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark">${endDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${getStatusColorClass(file.status)}">${file.status}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="edit-file-btn text-primary hover:text-primary/80 mr-3 transition-custom" data-id="${file.id}">
                    <i class="fa fa-pencil"></i> 编辑
                </button>
                <button class="delete-file-btn text-danger hover:text-danger/80 transition-custom" data-id="${file.id}">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        fileProcessTableBody.appendChild(row);
    });
    
    // 添加文件复选框事件
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectAllCheckbox);
    });
    
    // 添加编辑按钮事件
    document.querySelectorAll('.edit-file-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const fileId = this.getAttribute('data-id');
            openEditFileModal(fileId);
        });
    });
    
    // 添加删除按钮事件
    document.querySelectorAll('.delete-file-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const fileId = this.getAttribute('data-id');
            confirmAction('确定要删除这条文件信息吗？', () => {
                dataManager.deleteFile(fileId);
                showToast('文件已成功删除', 'success');
                loadFilesData();
            });
        });
    });
    
    // 重置全选复选框
    selectAllCheckbox.checked = false;
}

// 更新全选复选框状态
function updateSelectAllCheckbox() {
    const checkboxes = document.querySelectorAll('.file-checkbox');
    const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');
    selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedBoxes.length;
}

// 初始化模态框
function initModals() {
    // 全选复选框事件
    selectAllCheckbox.addEventListener('change', function() {
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    
    // 批量更新状态按钮事件
    batchStatusBtn.addEventListener('click', function() {
        const selectedStatus = batchStatusSelect.value;
        if (!selectedStatus) {
            showToast('请选择要更新的送签状态', 'error');
            return;
        }
        
        const selectedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(cb => cb.value);
        if (selectedIds.length === 0) {
            showToast('请选择要更新的文件', 'error');
            return;
        }
        
        confirmAction(`确定要将选中的${selectedIds.length}条文件状态更新为"${selectedStatus}"吗？`, () => {
            dataManager.batchUpdateStatus(selectedIds, selectedStatus);
            showToast('文件状态已成功更新', 'success');
            loadFilesData();
            batchStatusSelect.value = '';
        });
    });
    
    // 批量删除按钮事件
    batchDeleteBtn.addEventListener('click', function() {
        const selectedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(cb => cb.value);
        if (selectedIds.length === 0) {
            showToast('请选择要删除的文件', 'error');
            return;
        }
        
        confirmAction(`确定要删除选中的${selectedIds.length}条文件信息吗？`, () => {
            dataManager.batchDeleteFiles(selectedIds);
            showToast('文件已成功删除', 'success');
            loadFilesData();
        });
    });
    
    // 导出Excel按钮事件
    exportExcelBtn.addEventListener('click', function() {
        const success = dataManager.exportToExcel();
        if (!success) {
            showToast('暂无数据可导出', 'error');
        }
    });
    
    // 关闭模态框按钮事件
    closeModalBtn.addEventListener('click', closeEditFileModal);
    cancelEditBtn.addEventListener('click', closeEditFileModal);
    
    // 编辑文件表单提交事件
    editFileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const fileId = editFileIdInput.value;
        const date = editDateInput.value;
        const fileType = editFileTypeSelect.value;
        const fileNumber = editFileNumberInput.value.trim();
        const department = editDepartmentSelect.value;
        const applicant = editApplicantInput.value.trim();
        const content = editContentInput.value.trim();
        const unit = editUnitSelect.value;
        const quantity = editQuantityInput.value ? parseFloat(editQuantityInput.value) : 0;
        const amount = editAmountInput.value ? parseFloat(editAmountInput.value) : 0;
        const status = editStatusSelect.value;
        const returnReason = editStatusSelect.value === '退回' ? editReturnReasonInput.value.trim() : '';
        
        // 验证必填项
        if (!date || !fileType || !department || !applicant || !content || !unit) {
            showToast('请填写所有必填项', 'error');
            return;
        }
        
        // 创建更新数据
        const updatedData = {
            date,
            fileType,
            fileNumber,
            department,
            applicant,
            content,
            unit,
            quantity,
            amount,
            status,
            returnReason
        };
        
        // 如果状态为完毕，设置结束日期
        if (status === '完毕') {
            updatedData.endDate = new Date().toISOString().split('T')[0];
        } else {
            updatedData.endDate = '';
        }
        
        // 更新文件
        dataManager.updateFile(fileId, updatedData);
        
        // 显示成功提示
        showToast('文件信息已成功更新', 'success');
        
        // 关闭模态框
        closeEditFileModal();
        
        // 重新加载文件数据
        loadFilesData();
    });
    
    // 添加系统设置事件
    // 添加文件类型
    addFileTypeBtn.addEventListener('click', function() {
        const type = newFileTypeInput.value.trim();
        if (!type) {
            showToast('请输入文件类型', 'error');
            return;
        }
        
        if (dataManager.addFileType(type)) {
            showToast(`已成功添加文件类型"${type}"`, 'success');
            newFileTypeInput.value = '';
            loadSystemSettings();
        } else {
            showToast(`文件类型"${type}"已存在`, 'error');
        }
    });
    
    // 添加部门
    addDepartmentBtn.addEventListener('click', function() {
        const dept = newDepartmentInput.value.trim();
        if (!dept) {
            showToast('请输入部门名称', 'error');
            return;
        }
        
        if (dataManager.addDepartment(dept)) {
            showToast(`已成功添加部门"${dept}"`, 'success');
            newDepartmentInput.value = '';
            loadSystemSettings();
        } else {
            showToast(`部门"${dept}"已存在`, 'error');
        }
    });
    
    // 添加计量单位
    addUnitBtn.addEventListener('click', function() {
        const unit = newUnitInput.value.trim();
        if (!unit) {
            showToast('请输入计量单位', 'error');
            return;
        }
        
        if (dataManager.addUnit(unit)) {
            showToast(`已成功添加计量单位"${unit}"`, 'success');
            newUnitInput.value = '';
            loadSystemSettings();
        } else {
            showToast(`计量单位"${unit}"已存在`, 'error');
        }
    });
    
    // 添加送签状态
    addStatusBtn.addEventListener('click', function() {
        const status = newStatusInput.value.trim();
        if (!status) {
            showToast('请输入送签状态', 'error');
            return;
        }
        
        if (dataManager.addStatus(status)) {
            showToast(`已成功添加送签状态"${status}"`, 'success');
            newStatusInput.value = '';
            loadSystemSettings();
        } else {
            showToast(`送签状态"${status}"已存在`, 'error');
        }
    });
    
    // 添加用户
    addUserBtn.addEventListener('click', function() {
        const username = newUsernameInput.value.trim();
        const password = newPasswordInput.value;
        const role = newRoleSelect.value;
        
        if (!username || !password) {
            showToast('请填写用户名和密码', 'error');
            return;
        }
        
        const result = dataManager.addUser({ username, password, role });
        if (result.success) {
            showToast(`已成功添加用户"${username}"`, 'success');
            // 重置表单
            newUsernameInput.value = '';
            newPasswordInput.value = '';
            newRoleSelect.value = 'user';
            // 重新加载用户列表
            loadUsersList();
        } else {
            showToast(result.message, 'error');
        }
    });
    
    // 监听Enter键提交
    [newFileTypeInput, newDepartmentInput, newUnitInput, newStatusInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const btnId = `add-${input.id.replace('new-', '')}-btn`;
                document.getElementById(btnId).click();
            }
        });
    });
}

// 打开编辑文件模态框
function openEditFileModal(fileId) {
    // 获取文件数据
    const file = dataManager.getFileById(fileId);
    if (!file) {
        showToast('文件不存在或已被删除', 'error');
        return;
    }
    
    // 填充表单数据
    editFileIdInput.value = file.id;
    editDateInput.value = file.date;
    
    // 设置文件类型选择
    setSelectOption(editFileTypeSelect, file.fileType);
    
    editFileNumberInput.value = file.fileNumber || '';
    
    // 设置部门选择
    setSelectOption(editDepartmentSelect, file.department);
    
    editApplicantInput.value = file.applicant;
    editContentInput.value = file.content;
    
    // 设置计量单位选择
    setSelectOption(editUnitSelect, file.unit);
    
    editQuantityInput.value = file.quantity || '';
    editAmountInput.value = file.amount || '';
    
    // 设置送签状态选择
    setSelectOption(editStatusSelect, file.status);
    
    // 根据送签状态显示或隐藏退回原因
    if (file.status === '退回') {
        editReturnReasonContainer.classList.remove('hidden');
        editReturnReasonInput.value = file.returnReason || '';
    } else {
        editReturnReasonContainer.classList.add('hidden');
        editReturnReasonInput.value = '';
    }
    
    // 显示模态框
    editFileModal.classList.remove('hidden');
    
    // 添加动画效果
    setTimeout(() => {
        editFileModal.querySelector('div').classList.add('fade-in');
    }, 10);
}

// 设置选择框选项
function setSelectOption(selectElement, value) {
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === value) {
            selectElement.selectedIndex = i;
            return;
        }
    }
    // 如果没有找到匹配的值，保持默认选择
}

// 关闭编辑文件模态框
function closeEditFileModal() {
    // 隐藏模态框
    editFileModal.classList.add('hidden');
    
    // 清空表单
    editFileForm.reset();
}

// 初始化确认对话框
function initConfirmDialog() {
    // 关闭确认对话框
    cancelConfirmBtn.addEventListener('click', function() {
        confirmDialog.classList.add('hidden');
        // 重置确认回调
        window.confirmCallback = null;
    });
    
    // 确认操作
    confirmBtn.addEventListener('click', function() {
        if (typeof window.confirmCallback === 'function') {
            window.confirmCallback();
        }
        confirmDialog.classList.add('hidden');
        window.confirmCallback = null;
    });
}

// 显示确认对话框
function confirmAction(message, callback) {
    // 设置确认消息
    confirmMessage.textContent = message;
    
    // 设置确认回调
    window.confirmCallback = callback;
    
    // 显示确认对话框
    confirmDialog.classList.remove('hidden');
}

// 显示Toast提示
function showToast(message, type = 'info') {
    // 设置Toast消息
    toastMessage.textContent = message;
    
    // 设置Toast图标
    toastIcon.className = '';
    switch(type) {
        case 'success':
            toastIcon.className = 'fa fa-check-circle mr-2 text-success';
            break;
        case 'error':
            toastIcon.className = 'fa fa-exclamation-circle mr-2 text-danger';
            break;
        case 'warning':
            toastIcon.className = 'fa fa-exclamation-triangle mr-2 text-warning';
            break;
        default:
            toastIcon.className = 'fa fa-info-circle mr-2 text-info';
    }
    
    // 显示Toast
    toast.classList.remove('translate-x-full');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 3000);
}

// 加载用户列表
function loadUsersList() {
    const users = dataManager.users;
    
    // 清空用户列表
    usersList.innerHTML = '';
    
    // 添加用户到列表
    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-custom';
        row.setAttribute('data-id', user.id);
        
        row.innerHTML = `
            <td class="px-4 py-2 text-sm text-dark">${user.username}</td>
            <td class="px-4 py-2 text-sm text-dark">${user.roleName}</td>
            <td class="px-4 py-2 text-sm font-medium">
                <button class="delete-user-btn text-danger hover:text-danger/80 transition-custom" data-id="${user.id}">
                    <i class="fa fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        usersList.appendChild(row);
    });
    
    // 添加删除用户按钮事件
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const user = dataManager.users.find(u => u.id === userId);
            
            if (user) {
                confirmAction(`确定要删除用户"${user.username}"吗？`, () => {
                    const result = dataManager.deleteUser(userId);
                    if (result.success) {
                        showToast(`已成功删除用户"${user.username}"`, 'success');
                        loadUsersList();
                    } else {
                        showToast(result.message, 'error');
                    }
                });
            }
        });
    });
}

// 显示加载中动画
function showLoading() {
    loading.classList.remove('hidden');
}

// 隐藏加载中动画
function hideLoading() {
    loading.classList.add('hidden');
}