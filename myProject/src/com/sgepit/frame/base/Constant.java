package com.sgepit.frame.base;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.context.WebApplicationContext;

public class Constant {
	private static final Log log = LogFactory.getLog(Constant.class);
	
	public static WebApplicationContext wact;	
	public static String JndiName;
	
	public static DataSource DATASOURCE = null;
	public static String indexType="";
	
	public static final String HTTP_CONTENT_TYPE_GB2312 = "text/html; charset=gb2312";	
	public static final String CHARACTER_ENCODING_GB2312 = "gb2312";
	public static final String HTMLMETAHEADER = "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>";
	public static final String ENCODING = "utf-8";
	
	
	public static String NTKOCAB = "jsp/common/appendix/OfficeControl.cab#version=4,0,3,8";
	public static String NTKOCOPYRIGHT="<param name='ProductCaption' value='华中科技'><param name='ProductKey' value='9263657095908E7B801057D8F41DC1550F27FB12'>";
	
	public static final String SPLITA = ";";
	public static final String SPLITB = "`";
	public static final Object SPLITC = "|";
	public static final String SPLITD = "``";
	public static final String SPLITE = ",";
	public static final String SUCCESS="ok";
	
	public static String DefaultOrgRootID;
	public static String DefaultOrgRootNAME;//"河南新密煤电有限公司";//
	public static final String CommonModuleRootID = "00";	
	public static final String DefaultModuleRootID = "01";
	public static String DefaultModuleRootName;
	
	public static String APPModuleRootID;
	public static String APPOrgRootID ="APPOrgRootID";
	public static String APPOrgRootNAME = "APPOrgRootNAME";
	public static String APPBudgetRootID = "root";
	
	public static String AppRootDir;
	public static String AppRoot;
	public static String LOGINURL;
	public static String AppClassesDir;

	public static String APPINDEXPAGE = "jsp/index/main";
	public static String APPTOPMENUPAGE = "jsp/index/topmenu.jsp";

	public static final String TODOPAGE = "jsp/index/todo.jsp";
	public static final String DATETIMEFORMAT = "yyyy-MM-dd HH:mm:ss";
	public static final String TEMPFOLDER = "temp";
	public static final long MAXFILESIZE = 100 * 1024 * 1024;
	public static final String FILESOURCE = "database";
	public static String COMPRESS = "1";//是否压缩
	
	
	public static final String USER = "rockUser"; //userid
	
	public static final String USERID = "userid"; //userid
	public static final String USERACCOUNT = "userAccount"; //登陆账号
	public static final String USERNAME = "username"; //用户姓名
	public static final String USERUNITID = "unitid"; //单位ID	
	public static final String USERDEPTID = "deptid"; //部门ID
	public static final String USERPOSID = "posid"; //岗位ID
	public static final String USERUNITNAME = "unitname";	//单位名称
	public static final String USERDEPTPOSNAME = "deptname";//部门+岗位名称
	
	public static final String USERBELONGUNITID = "userBelongUnitid";//录属公司ID
	public static final String USERBELONGUNITNAME = "userBelongUnitname";//录属公司名称
	public static final String USERBELONGUNITTYPEID = "userBelongUnitTypeId";//录属公司类型
	
	public static final String CURRENTAPPPID = "currentAppId";//当前操作项目单位ID
	public static final String CURRENTAPPPNAME = "currentAppName";//当前操作项目单位名称
	public static final String USERPIDS = "userPids";//用户可管理项目单位ID(逗号分隔)
	public static final String USERPNAMES = "userPnames";//用户可管理项目单位名称(逗号分隔)
	
	//CURRENTAPPPID
	//CURRENTAPPPNAME
	//USERPIDS(逗号分割)
	//USERPNAMES(逗号分割)
	


	public static final String USERMODULES = "usermodules";
	public static final String USERMODULEACTIONS = "usermoduleactions";
	public static final String ModuleLVL = "moduleLVL";
	public static final String ModuleActions = "moduleActions";
	public static final String MODULEFLAG_OF_PORTLET = "3";
	
	public static final String UNITTYPE = "orgtype";//单位类型
	public static final String ROLETYPE = "roletype";//最高角色类型
	public static final String ISLEADER = "leader";//leader

	public static final Integer IDF_SYSROLE_ALL = 1; // 完全控制
	public static final Integer IDF_SYSROLE_WRITE = 2; // 写
	public static final Integer IDF_SYSROLE_READ = 3; // 读
	public static final Integer IDF_SYSROLE_DISABLED = 4; // 禁止访问
	

	public static final String ADMIN_ID = "1";
	
	public static final String ADMIN_ROLE_ID = "admin";
	public static final String PUBLIC_ROLE_ID = "public";
	
	public static final String ADMIN_ROLE_TYPE = "0";
	public static final String MANAGER_ROLE_TYPE = "1";
	public static final Object PUBLIC_ROLE_TYPE = "2";
	public static final Object LEADER_ROLE_TYPE = "3";
	
	public static final String ADMIN_ROLE_NAME = "系统管理员";
	public static final String MANAGER_ROLE_NAME = "用户管理员";
	public static final Object PUBLIC_ROLE_NAME = "公用角色";
	public static final Object LEADER_ROLE_NAME = "公司领导";

	public static String URL_FLOWDEFINE = "";
	public static String URL_ListMessageNodes = "";
	public static String URL_ListMessagePath = "";
	public static String URL_SaveNodeLayout = "";
	public static String URL_GetNode = "";
	public static String URL_SMARTFLOWOCX = "";
	public static String matDeptId="";
	
	//首页OA和公司网站地址
	public static String companyWebUrl = "";
	public static String companyOAUrl = "";
	
