
// 随机文章跳转功能 - 适配 PJAX
(function() {
  'use strict';

  // 文章列表
  var posts = ["posts/248a939e.html","posts/4a17b156.html","posts/5d63715b.html","posts/6973b1b8.html","posts/bbad5266.html","posts/794688f8.html","posts/2ad1033e.html","posts/1a11017e.html","posts/ai-summary-guide.html","posts/ed02a91f.html"];

  // 随机跳转函数
  function toRandomPost() {
    if (posts.length === 0) {
      console.warn('[Random Post] No posts available');
      return;
    }

    // 随机选择一篇文章
    var randomIndex = Math.floor(Math.random() * posts.length);
    var targetUrl = '/' + posts[randomIndex];

    // 避免跳转到当前页面
    var currentPath = window.location.pathname;
    if (currentPath === targetUrl || currentPath === targetUrl + '/') {
      // 如果随机到当前页面，重新随机
      var attempts = 0;
      while ((currentPath === targetUrl || currentPath === targetUrl + '/') && attempts < 5) {
        randomIndex = Math.floor(Math.random() * posts.length);
        targetUrl = '/' + posts[randomIndex];
        attempts++;
      }
    }

    // 使用 PJAX 加载（如果可用）
    if (typeof pjax !== 'undefined' && pjax.loadUrl) {
      pjax.loadUrl(targetUrl);
    } else if (typeof Pjax !== 'undefined') {
      // 备用 PJAX 方案
      window.history.pushState(null, null, targetUrl);
      window.location.reload();
    } else {
      // 普通跳转
      window.location.href = targetUrl;
    }
  }

  // 暴露到全局
  window.toRandomPost = toRandomPost;

  // 监听 PJAX 完成事件，重新绑定点击事件
  document.addEventListener('pjax:complete', function() {
    bindRandomPostButtons();
  });

  // 绑定随机跳转按钮
  function bindRandomPostButtons() {
    var buttons = document.querySelectorAll('[data-random-post]');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        toRandomPost();
      });
    });
  }

  // 初始化绑定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindRandomPostButtons);
  } else {
    bindRandomPostButtons();
  }
})();
