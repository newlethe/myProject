package com.sgepit.pmis.rlzj.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.pmis.rlzj.hbm.HrManAbility;
import com.sgepit.pmis.rlzj.hbm.HrManContract;
import com.sgepit.pmis.rlzj.hbm.HrManEducation;
import com.sgepit.pmis.rlzj.hbm.HrManFamily;
import com.sgepit.pmis.rlzj.hbm.HrManInfo;
import com.sgepit.pmis.rlzj.hbm.HrManTransfer;
import com.sgepit.pmis.rlzj.hbm.HrManWorkexep;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusM;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryM;
import com.sgepit.pmis.rlzj.hbm.KqDaysCompZb;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb;

/**
 * 系统管理业务逻辑接口.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
public interface RlzyMgmFacade {
	//个人信息
	List<RockUser> findUserByOrg(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid);
	List<RockUser> findUserByOrgNotInManInfo(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid);
	/**
	 * 通过组织机构ID过滤用户，带分页,资料电子文档密级
	 * @param orderby
	 * @param start
	 * @param limit
	 * @param orgid
	 * @return
	 */
	List<RockUser> findUserByOrgOther(String orderby, Integer start, Integer limit,
					HashMap<String, String> orgid);
	List<HrManInfo> findUserInfoByOrg(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid);
	void insertUserFamily(HrManFamily user) throws SQLException, BusinessException ;
	void insertUserAbility(HrManAbility user) throws SQLException, BusinessException ;
	void insertUserEducation(HrManEducation user) throws SQLException, BusinessException ;
	void insertUserWorkexep(HrManWorkexep user) throws SQLException, BusinessException ;
	boolean impUserInfoByUserIdStr(String userIdStr);
	boolean saveUserInfo(HrManInfo obj);
	boolean saveObject(Object obj,String className);
	void moveManInfo(String[] ida, String oldOrgid, String orgid,String move);
	void updateUserInfo(HrManInfo user) throws SQLException, BusinessException;
	void updateUserFamily(HrManFamily user) throws SQLException, BusinessException;
	void updateUserAbility(HrManAbility user) throws SQLException, BusinessException ;
	void updateUserEducation(HrManEducation user) throws SQLException, BusinessException ;
	void updateUserWorkexep(HrManWorkexep user) throws SQLException, BusinessException ;
	void deleteUserInfo(HrManInfo user) throws SQLException, BusinessException;
	void deleteUserFamily(HrManFamily user) throws SQLException, BusinessException;
	void deleteUserAbility(HrManAbility user) throws SQLException, BusinessException ;
	void deleteUserEducation(HrManEducation user) throws SQLException, BusinessException ;
	void deleteUserWorkexep(HrManWorkexep user) throws SQLException, BusinessException ;
	
	//合同管理添加
	void insertUserContract(HrManContract user) throws SQLException,BusinessException;
	void updateUserContract(HrManContract user)throws SQLException,BusinessException;
	void deleteUserContract(HrManContract user)throws SQLException,BusinessException;
	String checkUsercontract(String  personnum)throws SQLException,BusinessException;
	
	
	//考勤管理
	List<String> findSjListForKqDeptByDeptId(String deptId);
	KqDaysDeptZb findKqDeptZbByDeptIdAndSj(String deptId,String sj);
	boolean updateKqDaysDeptZb(KqDaysDeptZb hbm) throws SQLException, BusinessException;
	boolean updateKqDaysDeptZbById(String lsh, String status) throws SQLException, BusinessException;
	boolean updateKqDaysCompZb(KqDaysCompZb hbm) throws SQLException, BusinessException;
	boolean calcKqDaysTjData(KqDaysDeptZb zbHbm);
	boolean calcKqDaysTjDataByKey(String zbLsh);
	List<String> findSjListForKqAnnualleave(String userId);
	boolean makeKqAnnualleave(String sjType,String userId,String type);
	//薪酬管理
	List<String> findSjListForXcBaseUserByDeptId(String deptId);
	boolean makeUserXcBaseDefine(String sjType,String type);
	boolean deleteUserXcBaseDefineNotOnJob(String sjType);
	List<String> findSjListForXcSalary(String unitId);
	List<String> findSjListForXcSalaryD(String userId);
	HrXcSalaryM makeXcSalary(String sjType,String unitId,String type);
	boolean deleteXcSalary(String sjType,String unitId);
	boolean updateXcSalaryM(HrXcSalaryM hbmSalaryM);
	boolean calcXcSalaryTjData(HrXcSalaryM zbHbm);
	
	List<String> findSjListForXcBonus(String unitId);
	List<String> findSjListForXcBonusD(String unitId);
	HrXcBonusM makeXcBonus(String sjType,String unitId,String type);
	boolean deleteXcBonus(String sjType,String unitId);
	boolean updateXcBonusM(HrXcBonusM hbmBonusM);
	boolean updateXcBonusMById(String lsh, String status) throws SQLException, BusinessException ;
	boolean calcXcBonusTjData(HrXcBonusM zbHbm);
	
	String getBulidTreeJson(String sjType,String deptId);
	String getBulidTreeJsonForBonus(String sjType,String deptId);

	void  CalculAllExp();
	//人事工作提醒管理
	/**
	 * 根据时间获取提醒数据
	 * @param solar     阳历时间字符，8位，如：20110314
	 * @param lunar1st  阳历本日对应的阴历字符串，8位，如：20110314
	 * @param lunar1st  阳历本月第一天对应的阴历字符串，8位，如：20110314
	 * @param lunarFinal阳历本月最后一天对应得阴历字符串，8位，如：20110314
	 * @return
	 */
	public abstract String getRemindData(String solar,String lunar,String lunar1st,String lunarFinal);
	/**
	 * 根据类型获取过滤条件
	 * @param fltType
	 * @param solar
	 * @param lunar
	 * @param lunar1st
	 * @param lunarFinal
	 * @return
	 */
	public abstract String getRemindWherestr(String fltType,String solar,String lunar,String lunar1st,String lunarFinal);
	
	
	
	int CalWorkExp(String input);
	public abstract boolean saveTransfer(HrManTransfer transferHbm);
	
	
}
