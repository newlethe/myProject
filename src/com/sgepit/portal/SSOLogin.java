package com.sgepit.portal;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.MD5Util;

public class SSOLogin extends MainServlet {
	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private SystemMgmFacade systemMgm;
	private BaseMgmFacade baseMgm;
	private HashMap modulesMap;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);
	
	private static final String NOUSERMSG = "OA用户信息传递错误，请联系系统管理员";
	private static final String USERNOTMATCHMSG = "系统中无该用户，请联系系统管理员";
	private static final String ERRORMSG = "登录验证失败，请联系系统管理员";
	
	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.baseMgm = (BaseMgmFacade) this.wac.getBean("baseMgm");
		this.systemMgm = (SystemMgmFacade) this.wac.getBean("systemMgm");
		this.modulesMap = this.systemMgm.getModulesMap();
		RockPower root = (RockPower) this.baseMgm.findBeanByProperty(
				BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_MODULE), "parentid", "0");
		if (Constant.APPModuleRootID == null)
			Constant.APPModuleRootID = root.getPowerpk();
	}
	/**
	 * Constructor of the object.
	 */
	public SSOLogin() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		MD5Util md5Util = new MD5Util();
		String md5Pwd = md5Util.md5(password);
		if(username.equals("noUser")){			
			response.sendRedirect(request.getContextPath()+"/SSOLoginError.jsp?errorMsg="+new String(this.NOUSERMSG.getBytes("UTF-8"),"ISO-8859-1"));
		}else{
			List<RockUser> userList = this.systemMgm.getUserByWhere("useraccount = '"+username+"'");
			if(userList.size()==1){
				try {
					//if(password.equals("notVerifyPwd")||this.systemMgm.authentication(username,md5Pwd)!=null){
					if(this.systemMgm.authentication(username,md5Pwd)!=null){
						RockUser user = userList.get(0);
						String unitid = user.getUnitid();
						String unitname = this.systemMgm.getUserUnitName(user);
						
						SgccIniUnit unit = this.systemMgm.getUnitById(user.getPosid());
						SgccIniUnit belongUnit = this.systemMgm.getBelongUnit(user.getUnitid());
						
						this.systemMgm.userLogon(user);

						HttpSession s = request.getSession();
						s.setAttribute(Constant.USER, user);
						s.setAttribute(Constant.USERID, user.getUserid());
						s.setAttribute(Constant.USERNAME, user.getRealname());
						s.setAttribute(Constant.USERACCOUNT, username);
						s.setAttribute(Constant.UNITTYPE, unit.getUnitTypeId());
						s.setAttribute(Constant.USERUNITID, unitid);
						s.setAttribute(Constant.USERUNITNAME, unitname);
						s.setAttribute(Constant.USERBELONGUNITID, belongUnit.getUnitid());
						s.setAttribute(Constant.USERBELONGUNITNAME, belongUnit.getUnitname());
						s.setAttribute(Constant.USERBELONGUNITTYPEID, belongUnit.getUnitTypeId());
						
						//设置当前项目单位及可管理的项目单位
						List<SgccIniUnit> pids = this.systemMgm.getPidsByUnitid(belongUnit.getUnitid());
						StringBuilder USERPIDS = new StringBuilder();
						StringBuilder USERPNAMES = new StringBuilder();
						
						for(int i=0,j=pids.size();i<j;i++){
							SgccIniUnit hbm = pids.get(i);
							if(i==0){
								s.setAttribute(Constant.CURRENTAPPPID, hbm.getUnitid());
								s.setAttribute(Constant.CURRENTAPPPNAME, hbm.getUnitname());
							}else{
								if((hbm.getUnitid()).equals(belongUnit.getUnitid())){
									s.setAttribute(Constant.CURRENTAPPPID, hbm.getUnitid());
									s.setAttribute(Constant.CURRENTAPPPNAME, hbm.getUnitname());
								}
							}
							USERPIDS.append(hbm.getUnitid()).append(",");
							USERPNAMES.append(hbm.getUnitname()).append(",");
						}
						if(pids.size()>0){
							String userpids = USERPIDS.toString();
							String userpnames = USERPNAMES.toString();
							s.setAttribute(Constant.USERPIDS, userpids.substring(0, userpids.length()-1));
							s.setAttribute(Constant.USERPNAMES, userpnames.substring(0, userpnames.length()-1));
						}else{
							s.setAttribute(Constant.USERPIDS, null);
							s.setAttribute(Constant.USERPNAMES, null);
							s.setAttribute(Constant.CURRENTAPPPID, null);
							s.setAttribute(Constant.CURRENTAPPPNAME, null);
						}
						log.info("===== [" + username + " : " + user.getRealname()+ "] =========");

						if (unitid.equals(user.getDeptId())
								&& unitid.equals(user.getPosid())) {
							s.setAttribute(Constant.USERDEPTPOSNAME, unitname);
						} else {
							s.setAttribute(Constant.USERDEPTPOSNAME, this.systemMgm
									.getUserDeptPosInfo(user));
						}
						//liangwj(2011-10-24):系统业务不支持用户归属于多个部门，所以所在部门及岗位信息直接从rock_user中读取，而不再从rock_user2dept表中读取
						s.setAttribute(Constant.USERDEPTID, (user.getDeptId()==null?user.getUnitid():user.getDeptId()));
						s.setAttribute(Constant.USERPOSID, (user.getPosid()==null?user.getUnitid():user.getPosid()));
						
						s.setAttribute(Constant.USERMODULES, this.systemMgm.getUserModules(user));
						String roles = this.systemMgm.getUserRoleType(user);
						s.setAttribute(Constant.ROLETYPE, roles.split("`")[0]);
						s.setAttribute(Constant.ISLEADER, roles.split("`")[1]);
						if (roles.split("`")[0].equals("0")) {
							 s.setAttribute(Constant.APPOrgRootID, Constant.DefaultOrgRootID);
							 s.setAttribute(Constant.APPOrgRootNAME, Constant.DefaultOrgRootNAME);
						} else {
							s.setAttribute(Constant.APPOrgRootID, unitid);
							s.setAttribute(Constant.APPOrgRootNAME, unitname);
						}
						StringBuffer sbf = new StringBuffer("");
						if (Constant.indexType == null || Constant.indexType.equals("")
								|| Constant.indexType.equals("0")) {
							sbf.append(request.getContextPath()+"/"+Constant.APPINDEXPAGE + ".jsp");
						} else {
							sbf.append(request.getContextPath()+"/"+Constant.APPINDEXPAGE + Constant.indexType
									+ ".jsp");
						}
						response.sendRedirect(sbf.toString());
					}
				} catch (BusinessException e) {
					// TODO Auto-generated catch block
					response.sendRedirect(request.getContextPath()+"/SSOLoginError.jsp?errorMsg="+new String(this.ERRORMSG.getBytes("UTF-8"),"ISO-8859-1"));
					e.printStackTrace();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					response.sendRedirect(request.getContextPath()+"/SSOLoginError.jsp?errorMsg="+new String(this.ERRORMSG.getBytes("UTF-8"),"ISO-8859-1"));
					e.printStackTrace();
				}
			}else{
				response.sendRedirect(request.getContextPath()+"/SSOLoginError.jsp?errorMsg="+new String(this.USERNOTMATCHMSG.getBytes("UTF-8"),"ISO-8859-1"));
			}
		}
		
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doGet(request, response);
	}

	

}
