import logo from '@/assets/logo.svg';
import layoutImage from '@/assets/lyout-picture.webp';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleGithubCallback, getGithubUserInfo } from '@/apis/githubAuth';

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查URL中是否包含GitHub返回的授权码
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    // 如果有授权码，处理GitHub回调
    if (code) {
      console.log('Layout页面检测到GitHub授权码，开始处理回调');
      
      const processCallback = async () => {
        try {
          // 调用后端API，使用授权码获取访问令牌
          const response = await handleGithubCallback(code);
          
          // 存储token和用户信息到localStorage
          if (response?.token) {
            localStorage.setItem('github_token', response.token);
            
            // 使用token获取GitHub用户详细信息，包括邮箱
            const userInfo = await getGithubUserInfo(response.token);
            localStorage.setItem('user', JSON.stringify(userInfo));
            
            // 跳转到home页面
            navigate('/home');
          }
        } catch (err) {
          console.error('处理GitHub回调失败:', err);
          // 处理失败后跳转到登录页面
          navigate('/login');
        }
      };
      
      processCallback();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="p-4 sm:p-6">
        <img src={logo} alt="Bytebase Logo" className="h-8" />
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-12">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-800">欢迎来到</span> <span className="text-gray-800">Bytebase</span>
            <br />
            <span className="text-gray-800">Hub</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
            Bytebase Hub 用于访问 Bytebase 云服务并管理您的 Bytebase 云和自托管订阅。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 text-center">
              登录/注册
            </Link>
            <a 
              href="https://www.bytebase.com/pricing/?source=hub" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors duration-200 text-center"
            >
              查看价格
            </a>
          </div>
        </div>
        
        {/* Right Image Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img 
            src={layoutImage} 
            alt="Bytebase 火箭插画" 
            className="max-w-full h-auto object-contain max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh]"
          />
        </div>
      </main>
    </div>
  );
};

export default Layout;