	public static WebApplicationContext WEBCONTEXT;
	public static final boolean DEBUG_STATUS = false;
	public static JdbcTemplate Template = null;
    
	public static final String PRIVILEGE_WRITE = "1";
	public static final String PRIVILEGE_READ = "1";
	public static final String USENAME = USERNAME;
	public static final String FUNLIST = "";
	
	public static Map<String,String> propsMap = new HashMap<String,String>();
	
    static {
		try {
			InputStream is = Constant.class.getResourceAsStream("/system.properties");
			String osName = System.getProperty("os.name")==null?"Windows":System.getProperty("os.name");
			
			
			String classesDir = Constant.class.getClassLoader().getResource("/system.properties").getPath().replace("\\", "/");
			//Linux返回路径,  如:   /home/develop/tomcat/webapps/frame/WEB-INF/classes/
			//Windows返回路径,如:   /D:/WorkFile/tomcat/webapps/frame/WEB-INF/classes/
			if(!(osName.equalsIgnoreCase("linux"))){//如果不是linux，则剔除path的第一个斜杠
				classesDir = classesDir.substring(1);
			}
			
			String tmpDir = classesDir.substring(0, classesDir.lastIndexOf("/"));// 路径如： ..../frame/WEB-INF/classes
			tmpDir = tmpDir.substring(0, tmpDir.lastIndexOf("/")); // 路径如： ..../frame/WEB-INF
			tmpDir = tmpDir.substring(0, tmpDir.lastIndexOf("/")); // 路径如： ..../frame

			Constant.AppClassesDir = classesDir.substring(0, classesDir.lastIndexOf("/")).concat("/");// 路径如： ..../frame/WEB-INF/classes/
			Constant.AppRootDir = tmpDir.concat("/");// 路径如： ..../frame/
			
			log.info("服务所用操作系统："+osName);
			log.info("Class文件根目录："+Constant.AppClassesDir);
			log.info("工程文件根 目 录："+Constant.AppRootDir);
			
			Properties p = new Properties();
			p.load(is);
			URL_SMARTFLOWOCX = p.getProperty("URL_SMARTFLOWOCX");
			URL_FLOWDEFINE = p.getProperty("URL_FLOWDEFINE");
			URL_ListMessageNodes = p.getProperty("URL_ListMessageNodes");
			URL_ListMessagePath = p.getProperty("URL_ListMessagePath");
			URL_SaveNodeLayout = p.getProperty("URL_SaveNodeLayout");
			URL_GetNode = p.getProperty("URL_GetNode");
			
			companyWebUrl = p.getProperty("URL_COMPANY_WEB");
			companyOAUrl = p.getProperty("URL_COMPANY_OA");
			
			DefaultOrgRootID = p.getProperty("DEFAULTORGROOTID");
			DefaultOrgRootNAME = p.getProperty("DEFAULTORGROOTNAME");
			DefaultModuleRootName = p.getProperty("DEFAULTMODULEROOTNAME");
			if(p.getProperty("APPINDEXPAGE")!=null && p.getProperty("APPINDEXPAGE").length()>0){
				APPINDEXPAGE = p.getProperty("APPINDEXPAGE");
			}
			if(p.getProperty("APPTOPMENUPAGE")!=null && p.getProperty("APPTOPMENUPAGE").length()>0){
				APPTOPMENUPAGE = p.getProperty("APPTOPMENUPAGE");
			}
//			系统使用的Office控件版本号
			if(p.getProperty("NTKOCOPYRIGHT")!=null && p.getProperty("NTKOCOPYRIGHT").length()>0){
				NTKOCOPYRIGHT = p.getProperty("NTKOCOPYRIGHT");
			}
			if(p.getProperty("NTKOCAB")!=null && p.getProperty("NTKOCAB").length()>0){
				NTKOCAB = p.getProperty("NTKOCAB");
			}
			Enumeration<String> emt = (Enumeration<String>) p.propertyNames();
			for(;emt.hasMoreElements();){
				String code = emt.nextElement();
				propsMap.put(code, p.getProperty(code));
			}
			
			is.close();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/*
	 * get JdbcTemplate
	 */
	public static JdbcTemplate getJdbcTemplate() {
		if (Template == null) {
			Template = new JdbcTemplate();
			ApplicationContext ctx = getContext();
			DataSource ds = (DataSource) ctx.getBean("dataSource1");
			Template.setDataSource(ds);
		}
		return Template;
	}
	/*
	 * get ApplicationContext
	 */
	public static ApplicationContext getContext() {
		ApplicationContext ctx;
		if (DEBUG_STATUS) {
			String[] location = { "*.xml" };
			ctx = new ClassPathXmlApplicationContext(location);
		} else {
			ctx = WEBCONTEXT;
		}
		return ctx;
	}
	
	public static String UrlparamsEncode(String s)
	{
		s = s.replaceAll("[%]", "%25");
		s = s.replaceAll("[+]", "%2B");
		s = s.replaceAll("[ ]", "%20");
		s = s.replaceAll("[/]", "%2F");
		s = s.replaceAll("[?]", "%3F");
		s = s.replaceAll("[#]", "%23");
		s = s.replaceAll("[&]", "%26");
		s = s.replaceAll("[=]", "%3D");
		return s;
	}
	/**
	 * 异常信息
	 * @param t
	 * @return
	 */
	public static String getTrace(Throwable t) {   
        StringWriter stringWriter= new StringWriter();   
        PrintWriter writer= new PrintWriter(stringWriter);   
        t.printStackTrace(writer);   
        StringBuffer buffer= stringWriter.getBuffer();   
        return buffer.toString();   
	}
}
