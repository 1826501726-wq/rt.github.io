// 本地存储工具类（修改后）
const StorageUtil = {
  // 保存数据
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // 获取数据
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // 删除数据
  remove(key) {
    localStorage.removeItem(key);
  },

  // ========== 新增：购物车与用户绑定 ==========
  // 获取当前登录用户的购物车Key
  getCartKey() {
    const user = UserAuth.getUserInfo();
    return user ? `cartList_${user.username}` : null;
  },

  // 获取当前用户的购物车
  getUserCart() {
    const cartKey = this.getCartKey();
    return cartKey ? this.get(cartKey) || [] : [];
  },

  // 保存当前用户的购物车
  setUserCart(cartList) {
    const cartKey = this.getCartKey();
    if (cartKey) {
      this.set(cartKey, cartList);
    }
  },

  // 清空当前用户的购物车
  clearUserCart() {
    const cartKey = this.getCartKey();
    if (cartKey) {
      this.remove(cartKey);
    }
  },

  // 获取当前用户购物车数量（修改后）
  getCartCount() {
    const cartList = this.getUserCart();
    return cartList.reduce((total, item) => total + item.quantity, 0);
  }
};

// 登录状态管理（保持不变）
const UserAuth = {
  isLogin() {
    return !!this.getUserInfo();
  },
  getUserInfo() {
    return StorageUtil.get("userInfo");
  },
  login(userInfo) {
    StorageUtil.set("userInfo", userInfo);
  },
  logout() {
    StorageUtil.remove("userInfo");
  }
};

// 页面加载后更新购物车数量（保持不变）
window.addEventListener("DOMContentLoaded", () => {
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = StorageUtil.getCartCount();
  }

  const loginBtn = document.querySelector(".login-btn");
  const logoutBtn = document.querySelector(".logout-btn");
  const userInfoEl = document.querySelector(".user-info");
  if (loginBtn && logoutBtn && userInfoEl) {
    if (UserAuth.isLogin()) {
      loginBtn.classList.add("hide");
      logoutBtn.classList.remove("hide");
      userInfoEl.textContent = `欢迎：${UserAuth.getUserInfo().username}`;
      userInfoEl.classList.remove("hide");
    } else {
      loginBtn.classList.remove("hide");
      logoutBtn.classList.add("hide");
      userInfoEl.classList.add("hide");
    }
    logoutBtn.addEventListener("click", () => {
      UserAuth.logout();
      alert("退出登录成功！");
      window.location.reload();
    });
  }
});

window.StorageUtil = StorageUtil;
window.UserAuth = UserAuth;