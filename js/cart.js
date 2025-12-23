class CartManager {
  constructor() {
    this.cartListEl = document.getElementById("cart-list");
    this.selectAllEl = document.getElementById("select-all");
    this.totalPriceEl = document.getElementById("total-price");
    this.clearCartBtn = document.getElementById("clear-cart-btn");
    this.checkoutBtn = document.querySelector(".checkout-btn");
    this.cartBox = document.querySelector(".cart-box");
    this.unloginTip = document.querySelector(".unlogin-tip");
    this.emptyTip = document.querySelector(".empty-tip");
    this.cartList = [];
    this.init();
  }

  init() {
  // 强制初始化：先隐藏所有提示和购物车（彻底解决提示残留问题）
  this.unloginTip.classList.add("hide");
  this.emptyTip.classList.add("hide");
  this.cartBox.classList.add("hide");
  // 新增：先强制隐藏提示框的display
  this.unloginTip.style.display = "none";
  this.emptyTip.style.display = "none";

  // 1. 未登录：只显示未登录提示
  if (!UserAuth.isLogin()) {
    this.unloginTip.classList.remove("hide");
    this.unloginTip.style.display = "block"; 
    return;
  }

  // 2. 已登录：读取当前用户专属购物车（添加默认值，避免undefined报错）
  this.cartList = StorageUtil.getUserCart() || [];

  // 3. 已登录但购物车为空：只显示空购物车提示
  if (this.cartList.length === 0) {
    this.emptyTip.classList.remove("hide");
    this.emptyTip.style.display = "block"; // 强制显示
    return;
  }

  // 4. 已登录且有购物车数据：只显示购物车列表（彻底隐藏提示）
  this.cartBox.classList.remove("hide");
  this.cartBox.style.display = "block"; // 强制显示购物车
  //强制隐藏提示框
  this.unloginTip.style.display = "none";
  this.emptyTip.style.display = "none";
  this.renderCartList();
  this.bindEvents();
  this.calcTotalPrice();
}
  // 渲染购物车（修复图片显示，优化价格计算）
  renderCartList() {
    this.cartListEl.innerHTML = "";
    this.cartList.forEach((item, index) => {
      const tr = document.createElement("tr");
      // 确保模板字符串正确，图片路径正常解析，价格计算用parseFloat避免NaN
      tr.innerHTML = `
        <td><input type="checkbox" class="item-checkbox" data-index="${index}" checked></td>
        <!-- 修复商品图片：设置固定尺寸，确保显示，object-fit保持图片比例 -->
        <td class="cart-item-img"><img src="${item.img}" alt="${item.title}" style="width:80px;height:80px;object-fit:cover;border:1px solid #e0e0e0;"></td>
        <td class="cart-item-name">${item.title}</td>
        <td class="cart-item-price">¥ ${item.price}</td>
        <td>
          <div class="quantity-adjust">
            <button class="quantity-btn minus-btn" data-index="${index}">-</button>
            <input type="number" class="quantity-input" data-index="${index}" value="${item.quantity}" min="1" style="width:60px;text-align:center;">
            <button class="quantity-btn plus-btn" data-index="${index}">+</button>
          </div>
        </td>
        <td class="cart-item-total">¥ ${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
        <td class="delete-btn" data-index="${index}" style="color:#e53935;cursor:pointer;">删除</td>
      `;
      this.cartListEl.appendChild(tr);
    });
  }

  // 其他方法（bindEvents、changeQuantity等）保持不变，优化少量细节
  bindEvents() {
    // 全选/取消全选
    this.selectAllEl.addEventListener("change", () => {
      const itemCheckboxes = document.querySelectorAll(".item-checkbox");
      itemCheckboxes.forEach(checkbox => checkbox.checked = this.selectAllEl.checked);
      this.calcTotalPrice();
    });

    // 单个商品选择
    this.cartListEl.addEventListener("change", (e) => {
      if (e.target.classList.contains("item-checkbox")) {
        const allChecked = Array.from(document.querySelectorAll(".item-checkbox")).every(cb => cb.checked);
        this.selectAllEl.checked = allChecked;
        this.calcTotalPrice();
      }
    });

    // 数量减少
    this.cartListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("minus-btn")) {
        this.changeQuantity(parseInt(e.target.dataset.index), -1);
      }
    });

    // 数量增加
    this.cartListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("plus-btn")) {
        this.changeQuantity(parseInt(e.target.dataset.index), 1);
      }
    });

    // 手动修改数量
    this.cartListEl.addEventListener("change", (e) => {
      if (e.target.classList.contains("quantity-input")) {
        const index = parseInt(e.target.dataset.index);
        const newQty = parseInt(e.target.value) || 1;
        this.changeQuantity(index, 0, Math.max(1, newQty));
      }
    });

    // 删除商品
    this.cartListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn") && confirm("确定删除该商品？")) {
        this.deleteItem(parseInt(e.target.dataset.index));
      }
    });

  // 清空购物车（修改后）
this.clearCartBtn.addEventListener("click", () => {
  if (confirm("确定清空购物车？")) {
    StorageUtil.clearUserCart();
    this.cartList = [];
    // 1. 隐藏购物车列表（强制设置display）
    this.cartBox.classList.add("hide");
    this.cartBox.style.display = "none"; // 新增
    // 2. 显示空购物车提示（强制设置display）
    this.emptyTip.classList.remove("hide");
    this.emptyTip.style.display = "block"; // 新增
    // 3. 更新购物车数量
    document.querySelector(".cart-count").textContent = 0;
  }
});

    // 去结算
    this.checkoutBtn.addEventListener("click", () => {
      const selected = this.getCheckedItems();
      selected.length ? alert("结算功能开发中～") : alert("请选择要结算的商品！");
    });
  }

  changeQuantity(index, type, customQty = null) {
    let qty = this.cartList[index].quantity;
    qty = type === -1 ? Math.max(1, qty - 1) : (type === 1 ? qty + 1 : customQty);
    
    this.cartList[index].quantity = qty;
    StorageUtil.setUserCart(this.cartList);

    // 优化：精准获取元素，避免报错
    const quantityInput = document.querySelector(`.quantity-input[data-index="${index}"]`);
    if (quantityInput) quantityInput.value = qty;
    
    const totalEl = document.querySelectorAll(".cart-item-total")[index];
    if (totalEl) totalEl.textContent = `¥ ${(parseFloat(this.cartList[index].price) * qty).toFixed(2)}`;
    
    document.querySelector(".cart-count").textContent = StorageUtil.getCartCount();
    this.calcTotalPrice();
  }

  deleteItem(index) {
    this.cartList.splice(index, 1);
    StorageUtil.setUserCart(this.cartList);

    this.renderCartList();
    document.querySelector(".cart-count").textContent = StorageUtil.getCartCount();
    if (this.cartList.length === 0) {
      this.cartBox.classList.add("hide");
      this.emptyTip.classList.remove("hide");
    }
    this.calcTotalPrice();
  }

  getCheckedItems() {
    return Array.from(document.querySelectorAll(".item-checkbox"))
      .filter(cb => cb.checked)
      .map(cb => this.cartList[parseInt(cb.dataset.index)]);
  }

  calcTotalPrice() {
    const total = this.getCheckedItems().reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    this.totalPriceEl.textContent = total.toFixed(2);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new CartManager();
});