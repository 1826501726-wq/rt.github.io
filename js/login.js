// 选项卡切换功能
class TabSwitch {
  constructor() {
    this.tabItems = document.querySelectorAll(".tab-item");
    this.tabContents = document.querySelectorAll(".tab-content");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.tabItems.forEach((item) => {
      item.addEventListener("click", () => {
        // 移除所有激活状态
        this.tabItems.forEach(t => t.classList.remove("active"));
        this.tabContents.forEach(c => c.classList.add("hide"));

        // 添加当前激活状态
        item.classList.add("active");
        const tabName = item.dataset.tab;
        document.querySelector(`.${tabName}-content`).classList.remove("hide");
      });
    });
  }
}

// 登录表单校验与提交
class LoginForm {
  constructor() {
    this.form = document.getElementById("login-form");
    this.usernameInput = document.getElementById("login-username");
    this.passwordInput = document.getElementById("login-password");
    this.usernameTip = document.getElementById("login-username-tip");
    this.passwordTip = document.getElementById("login-password-tip");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submit();
      }
    });
  }

  // 合法性校验
  validate() {
    let isValid = true;
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value.trim();

    // 用户名校验
    if (!username) {
      this.usernameTip.textContent = "用户名不能为空！";
      isValid = false;
    } else {
      this.usernameTip.textContent = "";
    }

    // 密码校验
    if (!password) {
      this.passwordTip.textContent = "密码不能为空！";
      isValid = false;
    } else {
      this.passwordTip.textContent = "";
    }

    return isValid;
  }

  // 提交登录
  submit() {
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value.trim();
    const userList = StorageUtil.get("userList") || [];

    // 查找用户
    const user = userList.find(item => item.username === username && item.password === password);
    if (user) {
      // 保存登录状态
      UserAuth.login(user);
      alert("登录成功！即将返回首页");
      window.location.href = "index.html";
    } else {
      alert("用户名或密码错误！");
    }
  }
}

// 注册表单校验与提交
class RegisterForm {
  constructor() {
    this.form = document.getElementById("register-form");
    this.usernameInput = document.getElementById("reg-username");
    this.passwordInput = document.getElementById("reg-password");
    this.repasswordInput = document.getElementById("reg-repassword");
    this.usernameTip = document.getElementById("reg-username-tip");
    this.passwordTip = document.getElementById("reg-password-tip");
    this.repasswordTip = document.getElementById("reg-repassword-tip");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submit();
      }
    });
  }

  // 合法性校验
  validate() {
    let isValid = true;
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value.trim();
    const repassword = this.repasswordInput.value.trim();
    const userList = StorageUtil.get("userList") || [];

    // 用户名校验（3-16位，字母/数字/下划线，不重复）
    const usernameReg = /^[a-zA-Z0-9_]{3,16}$/;
    if (!username) {
      this.usernameTip.textContent = "用户名不能为空！";
      isValid = false;
    } else if (!usernameReg.test(username)) {
      this.usernameTip.textContent = "用户名需为3-16位字母/数字/下划线！";
      isValid = false;
    } else if (userList.some(item => item.username === username)) {
      this.usernameTip.textContent = "该用户名已被注册！";
      isValid = false;
    } else {
      this.usernameTip.textContent = "";
    }

    // 密码校验（6-18位，字母+数字组合）
    const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/;
    if (!password) {
      this.passwordTip.textContent = "密码不能为空！";
      isValid = false;
    } else if (!passwordReg.test(password)) {
      this.passwordTip.textContent = "密码需为6-18位字母+数字组合！";
      isValid = false;
    } else {
      this.passwordTip.textContent = "";
    }

    // 确认密码校验
    if (!repassword) {
      this.repasswordTip.textContent = "请再次输入密码！";
      isValid = false;
    } else if (repassword !== password) {
      this.repasswordTip.textContent = "两次输入密码不一致！";
      isValid = false;
    } else {
      this.repasswordTip.textContent = "";
    }

    return isValid;
  }

  // 提交注册
  submit() {
    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value.trim();
    const userList = StorageUtil.get("userList") || [];

    // 添加新用户
    userList.push({ username, password });
    StorageUtil.set("userList", userList);

    alert("注册成功！即将跳转至登录页");
    // 切换到登录选项卡
    document.querySelector('[data-tab="login"]').click();
    // 填充用户名
    document.getElementById("login-username").value = username;
  }
}

// 页面加载完成后初始化
window.addEventListener("DOMContentLoaded", () => {
  // 初始化选项卡
  new TabSwitch();
  // 初始化登录表单
  new LoginForm();
  // 初始化注册表单
  new RegisterForm();
});