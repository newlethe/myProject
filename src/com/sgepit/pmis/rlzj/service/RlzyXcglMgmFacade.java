package com.sgepit.pmis.rlzj.service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;

import org.dom4j.DocumentException;

import com.sgepit.pmis.rlzj.hbm.HrAccountSet;
import com.sgepit.pmis.rlzj.hbm.HrSalaryMaster;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateUser;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateView;
import com.sgepit.pmis.rlzj.hbm.HrSalaryType;

public interface RlzyXcglMgmFacade {

	public boolean validateName(HrSalaryType temp);
	public boolean saveSalType(HrSalaryType temp);
	public boolean deleteVerify(String uids, String pid);
	public boolean InsertTz(HrAccountSet hras);
	public String deleteTemplateByUids(String uids);
	public boolean getItemAndFormulaToTemplate(String[] zbSeqnoArr,String formula,String uids);
	public boolean getParamToTemplate(String[] uidsArr,String uids);
	public boolean insertUserToTemplateUser(String[] useridArr,String uids);
	public boolean deleteUserFromTemplateUser(String[] useridArr,String uids);
	public List<HrSalaryTemplateUser> findUserInfoByTemplate(String orderby, Integer start,
			Integer limit, HashMap<String, String> orgid);
	public List<String> getSjTypeListFromSalaryMaster(String unitId,String salaryType,String pid);
	public String saveTempFormula(String uids,String formula);
	public boolean saveTemp(HrSalaryTemplateView temp);
	public String saveSalaryMaster(HrSalaryMaster master);
	public String addDetailData(String userid, HrSalaryMaster master);
	public String deleteDetailData(String userid, String reportId);
	public HrSalaryMaster getSalaryMaster(String unitId, String sjType,String salaryType,String pid);
	public String deleteSalaryMaster(String unitId, String sjType,String salaryType,String pid);
	public String updateSalaryMaster(HrSalaryMaster master);
	public String getSalaryUserByReportId(String reportId);
	public String initDetailData(String temId, String unitid);
	/**
	 * 生成工资统计查询xgrid
	 * @param startSjType
	 * @param endSjType
	 * @param 
	 * @param s
	 * @param 
	 * @param s
	 * @return
	 */
	public String getSalaryStatisticXml(String startSjType, String endSjType,
			String deptIds[], String[] userIds, String[] itemIds,
			String[] typeIds, String[] userDetailItems,String pid);
	public ByteArrayOutputStream getExcelTem(String Xml) throws DocumentException;
	// 构造奖金汇总树
	public abstract String getBulidTreeJsonForBonus(String sjType, String deptId,String userBelongUnitid,String pid);
	/**
	 * 公司按部门奖金信息汇总,输出xgrid
	 */
	public String getBonusStatisticXml(String unitids[],String sjtype,String pid)throws Exception;

}
