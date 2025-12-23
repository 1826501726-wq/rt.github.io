// 数量调整类（保持不变）
class QuantityAdjust {
  constructor() {
    this.minusBtn = document.querySelector(".minus-btn");
    this.plusBtn = document.querySelector(".plus-btn");
    this.quantityInput = document.getElementById("quantity");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // 减号按钮
    this.minusBtn.addEventListener("click", () => {
      let quantity = parseInt(this.quantityInput.value);
      if (quantity > 1) {
        quantity--;
        this.quantityInput.value = quantity;
      }
    });

    // 加号按钮
    this.plusBtn.addEventListener("click", () => {
      let quantity = parseInt(this.quantityInput.value);
      quantity++;
      this.quantityInput.value = quantity;
    });

    // 输入框验证
    this.quantityInput.addEventListener("change", () => {
      let quantity = parseInt(this.quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
        this.quantityInput.value = 1;
      }
    });
  }

  // 获取当前数量
  getQuantity() {
    return parseInt(this.quantityInput.value);
  }
}

// 加入购物车类（只定义一次，完整结构，优化图片获取）
class AddToCart {
  constructor() {
    this.addCartBtn = document.getElementById("add-cart-btn");
    this.productPrice = document.getElementById("product-price").textContent;
    this.productTitle = document.querySelector(".product-title").textContent;
    // 修复：更健壮的商品图片路径获取（兼容详情页图片结构）
    this.productImg = (() => {
      // 优先获取详情页商品图片
      const imgElement = document.querySelector(".product-img img") || document.querySelector("img[alt*='商品']");
      // 有图片则取src，无则用默认图片（确保images文件夹下有product1.jpg）
      return imgElement ? imgElement.src : "images/product1.jpg";
    })();
    this.quantityAdjust = new QuantityAdjust(); // 实例化数量调整类
    this.init();
  }

  init() {
    this.bindEvents(); // 绑定点击事件
  }

  bindEvents() {
    this.addCartBtn.addEventListener("click", () => {
      this.handleAddCart(); // 点击后执行加入购物车逻辑
    });
  }

  // 核心：加入购物车逻辑
  handleAddCart() {
    // 未登录则跳转
    if (!UserAuth.isLogin()) {
      if (confirm("请先登录，是否跳转至登录页？")) {
        window.location.href = "login.html";
      }
      return;
    }

    // 获取当前购买数量
    const quantity = this.quantityAdjust.getQuantity();
    // 组装商品信息（包含图片路径，确保购物车能读取）
    const productInfo = {
      id: Date.now(), // 用时间戳作为唯一商品ID，避免重复
      title: this.productTitle,
      price: this.productPrice,
      quantity: quantity,
      img: this.productImg // 关键：存储商品图片路径
    };

    // 读取用户专属购物车
    let cartList = StorageUtil.getUserCart();
    // 判断商品是否已存在（根据商品名称，更直观）
    const existIndex = cartList.findIndex(item => item.title === productInfo.title);
    if (existIndex > -1) {
      // 已存在：增加数量
      cartList[existIndex].quantity += quantity;
    } else {
      // 不存在：添加新商品
      cartList.push(productInfo);
    }

    // 保存购物车并提示
    StorageUtil.setUserCart(cartList);
    alert(`成功加入${quantity}件商品到购物车！`);
    // 更新购物车数量显示
    document.querySelector(".cart-count").textContent = StorageUtil.getCartCount();
  }
}

// 页面加载后初始化
window.addEventListener("DOMContentLoaded", () => {
  new AddToCart(); // 只实例化一次
});