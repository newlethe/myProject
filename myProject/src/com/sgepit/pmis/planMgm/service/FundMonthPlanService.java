/**
 * 
 */
package com.sgepit.pmis.planMgm.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.planMgm.hbm.ConReportBean;
import com.sgepit.pmis.planMgm.hbm.FundMonthPlanD;


/**
 * @author qiupy 2014-3-4 
 *
 */
public interface FundMonthPlanService {

	public List<ConReportBean> buildConReportTreeGrid(String orderBy, Integer start, Integer limit, HashMap params);
	/**
	 * 
	* @Title: insertFundMonthPlanD
	* @Description: 新增月度资金计划明细
	* @param selectConidStr 选择合同主键字符串
	* @param reportId  报表主键
	* @param pid  项目id
	* @param preMonth  前一月份
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String insertFundMonthPlanD(String selectConidStr,String reportId,String pid,String preMonth);
	/**
	 * 
	* @Title: getSelectedConidStr
	* @Description: 获取本月已经添加到明细的合同id
	* @param reportId
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String getSelectedConidStr(String reportId);
	/**
	 * 
	* @Title: updatefundMonthPlanD
	* @Description: 修改明细记录
	* @param fundMonthPlanD
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-5
	 */
	public String updatefundMonthPlanD(FundMonthPlanD fundMonthPlanD);
	/**
	 * 
	* @Title: exportFundData
	* @Description: 导出月度资金计划明细
	* @param sjType
	* @param unitId
	* @param businessType
	* @param reportId
	* @return
	* @throws IOException
	* @throws ExcelPortException   
	* @return ByteArrayOutputStream    
	* @throws
	* @author qiupy 2014-3-6
	 */
	public ByteArrayOutputStream exportFundData(String sjType,String unitId,String businessType,String reportId) throws IOException, ExcelPortException;
	/**
	 * 
	* @Title: deleteFundMonthDPlanById
	* @Description: 删除月度资金计划明细
	* @param uids
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-6
	 */
	public String deleteFundMonthDPlanById(String uids);
	/**
	 * 月度资金计划管理初始化
	 * author shuz
	 */
	public String initFunMonthPlan(FundMonthPlanD fundMonthPlanD);
}
