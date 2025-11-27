
import loginBg from '@/assets/login-bg.webp';
import logo from '@/assets/logo.svg';
import { getGithubAuthUrl } from '@/apis/githubAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div 
      className="flex flex-col min-h-screen  from-indigo-900 to-blue-900"
      style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* 主内容区域 - 左右分栏布局 */}
      <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-2rem)] m-4 md:m-8 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out">
        {/* 左侧图片区域 - 保持结构但清除内容 */}
        <div className="hidden md:flex w-full md:w-1/2 bg-transparent relative overflow-hidden flex-col items-center justify-center transition-all duration-300">
          {/* 内容已清除，仅保留背景图可见 */}
        </div>
        
        {/* 右侧登录表单区域 */}
        <div className="w-full md:w-1/2 bg-white flex flex-col p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-300 shadow-lg md:shadow-none">
          <div className="mb-8">
            <img 
              src={logo} 
              alt="Bytebase" 
              className="h-8 w-auto" 
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎</h2>
            <p className="text-gray-600 mb-8">登录Bytebase以继续使用Bytebase Hub。</p>
            
            {/* 第三方登录按钮 */}
            <div className="space-y-4 mb-8">
              <button className="w-full flex items-center justify-center py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.25 12.2748C20.25 11.2076 20.1576 10.1575 19.9639 9.15118H12.25V14.2673H17.4343C17.3228 15.2359 16.8932 16.8725 15.838 17.9402V20.9498H20.1487C21.8475 19.0393 22.75 16.4637 22.75 13.5101C22.75 12.9397 22.7201 12.3753 22.6616 11.8203H20.25V12.2748Z" fill="#4285F4"/>
                  <path d="M12.25 22.75C15.4947 22.75 18.2068 21.6987 20.1487 19.7188V16.7092C18.942 17.7503 17.3715 18.5 15.625 18.5H12.25V13.0469H17.4343C17.3228 14.0155 16.8932 15.6521 15.838 16.7198V19.7294C13.9321 21.667 11.2881 22.75 8.5 22.75C3.80558 22.75 0 18.9444 0 14.25C0 9.55556 3.80558 5.75 8.5 5.75C11.4661 5.75 14.0224 7.01328 15.6771 9.15118L13.0025 11.825C12.2452 11.0492 11.1911 10.5 10.0156 10.5C7.87109 10.5 6.125 12.2461 6.125 14.3906C6.125 16.5352 7.87109 18.2812 10.0156 18.2812C11.2051 18.2812 12.2592 17.8289 13.0123 17.0645L15.6832 19.7305C13.9246 21.5966 11.3819 22.75 8.5 22.75Z" fill="#34A853"/>
                  <path d="M6.125 8.5C5.35467 8.5 4.75 9.10467 4.75 9.875C4.75 10.6453 5.35467 11.25 6.125 11.25C6.89533 11.25 7.5 10.6453 7.5 9.875C7.5 9.10467 6.89533 8.5 6.125 8.5Z" fill="#FBBC05"/>
                  <path d="M8.5 5.75C11.2881 5.75 13.9321 6.83301 15.6771 8.7707C15.7432 8.83715 15.7337 8.94609 15.6592 9.00276L15.625 9.02929L15.6771 9.15118C14.0224 11.2881 11.4661 12.5513 8.5 12.5513C7.87109 12.5513 7.26602 12.4562 6.70374 12.2786L4.34375 14.6387C3.44342 13.7354 2.875 12.5571 2.875 11.2812C2.875 10.0054 3.44342 8.82709 4.34375 7.92383L6.70374 10.2838C7.26602 10.1062 7.87109 10.011 8.5 10.011C11.0956 10.011 13.4653 8.80508 15.0449 6.89307L12.6562 4.50439C10.8026 6.3037 8.5 7.37695 5.75 7.37695C3.33102 7.37695 1.25 5.29594 1.25 2.87695C1.25 0.457943 3.33102 -1.52306 5.75 -1.52306C8.5 0.54919 11.2881 -1.52306 13.0025 0.333008L15.6832 3.00391C13.9246 4.86997 11.3819 6.02306 8.5 6.02306C7.87109 6.02306 7.26602 5.92799 6.70374 5.75L8.5 5.75Z" fill="#EA4335"/>
                </svg>
                <span>继续使用 Google</span>
              </button>
              
              <button 
                className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={async () => {
                  try {
                    // 开发环境下直接模拟登录成功，避免重定向到GitHub
                    if (import.meta.env.DEV) {
                      console.log('开发环境：直接模拟登录成功');
                      const mockToken = 'mock-dev-token-' + Date.now();
                      const mockUser = {
                        id: 1,
                        login: 'dev-user',
                        name: '开发用户',
                        email: 'dev@example.com',
                        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
                      };
                      
                      localStorage.setItem('github_token', mockToken);
                      localStorage.setItem('user', JSON.stringify(mockUser));
                      console.log('测试Token和用户信息已存储到localStorage');
                      
                      // 使用正确的哈希路由格式进行跳转
                      window.location.href = window.location.origin + '/#/home';
                      return;
                    }
                    
                    // 生产环境下正常跳转到GitHub授权页面
                    const authUrl = await getGithubAuthUrl();
                    window.location.href = authUrl;
                  } catch (error) {
                    console.error('登录失败:', error);
                    alert('登录失败，请重试');
                  }
                }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 12.5C23 18.299 18.299 23 12.5 23C6.70101 23 2 18.299 2 12.5C2 6.70101 6.70101 2 12.5 2C18.299 2 23 6.70101 23 12.5Z" fill="#24292E"/>
                  <path d="M9.85714 18.2143V13.2143H14.1429C15.4832 13.2143 16.4125 12.5904 16.4125 11.5714C16.4125 10.5524 15.4832 9.92857 14.1429 9.92857H9.85714V4.92857H14.5714C16.8308 4.92857 18.3839 5.97808 18.3839 8.42857V12.5714C18.3839 15.0219 16.8308 16.0714 14.5714 16.0714H9.85714V18.2143Z" fill="white"/>
                  <path d="M5.71429 6.64286C6.82704 6.64286 7.70567 5.76423 7.70567 4.65148C7.70567 3.53873 6.82704 2.6501 5.71429 2.6501C4.60154 2.6501 3.72291 3.53873 3.72291 4.65148C3.72291 5.76423 4.60154 6.64286 5.71429 6.64286Z" fill="white"/>
                  <path d="M4.78571 18.2143V16.0714H7.67857C7.60312 16.8159 7.21106 17.4653 6.61607 17.9286C6.02108 18.3919 5.30312 18.6554 4.54464 18.6554C3.84821 18.6554 3.21191 18.4437 2.68393 18.0482C2.15596 17.6527 1.76071 17.0819 1.54464 16.3839C1.32857 15.6859 1.23214 14.8964 1.26786 14.0714H4.07143V16.2143C4.07143 16.9767 4.33482 17.6741 4.78571 18.2143Z" fill="white"/>
                </svg>
                <span>继续使用 GitHub</span>
              </button>
              
              <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5458 12.5458C17.5458 9.79484 15.2509 7.5 12.5 7.5C9.74908 7.5 7.45417 9.79484 7.45417 12.5C7.45417 15.2052 9.74908 17.5 12.5 17.5C14.7984 17.5 16.8063 16.0125 17.3521 13.7266H17.3542H17.5458H14.5458V12.25H20.5458V16.2091C20.5458 18.9929 18.0958 21.5 15.25 21.5C11.6938 21.5 8.75 18.5562 8.75 15C8.75 11.3469 11.6938 8.5 15.25 8.5C18.0958 8.5 20.5458 11.0071 20.5458 13.7909V17.75V22.5H17.5458V12.5458Z" fill="#0078D4"/>
                </svg>
                <span>继续使用 Microsoft Account</span>
              </button>
            </div>
            
            {/* 分隔线 */}
            <div className="flex items-center justify-center my-6">
              <div className=" h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">或</span>
              <div className=" h-px bg-gray-300"></div>
            </div>
            
            {/* 邮箱登录表单 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮件地址*</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>
              
              <button className="w-full bg-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5">
                继续
              </button>
            </div>
            
            {/* 注册链接 */}
            <div className="mt-6 text-center">
              <span className="text-gray-600">没有账户？</span>
              <Link to="/register" className="text-blue-600 hover:underline ml-1">注册</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
