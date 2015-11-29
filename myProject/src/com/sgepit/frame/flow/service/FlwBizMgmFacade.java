package com.sgepit.frame.flow.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.poi.ss.usermodel.Workbook;

import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.webdynproService.export.ExcelPortException;

public interface FlwBizMgmFacade {
	/**
	 * 获取打印数据
	 * @param tabName 业务表名
	 * @param where   过滤条件
	 * @return
	 */
	public abstract ListOrderedMap getBizData(String tabName, String where);
	/**
	 * 删除流程实例时删除业务数据
	 * @param insid
	 * @return
	 */
	public abstract boolean deleteBizIns(String insid);
	/**
	 * 流程处理完毕时处理相关业务数据
	 * @param logid
	 * @return
	 */
	public abstract boolean finishBizData(String logid);
	/**
	 * 任务参数默认值获取
	 * @param businessName
	 * @param methodName
	 * @param param1
	 * @param param2
	 * @param param3
	 * @param param4
	 * @param param5
	 * @return
	 */
	public abstract String  getTaskParamValue(String businessName,String methodName,String param1,String param2,String param3,
			String param4,String param5);
	
	/**
	 * 重置流程处理状态
	 * 	使用位置，删除流程时，如果不删除流程业务数据，则设置业务数据的流程状态为新建(0);
	 * 
	 * @param logid			当前处理步骤的id
	 * @param billState		需要设置的流程状态
	 * @param pos			【暂时未用】需要更新的业务数据的位置； 0：全部；1：当前节点和已经处理节点；2：已经处理的节点不包括当前节点；
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-2-14
	 */
	public boolean resetDataBillstate(String logid, String billState, String pos);
	
	/**
	 * 流程中更新的业务数据状态，通过数据交换功能同步数据；
	 * @param logid	
	 * @param sql	业务数据更新sql
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-14
	 */
	public abstract String businessDataExchange(String logid, String sql);
	
	/**
	 * 向流程综合查询数据模板写入数据
	 * @param wb 工作簿
	 * @param orderBy 排序
	 * @param map1 查询条件
	 * @return Excel输出流
	 * @author pengy 2015-01-14
	 */
	public ByteArrayOutputStream fillDataToTaskViewExcel(Workbook wb, String orderBy, HashMap<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException;
	
}
