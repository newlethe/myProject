package com.sgepit.pmis.finalAccounts.bdgStructure.control;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FAGcTypeService;

public class BdgStructureServlet extends MainServlet {

	private FAGcTypeService gcTypeService;
	private FABdgStructureService faBdgStructureService;
	
	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		gcTypeService = (FAGcTypeService) wac.getBean("gcTypeService");
		faBdgStructureService = (FABdgStructureService) wac
				.getBean("faBdgStructureService");
		
	}

	private void saveUpdateNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String beanType = request.getParameter("beanType");
		String objData = StringUtil.getInputStream(request.getInputStream(),
				Constant.ENCODING);
		JSONObject jsonObject = JSONObject.fromObject(objData);
		String rtn = "";
		if (beanType.equals("gcType")) {
			FAGcType gcType = (FAGcType) JSONObject.toBean(jsonObject,
					FAGcType.class);

			try {
				String id = gcTypeService.saveOrUpdateNode(gcType);
				rtn = "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}
			outputString(response, rtn);
		} else if (beanType.equals("faBdgInfo")) {
			FABdgInfo bdgInfo = (FABdgInfo) JSONObject.toBean(jsonObject,
					FABdgInfo.class);
			try {
				Boolean exchangeData = Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A");
				String id = faBdgStructureService.saveOrUpdateNode(bdgInfo, exchangeData);
				faBdgStructureService.setCoSysBdgUpToRoot(bdgInfo, false);
				rtn = "{success:true,msg:'" + id + "'}";
			} catch (Exception e) {
				rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
			}

		}

	}
	
	private void setFinish(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String bdgid = request.getParameter("bdgid");
		boolean isFinish = false;
		String finishStr = request.getParameter("finish");
		if ( finishStr != null ){
			if ( finishStr.equals("1") ){
				isFinish = true;
			}
			
		}
		//Boolean exchangeData = Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A");
		faBdgStructureService.setFinish(bdgid, isFinish, false);

	}
	
	private void setCorrespondBdg(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String bdgid = request.getParameter("bdgid");
		String coBdgid = request.getParameter("coBdgid");
		faBdgStructureService.saveCoBdgid(bdgid, coBdgid);
	
	}

	private void deleteNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String beanType = request.getParameter("beanType");
		String id = request.getParameter("id");
		String rtn = "";

		if (beanType.equals("gcType")) {

			try {
				gcTypeService.deleteNode(id);
				rtn = "{success:true}";
			} catch (Exception e) {
				rtn = "{success:false}";
			}
			outputString(response, rtn);
		} else if (beanType.equals("faBdgInfo")) {
			try {
				Boolean exchangeData = Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A");
				faBdgStructureService.deleteNode(id, exchangeData);
				rtn = "{success:true}";
			} catch (Exception e) {
				rtn = "{success:false}";
			}
			outputString(response, rtn);
		}

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {
			if (method.equalsIgnoreCase("save-update-node")) {
				saveUpdateNode(request, response);
			} else if (method.equalsIgnoreCase("delete-node")) {
				deleteNode(request, response);

			} else if (method.equalsIgnoreCase("listbox-gctype")) {
				String rtnStr = getListBoxStr(gcTypeService.getGcTypeList());
				response.getWriter().write(rtnStr);
			} else if ( method.equalsIgnoreCase("setFinish") ){
				setFinish(request, response);
			} else if ( method.equalsIgnoreCase("setCorrespondBdg") ){
				setCorrespondBdg(request, response);
			} 
		}

	}

	/**
	 * 将数据集合转换为ComboBox的JSON字符串
	 * 
	 * @param listData
	 * @return
	 */
	private String getListBoxStr(List<Object[]> listData) {
		String retStr = "[";
		for (int i = 0; i < listData.size(); i++) {
			Object[] arr = listData.get(i);
			retStr += String.format("['%s','%s']", arr[0].toString(),
					arr[1].toString());
			if (i < listData.size() - 1) {
				retStr += ",";
			}
		}
		retStr += "]";
		return retStr;
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}

}
