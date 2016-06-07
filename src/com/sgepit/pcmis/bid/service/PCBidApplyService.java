package com.sgepit.pcmis.bid.service;

import java.util.List;
import java.util.Map;

import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;

public interface PCBidApplyService {
	
	List<PcBidZbApply> getBidApplyForCurrentPrj(String[] outFilter,String pid);
	List<PcBidZbContent> getContentForCurrentApply(String[] outFilter,String zbUids);
	/**
	 * 根据传入的项目编号Id查找计算出返回的已完成招标项目、
	 * 已签订合同金额、占总投资百分比三项数据，在Map 中定义三项返回
	 * 值的key 分别为bidcompletePro,bidsingedCon,bidpercentage
	 * @param pid
	 * @return
	 */
    Map<String,String> getProjectScheduleByPid(String pid,String totalMoney);
    public String [] filterBidDetailTreeNode(String[] outFilter);
  /*
   * 找出当前项目下所有的代理机构名称
   * */
    List<PcBidZbAgency> getBidPcBidZbAgencyForCurrentPrj(String pid);
	/**
	 * 根据招标项目等条件找出符合条件的招标内容
	 * @param outFilter		外部动态参数
	 * @param whereStr		其他条件
	 * @param bean存在发放中标通知书并且中标通知书工作进度为100%的招标内容或选了招标内容的合同
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-7-30
	 */	
	@SuppressWarnings("unchecked")
	public List<PcBidZbContent> getContentForCurrentApplyByWhere(String bean,String []outFilter,String whereStr); 
	/**
	 找出存在发放中标通知书或合同下的招标项目下的招标内容存在的记录的招标项目
	 *@param outFilter
	 * @param bean
	 * @param pid
	 * @return
	 */
	public List<PcBidZbApply> getBidApplyForCurrentPrjByBean(String bean,String[] outFilter,String pid);
		
}
