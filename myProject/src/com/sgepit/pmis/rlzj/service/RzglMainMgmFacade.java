package com.sgepit.pmis.rlzj.service;

import java.util.List;
import java.util.Map;

import com.dhtmlx.connector.ComboConnector;
import com.dhtmlx.connector.FormConnector;
import com.dhtmlx.connector.GridConnector;

public interface RzglMainMgmFacade{
	//shuz
	/**
	 * 考勤管理工作时间设置读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getWorktimeSet(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 考勤管理节假日设置读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getHolidaySet(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 考勤导入读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getKqImport(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 
	* 
	* 加载部门下拉框信息
	* @param request
	* @param response   
	* @return void    
	* @author shuz 2014-5-8
	 */
	public void loadDeptCombo(ComboConnector combo);
	/**
	 * 考勤调整读取数据
	 * @param request
	 * @param response
	 */
	public void getKqAdjust(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 考勤汇总查询
	 * @param request
	 * @param response
	 */
	public void getKqhzQuery(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 考勤统计查询
	 */
	public void getKqtj(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 获取每日上下午工作时间
	 */
	public List getWorkTime(String sql);
	/**
	 * 返回随机主键32位
	 * @return
	 */
	public String getUuidValue();
	//qiupy
	/**
	 * 出差数据读取
	 */
	public void getOnBusiness(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 
	* @Title: loadOnBusinessForm
	* @Description: 加载出差数据表单
	* @param map
	* @param formConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadOnBusinessForm(Map<String,String> map,FormConnector formConnector);
	/**
	 * 
	* @Title: loadUserComo
	* @Description: 加载用户下拉框数据
	* @param comboConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadUserComo(ComboConnector comboConnector);
	/**
	 * 
	* @Title: loadBillStateComo
	* @Description: 加载审批状态下拉框数据
	* @param comboConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadBillStateComo(ComboConnector comboConnector);
	/**
	 * 
	* @Title: hasContainsFlow
	* @Description: 当前模块是否包含流程
	* @param unitId  用户所在单位
	* @param modId   模块id
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-5-12
	 */
	public String hasContainsFlow(String unitId,String modId);
	/**
	 * 
	* @Title: doOnBusinessInfo
	* @Description: 处理出差信息
	* @param uids   
	* @return void    
	* @throws
	* @author qiupy 2014-5-14
	 */
	public void doOnBusinessInfo(String uids);
	/**
	 * 请假数据读取
	 */
	public void getAskForLeave(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 
	* @Title: loadAskForLeaveForm
	* @Description: 加载请假数据表单
	* @param map
	* @param formConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadAskForLeaveForm(Map<String,String> map,FormConnector formConnector);
	/**
	 * 
	* @Title: doAskForLeaveInfo
	* @Description: 处理请假信息
	* @param uids   
	* @return void    
	* @throws
	* @author qiupy 2014-5-14
	 */
	public void doAskForLeaveInfo(String uids);
	/**
	 * 
	* @Title: loadAskForLeaveTypeComo
	* @Description: 加载请假类型下拉框数据
	* @param comboConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadAskForLeaveTypeComo(ComboConnector comboConnector);
	/**
	 * 加班数据读取
	 */
	public void getOvertime(Map<String,String> map,GridConnector gridConnector);
	/**
	 * 
	* @Title: loadOvertimeForm
	* @Description: 加载加班数据表单
	* @param map
	* @param formConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadOvertimeForm(Map<String,String> map,FormConnector formConnector);
	/**
	 * 
	* @Title: doOvertimeInfo
	* @Description: 处理加班信息
	* @param uids   
	* @return void    
	* @throws
	* @author qiupy 2014-5-14
	 */
	public void doOvertimeInfo(String uids);
}
