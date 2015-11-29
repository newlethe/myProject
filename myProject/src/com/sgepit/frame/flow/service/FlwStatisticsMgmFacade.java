package com.sgepit.frame.flow.service;

import java.util.List;

import com.sgepit.frame.flow.hbm.VFlowStatistics;


public interface FlwStatisticsMgmFacade {
	/**
	 * 功能：生成指定日期时间内流程统计视图
	 * @param startDate 开始时间(格式为2011-06-05)
	 * @param endDate   结束时间
	 * @param overHour  超时小时(默认24小时)
	 * @return  
	 */
	public void upDateViewFlwStatistics(String startDate, String endDate, int overHour);
	
	/**
	 * 获取用户指定日期内某个流程处理人一种流程处理类型（用户起草，已处理， 超时处理，未处理）的主键值的集合
	 * @param startDate
	 * @param endDate
	 * @param userid
	 * @param type (c_sum: 用户起草，p_sum: 用户处理, over_sum: 处理超时，u_sum: 未处理待办)
	 * @return
	 */
	public List<String> getFlowLogids(String startDate, String endDate, String userid, String type);
}
