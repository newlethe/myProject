package com.sgepit.pmis.finalAccounts.report.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAInstallEquReport;
import com.sgepit.pmis.finalAccounts.bdgStructure.service.FABdgStructureService;
import com.sgepit.pmis.finalAccounts.finance.hbm.FAOutcomeAppReport;
import com.sgepit.pmis.finalAccounts.finance.service.FAOtherAppService;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FAAssetsSort;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaMatAuditReport;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjEqu;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoOve;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoProgress;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInvesment;
import com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjParams;
import com.sgepit.pmis.finalAccounts.report.dao.FAReportDAO;
import com.sgepit.pmis.finalAccounts.report.hbm.FAUnitReport;

public class FAReportConfigServiceImpl implements FAReportConfigService{

	private FAReportDAO faReportDAO;
	private FABdgStructureService faBdgStructureService;
	private FAOtherAppService faOtherAppService;
	
	public FAOtherAppService getFaOtherAppService() {
		return faOtherAppService;
	}

	public void setFaOtherAppService(FAOtherAppService faOtherAppService) {
		this.faOtherAppService = faOtherAppService;
	}

	public FABdgStructureService getFaBdgStructureService() {
		return faBdgStructureService;
	}

	public void setFaBdgStructureService(FABdgStructureService faBdgStructureService) {
		this.faBdgStructureService = faBdgStructureService;
	}

	/**
	 * @return the faReportDAO
	 */
	public FAReportDAO getFaReportDAO() {
		return faReportDAO;
	}

	/**
	 * @param faReportDAO the faReportDAO to set
	 */
	public void setFaReportDAO(FAReportDAO faReportDAO) {
		this.faReportDAO = faReportDAO;
	}
	
	/**
	 * 初始化项目竣工决算报表上传记录
	 * @param pid 工程项目ID
	 * @return 执行了数据插入返回true,如果已存在记录则返回false
	 */
	public boolean initFAUnitReport(String pid){
		boolean inserted = false;
		
		List<FAUnitReport> list = faReportDAO.findByProperty(FAUnitReport.class.getName(), "pid", pid);
		if ( list.size() > 0 ){
			return false;
		}
		
		
		
		//初始化操作
		FAUnitReport faUnitReport = new FAUnitReport();
		faUnitReport.setPid(pid);
		faUnitReport.setCreateDate(new Date());
		faUnitReport.setReportStatus(0);
		//找到当前组织机构
		List<SgccIniUnit> unitList = faReportDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", pid);
		if ( unitList.size() > 0 ){
			SgccIniUnit unit = unitList.get(0);
			faUnitReport.setTitle(unit.getUnitname() + "竣工决算报表");
		}
		//faUnitReport.setTitle(title)
		faReportDAO.insert(faUnitReport);
		inserted = true;
		
		return inserted;
	}
	

	/**
	 * 更新报表主表信息
	 * @param report
	 */
	public void updateFAUnitReport(FAUnitReport report){
		faReportDAO.saveOrUpdate(report);
	}
	
	
	
