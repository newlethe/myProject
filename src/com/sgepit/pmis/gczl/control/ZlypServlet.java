package com.sgepit.pmis.gczl.control;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.pmis.gczl.hbm.GczlJyStat;
import com.sgepit.pmis.gczl.hbm.GczlJyxmApproval;
import com.sgepit.pmis.gczl.service.GczlYpMgmFacade;

public class ZlypServlet extends MainServlet {

	private ApplicationMgmFacade applicationMgm;
	private GczlYpMgmFacade gczlYpMgm;

	public void setGczlYpMgm(GczlYpMgmFacade gczlYpMgm) {
		this.gczlYpMgm = gczlYpMgm;
	}

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);

		applicationMgm = (ApplicationMgmFacade) wac.getBean("applicationMgm");
		gczlYpMgm = (GczlYpMgmFacade) wac.getBean("gczlYpMgm");

	}

	/**
	 * 选择单位工程树
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	private void dwPrjSelectTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parent");
		String statId = request.getParameter("statid");
		List<ColumnTreeNode> list;
		String str = "";
		try {
			list = gczlYpMgm.getSelectDwPrjTree(statId, parentId);

			if (list != null) {
				List temp = new ArrayList();
				for (ColumnTreeNode ctn : list) {
					JSONObject jo = JSONObject.fromObject(ctn.getTreenode());
					JSONObject joc = ctn.getColumns();
					Iterator itr = joc.keys();
					while (itr.hasNext()) {
						String key = (String) itr.next();
						jo.element(key, joc.get(key));
					}
					temp.add(jo);
				}

				str = JSONUtil.formObjectsToJSONStr(temp);

			}
		} catch (BusinessException e) {
			str = e.getMessage();
		}
		outputString(response, str);
	}

	private void addDwPrjNodes(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String[] jyxmBhs = request.getParameterValues("ids");
		String statId = request.getParameter("statid");
		gczlYpMgm.addNodesToZlypStat(jyxmBhs, statId);
	}

	private void getUnitArrStr(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.getWriter().write(gczlYpMgm.getUnitArrStr());
	}

	private void getCodeValueArrStr(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String category = request.getParameter("category");

		response.getWriter().write(applicationMgm.getCodeValueArrStr(category));
	}

	private void getYearMonthArrStr(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		response.getWriter().write(gczlYpMgm.getYearMonthArrStr());

	}

	private void addSjTypeListBox(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String deptId = request.getParameter("deptid");

		response.getWriter().write(gczlYpMgm.getSjTypeForDept(deptId));

	}

	private void saveOrUpdateZlypStat(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String jsonData = request.getParameter("data");
		JSONArray jsonArray = JSONArray.fromObject(jsonData);
		GczlJyStat[] jyStats = (GczlJyStat[]) JSONArray.toArray(jsonArray,
				GczlJyStat.class);

		gczlYpMgm.saveOrUpdate(jyStats);

	}

	private void deleteZlypStat(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String statId = request.getParameter("statid");

		gczlYpMgm.deleteZlypStat(statId);
	}
	
	private void getNewZlypStatUids(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userId = request.getParameter("userid");
		String deptId = request.getParameter("deptid");

		String retVal = gczlYpMgm.getNewGczlStatUids(userId, deptId);
		
		response.getWriter().write(retVal);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {

			if (method.equalsIgnoreCase("listbox")) {
				getCodeValueArrStr(request, response);
			} else if (method.equalsIgnoreCase("unitListBox")) {
				getUnitArrStr(request, response);
			} else if (method.equalsIgnoreCase("yearMonthListBox")) {
				getYearMonthArrStr(request, response);
			} else if (method.equalsIgnoreCase("save-update")) {
				saveOrUpdateZlypStat(request, response);
			} else if (method.equalsIgnoreCase("dwprj-select-tree")) {
				dwPrjSelectTree(request, response);
			} else if (method.equalsIgnoreCase("add-dwprj-nodes")) {
				addDwPrjNodes(request, response);
			} else if (method.equalsIgnoreCase("delete")) {
				deleteZlypStat(request, response);
			} else if (method.equalsIgnoreCase("addSjTypeListBox")) {
				addSjTypeListBox(request, response);
			}else if (method.equalsIgnoreCase("getNewZlypStatUids")) {
				getNewZlypStatUids(request, response);
			}else if (method.equalsIgnoreCase("listGczlApproval")) {
				getGczlApproval(request, response);
			}
			
		}

	}
	/**
	 * 验评记录管理
	 * @param pid
	 * @param xmbh
	 * @author shangtw
	 */
	private void getGczlApproval(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String params = request.getParameter("params");
		String pid = "";
		String xmbh = "";
		String where="";
		String arr[] = params.split("and");
		if (arr != null && arr.length > 0) {
			pid = arr[0].trim();
			xmbh = arr[1].trim();
			where=arr[2].trim();
		}
		List list = gczlYpMgm.getGczlApproval(pid, xmbh, start, limit,where);
		String json = "";
		json = makeJsonDataForGrid(list);
		outputString(response, json);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}
}
