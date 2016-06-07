package com.sgepit.pmis.finalAccounts.complete.control;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompBdgInfo;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompFinanceSubject;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompGcType;
import com.sgepit.pmis.finalAccounts.complete.hbm.FACompInfoOve;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompProofInfo;
import com.sgepit.pmis.finalAccounts.complete.service.FABaseInfoService;
/**
 * 基本信息Servlet，包括 项目基本信息，概算体系，未完工工程管理 三个模块
 * @author pengy
 * @create time 2013-6-16 11:45:00
 */
public class FACompleteServlet extends MainServlet {

	private FABaseInfoService faBaseInfoService;
	/**
	 * Constructor of the object.
	 */
	public FACompleteServlet() {
		super();
	}

	public void init(ServletConfig config) throws ServletException {
		// Put your code here
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);

		faBaseInfoService = (FABaseInfoService) wac
				.getBean("faBaseInfoService");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String method = request.getParameter("ac");

		if (method != null) {
			if (method.equalsIgnoreCase("getCompOveInfo")) {
				getCompOveInfo(request, response);
			} else if (method.equalsIgnoreCase("save-update")) {
				saveOrUpdate(request, response);
			} else if (method.equalsIgnoreCase("delete-node")) {
				deleteNode(request, response);
			}
		}
	}

	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}
	
	/**
	 * 获取工程项目概况
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	private void getCompOveInfo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String pid = request.getSession().getAttribute(Constant.CURRENTAPPPID).toString();
		String retVal = formObjectToJSONReaderStr(faBaseInfoService.getCompInfoOve(pid));
		response.getWriter().write(retVal);
	}
	
	/**
	 * 将对象转为JSON
	 * @param obj
	 * @return	JSON对象
	 */
	private static String formObjectToJSONReaderStr(Object obj) {
		if ( obj != null ){
			String str = "{'success':true, 'data':" + JSONObject.fromObject(obj).toString() + "}";
			return str;
		}
		else{
			return "{'success':false}";
		}
	}
	
	/**
	 * 新增或修改工程基本信息、工程类型节点、概算结构节点
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	private void saveOrUpdate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String beanType = request.getParameter("beanType");
		//父节点是否是叶子节点
		String isleaf = request.getParameter("isleaf") == null ? "" : request.getParameter("isleaf");
		String objData = StringUtil.getInputStream(request.getInputStream(), Constant.ENCODING);
		JSONObject jsonObject = JSONObject.fromObject(objData);
		String rtn = "";
		if (beanType.equals("infoOve")) {
			FACompInfoOve infoOve = (FACompInfoOve) JSONObject.toBean(jsonObject, FACompInfoOve.class);
			faBaseInfoService.saveOrUpdate(infoOve);
		} else if (beanType.equals("gcType")) {
			FACompGcType gcType = (FACompGcType) JSONObject.toBean(jsonObject, FACompGcType.class);
			try {
				String id = faBaseInfoService.saveOrUpdateNode(gcType, isleaf);
				rtn = id.equals("false")
						? "{success:true,msg:'" + id + "'}"
						: "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}
			outputString(response, rtn);
		} else if (beanType.equals("faBdgInfo")) {
			FACompBdgInfo bdgInfo = (FACompBdgInfo) JSONObject.toBean(jsonObject, FACompBdgInfo.class);
			try {
				String id = faBaseInfoService.saveOrUpdateNode(bdgInfo, isleaf);
				rtn = id.equals("false")
						? "{success:true,msg:'" + id + "'}"
						: "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}
			outputString(response, rtn);
		} else if (beanType.equals("subject")) {
			FacompFinanceSubject subject = (FacompFinanceSubject) JSONObject.toBean(jsonObject, FacompFinanceSubject.class);
			try {
				String id = faBaseInfoService.saveOrUpdateNode(subject, isleaf);
				rtn = id.equals("false")
						? "{success:true,msg:'" + id + "'}"
						: "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}
			outputString(response, rtn);
		} else if (beanType.equals("proof")) {
			FacompProofInfo proof = (FacompProofInfo) JSONObject.toBean(jsonObject, FacompProofInfo.class);
			try {
				proof.setCreatetime(new Date());
				String id = faBaseInfoService.saveOrUpdateNode(proof);
				rtn = "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}
			outputString(response, rtn);
		}
	}
	
	/**
	 * 删除工程类型、概算结构叶子节点
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	private void deleteNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String beanType = request.getParameter("beanType");
		String id = request.getParameter("id");
		String parentid = request.getParameter("parentid");
		String rtn = "";
		try {
			faBaseInfoService.deleteNode(beanType, id, parentid);
			rtn = "{success:true}";
		} catch (Exception e) {
			rtn = "{success:false}";
		}
		outputString(response, rtn);
	}

}
