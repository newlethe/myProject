package com.sgepit.pcmis.aqgk.service;

import java.util.List;

public interface PCAqgkService {
	/**
	 * 保存,修改, 删除安全隐患信息之后更新对应安全批次表中的数据(多个检验批次下的安全隐患被修改)
	 * @param insertOrUpdateUids 被新增,修改安全隐患主键值集合, 或者被删除安全隐患的主键集合(删除是单选的)
	 * @param option 标志是新增,修改之后更新还是删除安全隐患后更新
	 */
	void InspectionsInfoUpdate(List<String> insertOrUpdateUids, String option);
	
	/**
	 * 更新单个检查批次信息(在导入安全隐患后调用该方法,同时在更新多个检验批次信息中会多次调用)
	 * @param batUids  检验批次主键
	 */
	@SuppressWarnings("unchecked")
	void updateInspectionSingle(String batUids);
	
	/**
	 * Excel导入安全隐患成功后调用该方法, 同步检验批次表和安全隐患表
	 * @param batUids
	 */
	void exchangeDateForImport(String batUids, String toUnit, String fromUnit);
	/**
	 * 删除检验批之后该批次下所有隐患信息被删除
	 * @param uids 
	 */
	void deleteInspectionInfo(String uids);
	
	void report(String accident_uids,String businessType,String bean,String pid);
	/**
	 * 反馈意见新增或修改时数据交互
	 * @param uids
	 * @param pid
	 * @return
	 */
	String excDataOpinionForSaveOrUpdate(String uids, String fromUnit, String toUnit,String bizInfo);
	/**
	 * 反馈意见删除，符合数据条件时需要进行数据交互
	 * @param uids
	 * @param fromUnit
	 * @param toUnit
	 * @param bizInfo
	 * @return
	 */
	String excDataOpinionForDel(String uids, String fromUnit, String toUnit,String bizInfo);
	/**
	 * 安全事故报送
	 * @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public abstract String excDataAqsg(String uids,String businessType,String fromUnit,String toUnit);
	/**
	 * 安全培训报送
	 * @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public abstract String excDataAqpx(String uids,String businessType,String fromUnit,String toUnit);
	/**
	 * 安全月报报送
	* @param uids 主键ID
	 * @param businessType 附件类型
	 * @param fromUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public abstract String excDataAqyb(String uids,String businessType,String fromUnit,String toUnit);
	
	/**
	 * 集团二级公司将新增,修改的检验批次信息加入到数据发送队列,然后发送给项目单位
	 * @param insertUpdateUids 新增和修改的所有检验批次主键
	 * @param fromUnit  数据交互发送单位
	 * @param toUnit    数据交互接收单位
	 * @param bizInfo  数据交换说明信息
	 * @return
	 */
	void excDataInspectionForSaveOrUpdate(List<String> insertUpdateUids, String toUnit, String fromUnit);
	/**
	 * 安全隐患信息的数据交换
	 * @param insertUpdateUids 新增和修改的所有安全隐患主键
	 * @param fromUnit  数据交互发送单位
	 * @param toUnit    数据交互接收单位
	 * @param bizInfo
	 * @return
	 */
	void excDataHDForSaveOrUpdate(List<String> insertUpdateUids, String toUnit, String fromUnit);
	
	/**
	 * 集团公司删除一条检验批次之后
	 * @param uids 被删除检验批次主键
	 * @param fromUnit 发送端单位编号
	 * @param toUnit 接收端单位编号
	 */
	void excDataInspectionForDelete(String uids, String toUnit, String fromUnit);
	
	/**
	 * 集团二级公司删除一条安全隐患之后与项目单位进行数据交换
	 * @param uids 被删除安全隐患主键
	 * @param batUids 被删除安全隐患所属检验批次主键
	 * @param fromUnit 发送端单位编号(只可能是二级公司才可以删除具体的安全隐患信息)
	 * @param toUnit 接收端单位编号(项目单位)
	 */
	void excDataHDForDelete(String uids, String batUids, String toUnit, String fromUnit);
	
	/**
	 * 安全管理模块获得各项目单位一周内的上传的附件数
	 * @prame afterDate  一周前的日期表示格式"2012-08-01"
	 * @return List  返回元素为 [pid, 附件数] 的List
	 */
	public List getAttachNumberForPrj(String afterDate);
	
	/**
	 * 获取UUID和记录总数
	 * @param pid
	 * @return 返回的内容以`分割
	 */
	public String getUuidAndRecordCount(String pid);
}
