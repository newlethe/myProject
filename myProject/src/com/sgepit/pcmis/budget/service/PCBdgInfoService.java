package com.sgepit.pcmis.budget.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;

public interface PCBdgInfoService {
	/**
	 * 计算概算总金额,合同分摊总金额,及其差值
	 * @param orderby 传入的排序字段
	 * @param start 分页起始条目数
	 * @param limit 每页显示的最大数据条数
	 * @param params 传入的其他条件参数该参数是以Map<k,v> 形式传入
	 * @return
	 */
   List getBdgMainGridStr(String orderby ,Integer start,Integer limit,HashMap params);
   /**
    * 备用生成功能数菜单项
    * @param treeName
    * @param parentId
    * @param params
    * @return
    */
   List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params);
   /**
    * 概算信息管理页面首页 计算概算总金额,合同分摊总金额,二者差值,合同付款分摊总金额
    * 合同分摊总金额与合同付款分摊总金额插值
    * @param orderby 传入的排序字段
    * @param start  分页的起始条目数
    * @param limit  分页每页显示的最大条目数
    * @param params 传入的参数, 该传入参数是通过Map<k,v> 的方式传入 前台页面中数据格式定义方式
    * 如下：'pid`111;aaa`222' 即传入参数为 pid=111 aaa=222
    * @return
    */
   List getBdgInfoGridStr(String orderby ,Integer start,Integer limit,HashMap params);
   /**
    * 根据传入的Pid 查找计算出该项目单位概算执行完成百分比
    * @param pid
    * @return  返回值key约束bdgPercent
    */
   Map getProjectShedulePercentByPid(String pid);
   
   
   public List getBdgAppInfoByPidAndBdgId(String orderby ,Integer start,Integer limit,HashMap params);
   /**
    * 工资管理模块提供接口获取投资金额
    * @param pid 系统系统传入的项目单位PID
    * @param time time类型如果为2011年5月 则需要传入字符串'201105' 传入'20115' 无效
    * @return 返回结果按照建筑本年总额,建筑本月总额,设备本年总额,设备本月总额,安装本年总额
    * 安装本月总额额,其他本年总额,其他本月总额
    */
   public List getBdgInfoForInvestManagement(String pid,String time);
   /*
    * treegrid
    * 
    */
   public List  buildTreeGridNodeTree(String orderBy, Integer start, Integer limit, HashMap map);
   public String getJsonStrForTransToZLSByType(String type, String fileId,
		String fileTypes, String yjrName);
}
