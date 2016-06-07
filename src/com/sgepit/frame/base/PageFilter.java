package com.sgepit.frame.base;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class PageFilter implements Filter {
	public String encoding;
	public void init(FilterConfig filterConfig) {
		//若有attach不能跨网段，axis的缺陷或bug
        //System.setProperty("javax.xml.soap.MessageFactory", "org.apache.axis.soap.MessageFactoryImpl");
        //System.setProperty("javax.xml.soap.SOAPConnectionFactory", "org.apache.axis.soap.SOAPConnectionFactoryImpl");
        //sun的saaj，没有问题
        System.setProperty("javax.xml.soap.MessageFactory", "com.sun.xml.messaging.saaj.soap.ver1_1.SOAPMessageFactory1_1Impl");
        System.setProperty("javax.xml.soap.SOAPConnectionFactory", "com.sun.xml.messaging.saaj.client.p2p.HttpSOAPConnectionFactory");
        this.encoding =  filterConfig.getInitParameter("encoding");
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain filterChain) throws IOException, ServletException {
		HttpServletRequest rq = (HttpServletRequest) request;
		HttpServletResponse rp = (HttpServletResponse)response;
		rq.setCharacterEncoding(this.encoding);
		rp.setCharacterEncoding(this.encoding);
		String uri = rq.getRequestURI();
		String ctx = rq.getContextPath() + "/";
		String stopath = ctx+"jsp/index/SessionTimeOut.jsp";
		Object user = rq.getSession().getAttribute(Constant.USERID);
		if(user==null){
			if(uri.indexOf("SysServlet")>-1){  //判断是否是登录或注销请求，判断是否有验证码
				String ac = request.getParameter("ac");
				if(ac != null && !ac.equals("login") && !ac.equals("logout")&& !ac.equals("getVerifyImg")&& !ac.equals("getVerifyCode")){
					rp.sendRedirect(stopath);
					return;
				}
			} else if (uri.indexOf("FlwServlet")>-1){  //流程插入签名
				String ac = request.getParameter("ac");
				if(ac != null && !ac.equals("loadDoc")){
					rp.sendRedirect(stopath);
					return;
				} 
			} else if(uri.indexOf("CrossDomainServlet")>-1){
				
			}else{
				//如果请求地址不满足下面条件，则跳转到系统首页（即登录页面）
				String ext = "";
				if(!uri.equals(ctx)){
					if(uri.indexOf(".")!=-1){
						ext = uri.substring(uri.lastIndexOf("."), uri.length());
					}
				}
				if( !uri.equals(ctx)
						&& !uri.endsWith("genkey.jsp")&& !uri.endsWith("login.jsp") && !uri.endsWith("SessionTimeOut.jsp")    //判断是否是密码生成器页面，登录页面或错误信息显示页面
						&& !ext.equalsIgnoreCase(".jpg") && !uri.endsWith(".js")&& !ext.equalsIgnoreCase(".png")&& !uri.endsWith(".css")
						&& !uri.endsWith(".exe") && !uri.endsWith(".cab")&& !uri.endsWith(".swf")&& !ext.equalsIgnoreCase(".gif")
						&&!ext.equalsIgnoreCase(".tif")
						&& !ext.equalsIgnoreCase(".bmp")
						&& !ext.equalsIgnoreCase(".jpeg")
						&& uri.indexOf("PCDataExchangeServlet")==-1  //数据交换服务可以允许不登录直接访问
						&& uri.indexOf("SSOLogin")==-1 //单点登录通道
					){
					if(uri.endsWith(".dwr")){ //dwr操作单独处理
						rp.getWriter().write("top.location.href = '"+stopath+"'");
						return;
					}else{
						rp.sendRedirect( stopath);
						return;	
					}									
				}
			}		
			//TODO
			//如果是在系统内实现跨应用访问需要单独考虑。后续完善
		}		
		filterChain.doFilter(rq, rp);
	}

	public void destroy() {
		
	}
}