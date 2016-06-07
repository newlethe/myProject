package com.sgepit.pmis.rlzj.service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.RockUser2dept;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.hbm.VProperty;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.pmis.rlzj.dao.HrManContractDAO;
import com.sgepit.pmis.rlzj.dao.HrManDeptSetLogDAO;
import com.sgepit.pmis.rlzj.hbm.HrManAbility;
import com.sgepit.pmis.rlzj.hbm.HrManContract;
import com.sgepit.pmis.rlzj.hbm.HrManDeptSetLog;
import com.sgepit.pmis.rlzj.hbm.HrManEducation;
import com.sgepit.pmis.rlzj.hbm.HrManFamily;
import com.sgepit.pmis.rlzj.hbm.HrManInfo;
import com.sgepit.pmis.rlzj.hbm.HrManInfoD;
import com.sgepit.pmis.rlzj.hbm.HrManTransfer;
import com.sgepit.pmis.rlzj.hbm.HrManWorkexep;
import com.sgepit.pmis.rlzj.hbm.HrXcBaseDefine;
import com.sgepit.pmis.rlzj.hbm.HrXcBaseModel;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusD;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusM;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusTjD;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryD;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryM;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryTjD;
import com.sgepit.pmis.rlzj.hbm.KqDaysCompZb;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb;
import com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb;

