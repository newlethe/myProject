package com.sgepit.pmis.finalAccounts.report.control;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.util.db.Db2Json;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService;
import com.sgepit.pmis.finalAccounts.finance.service.FAOtherAppService;
import com.sgepit.pmis.finalAccounts.financialAudit.service.FinancialAuditService;
import com.sgepit.pmis.finalAccounts.report.hbm.FAUnitReport;
import com.sgepit.pmis.finalAccounts.report.service.FAReportConfigService;

public class FAReportDWR {

	private FABdgStructureService faBdgStructureService;

	private FAOtherAppService faOtherAppService;

	private FinancialAuditService financialAuditService;
	
	private FAReportConfigService faReportConfigService;

	public String getFAReportLshByPid(String pid) {
		return faReportConfigService.getFAReportLshByPid(pid);
	}

	public boolean initFAUnitReport(String pid) {
		return faReportConfigService.initFAUnitReport(pid);
	}

	public boolean updateFAUnitReport(FAUnitReport report) {
		try {
			faReportConfigService.updateFAUnitReport(report);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public FAReportDWR() {
		faBdgStructureService = (FABdgStructureService) Constant.wact
				.getBean("faBdgStructureService");
		financialAuditService = (FinancialAuditService) Constant.wact
				.getBean("financialAuditService");
		faOtherAppService = (FAOtherAppService) Constant.wact
				.getBean("faOtherAppService");
		faReportConfigService = (FAReportConfigService) Constant.wact.getBean("faReportConfigService");
	}

	/**
	 * * 初始化竣工决算一览表（竣建02表）
	 * 
	 * @param force
	 *            是否强制初始化。若为假则当表中已存在数据时不会初始化。 若为真，则会重新初始化覆盖表中已有数据
	 * @see com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService#initFAOverallReport(java.lang.Boolean)
	 */
	public void initFAOverallReport(Boolean force) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		faBdgStructureService.initFAOverallReport(force, pid);
	}

	/**
	 * @param force
	 * @see com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService#initFABuildOveReport(java.lang.Boolean)
	 */
	public void initFABuildOveReport(Boolean force) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		faBdgStructureService.initFABuildOveReport(force, pid);
	}

	/**
	 * @param force
	 * @see com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService#initFAInstallEquReport(java.lang.Boolean)
	 */
	public void initFAInstallEquReport(Boolean force) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		faBdgStructureService.initFAInstallEquReport(force, pid);
	}

	/**
	 * @param force
	 * @see com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService#initFAUnfinishedPrjReport(java.lang.Boolean)
	 */
	public void initFAUnfinishedPrjReport(Boolean force) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		faBdgStructureService.initFAUnfinishedPrjReport(force, pid);
	}

	/**
	 * @param force
	 * @see com.sgepit.pmis.finalAccounts.finance.service.FAOtherAppService#initFAOtherReport(java.lang.Boolean)
	 */
	public void initFAOtherDetailReport(Boolean force) {
		WebContext webContext = WebContextFactory.get();
		HttpSession session = webContext.getSession();
		String pid = session.getAttribute(Constant.CURRENTAPPPID).toString();
		faOtherAppService.initFAOtherDetailReport(force, pid);
	}

	/**
	 * 初始化竣建04表
	 * 
	 * @author: Ivy
	 * @createDate: 2011-4-6
	 */
	public String initAssetsReportData(String pid) {
		return financialAuditService.initAssetsReportData(pid);
	}

	/**
	 * 对于竣建01表，直接从excel模板中写sql语句，获取相应的值；
	 * 
	 * @param sqlArr
	 * @param addressArr
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-4-12
	 */
	public String getTempletExcelData(String[] sqlArr, String[] addressArr) {
		String xml = "";
		Document Hdocument = DocumentHelper.createDocument();
		Element rows = Hdocument.addElement("datas");
		for (int i = 0; i < addressArr.length; i++) {
			String[] address = addressArr[i].split(";");
			String col = address[0];
			String row = address[1];
			Element data = rows.addElement("data");
			data.addAttribute("index", col);
			data.addAttribute("row", row);

			String value = null;
			Db2Json db2Json = new Db2Json();
			System.out.println(sqlArr[i]);
			String r = db2Json.selectSimpleData(sqlArr[i]);
			if (r != null && r.length() > 2) {
				value = r.substring(2, r.length() - 3);
			}
			data.addCDATA(value == null ? "" : value);
		}

		xml = Hdocument.asXML();
		return xml;
	}
	
	
	public String reportFAReportsToGroup(String pid, String reportType){
		String retVal = "success";
		try {
			faReportConfigService.reportFAReportsToGroup(pid, reportType);
		} catch (Exception e) {
			e.printStackTrace();
			retVal = "falure";
		}
		return retVal;
	}
	
	public boolean initAllFAUnitReport(String[] pidArr){
		faReportConfigService.initAllFAUnitReport(pidArr);
		return true;
	}
	
	public String getModidByIsHaveAppUrl(String pid, String userid){
		return faReportConfigService.getModidByIsHaveAppUrl(pid,userid);
	}
}
