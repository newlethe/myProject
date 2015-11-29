package com.sgepit.pcmis.contract.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.contract.hbm.ConReportBean;

public interface PCContractService {
   List getConInfoGridStr(String orderby ,Integer start,Integer limit,HashMap params);
   List getConInfoManagerStr(String orderby ,Integer start,Integer limit,HashMap params);
   /**
    * 根据传入Pid 查找计算出已签订合同数目及合同执行金额
    * @param pid
    * @return 返回map key值约束为sigedConNum,conMoney
    */
   Map<String,String> getProjectSheduleByPid(String pid);
   
   Map<String,String> calculateMoneyByPid(String pid, String dateFormat, String sjType);
   /**
    * 根据传入参数生成合同动态台帐
    * @param treeName
    * @param parentId
    * @param params
    * @return
    */
   List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params);
   
   /**
	 * 合同动态台帐数据 treegrid
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param params
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-3-15
	 */
	public List<ConReportBean> buildConReportTreeGrid(String orderBy, Integer start, Integer limit, HashMap params);
}
