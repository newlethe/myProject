package com.sgepit.pmis.rlzj.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import oracle.sql.BLOB;

import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.HibernateTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.pmis.rlzj.dao.HrManContractDAO;
import com.sgepit.pmis.rlzj.dao.HrManDeptSetLogDAO;
import com.sgepit.pmis.rlzj.hbm.HrManInfoD;
import com.sgepit.pmis.rlzj.hbm.HrManWorkexep;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusD;
import com.sgepit.pmis.rlzj.hbm.HrXcBonusM;
import com.sgepit.pmis.rlzj.hbm.HrXcSalaryM;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptXb;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb;
import com.sgepit.pmis.rlzj.hbm.KqDaysDeptZbLog;
import com.sgepit.pmis.rlzj.hbm.KqDaysOvertime;
import com.sgepit.pmis.rlzj.hbm.KqDaystjDeptXb;
import com.sgepit.pmis.rlzj.hbm.KqStatisticDTO;

public class RlzyKqglMgmImpl extends BaseMgmImpl implements RlzyKqglMgmFacade {
	// 过滤类型、描述、区间、时间字段、时间格式、是否生日、用工形式

	private SystemDao systemDao;

	private SgccIniUnitDAO sgccIniUnitDAO;

	private PropertyCodeDAO propertyCodeDAO;

