package com.sgepit.pmis.rlzj.service;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.CellRangeAddress;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfo;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.UUIDGenerator;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.rlzj.hbm.HrAccountSet;
import com.sgepit.pmis.rlzj.hbm.HrManInfo;
import com.sgepit.pmis.rlzj.hbm.HrSalaryMaster;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplate;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateItem;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateUser;
import com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateView;
import com.sgepit.pmis.rlzj.hbm.HrSalaryType;
import com.sgepit.pmis.rlzj.util.FormulaUtil;
import com.sgepit.pmis.rlzj.util.XgridBean;

public class RlzyXcglMgmImpl extends BaseMgmImpl implements RlzyXcglMgmFacade {
	private SystemDao systemDao;

	public SystemDao getSystemDao() {
		return systemDao;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}
	
	/**
	 * 工资类型添加时，保存前检查类型名称是否存在
	 * @param temp
	 * @return true 不存在，fasle 存在
	 */
	public boolean validateName(HrSalaryType temp){
		List listType =  this.systemDao.findByWhere("com.sgepit.pmis.rlzj.hbm.HrSalaryType"," name = '"+temp.getName()+"'");
		if(listType.size()>0){
			for(int i=0;i<listType.size();i++){
				HrSalaryType hr = (HrSalaryType)listType.get(i);
				if(!hr.getUids().equals(temp.getUids())){
					return false;
				}
			}
		}
		return true;
	}
	
	
	/**
	 * 保存工资单类型
	 * @param temp 工资单对象
	 * @return
	 */
	public boolean saveSalType(HrSalaryType temp){
		String where = " uids = '"+temp.getUids()+"'";
		List list =  this.systemDao.findByWhere("com.sgepit.pmis.rlzj.hbm.HrSalaryType", where);
		if(list.size()<=0){
			try{
				HrSalaryType salaryType = new HrSalaryType();
				//salaryType.setUids(temp.getUids());
				salaryType.setName(temp.getName());
				salaryType.setCode(temp.getCode());
				salaryType.setSendType(temp.getSendType());
				salaryType.setState(temp.getState());
				this.systemDao.insert(salaryType);
			}catch(BusinessException e){
				e.printStackTrace();
				return false;
			}
		}
		else{
			try{
				HrSalaryType salaryType = (HrSalaryType)list.get(0);
				salaryType.setName(temp.getName());
				salaryType.setCode(temp.getCode());
				salaryType.setSendType(temp.getSendType());
				salaryType.setState(temp.getState());
			}catch(BusinessException e){
				e.printStackTrace();
			}
		}
		return true;
	}
	
