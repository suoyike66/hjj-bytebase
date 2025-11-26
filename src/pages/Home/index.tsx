import logo from '@/assets/logo.svg';
import noDataImage from '@/assets/no-data-DEkwQ1sO.webp';
import { useState, useEffect } from 'react';
import { getGithubUserInfo, logout } from '@/apis/githubAuth';
import type { GithubUserInfo } from '@/apis/githubAuth';
import { useNavigate, Outlet } from 'react-router-dom';

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('workspace'); // workspace 或 subscription
  const [userInfo, setUserInfo] = useState<GithubUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取GitHub用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 从localStorage获取token
        const token = localStorage.getItem('github_token');
        if (token) {
          const info = await getGithubUserInfo(token);
          setUserInfo(info);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout();
      // 清除localStorage中的token
      localStorage.removeItem('github_token');
      // 重定向到根路径
      navigate('/');
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使API调用失败，也清除本地token并重定向
      localStorage.removeItem('github_token');
      navigate('/');
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 顶部导航栏 */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Bytebase Logo" className="h-8" />
          </div>

          {/* 中间导航选项 */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleTabChange('workspace')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'workspace' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              工作区
            </button>
            <button
              onClick={() => handleTabChange('subscription')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'subscription' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              订阅
            </button>
          </div>

          {/* 右侧用户菜单 */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              {userInfo ? (
                <>
                  <img 
                    src={userInfo.avatar_url} 
                    alt={`${userInfo.name || userInfo.login} 的头像`} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="hidden md:inline text-sm font-medium">
                    {userInfo.name || userInfo.login}
                  </span>
                </>
              ) : !loading ? (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  BB
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              )}
            </button>

            {/* 下拉菜单 */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Organization
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDropdown(false);
                    navigate('/home/setting');
                  }}
                >
                  setting
                </a>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* 用户信息显示区域 */}
        {userInfo && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={userInfo.avatar_url} 
                  alt={`${userInfo.name || userInfo.login} 的头像`} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {userInfo.name || userInfo.login}
                  </h2>
                  {userInfo.email && (
                    <p className="text-gray-600 text-sm">
                      {userInfo.email}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                来自 GitHub 账户
              </span>
            </div>
          </div>
        )}
        
        {/* 标签页标题 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {activeTab === 'workspace' ? '工作区' : '订阅'}
        </h1>

        {/* 工作区内容 */}
        {activeTab === 'workspace' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
            {/* 空状态插图 */}
            <div className="max-w-xs mx-auto mb-6">
              <div className="text-center">
                <div className="inline-block">
                  {/* 使用指定的no-data图片 */}
                  <img 
                    src={noDataImage} 
                    alt="No Data" 
                    className="max-w-full h-auto" 
                  />
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">没有工作区</p>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200">
              创建工作区
            </button>
          </div>
        )}

        {/* 订阅内容 */}
        {activeTab === 'subscription' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* 云/自托管切换 */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-center space-x-6">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md font-medium">
                  云
                </button>
                <button className="px-6 py-2 bg-white text-gray-700 rounded-md font-medium border border-gray-300">
                  自托管
                </button>
              </div>
              <div className="text-center mt-2">
                <a href="#" className="text-indigo-600 text-sm hover:underline">
                  比较自托管和云托管
                </a>
              </div>
            </div>

            {/* 订阅计划 */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 社区版 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">社区</h3>
                  <p className="text-gray-600 mb-4">专为独立开发者、业余项目和实验而设计。</p>
                  <div className="text-4xl font-bold text-gray-800 mb-4">0美元</div>
                  <p className="text-gray-600 mb-6">最多3个用户和10个实例</p>
                  <ul className="space-y-2 mb-8">
                    {[
                      '完整的数据库变更管理',
                      '基于 Git 的版本控制和模式迁移',
                      '包含 200 多条规则的 SQL 审查',
                      '自动备份和一键回滚',
                      '带有人工智能辅助功能的基于 Web 的 SQL 编辑器',
                      '模式图和数据导出',
                      '基本身份和访问管理及安全功能',
                      '社区支持'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 专业版 */}
                <div className="border-2 border-indigo-500 rounded-lg p-6 bg-indigo-50 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">专业版</h3>
                  <p className="text-gray-600 mb-4">专为创建可用于生产环境的应用程序的团队而设计。</p>
                  <div className="text-4xl font-bold text-gray-800 mb-4">20美元</div>
                  <p className="text-gray-600 mb-6">用户月度</p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">最多支持 20 个用户和 10 个实例</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">免费内容全部，外加：</span>
                    </li>
                    {[
                      '批量查询功能',
                      '实例治理连接',
                      '查询只读模式',
                      'Google 和 GitHub 单点登录',
                      '用户组管理',
                      '数据库组',
                      '有限的审计日志',
                      '电子邮件支持'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded">-</button>
                    <span className="text-gray-800 font-medium">5</span>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded">+</button>
                    <span className="text-gray-600 text-sm">用户</span>
                  </div>
                </div>

                {/* 企业版 */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">企业</h3>
                  <p className="text-gray-600 mb-4">在确保合规的前提下，安全地扩展您的业务。</p>
                  <div className="text-4xl font-bold text-gray-800 mb-4">风俗</div>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">根据需求自定义限制：</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">专业版的所有功能，外加：</span>
                    </li>
                    {[
                      '自定义用户和实例限制',
                      '风险评估和审批流程',
                      '完整审计日志',
                      '企业单点登录（自定义 OAuth2、OIDC、LDAP）',
                      '双因素身份验证和高级身份验证策略',
                      '数据掩码和加密',
                      '自定义角色和角色申请工作流程',
                      'SCIM 用户配置和目录同步',
                      '外部秘密管理集成',
                      '定制品牌标识和水印',
                      '提供 SLA 支持'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* 渲染子路由内容 */}
      <Outlet />

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 Bytebase, Inc. 保留所有权利。
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;