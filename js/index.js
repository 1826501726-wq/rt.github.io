// 轮播图功能实现
class Banner {
  constructor() {
    this.bannerItems = document.querySelectorAll(".banner-item");
    this.indicatorItems = document.querySelectorAll(".indicator-item");
    this.prevBtn = document.querySelector(".prev-btn");
    this.nextBtn = document.querySelector(".next-btn");
    this.currentIndex = 0;
    this.bannerTimer = null;
    this.init();
  }

  // 初始化
  init() {
    this.bindEvents();
    this.autoPlay();
  }

  // 绑定事件
  bindEvents() {
    // 上一张/下一张按钮
    this.prevBtn.addEventListener("click", () => this.goPrev());
    this.nextBtn.addEventListener("click", () => this.goNext());

    // 指示器点击
    this.indicatorItems.forEach((item, index) => {
      item.addEventListener("click", () => this.goTo(index));
    });

    // 鼠标悬停暂停轮播
    document.querySelector(".banner-wrapper").addEventListener("mouseenter", () => this.stopPlay());
    document.querySelector(".banner-wrapper").addEventListener("mouseleave", () => this.autoPlay());
  }

  // 切换到指定索引
  goTo(index) {
    // 移除当前激活状态
    this.bannerItems[this.currentIndex].classList.remove("active");
    this.indicatorItems[this.currentIndex].classList.remove("active");

    // 更新索引
    this.currentIndex = index;
    if (this.currentIndex >= this.bannerItems.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = this.bannerItems.length - 1;

    // 添加新激活状态
    this.bannerItems[this.currentIndex].classList.add("active");
    this.indicatorItems[this.currentIndex].classList.add("active");
  }

  // 上一张
  goPrev() {
    this.goTo(this.currentIndex - 1);
  }

  // 下一张
  goNext() {
    this.goTo(this.currentIndex + 1);
  }

  // 自动轮播
  autoPlay() {
    this.bannerTimer = setInterval(() => {
      this.goNext();
    }, 3000);
  }

  // 停止轮播
  stopPlay() {
    clearInterval(this.bannerTimer);
  }
}

// 👇 搜索功能：商品过滤
class Search {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.searchBtn = document.getElementById("search-btn");
    this.productItems = document.querySelectorAll(".product-item");
    this.noResultEl = document.querySelector(".no-result");
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.searchBtn.addEventListener("click", () => this.doSearch());
    // 优化：将keydown改为keyup，避免回车键重复触发
    this.searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") this.doSearch();
    });
  }

  doSearch() {
    const keyword = this.searchInput.value.trim().toLowerCase();
    if (!keyword) {
      alert("请输入搜索关键词！");
      return;
    }

    let hasMatchGoods = false;
    this.productItems.forEach(item => {
      const productName = item.querySelector(".product-name").textContent.toLowerCase();
      if (productName.includes(keyword)) {
        item.classList.remove("hide");
        hasMatchGoods = true;
      } else {
        item.classList.add("hide");
      }
    });

    this.noResultEl.classList.toggle("hide", hasMatchGoods);
    this.searchInput.value = "";
  }
}

// 👇 分类筛选功能（核心修改：统一使用hide类控制显示）
const initCategoryFilter = () => {
  const categoryItems = document.querySelectorAll('.category-item');
  const productItems = document.querySelectorAll('.product-item');

  // 分类点击事件
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      // 切换分类的选中样式
      categoryItems.forEach(navItem => navItem.classList.remove('active'));
      item.classList.add('active');

      // 获取目标分类（“all”代表全部）
      const targetCategory = item.dataset.category;

      // 筛选商品：统一使用hide类，和搜索功能兼容
      productItems.forEach(product => {
        if (targetCategory === 'all') {
          product.classList.remove("hide"); // 显示所有商品
        } else {
          // 匹配对应分类的商品：添加/移除hide类
          if (product.dataset.category === targetCategory) {
            product.classList.remove("hide");
          } else {
            product.classList.add("hide");
          }
        }
      });
    });
  });

  // 页面加载时默认触发“全部”分类的点击（确保初始显示所有商品）
  categoryItems[0].click();
};

// 修正后的初始化代码
window.addEventListener("DOMContentLoaded", () => {
  new Banner(); // 初始化轮播图
  new Search(); // 初始化搜索功能
  initCategoryFilter(); // 初始化分类筛选（正确调用）
});