	/**
	 *删除工资类型时对类型的是否正在使用的验证
	 * @param uids 工资类型主键
	 * @return false 使用中，true 未使用
	 */
	public boolean deleteVerify(String uids,String pid){
		String salaryType = uids.trim();
		String where = " salaryType = '"+uids+"' and pid = '"+pid+"' ";
		List listTemp = this.systemDao.findByWhere("com.sgepit.pmis.rlzj.hbm.HrSalaryTemplate",where);
		if(listTemp.size()>0){
			return false;
		}
		List listMaster = this.systemDao.findByWhere("com.sgepit.pmis.rlzj.hbm.HrSalaryMaster",where);
		if(listMaster.size()>0){
			return false;
		}
		return true;	
	}
	
	
	/**
	 *套帐模板新增保存
	 *@param obj套帐模板对象；
	 */
	public boolean InsertTz(HrAccountSet hras){
		String code = hras.getCode()==null?"":hras.getCode();
		String name= hras.getName()==null?"":hras.getName();
		String remark = hras.getRemark()==null?"":hras.getRemark();
		String state = hras.getState()==null?"":hras.getState();
		String uids = hras.getUids()==null?"":hras.getUids();
		String formula = hras.getFormula()==null?"":hras.getFormula();
		String items = hras.getItems()==null?"":hras.getItems();
		String deptid = hras.getDeptid()==null?"":hras.getDeptid();
		String pid = hras.getPid()==null?"":hras.getPid();
		if(!uids.equals("")){
			HrAccountSet hrAccountSet =  (HrAccountSet) this.systemDao.findById("com.sgepit.pmis.rlzj.hbm.HrAccountSet", uids);
			hrAccountSet.setCode(code);
			hrAccountSet.setFormula(formula);
			hrAccountSet.setItems(items);
			hrAccountSet.setName(name);
			hrAccountSet.setState(state);
			hrAccountSet.setRemark(remark);
			hrAccountSet.setDeptid(deptid);
			hrAccountSet.setPid(pid);
			this.systemDao.saveOrUpdate(hrAccountSet);
		}else{
			try{
				HrAccountSet ha = new HrAccountSet();
				ha.setCode(code);
				ha.setFormula(hras.getFormula());
				ha.setItems(hras.getItems());
				ha.setName(name);
				ha.setRemark(remark);
				ha.setState(state);
				ha.setDeptid(deptid);
				ha.setPid(pid);
				this.systemDao.saveOrUpdate(ha);
			}
			catch(Exception e){
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 删除模板
	 * @param uids
	 * @return 0：删除成功，1：模板已经被使用，不能删除，2：系统错误
	 * @author zhangh
	 * @since 2011-06-27
	 */
	public String deleteTemplateByUids(String uids){
		try {
			String beanName = HrSalaryMaster.class.getName(); 
			List<HrSalaryMaster> list = this.systemDao.findByWhere(beanName, "templateId='"+uids+"'");
			if(list.size()>0){
				return "1";
			}else{
				//删除模板对应的科目和参数
				String sql1 = "delete from hr_salary_template_item where template_id = '"+uids+"'";
				JdbcUtil.execute(sql1);
				//删除模板对应的用户
				String sql2 = "delete from hr_salary_template_user where template_id = '"+uids+"'";
				JdbcUtil.execute(sql2);
				//删除模板
				String sql = "delete from hr_salary_template where uids = '"+uids+"'";
				JdbcUtil.execute(sql);
				
				//删除模板的大对象信息；
				XgridBean xgridBean = new XgridBean();
				xgridBean.deleteTemplateBlob(uids);
				return "0";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "2";
		}
	}
	
	/**
	 * 为模板设置公式和对应的科目
	 * @param zbSeqnoArr 科目主键id
	 * @param formula 公式
	 * @param uids 模板表主键id
	 * @return
	 * @author zhangh
	 * @since 2011-06-23
	 */
	public boolean getItemAndFormulaToTemplate(String[] zbSeqnoArr,String formula,String uids){
		try {
			List<HrSalaryTemplateItem> list = new ArrayList<HrSalaryTemplateItem>();
			String where = "";
			//修改时删除已经有但本次没有选中的
			String no = Arrays.toString(zbSeqnoArr);
			no = no.substring(1, no.length() - 1);
			String delSql = "delete from Hr_Salary_Template_Item where template_id = '"+uids+"' and item_id not in ("+no+") and type = 'ITEM'";
			if(zbSeqnoArr.length>0)JdbcUtil.execute(delSql);
			
			for (int i = 0; i < zbSeqnoArr.length; i++) {
				where = "templateId = '"+uids+"' and itemId = "+zbSeqnoArr[i]+"";
				list = this.systemDao.findByWhere(HrSalaryTemplateItem.class.getName(),where);
				if(list.size()==0){
					HrSalaryTemplateItem item = new HrSalaryTemplateItem();
					item.setItemId(zbSeqnoArr[i].replaceAll("'",""));
					item.setTemplateId(uids);
					item.setType("ITEM");
					this.systemDao.insert(item);
				}
			}
			//保存代码格式的公式
			String sql = "update Hr_Salary_Template set formula='"+formula+"' where uids='"+uids+"'";
			JdbcUtil.update(sql);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	
	/**
	 * 为模板设置参数（HR_SALARY_BASIC_INFO表中用户相关信息）
	 * @param uidsArr 参数主键id
	 * @param uids 模板表主键id
	 * @return
	 * @author zhangh
	 * @since 2011-06-24
	 */
	public boolean getParamToTemplate(String[] uidsArr,String uids){
		try {
			List<HrSalaryTemplateItem> list = new ArrayList<HrSalaryTemplateItem>();
			String where = "";
			//修改时删除已经有但本次没有选中的
			String no = Arrays.toString(uidsArr);
			no = no.substring(1, no.length() - 1);
			String delSql = "delete from Hr_Salary_Template_Item where template_id = '"+uids+"' and item_id not in ("+no+") and type = 'PARAM'";
			if(uidsArr.length>0)JdbcUtil.execute(delSql);
			
			for (int i = 0; i < uidsArr.length; i++) {
				where = "templateId = '"+uids+"' and itemId = "+uidsArr[i]+"";
				list = this.systemDao.findByWhere(HrSalaryTemplateItem.class.getName(),where);
				if(list.size()==0){
					HrSalaryTemplateItem item = new HrSalaryTemplateItem();
					item.setItemId(uidsArr[i].replaceAll("'",""));
					item.setTemplateId(uids);
					item.setType("PARAM");
					this.systemDao.insert(item);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 添加模板对应的用户
	 * @author zhangh
	 * @since 2011-06-27
	 */
	public boolean insertUserToTemplateUser(String[] useridArr,String uids){
		try {
			String where = "";
			List list = new ArrayList();
			for (int i = 0; i < useridArr.length; i++) {
				where = "templateId = '"+uids+"' and userid = "+useridArr[i]+"";
				list = this.systemDao.findByWhere(HrSalaryTemplateUser.class.getName(),where);
				if(list.size()==0){
					HrSalaryTemplateUser user = new HrSalaryTemplateUser();
					user.setUserid(useridArr[i].replaceAll("'",""));
					user.setTemplateId(uids);
					this.systemDao.insert(user);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 删除模板对应的用户
	 * @author zhangh
	 * @since 2011-06-27
	 */
	public boolean deleteUserFromTemplateUser(String[] useridArr,String uids){
		try {
			List list = new ArrayList();
			for (int i = 0; i < useridArr.length; i++) {
				list = this.systemDao.findByWhere(HrSalaryTemplateUser.class.getName(), "userid="+useridArr[i]+" and templateId='"+uids+"'");
				if(list.size()>0){
					this.systemDao.deleteAll(list);
				}
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 模板选择用户时读取用户
	 * @author zhangh
	 * @since 2011-06-27
	 */
	public List<HrSalaryTemplateUser> findUserInfoByTemplate(String orderby, Integer start,
			Integer limit, HashMap<String, String> orgid) {
		String templateId = (String) orgid.get("templateId");
		String posid = (String) orgid.get("posid");
		String selected = (String) orgid.get("selected");
		String posId = (String) orgid.get("posId");
		String where = "1 = 1";
		if(posid!=null&&!posid.equals("")) where = "POSID in ("+posid+")";

		String sql = "select {t1.*}, {t.*} from (select * FROM  HR_MAN_INFO h WHERE "+where+" " +
				"and posid in (select UNITID from SGCC_INI_UNIT where unit_type_id not in ('7') " +
				"start with unitid = '"+posId+"' connect by prior unitid=upunit)) t1 " +
				" left outer join (select * from HR_SALARY_TEMPLATE_USER WHERE template_id ='"+templateId+"') t " +
				" on t1.userid=t.userid";

		if(selected!=null&&selected.equals("true")) {
			sql = sql + " where t.uids is not null";
		}else{
			sql = sql + " where t1.userid not in " +
					"(select userid from HR_SALARY_TEMPLATE_USER WHERE template_id = '"+templateId+"')order by POSID,REALNAME asc";
		}
		Session ses = HibernateSessionFactory.getSession();
		SQLQuery query = ses.createSQLQuery(sql).addEntity("t1",
				HrManInfo.class).addEntity("t", HrSalaryTemplateUser.class);
		int size = query.list().size();
		if (start != null || limit != null) {
			query.setFirstResult(start.intValue());
			query.setMaxResults(limit.intValue());
		}
		List list = new ArrayList();
		List l1 = query.list();
		for (int i = 0; i < l1.size(); i++) {
			Object[] objs = (Object[]) l1.get(i);
			HrManInfo manInfo = (HrManInfo) objs[0];
			HrSalaryTemplateUser user = (HrSalaryTemplateUser) objs[1];

			if (user != null) {
				user.setManInfo(manInfo);
			} else {
				user = new HrSalaryTemplateUser();
				user.setManInfo(manInfo);
			}
			list.add(user);
		}
		list.add(size);
		return list;
	}
	
	/**
	 * 工资录入中处理工资月份数据
	 * @param unitId
	 * @return
	 * @author zhangh
	 * @since 2011-06-30
	 */
	public List<String> getSjTypeListFromSalaryMaster(String unitId,String salaryType,String pid){
		List<String> monthList = new ArrayList<String>();
		List<HrSalaryMaster> salaryList = new ArrayList<HrSalaryMaster>();
		if(salaryType.equals("BONUS")){
			salaryList = this.systemDao.findByWhere(
				"com.sgepit.pmis.rlzj.hbm.HrSalaryMaster", " salaryType = 'BONUS' and unit_id = '"+unitId+"' and pid = '"+pid+"' ", "sj_type desc");
			}
		else{
			salaryList = this.systemDao.findByWhere(
					"com.sgepit.pmis.rlzj.hbm.HrSalaryMaster", "salaryType is not 'BONUS' and pid = '"+pid+"' ", "sj_type desc");
		}
		String v_nowSj = DateUtil.getSystemDateTimeStr("yyyyMM") + "00";
		System.out.println(salaryList.size());
		if (salaryList.size() == 0) {
			monthList.add(v_nowSj);
		} else {
			if (salaryList.get(0).getSjType().compareTo(v_nowSj) < 0) {
				monthList.add(v_nowSj);
			}
			String tempSjType = "";
			for (int i = 0; i < salaryList.size(); i++) {
				String nextSjType = salaryList.get(i).getSjType();
				if (nextSjType != null && !tempSjType.equals(nextSjType)) {
					monthList.add(nextSjType);
					tempSjType = nextSjType;
				}
			}
		}
		return monthList;
	}
	
	/**
	 * 新建工资单中对工资模板的维护，保存模板中编辑的公式，如果该模板被使用，则新增一条模板记录
	 * @param uids	当前编辑的模板主键uids
	 * @param formula	当前编辑过的公式
	 * @return 0：保存成功；1：已经被使用，新增；2：系统错误
	 * @author zhangh
	 * @since 2011-06-30
	 */
	public String saveTempFormula(String uids,String formula){
		try {
			Map<String, String> map = FormulaUtil.getFormulasVariables(formula);
			System.out.println(map);
			List list = this.systemDao.findByWhere(HrSalaryMaster.class.getName(), "templateId = '"+uids+"'");
			HrSalaryTemplate temp = (HrSalaryTemplate) this.systemDao.findById(HrSalaryTemplate.class.getName(), uids);
			if(list.size()>0){
				//模板已经被使用过，新加入一条
				HrSalaryTemplate newTemp = new HrSalaryTemplate();
				newTemp.setRemark(temp.getRemark());
				newTemp.setSalaryType(temp.getSalaryType());
				newTemp.setSjType(temp.getSjType());
				newTemp.setState(temp.getState());
				newTemp.setTemplateName(temp.getTemplateName());
				newTemp.setXgridTitle("0");
				newTemp.setFormula(formula);
				newTemp.setTemplateDept(temp.getTemplateDept());
				newTemp.setPid(temp.getPid());
				this.systemDao.insert(newTemp);
				
				Iterator<String> varIter = map.keySet().iterator();
				while (varIter.hasNext()) {
					String varTemp = varIter.next();
					HrSalaryTemplateItem item = new HrSalaryTemplateItem();
					if(varTemp.startsWith("ITEM")){
						item.setTemplateId(newTemp.getUids());
						item.setItemId(varTemp.substring(5));
						item.setType("ITEM");
					}else if(varTemp.startsWith("PARAM")){
						item.setTemplateId(newTemp.getUids());
						item.setItemId(varTemp.substring(6));
						item.setType("PARAM");
					}
					this.systemDao.insert(item);
				}
				return "1,"+newTemp.getUids();
			}else{
				//模板没有被使用过，直接修改，并判断是否有新增的科目，
				//新增的科目或者参数更新到Hr_Salary_Template，并由前台DWR重新生成表头
				String delSql = "delete from Hr_Salary_Template_Item where template_id = '"+uids+"'";
				JdbcUtil.execute(delSql);
				Iterator<String> varIter = map.keySet().iterator();
				while (varIter.hasNext()) {
					String varTemp = varIter.next();
					HrSalaryTemplateItem item = new HrSalaryTemplateItem();
					if(varTemp.startsWith("ITEM")){
						item.setTemplateId(uids);
						item.setItemId(varTemp.substring(5));
						item.setType("ITEM");
					}else if(varTemp.startsWith("PARAM")){
						item.setTemplateId(uids);
						item.setItemId(varTemp.substring(6));
						item.setType("PARAM");
					}
					this.systemDao.insert(item);
				}
				String sql = "update Hr_Salary_Template set formula = '"+formula+"' where uids = '"+uids+"'";
				JdbcUtil.update(sql);
				return "0,"+uids;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "2";
		}
	}

	/**
	 * 新建工资单对工资模板的维护
	 * @param obj工资模板对象
	 * @since 2011-06-27
	 * 
	 */
	public boolean saveTemp(HrSalaryTemplateView temp){
		List<HrSalaryTemplate> list =new ArrayList<HrSalaryTemplate>();
		List<HrSalaryTemplateItem> listim = new ArrayList<HrSalaryTemplateItem>(); 
		list = this.systemDao.findByProperty("com.sgepit.pmis.rlzj.hbm.HrSalaryTemplate", "uids", temp.getUids());
		String formula =temp.getFormula()==null?"":temp.getFormula();
		String items = temp.getItemId()==null?"":temp.getItemId();
		String xgridTitle = temp.getXgridTitle();
		if(list.size()>0){
			try{
				HrSalaryTemplate hstv = (HrSalaryTemplate)list.get(0);
				listim = this.systemDao.findByProperty("com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateItem", "templateId", hstv.getUids());
				if(listim.size()>0){
					HrSalaryTemplateItem hsti = listim.get(0);
					hsti.setItemId(items);
					this.systemDao.saveOrUpdate(hsti);
				}
				hstv.setXgridTitle(xgridTitle);
				hstv.setFormula(formula);
				this.systemDao.saveOrUpdate(hstv);				
			}catch(Exception e){
				e.printStackTrace();
				return false;
			}
		}
		else{
			return false;
		}
		return true;
		
	}
	
	
	/**
	 * 保存工资单主记录信息
	 * 
	 * @param master
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	public String saveSalaryMaster(HrSalaryMaster master) {
		System.out.println(master.getTemplateId()+"xxxxxxxxxxxxx");
		return systemDao.insert(master);
	}

	
	/**
	 * 新增一个工资发放员工
	 * 
	 * @param userid
	 * @param master
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 27, 2011
	 */
	public String addDetailData(String userid, HrSalaryMaster master) {
		List<HrSalaryTemplateItem> itemList = systemDao.findByWhere(
				HrSalaryTemplateItem.class.getName(), "template_id='"
						+ master.getTemplateId() + "' and type='ITEM'");
		for (int i = 0; i < itemList.size(); i++) {
			String sql = "merge into HR_SALARY_DETAIL tab1"
					+ " using ( select "
					+ " '"
					+ master.getSjType()
					+ "' as sj_type,"
					+ " (select posid from hr_man_info where userid='"
					+ userid
					+ "') as dept_id,"
					+ " '"
					+ userid
					+ "' as userid, '"
					+ itemList.get(i).getItemId()
					+ "' as item_id, '"
					+ master.getUids()
					+ "' as report_id from dual) tab2"
					+ " on (tab1.userid = tab2.userid and tab1.item_id = tab2.item_id and tab1.sj_type = tab2.sj_type)"
					+ " when not matched THEN"
					+ " inSert (UIDS, SJ_TYPE, DEPT_ID, USERID, ITEM_ID, REPORT_ID)"
					+ " VALUES ('"
					+ SnUtil.getNewID()
					+ "',tab2.sj_type, tab2.dept_id, tab2.userid, tab2.item_id, tab2.report_id)";
			System.out.println(sql);
			JdbcUtil.execute(sql);
		}

		return "OK";
	};

	/**
	 * 删除一个工资发放员工
	 * 
	 * @param userid
	 * @param reportId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 27, 2011
	 */
	public String deleteDetailData(String userid, String reportId) {
		String delSql = "delete from HR_SALARY_DETAIL where report_id='"
				+ reportId + "' and userid='" + userid + "'";
		JdbcUtil.execute(delSql);
		return "OK";
	};
	
	/**
	 * 获取工资单的主记录信息
	 * 
	 * @param unitId
	 * @param sjType
	 * @param salaryType
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	public HrSalaryMaster getSalaryMaster(String unitId, String sjType,
			String salaryType, String pid) {
		System.out.println(unitId);
		List<HrSalaryMaster> list = systemDao.findByWhere(HrSalaryMaster.class
				.getName(), " unit_id='" + unitId + "' and sj_type='" + sjType
				+ "' and salary_type='" + salaryType + "' and pid = '"+pid+"'");
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	
	/**
	 * 删除工资单主记录及明细记录信息
	 * 
	 * @param unitId
	 * @param sjType
	 * @param salaryType
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	public String deleteSalaryMaster(String unitId, String sjType,
			String salaryType, String pid) {
		String wherePart = " unit_id='" + unitId + "' and sj_type='" + sjType
				+ "' and salary_type='" + salaryType + "' and pid = '"+pid+"' ";
		String whereSql = "select uids from hr_salary_master where "
				+ wherePart;
		String delDetailSql = "delete from hr_salary_detail where report_id in ("
				+ whereSql + ")";
		String delMasterSql = "delete from hr_salary_master where " + wherePart;

		JdbcUtil.execute(delDetailSql);
		JdbcUtil.execute(delMasterSql);

		return "OK";
	}

	/**
	 * 更新工资单主记录信息
	 * 
	 * @param master
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	public String updateSalaryMaster(HrSalaryMaster master) {
		systemDao.saveOrUpdate(master);
		return "OK";
	}
	
	/**
	 * 根据工资单主记录ID，获取工资单发放的人员信息
	 * 
	 * @param reportId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 27, 2011
	 */
	public String getSalaryUserByReportId(String reportId) {
		String sql = "select distinct userid from hr_salary_detail where report_id='"
				+ reportId + "'";
		List list = JdbcUtil.query(sql);
		String userIds = "";
		for (int i = 0; i < list.size(); i++) {
			String userid = ((Map<String, String>) list.get(i)).get("userid");
			userIds += "`" + userid;
		}
		if (userIds.length() > 0) {
			userIds = userIds.substring(1);
		}
		// System.out.println(userIds);
		return userIds;
	}
	
	/**
	 * 根据unitid Detail表初始化数据
	 * 
	 * @param unitid
	 * @param master
	 * @return
	 */

	public String initDetailData(String temId, String unitid) {
		Connection conn = null;
		try {
			conn = HibernateSessionFactory.getConnection();
			Statement stmt = conn.createStatement();
			HrSalaryMaster tem = (HrSalaryMaster) systemDao.findById(
					HrSalaryMaster.class.getName(), temId);

			List<HrSalaryTemplateItem> itemList = systemDao.findByWhere(
					HrSalaryTemplateItem.class.getName(), "template_id='"
							+ tem.getTemplateId() + "' and type='ITEM'");

			List<HrManInfo> userList = systemDao.findByWhere(HrManInfo.class
					.getName(), " posid='" + unitid + "'");

			for (int i = 0; i < userList.size(); i++) {
				for (int j = 0; j < itemList.size(); j++) {
					String sql = "merge into HR_SALARY_DETAIL tab1"
							+ " using ( select "
							+ " '"
							+ tem.getSjType()
							+ "' as sj_type,"
							+ " '"
							+ unitid
							+ "' as dept_id,"
							+ " '"
							+ userList.get(i).getUserid()
							+ "' as userid, '"
							+ itemList.get(j).getItemId()
							+ "' as item_id, '"
							+ tem.getUids()
							+ "' as report_id from dual) tab2"
							+ " on (tab1.userid = tab2.userid and tab1.item_id = tab2.item_id and tab1.sj_type = tab2.sj_type)"
							+ " when not matched THEN"
							+ " inSert (UIDS, SJ_TYPE, DEPT_ID, USERID, ITEM_ID, REPORT_ID)"
							+ " VALUES ('"
							+ SnUtil.getNewID()
							+ "',tab2.sj_type, tab2.dept_id, tab2.userid, tab2.item_id, tab2.report_id)";
					stmt.addBatch(sql);
				}
			}
			stmt.executeBatch();
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return "OK";
	}
	/**
	 * 生成工资统计查询xgrid
	 * 
	 * @param startSjType
	 * @param endSjType
	 * @param deptIds
	 * @param userIds
	 * @param itemIds
	 * @param typeIds
	 * @return
	 */
	public String getSalaryStatisticXml(String startSjType, String endSjType,
			String deptIds[], String[] userIds, String[] itemIds,
			String[] typeIds, String[] userDetailItems,String pid) {

		// 防止传入空数组
		String[] curDeptIds = null;
		if (deptIds != null) {
			if (deptIds.length > 0) {
				curDeptIds = deptIds;
			}
		}
		String[] curUserIds = null;
		if (userIds != null) {
			if (userIds.length > 0) {
				curUserIds = userIds;
			}
		}
		if (itemIds == null)
			itemIds = new String[0];
		if (typeIds == null)
			typeIds = new String[0];

		// 配置查询的sql语句
		// 查询选择的用户
		String useridInStr = "";
		String userIdInStrTemp = "";

		if (curUserIds != null) {
			for (String uid : curUserIds) {
				useridInStr += String.format(" '%s',", uid);
			}
			useridInStr = useridInStr.substring(0, useridInStr.length() - 1);
			useridInStr = " and d.userid in (" + useridInStr + ") ";
		}
		// 查询选择的部门
		String deptidInStr = "";
		if (curDeptIds != null) {
			for (String uid : curDeptIds) {
				deptidInStr += String.format(" '%s',", uid);
			}
			deptidInStr = deptidInStr.substring(0, deptidInStr.length() - 1);
			deptidInStr = " and d.dept_id in (" + deptidInStr + ") ";
		}
		// 查询选择的科目
		String itemInStr = "";
		if (itemIds.length > 0) {
			for (String uid : itemIds) {
				itemInStr += String.format(" '%s',", uid.split("-")[0]);
			}
			itemInStr = itemInStr.substring(0, itemInStr.length() - 1);
			itemInStr = " and d.item_id in (" + itemInStr + ") ";
		}
		// 查询选择的类别
		String typeInStr = "";
		//区别时工资还是奖金
		Boolean bonusType = false;
		// stateInStr 根据类别增加状态参数，工资：send_state 奖金：state
		String stateInStr = " and m.send_state = '1' ";
		if (typeIds.length > 0) {
			for (String uid : typeIds) {
				typeInStr += String.format("'%s',", uid.split("-")[0]);
			}
			typeInStr = typeInStr.substring(0, typeInStr.length() - 1);
			if (typeInStr.equals("'BONUS'")) {
				bonusType = true;
				stateInStr = " and m.state = '3' ";
			}
			typeInStr = " and m.salary_type in (" + typeInStr + ") ";
		}

		// 配置表头xml
		String xmlStr = "";
		xmlStr += "<rows><head>";
		xmlStr += "<column id=\"rowno\" width=\"30\" type=\"ro\" align=\"center\" sort=\"str\">序号</column>";
		xmlStr += "<column id=\"postTime\" width=\"100\" type=\"ro\" align=\"center\" sotr=\"str\">发放时间</column>";
		xmlStr += "<column id=\"deptName\" width=\"80\" type=\"ro\" align=\"center\" sort=\"str\" >部门</column>";
		xmlStr += "<column id=\"userName\" width=\"70\" type=\"ro\" align=\"center\" sort=\"str\" >员工</column>";

		// 不选科目则查询所有
		if (itemIds == null || itemIds.length == 0) {
			List<SgccGuidelineInfo> list = this.systemDao.findByWhere(
					SgccGuidelineInfo.class.getName(),
					"parentid='005' and state=1", " zbSeqno");
			String str = "";
			for (SgccGuidelineInfo info : list) {
				str += String.format("%s-", info.getZbSeqno())
						+ String.format("%s,", info.getRealname());
			}
			if(str!=""){
				str = str.substring(0, str.length() - 1);
				itemIds = str.split(",");				
			}
		}
		int total = 0;
		String sql = "select d.sj_type, s.unitname, r.realname,d.userid, d.item_id, d.value, m.salary_type, t.name "
				+ " from hr_salary_detail d, hr_salary_master m, hr_salary_type t,rock_user r, sgcc_ini_unit s, sgcc_guideline_info i "
				+ " where m.pid='"+pid+"' and 1=1  "
				+ stateInStr
				+ " and d.userid = r.userid "
				+ " and d.dept_id = s.unitid "
				+ " and d.item_id = i.zb_seqno "
				+ " and t.uids = m.salary_type "
				+ " and d.report_id = m.uids "
				+ " and (d.sj_type between '"
				+ startSjType
				+ "' and '"
				+ endSjType
				+ "') "
				+ useridInStr
				+ deptidInStr
				+ itemInStr
				+ typeInStr
				+ " order by d.sj_type desc,d.dept_id, d.userid, d.item_id";

		System.out.println("sql>>>" + sql);
		List<Map<String, Object>> userList = JdbcUtil.query(sql);
		String columnStr = "";// 动态列的字符串
		String columnArr[] = null; // 动态列的数组
		// 用户详情表头,传递过来的userDetailItems格式如:HR_MAN_INFO.SEX,HR_MAN_INFO.PHONE
		Set hashSet = new HashSet(); // HashSet不添加重复的值
		if (userList != null && userList.size() > 0) {
			for (int i = 0; i < userList.size(); i++) {// 获取userList里面的userid
				Map<String, Object> map = userList.get(i);
				String userid = (String) map.get("USERID");
				hashSet.add(userid);

			}
			if (hashSet != null && hashSet.size() > 0) {// 将HashSet中不重复的值填到userIdInStrTemp中
				for (Iterator<String> it = hashSet.iterator(); it.hasNext();) {
					String userid = (String) it.next();
					userIdInStrTemp += String.format("'%s',", userid);
				}
				if (userIdInStrTemp != "" && !"null".equals(userIdInStrTemp)
						&& userIdInStrTemp != null) {
					userIdInStrTemp = userIdInStrTemp.substring(0,
							userIdInStrTemp.length() - 1);
				}

			}
			if (userDetailItems != null && userDetailItems.length > 0) {// 选了用户详情才做
				total = userDetailItems.length;
				for (int i = 0; i < total; i++) {
					String userDetailItem = userDetailItems[i];// userDetailItem如HR_MAIN_INFO.SEX
					String userDetailItemArr[] = userDetailItem.split("[.]");
					// userDetailItemArr[0]为表名,userDetailItemArr[1]为列名
					List<Map<String, Object>> userCodeToName = JdbcUtil
							.query("select name from hr_salary_basic_info hsbi where hsbi.config_info='"
									+ userDetailItem + "'");

					String itemSql = "";
					itemSql = "select hsbi.name,dt.userid,dt."
							+ userDetailItemArr[1]
							+ " as value from "
							+ userDetailItemArr[0]
							+ " dt,hr_salary_basic_info hsbi where dt.userid in ("
							+ userIdInStrTemp + ") and hsbi.config_info='"
							+ userDetailItem + "'";
					List<Map<String, Object>> userDetailItemList = JdbcUtil
							.query(itemSql);
					// 用户详情表头
					String uname = (String) userCodeToName.get(0).get("name");
					columnStr += userDetailItemArr[1] + ",";
					xmlStr += "<column  id=\""
							+ userDetailItemArr[1]
							+ "\"  width=\"70\" type=\"ro\" type2=\"detail\" align=\"center\" sort=\"str\">"
							+ uname + "</column>";

					if (userDetailItemList != null
							&& userDetailItemList.size() > 0) {
						// 将动态列的内容加入到最终产生xml的集合userList中去
						for (int u = 0; u < userDetailItemList.size(); u++) {
							Map<String, Object> map = userDetailItemList.get(u);
							String name = (String) map.get("name");
							String userid = (String) map.get("userid");
							String value = (String) map.get("value");

							for (int tt = 0; tt < userList.size(); tt++) {
								Map<String, Object> userMap = userList.get(tt);
								String uid = (String) userMap.get("USERID");
								if (userid.equals(uid)) {// 对比两个集合中的userid
									userMap.put(userDetailItemArr[1], value);

								}

							}

						}
					}

				}

			}
		}
		if (columnStr != null && columnStr != "") {// 产生动态列的数组供后面使用
			columnStr = columnStr.substring(0, columnStr.length() - 1);
			columnArr = columnStr.split(",");
		}

		// 工资科目表头
		Set itemHashSet = new HashSet(); // HashSet不添加重复的值
		String itemIdsTemp = "";
		List<Map<String,Object>> listItemArr = new ArrayList<Map<String,Object>>();
		if (bonusType) {
			//奖金模块配置科目
			if (userList != null && userList.size() > 0) {
				for (int i = 0; i < userList.size(); i++) {
					Map<String, Object> map = userList.get(i);
					String itemId = (String) map.get("ITEM_ID");
					itemHashSet.add(itemId);
				}
				if (itemHashSet != null && itemHashSet.size() > 0) {
					for (Iterator<String> it = itemHashSet.iterator(); it.hasNext();) {
						String itemId = (String) it.next();
						itemIdsTemp += String.format("'%s',", itemId);
					}
					if (itemIdsTemp != null && itemIdsTemp != "" && !itemIdsTemp.equals("null")) {
						itemIdsTemp = itemIdsTemp.substring(0,itemIdsTemp.length() - 1);
					}
				}
				if(itemIdsTemp!=null && itemIdsTemp.length()>0){
					String itemSql = "select t.zb_seqno||'-'||t.realname as items from sgcc_guideline_info t where parentid = '005' and t.zb_seqno in ("+itemIdsTemp+")";
					listItemArr = JdbcUtil.query(itemSql);
					if (listItemArr.size()>0) {
						for (int i = 0; i < listItemArr.size(); i++) {
							String[] itemArr = ((String) listItemArr.get(i).get("ITEMS")).split("-");
							String title = i == 0 ? "奖金科目" : "#cspan";
							xmlStr += "<column type1=\"item\" id=\""
									+ itemArr[0]
									+ "\" width=\"70\" type=\"ro\" align =\"center\" sort=\"str\" format=\"0.00\" >"
									+ title + "</column>";
						}
					}
				}
			}
		}else{
			//工资模块配置科目
			if (itemIds.length > 0) {
				for (int i = 0; i < itemIds.length; i++) {
					String[] itemArr = itemIds[i].split("-");
					String title = i == 0 ? "工资科目" : "#cspan";
					xmlStr += "<column type1=\"item\" id=\""
							+ itemArr[0]
							+ "\" width=\"70\" type=\"ro\" align =\"center\" sort=\"str\" format=\"0.00\" >"
							+ title + "</column>";
				}
			}
		}

		// 工资类别表头
		xmlStr += "<column id=\"typeArr\" width=\"80\" type=\"ro\" align =\"center\" sort=\"str\" >工资类别</column>";

		xmlStr += "<afterInit><call command=\"attachHeader\"><param>";
		String Constant = "#rspan,#rspan,#rspan,#rspan,";// 四个固定表头
		xmlStr += Constant;
		for (int c = 0; c < total; c++) {// 其他的动态表头根据动态列的个数来
			xmlStr += "#rspan,";
		}
		
		// 工资科目第二行表头
		if (bonusType) {
			//奖金模块配置科目
			if (listItemArr.size() > 0) {
				for (int i = 0; i < listItemArr.size(); i++) {
					String[] itemArr = ((String) listItemArr.get(i).get("ITEMS")).split("-");
					xmlStr += itemArr[1] + ",";
				}
			}
		}else{
			//工资模块配置科目
			if (itemIds.length > 0) {
				for (int i = 0; i < itemIds.length; i++) {
					String[] itemArr = itemIds[i].split("-");
					xmlStr += itemArr[1] + ",";
				}
			}
		}

		// 工资类别
		xmlStr += "#rspan";

		xmlStr += "</param></call></afterInit>";
		xmlStr += "</head></rows>";
		// 表头配置完成

		// 通过dom方式处理节点
		Document document = null;
		try {
			document = DocumentHelper.parseText(xmlStr);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		List<Element> list = document
				.selectNodes("rows/head/column[@type1='item']");// 选择科目动态列
		List<Element> listUserDetail = document
				.selectNodes("rows/head/column[@type2='detail']");// 选择详情动态列
		Element rows = document.getRootElement();
		int num = 1;
		for (int i = 0; i < userList.size(); i++) {
			Map<String, Object> map = userList.get(i);
			Element row = null;
			Element cell = null;
			String sjtype = (String) map.get("SJ_TYPE");
			sjtype = sjtype.substring(0, 4) + "年" + sjtype.substring(4, 6)
					+ "月" + sjtype.substring(6, 8) + "次";
			String unitname = (String) map.get("UNITNAME");
			String realname = (String) map.get("REALNAME");
			String itemid = (String) map.get("ITEM_ID");
			Object value = map.get("VALUE");
			String name = (String) map.get("NAME");
			row = (Element) rows.selectSingleNode("/rows/row[@id='" + sjtype
					+ "-" + unitname + "-" + realname + "']");
			if (row != null) {
				cell = (Element) rows.selectSingleNode("/rows/row[@id='"
						+ sjtype + "-" + unitname + "-" + realname
						+ "']/cell[@Index='" + itemid + "']");
				cell.setText(value == null ? "" : value + "");
			} else {
				row = rows.addElement("row");
				row
						.addAttribute("id", sjtype + "-" + unitname + "-"
								+ realname);
				cell = row.addElement("cell");
				cell.setText(num + "");
				cell = row.addElement("cell");
				cell.setText(sjtype);
				cell = row.addElement("cell");
				cell.setText(unitname);
				cell = row.addElement("cell");
				cell.setText(realname);

				// 动态用户详情表头设计
				for (int index = 0; index < listUserDetail.size(); index++) {
					// 有多少个动态列
					String trueValue = (String) map.get(columnArr[index]);// 得出动态列的数据
					Element el = (Element) listUserDetail.get(index); // 获取动态列并给其设置值
					String colId = el.attributeValue("id");
					cell = row.addElement("cell");
					cell.addAttribute("Index", colId);
					if (columnArr[index].equals("SEX")) {
						if ("0".equals(trueValue)) {
							cell.addCDATA("男");
						} else if ("1".equals(trueValue)) {
							cell.addCDATA("女");
						}
					} else if (columnArr[index].equals("ONTHEJOB")) {
						if ("0".equals(trueValue)) {
							cell.addCDATA("离职");
						} else if ("1".equals(trueValue)) {
							cell.addCDATA("在职");
						}
					} else {
						// System.out.println("trueValue********"+trueValue);
						cell.setText(trueValue == null
								|| "null".equals(trueValue) ? "" : trueValue);
					}
				}

				// 科目详细设计
				for (Iterator<Element> it = list.iterator(); it.hasNext();) {
					Element el = (Element) it.next();
					String colId = el.attributeValue("id");
					cell = row.addElement("cell");
					cell.addAttribute("Index", colId);
					if (colId.equals(itemid)) {
						cell.setText(value == null ? "" : value + "");
					} else {
						cell.setText("");
					}
				}

				cell = row.addElement("cell");
				cell.setText(name);
				num++;
			}
		}
		String xml = document.asXML();
		System.out.println(xml);
		return xml;

	}

	/**
	 * 根据xml数据生成excel
	 * 
	 * @param Xml
	 *            表数据
	 * 
	 * 
	 * @return
	 * @throws DocumentException
	 */

	public ByteArrayOutputStream getExcelTem(String Xml)
			throws DocumentException {
		if (!Xml.equals("") && Xml.length() > 0) {
			HSSFWorkbook wb = new HSSFWorkbook();

			Document document = DocumentHelper.parseText(Xml);
			HSSFSheet sheet = wb.createSheet("new sheet");

			Font headfont = wb.createFont();
			headfont.setFontName("黑体");
			headfont.setFontHeightInPoints((short) 12);// 字体大小
			headfont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);// 加粗
			// 标题行的样式
			CellStyle headstyle = wb.createCellStyle();
			headstyle.setFont(headfont);
			headstyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
			headstyle.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中
			headstyle.setLocked(true);
			short borderHeight = (short) 2;
			headstyle.setBorderBottom(borderHeight);
			headstyle.setBorderLeft(borderHeight);
			headstyle.setBorderRight(borderHeight);
			headstyle.setBorderTop(borderHeight);

			// 正文样式
			CellStyle datastyle = wb.createCellStyle();
			datastyle.setWrapText(true);
			short dataBorderHeight = (short) 1;
			datastyle.setBorderBottom(dataBorderHeight);
			datastyle.setBorderLeft(dataBorderHeight);
			datastyle.setBorderRight(dataBorderHeight);
			datastyle.setBorderTop(dataBorderHeight);

			// 起始行
			int rowIndex = 0;
			HSSFRow row = sheet.createRow((short) rowIndex);
			HSSFCell cell = null;

			// 单元格合并
			CellRangeAddress cellRange = null;
			int cellRangeRowF = rowIndex;
			int cellRangeRowL = rowIndex;
			int cellRangeColF = 0;
			int cellRangeColL = 0;

			// 打印所有除动态子表头外所有表头
			List<Element> list = document.selectNodes("/rows/head/column");
			for (int i = 0; i < list.size(); i++) {
				Element el = (Element) list.get(i);
				String colWidthStr = el.attributeValue("width");
				if (colWidthStr != null && colWidthStr.trim().length() > 0) {
					sheet.setColumnWidth(i, Integer.parseInt(colWidthStr) * 40);
				}
				String headerText = el.getTextTrim();

				if (!headerText.equals("#cspan")) {
					if (cellRangeColL > cellRangeColF) {
						cellRange = new CellRangeAddress(cellRangeRowF,
								cellRangeRowL, cellRangeColF, cellRangeColL);
						sheet.addMergedRegion(cellRange);
					}
					cellRangeColF = i;
					cell = row.createCell(i);
					cell.setCellValue(headerText);
					cell.setCellStyle(headstyle);
				} else {
					cellRangeColL = i;
					cell = row.createCell(i);
					cell.setCellValue("");
					cell.setCellStyle(headstyle);
				}
			}

			// 子表头
			List<Element> listkm = document
					.selectNodes("/rows/head/afterInit/call/param");
			for (int i = 0; i < listkm.size(); i++) {
				Element elkm = listkm.get(i);
				String s = elkm.getText().toString();
				s = s.replaceAll(" ", "");
				if (s.length() > 0) {
					rowIndex = rowIndex + 1;
					row = sheet.createRow((short) rowIndex);

					String column_lb[] = s.split(",");
					cellRange = null;
					for (int j = 0; j < column_lb.length; j++) {
						if (!column_lb[j].equals("#rspan")) {
							cell = row.createCell(j);
							cell.setCellValue(column_lb[j]);
							cell.setCellStyle(headstyle);
						} else {
							cell = row.createCell(j);
							cell.setCellValue("");
							cell.setCellStyle(headstyle);

							cellRange = new CellRangeAddress(rowIndex - 1,
									rowIndex, j, j);
							sheet.addMergedRegion(cellRange);
						}
					}
				}
			}

			// 打印所有数据
			List<Element> dataList = document.selectNodes("/rows/row");
			for (int i = 0; i < dataList.size(); i++) {
				Element dataRow = dataList.get(i);
				List<Element> cellList = dataRow.elements();

				rowIndex = rowIndex + 1;
				row = sheet.createRow((short) rowIndex);

				for (int j = 0; j < cellList.size(); j++) {
					cell = row.createCell(j);
					cell.setCellValue(cellList.get(j).getText());
					cell.setCellStyle(datastyle);
				}
			}

			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			try {
				wb.write(bos);
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return bos;
		} else {
			System.out.println("导出出错！！！！");
			return null;
		}

	}

	// 异步<asynchronism>
	/* (non-Javadoc)
	 * @see com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade2#getBulidTreeJsonForBonus(java.lang.String, java.lang.String)
	 */
	public String getBulidTreeJsonForBonus(String sjType, String deptId,String userBelongUnitid,String pid) {
		String sql = "select t.unitid,t.upunit,t.unitname,t.unit_type_id unitTypeId,p.remark,p.state,p.send_state,p.uids,p.unit_id," +
		"p.unit_id dept_id,p.send_user,to_char(p.send_time, 'yyyy-MM-dd hh24:mi:ss') " +
		"send_time,p.template_id,u.realname,t.leaf from (select * from (select distinct * from " +
		"(select * from sgcc_ini_unit start with unitid ='"+deptId+"' connect by prior upunit=unitid union all" +
		" select * from sgcc_ini_unit start with unitid in " +
		"(select unitid from (select t.* from sgcc_ini_unit t start with unitid ='"+userBelongUnitid+"' connect by prior" +
		" unitid=upunit) where unit_type_id='1') connect by prior unitid = upunit union all " +
		" select t.* from sgcc_ini_unit t start with unitid ='"+deptId+"' connect by prior unitid=upunit ) )t1 " +
		"where t1.unit_type_id not in('9') start with t1.unitid = '"+userBelongUnitid+"' connect by prior " +
		"t1.unitid=t1.upunit) t left join (select * from hr_salary_master where pid = '"+pid+"' and salary_type = 'BONUS' and " +
		"sj_type = '"+sjType+"'  and ( state is not null or state <> '0')) p " +
		"on t.unitid = p.unit_id left join rock_user u On p.send_user = u.userid";
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
		map.put("state", rs[5]);
		map.put("send_state", rs[6]);
		map.put("uids", rs[7]);
		map.put("unit_id", rs[8]);
		map.put("dept_id", rs[9]);
		map.put("send_user", rs[10]);
		map.put("send_time", rs[11]);
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
	private void addAttributesToUnitNode(JSONObject jsonObject,String sjType){
		jsonObject.put("unitname", jsonObject.get("unitname"));
		jsonObject.put("id", jsonObject.get("unitid"));
		jsonObject.put("unitTypeId", jsonObject.get("unitTypeId"));
		String title = (jsonObject.get("unitname") != null ?jsonObject.get("unitname").toString() : "")
				+ sjType.substring(0, 4) + "年" + sjType.substring(4, 6)
				+ "月第" + (sjType.substring(6, 8)) + "次" + "发放奖金";
		jsonObject.put("title", title);
		jsonObject.put("state", jsonObject.get("state"));
		jsonObject.put("send_state", jsonObject.get("send_state"));
		jsonObject.put("uids", jsonObject.get("uids"));
		jsonObject.put("unitId", jsonObject.get("unit_id"));
		jsonObject.put("deptId", jsonObject.get("dept_id"));
		jsonObject.put("send_time", jsonObject.get("send_time"));
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
			map.put("state", rs0[5]);
			map.put("send_state", rs0[6]);
			map.put("uids", rs0[7]);
			map.put("unit_id", rs0[8]);
			map.put("dept_id", rs0[9]);
			map.put("send_user", rs0[10]);
			map.put("send_time", rs0[11]);
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
	/**
	 * 公司按部门奖金信息汇总,输出xgrid
	 */
	public String getBonusStatisticXml(String[] unitids, String sjtype,String pid)
			throws Exception {

		// 根节点下传入过来的部门id
		String deptidInStr = "";
		if (unitids != null) {
			for (String uid : unitids) {
				deptidInStr += String.format(" '%s',", uid);
			}
			deptidInStr = deptidInStr.substring(0, deptidInStr.length() - 1);
		}

		// 配置表头xml
		String xmlStr = "";
		xmlStr += "<rows><head>";
		xmlStr += "<column id=\"rowno\" width=\"30\" type=\"ro\" align=\"center\" sort=\"str\">序号</column>";
		xmlStr += "<column id=\"deptName\" width=\"80\" type=\"ro\" align=\"center\" sort=\"str\" >部门</column>";
		// 查询汇总数据的所有科目
		List list = this.systemDao
				.getDataAutoCloseSes("select sgi.zb_seqno,sgi.realname from sgcc_guideline_info sgi where sgi.zb_seqno in (select hsd.item_id from hr_salary_detail hsd where hsd.report_id in (select uids from hr_salary_master hsm where hsm.sj_type='"
						+ sjtype
						+ "' and hsm.salary_type='BONUS' and hsm.pid='"+pid+"' and hsm.unit_id in (select unitid from sgcc_ini_unit t )))");
		String itemIds[] = null;
		String str = "";
		if (list != null && list.size() > 0) {// 限制条件
			for (int i = 0; i < list.size(); i++) {
				Object[] rs = (Object[]) list.get(i);
				str += String.format("%s-", (String) rs[0])
						+ String.format("%s,", (String) rs[1]);
			}
			if (str != "" && str != null) {
				str = str.substring(0, str.length() - 1);
				itemIds = str.split(",");
			}

		}
		// 奖金科目表头
		if (itemIds != null && itemIds.length > 0) {
			for (int i = 0; i < itemIds.length; i++) {
				String[] itemArr = itemIds[i].split("-");
				String title = i == 0 ? "奖金科目" : "#cspan";
				xmlStr += "<column type1=\"item\" id=\""
						+ itemArr[0]
						+ "\" width=\"70\" type=\"ro\" align =\"center\" sort=\"str\" format=\"0.00\" >"
						+ title + "</column>";
			}
		}
		xmlStr += "<column id=\"typeArr\" width=\"0\" type=\"ro\" align =\"center\" sort=\"str\" >space</column>";

		xmlStr += "<afterInit><call command=\"attachHeader\"><param>"; 
		String Constant = "#rspan,#rspan,";// 两个静态表头
		xmlStr += Constant;
		// 奖金科目第二行表头
		if (itemIds != null && itemIds.length > 0) {
			for (int i = 0; i < itemIds.length; i++) {
				String[] itemArr = itemIds[i].split("-");
				xmlStr += itemArr[1] + ",";
			}
		}
		xmlStr += "#rspan";
		xmlStr += "</param></call></afterInit>";
		xmlStr += "</head></rows>";
		// 查询部门的科目信息
		String sqlDepts = "select hsd.dept_id,siu.unitname, hsd.item_id,sum( hsd.value)deptValue from hr_salary_detail hsd,sgcc_ini_unit siu where hsd.dept_id in ("
				+ deptidInStr
				+ ")  and  hsd.report_id in (select hsm.uids from hr_salary_master hsm where hsm.sj_type='"
				+ sjtype
				+ "' and hsm.salary_type='BONUS' and state='3' and hsm.pid='"+pid+"') and hsd.dept_id=siu.unitid(+) group by  hsd.dept_id,siu.unitname, hsd.item_id order by  hsd.dept_id asc,hsd.item_id asc";
		List<Map<String, Object>> deptsList = JdbcUtil.query(sqlDepts);

		// 通过dom方式处理节点
		Document document = null;
		try {
			document = DocumentHelper.parseText(xmlStr);
		} catch (DocumentException e) {
			e.printStackTrace();
		}

		List<Element> listItems = document
				.selectNodes("rows/head/column[@type1='item']");// 选择科目动态列
		int size = 0;
		if (listItems != null)
			size = listItems.size();
		Element cellArr[] = new Element[size];
		String cellItemIds[] = new String[size];
		Element rows = document.getRootElement();
		int num = 1;
		String tempDept = "";
		Element row = null;
		Element cell = null;
		Element el = null;

		for (int i = 0; i < deptsList.size(); i++) {
			Map<String, Object> map = deptsList.get(i);
			String deptid = (String) map.get("DEPT_ID");
			String unitname = (String) map.get("UNITNAME");
			String itemid = (String) map.get("ITEM_ID");
			Object deptvalue = map.get("DEPTVALUE");

			if (tempDept.equals(deptid)) {// 部门ID相等的情况
				for (int c =0; c < size; c++) {
					if (deptvalue != null && cellItemIds[c].equals(itemid)) {
						cellArr[c].setText(deptvalue == null ? "" : deptvalue
								+ "");
					} 
				}
			} else {// 部门ID不相等的情况
				row = (Element) rows.selectSingleNode("/rows/row[@id='"
						+ deptid + "-" + unitname + "-" + itemid + "']");
				if (row != null) {
					cell = (Element) rows.selectSingleNode("/rows/row[@id='"
							+ deptid + "-" + unitname + "-" + itemid
							+ "']/cell[@Index='" + itemid + "']");
					cell.setText(deptvalue == null ? "" : deptvalue + "");
				} else {
					row = rows.addElement("row");
					row.addAttribute("id", deptid + "-" + unitname + "-"
							+ itemid);
					cell = row.addElement("cell");
					if (!tempDept.equals(deptid))
						cell.setText(num + "");
					cell = row.addElement("cell");
					if (!tempDept.equals(deptid))
						cell.setText(unitname);

					// 科目详细设计

					int c = 0;
					for (Iterator<Element> it = listItems.iterator(); it
							.hasNext();) {
						el = (Element) it.next();
						String colId = el.attributeValue("id");
						cell = row.addElement("cell");
						cell.addAttribute("Index", colId);
						if (colId.equals(itemid)) {

							cell.setText(deptvalue == null ? "" : deptvalue
									+ "");
						} else {
							cell.setText("");
						}
						cellArr[c] = cell;
						cellItemIds[c] = colId;
						c++;
					}

					if (!tempDept.equals(deptid))
						num++;
					tempDept = deptid;
				}
			}

		}
		String xml = document.asXML();
		return xml;
	}
}
