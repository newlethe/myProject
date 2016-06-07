package com.sgepit.pcmis.dynamicview.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;

public interface PcDynamicDataService {

	public abstract List getDynamicDataByTimeAndPid(String orderBy,
			Integer start, Integer limit, HashMap map);
	
	public String checkLoginUserUnit(String unitid);
    
	public List getEntryBeanInfoByParams(String primaryKey,String pid, String uids,String tableName) throws DataAccessException;
	
	public List indexOfProgess(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params);

	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	
	
    List getAllStatements(String orderby, Integer start, Integer limit, HashMap params) throws BusinessException;
    
    /**
     * 通过pid, modName, sjType参数唯一确定一个PcAuditModuleScore对象是否存在, 如果存在修改并保存, 否则新增
     * @param pid  项目编号
     * @param modName  模块名称
     * @param state  审核状态
     * @param sjType 修改或创建时间
     * @throws BusinessException
     */
    void saveOrUpdateAudit(String pid, String modName, String state, String sjType) throws BusinessException;
    
    /**
     * 新增或者修改模块权重值
     * @param map  动态数据所有模块和权重值的集合
     * @param time 根据该字段判断是新增还是保存
     * @return ("1"--新增成功;"-1"--保存失败;"0"--修改成功)
     * @throws BusinessException
     */
    String saveOrUpdateWeights(HashMap map, String time) throws BusinessException;
    
    /*
     * 集团，集团二级公司可编辑用户修改所有模块审核状态后，通过数据交互将各模块审核状态，模块权重值发送到项目单位
     * cTime 月份
     * toUnit 接收目标的项目标号
     * fromUnit 发送放单位编号
     */
    void dateExchangeOfStateAndValue(String cTime, String toUnit, String fromUnit);
}