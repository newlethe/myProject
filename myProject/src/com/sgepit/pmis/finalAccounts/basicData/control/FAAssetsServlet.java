package com.sgepit.pmis.finalAccounts.basicData.control;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.pmis.finalAccounts.basicData.service.FAAssetsService;
import com.sgepit.pmis.finalAccounts.financialAudit.service.FinancialAuditService;

public class FAAssetsServlet extends HttpServlet {
	
	private FAAssetsService faAssetsService;
	
	private FinancialAuditService financialAuditService;
	private WebApplicationContext wac;
	
	@Override
	public void init(ServletConfig config)throws ServletException{
		// TODO Auto-generated method stub
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.financialAuditService=(FinancialAuditService) wac.getBean("financialAuditService");
		//this.faAssetsService = (FAAssetsService) Constant.wact.getBean("faAssetsService");
	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("method");	
		if (method != null) {
			if(method.equals("buileMainTree")){
				buileMainTree(request,response);
			}
		}
	}

	public void outputString(HttpServletResponse response, String str) throws IOException {
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out = response.getWriter();
		out.println(str);
		out.flush();
		out.close();
	}
	
	private void buileMainTree(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String pid = (String) request.getSession().getAttribute(Constant.CURRENTAPPPID);
		List list = this.financialAuditService.getFAAssetsSortTree(pid);
		JSONArray arrayjson = new JSONArray();// 定义一个jsonarray型的对象
		int size = list.size();
		if (list != null && list.size() > 0) {
			if (list.get(list.size() - 1).getClass().getName().equals(
					"java.lang.Integer")) {
				size = (Integer) list.get(list.size() - 1);
				list.remove(list.size() - 1);
			}
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(String.class,
				new JSONUtil.NullValueProcesser());
		arrayjson = JSONArray.fromObject(list, jsonConfig);
		JSONObject jsonResult = new JSONObject();
		jsonResult.put("topics", arrayjson);
		jsonResult.put("totalCount", size);
		System.out.println(jsonResult.toString());
		outputString(response, jsonResult.toString());
	}
}
