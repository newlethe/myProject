package com.sgepit.pmis.rlzj.service;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections.map.ListOrderedMap;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.rlzj.dao.RzglMainDao;
import com.sgepit.pmis.rlzj.hbm.RzglKqglKqImport;
import com.sgepit.pmis.rlzj.util.RzglConstant;

public class JjmisRzglKqglMgmImpl extends BaseMgmImpl implements
		RzglMgmFacade {
	private RzglMainDao rzglMainDao;

	private SystemMgmFacade systemMgm;

	public RzglMainDao getRzglMainDao() {
		return rzglMainDao;
	}
	public void setRzglMainDao(RzglMainDao rzglMainDao) {
		this.rzglMainDao = rzglMainDao;
	}
	public SystemMgmFacade getSystemMgm() {
		return systemMgm;
	}
	public void setSystemMgm(SystemMgmFacade systemMgm) {
		this.systemMgm = systemMgm;
	}
	// shuz
	/**
	 * excel数据导入
	 * 
	 * @param uids
	 * @param beanName
	 * @param fileItem
	 * @author shuz
	 */
	public String importData(String beanName, List<Map<String, String>> list,String pid) {
		try {
			String text = "";
			if (beanName.equals(RzglKqglKqImport.class.getName())) {
				text = this.importDataByKq(list,pid);
			}
			return text;
		} catch (Exception e) {
			e.printStackTrace();
			return "上传失败!";
		}
	}
	/**
	 * 返回随机主键32位
	 * @return
	 */
	public String getUuidValue() {
		return java.util.UUID.randomUUID().toString().replaceAll("-", "");
	}
	// @Transactional
	public String importDataByKq(List<Map<String, String>> list,String pid) {
		SimpleDateFormat kqdateFormat = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat kqtimeFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat timeFormat = new SimpleDateFormat(
		"HH:mm:ss");
		String text = "";
		try {
			String sql = "select t.PROPERTY_CODE CODE, t.PROPERTY_NAME NAME"
					+ " from view_property_code t "
					+ " where t.TYPE_NAME ="
					+ " (select p.uids from view_property_type p where p.TYPE_NAME = '考勤类别')";
			List<ListOrderedMap> situations = JdbcUtil.query(sql);
			Map<String, String> kq_map = new HashMap<String, String>();
			for (int i = 0; i < situations.size(); i++) {
				ListOrderedMap sqlmap = situations.get(i) ;
				//kq_map = new HashMap<String, String>();
				String name = sqlmap.get("NAME")==null?"":sqlmap.get("NAME").toString();
				String code = sqlmap.get("CODE")==null?"":sqlmap.get("CODE").toString();
				if(!"".equals(name) && !"".equals(code)){
					kq_map.put(name, code);
				}
			}
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				RzglKqglKqImport kq = new RzglKqglKqImport();
//				kq.setUids(getUuidValue());
				kq.setPid(pid);
				// info.setUserid(uids);
				kq.setUserNum(map.get("userNum") == null ? "" : map
						.get("userNum"));
				// 导入模板中"部门"为下拉框选择
				List<String> depts = this.rzglMainDao
						.getDataAutoCloseSes("select t.UIDS from VIEW_UNIT t where t.REALNAME = '"
								+ (map.get("dept")) + "' and t.PARENT_UIDS='1030901'");
				String deptId = "";
				if (depts == null || depts.size() < 1) {
					kq.setDeptId("");
				} else {
					deptId = depts.get(0);
					kq.setDeptId(deptId);
				}
				List<String> userids = this.rzglMainDao
						.getDataAutoCloseSes("select t.userid from hr_man_info t "
								+ "where  t.posname='"
								+ map.get("dept")
								+ "' "
								//+ "and t.usernum='"
								//+ map.get("userNum")
								//+ "' "
								+ "and t.realname='"
								+ map.get("userName")
								+ "'");
				String userid = "";
				if (userids == null || userids.size() < 1) {
//					text = (new StringBuilder(String.valueOf(text))).append("模板中用户【"+map.get("userName")+"】第【").append(i + 5).append("】行 用户信息不存在;\\n").toString();
//					continue;
				} else {
					userid = userids.get(0);
					kq.setUserId(userid);
				}

				String kqDate = map.get("kqDate");
				if (!"".equals(kqDate) && kqDate != null) {
					kq.setKqDate(kqdateFormat.parse(kqDate));
				} else {
					kq.setKqDate(null);
				}
				String startTimeAm = map.get("startTimeAm");
				String startAm = "";
				if (!"".equals(startTimeAm) && startTimeAm != null) {
					startAm = timeFormat.format(kqtimeFormat.parse(startTimeAm));
					kq.setKqStarttimeAm(kqtimeFormat.parse(startTimeAm));
				} else {
					kq.setKqStarttimeAm(null);
				}
				String endTimeAm = map.get("endTimeAm");
				String endAm = "";
				if (!"".equals(endTimeAm) && endTimeAm != null) {
					endAm = timeFormat.format(kqtimeFormat.parse(endTimeAm));
					kq.setKqEndtimeAm(kqtimeFormat.parse(endTimeAm));
				} else {
					kq.setKqEndtimeAm(null);
				}
				String startTimePm = map.get("startTimePm");
				String startPm = "";
				if (!"".equals(startTimePm) && startTimePm != null) {
					startPm = timeFormat.format(kqtimeFormat.parse(startTimePm));
					kq.setKqStarttimePm(kqtimeFormat.parse(startTimePm));
				} else {
					kq.setKqStarttimePm(null);
				}
				String endTimePm = map.get("endTimePm");
				String endPm = "";
				if (!"".equals(endTimePm) && endTimePm != null) {
					endPm = timeFormat.format(kqtimeFormat.parse(endTimePm));
					kq.setKqEndtimePm(kqtimeFormat.parse(endTimePm));
				} else {
					kq.setKqEndtimePm(null);
				}
				List<Object[]> times = this.rzglMainDao
						.getDataAutoCloseSes("select to_char(t.on_worktime_am,'hh24:mi:ss') on_worktime_am,"
								+ "to_char(t.off_worktime_am,'hh24:mi:ss') off_worktime_am,"
								+ "to_char(t.on_worktime_pm,'hh24:mi:ss') on_worktime_pm,"
								+ "to_char(t.off_worktime_pm,'hh24:mi:ss') off_worktime_pm "
								+ "from rzgl_kqgl_worktime_set t "
								+ "where t.start_time <=(to_date('"
								+ kqDate
								+ "','yyyy-MM-dd')) "
								+ "and t.end_time>=(to_date('"
								+ kqDate
								+ "','yyyy-MM-dd'))");
				String on_worktime_am = "";
				String off_worktime_am = "";
				String on_worktime_pm = "";
				String off_worktime_pm = "";
				if (times.size() > 0) {
					Object[] arr = times.get(0);
					on_worktime_am = arr[0].toString();
					off_worktime_am = arr[1].toString();
					on_worktime_pm = arr[2].toString();
					off_worktime_pm = arr[3].toString();
				}

				if ("".equals(startTimeAm)) {
					kq.setKqSituationAm(kq_map.get(RzglConstant.KUANGGONG));
				} else {
					int result = startAm.compareTo(on_worktime_am);
					if (result > 0) {
						kq.setKqSituationAm(kq_map.get(RzglConstant.CHIDAO));
					} else {
						kq.setKqSituationAm(kq_map.get(RzglConstant.CHUQIN));
						int result1 = 0;
						if(!"".equals(endTimeAm)){
							result1 = endAm.compareTo(off_worktime_am);
						}
						if (result1 < 0) {
							kq.setKqSituationAm(kq_map.get(RzglConstant.ZAOTUI));
						}
					}
				}
				if ("".equals(endTimePm)) {
					kq.setKqSituationPm(kq_map.get(RzglConstant.KUANGGONG));
				} else {
					int result = endPm.compareTo(off_worktime_pm);
					if (result < 0) {
						kq.setKqSituationPm(kq_map.get(RzglConstant.ZAOTUI));
					} else {
						kq.setKqSituationPm(kq_map.get(RzglConstant.CHUQIN));
					}
				}
				List<RzglKqglKqImport> imports = rzglMainDao
						.findByWhere(RzglKqglKqImport.class.getName(), "deptId='" + deptId
								+ "' " + "and kqDate = to_date('" + kqDate
								+ "','yyyy-MM-dd') and userId='" + userid + "'");
				System.out.println(imports.size()+">>>>>>>>>>");
				if (imports.size() > 0) {// 覆盖已经导入过了的数据
					RzglKqglKqImport im = imports.get(0);
					im.setKqStarttimeAm(kq.getKqStarttimeAm());
					im.setKqEndtimeAm(kq.getKqEndtimeAm());
					im.setKqStarttimePm(kq.getKqStarttimePm());
					im.setKqEndtimePm(kq.getKqEndtimePm());
					im.setKqSituationAm(kq.getKqSituationAm());
					im.setKqSituationPm(kq.getKqSituationPm());
					rzglMainDao.saveOrUpdate(im);
				} else {
					rzglMainDao.insert(kq);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			// return
			// "导入失败！\\n导入文件数据出现异常，请检查后重新导入!\\n系统错误信息如下：\\n"+e.getLocalizedMessage();
			return "导入失败！";
		}
		return "导入成功！";
	}

	// qiupy
	/**
	 * 当前模块是否包含流程
	 */
	@Override
	public String containsFlow(String unitId, String modId) {
		String hasFlow="false";
		String rtnState=systemMgm.getFlowType(unitId,modId);
		if("BusinessProcess".equals(rtnState)){
		    hasFlow="true";
		}else{
			hasFlow="false";
		}
		return hasFlow;
	}
}