/**
 * 人力资源管理业务逻辑实现类.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
public class RlzyMgmImpl extends BaseMgmImpl implements RlzyMgmFacade {
	//过滤类型、描述、区间、时间字段、时间格式、是否生日、用工形式
	private final String[][] remindSort = {
			{"DayCovSign" ,"本日签订合同"   ,"D" ,"SIGNEDDATE" ,"yyyymmdd" ,"0" ,""},
			{"MonCovSign" ,"本月签订合同"   ,"M" ,"SIGNEDDATE" ,"yyyymm"   ,"0" ,""},
			{"DayCovDue"  ,"本日合同到期"   ,"D" ,"ENDDATE"    ,"yyyymmdd" ,"0" ,""},
			{"MonCovDue"  ,"本月合同到期"   ,"M" ,"ENDDATE"    ,"yyyymm"   ,"0" ,""},
			{"DayBth"     ,"本日过生日的"   ,"D" ,"BIRTHDAY"   ,"yyyymmdd" ,"1" ,"1"},
			{"MonBth"     ,"本月过生日的"   ,"M" ,"BIRTHDAY"   ,"yyyymmdd" ,"1" ,"1"},
			{"DayEnter"   ,"本日入职"      ,"D" ,"ENTRYDATE"  ,"yyyymmdd" ,"0" ,""},
			{"MonEnter"   ,"本月入职"      ,"M" ,"ENTRYDATE"  ,"yyyymm"   ,"0" ,""},
			{"DayLeave"   ,"本日离职"      ,"D" ,"LEFTDATE"   ,"yyyymmdd" ,"0" ,""},
			{"MonLeave"   ,"本月离职"      ,"M" ,"LEFTDATE"   ,"yyyymm"   ,"0" ,""},
			{"DayTrying"  ,"本日试用"      ,"D" ,"ENTRYDATE"  ,"yyyymmdd" ,"0" ,""},
			{"MonTrying"  ,"本月试用"      ,"M" ,"ENTRYDATE"  ,"yyyymm"   ,"0" ,""},
			{"DayTryed"   ,"本日试用到期"   ,"D" ,"ENDDATE"    ,"yyyymmdd" ,"0" ,"2"},
			{"MonTryed"   ,"本月试用到期的" ,"M" ,"ENDDATE"    ,"yyyymm"   ,"0" ,"2"}
	};
	
	private SystemDao systemDao;

	private SgccIniUnitDAO sgccIniUnitDAO;

	private PropertyCodeDAO propertyCodeDAO;

	private HrManDeptSetLogDAO manDeptSetLogDAO;
	private HrManContractDAO   hrManContractDAO;

	public HrManContractDAO getHrManContractDAO() {
		return hrManContractDAO;
	}

	public void setHrManContractDAO(HrManContractDAO hrManContractDAO) {
		this.hrManContractDAO = hrManContractDAO;
	}

	public SgccIniUnitDAO getSgccIniUnitDAO() {
		return sgccIniUnitDAO;
	}

	public PropertyCodeDAO getPropertyCodeDAO() {
		return propertyCodeDAO;
	}

	public HrManDeptSetLogDAO getManDeptSetLogDAO() {
		return manDeptSetLogDAO;
	}

	/**
	 * @param propertyCodeDAO
	 *            the propertyCodeDAO to set
	 */
	public void setPropertyCodeDAO(PropertyCodeDAO propertyCodeDAO) {
		this.propertyCodeDAO = propertyCodeDAO;
	}

	/**
	 * @param sgccIniUnitDAO
	 *            the sgccIniUnitDAO to set
	 */
	public void setSgccIniUnitDAO(SgccIniUnitDAO sgccIniUnitDAO) {
		this.sgccIniUnitDAO = sgccIniUnitDAO;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}

	public SystemDao getSystemDao() {
		return systemDao;
	}

	public void setManDeptSetLogDAO(HrManDeptSetLogDAO manDeptSetLogDAO) {
		this.manDeptSetLogDAO = manDeptSetLogDAO;
	}

	public static RlzyMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (RlzyMgmImpl) ctx.getBean("rlzyMgm");
	}

	public List<RockUser> findUserByOrg(String orderby, Integer start,
			Integer limit, HashMap<String, String> orgid) {

		String unitType = (String) orgid.get("unitType");
		String propertyName = "unitid";
		Object value = orgid.get("posid");
		List<RockUser> users = new ArrayList();
		if (value == null) {
			users = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), "", orderby, start,
					limit);
		} else {
			if (unitType.equals("0")) {
				propertyName = "deptId";
			} else if (unitType.equals("9") || unitType.equals("1")) {
				propertyName = "posid";
			} else if (unitType.equals("2")) {
				propertyName = "posid";
			} else {
				propertyName = "unitid";
			}

			users = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), propertyName, value,
					orderby, start, limit);
		}

		return users;
	}

	public List<RockUser> findUserByOrgNotInManInfo(String orderby,
			Integer start, Integer limit, HashMap<String, String> orgid) {

		String unitType = (String) orgid.get("unitType");
		String propertyName = "unitid";
		Object value = orgid.get("posid");
		List<RockUser> users = new ArrayList();
		if (value == null) {
			users = this.systemDao.findByWhere(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), "", orderby, start,
					limit);
		} else {
			if (unitType.equals("0")) {
				propertyName = "deptId";
			} else if (unitType.equals("9") || unitType.equals("1")) {
				propertyName = "posid";
			} else if (unitType.equals("2")) {
				propertyName = "posid";
			} else {
				propertyName = "unitid";
			}

			users = this.systemDao.findByProperty(BusinessConstants.SYS_PACKAGE
					.concat(BusinessConstants.SYS_USER), propertyName, value,
					orderby, start, limit);
			for (RockUser hbm : users) {
				List<HrManInfo> manInfoList = new ArrayList();
				manInfoList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrManInfo", "userid = '"
								+ hbm.getUserid() + "'", orderby, start, limit);
				if (manInfoList.size() > 0)
					users.remove(hbm);
			}
		}

		return users;
	}

	/*
	 * 通过组织机构ID过滤用户，带分页,资料电子文档密级 (non-Javadoc)
	 * 
	 * @see com.sgepit.frame.sysman.service.SystemMgmFacade#findUserByOrgOther(java.lang.String,
	 *      java.lang.Integer, java.lang.Integer, java.util.HashMap)
	 */
	public List<RockUser> findUserByOrgOther(String orderby, Integer start,
			Integer limit, HashMap<String, String> orgid) {
		StringBuffer hql = new StringBuffer(
				"from RockUser u, RockUser2dept o where u.userid = o.userid and o.DeptId='");
		hql.append((String) orgid.get("orgid"));
		hql.append("'");
		hql.append(" and u.userid not in(");
		hql.append((String) orgid.get("userid"));
		hql.append(")");
		if (orderby != null) {
			hql.append(" order by u.");
			hql.append(orderby);
		}

		List list = this.systemDao.findByHql(hql.toString());
		List<RockUser> users = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			Object[] obj = (Object[]) list.get(i);
			for (int j = 0; j < obj.length; j++) {
				users.add((RockUser) obj[0]);
			}
		}
		return users;
	}

	public List<HrManInfo> findUserInfoByOrg(String orderby, Integer start,
			Integer limit, HashMap<String, String> orgid) {

		String unitType = (String) orgid.get("unitType");
		String propertyName = "unitid";
		Object value = orgid.get("posid");
		List<HrManInfo> users = new ArrayList();
		if (value == null) {
			users = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrManInfo", "", orderby, start,
					limit);
		} else {
			propertyName = "posid";
//			users = this.systemDao.findByProperty(
//					"com.sgepit.pmis.rlzj.hbm.HrManInfo", propertyName, value,
//					orderby, start, limit);
			users = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrManInfo", "posid in ("+value+")", orderby, start,
					limit);
		}

		return users;
	}

	public void insertUserFamily(HrManFamily user) throws SQLException,
			BusinessException {
		String personnum = user.getPersonnum();
		if (personnum != null && !personnum.equals("")) {
			user.setSeqnum(UUIDGenerator.getNewID());
			user.setPersonnum(personnum);
			this.systemDao.insert(user);
		}
	}

	public void insertUserAbility(HrManAbility user) throws SQLException,
			BusinessException {
		String personnum = user.getPersonnum();
		if (personnum != null && !personnum.equals("")) {
			user.setSeqnum(UUIDGenerator.getNewID());
			user.setPersonnum(personnum);
			this.systemDao.insert(user);
		}
	}

	public void insertUserEducation(HrManEducation user) throws SQLException,
			BusinessException {
		String personnum = user.getPersonnum();
		if (personnum != null && !personnum.equals("")) {
			user.setSeqnum(UUIDGenerator.getNewID());
			user.setPersonnum(personnum);
			this.systemDao.insert(user);
		}
	}

	public void insertUserWorkexep(HrManWorkexep user) throws SQLException,
			BusinessException {
		String personnum = user.getPersonnum();
		if (personnum != null && !personnum.equals("")) {
			user.setSeqnum(UUIDGenerator.getNewID());
			user.setPersonnum(personnum);
			this.systemDao.insert(user);
		}
	}

	public boolean impUserInfoByUserIdStr(String userIdStr) {
		boolean rtn = true;
		try {
			List<RockUser> rockUserList = new ArrayList();
			String[] userIdArr = userIdStr.split(",");
			for (int i = 0; i < userIdArr.length; i++) {
				RockUser rockUser = (RockUser) this.systemDao.findById(
						BusinessConstants.SYS_PACKAGE
								.concat(BusinessConstants.SYS_USER),
						userIdArr[i]);
				if (rockUser != null) {
					HrManInfo hbm = (HrManInfo) systemDao.findById(
							"com.sgepit.pmis.rlzj.hbm.HrManInfo", rockUser
									.getUserid());
					if (hbm == null)
						hbm = new HrManInfo(rockUser.getUserid());
					if (rockUser.getRealname() != null)
						hbm.setRealname(rockUser.getRealname());
					if (rockUser.getSex() != null)
						hbm.setSex(rockUser.getSex());
					String posid = rockUser.getDeptId();
					if (posid != null) {
						hbm.setPosid(posid);
						List<SgccIniUnit> unitList = systemDao.findByProperty(
								"com.sgepit.frame.sysman.hbm.SgccIniUnit",
								"unitid", posid);
						if (unitList != null && unitList.size() > 0) {
							SgccIniUnit unitHbm = (SgccIniUnit) unitList.get(0);
							String posname = unitHbm == null ? "" : unitHbm
									.getUnitname();
							if (!posname.equals(""))
								hbm.setPosname(posname);
						}
					}
					String gwid = rockUser.getPosid();
					if (gwid != null) {
						hbm.setOrgid(gwid);
						
						
						List<SgccIniUnit> unitList = systemDao.findByWhere("com.sgepit.frame.sysman.hbm.SgccIniUnit", 
								"UNITID='"+gwid+"' and unit_type_id='9'");
						if (unitList != null && unitList.size() > 0) {
							SgccIniUnit unitHbm = (SgccIniUnit) unitList.get(0);
							String orgname = unitHbm == null ? "" : unitHbm
									.getUnitname();
							if (!orgname.equals(""))
								hbm.setOrgname(orgname);
						}
					}
					if (rockUser.getPhone() != null)
						hbm.setPhone(rockUser.getPhone());
					if (rockUser.getMobile() != null)
						hbm.setMobile(rockUser.getMobile());
					if (rockUser.getEmail() != null)
						hbm.setEmail(rockUser.getEmail());
					if (rockUser.getHomeaddress() != null)
						hbm.setHomeaddress(rockUser.getHomeaddress());
					if (rockUser.getUserstate() != null)
						hbm.setStatus(rockUser.getUserstate());
					String onthejob = hbm.getOnthejob();
					if (onthejob == null || onthejob.equals(""))
						hbm.setOnthejob("1");
					systemDao.saveOrUpdate(hbm);
				}
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean saveUserInfo(HrManInfo obj) {
		boolean rtn = true;
		try {
			HrManInfo hbm = (HrManInfo) obj;
			if(hbm.getMemoc1()==null||"null".equals(hbm.getMemoc1()))
				hbm.setMemoc1("");
			if(hbm.getMemoc3()==null||"null".equals(hbm.getMemoc3()))
				hbm.setMemoc3("");
			systemDao.saveOrUpdate(hbm);
			RockUser rockUser = (RockUser) systemDao.findById(
					"com.sgepit.frame.sysman.hbm.RockUser", hbm.getUserid());
			if (rockUser != null) {
				String oldDeptId = rockUser.getDeptId();
				BeanUtils.copyProperties(hbm, rockUser);
				String orgid = hbm.getOrgid();
				if (orgid != null && !orgid.trim().equals("")) {
					rockUser.setUnitid(orgid);
				}
				Map<String, String> infoMap = getOrgInfoById2(orgid);
				String unitType = infoMap.get("type");
				if (unitType.equals("0")) {
					rockUser.setDeptId(orgid);
				} else if (unitType.equals("9") || unitType.equals("1")) {
					rockUser.setDeptId(infoMap.get("dept"));
				} else {
					rockUser.setDeptId(orgid);
				}
				this.systemDao.saveOrUpdate(rockUser);

				// 用户部门修改日志
				createHrManDeptSetLog(rockUser, oldDeptId);
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean saveObject(Object obj, String className) {
		boolean rtn = true;
		try {
			Object hbm = Class.forName(className);
			org.apache.commons.beanutils.BeanUtils.copyProperties(hbm, obj);
			systemDao.saveOrUpdate(hbm);
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	@SuppressWarnings("unchecked")
	public void moveManInfo(String[] ida, String oldOrgid, String orgid,
			String move) {
		for (int i = 0; i < ida.length; i++) {
			Map<String, String> infoMap = getOrgInfoById2(orgid);
			HrManInfo hrManInfo = (HrManInfo) systemDao.findById(
					"com.sgepit.pmis.rlzj.hbm.HrManInfo", ida[i]);
			hrManInfo.setPosid(orgid);
			String unitType = infoMap.get("type");
			hrManInfo.setOrgid(orgid);
			this.systemDao.saveOrUpdate(hrManInfo);

			// 同步更新RockUser
			RockUser user = (RockUser) this.systemDao.findBeanByProperty(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_USER), "userid",
					ida[i]);
			if (user != null) {
				BeanUtils.copyProperties(hrManInfo, user);
				if (hrManInfo.getOrgid() != null
						&& !hrManInfo.getOrgid().trim().equals("")) {
					user.setUnitid(hrManInfo.getOrgid());
				}
				if (unitType.equals("0")) {
					user.setDeptId(orgid);
				} else if (unitType.equals("9") || unitType.equals("1")) {
					user.setDeptId(infoMap.get("dept"));
				} else {
					user.setDeptId(orgid);
				}
				this.systemDao.saveOrUpdate(user);

				// 用户部门修改日志
				createHrManDeptSetLog(user, oldOrgid);
			}

			List<RockUser2dept> list = this.systemDao.findByWhere(
					BusinessConstants.SYS_PACKAGE
							.concat(BusinessConstants.SYS_USERORG), "userid='"
							+ ida[i] + "'");
			this.systemDao.deleteAll(list);
			RockUser2dept userorg = new RockUser2dept();
			userorg.setUserid(ida[i]);
			userorg.setGwId(orgid);
			userorg.setDeptId(user.getDeptId());
			this.systemDao.insert(userorg);
		}
	}

	private void createHrManDeptSetLog(RockUser user, String oldDeptId) {
		HrManDeptSetLog hbm = new HrManDeptSetLog();
		hbm.setLsh(UUIDGenerator.getNewID());
		hbm.setUserid(user.getUserid());
		hbm.setUnitId(user.getUnitid());
		hbm.setDeptId(user.getDeptId());
		hbm.setPostId(user.getPosid());
		hbm.setOldDeptId(oldDeptId);
		hbm.setSetDate(DateUtil.getSystemDateTime());
		hbm.setSjType(DateUtil.getSystemDateTimeStr("yyyyMM"));
		manDeptSetLogDAO.save(hbm);
	}

	public void updateUserInfo(HrManInfo user) throws SQLException,
			BusinessException {

		HrManInfo userRtn = user;
		if (userRtn != null) {
			this.systemDao.saveOrUpdate(userRtn);
			RockUser rockUser = (RockUser) systemDao.findById(
					"com.sgepit.frame.sysman.hbm.RockUser", user.getUserid());
			if (rockUser != null) {
				String oldDeptId = rockUser.getDeptId();
				BeanUtils.copyProperties(user, rockUser);
				String orgid = user.getOrgid();
				if (orgid != null && !orgid.trim().equals("")) {
					rockUser.setUnitid(orgid);
				}
				Map<String, String> infoMap = getOrgInfoById2(orgid);
				String unitType = infoMap.get("type");
				if (unitType.equals("0")) {
					rockUser.setDeptId(orgid);
				} else if (unitType.equals("9") || unitType.equals("1")) {
					rockUser.setDeptId(infoMap.get("dept"));
				} else {
					rockUser.setDeptId(orgid);
				}
				this.systemDao.saveOrUpdate(rockUser);

				// 用户部门修改日志
				createHrManDeptSetLog(rockUser, oldDeptId);
			}
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	public void updateUserFamily(HrManFamily user) throws SQLException,
			BusinessException {

		HrManFamily userRtn = user;
		if (userRtn != null) {
			this.systemDao.saveOrUpdate(userRtn);
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	public void updateUserAbility(HrManAbility user) throws SQLException,
			BusinessException {

		HrManAbility userRtn = user;
		if (userRtn != null) {
			this.systemDao.saveOrUpdate(userRtn);
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	public void updateUserEducation(HrManEducation user) throws SQLException,
			BusinessException {

		HrManEducation userRtn = user;
		if (userRtn != null) {
			this.systemDao.saveOrUpdate(userRtn);
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	public void updateUserWorkexep(HrManWorkexep user) throws SQLException,
			BusinessException {

		HrManWorkexep userRtn = user;
		if (userRtn != null) {
			this.systemDao.saveOrUpdate(userRtn);
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
	}

	public void deleteUserInfo(HrManInfo user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
		//查看是否有工作经历
		List listExp=systemDao.findByProperty(HrManWorkexep.class.getName(), "personnum", user.getUserid());
	  if(listExp!=null){
		  systemDao.deleteAll(listExp);
	  }
		//删除教育培训情况
	  List listEdu=systemDao.findByProperty(HrManEducation.class.getName(), "personnum", user.getUserid());
	   if(listEdu!=null)
		   systemDao.deleteAll(listEdu);
	   
	   //删除家庭成员
	   List listFam=systemDao.findByProperty(HrManFamily.class.getName(), "personnum", user.getUserid());
	    if(listFam!=null)
	     systemDao.deleteAll(listFam);
	   //删除主要技能
	    List listAb=systemDao.findByProperty(HrManAbility.class.getName(), "personnum", user.getUserid());
	   if(listAb!=null)
		   systemDao.deleteAll(listAb);
	   
	   List listCon=systemDao.findByProperty(HrManContract.class.getName(), "personnum", user.getUserid());
	     if(listCon!=null)
	    	 systemDao.deleteAll(listCon);
	
	}

	public void deleteUserFamily(HrManFamily user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
	}

	public void deleteUserAbility(HrManAbility user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
	}

	public void deleteUserEducation(HrManEducation user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
	}

	public void deleteUserWorkexep(HrManWorkexep user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
	}

	private Map<String, String> getOrgInfoById(String unitid) {
		SgccIniUnit org = (SgccIniUnit) this.systemDao
				.findBeanByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG), "unitid", unitid);

		Map<String, String> map = new HashMap<String, String>();
		if (org != null) {
			if (unitid.equals(Constant.DefaultOrgRootID)) {
				map.put("unit", unitid);
				map.put("dept", unitid);
			} else {
				map.put("unit", org.getAttachUnitid());
				map.put("dept", org.getUpunit());
			}

			map.put("type", org.getUnitTypeId());
		}

		return map;

	}

	private Map<String, String> getOrgInfoById2(String unitid) {
		SgccIniUnit org = (SgccIniUnit) this.systemDao
				.findBeanByProperty(BusinessConstants.SYS_PACKAGE
						.concat(BusinessConstants.SYS_ORG), "unitid", unitid);

		Map<String, String> map = new HashMap<String, String>();
		if (org != null) {
			if (unitid.equals(Constant.DefaultOrgRootID)) {
				map.put("unit", unitid);
				map.put("dept", unitid);
			} else {
				map.put("unit", unitid);
				map.put("dept", org.getUpunit());
			}

			map.put("type", org.getUnitTypeId());
		}

		return map;

	}

	// 考勤管理

	public List<String> findSjListForKqDeptByDeptId(String deptId) {
		List<String> monthList = new ArrayList<String>();
		List<KqDaysDeptZb> kqDaysDeptZbList = new ArrayList<KqDaysDeptZb>();
		if (!deptId.equals(Constant.DefaultOrgRootID))
			kqDaysDeptZbList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb", "dept_id = '"
							+ deptId + "'", "sj_type desc");
		else
			kqDaysDeptZbList = this.systemDao
					.findByWhere("com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb", "",
							"sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM");
		if (kqDaysDeptZbList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (kqDaysDeptZbList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < kqDaysDeptZbList.size(); i++) {
				String nextSjType = kqDaysDeptZbList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	public KqDaysDeptZb findKqDeptZbByDeptIdAndSj(String deptId, String sj) {
		KqDaysDeptZb rtn = new KqDaysDeptZb();

		if (deptId != null && !deptId.trim().equals("") && sj != null
				&& !sj.trim().equals("")) {
			List<KqDaysDeptZb> kqDaysDeptZbList = new ArrayList<KqDaysDeptZb>();
			kqDaysDeptZbList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb", "dept_id = '"
							+ deptId + "' and sj_type = '" + sj + "'",
					"sj_type");
			if (kqDaysDeptZbList.size() != 0) {
				rtn = kqDaysDeptZbList.get(0);
			} else {
				rtn.setLsh(UUIDGenerator.getNewID());
				rtn.setDeptId(deptId);
				rtn.setSjType(sj);
				rtn.setUnitId(deptId);
				rtn.setStatus("0");
				rtn.setBillStatus("0");
				rtn.setCreateDate(DateUtil.getSystemDateTime());
				rtn.setLatestDate(DateUtil.getSystemDateTime());
				SgccIniUnit unit = getUnitMap().get(deptId);
				if (unit != null) {
					rtn.setTitle(unit.getUnitname() + sj + "月考勤填报");
				}
				systemDao.insert(rtn);
			}
		}
		return rtn;
	}

	public boolean updateKqDaysDeptZb(KqDaysDeptZb hbm) throws SQLException,
			BusinessException {
		boolean rtn = true;
		if (hbm != null) {
			hbm.setLatestDate(DateUtil.getSystemDateTime());
			this.systemDao.saveOrUpdate(hbm);
		} else {
			// 用户名被占用
			throw new BusinessException("修改考勤失败！");
		}
		return rtn;
	}

	public boolean updateKqDaysDeptZbById(String lsh, String status)
			throws SQLException, BusinessException {
		boolean rtn = true;
		if (lsh != null) {
			List<KqDaysDeptZb> kqDaysDeptZbList = (List<KqDaysDeptZb>) this.systemDao
					.findByWhere("com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb",
							"lsh = '" + lsh + "'");
			String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM");
			if (kqDaysDeptZbList.size() != 0) {
				KqDaysDeptZb hbm = kqDaysDeptZbList.get(0);
				hbm.setLatestDate(DateUtil.getSystemDateTime());
				hbm.setStatus(status);
				this.systemDao.saveOrUpdate(hbm);
			} else {
				throw new BusinessException("修改考勤失败！");
			}
		} else {
			// 用户名被占用
			throw new BusinessException("修改考勤失败！");
		}
		return rtn;
	}

	public boolean updateKqDaysCompZb(KqDaysCompZb hbm) throws SQLException,
			BusinessException {
		boolean rtn = true;
		if (hbm != null) {
			hbm.setLatestDate(DateUtil.getSystemDateTime());
			this.systemDao.saveOrUpdate(hbm);
		} else {
			// 用户名被占用
			throw new BusinessException("修改考勤失败！");
		}
		return rtn;
	}

	public boolean calcKqDaysTjData(KqDaysDeptZb zbHbm) {
		boolean rtn = true;
		try {
			String zbLsh = zbHbm.getLsh();

			// 得到每个员工每种考勤类型的单条记录
			String sql = "select masterlsh,substr(sj_type,0,6),unit_id,val1 from kq_days_dept_xb "
					+ " where masterlsh = '"
					+ zbLsh
					+ "' and val1 is not null and val1 <> '0' "
					+ " group by masterlsh,substr(sj_type,0,6),unit_id,val1";
			List kqDaysDeptXbList = this.systemDao.getDataAutoCloseSes(sql);

			// List<KqDaystjDeptXb> kqDaystjDeptXbList = new ArrayList();

			// 清除原有相同流水号的记录
			if (kqDaysDeptXbList.size() > 0) {
				List delList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb",
						"masterlsh = '" + zbLsh + "'");
				this.systemDao.deleteAll(delList);
			}

			List<PropertyCode> codeList = getCodeValue("考勤类别");
			// 考勤时间段对应系数列表
			List<PropertyCode> shiftCodeList = getCodeValue("考勤时间段");
			// 存放各指标对应的次数乘数
			Map<String, Double> zbCountMap = new HashMap<String, Double>();
			for (PropertyCode code : shiftCodeList) {

				Double times;
				try {
					times = Double.valueOf(code.getDetailType());
				} catch (Exception e) {
					times = 1.0;
				}
				zbCountMap.put(code.getPropertyName(), times);

			}

			// 遍历每个员工的记录
			for (int i = 0; i < kqDaysDeptXbList.size(); i++) {
				Object[] rs = (Object[]) kqDaysDeptXbList.get(i);
				String sj = rs[1].toString();
				String unitid = rs[2].toString();
				String val = rs[3] == null ? "0" : rs[3].toString();

				// 查找当前员工当前考勤类型不同指标的记录集合
				String sqlCurEmp = "select count(val1), zb_seqno from kq_days_dept_xb t where substr(t.sj_type, 0, 6) = '"
						+ sj
						+ "' and unit_id = '"
						+ unitid
						+ "' and masterlsh='"
						+ zbLsh
						+ "' and val1 = '"
						+ val
						+ "' group by zb_seqno";
				List<Object[]> curEmpList = systemDao
						.getDataAutoCloseSes(sqlCurEmp);

				// 考勤天数
				BigDecimal totalDay = new BigDecimal(0);
				for (Object[] empStat : curEmpList) {
					String kqType = empStat[1].toString(); // 指标类型(上午,下午...)
					Double times = zbCountMap.get(kqType);
					if (times == null)
						times = 1.0;
					totalDay = totalDay.add(new BigDecimal(empStat[0]
							.toString()).multiply(new BigDecimal(times)));
				}

				if (!val.equals("0")) {
					// 将相应的符号变成考勤类型（“出勤”， “病假”...）
					String zbSeqno = val;
					for (int j = 0; j < codeList.size(); j++) {
						String pname = codeList.get(j).getPropertyName();
						if (pname.indexOf(zbSeqno) >= 0) {
							zbSeqno = codeList.get(j).getPropertyCode();
							break;
						}
					}
					// String numStr = "2";
					/*
					 * if(val.equals("√")){ zbSeqno = ("出勤"); }else
					 * if(val.equals("△")){ zbSeqno = ("出差"); }else
					 * if(val.equals("×")){ zbSeqno = ("旷工"); }else
					 * if(val.equals("+")){ zbSeqno = ("事假"); }else
					 * if(val.equals("▲")){ zbSeqno = ("病假"); }else
					 * if(val.equals("※")){ zbSeqno = ("迟到早退"); }else
					 * if(val.equals("○")){ zbSeqno = ("年休"); }else
					 * if(val.equals("◎")){ zbSeqno = ("探亲"); }else
					 * if(val.equals("☆")){ zbSeqno = ("产假"); }else
					 * if(val.equals("★")){ zbSeqno = ("婚假"); }else
					 * if(val.equals("▽")){ zbSeqno = ("工伤"); }else
					 * if(val.equals("□")){ zbSeqno = ("丧假"); }else
					 * if(val.equals("■")){ zbSeqno = ("晚班"); numStr = "1";
					 * }else if(val.equals("◆")){ zbSeqno = ("调休"); }else
					 * if(val.equals("◇")){ zbSeqno = ("节假日加班"); }else
					 * if(val.equals("●")){ zbSeqno = ("休息日加班"); }
					 */

					KqDaystjDeptXb daystjXbHbm = null;
					List<KqDaystjDeptXb> tjXbList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb",
							"masterlsh = '" + zbLsh + "' and sj_type = '" + sj
									+ "' and unit_id = '" + unitid
									+ "' and zb_seqno = '" + zbSeqno + "'");
					if (tjXbList.size() > 0)
						daystjXbHbm = tjXbList.get(0);
					else
						daystjXbHbm = new KqDaystjDeptXb(UUIDGenerator
								.getNewID(), zbLsh, sj, unitid);
					daystjXbHbm.setVal1(totalDay.toString());
					daystjXbHbm.setZbSeqno(zbSeqno);
					systemDao.saveOrUpdate(daystjXbHbm);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rtn = false;
		}
		return rtn;
	}

	public boolean calcKqDaysTjDataByKey(String zbLsh) {
		boolean rtn = true;
		try {
			// 得到每个员工每种考勤类型的单条记录
			String sql = "select masterlsh,substr(sj_type,0,6),unit_id,val1 from kq_days_dept_xb "
					+ " where masterlsh = '"
					+ zbLsh
					+ "' and val1 is not null and val1 <> '0' "
					+ " group by masterlsh,substr(sj_type,0,6),unit_id,val1";
			List kqDaysDeptXbList = this.systemDao.getDataAutoCloseSes(sql);

			// List<KqDaystjDeptXb> kqDaystjDeptXbList = new ArrayList();

			// 清除原有记录,重新统计
			if (kqDaysDeptXbList.size() > 0) {
				List delList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb",
						"masterlsh = '" + zbLsh + "'");
				this.systemDao.deleteAll(delList);
			}

			List<PropertyCode> codeList = getCodeValue("考勤类别");
			// 考勤时间段对应系数列表
			List<PropertyCode> shiftCodeList = getCodeValue("考勤时间段");
			// 存放各指标对应的次数乘数
			Map<String, Double> zbCountMap = new HashMap<String, Double>();
			for (PropertyCode code : shiftCodeList) {

				Double times;
				try {
					times = Double.valueOf(code.getDetailType());
				} catch (Exception e) {
					times = 1.0;
				}
				zbCountMap.put(code.getPropertyName(), times);

			}

			// 遍历每个员工的记录
			for (int i = 0; i < kqDaysDeptXbList.size(); i++) {
				Object[] rs = (Object[]) kqDaysDeptXbList.get(i);
				String sj = rs[1].toString();
				String unitid = rs[2].toString();
				String val = rs[3] == null ? "0" : rs[3].toString();

				// 查找当前员工当前考勤类型不同指标的记录集合
				String sqlCurEmp = "select count(val1), zb_seqno from kq_days_dept_xb t where substr(t.sj_type, 0, 6) = '"
						+ sj
						+ "' and unit_id = '"
						+ unitid
						+ "' and masterlsh='"
						+ zbLsh
						+ "' and val1 = '"
						+ val
						+ "' group by zb_seqno";
				List<Object[]> curEmpList = systemDao
						.getDataAutoCloseSes(sqlCurEmp);

				// 考勤天数
				BigDecimal totalDay = new BigDecimal(0);
				for (Object[] empStat : curEmpList) {
					String kqType = empStat[1].toString(); // 指标类型(上午,下午...)
					Double times = zbCountMap.get(kqType);
					if (times == null)
						times = 1.0;
					totalDay = totalDay.add(new BigDecimal(empStat[0]
							.toString()).multiply(new BigDecimal(times)));
				}

				if (!val.equals("0")) {
					// 将相应的符号变成考勤类型（“出勤”， “病假”...）
					String zbSeqno = val;
					for (int j = 0; j < codeList.size(); j++) {
						String pname = codeList.get(j).getPropertyName();
						if (pname.indexOf(zbSeqno) >= 0) {
							zbSeqno = codeList.get(j).getPropertyCode();
							break;
						}
					}
					// String numStr = "2";
					/*
					 * if(val.equals("√")){ zbSeqno = ("出勤"); }else
					 * if(val.equals("△")){ zbSeqno = ("出差"); }else
					 * if(val.equals("×")){ zbSeqno = ("旷工"); }else
					 * if(val.equals("+")){ zbSeqno = ("事假"); }else
					 * if(val.equals("▲")){ zbSeqno = ("病假"); }else
					 * if(val.equals("※")){ zbSeqno = ("迟到早退"); }else
					 * if(val.equals("○")){ zbSeqno = ("年休"); }else
					 * if(val.equals("◎")){ zbSeqno = ("探亲"); }else
					 * if(val.equals("☆")){ zbSeqno = ("产假"); }else
					 * if(val.equals("★")){ zbSeqno = ("婚假"); }else
					 * if(val.equals("▽")){ zbSeqno = ("工伤"); }else
					 * if(val.equals("□")){ zbSeqno = ("丧假"); }else
					 * if(val.equals("■")){ zbSeqno = ("晚班"); numStr = "1";
					 * }else if(val.equals("◆")){ zbSeqno = ("调休"); }else
					 * if(val.equals("◇")){ zbSeqno = ("节假日加班"); }else
					 * if(val.equals("●")){ zbSeqno = ("休息日加班"); }
					 */

					KqDaystjDeptXb daystjXbHbm = null;
					List<KqDaystjDeptXb> tjXbList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb",
							"masterlsh = '" + zbLsh + "' and sj_type = '" + sj
									+ "' and unit_id = '" + unitid
									+ "' and zb_seqno = '" + zbSeqno + "'");
					if (tjXbList.size() > 0)
						daystjXbHbm = tjXbList.get(0);
					else
						daystjXbHbm = new KqDaystjDeptXb(UUIDGenerator
								.getNewID(), zbLsh, sj, unitid);
					daystjXbHbm.setVal1(totalDay.toString());
					daystjXbHbm.setZbSeqno(zbSeqno);
					systemDao.saveOrUpdate(daystjXbHbm);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rtn = false;
		}
		return rtn;
	}

	public List<String> findSjListForKqAnnualleave(String deptId) {
		List<String> monthList = new ArrayList<String>();
		List<HrManInfoD> hrManInfoDList = new ArrayList<HrManInfoD>();
		if (!deptId.equals(Constant.DefaultOrgRootID))
			hrManInfoDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrManInfoD", "unitId = '"
							+ deptId + "'", "sj_type desc");
		else
			hrManInfoDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrManInfoD", "", "sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyy");
		if (hrManInfoDList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrManInfoDList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrManInfoDList.size(); i++) {
				String nextSjType = hrManInfoDList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	// 计算天数
	private int getDaysBetween(Boolean isOrderless, Calendar dateEarlier,
			Calendar dateLater) {
		// 排序日期
		if (isOrderless) {
			if (dateEarlier.after(dateLater)) {
				Calendar swap = dateLater;
				dateLater = dateEarlier;
				dateEarlier = swap;
				isOrderless = false;
			}
			isOrderless = false;
		}
		// 如果同年, 则直接给出天数差
		if (dateLater.get(Calendar.YEAR) == dateEarlier.get(Calendar.YEAR))
			return dateLater.get(Calendar.DAY_OF_YEAR)
					- dateEarlier.get(Calendar.DAY_OF_YEAR) + 1;
		// 否则, 加上间隔年的天数并进入迭代
		dateEarlier.add(Calendar.YEAR, 1);
		return dateEarlier.getMaximum(Calendar.DAY_OF_YEAR)
				+ getDaysBetween(isOrderless, dateEarlier, dateLater);
	}

	// 计算工龄
	private BigDecimal getUserGongLing(String sjType, String userId) {
		List<HrManWorkexep> workexepList = this.systemDao.findByWhere(
				"com.sgepit.pmis.rlzj.hbm.HrManWorkexep", "personnum = '"
						+ userId + "'");
		BigDecimal workingTime0 = new BigDecimal(0);
		BigDecimal workingTime1 = new BigDecimal(0);
		int sj = new BigDecimal(sjType).intValue();
		for (HrManWorkexep hbm : workexepList) {
			Date date_start = hbm.getStarttime();
			if (date_start.getYear() >= sj)
				continue;
			Date date_end = hbm.getEndtime();
			if (date_end == null || date_end.getYear() >= sj) {
				// 设置计算截止时间为上年12月31日
				date_end = new Date((sj - 1), 11, 31);
			}
			Calendar cal_start = Calendar.getInstance();
			Calendar cal_end = Calendar.getInstance();
			cal_start.setTime(date_start);
			cal_end.setTime(date_end);
			if (hbm.getMemoc1() != null && hbm.getMemoc1().equals("1")) {
				workingTime1 = workingTime1.add(new BigDecimal(getDaysBetween(
						true, cal_start, cal_end)));
			} else {
				workingTime0 = workingTime0.add(new BigDecimal(getDaysBetween(
						true, cal_start, cal_end)));
			}
		}
		int newScale = 0;
		// 三吉利以外社会工龄折算三吉利工龄
		workingTime0 = workingTime0.divide(new BigDecimal(365), newScale,
				BigDecimal.ROUND_FLOOR).divide(new BigDecimal(3), newScale,
				BigDecimal.ROUND_FLOOR);
		// 三吉利实际工龄
		workingTime1 = workingTime1.divide(new BigDecimal(365), newScale,
				BigDecimal.ROUND_FLOOR);
		// 合计折算后三吉利总工龄
		workingTime1 = workingTime1.add(workingTime0);
		return workingTime1;
	}

	// 生成或更新年休假数据
	public boolean makeKqAnnualleave(String sjType, String userId, String type) {
		boolean rtn = true;
		try {
			if (sjType != null && userId != null) {
				if (type.equalsIgnoreCase("unit")) {
					// 如果计算单位部门下的经过批准年休假的用户
					String unitFilter = userId.equals(Constant.DefaultOrgRootID) ? ""
							: " and unitid = '" + userId + "' ";
					String sql = "select sj_type,unit_id,zb_seqno, val1 from ("
							+ "select substr(sj_type,0,4) sj_type,unit_id,max(unitid) unitid,val1 zb_seqno,count(val1)/2 val1,bill_status "
							+ " from v_hr_kq_days_dept_xb "
							+ " group by substr(sj_type,0,4),unit_id,val1,bill_status"
							+ ") where sj_type = '" + sjType + "' "
							+ unitFilter
							+ " and zb_seqno = '○' and bill_status = '1'";
					// 取得单位部门下的经过批准年休假的用户列表
					List annualleaveList = this.systemDao
							.getDataAutoCloseSes(sql);
					for (int i = 0; i < annualleaveList.size(); i++) {
						Object[] rs = (Object[]) annualleaveList.get(i);
						String userid = rs[1].toString();
						// 递归调用
						rtn = makeKqAnnualleave(sjType, userid, "user");
					}
				} else {
					List<PropertyCode> codeList = getCodeValue("考勤类别");
					// 得到用户工龄
					BigDecimal workingTime = getUserGongLing(sjType, userId);
					// 根据用户工龄计算总年休假
					BigDecimal annualleaveDays = new BigDecimal(0);
					if (workingTime.intValue() > 0) {
						annualleaveDays = new BigDecimal(7).add(workingTime)
								.subtract(new BigDecimal(1));
					}
					if (annualleaveDays.intValue() > 14)
						annualleaveDays = new BigDecimal(14);

					// 取得用户已休年休假
					BigDecimal annualleaveDaysUsed = new BigDecimal(0);
					String sql = "select sj_type,unit_id,zb_seqno, val1 from ("
							+ "select substr(sj_type,0,4) sj_type,unit_id,val1 zb_seqno,count(val1)/2 val1,bill_status "
							+ " from v_hr_kq_days_dept_xb "
							+ " group by substr(sj_type,0,4),unit_id,val1,bill_status"
							+ ") where sj_type = '" + sjType
							+ "' and unit_id = '" + userId
							+ "' and zb_seqno = '○' and bill_status = '1'";
					List annualleaveList = this.systemDao
							.getDataAutoCloseSes(sql);
					for (int i = 0; i < annualleaveList.size(); i++) {
						Object[] rs = (Object[]) annualleaveList.get(i);
						String val1 = rs[3] == null ? "0" : rs[3].toString();
						annualleaveDaysUsed = new BigDecimal(val1);
					}

					// 计算用户剩余年休假
					BigDecimal annualleaveDaysHas = annualleaveDays
							.subtract(annualleaveDaysUsed);

					List<HrManInfoD> manInfoDList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.HrManInfoD",
							"sj_type = '" + sjType + "' and unitId = '"
									+ userId + "'");
					if (manInfoDList.size() > 0) {
						// 更新
						HrManInfoD hbm = manInfoDList.get(0);
						hbm.setMemoc1(annualleaveDays.toString());// 年休假
						hbm.setMemoc2(annualleaveDaysUsed.toString());// 年休假已休
						hbm.setMemoc3(annualleaveDaysHas.toString());// 年休假未休
						hbm.setMemoc4(workingTime.toString());// 折算三吉利工龄
						this.systemDao.saveOrUpdate(hbm);
					} else {
						// 新增
						String zbSeqno = "年休";
						for (int j = 0; j < codeList.size(); j++) {
							String pname = codeList.get(j).getPropertyName();
							if (pname.indexOf(zbSeqno) >= 0) {
								zbSeqno = codeList.get(j).getPropertyCode();
								break;
							}
						}
						HrManInfoD hbm = new HrManInfoD(UUIDGenerator
								.getNewID(), sjType, userId, zbSeqno);
						hbm.setMemoc1(annualleaveDays.toString());// 年休假
						hbm.setMemoc2(annualleaveDaysUsed.toString());// 年休假已休
						hbm.setMemoc3(annualleaveDaysHas.toString());// 年休假未休
						hbm.setMemoc4(workingTime.toString());// 折算三吉利工龄
						this.systemDao.saveOrUpdate(hbm);
					}
				}
			} else {
				rtn = false;
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	// 薪酬管理

	// 查询存在的deptid为输入参数的用户基数模板时间列表
	public List<String> findSjListForXcBaseUserByDeptId(String deptId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcBaseDefine> hrXcBaseDefineList = new ArrayList<HrXcBaseDefine>();
		if (!deptId.equals(Constant.DefaultOrgRootID))
			hrXcBaseDefineList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBaseDefine", "unitId = '"
							+ deptId + "'", "sj_type desc");
		else
			hrXcBaseDefineList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBaseDefine", "",
					"sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM");
		if (hrXcBaseDefineList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrXcBaseDefineList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrXcBaseDefineList.size(); i++) {
				String nextSjType = hrXcBaseDefineList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	// 以福利基数模板设置为基础，按type生成或更新sjType指定时间的用户基数模板
	public boolean makeUserXcBaseDefine(String sjType, String type) {
		boolean rtn = true;
		try {
			if (sjType != null) {
				type = type == null ? "query" : type;
				// 考虑定义到property_code中通过设置来获得，暂写死处理
				String postLevelZb = "002005";
				List<HrXcBaseDefine> defineList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcBaseDefine", "sjType = '"
								+ sjType + "'");
				if (defineList.size() == 0 || type.equalsIgnoreCase("create")) {
					List<HrManInfo> userList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.HrManInfo",
							"onthejob = '1'");
					for (HrManInfo hbmUser : userList) {
						String areaCode = hbmUser.getMemoc1();// 取得用户区域
						String userId = hbmUser.getUserid();
						// 根据用户信息生成岗级
						HrXcBaseDefine hbmDefine = new HrXcBaseDefine();
						hbmDefine.setLsh(UUIDGenerator.getNewID());
						hbmDefine.setSjType(sjType);
						hbmDefine.setUnitId(userId);
						hbmDefine.setZbSeqno(postLevelZb);// 岗级
						hbmDefine.setVal1(hbmUser.getMemoc2());
						systemDao.saveOrUpdate(hbmDefine);

						// 根据福利基数模板生成用户福利基数
						List<HrXcBaseModel> modelList = this.systemDao
								.findByWhere(
										"com.sgepit.pmis.rlzj.hbm.HrXcBaseModel",
										"unitId = '" + areaCode + "'");
						for (HrXcBaseModel hbmModel : modelList) {
							hbmDefine = new HrXcBaseDefine();
							hbmDefine.setLsh(UUIDGenerator.getNewID());
							hbmDefine.setSjType(sjType);
							hbmDefine.setUnitId(userId);
							hbmDefine.setZbSeqno(hbmModel.getZbSeqno());
							hbmDefine.setVal1(hbmModel.getVal1());
							systemDao.saveOrUpdate(hbmDefine);
						}
					}
				} else if (type.equalsIgnoreCase("update")) {//
					systemDao.deleteAll(defineList);
					rtn = makeUserXcBaseDefine(sjType, type);
				} else {
					// do nothing;
				}
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	// 删除用户基数模板中当前时间不在职的用户设置数据
	public boolean deleteUserXcBaseDefineNotOnJob(String sjType) {
		boolean rtn = false;
		try {
			String where = "";
			if (sjType != null && !sjType.trim().equals(""))
				where = "sjType = '" + sjType + "'";
			List<HrXcBaseDefine> defineList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBaseDefine", where);
			List<HrManInfo> userList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrManInfo", "onthejob <> '1'");
			for (HrXcBaseDefine hbmDefine : defineList) {
				for (HrManInfo hbmUser : userList) {
					if (hbmDefine.getUnitId().equalsIgnoreCase(
							hbmUser.getUserid())) {
						this.systemDao.delete(hbmDefine);
						rtn = true;
					}
				}
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	// 查询存在的unitId为输入参数的工资数据时间列表
	public List<String> findSjListForXcSalary(String unitId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcSalaryM> hrXcSalaryMList = new ArrayList<HrXcSalaryM>();
		if (!unitId.equals(Constant.DefaultOrgRootID))
			hrXcSalaryMList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryM", "unitId = '"
							+ unitId + "'", "sj_type desc");
		else
			hrXcSalaryMList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryM", "", "sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM") + "01";
		if (hrXcSalaryMList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrXcSalaryMList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrXcSalaryMList.size(); i++) {
				String nextSjType = hrXcSalaryMList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	// 查询存在的unitId为输入参数的工资数据时间列表
	public List<String> findSjListForXcSalaryD(String userId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcSalaryD> hrXcSalaryDList = new ArrayList<HrXcSalaryD>();
		if (!userId.equals(Constant.DefaultOrgRootID))
			hrXcSalaryDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryD", "unitId = '"
							+ userId + "'", "sj_type desc");
		else
			hrXcSalaryDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcSalaryD", "", "sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM") + "01";
		if (hrXcSalaryDList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrXcSalaryDList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrXcSalaryDList.size(); i++) {
				String nextSjType = hrXcSalaryDList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	// 以用户基数模板设置为基础，按type生成或更新sjType指定时间的用户工资主表及从表数据
	public HrXcSalaryM makeXcSalary(String sjType, String unitId, String type) {
		HrXcSalaryM hbmSalaryM = new HrXcSalaryM();
		try {
			if (sjType != null) {
				type = type == null ? "query" : type;
				List<HrXcSalaryM> salaryMList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcSalaryM", "sjType = '"
								+ sjType + "' and unitId = '" + unitId + "'");
				if (salaryMList.size() == 0)
					type = "create";
				if (type.equalsIgnoreCase("create")) {
					hbmSalaryM = new HrXcSalaryM();
					String lsh = UUIDGenerator.getNewID();
					hbmSalaryM.setLsh(lsh);
					hbmSalaryM.setSjType(sjType);
					hbmSalaryM.setUnitId(unitId);
					hbmSalaryM.setCount(new Long(sjType.substring(6, 8)));
					String title = sjType.substring(0, 4) + "年"
							+ sjType.substring(4, 6) + "月第"
							+ (sjType.substring(6, 8)) + "次" + "发放工资";
					SgccIniUnit unit = getUnitMap().get(unitId);
					if (unit != null) {
						title = unit.getUnitname() + title;
					}
					hbmSalaryM.setTitle(title);
					hbmSalaryM.setStatus("0");
					hbmSalaryM.setBillStatus("0");
					Date nowDate = DateUtil.getSystemDateTime();
					hbmSalaryM.setCreateDate(nowDate);
					systemDao.saveOrUpdate(hbmSalaryM);

					makeXcSalaryPlus(lsh, sjType, unitId, type);
				} else if (type.equalsIgnoreCase("update")) {//
					hbmSalaryM = salaryMList.get(0);

					String lsh = hbmSalaryM.getLsh();
					makeXcSalaryPlus(lsh, sjType, unitId, type);
				} else {
					hbmSalaryM = salaryMList.get(0);
				}
			}
		} catch (Exception e) {
			hbmSalaryM = null;
			e.printStackTrace();
		}
		return hbmSalaryM;
	}

	// 生成或更新sjType指定时间的用户工资主表及从表数据
	private boolean makeXcSalaryPlus(String masterLsh, String sjType,
			String unitId, String type) {
		boolean rtn = false;
		List<HrXcSalaryD> salaryDList = this.systemDao.findByWhere(
				"com.sgepit.pmis.rlzj.hbm.HrXcSalaryD", "masterLsh = '"
						+ masterLsh + "'");
		Map salaryDMap = new HashMap();
		for (HrXcSalaryD hbm : salaryDList) {
			salaryDMap.put(hbm.getSjType() + "-" + hbm.getUnitId() + "-"
					+ hbm.getZbSeqno(), hbm);
		}
		String sql = "select unit_id,zb_seqno,val1 from hr_xc_base_define "
				+ " where sj_type||unit_id||zb_seqno in"
				+ " (select max(sj_type)||unit_id||zb_seqno from hr_xc_base_define t "
				+ " where sj_type <='" + sjType
				+ "' group by unit_id,zb_seqno)";
		List list = this.systemDao.getDataAutoCloseSes(sql);

		if (type.equalsIgnoreCase("create")) {
			for (int i = 0; i < list.size(); i++) {
				Object[] rs = (Object[]) list.get(i);
				String lsh = UUIDGenerator.getNewID();
				HrXcSalaryD hbm = new HrXcSalaryD(lsh, masterLsh, sjType, rs[0]
						.toString(), rs[1].toString());
				if (rs[2] != null && !rs[2].toString().equals("")) {
					try {
						hbm.setVal1(new Double(rs[2].toString()));
					} catch (Exception e) {
						System.out.println("Error@sjType：" + sjType
								+ "-unitId:" + rs[0].toString() + "-zbSeqno:"
								+ rs[1].toString() + "-val1:"
								+ rs[2].toString());
					}
				}
				systemDao.saveOrUpdate(hbm);

				// 删除没有设置的指标
				String key = sjType + "-" + rs[0].toString() + "-"
						+ rs[1].toString();
				if (salaryDMap.containsKey(key)) {
					salaryDList.remove(salaryDMap.get(key));
				}
			}
			// 删除没有设置的指标
			if (salaryDList.size() > 0)
				systemDao.deleteAll(salaryDList);
		} else if (type.equalsIgnoreCase("update")) {//
			if (salaryDList.size() > 0)
				systemDao.deleteAll(salaryDList);
			makeXcSalaryPlus(masterLsh, sjType, unitId, "create");
		} else {
			// do nothing;
		}
		return rtn;
	}

	// 删除用户基数模板中当前时间不在职的用户设置数据
	public boolean deleteXcSalary(String sjType, String unitId) {
		boolean rtn = false;
		try {
			if (sjType != null && !sjType.trim().equals("")) {
				String where = "";
				where = "sjType = '" + sjType + "'";
				if (unitId != null && !unitId.trim().equals("")) {
					where += where.equals("") ? "" : " and " + "unitId = '"
							+ unitId + "'";
				}
				List<HrXcSalaryM> salaryMList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcSalaryM", where);
				for (HrXcSalaryM hbm : salaryMList) {
					List<HrXcSalaryD> salaryDList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.HrXcSalaryD",
							"masterLsh = '" + hbm.getLsh() + "'");
					systemDao.deleteAll(salaryDList);
				}
				systemDao.deleteAll(salaryMList);
				rtn = true;
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean updateXcSalaryM(HrXcSalaryM hbmSalaryM) {
		boolean rtn = false;
		try {
			systemDao.saveOrUpdate(hbmSalaryM);
			rtn = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean calcXcSalaryTjData(HrXcSalaryM zbHbm) {
		boolean rtn = true;
		try {
			String zbLsh = zbHbm.getLsh();
			String sql = "select unit_name,sj_type,unit_id,zb_seqno,val1 from v_hr_xc_salarytj_d "
					+ " where sj_type = '" + zbHbm.getSjType() + "'";
			List xcSalaryTjList = this.systemDao.getDataAutoCloseSes(sql);
			if (xcSalaryTjList.size() > 0) {
				List delList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcSalaryTjD", "sj_type = '"
								+ zbHbm.getSjType() + "'");
				this.systemDao.deleteAll(delList);
			}

			for (int i = 0; i < xcSalaryTjList.size(); i++) {
				Object[] rs = (Object[]) xcSalaryTjList.get(i);
				String sj = rs[1].toString();
				String unitid = rs[2].toString();
				String val = rs[4] == null ? "0" : rs[4].toString();
				String zbSeqno = rs[3].toString();
				if (!val.equals("0")) {
					HrXcSalaryTjD salaryTjDHbm = null;
					List<HrXcSalaryTjD> salaryTjDList = this.systemDao
							.findByWhere(
									"com.sgepit.pmis.rlzj.hbm.HrXcSalaryTjD",
									"sj_type = '" + sj + "' and unit_id = '"
											+ unitid + "' and zb_seqno = '"
											+ zbSeqno + "'");
					if (salaryTjDList.size() > 0)
						salaryTjDHbm = salaryTjDList.get(0);
					else
						salaryTjDHbm = new HrXcSalaryTjD(UUIDGenerator
								.getNewID(), zbLsh, sj, unitid, zbSeqno);
					salaryTjDHbm.setVal1(new Double(val));
					systemDao.saveOrUpdate(salaryTjDHbm);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rtn = false;
		}
		return rtn;
	}

	// ////
	// 查询存在的unitId为输入参数的工资数据时间列表
	public List<String> findSjListForXcBonus(String unitId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcBonusM> hrXcBonusMList = new ArrayList<HrXcBonusM>();
		if (!unitId.equals(Constant.DefaultOrgRootID))
			hrXcBonusMList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBonusM", "unitId = '"
							+ unitId + "'", "sj_type desc");
		else
			hrXcBonusMList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBonusM", "", "sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM") + "01";
		if (hrXcBonusMList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrXcBonusMList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrXcBonusMList.size(); i++) {
				String nextSjType = hrXcBonusMList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	public List<String> findSjListForXcBonusD(String unitId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcBonusD> hrXcBonusDList = new ArrayList<HrXcBonusD>();
		if (!unitId.equals(Constant.DefaultOrgRootID))
			hrXcBonusDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBonusD", "unitId = '"
							+ unitId + "'", "sj_type desc");
		else
			hrXcBonusDList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrXcBonusD", "", "sj_type desc");
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM") + "01";
		if (hrXcBonusDList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (hrXcBonusDList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < hrXcBonusDList.size(); i++) {
				String nextSjType = hrXcBonusDList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}

	// 以用户基数模板设置为基础，按type生成或更新sjType指定时间的用户工资主表及从表数据
	public HrXcBonusM makeXcBonus(String sjType, String unitId, String type) {
		HrXcBonusM hbmBonusM = new HrXcBonusM();
		try {
			if (sjType != null) {
				type = type == null ? "query" : type;
				List<HrXcBonusM> bonusMList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcBonusM", "sjType = '"
								+ sjType + "' and unitId = '" + unitId + "'");
				if (bonusMList.size() == 0)
					type = "create";
				if (type.equalsIgnoreCase("create")) {
					hbmBonusM = new HrXcBonusM();
					String lsh = UUIDGenerator.getNewID();
					hbmBonusM.setLsh(lsh);
					hbmBonusM.setSjType(sjType);
					hbmBonusM.setUnitId(unitId);
					hbmBonusM.setCount(new Long(sjType.substring(6, 8)));
					String title = sjType.substring(0, 4) + "年"
							+ sjType.substring(4, 6) + "月第"
							+ (sjType.substring(6, 8)) + "次" + "发放奖金";
					SgccIniUnit unit = getUnitMap().get(unitId);
					if (unit != null) {
						title = unit.getUnitname() + title;
					}
					hbmBonusM.setTitle(title);
					hbmBonusM.setStatus("0");
					hbmBonusM.setBillStatus("0");
					hbmBonusM.setCount(new Long(sjType.substring(6, 8)));
					Date nowDate = DateUtil.getSystemDateTime();
					hbmBonusM.setCreateDate(nowDate);
					systemDao.saveOrUpdate(hbmBonusM);

					if (unitId.equals(Constant.DefaultOrgRootID))
						makeXcBonusDeptSplit(lsh, sjType, unitId, type);
				} else if (type.equalsIgnoreCase("update")) {//
					hbmBonusM = bonusMList.get(0);

					String lsh = hbmBonusM.getLsh();
					if (unitId.equals(Constant.DefaultOrgRootID))
						makeXcBonusDeptSplit(lsh, sjType, unitId, type);
				} else {
					hbmBonusM = bonusMList.get(0);
				}
			}
		} catch (Exception e) {
			hbmBonusM = null;
			e.printStackTrace();
		}
		return hbmBonusM;
	}

	// 生成或更新sjType指定时间的用户工资主表及从表数据
	private boolean makeXcBonusPlus(String masterLsh, String sjType,
			String unitId, String type) {
		boolean rtn = false;

		List<HrXcBonusD> xcBonusList = this.systemDao.findByWhere(
				"com.sgepit.pmis.rlzj.hbm.HrXcBonusD", "masterLsh = '"
						+ masterLsh + "'");
		Map xcBonusMap = new HashMap();
		for (HrXcBonusD hbm : xcBonusList) {
			xcBonusMap.put(hbm.getSjType() + "-" + hbm.getUnitId() + "-"
					+ hbm.getZbSeqno(), hbm);
		}
		String sql = "select unit_id,zb_seqno,val1 from hr_xc_base_define "
				+ " where sj_type||unit_id||zb_seqno in"
				+ " (select max(sj_type)||unit_id||zb_seqno from hr_xc_base_define t "
				+ " where sj_type <='" + sjType
				+ "' group by unit_id,zb_seqno)";
		List list = this.systemDao.getDataAutoCloseSes(sql);

		if (type.equalsIgnoreCase("create")) {
			for (int i = 0; i < list.size(); i++) {
				Object[] rs = (Object[]) list.get(i);
				String lsh = UUIDGenerator.getNewID();
				HrXcBonusD hbm = new HrXcBonusD(lsh, masterLsh, sjType, rs[0]
						.toString(), rs[1].toString());
				if (rs[2] != null && !rs[2].toString().equals("")) {
					try {
						hbm.setVal1(new Double(rs[2].toString()));
					} catch (Exception e) {
						System.out.println("Error@sjType：" + sjType
								+ "-unitId:" + rs[0].toString() + "-zbSeqno:"
								+ rs[1].toString() + "-val1:"
								+ rs[2].toString());
					}
				}
				systemDao.saveOrUpdate(hbm);

				// 删除没有设置的指标
				String key = sjType + "-" + rs[0].toString() + "-"
						+ rs[1].toString();
				if (xcBonusMap.containsKey(key)) {
					xcBonusList.remove(xcBonusMap.get(key));
				}
			}
			// 删除没有设置的指标
			if (xcBonusList.size() > 0)
				systemDao.deleteAll(xcBonusList);
		} else if (type.equalsIgnoreCase("update")) {//
			for (int i = 0; i < list.size(); i++) {
				Object[] rs = (Object[]) list.get(i);
				List<HrXcBonusD> hrXcBonusDList = systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcBonusD", "sjType = '"
								+ sjType + "' and unitId = '"
								+ rs[0].toString() + "' and zbSeqno = '"
								+ rs[1].toString() + "'");

				String lsh = UUIDGenerator.getNewID();
				HrXcBonusD hbm = new HrXcBonusD(lsh, masterLsh, sjType, rs[0]
						.toString(), rs[1].toString());
				if (hrXcBonusDList.size() > 0) {
					hbm = hrXcBonusDList.get(0);
					hbm.setMasterlsh(masterLsh);
				}
				if (rs[2] != null && !rs[2].toString().equals("")) {
					try {
						hbm.setVal1(new Double(rs[2].toString()));
					} catch (Exception e) {
						System.out.println("Error@sjType：" + sjType
								+ "-unitId:" + rs[0].toString() + "-zbSeqno:"
								+ rs[1].toString() + "-val1:"
								+ rs[2].toString());
					}
				}
				systemDao.saveOrUpdate(hbm);
			}
		} else {
			// do nothing;
		}
		return rtn;
	}

	private boolean makeXcBonusDeptSplit(String masterLsh, String sjType,
			String unitId, String type) {
		boolean rtn = false;
		String sql = "select t.unitid, t.unitname"
				+ ",(select count(unitid) from sgcc_ini_unit where upunit=t.unitid and unit_type_id <> '2') as leaf , "
				+ "decode(p.lsh,null,'false','true') as flag "
				+ ", t.unit_type_id unitTypeId "
				+ ",p.title,p.status,p.bill_status, p.lsh,p.unit_id,p.unit_id dept_id,p.user_id,p.create_date,p.latest_date,u.realname "
				+ " from sgcc_ini_unit t left join (select * from hr_xc_bonus_m where sj_type='"
				+ sjType
				+ "' and (unit_id = '" + Constant.DefaultOrgRootID + "' or status is not null or status <> '0')) p on t.unitid = p.unit_id "
				+ "left join rock_user u On p.user_id = u.userid  where t.unit_type_id <> '2' and t.upunit = '"
				+ unitId + "' " + "  and p.lsh is null "
				+ " order by t.view_order_num ";

		System.out.println("********************* The hql is " + sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		for (int i = 0; i < list.size(); i++) {
			Object[] rs = (Object[]) list.get(i);
			HrXcBonusM hbmBonusM = new HrXcBonusM();
			String lsh = UUIDGenerator.getNewID();
			hbmBonusM.setLsh(lsh);
			hbmBonusM.setSjType(sjType);
			hbmBonusM.setUnitId(rs[0].toString());
			hbmBonusM.setCount(new Long(sjType.substring(6, 8)));
			String title = (rs[1] != null ? rs[1].toString() : "")
					+ sjType.substring(0, 4) + "年" + sjType.substring(4, 6)
					+ "月第" + (sjType.substring(6, 8)) + "次" + "发放奖金";
			hbmBonusM.setTitle(title);
			hbmBonusM.setStatus("0");
			hbmBonusM.setBillStatus("0");
			hbmBonusM.setCount(new Long(sjType.substring(6, 8)));
			Date nowDate = DateUtil.getSystemDateTime();
			hbmBonusM.setCreateDate(nowDate);
			systemDao.saveOrUpdate(hbmBonusM);
		}
		return rtn;
	}

	// 删除用户基数模板中当前时间不在职的用户设置数据
	public boolean deleteXcBonus(String sjType, String unitId) {
		boolean rtn = false;
		try {
			if (sjType != null && !sjType.trim().equals("")) {
				String where = "";
				where = "sjType = '" + sjType + "'";
				if (unitId != null && !unitId.trim().equals("")) {
					where += where.equals("") ? "" : " and " + "unitId = '"
							+ unitId + "'";
				}
				List<HrXcBonusM> salaryMList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcBonusM", where);
				for (HrXcBonusM hbm : salaryMList) {
					List<HrXcBonusD> xcBonusList = this.systemDao.findByWhere(
							"com.sgepit.pmis.rlzj.hbm.HrXcBonusD",
							"masterLsh = '" + hbm.getLsh() + "'");
					systemDao.deleteAll(xcBonusList);
				}
				systemDao.deleteAll(salaryMList);
				rtn = true;
			}
		} catch (Exception e) {
			rtn = false;
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean updateXcBonusM(HrXcBonusM hbmBonusM) {
		boolean rtn = false;
		try {
			systemDao.saveOrUpdate(hbmBonusM);
			rtn = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return rtn;
	}

	public boolean updateXcBonusMById(String lsh, String status)
			throws SQLException, BusinessException {
		boolean rtn = true;
		if (lsh != null) {
			List<HrXcBonusM> xcBonusMList = (List<HrXcBonusM>) this.systemDao
					.findByWhere("com.sgepit.pmis.rlzj.hbm.HrXcBonusM",
							"lsh = '" + lsh + "'");
			String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM");
			if (xcBonusMList.size() != 0) {
				HrXcBonusM hbm = xcBonusMList.get(0);
				hbm.setLatestDate(DateUtil.getSystemDateTime());
				hbm.setStatus(status);
				this.systemDao.saveOrUpdate(hbm);
			} else {
				throw new BusinessException("修改奖金失败！");
			}
		} else {
			// 用户名被占用
			throw new BusinessException("修改奖金失败！");
		}
		return rtn;
	}

	public boolean calcXcBonusTjData(HrXcBonusM zbHbm) {
		boolean rtn = true;
		try {
			String zbLsh = zbHbm.getLsh();
			String sql = "select unit_name,sj_type,unit_id,zb_seqno,val1 from v_hr_xc_Bonustj_d "
					+ " where sj_type = '" + zbHbm.getSjType() + "'";
			List xcBonusTjList = this.systemDao.getDataAutoCloseSes(sql);
			if (xcBonusTjList.size() > 0) {
				List delList = this.systemDao.findByWhere(
						"com.sgepit.pmis.rlzj.hbm.HrXcBonusTjD", "sj_type = '"
								+ zbHbm.getSjType() + "'");
				this.systemDao.deleteAll(delList);
			}

			for (int i = 0; i < xcBonusTjList.size(); i++) {
				Object[] rs = (Object[]) xcBonusTjList.get(i);
				String sj = rs[1].toString();
				String unitid = rs[2].toString();
				String val = rs[4] == null ? "0" : rs[4].toString();
				String zbSeqno = rs[3].toString();
				if (!val.equals("0")) {
					HrXcBonusTjD bonusTjDHbm = null;
					List<HrXcBonusTjD> BonusTjDList = this.systemDao
							.findByWhere(
									"com.sgepit.pmis.rlzj.hbm.HrXcBonusTjD",
									"sj_type = '" + sj + "' and unit_id = '"
											+ unitid + "' and zb_seqno = '"
											+ zbSeqno + "'");
					if (BonusTjDList.size() > 0)
						bonusTjDHbm = BonusTjDList.get(0);
					else
						bonusTjDHbm = new HrXcBonusTjD(
								UUIDGenerator.getNewID(), zbLsh, sj, unitid,
								zbSeqno);
					bonusTjDHbm.setVal1(new Double(val));
					systemDao.saveOrUpdate(bonusTjDHbm);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rtn = false;
		}
		return rtn;
	}

	private static boolean isInteger(String value) {
		try {
			Integer.parseInt(value);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public Map<String, SgccIniUnit> getUnitMap() {
		Map<String, SgccIniUnit> mapUnit = new HashMap<String, SgccIniUnit>();
		List<SgccIniUnit> unitList = this.sgccIniUnitDAO.findAll();
		for (int index = 0; index < unitList.size(); index++) {
			mapUnit.put(unitList.get(index).getUnitid(), unitList.get(index));
		}
		return mapUnit;
	}

	// 异步<asynchronism>
	public String getBulidTreeJson(String sjType, String deptId) {
		String sql = "select t.unitid, t.unitname"
				+ ",(select count(unitid) from sgcc_ini_unit where upunit=t.unitid and unit_type_id <> '2') as leaf , "
				+ "decode(p.lsh,null,'false','true') as flag "
				+ ", t.unit_type_id unitTypeId "
				+ ",p.title,p.status,p.bill_status, p.lsh,p.unit_id,p.dept_id,p.user_id,p.create_date,p.latest_date,u.realname "
				+ " from sgcc_ini_unit t left join (select * from Kq_Days_Dept_Zb where sj_type='"
				+ sjType
				+ "' and (dept_id = '" + Constant.DefaultOrgRootID + "' or status is not null or status <> '0')) p on t.unitid = p.dept_id "
				+ "left join rock_user u On p.user_id = u.userid  where t.unit_type_id <> '2' and t.upunit = '"
				+ deptId + "' order by t.view_order_num ";

		System.out.println("********************* The hql is " + sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		StringBuffer JSONStr = new StringBuffer();
		JSONStr.append("[");
		for (int i = 0; i < list.size(); i++) {
			Object[] rs = (Object[]) list.get(i);
			String leaf = (rs[2].toString().equals("0") ? ",leaf: true"
					: ",leaf: false");
			JSONStr.append("{id:'" + rs[0] + "'" + ",unitname:'" + rs[1] + "'"
					+ leaf);
			JSONStr.append(",flag:'" + rs[3] + "'");
			JSONStr.append(",unitTypeId:'" + rs[4] + "'");
			JSONStr.append(",checked:" + rs[3]);
			JSONStr.append(",disabled:false");
			JSONStr
					.append(",title:'"
							+ checkNullAndReturn(rs[5], rs[1] + sjType
									+ "月考勤填报") + "'");
			JSONStr.append(",status:'"
					+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
							: checkNullAndReturn(rs[6], "0")) + "'");
			JSONStr.append(",billStatus:'"
					+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
							: checkNullAndReturn(rs[7], "0")) + "'");
			JSONStr
					.append(",lsh:'"
							+ checkNullAndReturn(rs[8], UUIDGenerator
									.getNewID()) + "'");
			JSONStr.append(",unitId:'"
					+ checkNullAndReturn(rs[9], Constant.DefaultOrgRootID) + "'");
			JSONStr.append(",deptId:'" + checkNullAndReturn(rs[10], rs[0])
					+ "'");
			if (rs[13] != null)
				JSONStr.append(",latestDate:'"
						+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
								: checkNullAndReturn(DateUtil.getDateTimeStr(
										(java.util.Date) rs[13],
										"yyyy年MM月dd日 hh时mm分ss秒"))) + "'");
			JSONStr
					.append(",username:'" + checkNullAndReturn(rs[14], "")
							+ "'");
			JSONStr.append(",uiProvider:'col'");
			if (!rs[2].toString().equals("0")) {
				JSONStr.append(",cls:'master-task',iconCls:'task-folder'");
				JSONStr.append(",children:");
				JSONStr.append(getBulidTreeJson(sjType, rs[0].toString()));
			} else {
				JSONStr.append(",cls:'master-task',iconCls:'task',leaf:true");
			}
			JSONStr.append("}");
			if (i < list.size() - 1) {
				JSONStr.append(",");
			}
		}
		JSONStr.append("]");
		System.out.println(JSONStr.toString());
		return JSONStr.toString();
	}

	// 异步<asynchronism>
	public String getBulidTreeJsonForBonus(String sjType, String deptId) {
		String sql = "select t.unitid, t.unitname"
				+ ",(select count(unitid) from sgcc_ini_unit where upunit=t.unitid and unit_type_id <> '2') as leaf , "
				+ "decode(p.lsh,null,'false','true') as flag "
				+ ", t.unit_type_id unitTypeId "
				+ ",p.title,p.status,p.bill_status, p.lsh,p.unit_id,p.unit_id dept_id,p.user_id,p.create_date,p.latest_date,u.realname "
				+ " from sgcc_ini_unit t left join (select * from hr_xc_bonus_m where sj_type='"
				+ sjType
				+ "' and (unit_id = '" + Constant.DefaultOrgRootID + "' or status is not null or status <> '0')) p on t.unitid = p.unit_id "
				+ "left join rock_user u On p.user_id = u.userid  where t.unit_type_id <> '2' and t.upunit = '"
				+ deptId + "' order by t.view_order_num ";

		System.out.println("********************* The hql is " + sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		StringBuffer JSONStr = new StringBuffer();
		JSONStr.append("[");
		for (int i = 0; i < list.size(); i++) {
			Object[] rs = (Object[]) list.get(i);
			String leaf = (rs[2].toString().equals("0") ? ",leaf: true"
					: ",leaf: false");
			JSONStr.append("{id:'" + rs[0] + "'" + ",unitname:'" + rs[1] + "'"
					+ leaf);
			JSONStr.append(",flag:'" + rs[3] + "'");
			JSONStr.append(",unitTypeId:'" + rs[4] + "'");
			JSONStr.append(",checked:" + rs[3]);
			JSONStr.append(",disabled:false");
			String title = (rs[1] != null ? rs[1].toString() : "")
					+ sjType.substring(0, 4) + "年" + sjType.substring(4, 6)
					+ "月第" + (sjType.substring(6, 8)) + "次" + "发放奖金";
			JSONStr.append(",title:'" + checkNullAndReturn(rs[5], title) + "'");
			JSONStr.append(",status:'"
					+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
							: checkNullAndReturn(rs[6], "0")) + "'");
			JSONStr.append(",billStatus:'"
					+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
							: checkNullAndReturn(rs[7], "0")) + "'");
			JSONStr
					.append(",lsh:'"
							+ checkNullAndReturn(rs[8], UUIDGenerator
									.getNewID()) + "'");
			JSONStr.append(",unitId:'"
					+ checkNullAndReturn(rs[9], Constant.DefaultOrgRootID) + "'");
			JSONStr.append(",deptId:'" + checkNullAndReturn(rs[10], rs[0])
					+ "'");
			if (rs[13] != null)
				JSONStr.append(",latestDate:'"
						+ (rs[0].toString().equals(Constant.DefaultOrgRootID) ? ""
								: checkNullAndReturn(DateUtil.getDateTimeStr(
										(java.util.Date) rs[13],
										"yyyy年MM月dd日 hh时mm分ss秒"))) + "'");
			JSONStr
					.append(",username:'" + checkNullAndReturn(rs[14], "")
							+ "'");
			JSONStr.append(",uiProvider:'col'");
			if (!rs[2].toString().equals("0")) {
				JSONStr.append(",cls:'master-task',iconCls:'task-folder'");
				JSONStr.append(",children:");
				JSONStr.append(getBulidTreeJsonForBonus(sjType, rs[0]
						.toString()));
			} else {
				JSONStr.append(",cls:'master-task',iconCls:'task',leaf:true");
			}
			JSONStr.append("}");
			if (i < list.size() - 1) {
				JSONStr.append(",");
			}
		}
		JSONStr.append("]");
		System.out.println(JSONStr.toString());
		return JSONStr.toString();
	}

	/**
	 * 获得属性代码List
	 * 
	 * @param catagory
	 * @return
	 */
	public List getCodeValue(String catagory) {
		return propertyCodeDAO.getCodeValue(catagory);
	}

	/**
	 * 根据类型名称和属性代码获得属性名称
	 * 
	 * @param codeValue
	 * @param propertyName
	 * @return
	 */
	private String getCodeNameByPropertyName(String codeValue,
			String propertyName) {

		return propertyCodeDAO.getCodeNameByPropertyName(codeValue,
				propertyName);
	}

	private Object checkNullAndReturn(Object object) {
		// TODO Auto-generated method stub
		return checkNullAndReturn(object, "");
	}

	private Object checkNullAndReturn(Object object, Object rtn) {
		// TODO Auto-generated method stub
		if (object != null)
			rtn = object;
		return rtn;
	}

	public void deleteUserContract(HrManContract user) throws SQLException,
			BusinessException {
		this.systemDao.delete(user);
		
	}

	public void insertUserContract(HrManContract user) throws SQLException,
			BusinessException {
		String personnum = user.getPersonnum();
		if (personnum != null && !personnum.equals("")) {
			user.setSeqnum(UUIDGenerator.getNewID());
			user.setPersonnum(personnum);
			this.systemDao.insert(user);
			//保存用工的同时需要更新到用户表中
			this.hrManContractDAO.updateEmpTypeToHrInfo(personnum, user.getEmployModus());
			
			
		}
		
	}

	public void updateUserContract(HrManContract user) throws SQLException,
			BusinessException {

		HrManContract usercon = user;
		if (usercon != null) {
			this.systemDao.saveOrUpdate(usercon);
			//保存用工的同时需要更新到用户表中
			this.hrManContractDAO.updateEmpTypeToHrInfo(usercon.getPersonnum(), user.getEmployModus());
		} else {
			// 用户名被占用
			throw new BusinessException(
					BusinessConstants.MSG_USERNAME_NOT_UNIQUE);
		}
		
	}

	public void CalculAllExp() {
		List list=hrManContractDAO.getAllContract();
		for(int i=0;i<list.size();i++){
			HrManContract hrManContract=(HrManContract)list.get(i);
			Date nowDate=new Date();
            Date entryDate=hrManContract.getEntryDate();
            long times=nowDate.getTime()-entryDate.getTime();
            long years=times/1000/60/60/24/365;
             if(years!=hrManContract.getWorkYears().intValue()){
            	 hrManContractDAO.updateContractByWorkYears(hrManContract.getPersonnum(), years);
             }		
		}
	}

	public String checkUsercontract(String personnum) throws SQLException,
			BusinessException {
			int num= hrManContractDAO.findByProperty("com.sgepit.pmis.rlzj.hbm.HrManContract", "personnum", personnum).size();
		   if(num>0){
			   return "exist";
		   }
		return "";
	}
	/**
	 * 根据时间获取提醒数据
	 * @param solar     阳历时间字符，8位，如：20110314
	 * @param lunar1st  阳历本月第一天对于的阴历字符串，8位，如：20110314
	 * @param lunarFinal阳历本月最后一天对应得阴历字符串，8位，如：20110314
	 * @return
	 */
	public String getRemindData(String solar,String lunar,String lunar1st,String lunarFinal){
		try{
			StringBuffer sbf = new StringBuffer();
			sbf.append("[");
			
			Map<String,String> worksMap = new HashMap<String,String>();
			List lt = propertyCodeDAO.findByWhere("com.sgepit.frame.sysman.hbm.VProperty", 
											"tname='用工形式' and detailType is not null");
			for(Iterator it=lt.iterator();it.hasNext();){
				VProperty porp = (VProperty) it.next();
				worksMap.put(porp.getDetailType(), porp.getPropertyCode());
			}
			
			for(int i=0,j=remindSort.length;i<j;i++){
				//过滤类型、描述、区间、时间字段、时间格式、是否生日、用工形式
				String id        = remindSort[i][0];
				String filterType= remindSort[i][2];
				String dateCol   = remindSort[i][3];
				String format    = remindSort[i][4];
				String isBirth   = remindSort[i][5];
				String workType  = remindSort[i][6];
				String whereStr = "1=1 ";
				
				if(!workType.equals("")&&worksMap.containsKey(workType)){
					whereStr+=" and emptypecode = '"+worksMap.get(workType)+"'";
				}

				if(isBirth.equals("1")){//生日按照农历计算
					if(filterType.equals("D")){//本日过生日
						whereStr+=" and to_char("+dateCol+",'"+format.substring(4)+"') = '"+lunar.substring(4)+"'";
					}else{
						whereStr+=" and to_char("+dateCol+",'"+format.substring(4)+"') >= '"+lunar1st.substring(4)+"'" +
							   " and to_char("+dateCol+",'"+format.substring(4)+"') <= '"+lunarFinal.substring(4)+"'";
					}
				}else{
					if(filterType.equals("D")){//统计本日
						whereStr+=" and to_char("+dateCol+",'"+format+"') = '"+solar+"'";
					}else{//统计本月
						whereStr+=" and to_char("+dateCol+",'"+format+"') = '"+solar.substring(0,6)+"'";
					}
				}
				
				int num = systemDao.findByWhere("com.sgepit.pmis.rlzj.hbm.VHrManInfo", whereStr).size();
				if(i==0){
					sbf.append("['").append(remindSort[i][0]).append("','").append(remindSort[i][1]).
						append("',").append(num).append("]");
				}else{
					sbf.append(",['").append(remindSort[i][0]).append("','").append(remindSort[i][1]).append("',").
						append(num).append("]");
				}
			}
				
			sbf.append("]");
			return sbf.toString();
		}catch(Exception ex){
			ex.printStackTrace();
			return "[]";
		}
	}
	/**
	 * 根据类型获取过滤条件
	 * @param fltType
	 * @param solar
	 * @param lunar
	 * @param lunar1st
	 * @param lunarFinal
	 * @return
	 */
	public String getRemindWherestr(String fltType,String solar,String lunar,String lunar1st,String lunarFinal){
		try{
			
			Map<String,String> worksMap = new HashMap<String,String>();
			List lt = propertyCodeDAO.findByWhere("com.sgepit.frame.sysman.hbm.VProperty", 
											"tname='用工形式' and detailType is not null");
			for(Iterator it=lt.iterator();it.hasNext();){
				VProperty porp = (VProperty) it.next();
				worksMap.put(porp.getDetailType(), porp.getPropertyCode());
			}
			String whereStr = "1=1 ";
			
			for(int i=0,j=remindSort.length;i<j;i++){
				//过滤类型、描述、区间、时间字段、时间格式、是否生日、用工形式
				if(fltType.equals(remindSort[i][0])){
					String filterType= remindSort[i][2];
					String dateCol   = remindSort[i][3];
					String format    = remindSort[i][4];
					String isBirth   = remindSort[i][5];
					String workType  = remindSort[i][6];
	
					if(!workType.equals("")&&worksMap.containsKey(workType)){
						whereStr+=" and emptypecode = '"+worksMap.get(workType)+"'";
					}
						
					if(isBirth.equals("1")){//生日按照农历计算
						if(filterType.equals("D")){//本日过生日
							whereStr+=" and to_char("+dateCol+",'"+format.substring(4)+"') = '"+lunar.substring(4)+"'";
						}else{
							whereStr+=" and to_char("+dateCol+",'"+format.substring(4)+"') >= '"+lunar1st.substring(4)+"'" +
							" and to_char("+dateCol+",'"+format.substring(4)+"') <= '"+lunarFinal.substring(4)+"'";
						}
					}else{
						if(filterType.equals("D")){//统计本日
							whereStr+=" and to_char("+dateCol+",'"+format+"') = '"+solar+"'";
						}else{//统计本月
							whereStr+=" and to_char("+dateCol+",'"+format+"') = '"+solar.substring(0,6)+"'";
						}
					}
					
					break;
				}
			}
			return whereStr;
		}catch(Exception ex){
			ex.printStackTrace();
			return "1=2";
		}
	}

	public int CalWorkExp(String input) {
		 
		    Date da=new Date(Long.parseLong(input));
		    Date nowDate=new Date();
		   long result=nowDate.getTime()-Long.parseLong(input);
		    int  years=(int)(result/1000/60/60/24/365);
		return years;
	}
	
	public boolean saveTransfer(HrManTransfer transferHbm){
		try{
			HrManInfo hrInfo = (HrManInfo) hrManContractDAO.findById("com.sgepit.pmis.rlzj.hbm.HrManInfo",transferHbm.getUserid());
			RockUser  rockUser=(RockUser)systemDao.findBeanByProperty(RockUser.class.getName(), "userid", transferHbm.getUserid());
			if(transferHbm.getTransfertype().equals("1")){//部门变更
				//hrInfo.setOrgid(transferHbm.getNewdeptid());
				//部门变更 同时更新 人力资源中员工信息表 及系统管理中人员表
				
				//1 更新人力资源表
				SgccIniUnit sgccIniUnit=(SgccIniUnit)systemDao.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", transferHbm.getNewdeptid());
				hrInfo.setPosname(sgccIniUnit.getUnitname());//部门
				hrInfo.setPosid(sgccIniUnit.getUnitid());
				//调换部门后无论部门下是否有岗位均设置为空
				hrInfo.setOrgid("");//岗位
				hrInfo.setOrgname("");//岗位
				//职位是否变更
				if(transferHbm.getNewpro()!=null&&!"".equals(transferHbm.getNewpro()))
					hrInfo.setMemoc3(transferHbm.getNewpro());	
				systemDao.saveOrUpdate(hrInfo);
				//修改系统人员表中数据
			
			    rockUser.setDeptId(transferHbm.getNewdeptid());
			    rockUser.setPosid(transferHbm.getNewdeptid());
			    systemDao.saveOrUpdate(rockUser);
			}
			
			if("2".equals(transferHbm.getTransfertype())){
				transferHbm.setOlddeptid(hrInfo.getPosid());
				transferHbm.setNewdeptid(hrInfo.getPosid());
				hrInfo.setMemoc3(transferHbm.getNewpro());
				if(transferHbm.getNewpost()!=null&&!"".equals(transferHbm.getNewpost())){
					SgccIniUnit sgccIniUnit=(SgccIniUnit)systemDao.findBeanByProperty(SgccIniUnit.class.getName(), "unitid",transferHbm.getNewpost() );
					hrInfo.setOrgid(sgccIniUnit.getUnitid());
					hrInfo.setOrgname(sgccIniUnit.getUnitname());
				}
				systemDao.saveOrUpdate(hrInfo);
				//跟新系统表
				rockUser.setPosid(transferHbm.getNewpost());
				systemDao.saveOrUpdate(rockUser);
			}
			
			
			
			hrManContractDAO.insert(transferHbm);
			return true;
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
	}
}
