package com.sgepit.pcmis.tzgl.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3D;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompD;
import com.sgepit.pcmis.tzgl.hbm.PcTzglYearPlanD;

public interface PCTzglService {
	public String getYearInvestXml(String pid);
	public String[] sjTypeFilter(String pid, String bean);
	/**
	 * 投资管理一览表
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param params
	 * @return
	 */
	List indexOfTzglCount(String orderBy, Integer start,Integer limit, HashMap<String, String> params);
	List indexOfMonthCompQuery(String orderBy, Integer start,Integer limit, HashMap<String, String> params);
	/**
	 * 月度投资完成上报
	 * @param uids 主键
	 * @param fromUnit 发送单位（项目单位）
	 * @param toUnit  接收单位
	 * @return
	 */
	public String mis2jtOfMonthCmp(String uids,String fromUnit,String toUnit);
	/**
	 * 年度投资计划上报
	 * @param uids 主键
	 * @param fromUnit 发送单位（项目单位）
	 * @param toUnit  接收单位
	 * @return
	 */
	public String mis2jtOfYearPlan(String uids, String toUnitType, String fromUnit, String bizInfo,String reportMan);
	
	/**
	 * 年度投资完成上报(集团二级公司上报给集团)
	 * @param uids String 唯一记录
	 * @param sendPerson String 报送人
	 * @return 0--报送失败; 1--报送成功
	 */
	public String comp2TojtOfYearCmp(String uids, String sendPerson,String unitname);
	
	public String monthCompddOrUpdate(PcTzglMonthCompD monthCompD);
	public String yearPlanAddOrUpdate(PcTzglYearPlanD yearPlanD);
	public List yearPlanIni(String uids, String pid, String sjType);
	public List getCompData(String pid, String sjType);
	public List monthCompIni(String uids, String pid, String sjType);
	public List dyReport1Ini(String unitId, String sjType);
	public List dyReport2Ini(String unitId, String sjType);
	public List dyReport3Ini(String unitId, String sjType);
	public String dyReport1AddOrUpdate(PcTzglDyreport1D report1);
	public String dyReport2AddOrUpdate(PcTzglDyreport2D report1);
	public String dyReport3AddOrUpdate(PcTzglDyreport3D report1);
	/**
	 * 投资计划电源类报表报送
	 * @param uids
	 * @param pid
	 * @param dyreportType
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public String mis2jtOfDYReport(String uids,String pid, String dyreportType,String fromUnit,String toUnit, String reportMan);
	
	/**
	 * 投资计划电源类报表报送(集团二级公司报送到集团)
	 * @param uids 唯一记录
	 * @param sendPerson 发送人
	 * @param dyreportType  报表类型
	 * @return
	 */
	public String comp2TojtOfDYReport(String uids, String sendPerson, String dyreportType, String unitname);
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	String getEarliestMonthReportSj();
	String getYearReportSj();
	
	/**
	 * 集团二级公司上报投资月报到集团
	 * uids String 唯一记录
	 * sendPerson  String 发送报表人员
	 */
	public String comp2TojtOfMonthCmp(String uids,String sendPerson,String unitname);
	
	/**
	 * 投资管理月报退回(包括集团退回二级公司, 二级公司退回项目单位)
	 * @param uids String 唯一记录
	 * @param reason  String 退回原因
	 * @param backUser String 退回用户
	 * @param backUnitId String 退回单位id
	 * @return
	 */
	public String sendBackTzglMonReport(String uids, String reason, String backUser, String backUnitId);
	
	/**
	 * 投资管理年报退回(包括集团退回二级公司, 二级公司退回项目单位)
	 * @param uids String 唯一记录
	 * @param reason  String 退回原因
	 * @param backUser String 退回用户
	 * @param backUnitId String 退回单位id
	 * @return
	 */
	public String sendBackTzglYearReport(String uids, String reason, String backUser, String backUnitId);
	
	
	/**
	 * 电源类投资完成月报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport1M(String uids, String reason,String backUser, String backUnitId);
	
	
	/**
	 * 建设规模和新增生产能力月报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport2M(String uids, String reason,String backUser, String backUnitId);
	
	/**
	 * 电源类资金到位情况年报退回方法
	 * @param uids 唯一记录
	 * @param reason 返回原因
	 * @param backUser  返回操作人
	 * @param backUnitId 返回到的单位编号
	 * @return String 0--失败; 1--成功
	 */
	public String sendBackDYReport3M(String uids, String reason,String backUser, String backUnitId);
	
	//----------------------------------------------------项目单位-->二级企业-->集团
	/**
	 * 
	 * 实现将进度管控的信息通过数据交互传递给集团二级公司
	 * @param uids	上报主记录
	 * @param toUnitType	上报到上级单位的类型
	 * @param fromUnit		上报数据的单位
	 * @param bizInfo		数据交换的信息
	 * 
	 * 标注(liangwj,2011-09-22):
	 * 数据交互的条件：
	 * 集团->项目单位：需要判断项目单位的远程地址是否存在(也就是sgcc_ini_unit表中字段app_url是否存在)
	 * 项目单位->集团：需要判断系统资源文件中系统的部署模式(system.properties中DEPLOY_UNITTYPE的属性值)，如果DEPLOY_UNITTYPE=0表示项目单位和集团公司、
	 *                二级企业、三级企业子同一系统中，此时不需要进行数据交互；如果DEPLOY_UNITTYPE=A表示项目单位单独部署，此时需要数据交互。

	 * @author: Liuay
	 * @createDate: 2011-11-30
	 */
	public String xmdwSubmitReport2(String uids, String toUnitType, String fromUnit, String bizInfo,String reportMan);
	
	/**
	 * 获取主记录信息
	 * @param tableName
	 * @param uniqueWhere
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-12-1
	 */
	public Map findDataByTableId(String tableName, String uniqueWhere);
	
	/**
	 * 更新报表的签名信息
	 * @param tableName	需要更新的表名
	 * @param uniqueWhere	查询唯一数据的条件
	 * @param dataList		需要更新的字段`值
	 * @return
	 * @author: Liuay
	 * @createDate: 2011-12-1
	 */
	public String updateDataByTableId(String tableName, String uniqueWhere, List dataList);
	/**
	 * 通过给定的表名和条件语句，查询出unitid,也就是pid.
	 * @param table
	 * @param where
	 * @return
	 */
	public Object[] getFilterUnitId(String table, String where);
	
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,long state);
	public String updateState2(String uids,String backUser,String unitname,String reason,String fromUnit,long state);
	public String updateStateDYReport(String uids,String backUser,String unitname,String reason,String fromUnit,long state,String reportType);
	public List getReportPids(String dyreportType, String f_date);
	
	public void initPcTzglMonthInvestD(String pid,String idsOfInsert);
	public String updatePcTzglMonthInvestMState(String uids,String backUser,String unitname,String reason,String fromUnit,long state);
	public String submitReportFormXmdwToJt(String uids, String fromUnit, String bizInfo,String reportMan,String reportUnitName);
}
