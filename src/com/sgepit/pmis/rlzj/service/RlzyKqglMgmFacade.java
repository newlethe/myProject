package com.sgepit.pmis.rlzj.service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.DocumentException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.pmis.rlzj.dao.HrManContractDAO;
import com.sgepit.pmis.rlzj.dao.HrManDeptSetLogDAO;
import com.sgepit.pmis.rlzj.hbm.HrManAbility;
import com.sgepit.pmis.rlzj.hbm.HrManContract;
import com.sgepit.pmis.rlzj.hbm.HrManEducation;
import com.sgepit.pmis.rlzj.hbm.HrManFamily;
import com.sgepit.pmis.rlzj.hbm.HrManInfo;
import com.sgepit.pmis.rlzj.hbm.HrManTransfer;
import com.sgepit.pmis.rlzj.hbm.HrManWorkexep;
import com.sgepit.pmis.rlzj.hbm.HrSalaryMaster;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusM;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryM;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZbLog;

public interface RlzyKqglMgmFacade {

	public abstract HrManContractDAO getHrManContractDAO();

	public abstract void setHrManContractDAO(HrManContractDAO hrManContractDAO);

	public abstract SgccIniUnitDAO getSgccIniUnitDAO();

	public abstract PropertyCodeDAO getPropertyCodeDAO();

	public abstract HrManDeptSetLogDAO getManDeptSetLogDAO();

	public abstract void setPropertyCodeDAO(PropertyCodeDAO propertyCodeDAO);

	public abstract void setSgccIniUnitDAO(SgccIniUnitDAO sgccIniUnitDAO);

	public abstract void setSystemDao(SystemDao systemDao);

	public abstract SystemDao getSystemDao();

	public abstract void setManDeptSetLogDAO(HrManDeptSetLogDAO manDeptSetLogDAO);



	
	// 根据部门编号获取考勤时间
	public abstract List<String> findSjListForKqDeptByDeptId(String deptId);

	/**
	 * 获得部门选择combo下拉菜单字符串
	 * 
	 * @return
	 */
	public abstract String getUnitListBoxStr(String userBelongUnitId);

	public abstract String getUserListBoxStr(String[] unitIds,String userBelongUnitid);

	/**
	 * 获取到本月为止的sjtype字符串-考勤统计
	 * 
	 * @return
	 */
	public abstract String getSjTypeStrToNow(String startDate);
    
	public abstract boolean calcKqDaysTjDataByKey(String zbLsh);
	
	public abstract boolean updateXcSalaryM(HrXcSalaryM hbmSalaryM);


	public abstract Map<String, SgccIniUnit> getUnitMap();

	//构造考勤汇总树
	public abstract String getBulidTreeJson(String sjType, String deptId,String userBelongUnitid);

	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * 
	 * @param businessType
	 * @return
	 * @author: zhangh
	 * @createDate: 2011-4-21
	 */
	public abstract InputStream getExcelTemplate(String businessType);

     /*
      * 根据主键获取考勤记录信息
      * */
	public abstract KqDaysDeptZb findKqDeptZbByLsh(String lsh);


	/**
	 * 发送到领导审批，修改审批状态；
	 * @param lsh:报表流水号
	 * @param useraccount:领导账户名
	 * @param status:领导审批状态
	 * @return 
	 * @author: zhangh
	 * @createDate: 2011-5-6
	 */
	public abstract boolean uploadToLead(String lsh, String useraccount,
			String status, String userid);

	/**
	 * 根据部门编号和考勤时间获得考勤记录；
	 * @author: shangtw
	 * @createDate: 2011-11-03
	 */

	public abstract KqDaysDeptZb findKqDeptZbByDeptIdAndSj(String deptId,
			String sj);

	/**
	 * 更新考勤报表的部门人数
	 * 
	 * @param kqDaysDeptZb
	 * @return
	 * @author: Liuay
	 * @createDate: Sep 13, 2011
	 */
	public abstract String updateKqUserCount(KqDaysDeptZb kqDaysDeptZb);

	/**
	 * 修改考勤记录
	 * 
	 * @param kqDaysDeptZb
	 * @return
	 * @author: shangtw
	 * @createDate: Nov 03, 2011
	 */
	public abstract boolean updateKqDaysDeptZb(KqDaysDeptZb hbm)
			throws SQLException, BusinessException;

	/**
	 * 保存cell报表后计算考勤数据
	 * 
	 * @param kqDaysDeptZb
	 * @return
	 * @author: shangtw
	 * @createDate: Nov 03, 2011
	 */
	public abstract boolean calcKqDaysTjData(KqDaysDeptZb zbHbm);
	/**
	 * 考勤退回操作
	 * @param log:报表发送和退回记录
	 * @param status:退回状态
	 * @return 
	 * @author: shangtw
	 * @createDate: 2011-11-03
	 */
	public boolean backKqDeptZb(KqDaysDeptZbLog log,String status);
	public boolean updateKqDaysDeptZbById(String lsh, String status) throws SQLException, BusinessException;
	/**
	 * 考勤统计查询
	 * @return 
	 * @author: shangtw
	 * @createDate: 2011-11-07
	 */
	public String getKqStatXml(String startSjType, String endSjType, String[] deptIds, String[] userIds);	

	public boolean makeKqAnnualleave(String sjType,String userId,String type);
	public List<String> findSjListForKqAnnualleave(String userId);
	/**
	 * 加班统计保存
	 * @return 
	 * @author: shangtw
	 * @createDate: 2013-2-27
	 */
	public String[] saveOrUpdateOvertime(String nowsj,String pid,String deptid,String masterlsh);	
}

