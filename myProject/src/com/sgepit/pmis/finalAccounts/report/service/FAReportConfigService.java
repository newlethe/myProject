package com.sgepit.pmis.finalAccounts.report.service;

import com.sgepit.pmis.finalAccounts.report.hbm.FAUnitReport;

public interface FAReportConfigService {
	
	public static final int FA_01 = 1;
	public static final int FA_OVERALL_REPORT = 2;
	public static final int FA_BUILD_OVE_REPORT = 3;
	public static final int FA_INSTALL_EQU_REPORT = 4;
	public static final int FA_UNFINISHED_PRJ_REPORT = 5;
	public static final int FA_OTHER_DETAIL_REPORT = 6;
	public static final int FA_OUTCOME_APP_REPORT = 7;
	public static final int FA_ASSETS_REPORT = 8;
	public static final int FA_BUILDING_AUDIT_REPORT = 9;
	public static final int FA_EQU_AUDIT_REPORT = 10;
	public static final int FA_MAT_AUDIT_REPORT = 11;
	public static final int FA_INTANGIBLE_ASSETS_REPORT = 12;
	public static final int FA_SETTLEMENT_REPORT = 13;
	
	
	public void reportFAReportsToGroup(String pid, String reportType);

	/**
	 * 更新报表主表信息
	 * @param report
	 */
	public void updateFAUnitReport(FAUnitReport report);
	/**
	 * 初始化项目竣工决算报表上传记录
	 * @param pid 工程项目ID
	 * @return 执行了数据插入返回true,如果已存在记录则返回false
	 */
	public boolean initFAUnitReport(String pid);
	
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
	public String getFAReportLshByPid(String pid);
	
	
	/**
	 * 竣工决算首页初始化所有项目报表
	 * @param pidArr 所有项目pid数组
	 * @return
	 * @author zhangh 2012-05-10
	 */
	public boolean initAllFAUnitReport(String[] pidArr);
	
	/**
	 * 竣工决算首页项目标题点击后，
	 * 根据项目是否部署MIS返回对应功能模块的Modid
	 * @param pid
	 * @param userid
	 * @return 返回对应功能模块的modid
	 * @author zhangh 2012-05-29
	 */
	public String getModidByIsHaveAppUrl(String pid,String userid);
}
