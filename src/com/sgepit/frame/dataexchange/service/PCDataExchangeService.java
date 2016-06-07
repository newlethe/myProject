package com.sgepit.frame.dataexchange.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;

/**
 * 数据交换接口，提供将Java Bean集合转换成数据交互对象集合方法
 * 以及交互数据的方法
 */
public interface PCDataExchangeService {
	/**
	 * 发送成功
	 */
	int SUCCESS = 1;
	/**
	 * 接收端执行错误
	 */
	int EXECUTION_FAILUR = -1;
	/**
	 * 远程连接失败
	 */
	int CONNECTION_FAILUR = -2;
	/**
	 * 生成SQL语句
	 */
	public String createMergeSQL(PcDataExchange pcDataExchange);
	/**
	 * 获取表的主键
	 * @param tableName
	 * @return
	 */
	public abstract HashMap<String, String> getPrimaryKeyByTableName(String tableName);
	/**
	 * 取得发送队列下一个序号
	 * @param pid 接收端pid
	 * @return
	 */
	public abstract long getNewExchangeXh(String pid);
	
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list 存放业务实体bean的集合
	 * @param pid 接收端PID
	 * @return 数据 交互对象集合
	 */
	@SuppressWarnings("rawtypes")
	public abstract List<PcDataExchange> getExchangeDataList(List list, String pid);
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list 存放业务实体bean的集合
	 * @param pid 接收端PID
	 * @param sqlBefore 前置SQL,多条用分号隔开
	 * @param sqlAfter 后置SQL,多条用分号隔开
	 * @return 数据交互对象集合
	 */
	@SuppressWarnings("rawtypes")
	public abstract List<PcDataExchange> getExchangeDataList(List list, String pid, String sqlBefore, String sqlAfter);
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list 存放业务实体bean的集合
	 * @param pid 接收端PID
	 * @param sqlBefore 前置SQL,多条用分号隔开
	 * @param sqlAfter 后置SQL,多条用分号隔开
	 * @param bizInfo 业务说明
	 * @return 数据交互对象集合
	 */
	@SuppressWarnings("rawtypes")
	public abstract List<PcDataExchange> getExchangeDataList(List list, String pid, String sqlBefore, String sqlAfter, String bizInfo);
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list 存放业务实体bean的集合
	 * @param pid 接收端PID
	 * @param bizInfo 业务说明
	 * @return 数据交互对象集合
	 */
	@SuppressWarnings("rawtypes")
	public abstract List<PcDataExchange> getExchangeDataList(List list, String pid, String bizInfo);
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list
	 * @param pid 接收单位
	 * @param sendUnit 发送单位
	 * @param sqlBefore
	 * @param sqlAfter
	 * @param bizInfo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public abstract List<PcDataExchange> getExcDataList(List list, String pid, String sendUnit,
			String sqlBefore, String sqlAfter, String bizInfo);
	/**
	 * 将待发送的数据转换成数据交互对象列,bean（必须有hibernate映射）
	 * @param list
	 * @param pid 接收单位
	 * @param sendUnit 发送单位
	 * @param sqlBefore
	 * @param sqlAfter
	 * @param bizInfo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public abstract PcDataExchange getExcData(Object obj, String pid, String sendUnit,
			String sqlBefore, String sqlAfter, String bizInfo);

	/**
	 * 发送待发送队列中所有数据，当天已发送失败过的数据不会重复发送
	 * @return 表成功状态
	 */
	public abstract boolean sendAllQueuedExchangeData();
	
	/**
	 * 发送参数列表中的数据，需要保证列表中数据的Pid，txGroup都相同
	 * @param exchangeList 交换的数据列表
	 * @return
	 */
	public abstract Map<String, String> sendExchangeData(List<PcDataExchange> exchangeList);
	
	/**
	 * 将列表中的数据交换对象保存到待发送队列中
	 * @param exchangeList 数据交互对象集合
	 */
	public abstract String addExchangeListToQueue(List<PcDataExchange> exchangeList) throws PCDataExchangeException;
	
	/**
	 * 将指定事务组的队列数据进行发送
	 * @param txIds 事务组编号数组
	 * @return
	 */
	public abstract String sendExchangeDataByTxId(String[] txIds);
	/**
	 * 附件和大对象(SGCC_ATTACH_LIST和SGCC_ATTACH_BLOB)进行交换
	 * @param fileLshArr 文件流水号数组(对应两个表中的FILE_LSH字段)
	 * @param receiveUnit 接收端PID
	 * @param sendUnit 发送端PID
	 * @param bizInfo 业务说明
	 * @param immediate 为真则立即发送，否则加入到发送队列
	 * @return
	 */
	public abstract boolean exchangeAttachments(String[] fileLshArr, String receiveUnit, String sendUnit, String bizInfo, boolean immediate);
	/**
	 * 发送指定的数据
	 * @param excHbm 
	 * @param afterSql 数据交互成功后在发送端执行的sql语句数组
	 * @return
	 */
	public abstract boolean sendExcData(PcDataExchange excHbm, String[] afterSql);
}
