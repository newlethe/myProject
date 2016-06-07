package com.sgepit.frame.sysman.control;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

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
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.operatehistory.service.OperateHistoryService;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.StringUtil;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
/**
 * 系统管理 控制层
 * @author xjdawu
 * @since 2007.11.30
 */
public class SysServlet extends MainServlet {

	public static Map<String, LoginEvent> loginAudit = new HashMap<String, LoginEvent>();

	public class LoginEvent {
		public int count = 0;
		public Date time = null;
		public boolean locked = false;
	}

	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private SystemMgmFacade systemMgm;
	private BaseMgmFacade baseMgm;
	private HashMap modulesMap;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);

	public SysServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

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

		/*SgccIniUnit temp = (SgccIniUnit) this.baseMgm
				.findBeanByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG), "upunit", "0");
		if (Constant.APPOrgRootID == null) {
			Constant.APPOrgRootID = temp.getUnitid();
			Constant.APPOrgRootNAME = temp.getUnitname();
		}*/
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
			if (method.equals("login")) {
				authentication(request, response);
				return;
			}
			if (method.equals("switchpid")) {
				switchPid(request, response);
				return;
			}
			if (method.equals("loginPortal")) {
				authenticationPortal(request, response, true);
				return;
			}
			if (method.equals("loginPortalNoChk")) {
				authenticationPortal(request, response, false);
				return;
			}

			if (method.equals("rolemodtree")) {
				rolemodTree(request, response);
				return;
			}

			if (method.equals("saverolemod")) {
				saveRolemod(request, response);
				return;
			}

			if (method.equals("moveModuleNode")) {
				moveModuleNode(request, response);
				return;
			}

			if (method.equals("tree")) {
				buildTree(request, response);
				return;
			}

			if (method.equals("unitTree")) {
				buildUnitTree(request, response);
				return;
			}

			if (method.equals("unitTreeWithoutPos")) {
				buildUnitTreeWithoutPos(request, response);
				return;
			}

			if (method.equals("logout")) {
				logout(request, response);
				return;
			}

			if (method.equalsIgnoreCase("loadmodule")) {
				loadmodule(request, response);
				return;
			}

			if (method.equalsIgnoreCase("savepassword")) {
				savePassword(request, response);
				return;
			}

			if (method.equalsIgnoreCase("moveuser")) {
				moveUser(request, response);
				return;
			}
			if (method.equalsIgnoreCase("movemaninfo")) {
				moveManInfo(request, response);
				return;
			}
			if (method.equalsIgnoreCase("setuserpassword")) {
				setUserPassword(request, response);
				return;
			}

			if (method.equalsIgnoreCase("deluserorg")) {
				delUserorg(request, response);
				return;
			}

			if (method.equals("moduleConfigTree")) {
				buildModuleConfigTree(request, response);
				return;
			}

			if (method.equals("fastModuleTree")) {
				buildFastModuleTree(request, response);
				return;
			}

			if (method.equalsIgnoreCase("getChildRockPowerStr")) {
				getChildRockPowerStr(request, response);
				return;
			}

			if (method.equals("addCommonPower")) {
				addCommonPower(request, response);
				return;
			}

			if (method.equals("deleteCommonPower")) {
				deleteCommonPower(request, response);
				return;
			}

			if (method.equals("getVerifyCode")) {
				getValidateCode(request, response);
				return;
			}

			if (method.equals("getVerifyImg")) {
				getVerifyImage(request, response);
				return;
			}

			if (method.equals("getUserPortletConfig")) {
				getUserPortletConfig(request, response);
				return;
			}

			if (method.equals("initRolePortlets")) {
				initRolePortlets(request, response);
				return;
			}

			if (method.equals("getRolePortletConfig")) {
				getRolePortletConfig(request, response);
				return;
			}
			
			if ( method.equals("loadUserHome") ){
				loadUserHome(request, response);
				return;
			}
			
			if ( method.equals("buildingUnitTree") ){
				buildingUnitTree(request, response);
				return;
			}
			
			if ( method.equals("buildingRockPowerTree") ){
				buildingRockPowerTree(request, response);
				return;
			}
		}  
	}

	private void buildingUnitTree(HttpServletRequest request,
			HttpServletResponse response)  throws IOException {
		Map paramsmap = new HashMap();
		Enumeration  enumer = request.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = enumer.nextElement().toString();
			paramsmap.put(key,request.getParameter(key));
		}
		paramsmap.put("DefaultOrgRootID", Constant.DefaultOrgRootID);
		paramsmap.put(Constant.UNITTYPE, request.getSession().getAttribute(Constant.UNITTYPE));
		paramsmap.put(Constant.USERID, request.getSession().getAttribute(Constant.USERID));
		paramsmap.put(Constant.USERUNITID, request.getSession().getAttribute(Constant.USERUNITID));
		paramsmap.put(Constant.USERDEPTID, request.getSession().getAttribute(Constant.USERDEPTID));
		paramsmap.put(Constant.USERPOSID, request.getSession().getAttribute(Constant.USERPOSID));
		
		outputString(response, this.systemMgm.buildingUnitTree(paramsmap));
	}
	private void buildingRockPowerTree(HttpServletRequest request,
			HttpServletResponse response)  throws IOException {
		Map paramsmap = new HashMap();
		Enumeration  enumer = request.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = enumer.nextElement().toString();
			paramsmap.put(key,request.getParameter(key));
		}
		paramsmap.put("DefaultOrgRootID", Constant.DefaultOrgRootID);
		paramsmap.put(Constant.UNITTYPE, request.getSession().getAttribute(Constant.UNITTYPE));
		paramsmap.put(Constant.USERID, request.getSession().getAttribute(Constant.USERID));
		paramsmap.put(Constant.USERUNITID, request.getSession().getAttribute(Constant.USERUNITID));
		paramsmap.put(Constant.USERDEPTID, request.getSession().getAttribute(Constant.USERDEPTID));
		paramsmap.put(Constant.USERPOSID, request.getSession().getAttribute(Constant.USERPOSID));
		
		outputString(response, this.systemMgm.buildingRockPowerTree(paramsmap));
	}

	private void getRolePortletConfig(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String roleid = request.getParameter("roleid");
		outputString(response, JSONUtil.formObjectsToJSONReaderStr(this.systemMgm.getRolePortletConfig(roleid)));
	}

	private void initRolePortlets(HttpServletRequest request,
			HttpServletResponse response) {
		this.systemMgm.initRolePortlets();
	}

	private void getUserPortletConfig(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String userid = request.getParameter("userid");
		outputString(response, JSONUtil.formObjectsToJSONReaderStr(this.systemMgm.getUserPortletConfig(userid)));
	}

	private void getVerifyImage(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setContentType("image/jpeg");
        OutputStream out = response.getOutputStream();
        int width = 46;
        int height = 18;
        int length = 4;
        boolean useCharacter = false;
        try {
            width = Integer.parseInt((String)request.getParameter("w"));
        } catch (Exception ex) {}
        try {
            height = Integer.parseInt((String)request.getParameter("h"));
        } catch (Exception ex) {}
        try {
            length = Integer.parseInt((String)request.getParameter("l"));
        } catch (Exception ex) {}
        try {
        	useCharacter = Boolean.valueOf((String)request.getParameter("uc"));
        } catch (Exception ex) {}
        //System.out.println(useCharacter);
        List list = StringUtil.getVerifyImage(width, height, length, useCharacter);
        request.getSession().setAttribute("verifyCode", (String)list.get(0));
        JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
        encoder.encode((BufferedImage)list.get(1));
        out.close();        
	}


	private void getValidateCode(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String code = (String)request.getSession().getAttribute("verifyCode");
		outputString(response, code);
	}

	private void buildModuleConfigTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parentId");
		String userId = request.getParameter("userId");
		boolean includeFast = request.getParameter("includeFast")!=null?Boolean.valueOf((String)request.getParameter("includeFast")):true;
		HashMap<String, RockPower> modulesMap = (HashMap<String, RockPower>) request
				.getSession().getAttribute(Constant.USERMODULES);
		String tree = JSONUtil.formObjectsToJSONStr(this.systemMgm
				.buildModuleConfigTreeNodes(parentId, userId, modulesMap, includeFast));
		outputString(response, tree);
	}

	private void buildFastModuleTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parentId");
		String userId = request.getParameter("userId");
		HashMap<String, RockPower> modulesMap = (HashMap<String, RockPower>) request
				.getSession().getAttribute(Constant.USERMODULES);
		String tree = JSONUtil.formObjectsToJSONStr(this.systemMgm
				.buildFastModuleTreeNodes(parentId, userId, modulesMap));
		outputString(response, tree);
	}

	private void getChildRockPowerStr(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = (String) request.getParameter("parentId");
		String rtn = this.systemMgm.getChildRockPowerStr(parentId, request.getSession());
		outputString(response, rtn);
	}

	private void delUserorg(HttpServletRequest request,
			HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String[] ida = ((String) request.getParameter("ids"))
					.split(Constant.SPLITB);
			String orgid = (String) request.getParameter("orgid");
			this.systemMgm.deleteUserorg(ida, orgid);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);
		}
		sendMsgResponse(msg, stackTrace, 0, response);
	}

	private void moveUser(HttpServletRequest request,
			HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String[] ida = ((String) request.getParameter("ids"))
					.split(Constant.SPLITB);
			String oldOrgid = (String) request.getParameter("oldorgid");
			String orgid = (String) request.getParameter("orgid");
			String newDeptId = (String) request.getParameter("newDeptId");
			String newPosId = (String) request.getParameter("newPosId");
			String move = (String) request.getParameter("move");
			this.systemMgm.moveUser(ida, oldOrgid, orgid, newDeptId, newPosId, move);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);
		}
		sendMsgResponse(msg, stackTrace, 0, response);
	}
	private void moveManInfo(HttpServletRequest request,
			HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String[] ida = ((String) request.getParameter("ids"))
			.split(Constant.SPLITB);
			String oldOrgid = (String) request.getParameter("oldorgid");
			String orgid = (String) request.getParameter("orgid");
			String move = (String) request.getParameter("move");
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);
		}
		sendMsgResponse(msg, stackTrace, 0, response);
	}

	private void setUserPassword(HttpServletRequest request,
			HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String[] ida = ((String) request.getParameter("ids"))
					.split(Constant.SPLITB);
			String passWord = (String) request.getParameter("password");
			this.systemMgm.setUserPassword(ida, passWord);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);
		}
		sendMsgResponse(msg, stackTrace, 0, response);
	}

	private void buildTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parentId");
		String treeName = request.getParameter("treeName");
		String attachUnit = request.getParameter("attachUnit") == null ? ""
				: request.getParameter("attachUnit");
		String year = request.getParameter("year") == null ? new SimpleDateFormat(
				"yyyy").format(Calendar.getInstance().getTime())
				: request.getParameter("year");
		String unitType = request.getParameter("unitType");
		String tree = (treeName != null) ? JSONUtil
				.formObjectsToJSONStr(this.systemMgm.buildTreeNodes(treeName,
						parentId, attachUnit, year ,unitType)) : "";
		outputString(response, tree);
	}

	private void buildUnitTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		String parentId = request.getParameter("parentId");
		String pubId = request.getParameter("pubId");
		String type = request.getParameter("type");
		String attachUnit = request.getParameter("attachUnit") == null ? ""
				: request.getParameter("attachUnit");
		String treeType = request.getParameter("treeType") == null ? ""
				: request.getParameter("treeType");
		String curYear = new SimpleDateFormat("yyyy").format(Calendar
				.getInstance().getTime());
		String year = request.getParameter("year") == null ? curYear : request
				.getParameter("year");
		String tree = "";
		String ifCheck = request.getParameter("ifCheck") == null ? "none" : request
				.getParameter("ifCheck");
		if (treeType.equals(""))
			tree = this.convertUnitJsonWithCheck(this.systemMgm.buildTreeNodes(
					parentId, attachUnit, year),ifCheck);
		else
			tree = this.systemMgm.convertUnitColumnJson(parentId, pubId, type,
					treeType);
		outputString(response, tree);
	}

	private void buildUnitTreeWithoutPos(HttpServletRequest request,
			HttpServletResponse response) throws IOException {

		String parentId = request.getParameter("parentId");
		String pubId = request.getParameter("pubId");
		String type = request.getParameter("type");
		String attachUnit = request.getParameter("attachUnit") == null ? ""
				: request.getParameter("attachUnit");
		String treeType = request.getParameter("treeType") == null ? ""
				: request.getParameter("treeType");
		String curYear = new SimpleDateFormat("yyyy").format(Calendar
				.getInstance().getTime());
		String year = request.getParameter("year") == null ? curYear : request
				.getParameter("year");
		String tree = "";
		//带checkBox和不带checkBox的单位数
		if (treeType.equals(""))
			tree = this.convertUnitJsonWithCheck(this.systemMgm.buildTreeNodesWithoutPos(
					parentId, attachUnit, year));
		else
			tree = this.systemMgm.convertUnitColumnJson(parentId, pubId, type,
					treeType);
		outputString(response, tree);
	}
	
	private String convertUnitJsonWithCheck(List<SgccIniUnit> list,String ifCheck) {
		SgccIniUnit unit = null;
		String nodeStr = "[";
		for (int j = 0; j < list.size(); j++) {
			int count = list.size();
			unit = (SgccIniUnit) list.get(j);
			String id = unit.getUnitid();
			String name = unit.getUnitname();
			String unitTypeId = unit.getUnitTypeId();
			String attachUnitId = unit.getAttachUnitid();
			nodeStr += "{id:'" + id + "'" + ",text:'" + name + "'"
					+ ",unitTypeId:'" + unitTypeId + "'" + ",attachUnitId:'"
					+ attachUnitId + "'" + ",description:'" + id + name + "'";

			int leaf = this.systemMgm.getUnitCountByParentId(id,true);
			if (leaf > 0) {
				nodeStr += ",leaf:false";
			} else {
				nodeStr += ",leaf:true";
			}
			if(ifCheck.equals("none")){
				nodeStr += "}";
			} else{
				String check = "false";
				nodeStr += ",checked:" + check + "}";
			}
			
			
			if (j == count - 1) {
				nodeStr += "]";
			} else {
				nodeStr += ",";
			}
		}
		//System.out.println("" + nodeStr);
		return nodeStr;
	}

	private String convertUnitJsonWithCheck(List<SgccIniUnit> list) {
		SgccIniUnit unit = null;
		String nodeStr = "[";
		for (int j = 0; j < list.size(); j++) {
			int count = list.size();
			unit = (SgccIniUnit) list.get(j);
			String id = unit.getUnitid();
			String name = unit.getUnitname();
			String unitTypeId = unit.getUnitTypeId();
			String attachUnitId = unit.getAttachUnitid();
			nodeStr += "{id:'" + id + "'" + ",text:'" + name + "'"
					+ ",unitTypeId:'" + unitTypeId + "'" + ",attachUnitId:'"
					+ attachUnitId + "'" + ",description:'" + id + name + "'";

			int leaf = this.systemMgm.getUnitCountByParentId(id,true);
			if (leaf > 0) {
				nodeStr += ",leaf:false";
			} else {
				nodeStr += ",leaf:true";
			}
			String check = "false";
			nodeStr += ",checked:" + check + "}";
			if (j == count - 1) {
				nodeStr += "]";
			} else {
				nodeStr += ",";
			}
		}
		System.out.println("" + nodeStr);
		return nodeStr;
	}

	private void savePassword(HttpServletRequest request,
			HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		int c = 0;
		try {
			String userid = request.getParameter("userid");
			String oldpwd = request.getParameter("oldpwd");
			String newpwd = request.getParameter("newpwd");
			this.systemMgm.savePassword(userid, oldpwd, newpwd);

		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);

		}
		sendMsgResponse(msg, stackTrace, c, response);
	}

	/**
	 * 更新角色模块关系
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void saveRolemod(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		int c = 0;
		try {
			String roleid = request.getParameter("roleid");
			UpdateBeanInfo jab = parseJsonStr(StringUtil.getInputStream(request
					.getInputStream(), Constant.ENCODING),
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_ROLEMOD), "uids");
			this.systemMgm.saveRolemod(roleid, jab);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);

		}
		sendMsgResponse(msg, stackTrace, c, response);
	}
	private void switchPid(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String flag =  this.systemMgm.switchByPid(request.getParameter("newpid"), request.getSession());
		outputString(response,flag);
	}
	private void rolemodTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String roleid = request.getParameter("roleid");
		String unitid = request.getParameter("unitid");
		String str = "";
		try {
			if (roleid != null && !roleid.equals("")&&unitid != null && !unitid.equals(""))
				str = this.systemMgm.getRoleModTree(roleid,unitid);
		} catch (BusinessException e) {
			e.printStackTrace();
		}
		outputString(response, str);
	}
	
	private void loadUserHome(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		//所有模块列表
		List<RockPower> list = systemMgm.getListedModules(Constant.DefaultModuleRootID,false);
		List<RockPower> allRockPowerList = new ArrayList<RockPower>();
		//去除掉portal
		for (RockPower power : list) {
			if ( !power.getModelflag().equals("3") ){
				allRockPowerList.add(power);
			}
		}
		
		//用户可访问的模块列表
		List<RockPower> rockPowerList = systemMgm.getChildRockPowersByParentId(Constant.DefaultModuleRootID, request.getSession());
		Map<String, String> rockPowerMap = new HashMap<String, String>();
		for (RockPower rockPower : rockPowerList) {
			rockPowerMap.put(rockPower.getPowerpk(), rockPower.getPowername());
		}
		String unitType = request.getSession().getAttribute(Constant.UNITTYPE).toString();
		
		String posNum = PropertyCodeDAO.getInstence().getCodeValueByPropertyName("参建单位", "组织机构类型" );
		if ( posNum == null ){
			posNum = "2";
		}
		else if ( posNum.equals("") ){
			posNum = "2";
		}
		
		//参建单位不能点击“公司网站”和“OA”
		Boolean enableExtLink = false;
		if ( ! unitType.equals(posNum) ){
			enableExtLink = true;
			//网站和OA的地址
			Map<String, String> externalLinkMap = new HashMap<String, String>();
			externalLinkMap.put("compWebUrl", Constant.companyWebUrl);
			externalLinkMap.put("compOAUrl", Constant.companyOAUrl);
			request.setAttribute("linkMap", externalLinkMap);
		}
		request.setAttribute("enableExtLink", enableExtLink);
		
		request.setAttribute("allRockPower", allRockPowerList);
		request.setAttribute("rockPowerMap", rockPowerMap);
		
		String userId = (String) request.getSession().getAttribute(Constant.USERID);
	
		//用户待办消息数
//		String taskSql = "select count(*) from task_view where tonode='" + userId + "' and flag='0'";
//		Integer taskNum = ((BigDecimal )baseMgm.getData(taskSql).get(0)).intValue();
//		request.setAttribute("taskNum", taskNum);
		
		request.getRequestDispatcher("/"+Constant.APPTOPMENUPAGE).forward(request, response);
	}
	

	private void loadmodule(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		long s = System.currentTimeMillis();
		String modid = (String) request.getParameter("modid");
		this.modulesMap = this.systemMgm.getModulesMap();
		// modname = new String(modname.getBytes("ISO-8859-1"),
		// Constant.ENCODING);
		RockPower module = (RockPower) this.modulesMap.get(modid);
		HttpSession session = request.getSession();
		RockUser user = (RockUser) session.getAttribute(Constant.USER);
		StringBuffer url = new StringBuffer("/");
		if (module != null && user != null) {
			String id = module.getPowerpk();
			HashMap userModMap = (HashMap) session
					.getAttribute(Constant.USERMODULES);
			RockPower userMod = (RockPower) userModMap.get(id);
			if (userMod != null) {
				HashMap moduleActions = this.systemMgm.getUserModuleActions(
						userModMap, id);
				session.setAttribute(Constant.ModuleLVL, String.valueOf(userMod
						.getLvl()));
				session.setAttribute(Constant.ModuleActions, moduleActions);
				Map map = request.getParameterMap();
				String temp = userMod.getUrl();
				if(Constant.propsMap.get("IS_ADD_USEROPERATEMODULELOG")!=null&&Constant.propsMap.get("IS_ADD_USEROPERATEMODULELOG").equals("1")){
					this.systemMgm.saveUserOperateModule(user.getUserid(), this.getIpAddr(request),id);
				}
				if(temp!=null&&(temp.startsWith("/")||temp.toLowerCase().startsWith("http"))){
					String remoteURL = temp;
					if(temp.startsWith("/")){
						remoteURL = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+temp; 
					}
					response.setHeader( "Location",remoteURL);
					response.sendRedirect(remoteURL);
				}else{
					temp = temp == null ? Constant.TODOPAGE:temp;
					url.append(temp);
					if (temp.indexOf("?")>-1)
						url.append("&modid=");
					else
						url.append("?modid=");
					url.append(id);
					Iterator itr = map.entrySet().iterator();
					while (itr.hasNext()) {
						Map.Entry entry = (Map.Entry) itr.next();
						url.append("&");
						url.append((String) entry.getKey());
						url.append("=");
						String vl = request.getParameter((String) entry.getKey());
						// vl = new String(vl.getBytes("ISO-8859-1"),
						// Constant.ENCODING);
						url.append(vl);
					}
					request.getRequestDispatcher(url.toString()).forward(request,
							response);
				}
			}
		} else {
			request.getRequestDispatcher(Constant.LOGINURL).forward(request,
					response);
		}
		long e = System.currentTimeMillis();
		log.info("------loadModule costs " + (e - s) + "ms");
	}

	private void logout(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		HttpSession s = request.getSession();
		//只有系统配置了NEED_OPERATE_HISTORY=1才会启用日志添加操作，目前用于中煤物资采购系统
		if(Constant.propsMap.get("NEED_OPERATE_HISTORY")!=null&&Constant.propsMap.get("NEED_OPERATE_HISTORY").equals("1")){
			OperateHistoryService operateHistoryService= (OperateHistoryService) this.wac.getBean("operateHistoryService");
			operateHistoryService.addOperateHistory((String)s.getAttribute(Constant.USERID), (String)s.getAttribute(Constant.USERUNITID), "LOGOUT", "注销"+Constant.DefaultModuleRootName+"成功", "SUCCESS");
		}
		s.removeAttribute(Constant.USER);
		s.removeAttribute(Constant.USERACCOUNT);
		s.removeAttribute(Constant.USERID);
		s.removeAttribute(Constant.USERNAME);
		s.removeAttribute(Constant.USERDEPTPOSNAME);
		s.removeAttribute(Constant.USERDEPTID);
		s.removeAttribute(Constant.USERUNITID);
		s.removeAttribute(Constant.USERPOSID);
		s.removeAttribute(Constant.USERUNITNAME);
		s.removeAttribute(Constant.APPOrgRootID);
		s.removeAttribute(Constant.APPOrgRootNAME);
		s.removeAttribute(Constant.USERBELONGUNITID);
		s.removeAttribute(Constant.USERBELONGUNITNAME);
		s.removeAttribute(Constant.USERBELONGUNITTYPEID);
		s.removeAttribute(Constant.USERPIDS);
		s.removeAttribute(Constant.USERPNAMES);
		s.removeAttribute(Constant.CURRENTAPPPID);
		s.removeAttribute(Constant.CURRENTAPPPNAME);
		
		response.sendRedirect(Constant.AppRoot);
	}

	public void authentication(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String verifyCode = request.getParameter("verifycode");
		//中煤物资采购系统需要用到验证码
		Object codeObject = request.getSession().getAttribute("verifyCode");
		/*String sessionCode = (String) request.getSession().getAttribute(
				"verifyCode");

		if (loginAudit.get(username) == null) {
			LoginEvent event = new LoginEvent();
			event.count = 0;
			loginAudit.put(username, event);
		} else {
			System.out.println("The count is "
					+ (loginAudit.get(username)).count);
		}
		int failCount = (loginAudit.get(username)).count;
		int LOGIN_FAIL_LIMIT = BusinessConstants.LOGIN_FAIL_LIMIT;*/

		try {
			/*if (failCount > LOGIN_FAIL_LIMIT) {
				Date lasttime = (loginAudit.get(username)).time;
				Date now = new Date();
				String str = "";
				if ((now.getTime() - lasttime.getTime()) > 86400000
						|| username.equals("system")
						|| username.equals("Administrator")) {
					(loginAudit.get(username)).count = 0;
					failCount = 0;
					str = "连续登陆失败次数超过" + LOGIN_FAIL_LIMIT + "次，今日内不允许登陆！";
				} else {
					(loginAudit.get(username)).time = new Date();
					System.out.println("The lock is "
							+ (loginAudit.get(username)).locked);
					if (!(loginAudit.get(username)).locked)
						this.systemMgm.lockUser(username);
					str = "连续登陆失败次数超过" + LOGIN_FAIL_LIMIT + "次，用户已经被锁定！";
				}
				throw new BusinessException(str);
			}

			if (verifyCode == null || !verifyCode.equals(sessionCode)) {
				// (loginAudit.get(username)).count += 1;
				throw new BusinessException(BusinessConstants.MSG_USER_VERITY);
			}*/
			//只有系统配置了NEED_VERIFY_CODE=1才会进行验证码校验，目前用于中煤物资采购系统
			if(Constant.propsMap.get("NEED_VERIFY_CODE")!=null&&Constant.propsMap.get("NEED_VERIFY_CODE").equals("1")){
				String sessionCode=(String)codeObject;
				if (verifyCode == null || !verifyCode.equals(sessionCode)) {
					throw new BusinessException(BusinessConstants.MSG_USER_VERITY);
				}
			}
			RockUser user = this.systemMgm.authentication(username, password);
			SgccIniUnit unit = this.systemMgm.getUnitById(user.getPosid());

			String unitid = user.getUnitid();
			String unitname = this.systemMgm.getUserUnitName(user);
			SgccIniUnit belongUnit = this.systemMgm.getBelongUnit(user.getUnitid());
			String roles = this.systemMgm.getUserRoleType(user);

			this.systemMgm.userLogon(user);
			this.systemMgm.saveUserLoginTimeAndIp(user.getUserid(), this.getIpAddr(request));

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
			//liangwj(2011-10-24):系统业务不支持用户归属于多个部门，所以所在部门及岗位信息直接从rock_user中读取，而不再从rock_user2dept表中读取
			s.setAttribute(Constant.USERDEPTID, (user.getDeptId()==null?user.getUnitid():user.getDeptId()));
			s.setAttribute(Constant.USERPOSID, (user.getPosid()==null?user.getUnitid():user.getPosid()));
			
			s.setAttribute(Constant.USERMODULES, this.systemMgm.getUserModules(user));
			s.setAttribute(Constant.ROLETYPE, roles.split("`")[0]);
			s.setAttribute(Constant.ISLEADER, roles.split("`")[1]);

			if (unitid.equals(user.getDeptId())&& unitid.equals(user.getPosid())) {
				s.setAttribute(Constant.USERDEPTPOSNAME, unitname);
			} else {
				s.setAttribute(Constant.USERDEPTPOSNAME, this.systemMgm.getUserDeptPosInfo(user));
			}
			
			if (roles.split("`")[0].equals("0")) {
				 s.setAttribute(Constant.APPOrgRootID, Constant.DefaultOrgRootID);
				 s.setAttribute(Constant.APPOrgRootNAME, Constant.DefaultOrgRootNAME);
			} else {
				s.setAttribute(Constant.APPOrgRootID, unitid);
				s.setAttribute(Constant.APPOrgRootNAME, unitname);
			}
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
			//只有系统配置了NEED_OPERATE_HISTORY=1才会启用日志添加操作，目前用于中煤物资采购系统
			if(Constant.propsMap.get("NEED_OPERATE_HISTORY")!=null&&Constant.propsMap.get("NEED_OPERATE_HISTORY").equals("1")){
				OperateHistoryService operateHistoryService= (OperateHistoryService) this.wac.getBean("operateHistoryService");
				operateHistoryService.addOperateHistory(user.getUserid(), user.getUnitid(), "LOGIN", "登录"+Constant.DefaultModuleRootName+"成功", "SUCCESS");
			}
			log.info("===== [" + username + " : " + user.getRealname()+ "] =========");
		} catch (Exception e) {
			/*failCount++;
			(loginAudit.get(username)).count = failCount;
			(loginAudit.get(username)).time = new Date();*/
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}

		if (request.getParameter("target") != null) {

			StringBuffer sbf = new StringBuffer("");
			if (msg.equals(Constant.SUCCESS)) {
				/*
				 * sbf.append(Constant.HTMLMETAHEADER); sbf.append("<script>");
				 * sbf.append(request.getParameter("target"));
				 * sbf.append(".location.href='");
				 */

				//(loginAudit.get(username)).count = 0;

				if (Constant.indexType == null || Constant.indexType.equals("")
						|| Constant.indexType.equals("0")) {
					sbf.append(Constant.APPINDEXPAGE + ".jsp");
				} else {
					sbf.append(Constant.APPINDEXPAGE + Constant.indexType
							+ ".jsp");
				}
				sendMsgResponseLogin(msg, stackTrace, sbf.toString(), response);
				// sbf.append("';</script>");
			} else {
				/*
				 * sbf.append(Constant.HTMLMETAHEADER); sbf.append("<script>alert('");
				 * sbf.append(msg); sbf.append("');history.back();</script>");
				 */
				sendMsgResponse(msg, stackTrace, 0, response);
			}
			// outputString(response, sbf.toString());
		} else {
			sendMsgResponse(msg, stackTrace, 0, response);
		}
	}

	public void authenticationPortal(HttpServletRequest request,
			HttpServletResponse response, boolean chkPwd) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		String username = request.getParameter("username");
		String password = request.getParameter("password");

		try {

			RockUser user = this.systemMgm.authenticationPortal(username,
					password, chkPwd);
			SgccIniUnit unit = this.systemMgm.getUnitById(user.getPosid());

			this.systemMgm.userLogon(user);
			this.systemMgm.saveUserLoginTimeAndIp(user.getUserid(), this.getIpAddr(request));

			HttpSession s = request.getSession();
			s.setAttribute(Constant.USER, user);
			s.setAttribute(Constant.USERID, user.getUserid());
			s.setAttribute(Constant.USERNAME, user.getRealname());
			s.setAttribute(Constant.USERACCOUNT, username);
			s.setAttribute(Constant.UNITTYPE, unit.getUnitTypeId());
			String unitid = user.getUnitid();
			String unitname = this.systemMgm.getUserUnitName(user);
			s.setAttribute(Constant.USERUNITID, unitid);
			s.setAttribute(Constant.USERUNITNAME, unitname);

			if (unitid.equals(user.getDeptId())
					&& unitid.equals(user.getPosid())) {
				s.setAttribute(Constant.USERDEPTPOSNAME, "");
			} else {
				s.setAttribute(Constant.USERDEPTPOSNAME, this.systemMgm
						.getUserDeptPosInfo(user));
			}
			//liangwj(2011-10-24):系统业务不支持用户归属于多个部门，所以所在部门及岗位信息直接从rock_user中读取，而不再从rock_user2dept表中读取
			s.setAttribute(Constant.USERDEPTID, (user.getDeptId()==null?user.getUnitid():user.getDeptId()));
			s.setAttribute(Constant.USERPOSID, (user.getPosid()==null?user.getUnitid():user.getPosid()));
			
			s.setAttribute(Constant.USERMODULES, this.systemMgm	.getUserModules(user));
			String roles = this.systemMgm.getUserRoleType(user);
			s.setAttribute(Constant.ROLETYPE, roles.split("`")[0]);
			s.setAttribute(Constant.ISLEADER, roles.split("`")[1]);
			// Constant.APPOrgRootID = Constant.DefaultOrgRootID;
			if (roles.split("`")[0].equals("0")) {
				// s.setAttribute(Constant.APPOrgRootID,
				// Constant.DefaultOrgRootID);
				// s.setAttribute(Constant.APPOrgRootNAME,
				// Constant.DefaultOrgRootNAME);
				Constant.APPOrgRootID = Constant.DefaultOrgRootID;
				Constant.APPOrgRootNAME = Constant.DefaultOrgRootNAME;
			} else {
				// s.setAttribute(Constant.APPOrgRootID, unitid);
				// s.setAttribute(Constant.APPOrgRootNAME, unitname);
				Constant.APPOrgRootID = unitid;
				Constant.APPOrgRootNAME = unitname;
			}

			log.info("===== [" + username + " : " + user.getRealname()
					+ "] =========");
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}

		if (request.getParameter("target") != null) {

			StringBuffer sbf = new StringBuffer("");
			if (msg.equals(Constant.SUCCESS)) {
				/*
				 * sbf.append(Constant.HTMLMETAHEADER); sbf.append("<script>");
				 * sbf.append(request.getParameter("target"));
				 * sbf.append(".location.href='");
				 */

				//(loginAudit.get(username)).count = 0;

				if (Constant.indexType == null || Constant.indexType.equals("")
						|| Constant.indexType.equals("0")) {
					sbf.append(Constant.APPINDEXPAGE + ".jsp");
				} else {
					sbf.append(Constant.APPINDEXPAGE + Constant.indexType
							+ ".jsp");
				}
				sendMsgResponseLogin(msg, stackTrace, sbf.toString(), response);
				// sbf.append("';</script>");
			} else {
				/*
				 * sbf.append(Constant.HTMLMETAHEADER); sbf.append("<script>alert('");
				 * sbf.append(msg); sbf.append("');history.back();</script>");
				 */
				sendMsgResponse(msg, stackTrace, 0, response);
			}
			// outputString(response, sbf.toString());
		} else {
			sendMsgResponse(msg, stackTrace, 0, response);
		}
	}

	public void moveModuleNode(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String powerPk = request.getParameter("powerPk");
			String relationPk = request.getParameter("relationPk");
			String type = request.getParameter("type");
			systemMgm.moveModule(powerPk, relationPk, type);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);

		}
		sendMsgResponse(msg, stackTrace, 0, response);

	}

	/**
	 * 设置常用操作
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public void addCommonPower(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String powerPk = request.getParameter("powerPk");
			String targetPk = request.getParameter("targetPk");
			String userId = request.getParameter("userId");
			String type = request.getParameter("type");
			systemMgm.addCommonPower(powerPk, targetPk, userId, type);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);

		}
		sendMsgResponse(msg, stackTrace, 0, response);

	}

	/**
	 * 删除常用操作
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public void deleteCommonPower(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		try {
			String powerPk = request.getParameter("powerPk");
			String userId = request.getParameter("userId");
			systemMgm.deleteCommonPower(powerPk, userId);
		} catch (Exception ex) {
			msg = getSQLErrorMsg(ex);
			stackTrace = getStackTrace(ex);

		}
		sendMsgResponse(msg, stackTrace, 0, response);

	}
	
	
	/**
	 * 获取客户端IP
	 * @param request
	 * @return
	 */
	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
}
