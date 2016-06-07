package com.sgepit.pcmis.warn.service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRangeInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRoleInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRuleDutyperson;
import com.sgepit.pcmis.warn.hbm.PcWarnRules;
import com.sgepit.pcmis.warn.hbm.PcWarnSearchInfo;
import com.sgepit.pcmis.warn.hbm.UserBean;

public interface PCWarnService {
    public List buildTree(String treeName,String parentId,Map params);
    //保存预警规则
    public String savePCRules(PcWarnRules warnRules);
    //修改预警规则
    public String updatePCRules(PcWarnRules warnRules);
    //删除预警规则
    public String deletePCRulesById(String uids);
    //保存预警规则权限
    public String insertPcWarnrole(PcWarnRoleInfo pcWarnRoleInfo);
    //修改预警规则权限
    public String updatePcWarnrole(PcWarnRoleInfo pcWarnRoleInfo);
    //删除预警权限
    public String deletePcWarnrole(PcWarnRoleInfo pcWarnRoleInfo);
    //根据预警规则成成预警信息
    public void gengralWarnInfo();
    // 验证项目单位责任人唯一性
    public String vilidatePersonOnly(String moduleid,String userid,String uids);
    // 新增项目单位责任人
    public String addDutyPerson(PcWarnRuleDutyperson pcWarnRuleDutyperson);
    // 删除项目单位责任人
    public String deleteDutyPerson(String userid);
    
    public String addDoWithPersons(String dowithpersons, String searchpersons,String uids);
    //根据传入预警信息Id 查找预警责任人及其对应的树节点
    public String getDutyPersonAndTreeRootById(String uids);
    //获取用户列表共选择
    public List getUserlistBySql(String orderBy,Integer start ,Integer limit,HashMap params);
    //保存处理人及查询处理人
    public String saveDoWithPersonAndSearchPerson(UserBean userBean);
    //预警信息处理页面查看自己所能看到的预警信息
    public List getPcWarnInfoByUserid(String orderBy,Integer start,Integer limit,HashMap params);
    //分配人员自己处理
    public String dowithCommentsBySelf(PcWarnDowithInfo pcWarnDowithInfo);
    //查询人员填写查询意见
    public String searchCommentsBySelf(PcWarnSearchInfo pcWarnSearchInfo);
    // 通过传入用户Id 查找该用户所属单位下是否有项目单位及返回该用户所在项目单位编号
    public String calSendUserdoWithInfo(String userid);
    //其他人员选择处理人员和查询人员
    public String otherSaveDoWithPersonAndSearchPerson(UserBean userBean) throws BusinessException;
    //检查没有处理人员列表
    public List checkNotDoWithPersons(String warninfoid);
    //关闭预警信息
    public String closePcWarnInfo(PcWarnInfo pcWarnInfo);
    
    /*
     * 修改预警范围
     */
    public String updatePcWarnRange(PcWarnRangeInfo pcWarnRangeInfo);
    /**
     * 删除预警范围
     * @param pcWarnRangeInfo
     * @return
     */
    public String deletePcWarnRange(PcWarnRangeInfo pcWarnRangeInfo);
    /**
     * 新增预警范围
     * @param pcWarnRangeInfo
     * @return
     */
    public String insertPcWarnRange(PcWarnRangeInfo pcWarnRangeInfo);
    /**
     * 检查项目单位范围是否已存在
     * @param uids
     * @param projectname
     * @return
     */
    public String checkPcWarnRangeExist(String uids,String projectname,String warnRulesId);
    /**
     * 标记为已读
     * @param uids
     * @param userId
     */
    public void markRead(String uids,String userId);
    /**
     * 根据用户ID查找预警中药处理的及要查看的预警信息
     * @param userid
     * @return
     */
    public  Map<String,String> findWarnInfoNum(String userid);
    
    /**
     * 更具传入功能模块Id 查找该功能模块下所有的有链接的功能模块
     * @param moduleid
     * @return
     */
    public List  getModuleNameByother(String moduleid);
    /**
     * 根据传入的表名称及字段名称验证该字段是否为数字类型
     * @param tablename
     * @param columnName
     * @return
     */
    public String validateDataType(String tablename,String columnName);
}
