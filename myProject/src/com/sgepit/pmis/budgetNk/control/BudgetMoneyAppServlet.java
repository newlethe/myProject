package com.sgepit.pmis.budgetNk.control;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk;
import com.sgepit.pmis.budgetNk.service.BudgetBreakAppNkService;
import com.sgepit.pmis.budgetNk.service.BudgetChangeAppNkService;
import com.sgepit.pmis.budgetNk.service.BudgetClaAppNkService;
import com.sgepit.pmis.budgetNk.service.BudgetMoneyAppNkService;
import com.sgepit.pmis.budgetNk.service.BudgetPayAppNkService;

/**
 * 概算分摊Servlet
 * 
 * @author Yinzf
 * 
 */
public class BudgetMoneyAppServlet extends MainServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private BudgetMoneyAppNkService budgetMoneyAppNkService;
	private BudgetChangeAppNkService budgetChangeAppNkService;
	private BudgetPayAppNkService budgetPayAppNkService;
	private BudgetClaAppNkService budgetClaAppNkService;
	private BudgetBreakAppNkService budgetBreakAppNkService;

	public void destroy() {
		// TODO Auto-generated method stub

	}

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		budgetMoneyAppNkService = (BudgetMoneyAppNkService) wac
				.getBean("budgetMoneyAppNkService");
		budgetChangeAppNkService = (BudgetChangeAppNkService) wac
				.getBean("budgetChangeAppNkService");
		budgetPayAppNkService = (BudgetPayAppNkService) wac
				.getBean("budgetPayAppNkService");
		budgetClaAppNkService = (BudgetClaAppNkService) wac
				.getBean("budgetClaAppNkService");
		budgetBreakAppNkService = (BudgetBreakAppNkService) wac
				.getBean("budgetBreakAppNkService");
	}

	private void saveSelectedPayApps(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String[] ids = request.getParameterValues("ids");
		String conid = request.getParameter("conid");
		String payappno = request.getParameter("typeid");
		budgetPayAppNkService.saveSelectedBudgets(conid, payappno, ids);

	}

	private void saveSelectedChangeApps(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String[] ids = request.getParameterValues("ids");
		String conid = request.getParameter("conid");
		String chaid = request.getParameter("typeid");
		budgetChangeAppNkService.saveSelectedBudgets(conid, chaid, ids);

	}

	private void saveSelectedApps(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String[] ids = request.getParameterValues("ids");
		String conid = request.getParameter("conid");
		budgetMoneyAppNkService.saveSelectedBudgets(conid, ids);

	}

	private void saveSelectedClaApps(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String[] ids = request.getParameterValues("ids");
		String conid = request.getParameter("conid");
		String claid = request.getParameter("typeid");
		budgetClaAppNkService.saveSelectedBudgets(conid, claid, ids);

	}
	
	private void saveSelectedBreakApps(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String[] ids = request.getParameterValues("ids");
		String conid = request.getParameter("conid");
		String breid = request.getParameter("typeid");
		budgetBreakAppNkService.saveSelectedBudgets(conid, breid, ids);

	}

	private void updateMoneyApp(HttpServletRequest request,
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
		BudgetMoneyAppNk moneyAppNk = (BudgetMoneyAppNk) JSONObject.toBean(
				jsonObject, BudgetMoneyAppNk.class);

		budgetMoneyAppNkService.saveOrUpdate(moneyAppNk);

	}

	private void deleteNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 得到节点id
		String appid = request.getParameter("appid");
		try {
			budgetMoneyAppNkService.delete(appid);
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

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {
			if (method.equalsIgnoreCase("saveApps")) {
				saveSelectedApps(request, response);
			} else if (method.equalsIgnoreCase("updateMoneyApp")) {
				updateMoneyApp(request, response);
			} else if (method.equalsIgnoreCase("saveChangeMoneyAppTree")) {
				saveSelectedChangeApps(request, response);
			} else if (method.equalsIgnoreCase("savePayAppTree")) {
				saveSelectedPayApps(request, response);
			} else if (method.equalsIgnoreCase("saveClaimAppTree")) {
				saveSelectedClaApps(request, response);
			} else if (method.equalsIgnoreCase("saveBreakAppTree")) {
				saveSelectedBreakApps(request, response);
			} else if (method.equalsIgnoreCase("delete")) {
				deleteNode(request, response);
			}
		}

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}


}
