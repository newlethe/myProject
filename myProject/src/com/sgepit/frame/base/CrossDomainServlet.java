package com.sgepit.frame.base;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
/**
 * 跨域访问 控制层
 * @author Liuay
 * @createDate Aug 29, 2011
 * 
 */
public class CrossDomainServlet extends MainServlet {

	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private SystemMgmFacade systemMgm;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);

	public CrossDomainServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.systemMgm = (SystemMgmFacade) this.wac.getBean("systemMgm");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String method = request.getParameter("ac");
		if (method != null) {
			if (method.equals("crossDomainLogin")) {
				crossDomainLogin(request, response);
				return;
			}
		}  
	}

	/**
	 * 登录验证
	 * @param request
	 * @param response
	 * @throws IOException
	 * @author: Liuay
	 * @createDate: Aug 29, 2011
	 */
	public void crossDomainLogin(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		String userId = request.getParameter("userId");
		HttpSession session = request.getSession();
		try {
			List<RockUser> userList = this.systemMgm.getUserByWhere("userid='" + userId + "'");
			if (userList.size()>0) {
				RockUser user = userList.get(0);
				String username = user.getUseraccount();
				
				SgccIniUnit unit = this.systemMgm.getUnitById(user.getPosid());
				
				String unitid = user.getUnitid();
				String unitname = this.systemMgm.getUserUnitName(user);
				SgccIniUnit belongUnit = this.systemMgm.getBelongUnit(user.getUnitid());
				
				session.setAttribute(Constant.USER, user);
				session.setAttribute(Constant.USERID, user.getUserid());
				session.setAttribute(Constant.USERNAME, user.getRealname());
				session.setAttribute(Constant.USERACCOUNT, username);
				session.setAttribute(Constant.UNITTYPE, unit.getUnitTypeId());
				session.setAttribute(Constant.USERUNITID, unitid);
				session.setAttribute(Constant.USERUNITNAME, unitname);
				session.setAttribute(Constant.USERBELONGUNITID, belongUnit.getUnitid());
				session.setAttribute(Constant.USERBELONGUNITNAME, belongUnit.getUnitname());
				session.setAttribute(Constant.USERBELONGUNITTYPEID, belongUnit.getUnitTypeId());
				session.setAttribute(Constant.USERDEPTID, this.systemMgm.getUserDeptId(user));
				session.setAttribute(Constant.USERPOSID, this.systemMgm.getUserPosId(user));
				session.setAttribute(Constant.USERMODULES, this.systemMgm.getUserModules(user));
				//设置当前项目单位及可管理的项目单位
				List<SgccIniUnit> pids = this.systemMgm.getPidsByUnitid(belongUnit.getUnitid());
				StringBuilder USERPIDS = new StringBuilder();
				StringBuilder USERPNAMES = new StringBuilder();
				
				for(int i=0,j=pids.size();i<j;i++){
					SgccIniUnit hbm = pids.get(i);
					if(i==0){
						/*
					Cookie cookie13 = new Cookie(Constant.CURRENTAPPPID, hbm.getUnitid());
					response.addCookie(cookie13);
					Cookie cookie14 = new Cookie(Constant.CURRENTAPPPNAME, hbm.getUnitname());
					response.addCookie(cookie14);
					Constant.sessionMap.put(Constant.CURRENTAPPPID, hbm.getUnitid());
					Constant.sessionMap.put(Constant.CURRENTAPPPNAME, hbm.getUnitname());
						 */
						session.setAttribute(Constant.CURRENTAPPPID, hbm.getUnitid());
						session.setAttribute(Constant.CURRENTAPPPNAME, hbm.getUnitname());
						/*
						 */
					}else{
						if((hbm.getUnitid()).equals(belongUnit.getUnitid())){
							/*
						Cookie cookie15 = new Cookie(Constant.CURRENTAPPPID, hbm.getUnitid());
						response.addCookie(cookie15);
						Cookie cookie16 = new Cookie(Constant.CURRENTAPPPNAME, hbm.getUnitname());
						response.addCookie(cookie16);
						Constant.sessionMap.put(Constant.CURRENTAPPPID, hbm.getUnitid());
						Constant.sessionMap.put(Constant.CURRENTAPPPNAME, hbm.getUnitname());
							 */
							session.setAttribute(Constant.CURRENTAPPPID, hbm.getUnitid());
							session.setAttribute(Constant.CURRENTAPPPNAME, hbm.getUnitname());
							/*
							 */
						}
					}
					USERPIDS.append(hbm.getUnitid()).append(",");
					USERPNAMES.append(hbm.getUnitname()).append(",");
				}
				if(pids.size()>0){
					String userpids = USERPIDS.toString();
					String userpnames = USERPNAMES.toString();
					/*
				Cookie cookie17 = new Cookie(Constant.USERPIDS, userpids.substring(0, userpids.length()-1));
				response.addCookie(cookie17);
				Cookie cookie18 = new Cookie(Constant.USERPNAMES, userpnames.substring(0, userpnames.length()-1));
				response.addCookie(cookie18);
				Constant.sessionMap.put(Constant.USERPIDS, userpids.substring(0, userpids.length()-1));
				Constant.sessionMap.put(Constant.USERPNAMES, userpnames.substring(0, userpnames.length()-1));
					 */
					session.setAttribute(Constant.USERPIDS, userpids.substring(0, userpids.length()-1));
					session.setAttribute(Constant.USERPNAMES, userpnames.substring(0, userpnames.length()-1));
					/*
					 */
				}else{
					/*
				Cookie cookie19 = new Cookie(Constant.USERPIDS, null);
				response.addCookie(cookie19);
				Cookie cookie20 = new Cookie(Constant.USERPNAMES, null);
				response.addCookie(cookie20);
				Cookie cookie21 = new Cookie(Constant.CURRENTAPPPID, null);
				response.addCookie(cookie21);
				Cookie cookie22 = new Cookie(Constant.CURRENTAPPPNAME, null);
				response.addCookie(cookie22);
				Constant.sessionMap.put(Constant.USERPIDS, null);
				Constant.sessionMap.put(Constant.USERPNAMES, null);
				Constant.sessionMap.put(Constant.CURRENTAPPPID, null);
				Constant.sessionMap.put(Constant.CURRENTAPPPNAME, null);
					 */
					session.setAttribute(Constant.USERPIDS, null);
					session.setAttribute(Constant.USERPNAMES, null);
					session.setAttribute(Constant.CURRENTAPPPID, null);
					session.setAttribute(Constant.CURRENTAPPPNAME, null);
					/*
					 */
				}
				this.systemMgm.userLogon(user);
			}
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}

		if (msg.equals(Constant.SUCCESS)) {
			PrintWriter out;
			try {
				out = response.getWriter();
				out.println("loadCorssDomainUrl()");
				out.flush();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}

		} else {
			sendMsgResponse(msg, stackTrace, 0, response);
		}
	}
}