	private HrManDeptSetLogDAO manDeptSetLogDAO;
	private HrManContractDAO hrManContractDAO;

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getHrManContractDAO()
	 */
	public HrManContractDAO getHrManContractDAO() {
		return hrManContractDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#setHrManContractDAO(com.sgepit.pmis.rlzj.dao.HrManContractDAO)
	 */
	public void setHrManContractDAO(HrManContractDAO hrManContractDAO) {
		this.hrManContractDAO = hrManContractDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getSgccIniUnitDAO()
	 */
	public SgccIniUnitDAO getSgccIniUnitDAO() {
		return sgccIniUnitDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getPropertyCodeDAO()
	 */
	public PropertyCodeDAO getPropertyCodeDAO() {
		return propertyCodeDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getManDeptSetLogDAO()
	 */
	public HrManDeptSetLogDAO getManDeptSetLogDAO() {
		return manDeptSetLogDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#setPropertyCodeDAO(com.sgepit.frame.sysman.dao.PropertyCodeDAO)
	 */
	public void setPropertyCodeDAO(PropertyCodeDAO propertyCodeDAO) {
		this.propertyCodeDAO = propertyCodeDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#setSgccIniUnitDAO(com.sgepit.frame.sysman.dao.SgccIniUnitDAO)
	 */
	public void setSgccIniUnitDAO(SgccIniUnitDAO sgccIniUnitDAO) {
		this.sgccIniUnitDAO = sgccIniUnitDAO;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#setSystemDao(com.sgepit.frame.sysman.dao.SystemDao)
	 */
	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getSystemDao()
	 */
	public SystemDao getSystemDao() {
		return systemDao;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#setManDeptSetLogDAO(com.sgepit.pmis.rlzj.dao.HrManDeptSetLogDAO)
	 */
	public void setManDeptSetLogDAO(HrManDeptSetLogDAO manDeptSetLogDAO) {
		this.manDeptSetLogDAO = manDeptSetLogDAO;
	}

	public static RlzyMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (RlzyMgmImpl) ctx.getBean("rlzyMgm");
	}


	// 考勤管理
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#findSjListForKqDeptByDeptId(java.lang.String)
	 */
	public List<String> findSjListForKqDeptByDeptId(String deptId) {
		List<String> monthList = new ArrayList<String>();
		List<KqDaysDeptZb> kqDaysDeptZbList = new ArrayList<KqDaysDeptZb>();
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

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getUnitListBoxStr()
	 */
	public String getUnitListBoxStr(String userBelongUnitid) {
		String sql = "select t.unitid, t.unitname || '【' || (select u.unitname from sgcc_ini_unit u where u.unitid = t.upunit) || '】' unitname from sgcc_ini_unit t"
				+ " where t.unit_type_id='8' start with upunit = '%s'"
				+ " connect by prior unitid = upunit order siblings by view_order_num";
		
		
		List<Map<String, String>> unitList = JdbcUtil.query(String.format(sql,
				userBelongUnitid));
		String rtnStr = "[";
		for (Map<String, String> unitMap : unitList) {
			rtnStr += String.format("['%s','%s']", unitMap.get("unitid"),
					unitMap.get("unitname"));
			rtnStr += ",";

		}
		rtnStr = rtnStr.substring(0, rtnStr.length() - 1) + "]";

		return rtnStr;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getUserListBoxStr(java.lang.String[])
	 */
	public String getUserListBoxStr(String[] unitIds,String userBelongUnitid) {
		String sql = "select realname, userid from rock_user t";
		String inStr = "(";
		if (unitIds != null) {
			for (String unitId : unitIds) {
				inStr += "'" + unitId + "',";
			}
			inStr = inStr.substring(0, inStr.length() - 1) + ")";
			sql += " where dept_id in " + inStr;
		}
		else if(unitIds==null){
			sql+=" where dept_id in (select t.unitid from sgcc_ini_unit t where t.unit_type_id = '8'" +
					" start with upunit='"+userBelongUnitid+"' " +
					" connect by prior unitid = upunit)";
			
		}
		sql += " order by dept_id, useraccount";

		List<Map<String, String>> userList = JdbcUtil.query(sql);
		String rtnStr = "[";
		for (Map<String, String> unitMap : userList) {
			rtnStr += String.format("['%s','%s']", unitMap.get("userid"),
					unitMap.get("realname"));
			rtnStr += ",";

		}
		rtnStr = rtnStr.substring(0, rtnStr.length() - 1) + "]";

		return rtnStr;
	}


	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getSjTypeStrToNow(java.lang.String)
	 */
	public String getSjTypeStrToNow(String startDate) {
		String sql = "select distinct(sj_type) from kq_days_dept_zb t";
		if (startDate != null) {
			sql += " where sj_type >= '" + startDate + "'";
		}
		sql += " order by sj_type asc";
		List<Map<String, String>> sjTypeList = JdbcUtil.query(sql);

		String rtnStr = "[";
		for (Map<String, String> sjTypeMap : sjTypeList) {
			String sjType = sjTypeMap.get("SJ_TYPE");
			String keyStr = sjType;
			String valueStr = String.format("%s年%s月", sjType.substring(0, 4),
					sjType.substring(4));
			rtnStr += String.format("['%s','%s']", keyStr, valueStr);
			rtnStr += ",";
		}

		rtnStr = rtnStr.substring(0, rtnStr.length() - 1) + "]";

		return rtnStr;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#calcKqDaysTjDataByKey(java.lang.String)
	 */
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
//						daystjXbHbm = new KqDaystjDeptXb(UUIDGenerator.getNewID(), zbLsh, sj, unitid);
//					daystjXbHbm.setVal1(totalDay.toString());
//					daystjXbHbm.setZbSeqno(zbSeqno);
					systemDao.saveOrUpdate(daystjXbHbm);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			rtn = false;
		}
		return rtn;
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

	/**
	 * 获得属性代码List
	 * 
	 * @param catagory
	 * @return
	 */
	public List getCodeValue(String catagory) {
		return propertyCodeDAO.getCodeValue(catagory);
	}

	// 薪酬管理

	// 查询存在的deptid为输入参数的用户基数模板时间列表

	// 以福利基数模板设置为基础，按type生成或更新sjType指定时间的用户基数模板

	// 删除用户基数模板中当前时间不在职的用户设置数据

	// 查询存在的unitId为输入参数的工资数据时间列表


	// 以用户基数模板设置为基础，按type生成或更新sjType指定时间的用户工资主表及从表数据


	// 删除用户基数模板中当前时间不在职的用户设置数据


	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#updateXcSalaryM(com.sgepit.pmis.rlzj.hbm.HrXcSalaryM)
	 */
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



	// ////
	// 查询存在的unitId为输入参数的工资数据时间列表
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#findSjListForXcBonus(java.lang.String)
	 */
	public List<String> findSjListForXcBonus(String unitId) {
		List<String> monthList = new ArrayList<String>();
		List<HrXcBonusM> hrXcBonusMList = new ArrayList<HrXcBonusM>();
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


	// 以用户基数模板设置为基础，按type生成或更新sjType指定时间的用户工资主表及从表数据


	// 删除用户基数模板中当前时间不在职的用户设置数据
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#deleteXcBonus(java.lang.String, java.lang.String)
	 */
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





	private static boolean isInteger(String value) {
		try {
			Integer.parseInt(value);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getUnitMap()
	 */
	public Map<String, SgccIniUnit> getUnitMap() {
		Map<String, SgccIniUnit> mapUnit = new HashMap<String, SgccIniUnit>();
		List<SgccIniUnit> unitList = this.sgccIniUnitDAO.findAll();
		for (int index = 0; index < unitList.size(); index++) {
			mapUnit.put(unitList.get(index).getUnitid(), unitList.get(index));
		}
		return mapUnit;
	}
	private void addAttributesToUnitNode(JSONObject jsonObject,String sjType){
		jsonObject.put("unitname", jsonObject.get("unitname"));
		jsonObject.put("id", jsonObject.get("unitid"));
		jsonObject.put("unitTypeId", jsonObject.get("unitTypeId"));
		String title = (jsonObject.get("unitname") != null ?jsonObject.get("unitname").toString() : "")
				+ sjType.substring(0, 4) + "年" + sjType.substring(4, 6)
				+ "月" + "考勤填报";
		jsonObject.put("title", title);
		jsonObject.put("status", jsonObject.get("status"));
		jsonObject.put("billStatus", jsonObject.get("bill_status"));
		jsonObject.put("lsh", jsonObject.get("lsh"));
		jsonObject.put("unitId", jsonObject.get("unit_id"));
		jsonObject.put("deptId", jsonObject.get("dept_id"));
		jsonObject.put("latestDate", jsonObject.get("latest_date"));
		jsonObject.put("template_id", jsonObject.get("template_id"));
		jsonObject.put("username", jsonObject.get("realname"));
		jsonObject.put("uiProvider", "col");
		jsonObject.put("cls", "master");
		jsonObject.put("iconCls", "task");

	}
	private JSONArray syncGetUnitChildrens1( Object[]rs, List bonusList,String sjType){
		
		JSONArray jsonarray = new JSONArray();
		for(int b=0;b<bonusList.size();b++){
			Object[] rs0= (Object[]) bonusList.get(b);
			Map map=new HashMap();
			map.put("unitid", rs0[0]);
			map.put("upunit", rs0[1]);
			map.put("unitname", rs0[2]);
			map.put("unitTypeId", rs0[3]);
			map.put("remark", rs0[4]);
			map.put("status", rs0[5]);
			map.put("bill_status", rs0[6]);
			map.put("lsh", rs0[7]);
			map.put("unit_id", rs0[8]);
			map.put("dept_id", rs0[9]);
			map.put("user_id", rs0[10]);
			map.put("latest_date", rs0[11]);
			map.put("template_id", rs0[12]);
			map.put("realname", rs0[13]);
			map.put("leaf", rs0[14]);
			if((rs[0].toString()).equals(rs0[1].toString())) {
				rs0[14]=1;
				map.put("leaf", 1);
				List list1 = bonusList;
				for (int i=0; i<list1.size(); i++){
					Object[]rs1= (Object[])list1.get(i);
					if((rs1[1].toString()).equals(rs0[0].toString())) {
						rs0[14]=0;
						map.put("leaf", 0);
						break;
					}
				}
				JSONObject jsonobject = JSONObject.fromObject(map);
				addAttributesToUnitNode(jsonobject,sjType);
				if((rs0[14].toString()).equals("0")){
					jsonobject.put("children",syncGetUnitChildrens1(rs0, bonusList,sjType));
				}
				jsonarray.add(jsonobject);
			}
		}
		//System.out.println("====" + jsonarray);
		return jsonarray;
	}
	// 异步<asynchronism>
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getBulidTreeJson(java.lang.String, java.lang.String)
	 */
	public String getBulidTreeJson(String sjType, String deptId,String userBelongUnitid) {
		String sql = "select t.unitid,t.upunit,t.unitname,t.unit_type_id unitTypeId,p.memo,p.status,p.bill_status,p.lsh,p.unit_id," +
		"p.unit_id dept_id,p.user_id,to_char(p.latest_date,'yyyy-MM-dd hh24:mi:ss')latest_date " +
		",p.create_date,u.realname,t.leaf from (select * from (select distinct * from " +
		"(select * from sgcc_ini_unit start with unitid ='"+deptId+"' connect by prior upunit=unitid union all" +
		" select * from sgcc_ini_unit start with unitid in " +
		"(select unitid from (select t.* from sgcc_ini_unit t start with unitid ='"+userBelongUnitid+"' connect by prior" +
		" unitid=upunit) where unit_type_id='1') connect by prior unitid = upunit union all " +
		" select t.* from sgcc_ini_unit t start with unitid ='"+deptId+"' connect by prior unitid=upunit ) )t1 " +
		"where t1.unit_type_id not in('9') start with t1.unitid = '"+userBelongUnitid+"' connect by prior " +
		"t1.unitid=t1.upunit) t left join (select * from Kq_Days_Dept_Zb where " +
		"sj_type = '"+sjType+"'  and ( status is not null or status <> '0')) p " +
		"on t.unitid = p.unit_id left join rock_user u On p.user_id = u.userid";
		System.out.println("********************* The sql is " + sql);
		List list = this.systemDao.getDataAutoCloseSes(sql);
		StringBuffer JSONStr = new StringBuffer();
		JSONArray jsonArray = new JSONArray();			
		String jsonstring = "";
		Object[] rs = (Object[]) list.get(0);
		if(list!=null){
			for(int b=0;b<list.size();b++){
				Object[] rs_back= (Object[]) list.get(b);
				 if((rs_back[0].toString()).equals(userBelongUnitid)){
					 rs=rs_back;
				 }
				}
		}
		Map map=new HashMap();
		map.put("unitid", rs[0]);
		map.put("upunit", rs[1]);
		map.put("unitname", rs[2]);
		map.put("unitTypeId", rs[3]);
		map.put("remark", rs[4]);
		map.put("status", rs[5]);
		map.put("bill_status", rs[6]);
		map.put("lsh", rs[7]);
		map.put("unit_id", rs[8]);
		map.put("dept_id", rs[9]);
		map.put("user_id", rs[10]);
		map.put("latest_date", rs[11]);
		map.put("template_id", rs[12]);
		map.put("realname", rs[13]);
		map.put("leaf", rs[14]);
		List list1 = list;
		for (int i=0; i<list1.size(); i++){
			Object[] rs1= (Object[]) list1.get(i);
			if((rs1[1].toString()).equals(rs[0].toString())) {
				rs[14]=0;
				map.put("leaf", 0);
				break;
			}
		}
		
		JSONObject jsonobject = JSONObject.fromObject(map);
		addAttributesToUnitNode(jsonobject,sjType);	
		System.out.println("rs[14]:"+rs[14].toString());
		if((rs[14].toString()).equals("0")){
			jsonobject.put("children",syncGetUnitChildrens1(rs,list,sjType));
		}
		jsonArray.add(jsonobject);
		jsonstring = jsonArray.toString();
		System.out.println("-----: " + jsonstring);
		return jsonstring;
	
	}


	

	private Object checkNullAndReturn(Object object) {

		return checkNullAndReturn(object, "");
	}

	private Object checkNullAndReturn(Object object, Object rtn) {
		if (object != null)
			rtn = object;
		return rtn;
	}

	




	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getExcelTemplate(java.lang.String)
	 */
	public InputStream getExcelTemplate(String businessType) {
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='"
				+ businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size() > 0) {
			templateFileId = l.get(0).get("fileid");
		}

		if (templateFileId != null && templateFileId.length() > 0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt
						.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"
								+ templateFileId + "'");
				if (rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close();
				stmt.close();
				conn.close();
				initCtx.close();

			} catch (Exception ex) {
				ex.printStackTrace();
				return null;
			}
		}
		return ins;
	}


	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#findKqDeptZbByLsh(java.lang.String)
	 */
	public KqDaysDeptZb findKqDeptZbByLsh(String lsh) {
		String beanName = "com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb";
		KqDaysDeptZb rtn = (KqDaysDeptZb) this.systemDao
				.findById(beanName, lsh);
		return rtn;
	}


	
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#uploadToLead(java.lang.String, java.lang.String, java.lang.String, java.lang.String)
	 */
	public boolean uploadToLead(String lsh,String useraccount,String Spstatus,String userid){
		boolean bool = true;
		KqDaysDeptZbLog log = new KqDaysDeptZbLog();
		RockUser user = new RockUser();
		RockUser user2 = new RockUser();
		String beanName = "com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb";
		String beanUser = "com.sgepit.frame.sysman.hbm.RockUser";
		List<RockUser> list = this.systemDao.findByWhere(beanUser, "useraccount='"+useraccount+"'");
		if(list.size()!=0) user = list.get(0);
		KqDaysDeptZb zb = (KqDaysDeptZb) this.systemDao.findById(beanName,lsh);
		System.out.println("-->"+userid);
		if(Spstatus.equals("2")){
			zb.setStatus("1");
			zb.setDeptUserSp(useraccount);
			zb.setUserId(userid);
			log.setFromUser(zb.getUserId());
			log.setToUser(user.getUserid());
			log.setRemark("发送部门领导审批");
		}
		if(Spstatus.equals("3")){
			zb.setCompUserSp(useraccount);
			List<RockUser> list2 = this.systemDao.findByWhere(beanUser, "useraccount='"+zb.getDeptUserSp()+"'");
			if(list.size()!=0) user2 = list.get(0);
			log.setFromUser(user2.getUserid());
			log.setToUser(user.getUserid());
			log.setRemark("部门领导审批通过");
		}
		if(Spstatus.equals("4")){
			List<RockUser> list2 = this.systemDao.findByWhere(beanUser, "useraccount='"+zb.getCompUserSp()+"'");
			if(list.size()!=0) user2 = list.get(0);
			log.setFromUser(zb.getUserId());
			log.setToUser(zb.getUserId());
			log.setRemark("公司领导审批通过");
		}
		zb.setSpStatus(Spstatus);
		this.systemDao.saveOrUpdate(zb);
		
		log.setKqLsh(lsh);
		log.setPostTime(new Date());
		log.setStatus(Spstatus);
		this.systemDao.insert(log);
		return bool;
	}
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#findKqDeptZbByDeptIdAndSj(java.lang.String, java.lang.String)
	 */
	
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
				rtn.setSpStatus("1");
				rtn.setCreateDate(DateUtil.getSystemDateTime());
				rtn.setLatestDate(DateUtil.getSystemDateTime());
				SgccIniUnit unit = getUnitMap().get(deptId);
				if (unit != null) {
					rtn.setTitle(unit.getUnitname() + sj + "月考勤填报");
				}
				
				String sql = "select userid from hr_man_info where posid='" + deptId + "' and onthejob = '1'";
				List l = JdbcUtil.query(sql);
				String userCount =  String.valueOf(l.size());
				rtn.setMemo(userCount);
				String masterlsh = systemDao.insert(rtn);
				
				//初始化部门下所有员工非工作日考勤为"出勤"
				if(masterlsh!=null && !masterlsh.equals(""))
					initKqOfUsers(masterlsh, sj, deptId);
			}
		}
		return rtn;
	}
	
	/**
	 * 初始化部门员工工作日考勤为"出勤"
	 * @param masterlsh  --考勤报告主键
	 * @param sj --考勤报告期别
	 * @param deptId--部门编号
	 */
	@SuppressWarnings("unchecked")
	public void initKqOfUsers(String masterlsh, String sj, String deptId) {
		//创建要初始化考勤的容器
		List<KqDaysDeptXb> xbBeans = new ArrayList<KqDaysDeptXb>();
		List<RockUser> userBeans = this.systemDao.findByWhere(RockUser.class.getName(), "dept_id='"+deptId+"'");
		int year = Integer.valueOf(sj.substring(0, 4));
		int month = Integer.valueOf(sj.substring(4, 6)) - 1;
		StringBuffer sjType = new StringBuffer(sj);
		GregorianCalendar gCalender = new GregorianCalendar(year, month, 1);
		int dd = gCalender.getActualMaximum(gCalender.DAY_OF_MONTH);
		for(RockUser uBean:userBeans) {
			String userid = uBean.getUserid();
			for(int i=1; i<=dd; i++) {
				gCalender.set(Calendar.DAY_OF_MONTH, i);
				//星期天，星期六不初始化为"出勤"
				if(gCalender.get(Calendar.DAY_OF_WEEK)==1 || gCalender.get(Calendar.DAY_OF_WEEK)==7)
					continue;
				
				sjType.append(i>=10 ? i : "0"+i);
				//上午
				KqDaysDeptXb xbAmBean = new KqDaysDeptXb();
				xbAmBean.setDetailId(UUIDGenerator.getNewID());
				xbAmBean.setMasterlsh(masterlsh);
				xbAmBean.setSjType(sjType.toString());
				xbAmBean.setUnitId(userid);
				xbAmBean.setVal1("√");
				xbAmBean.setZbSeqno("上午");
				xbBeans.add(xbAmBean);
				//下午
				KqDaysDeptXb xbPmBean = new KqDaysDeptXb();
				xbPmBean.setDetailId(UUIDGenerator.getNewID());
				xbPmBean.setMasterlsh(masterlsh);
				xbPmBean.setSjType(sjType.toString());
				xbPmBean.setUnitId(userid);
				xbPmBean.setVal1("√");
				xbPmBean.setZbSeqno("下午");
				xbBeans.add(xbPmBean);
				
				sjType.setLength(6);
			}
		}
		
		this.systemDao.getHibernateTemplate().saveOrUpdateAll(xbBeans);
	}
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#updateKqUserCount(com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb)
	 */
	public String updateKqUserCount(KqDaysDeptZb kqDaysDeptZb) {
		String sql = "select userid from hr_man_info where posid='"
				+ kqDaysDeptZb.getDeptId() + "' and onthejob = '1'";
		List l = JdbcUtil.query(sql);
		String userCount = String.valueOf(l.size());
		kqDaysDeptZb.setMemo(userCount);
		systemDao.saveOrUpdate(kqDaysDeptZb);
		return userCount;
	}

	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#updateKqDaysDeptZb(com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb)
	 */
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
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#calcKqDaysTjData(com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb)
	 */	
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
						daystjXbHbm = new KqDaystjDeptXb(UUIDGenerator.getNewID(), zbLsh, sj, unitid);
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
	/**
	 * 报表退回操作
	 * @param log:报表发送和退回记录
	 * @param status:退回状态
	 * @return 
	 * @author: zhangh
	 * @createDate: 2011-5-6
	 */
	public boolean backKqDeptZb(KqDaysDeptZbLog log,String status){
		boolean bool = true;
		String beanName = "com.sgepit.pmis.rlzj.hbm.KqDaysDeptZb";
		log.setPostTime(new Date());
		this.systemDao.insert(log);
		KqDaysDeptZb zb = (KqDaysDeptZb) this.systemDao.findById(beanName, log.getKqLsh());
		zb.setSpStatus(status);
		this.systemDao.saveOrUpdate(zb);
		return bool;
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
		if(status.equals("4"))hbm.setSpStatus("1");
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
	/**
	 * 考勤统计查询
	 * @return 
	 * @author: shangtw
	 * @createDate: 2011-11-07
	 */
	public String getKqStatXml(String startSjType, String endSjType, String deptIds[], String[] userIds){
		
		//防止传入空数组
		String[] curDeptIds = null;
		if ( deptIds!= null ){
			if ( deptIds.length > 0 ){
				curDeptIds = deptIds;
			}
		}
		String[] curUserIds = null;
		if ( userIds != null ){
			if ( userIds.length > 0 ){
				curUserIds = userIds;
			}
		}
		
		
		String xmlStr = "";
		xmlStr += "<rows>";
		xmlStr += "<head>";
		xmlStr += "<column id=\"rowno\" width=\"30\" type=\"ron\" align=\"center\" sort=\"str\">序号</column>";
		xmlStr += "<column id=\"deptName\" width=\"100\" type=\"ro\" align=\"center\" sort=\"str\" >部门</column>";
		xmlStr += "<column id=\"userName\" width=\"80\" type=\"ro\" align =\"center\" sort=\"str\" >员工</column>";
		xmlStr += "<column id=\"cqCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >出勤</column>";
		xmlStr += "<column id=\"ccCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >出差</column>";
		xmlStr += "<column id=\"ybCnt\" width=\"61\" type=\"ron\" align =\"center\" sort=\"str\" >值夜班次数</column>";
		xmlStr += "<column id=\"sxjbCnt\" width=\"61\" type=\"ron\" align =\"center\" sort=\"str\" >双休日加班</column>";
		xmlStr += "<column id=\"jrjbCnt\" width=\"61\" type=\"ron\" align =\"center\" sort=\"str\" >节假日加班</column>";
		xmlStr += "<column id=\"txCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >调休天数</column>";
		xmlStr += "<column id=\"kgCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\"  >缺勤统计</column>";
		xmlStr += "<column id=\"sjCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"bjCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"nxCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"hjCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"sangjCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"cjCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"gsCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"tqCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<column id=\"cdztCnt\" width=\"58\" type=\"ron\" align =\"center\" sort=\"str\" >#cspan</column>";
		xmlStr += "<afterInit><call command=\"attachHeader\"><param>#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,#rspan,旷工,事假,病假,年休假,婚假,丧假,产假,工伤假,探亲假,迟到早退</param></call>	</afterInit>";
		xmlStr += "</head>";
		
		if ( startSjType != null ){
			List<KqStatisticDTO> kqStatList = getKqStatData(startSjType, endSjType, curDeptIds, curUserIds);

			DecimalFormat decimalFormat = new DecimalFormat("###.#");
			for ( int i = 0; i < kqStatList.size(); i++ ){
				KqStatisticDTO curStat = kqStatList.get(i);
				xmlStr += String.format("<row id='%s' open='1'>", i + 1);
				xmlStr += String.format("<cell>%d</cell>", i + 1);
				xmlStr += String.format("<cell>%s</cell>", curStat.getDeptName() == null ? "" : curStat.getDeptName());
				xmlStr += String.format("<cell>%s</cell>", curStat.getUserName());
				xmlStr += String.format("<cell>%s</cell>", curStat.getCqCount()== null ? 0 : decimalFormat.format(curStat.getCqCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getCcCount()== null ? 0 : decimalFormat.format(curStat.getCcCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getYbCount()== null ? 0 :decimalFormat.format(curStat.getYbCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getSxjbCount()== null ? 0 : decimalFormat.format(curStat.getSxjbCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getJrjbCount()== null ? 0 : decimalFormat.format(curStat.getJrjbCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getTxCount()== null ? 0 :decimalFormat.format(curStat.getTxCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getAbsenseCount()== null ? 0 :decimalFormat.format(curStat.getAbsenseCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getSjCount()== null ? 0 :decimalFormat.format(curStat.getSjCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getBjCount()== null ? 0 :decimalFormat.format(curStat.getBjCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getNxCount()== null ? 0 :decimalFormat.format(curStat.getNxCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getHjCount()== null ? 0 :decimalFormat.format(curStat.getHjCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getSangjCount()== null ? 0 :decimalFormat.format(curStat.getSangjCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getCjCount()== null ? 0 :decimalFormat.format(curStat.getCjCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getGsCount()== null ? 0 :decimalFormat.format(curStat.getGsCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getTqCount()== null ? 0 :decimalFormat.format(curStat.getTqCount()));
				xmlStr += String.format("<cell>%s</cell>", curStat.getCdztCount()== null ? 0 :decimalFormat.format(curStat.getCdztCount()));
				
			
				
				
				
				xmlStr += "</row>";

			}
		}
	
	
		
		xmlStr += "</rows>";
		return xmlStr;
		
	}
	public List<KqStatisticDTO> getKqStatData(String startSjType, String endSjType, String[] deptIds, String[] userIds){
		List<KqStatisticDTO> kqStatList = new ArrayList<KqStatisticDTO>(); 
		//得到筛选出的用户列表
		String userSql = "select t1.*, unitname from rock_user t1, sgcc_ini_unit t2 where t1.dept_id = t2.unitid";
		List<Map<String, Object>> userList;
		if ( userIds == null ){
			if ( deptIds != null ){
				String inStr = "(";
	            for (String deptId : deptIds) {
	                  inStr += String.format(" '%s',", deptId);
	            }
	            inStr = inStr.substring(0, inStr.length() - 1) + ")";
	           
				userSql += " and dept_id in " + inStr ;
			}
			else{
				userSql += " and dept_id not in ( select unitid from sgcc_ini_unit t where t.unit_type_id = '2' )";
			}
			
			
		}
		else{
			
			String inStr = "(";
            for (String uid : userIds) {
                  inStr += String.format(" '%s',", uid);
            }
            inStr = inStr.substring(0, inStr.length() - 1) + ")";
            userSql += " and userid in " + inStr;

		}
		userSql += " order by dept_id";
		userList = JdbcUtil.query(userSql);
		
		//拼接时间范围子句
		String timeSpanStr = String.format(" sj_type between %s and %s", startSjType, endSjType);
		String kqSql = "select sum(VAL1) cnt, zb_seqno from kq_daystj_dept_xb t where unit_id = '%s' and" + timeSpanStr + " group by zb_seqno";
		
		for (Map<String, Object> rockUserMap : userList) {
			List<Map<String, Object>> curUserStat = JdbcUtil.query(String.format(kqSql, rockUserMap.get("USERID").toString()));
			
			KqStatisticDTO kqStat = new KqStatisticDTO();
			kqStat.setUserName(rockUserMap.get("REALNAME") == null ? "" : rockUserMap.get("REALNAME").toString());
			kqStat.setDeptName(rockUserMap.get("UNITNAME") == null ? "" : rockUserMap.get("UNITNAME").toString());
			
			for (Map<String, Object> map : curUserStat) {
				if ( map.get("ZB_SEQNO").equals("001001") ){ //出勤
					kqStat.setCqCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001004") ){  //出差
					kqStat.setSjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001005") ){  //值夜班
					kqStat.setYbCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001006") ){  //双休日加班
					kqStat.setSxjbCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001002") ){  //节假日加班
					kqStat.setJrjbCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001007") ){  //调休
					kqStat.setTxCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003006") ){  //旷工
					kqStat.setAbsenseCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003001") ){  //事假
					kqStat.setSjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003002") ){  //病假
					kqStat.setBjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003003") ){  //年休
					kqStat.setNxCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003004") ){  //婚假
					kqStat.setHjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003008") ){  //丧假
					kqStat.setSangjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003005") ){  //产假
					kqStat.setCjCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003009") ){  //工伤
					kqStat.setGsCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003010") ){  //探亲
					kqStat.setTqCount(Double.valueOf(map.get("cnt").toString()));
				}
				else if ( map.get("ZB_SEQNO").equals("001003011") ){  //迟到早退
					kqStat.setCdztCount(Double.valueOf(map.get("cnt").toString()));
				}
			
			}
			kqStatList.add(kqStat);						
		}			
		return kqStatList;
	}



	// 生成或更新年休假数据
	public boolean makeKqAnnualleave(String sjType, String userId, String type) {
		boolean rtn = true;
		try {
			if (sjType != null && userId != null) {
				if (type.equalsIgnoreCase("unit")) {
					// 如果计算单位部门下的经过批准年休假的用户
					String unitFilter = userId.equals("10000000000000") ? ""
							: " and unitid = '" + userId + "' ";
					String sql = "select sj_type,unit_id,zb_seqno, val1 from ("
							+ "select substr(sj_type,0,4) sj_type,unit_id,max(unitid) unitid,val1 zb_seqno,count(val1)/2 val1,bill_status "
							+ " from v_hr_kq_days_dept_xb "
							+ " group by substr(sj_type,0,4),unit_id,val1,bill_status"
							+ ") where sj_type = '" + sjType + "' "
							+ unitFilter
							+ " and zb_seqno = '年休假' and bill_status = '1'";
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
							+ "' and zb_seqno = '年休假' and bill_status = '1'";
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
	public List<String> findSjListForKqAnnualleave(String deptId) {
		List<String> monthList = new ArrayList<String>();
		List<HrManInfoD> hrManInfoDList = new ArrayList<HrManInfoD>();
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
	public String[] saveOrUpdateOvertime(String nowsj, String pid,
			String deptid,String masterlsh) {
		String flag="0";	
		String uids[]=null;
		List<KqDaysOvertime> kqDaysOvertimeList = this.systemDao.findByWhere(
				"com.sgepit.pmis.rlzj.hbm.KqDaysOvertime","masterlsh='"+masterlsh+"'");		
		if(null!=kqDaysOvertimeList&&kqDaysOvertimeList.size()>0){
			JdbcUtil.execute("delete from KQ_DAYS_OVERTIME where masterlsh='"+masterlsh+"'");	
			List<Map<String, String>> vcellkqtestMainList = JdbcUtil.query("select *from V_CELL_KQ_TEST  where masterlsh='"+masterlsh+"'");
			uids=new String[vcellkqtestMainList.size()];
			int i=0;
			for(Map<String, String> unitMap : vcellkqtestMainList){			
				KqDaysOvertime kqDaysOvertime=new KqDaysOvertime();
				kqDaysOvertime.setRealname(unitMap.get("unitname"));
				kqDaysOvertime.setPid(pid);
				kqDaysOvertime.setMasterlsh(masterlsh);
				kqDaysOvertime.setZbseqno("TEST");
				kqDaysOvertime.setSjtype(unitMap.get("sjtype"));
				String sjtypedetail=unitMap.get("sj_type_detail");
				kqDaysOvertime.setSjtypedetail(sjtypedetail);
				kqDaysOvertime.setUpunit(unitMap.get("upunit"));
				kqDaysOvertime.setUnitid(unitMap.get("unitid"));
				String dateTimeStr=unitMap.get("monthstr")+"月"+unitMap.get("daystr")+"日";
				kqDaysOvertime.setDatetimestr(dateTimeStr);
				kqDaysOvertime.setMonthstr(unitMap.get("monthstr"));
				kqDaysOvertime.setKojbtype(unitMap.get("aa"));
				kqDaysOvertime.setIsboss(unitMap.get("isboss"));
				for(int j=0;j<kqDaysOvertimeList.size();j++){
					//将原加班内容更新到对应的记录中
					KqDaysOvertime OldkqDaysOvertime=kqDaysOvertimeList.get(j);
					if(null!=OldkqDaysOvertime.getUpunit()&&null!=OldkqDaysOvertime.getSjtypedetail()){
						if(OldkqDaysOvertime.getUpunit().equals(unitMap.get("upunit"))&&OldkqDaysOvertime.getSjtypedetail().equals(sjtypedetail)){
							kqDaysOvertime.setKqcontent(OldkqDaysOvertime.getKqcontent());
						}						
					}

				}
				 String uid=this.systemDao.insert(kqDaysOvertime);
				 uids[i]=uid;
				 i=i+1;
			}		    		
			
		}else{
			//新增
			List<Map<String, String>> vcellkqtestMainList = JdbcUtil.query("select *from V_CELL_KQ_TEST where masterlsh='"+masterlsh+"'");
			uids=new String[vcellkqtestMainList.size()];
			int i=0;
			for(Map<String, String> unitMap : vcellkqtestMainList){
				KqDaysOvertime kqDaysOvertime=new KqDaysOvertime();
				kqDaysOvertime.setRealname(unitMap.get("unitname"));
				kqDaysOvertime.setPid(pid);
				kqDaysOvertime.setMasterlsh(masterlsh);
				kqDaysOvertime.setSjtype(unitMap.get("sjtype"));
				kqDaysOvertime.setSjtypedetail(unitMap.get("sj_type_detail"));
				kqDaysOvertime.setUpunit(unitMap.get("upunit"));				
				kqDaysOvertime.setZbseqno("TEST");
				kqDaysOvertime.setUnitid(unitMap.get("unitid"));
				String dateTimeStr=unitMap.get("monthstr")+"月"+unitMap.get("daystr")+"日";
				kqDaysOvertime.setDatetimestr(dateTimeStr);
				kqDaysOvertime.setMonthstr(unitMap.get("monthstr"));
				kqDaysOvertime.setKojbtype(unitMap.get("aa"));
				kqDaysOvertime.setIsboss(unitMap.get("isboss"));
				 String uid=this.systemDao.insert(kqDaysOvertime);
				 uids[i]=uid;
				 i=i+1;				 
			}	
		}
		return uids;
	}
}
