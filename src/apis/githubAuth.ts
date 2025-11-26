import { http } from '@/utils/http';

// GitHub用户信息类型定义
export interface GithubUserInfo {
  id: number;
  login: string; // GitHub用户名
  name: string; // 用户真实姓名
  email?: string;
  avatar_url: string; // 头像URL
  bio?: string;
  company?: string;
  location?: string;
  html_url: string; // GitHub个人主页
  followers: number;
  following: number;
}

// GitHub登录相关的API接口封装

/**
 * 获取GitHub授权URL
 * 用于重定向用户到GitHub授权页面
 */
export const getGithubAuthUrl = () => {
  // 实际项目中，这个URL通常由后端提供，或者使用环境变量配置GitHub OAuth应用信息
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-client-id';
  
  // 配置正确的redirect_uri，根据环境使用不同的URL
  let redirectUri: string;
  
  // 生产环境（GitHub Pages）使用GitHub Pages的URL
  if (window.location.hostname === 'suoyike66.github.io') {
    redirectUri = encodeURIComponent('https://suoyike66.github.io/hjj-bytebase/');
  } else {
    // 开发环境使用localhost
    redirectUri = encodeURIComponent('http://localhost:5173');
  }
  
  const scope = 'user:email'; // 请求的权限范围
  
  console.log('GitHub OAuth配置:', { clientId, redirectUri });
  console.log('当前环境:', import.meta.env.DEV ? '开发环境' : '生产环境');
  console.log('当前hostname:', window.location.hostname);
  
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
};

/**
 * 处理GitHub OAuth回调，获取访问令牌
 * @param code GitHub返回的授权码
 */
export const handleGithubCallback = async (code: string) => {
  console.log('进入handleGithubCallback函数');
  
  try {
    // 验证传入的授权码
    if (!code || typeof code !== 'string') {
      console.error('无效的授权码:', code);
      throw new Error('无效的授权码');
    }
    
    // 开发环境下，模拟成功响应，避免调用不存在的后端API
    if (import.meta.env.DEV) {
      console.log('开发环境模拟GitHub OAuth回调处理');
      console.log('收到的授权码:', code.substring(0, 10) + '...'); // 仅显示部分授权码以保护隐私
      
      // 创建健壮的模拟响应数据
      const mockResponse = {
        token: 'mock-github-token-' + Date.now(),
        user: {
          id: 1,
          name: '测试用户',
          email: 'test@example.com',
          login: 'testuser',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
        },
        success: true,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后过期
      };
      
      // 模拟更合理的网络延迟（减少到500ms）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('开发环境模拟成功，准备返回mock数据');
      return mockResponse;
    }
    
    // 生产环境正常调用后端API
    console.log('生产环境：准备调用后端API');
    const response = await http.post('/api/auth/github', {
      code,
    });
    
    if (!response || !response.data) {
      throw new Error('无效的API响应');
    }
    
    console.log('后端API调用成功');
    return response.data;
  } catch (error) {
    console.error('GitHub登录回调处理失败:', error);
    
    // 即使在开发环境下API调用失败，也返回模拟数据
    if (import.meta.env.DEV) {
      console.log('开发环境下API调用失败，返回备用mock数据');
      return {
        token: 'fallback-mock-token-' + Date.now(),
        success: true,
        user: {
          id: 999,
          name: '备用测试用户',
          email: 'fallback@example.com'
        }
      };
    }
    
    // 为了开发环境的健壮性，即使配置了生产环境但API调用失败，也提供回退机制
    console.warn('生产环境配置下API调用失败，提供回退跳转保障');
    return {
      token: 'emergency-fallback-token-' + Date.now(),
      success: false,
      error: 'API调用失败，但提供回退token以确保跳转'
    };
  }
};

/**
 * 获取当前登录用户信息
 */
export const getCurrentUser = async () => {
  try {
    const response = await http.get('/api/user');
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 退出登录
 */
export const logout = async () => {
  try {
    const response = await http.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('退出登录失败:', error);
    throw error;
  }
};

/**
 * 获取GitHub用户信息
 * 直接调用GitHub API获取当前授权用户的详细信息
 * @param token GitHub访问令牌
 */
export const getGithubUserInfo = async (token: string): Promise<GithubUserInfo> => {
  try {
    // 验证token是否为模拟token
    const isMockToken = token.includes('mock') || token.includes('fallback');
    
    console.log('使用token类型:', isMockToken ? '模拟token' : '实际token');
    console.log('当前环境:', import.meta.env.DEV ? '开发环境' : '生产环境');
    
    // 直接调用GitHub API获取用户信息
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      const errorStatus = response.status;
      console.error(`GitHub API调用失败，状态码: ${errorStatus}`);
      
      // 在开发环境中，所有401错误都返回模拟数据，确保用户体验
      if (import.meta.env.DEV && errorStatus === 401) {
        console.log('开发环境：遇到401未授权错误，提供模拟用户数据以确保页面正常显示');
        const mockUserInfo: GithubUserInfo = {
          id: 1,
          login: 'mock-user',
          name: '模拟用户',
          avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
          bio: '这是一个模拟的用户简介',
          company: '模拟公司',
          location: '模拟城市',
          html_url: 'https://github.com/mock-user',
          followers: 100,
          following: 50
        };
        console.log('返回模拟GitHub用户信息:', mockUserInfo);
        return mockUserInfo;
      }
      throw new Error(`GitHub API请求失败: ${errorStatus}`);
    }
    
    const userInfo = await response.json();
    console.log('GitHub用户信息:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('获取GitHub用户信息失败:', error);
    // 开发环境下，捕获所有错误并返回模拟数据
    if (import.meta.env.DEV) {
      console.log('开发环境：捕获到错误，提供备用模拟用户数据');
      const fallbackUserInfo: GithubUserInfo = {
        id: 2,
        login: 'fallback-user',
        name: '回退用户',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        bio: '这是一个回退的用户简介',
        company: '回退公司',
        location: '回退城市',
        html_url: 'https://github.com/fallback-user',
        followers: 50,
        following: 25
      };
      return fallbackUserInfo;
    }
    throw error;
  }
};