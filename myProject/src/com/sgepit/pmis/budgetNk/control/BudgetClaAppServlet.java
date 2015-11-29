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
import com.sgepit.pmis.budgetNk.hbm.BudgetClaAppNk;
import com.sgepit.pmis.budgetNk.service.BudgetClaAppNkService;

public class BudgetClaAppServlet extends MainServlet {

	private BudgetClaAppNkService budgetClaAppNkService;

	public void destroy() {
		// TODO Auto-generated method stub

	}

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);

		budgetClaAppNkService = (BudgetClaAppNkService) wac
				.getBean("budgetClaAppNkService");
	}

	private void updateClaApp(HttpServletRequest request,
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
		BudgetClaAppNk claAppNk = (BudgetClaAppNk) JSONObject.toBean(
				jsonObject, BudgetClaAppNk.class);

		budgetClaAppNkService.saveOrUpdate(claAppNk);

	}

	private void deleteNode(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 得到节点id
		String claappid = request.getParameter("claappid");
		try {
			budgetClaAppNkService.delete(claappid);
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

			if (method.equalsIgnoreCase("updateClaApp")) {
				updateClaApp(request, response);
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