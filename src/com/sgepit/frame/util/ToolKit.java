package com.sgepit.frame.util;

import java.io.InputStream;
import java.util.Properties;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ToolKit {

    private static Log log = LogFactory.getLog(ToolKit.class);
    
    private static Properties prop = null;
    
    static{
        loadProperties();
    }
    
    /**
     * 预加载资源文件
     *
     */
    private static void loadProperties()
    {
        prop = new Properties();
        
        try{
            
            InputStream is = ToolKit
                    .class.getClassLoader()
                    .getResourceAsStream("sgcc.properties");
            
            prop.load(is);
            
        }catch(Exception e)
        {
            log.error("# read configuration file fail! cause : " + e);
        }       
    }
    

	/**
	 * 获取资源文件
	 * @return
	 */
    public static Properties getProperties()
    {
        if (prop == null)
            loadProperties();
        
        return prop;
    }
    
    /**
     * 函数功能：设置token至request中
     * @param request HttpServletRequest
     * @param tokenValue 要设置至客户端的token值
     * @param isRefresh 用户刷新标志
     */
    public static void saveTokenToRequest(HttpServletRequest request , String tokenValue , boolean isRefresh)
    {
        String token = tokenValue;        
        Object obj = request.getSession().getAttribute("submitToken");
        
        if (!isRefresh)
            request.getSession().setAttribute("submitToken" , token);
        
        if (obj == null && !isRefresh) 
            request.setAttribute("submitToken" , token);
        
        if (obj != null && isRefresh)
            request.setAttribute("submitToken" , obj.toString());
    }
    
    /**
     * 函数功能：验证token是否有效
     * @param request
     * @return boolean
     */
    public static boolean isTokenValidInRequest(HttpServletRequest request)
    {
        Object obj = request.getSession().getAttribute("submitToken");
        String token2 = request.getParameter("submitToken");
        
        if (obj == null && token2.length() < 1) return true;
        
        if (obj == null) return false;
        if (token2.length() < 1) return false;
        
        String token = (String)obj;       
        
        if (token.equals(token2))
            return true;
        
        return false;
    }
        
    /**
     * 函数功能：重置token
     * @param request 
     */
    public static void resetTokenInRequest(HttpServletRequest request)
    {
        request.getSession().removeAttribute("submitToken");
    }
    
 
    

    

    

    
   
    
    

}