	public void reportFAReportsToGroup(String pid, String reportType){
	
			if  ( reportType.equalsIgnoreCase("FA_01") ) {
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				String sql = "delete from FA_PRJ_PARAMS where pid = '" + pid + "'";
				sql += ";delete from FA_PRJ_INVESMENT where pid = '" + pid + "'";
				sql += ";delete from FA_PRJ_INFO_PROGRESS where pid = '" + pid + "'";
				sql += ";delete from FA_PRJ_EQU where pid = '" + pid + "'";
				sql += ";delete from FA_PRJ_INFO_OVE where uids = '" + pid + "'";
				List<FAPrjParams> prjParamList = faReportDAO.findByProperty(FAPrjParams.class.getName(), "pid", pid);
				List<FAPrjInvesment> prjInvesList = faReportDAO.findByProperty(FAPrjInvesment.class.getName(), "pid", pid);
				List<FAPrjInfoProgress> infoProgressList = faReportDAO.findByProperty(FAPrjInfoProgress.class.getName(), "pid", pid);
				List<FAPrjEqu> prjEquList = faReportDAO.findByProperty(FAPrjEqu.class.getName(), "pid", pid);
				List<FAPrjInfoOve> infoOveList = faReportDAO.findByProperty(FAPrjInfoOve.class.getName(), "uids", pid);
				List allList = new ArrayList();
				allList.addAll(prjParamList);
				allList.addAll(prjInvesList);
				allList.addAll(infoProgressList);
				allList.addAll(prjEquList);
				allList.addAll(infoOveList);
				List<PcDataExchange> exchangeList = dataExchangeService.getExcDataList(allList, "1", pid, sql, null, "竣工工程概况表【竣建01表】");
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
				
			}
			else if  ( reportType.equalsIgnoreCase("FA_OVERALL_REPORT") ) {
				faBdgStructureService.initFAOverallReport(false, pid, true);
		
			}
			else if ( reportType.equalsIgnoreCase("FA_BUILD_OVE_REPORT") ){
				faBdgStructureService.initFABuildOveReport(false, pid, true);
			}
			else if ( reportType.equalsIgnoreCase("FA_INSTALL_EQU_REPORT") ){
				faBdgStructureService.initFAInstallEquReport(false, pid, true);
			}
			else if ( reportType.equalsIgnoreCase("FA_UNFINISHED_PRJ_REPORT") ){
				faBdgStructureService.initFAUnfinishedPrjReport(false, pid, true);
			}
			else if ( reportType.equalsIgnoreCase("FA_OTHER_DETAIL_REPORT") ){
				faOtherAppService.initFAOtherDetailReport(false, pid, true);
			}
			else if ( reportType.equalsIgnoreCase("FA_OUTCOME_APP_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				
				String sql = "delete from FA_OUTCOME_APP_REPORT where pid ='" + pid + "'";
				List<FAOutcomeAppReport> reportList = faReportDAO.findByProperty(FAOutcomeAppReport.class.getName(), "pid", pid);
				List<PcDataExchange> exchangeList = dataExchangeService.getExcDataList(reportList, "1", pid, sql, null, "待摊基建支出分摊明细表【竣建03表附表】");
				
				List<FABdgInfo> list = faReportDAO.findByProperty(FABdgInfo.class.getName(), "pid", pid);
				List<PcDataExchange> dataExchangeList = dataExchangeService.getExcDataList(list, "1", pid, null, null, "数据交互竣工决算概算结构");
				
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
					dataExchangeService.sendExchangeData(dataExchangeList);
				}
			}
			else if ( reportType.equalsIgnoreCase("FA_ASSETS_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				
				List<PcDataExchange> exchangeList;
				String sql = "delete from fa_assets_sort where pid ='" + pid +"';";
				sql += "delete from fa_assets_report where pid='" + pid + "'";

				List<FAAssetsSort> sortList = faReportDAO.findByProperty(FAAssetsSort.class.getName(), "pid", pid);
				if ( sortList.size() == 0 ) //稽核分类为空
					return;
				exchangeList = dataExchangeService.getExcDataList(sortList, "1", pid, sql, null, "移交资产总表【竣建04表】数据交互");
				
				
				PcDataExchange exchange = exchangeList.get(exchangeList.size() - 1);
				String txGroup = exchange.getTxGroup();
				Long xh = exchange.getXh();
				
				//没有映射，直接生成表
				List<Map<String, Object>> queryList = JdbcUtil.query("select uids from FA_ASSETS_REPORT where pid = '" + pid +"'");
				for (Map<String, Object> map : queryList) {
					PcDataExchange reportExchange = new PcDataExchange();
					reportExchange.setTableName("FA_ASSETS_REPORT");
					JSONArray kvarr = new JSONArray();
					JSONObject kv = new JSONObject();
					kv.put("UIDS", map.get("uids").toString());
					kvarr.add(kv);
					reportExchange.setKeyValue(kvarr.toString());
					reportExchange.setSuccessFlag("0");
					reportExchange.setBizInfo("移交资产总表【竣建04表】");
					++xh;
					reportExchange.setXh(xh);
					reportExchange.setTxGroup(txGroup);
					reportExchange.setPid("1");
					exchangeList.add(reportExchange);
					
				}
				if (  exchangeList.size() > 0){
						dataExchangeService.sendExchangeData(exchangeList);
				}
				
			}
			else if ( reportType.equalsIgnoreCase("FA_BUILDING_AUDIT_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				
				List<PcDataExchange> exchangeList;
				String sql = "delete from fa_assets_sort where pid ='" + pid +"';";
				sql += "delete from FA_BUILDING_AUDIT_REPORT where pid='" + pid + "'";

				List<FAAssetsSort> sortList = faReportDAO.findByProperty(FAAssetsSort.class.getName(), "pid", pid);
				if ( sortList.size() == 0 ) //稽核分类为空
					return;
				
				List<FaBuildingAuditReport> reportList = faReportDAO.findByProperty(FaBuildingAuditReport.class.getName(), "pid", pid);
				List allList = new ArrayList();
				allList.addAll(sortList);
				allList.addAll(reportList);
				exchangeList = dataExchangeService.getExcDataList(allList, "1", pid, sql, null, "房屋及建筑物【竣建04-1表】");
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
				
			}
			else if ( reportType.equalsIgnoreCase("FA_EQU_AUDIT_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				
				List<PcDataExchange> exchangeList;
				String sql = "delete from fa_assets_sort where pid ='" + pid +"';";
				sql += "delete from FA_EQU_AUDIT_REPORT where pid='" + pid + "'";

				List<FAAssetsSort> sortList = faReportDAO.findByProperty(FAAssetsSort.class.getName(), "pid", pid);
				if ( sortList.size() == 0 ) //稽核分类为空
					return;
				
				List<FaEquAuditReport> reportList = faReportDAO.findByProperty(FaEquAuditReport.class.getName(), "pid", pid);
				List allList = new ArrayList();
				allList.addAll(sortList);
				allList.addAll(reportList);
				exchangeList = dataExchangeService.getExcDataList(allList, "1", pid, sql, null, "安装机械设备一览表【竣建04-2表】");
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
			}
			else if ( reportType.equalsIgnoreCase("FA_MAT_AUDIT_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List<PcDataExchange> exchangeList;
				String sql = "delete from fa_assets_sort where pid ='" + pid +"';";
				sql += "delete from FA_MAT_AUDIT_REPORT where pid='" + pid + "'";
				List<FAAssetsSort> sortList = faReportDAO.findByProperty(FAAssetsSort.class.getName(), "pid", pid);
				if ( sortList.size() == 0 ) //稽核分类为空
					return;
				
				List<FaMatAuditReport> reportList = faReportDAO.findByProperty(FaMatAuditReport.class.getName(), "pid", pid);
				List allList = new ArrayList();
				allList.addAll(sortList);
				allList.addAll(reportList);
				exchangeList = dataExchangeService.getExcDataList(allList, "1", pid, sql, null, "不需安装机械设备一览表【竣建04-4表】");
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
				
			}
			else if ( reportType.equalsIgnoreCase("FA_INTANGIBLE_ASSETS_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				String sql = "delete from FA_INTANGIBLE_ASSETS_REPORT where pid ='" + pid +"'";
				List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
				
				//没有映射，直接生成表
				List<Map<String, Object>> queryList = JdbcUtil.query("select uids from FA_INTANGIBLE_ASSETS_REPORT where pid = '" + pid +"'");
				String txGroup = SnUtil.getNewID("tx-");
				Long xh = 0L;
				for (Map<String, Object> map : queryList) {
					PcDataExchange reportExchange = new PcDataExchange();
					reportExchange.setTableName("FA_INTANGIBLE_ASSETS_REPORT");
					JSONArray kvarr = new JSONArray();
					JSONObject kv = new JSONObject();
					kv.put("UIDS", map.get("uids").toString());
					kvarr.add(kv);
					reportExchange.setKeyValue(kvarr.toString());
					reportExchange.setSuccessFlag("0");
					reportExchange.setBizInfo("长期待摊费用、无形资产一览表【竣建04-5表】");
					++xh;
					reportExchange.setXh(xh);
					reportExchange.setTxGroup(txGroup);
					reportExchange.setPid("1");
					reportExchange.setSpareC5(pid);
					exchangeList.add(reportExchange);
					
				}
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
				
			}
			else if ( reportType.equalsIgnoreCase("FA_SETTLEMENT_REPORT") ){
				PCDataExchangeService dataExchangeService = 
					(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				String sql = "delete from FA_SETTLEMENT_REPORT where pid ='" + pid +"'";
				
				List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
				
				//没有映射，直接生成表
				List<Map<String, Object>> queryList = JdbcUtil.query("select uids from FA_SETTLEMENT_REPORT where pid = '" + pid +"'");
				String txGroup = SnUtil.getNewID("tx-");
				Long xh = 0L;
				for (Map<String, Object> map : queryList) {
					PcDataExchange reportExchange = new PcDataExchange();
					reportExchange.setTableName("FA_SETTLEMENT_REPORT");
					JSONArray kvarr = new JSONArray();
					JSONObject kv = new JSONObject();
					kv.put("UIDS", map.get("uids").toString());
					kvarr.add(kv);
					reportExchange.setKeyValue(kvarr.toString());
					reportExchange.setSuccessFlag("0");
					reportExchange.setBizInfo("竣工工程财务决算表【竣建05表】");
					++xh;
					reportExchange.setXh(xh);
					reportExchange.setTxGroup(txGroup);
					reportExchange.setPid("1");
					reportExchange.setSpareC5(pid);
					exchangeList.add(reportExchange);
					
				}
				if (  exchangeList.size() > 0){
					dataExchangeService.sendExchangeData(exchangeList);
				}
			}
			//报送主表信息
			List<FAUnitReport> listReport = faReportDAO.findByProperty(FAUnitReport.class.getName(), "pid", pid);
			if (listReport.size() > 0) {
				FAUnitReport faUnitReport = listReport.get(0);
				//if(faUnitReport.getReportStatus() == 0){
					//更新主表上报状态
					faUnitReport.setReportStatus(1);
					this.faReportDAO.saveOrUpdate(faUnitReport);
					//数据交互
					List allDataList = new ArrayList();
					allDataList.add(faUnitReport);
					//增加前置SQL删除主表数据
					String delFAUnitReportSql = "delete from FA_UNIT_REPORT where pid = '" + pid + "'";
					PCDataExchangeService excService = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
					List<PcDataExchange> exchangeList= new ArrayList<PcDataExchange>();
					exchangeList = excService.getExcDataList(allDataList, "1", pid, delFAUnitReportSql, null, "竣工决算主表数据交互");
					if(exchangeList.size() > 0){
						excService.sendExchangeData(exchangeList);
					}
				//}
			}
	}
	
	
	/**
	 * 根据PID获取上传的竣工决算报表附件流水号
	 * @param pid 工程项目ID
	 * @return 竣工决算报表附件流水号
 	 * <pre>
	 * 根据上报状态和流水号判断
	 * 已上报，有流水号，是没有部署MIS的项目，返回流水号
	 * 已上报，没有流水号，是已经部署MIS的项目，返回1
	 * 未上报，直接返回0
	 * zhangh 2012-05-30
	 * </pre>
	 */
	public String getFAReportLshByPid(String pid){
		List<FAUnitReport> list = faReportDAO.findByProperty(FAUnitReport.class.getName(), "pid", pid);
		String lsh = "0";
		if ( list.size() > 0 && list.get(0).getReportStatus() != null && list.get(0).getReportStatus() == 1 ){
			if(list.get(0).getFileLsh() != null && !"".equals(list.get(0).getFileLsh())){
				lsh = list.get(0).getFileLsh();
			}else{
				lsh = "1";
			}
		}
		return lsh;
	}

	/**
	 * 竣工决算首页初始化所有项目报表记录
	 * @param pidArr 所有项目pid数组
	 * @return
	 * @author zhangh 2012-05-10
	 */
	public boolean initAllFAUnitReport(String[] pidArr){
		for (int i = 0; i < pidArr.length; i++) {
			initFAUnitReport(pidArr[i]);
		}
		return true;
	}

	
	/**
	 * 竣工决算首页项目标题点击后，
	 * 根据项目是否部署MIS返回对应功能模块的Modid
	 * @param pid
	 * @param userid
	 * @return 返回对应功能模块的modid，无权限则返回空字符串
	 * @author zhangh 2012-05-29
	 */
	public String getModidByIsHaveAppUrl(String pid,String userid){
		List<SgccIniUnit> list = faReportDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", pid);
		String modid = "";
		//未部署MIS跳转的URL
		String url = "Business/finalAccounts/report/fa.report.upload.jsp";
		if(list.size() > 0 && list.get(0).getAppUrl() != null && !"".equals(list.get(0).getAppUrl()))
			//已部署MIS跳转的URL
			url = "Business/finalAccounts/report/fa.report.jsp";
		//根据URL查找modid
		String sql = "select powerpk from rock_power where url like '%"+url+"'";
		List<Map<String, String>> list2 = JdbcUtil.query(sql);
		if (list2.size() == 1) {
			modid = list2.get(0).get("POWERPK");
		}
		//根据modid查找用户权限
		String sqlLvl = "select t.lvl from rock_character2power t "
				+ " where t.powerpk = '"+modid+"' and t.rolepk in "
				+ " (select ru.rolepk from rock_role2user ru "
				+ " where ru.userid = '"+userid+"') ";
		List<Map<String, String>> list3 = JdbcUtil.query(sqlLvl);
		if(list3.size() == 0){
			modid = "";
		}
		return modid;
	}

}
