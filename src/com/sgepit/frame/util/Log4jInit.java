package com.sgepit.frame.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

/**
 * 日志初始化类
 * 采用了动态改变日志路径方法来实现相对路径保存日志文件
 * 参数log4j指定配置文件
 * 参数logFilePath设置日志文件的路径，如果未设置，将根据服务器类型来决定
 * 对于Tomcat5~6，位于tomcat/logs目录下
 * 在web.xml中的配置实例
 * <servlet>
 * <servlet-name>log4j-init</servlet-name>
 * <servlet-class>Log4jInit</servlet-class>
 *   <init-param>
 *     <param-name>log4j</param-name>
 *     <param-value>WEB-INF/classes/log4j.properties</param-value>
 *   </init-param>
 *   <init-param>
 *     <param-name>logFilePath</param-name>
 *     <param-value></param-value>
 *   </init-param>
 * <load-on-startup>1</load-on-startup>
 * </servlet>
 */

public class Log4jInit extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	static Logger logger = Logger.getLogger(Log4jInit.class);
	private String LogFilePath = "";
	public static String LogFile = "";
	
	public Log4jInit() {
	
	}

	public void init(ServletConfig config) throws ServletException {
		String appRealPath = config.getServletContext().getRealPath("/");
		logger.info(appRealPath);		
		String log4jConfigFile = appRealPath + config.getInitParameter("log4j");
		initLogFilePath(config.getInitParameter("logFilePath"), appRealPath);
		
		
		Properties props = new Properties();
		try {
			FileInputStream istream = new FileInputStream(log4jConfigFile);
			props.load(istream);
			istream.close();
			LogFile = this.LogFilePath + props.getProperty("log4j.appender.logfile.File");
			logger.info(LogFile);
			props.setProperty("log4j.appender.logfile.File", LogFile);
			PropertyConfigurator.configure(props);
		} catch (IOException e) {
			logger.error("Could not read configuration file [" + log4jConfigFile + "].");
			logger.error("Ignoring configuration file [" + log4jConfigFile + "].");
			return;
		}
	}
	/**
	 * 设置日志文件路径或�?�web.xml指定的日志路径配�?
	 * @param logFilePath 首先按照web.xml中的配置来设�?
	 * @param appRealPath 若logFilePath未设置或为空，则根据应用程序起始路径和应用服务器类型来决定日志路�?
	 */
	public void initLogFilePath(String logFilePath, String appRealPath) {
		if (logFilePath!=null && !logFilePath.equals("")) {
			this.LogFilePath = logFilePath;
		}
		if (this.LogFilePath.equals("")) {
			if (ServerDetector.isTomcat()) {
				String str = appRealPath.substring(0, appRealPath.lastIndexOf(java.io.File.separator)); //up to crg
				str = str.substring(0, str.lastIndexOf(java.io.File.separator)); //up to webapps
				str = str.substring(0, str.lastIndexOf(java.io.File.separator)); //up to tomcat
				str = str.concat(java.io.File.separator.concat("logs").concat(java.io.File.separator));
				this.LogFilePath = str;
				logger.info("Tomcat");
			}
		}
		logger.info(this.LogFilePath);
	}
	
	public void setLogFilePath(String path) {
		this.LogFilePath = path;
	}
}
