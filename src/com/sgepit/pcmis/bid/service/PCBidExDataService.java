package com.sgepit.pcmis.bid.service;

/**
 * 招投标管理数据交互
 * @author liangwj
 * @since 2011-10-11
 */
public interface PCBidExDataService {
	/**
	 * 删除招标申请时数据交互（需要同时删除对应的招标内容及招标内容下的详细过程信息和附件）
	 * @param ids 招标申请主键Id
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public abstract String excDataZbApplyForDel(String[] ids, boolean immediate, String sendUnit, String toUnit);
	/**
	 * 删除招标内容时数据交互
	 * @param ids 招标内容主键Id
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit   接收单位
	 * @return
	 */
	public abstract String excDataZbContentForDel(String[] ids, boolean immediate, String sendUnit, String toUnit);
	/**
	 * 各招标详细过程信息的删除
	 * @param beanType
	 * @param ids
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public abstract String excDataZbProcessForDel(String beanType, String[] ids, boolean immediate, String sendUnit, String toUnit);
	/**
	 * 招投标管理数据新增或修改数据交互
	 * @param beanType
	 * @param updateIds 
	 * @param insertIds  
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public abstract String excDataZbForSave(String beanType, String[] updateIds,String[] insertIds,
			boolean immediate, String sendUnit, String toUnit);
	/**
	 * 招投标管理附件的数据交互
	 * @param beanName 业务bean名称
	 * @param id 业务主键
	 * @param fileLshArr 附件流水号号
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @param bizInfo 交互说明
	 * @param immediate 是否立即发送
	 * @return
	 */
	public abstract String excDataAttachments(String beanName, String id, String[] fileLshArr,String sendUnit, String toUnit,String bizInfo,boolean immediate);
}
