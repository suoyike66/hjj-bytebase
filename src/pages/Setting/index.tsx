import React, { useState, useEffect } from 'react';
import type { GithubUserInfo } from '@/apis/githubAuth';
import { getGithubUserInfo, getGithubAuthUrl } from '@/apis/githubAuth';

// Setting页面组件
const Setting: React.FC = () => {
  // GitHub用户信息状态
  const [githubUser, setGithubUser] = useState<GithubUserInfo | null>(null);
  
  // Profile部分的状态
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  // Organization部分的状态
  const [displayName, setDisplayName] = useState('若衣客');
  const [website, setWebsite] = useState('www.example.com');

  // 从localStorage获取GitHub用户信息并使用API获取完整数据
  useEffect(() => {
    const fetchGithubUserInfo = async () => {
      try {
        console.log('开始获取GitHub用户信息');
        
        // 从localStorage获取用户信息和token
        const userInfoStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('从localStorage获取数据:', { userInfoStr: !!userInfoStr, token: !!token });
        
        // 开发环境下，如果没有token，提示用户登录
        if (!token && import.meta.env.DEV) {
          console.log('开发环境：未找到token，请先完成GitHub登录获取真实token');
        }
        
        // 添加调试信息，显示token类型
        if (token) {
          const isMockToken = token.includes('mock') || token.includes('fallback');
          console.log(`当前token类型: ${isMockToken ? '模拟token' : '可能是真实token'}`);
        }
        
        // 先设置基础用户信息
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          console.log('基础用户信息:', userInfo);
          setGithubUser(userInfo as GithubUserInfo);
          // 设置表单初始值为GitHub用户信息
          setEmail(userInfo.email || '');
          setName(userInfo.name || userInfo.login || '');
          setDisplayName(userInfo.company || '');
        }
        
        // 如果有token，调用GitHub API获取完整用户信息
        if (token) {
          console.log('使用GitHub token获取完整用户信息');
          try {
            // 验证token格式有效性
            if (typeof token !== 'string' || token.trim() === '') {
              throw new Error('无效的token格式');
            }
            
            const fullUserInfo = await getGithubUserInfo(token);
            console.log('成功获取完整GitHub用户信息:', fullUserInfo);
            setGithubUser(fullUserInfo);
            // 更新表单初始值为完整的GitHub用户信息
            setEmail(fullUserInfo.email || '');
            setName(fullUserInfo.name || fullUserInfo.login || '');
            setDisplayName(fullUserInfo.company || '');
            
            // 将获取到的完整用户信息保存到localStorage
            localStorage.setItem('user', JSON.stringify(fullUserInfo));
          } catch (apiError) {
            console.error('GitHub API调用失败:', apiError);
            
            // 如果API调用失败，尝试使用基础用户信息
            if (!githubUser && userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              console.log('回退到基础用户信息:', userInfo);
              setGithubUser(userInfo as GithubUserInfo);
            }
            
            // 清除无效的token，以便用户可以重新登录
            if (apiError instanceof Error && apiError.message.includes('401')) {
              console.log('检测到401错误，清除无效token');
              localStorage.removeItem('token');
            }
          }
        } else {
          console.log('未找到GitHub token，无法获取完整用户信息');
        }
      } catch (error) {
        console.error('获取GitHub用户信息失败:', error);
      }
    };
    
    fetchGithubUserInfo();
  }, []);
  
  // 处理Profile部分的保存
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加保存Profile信息的逻辑
    console.log('Profile saved:', { email, name });
    // 可以添加成功提示或API调用
  };

  // 处理Organization部分的保存
  const handleOrganizationSave = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加保存Organization信息的逻辑
    console.log('Organization saved:', { displayName, website });
    // 可以添加成功提示或API调用
  };

  return (
    <div className="py-8">
      {/* 主内容区域 */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>
        
        {/* Profile部分 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile</h2>
          
          {/* GitHub账户信息展示 */}
          {githubUser && (
            <div className="p-4 bg-gray-50 rounded-md mb-6">
              <div className="flex items-center mb-4">
                <img 
                  src={githubUser.avatar_url} 
                  alt={`${githubUser.name || githubUser.login} 的头像`} 
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                />
                <div>
                  <p className="text-xl font-medium text-gray-800">{githubUser.name || githubUser.login}</p>
                  <p className="text-gray-600">@{githubUser.login}</p>
                  {githubUser.html_url && (
                    <a 
                      href={githubUser.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 text-sm hover:underline inline-block mt-1"
                    >
                      查看 GitHub 个人主页
                    </a>
                  )}
                </div>
              </div>
              
              {/* 用户统计信息 */}
              <div className="flex space-x-4 mt-3 text-sm">
                <div>
                  <span className="font-medium text-gray-800">{githubUser.followers || 0}</span>
                  <span className="text-gray-600 ml-1">关注者</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">{githubUser.following || 0}</span>
                  <span className="text-gray-600 ml-1">关注</span>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleProfileSave}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Save changes
            </button>
          </form>
        </div>

        {/* Organization部分 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Organization</h2>
          
          {/* GitHub组织信息展示 */}
          {githubUser ? (
            <div className="p-4 bg-gray-50 rounded-md mb-6">
              <p className="text-gray-700 font-medium mb-3">GitHub详细信息:</p>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">公司/组织:</span>
                  <span className="text-gray-800 ml-2">{githubUser.company || '未提供'}</span>
                </div>
                <div>
                  <span className="text-gray-500">位置:</span>
                  <span className="text-gray-800 ml-2">{githubUser.location || '未提供'}</span>
                </div>
                {githubUser.email && (
                  <div>
                    <span className="text-gray-500">邮箱:</span>
                    <span className="text-gray-800 ml-2">{githubUser.email}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block mb-1">个人简介:</span>
                  <p className="text-gray-800">{githubUser.bio || '未提供'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-md mb-6">
              <p className="text-gray-500">未获取到GitHub用户信息，请完成GitHub登录</p>
              <button 
                onClick={() => window.location.href = getGithubAuthUrl()}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                前往GitHub登录
              </button>
              {import.meta.env.DEV && (
                <p className="text-gray-400 text-sm mt-2">开发环境下API调用失败时将自动使用模拟数据</p>
              )}
            </div>
          )}
          
          <form onSubmit={handleOrganizationSave}>
            <div className="mb-6">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;