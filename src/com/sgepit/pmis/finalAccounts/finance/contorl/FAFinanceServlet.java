package com.sgepit.pmis.finalAccounts.finance.contorl;

import java.io.IOException;
import java.util.List;

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
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FAGcTypeService;
import com.sgepit.pmis.finalAccounts.finance.hbm.FAOutcomeAppReport;
import com.sgepit.pmis.finalAccounts.finance.hbm.FASubjectSort;
import com.sgepit.pmis.finalAccounts.finance.service.FAFinanceSortService;
import com.sgepit.pmis.finalAccounts.finance.service.FAOtherAppService;

public class FAFinanceServlet extends MainServlet {

	private FAFinanceSortService financeSortService;
	private FAOtherAppService faOtherAppService;

	public void init(ServletConfig config) throws ServletException {
		// 通过Spring获取Service bean
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		financeSortService = (FAFinanceSortService) wac
				.getBean("financeSortService");
		faOtherAppService = (FAOtherAppService) wac.getBean("faOtherAppService");
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");

		String method = request.getParameter("ac");

		if (method != null) {
			if (method.equalsIgnoreCase("getBdgSubjects")) {
				String bdgid = request.getParameter("bdgid");
				String sort = request.getParameter("sort");
				String dir = request.getParameter("dir");
				boolean asc = dir.equalsIgnoreCase("ASC");

				if (bdgid == null)
					return;
				List<FASubjectSort> list = financeSortService.getBdgSubjects(
						bdgid, sort, asc);
				String retStr = makeJsonDataForGrid(list);
				outputStr(response, retStr);
			} else if (method.equalsIgnoreCase("setSubjectRefBdg")) {
				String bdgid = request.getParameter("bdgid");
				String[] subIds = request.getParameterValues("subIds");
				financeSortService.setSubjectsRefBdg(subIds, bdgid);
			} else if (method.equalsIgnoreCase("save-update")) {
				saveOrUpdate(request, response);
			} else if (method.equalsIgnoreCase("autoCaclPubExpense")){
				autoCaclPubExpense(request, response);
			}

		}

	}

	private void saveOrUpdate(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String beanType = request.getParameter("beanType");
		String objData = StringUtil.getInputStream(request.getInputStream(),
				Constant.ENCODING);
		JSONObject jsonObject = JSONObject.fromObject(objData);
		String rtn = "";
		if (beanType.equals("faOutcomeAppReport")) {
			FAOutcomeAppReport outcomeAppReport = (FAOutcomeAppReport) JSONObject
					.toBean(jsonObject, FAOutcomeAppReport.class);

			try {
				faOtherAppService.saveOutcomeApp(outcomeAppReport);
				rtn = "{success:true}";
			} catch (Exception e) {
				e.printStackTrace();
			}
			outputString(response, rtn);
		}

	}
	
	public void autoCaclPubExpense(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String objData = request.getParameter("json");
		JSONObject jsonObject = JSONObject.fromObject(objData);
		FAOutcomeAppReport outcomeAppReport = (FAOutcomeAppReport) JSONObject
		.toBean(jsonObject, FAOutcomeAppReport.class);
		faOtherAppService.autoCalcPubExpense(outcomeAppReport);
		
		String retVal = "{success:true, data: " + JSONObject.fromObject(outcomeAppReport).toString() + "}";
		outputString(response, retVal);
	};

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);

	}

}
