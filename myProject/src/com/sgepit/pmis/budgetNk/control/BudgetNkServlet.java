package com.sgepit.pmis.budgetNk.control;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.pmis.budgetNk.hbm.BudgetNk;
import com.sgepit.pmis.budgetNk.service.BudgetNkService;
import com.sgepit.pmis.budgetNk.service.BudgetStructureService;

/**
 * 概算维护Servlet
 * 
 * @author Yinzf
 * 
 */
public class BudgetNkServlet extends MainServlet {

	// 概算结构维护Service
	private BudgetStructureService budgetStructureService;
	private BudgetNkService budgetNkService;

	private ApplicationMgmFacade applicationMgm;

	public void destroy() {
		// TODO Auto-generated method stub

	}

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		budgetStructureService = (BudgetStructureService) wac
				.getBean("budgetStructureService");
		applicationMgm = (ApplicationMgmFacade) wac.getBean("applicationMgm");
		budgetNkService = (BudgetNkService) wac.getBean("budgetNkService");

	}

	private void getBdgAppDetail(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String bdgid = request.getParameter("bdgid");
		List<Object> list = budgetStructureService.queryBdgid(bdgid);
		String retStr = makeJsonDataForGrid(list);
		response.getWriter().write(retStr);
	}

	private void deleteNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 得到节点id
		String bdgid = request.getParameter("bdgid");
		try {
			budgetStructureService.delete(bdgid);
		} catch (BusinessException exception) {
			response.setContentType("text/json; charset=utf-8");

			response.getWriter().write(
					"{success:false,info:'删除失败，" + exception.getMessage()
							+ "'}");
			return;
		}

		response.setContentType("text/json; charset=utf-8");

		response.getWriter().write("{success:true,info:'成功删除'}");

	}

	/**
	 * 修改和添加
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	private void saveOrUpdateBean(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		// 得到Json数据
		BufferedReader reader = request.getReader();
		String postData = new String();
		String tempLine;
		while ((tempLine = reader.readLine()) != null) {
			postData += tempLine;
		}

		// 将Json数据转化为对象
		JSONObject jsonObject = JSONObject.fromObject(postData);
		BudgetNk budgetNk = (BudgetNk) JSONObject.toBean(jsonObject,
				BudgetNk.class);

		// 若bdgId为""则为新建对象
		if (budgetNk.getBdgid().equals(""))
			budgetNk.setBdgid(null);

		budgetStructureService.saveOrUpdate(budgetNk);

	}

	/**
	 * 自定义ColumnTree(改变UIProvider)
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	private void customColumnNodeTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parent");
		String treeName = request.getParameter("treeName");
		Map params = request.getParameterMap();
		List<ColumnTreeNode> list;
		String str = "";
		try {
			list = budgetNkService.buildColumnNodeTree(treeName, parentId,
					params);

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

	private void getCodeValueArrStr(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String category = request.getParameter("category");

		response.getWriter().write(applicationMgm.getCodeValueArrStr(category));
	}

	private void sumTotalAppMoney(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String pid = request.getParameter("pid");
		response.getWriter().write(
				budgetStructureService.sumAllAppTotal(pid).toString());
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {
			if (method.equalsIgnoreCase("save-update")) {
				saveOrUpdateBean(request, response);
			} else if (method.equalsIgnoreCase("delete")) {
				deleteNode(request, response);
			} else if (method.equalsIgnoreCase("listbox")) {
				getCodeValueArrStr(request, response);
			} else if (method.equalsIgnoreCase("checkBoxColumnTree")) {
				customColumnNodeTree(request, response);
			} else if (method.equalsIgnoreCase("sumTotalAppMoney")) {
				sumTotalAppMoney(request, response);
			} else if (method.equalsIgnoreCase("queryBdg")) {
				getBdgAppDetail(request, response);
			}
		}

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}

}
