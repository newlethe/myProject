package com.sgepit.pmis.rlzj.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.commons.collections.map.ListOrderedMap;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.hibernate.Query;
import org.hibernate.Session;

import com.dhtmlx.connector.ComboConnector;
import com.dhtmlx.connector.ConnectorBehavior;
import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.DataItem;
import com.dhtmlx.connector.FormConnector;
import com.dhtmlx.connector.GridConnector;
import com.dhtmlx.connector.SortingRule;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.DhxUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.rlzj.dao.RzglMainDao;
import com.sgepit.pmis.rlzj.hbm.RzglKqglAskForLeave;
import com.sgepit.pmis.rlzj.hbm.RzglKqglKqAdjust;
import com.sgepit.pmis.rlzj.hbm.RzglKqglKqImport;
import com.sgepit.pmis.rlzj.hbm.RzglKqglOnBusiness;
import com.sgepit.pmis.rlzj.hbm.RzglKqglOvertime;
import com.sgepit.pmis.rlzj.hbm.RzglKqglWorktimeSet;
import com.sgepit.pmis.rlzj.util.RzglConstant;
/**
 * 考勤管理 Service
 * @author shuz
 */
public class RzglMainMgmImpl extends BaseMgmImpl implements RzglMainMgmFacade {
	private RzglMainDao rzglMainDao;
	private RzglMgmFacade rzglMgm;
	
	public RzglMainDao getRzglMainDao() {
		return rzglMainDao;
	}


	public void setRzglMainDao(RzglMainDao rzglMainDao) {
		this.rzglMainDao = rzglMainDao;
	}


	public RzglMgmFacade getRzglMgm() {
		return rzglMgm;
	}


	public void setRzglMgm(RzglMgmFacade rzglMgm) {
		this.rzglMgm = rzglMgm;
	}


	//shuz
	/**
	 * 从session获取pid
	 * @return
	 */
	public String getPid() {
		String pid = "";
		WebContext webContext = WebContextFactory.get();    
		if(webContext!=null){
			HttpSession session = webContext.getSession() ;
			//通过session获取pid，可以不从前台传递
			pid = session.getAttribute(Constant.CURRENTAPPPID).toString(); 
		}
		return pid;
	}
	
	
	/**
	 * 考勤管理工作时间设置读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getWorktimeSet(Map<String,String> map,GridConnector gridConnector){
		String pid = map.get("pid");
		String sql = "select t.uids,t.pid,t.sj_type," +
		"t.on_worktime_am,t.off_worktime_am,t.on_worktime_pm,t.off_worktime_pm,t.start_time,t.end_time " +
		"from RZGL_KQGL_WORKTIME_SET t order by t.start_time desc";
		class GridBehavior extends ConnectorBehavior{
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "on_worktime_am","HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "off_worktime_am","HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "on_worktime_pm","HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "off_worktime_pm","HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "start_time","yyyy-MM-dd");
				DhxUtil.transConnectorQueryDateTime(data, "end_time","yyyy-MM-dd");
			}
			
			public void beforeInsert(DataAction action) {
				Date da = new Date();
				SimpleDateFormat matter1=new SimpleDateFormat("yyyy-MM-dd");
			    String curDate = matter1.format(da);
				String onAmtime = action.get_value("on_worktime_am");
				String offAmtime = action.get_value("off_worktime_am");
				String onPmtime = action.get_value("on_worktime_pm");
				String offPmtime = action.get_value("off_worktime_pm");
				
				String on_worktime_am = curDate + onAmtime;
				String off_worktime_am = curDate + offAmtime;
				String on_worktime_pm = curDate + onPmtime;
				String off_worktime_pm = curDate + offPmtime;
				
				action.set_value("on_worktime_am", on_worktime_am);
				action.set_value("off_worktime_am", off_worktime_am);
				action.set_value("on_worktime_pm", on_worktime_pm);
				action.set_value("off_worktime_pm", off_worktime_pm);
				
				DhxUtil.transConnectorModifyDateTime(action, "on_worktime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "off_worktime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "on_worktime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "off_worktime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "start_time", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "end_time", null,
						null, "datetime");
			}
			public void beforeUpdate(DataAction action) {
				Date da = new Date();
				SimpleDateFormat matter1=new SimpleDateFormat("yyyy-MM-dd");
			    String curDate = matter1.format(da);
				String onAmtime = action.get_value("on_worktime_am");
				String offAmtime = action.get_value("off_worktime_am");
				String onPmtime = action.get_value("on_worktime_pm");
				String offPmtime = action.get_value("off_worktime_pm");
				
				String on_worktime_am = curDate + onAmtime;
				String off_worktime_am = curDate + offAmtime;
				String on_worktime_pm = curDate + onPmtime;
				String off_worktime_pm = curDate + offPmtime;
				
				action.set_value("on_worktime_am", on_worktime_am);
				action.set_value("off_worktime_am", off_worktime_am);
				action.set_value("on_worktime_pm", on_worktime_pm);
				action.set_value("off_worktime_pm", off_worktime_pm);
				
				DhxUtil.transConnectorModifyDateTime(action, "on_worktime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "off_worktime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "on_worktime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "off_worktime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "start_time", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "end_time", null,
						null, "datetime");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		
		gridConnector.set_options("sj_type", DhxUtil.getOptionsMap("property_code", "property_name", "property_code", "type_name=(select t.uids " +
				"from property_type t where t.type_name='时间类型')"));
		
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "uids", "uids,pid,sj_type,on_worktime_am,off_worktime_am,on_worktime_pm,off_worktime_pm,start_time,end_time");
		}else{
			gridConnector.render_table("RZGL_KQGL_WORKTIME_SET", "uids", "uids,pid,sj_type,on_worktime_am,off_worktime_am,on_worktime_pm,off_worktime_pm,start_time,end_time");
		}
	}
	/**
	 * 考勤管理节假日设置读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getHolidaySet(Map<String,String> map,GridConnector gridConnector){
		String sql = "select t.uids,t.pid,t.holiday_date,t.type," +
		"t.remark from RZGL_KQGL_HOLIDAY_SET t order by t.holiday_date desc";
		class GridBehavior extends ConnectorBehavior{
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "holiday_date","yyyy-MM-dd");
			}
			
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "holiday_date", null,
						null, "datetime");
			}
			public void beforeUpdate(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "holiday_date", null,
						null, "datetime");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		
		gridConnector.set_options("type", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
				"from view_property_type t where t.type_name='节假日类型')"));
		
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "uids", "uids,pid,holiday_date,type,remark");
		}else{
			gridConnector.render_table("RZGL_KQGL_HOLIDAY_SET", "uids", "uids,pid,holiday_date,type,remark");
		}
	}
	/**
	 * 考勤导入读取数据
	 * @param request
	 * @param response
	 * @param conn
	 */
	public void getKqImport(Map<String,String> map,GridConnector gridConnector){
		String str=map.get("str");
		String sql = "select t.uids,t.pid,t.user_num,t.dept_id," +
				"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
				"t.kq_endtime_am,t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm " +
				"from RZGL_KQGL_KQ_IMPORT t order by t.kq_date desc";
		if(!"".equals(str)){
			sql = "select t.uids,t.pid,t.user_num,t.dept_id," +
				"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
				"t.kq_endtime_am,t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm " +
				"from RZGL_KQGL_KQ_IMPORT t " +
				"where "+str+" order by t.kq_date desc";
		}		
		
		class GridBehavior extends ConnectorBehavior{
			
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "kq_date","yyyy-MM-dd");
				DhxUtil.transConnectorQueryDateTime(data, "kq_starttime_am","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_endtime_am","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_starttime_pm","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_endtime_pm","yyyy-MM-dd HH:mm");
			}
			
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_pm", null,
						null, "datetime");
			}
			public void beforeUpdate(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_pm", null,
						null, "datetime");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("user_id", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("dept_id", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("kq_situation_am", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code","type_name=(select t.uids " +
				"from property_type t where t.type_name='考勤类别') and detail_type='1'"));
		gridConnector.set_options("kq_situation_pm", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code","type_name=(select t.uids " +
				"from view_property_type t where t.type_name='考勤类别') and detail_type='1'"));
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "uids", "uids,pid,user_num,dept_id,user_id,kq_date,kq_situation_am,kq_starttime_am,kq_endtime_am,kq_situation_pm,kq_starttime_pm,kq_endtime_pm");
		}else{
			gridConnector.render_table("RZGL_KQGL_KQ_IMPORT", "uids", "uids,pid,user_num,dept_id,user_id,kq_date,kq_situation_am,kq_starttime_am,kq_endtime_am,kq_situation_pm,kq_starttime_pm,kq_endtime_pm");
		}
	}
	/**
	 * 
	* 
	* 加载部门下拉框信息
	* @param request
	* @param response   
	* @return void    
	* @author shuz 2014-5-8
	 */
	public void loadDeptCombo(ComboConnector combo){
		String sql = "select t.UIDS,t.REALNAME from VIEW_UNIT t where t.UNIT_TYPE_ID='8' and t.PARENT_UIDS ='1030901'";
		class deptComboBehavior extends ConnectorBehavior{
			@Override
			public void beforeSort(ArrayList<SortingRule> sorters){
				SortingRule sr = new SortingRule("UIDS", "asc");
				sorters.add(sr);
			}
		}
		combo.event.attach(new deptComboBehavior());
		combo.render_sql("select * from ("+sql+")", "UIDS", "REALNAME");
	}
	/**
	 * 考勤调整读取数据
	 * @param request
	 * @param response
	 */
	public void getKqAdjust(Map<String,String> map,GridConnector gridConnector){
		String userid = map.get("userid");
		String sql = "";
		if("".equals(userid)){
			sql = "select t.uids,t.pid,t.user_id," +
				"t.dept_id,t.kq_date,t.adjust_type," +
				"t.start_time,t.end_time,t.prove_man," +
				"t.bill_state " +
				"from rzgl_kqgl_kq_adjust t " +
				"order by t.kq_date desc";
		}else{
			sql = "select t.uids,t.pid,t.user_id," +
				"t.dept_id,t.kq_date,t.adjust_type," +
				"t.start_time,t.end_time,t.prove_man," +
				"t.bill_state " +
				"from rzgl_kqgl_kq_adjust t " +
				"where t.user_id='"+userid+"'" +
				"order by t.kq_date desc";
		}
		
		
		class GridBehavior extends ConnectorBehavior{
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "kq_date","yyyy-MM-dd");
				DhxUtil.transConnectorQueryDateTime(data, "start_time","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "end_time","yyyy-MM-dd HH:mm");
			}
			
			public void beforeInsert(DataAction action) {
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				String adjusttype = action.get_value("adjust_type");
				String kqdate = action.get_value("kq_date");
				String userid = action.get_value("user_id");
				try {
					Date startTime = format.parse(action.get_value("start_time"));
					Date endTime = format.parse(action.get_value("end_time"));
					List<RzglKqglKqImport> importList = rzglMainDao.findByWhere(RzglKqglKqImport.class.getName(), "userId='"+userid+"' and kqDate=to_date('"+kqdate+"','yyyy-MM-dd')");
					if(importList.size()>0){
						RzglKqglKqImport im = importList.get(0);
						String sql = "select t.PROPERTY_CODE CODE, t.PROPERTY_NAME NAME"
							+ " from view_property_code t "
							+ " where t.TYPE_NAME ="
							+ " (select p.uids from view_property_type p where p.TYPE_NAME = '考勤类别')";
						List<ListOrderedMap> situations = JdbcUtil.query(sql);
						Map<String, String> kq_map = new HashMap<String, String>();
						for (int i = 0; i < situations.size(); i++) {
							ListOrderedMap sqlmap = situations.get(i);
							String name = sqlmap.get("NAME")==null?"":sqlmap.get("NAME").toString();
							String code = sqlmap.get("CODE")==null?"":sqlmap.get("CODE").toString();
							if(!"".equals(name) && !"".equals(code)){
								kq_map.put(name, code);
							}
						}
						if("1".equals(adjusttype)){
							im.setKqSituationAm(kq_map.get(RzglConstant.CHUQIN));
							im.setKqStarttimeAm(startTime);
							im.setKqEndtimeAm(endTime);
							im.setIsModAm("0");
						}else if("2".equals(adjusttype)){
							im.setKqSituationAm(kq_map.get(RzglConstant.CHUQIN));
							im.setKqStarttimeAm(startTime);
							im.setKqEndtimeAm(endTime);
							im.setIsModPm("0");
						}
						rzglMainDao.saveOrUpdate(im);
						
						DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
								null, "datetime");
						DhxUtil.transConnectorModifyDateTime(action, "start_time", null,
								null, "datetime");
						DhxUtil.transConnectorModifyDateTime(action, "end_time", null,
								null, "datetime");
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			public void beforeUpdate(DataAction action) {
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				String adjusttype = action.get_value("adjust_type");
				String kqdate = action.get_value("kq_date");
				String userid = action.get_value("user_id");
				try {
					String start = action.get_value("start_time");
					String end = action.get_value("end_time");
					Date startTime = format.parse(start);
					Date endTime = format.parse(end);
					List<RzglKqglKqImport> importList = rzglMainDao.findByWhere(RzglKqglKqImport.class.getName(), "userId='"+userid+"' and kqDate=to_date('"+kqdate+"','yyyy-MM-dd')");
					if(importList.size()>0){
						RzglKqglKqImport im = importList.get(0);
						if("1".equals(adjusttype)){
							im.setKqSituationAm("001001");
							im.setKqStarttimeAm(startTime);
							im.setKqEndtimeAm(endTime);
						}else{
							im.setKqSituationPm("001001");
							im.setKqStarttimePm(startTime);
							im.setKqEndtimePm(endTime);
						}
						rzglMainDao.saveOrUpdate(im);//当调整考勤时修改考勤导入中对应的考勤信息
						DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
								null, "datetime");
						DhxUtil.transConnectorModifyDateTime(action, "start_time", null,
								null, "datetime");
						DhxUtil.transConnectorModifyDateTime(action, "end_time", null,
								null, "datetime");
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("dept_id", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("user_id", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("adjust_type", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
				"from view_property_type t where t.type_name='调整类型') order by property_code asc"));
		gridConnector.set_options("bill_state", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
		"from view_property_type t where t.type_name='流程状态')"));
		
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "uids", "uids,pid,user_id,dept_id,kq_date,adjust_type,start_time,end_time,prove_man,bill_state");
		}else{
			gridConnector.render_table("RZGL_KQGL_KQ_ADJUST", "uids", "uids,pid,user_id,dept_id,kq_date,adjust_type,start_time,end_time,prove_man,bill_state");
		}
	}
	/**
	 * 考勤汇总查询
	 * @param request
	 * @param response
	 */
	public void getKqhzQuery(Map<String,String> map,GridConnector gridConnector){
		String str=map.get("str");
		String powerLevel = map.get("powerLevel");
		String userid = map.get("userid");
		String parameter = map.get("parameter");
		String sql = "";
		if(powerLevel !=null && "geren".equals(powerLevel)){
			sql = "select t.uids,t.pid,t.user_num,t.dept_id," +
				"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
				"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
				",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
				"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
				"from RZGL_KQGL_KQ_IMPORT t where t.user_id='"+userid+"' order by t.kq_date desc";
			if(!"".equals(str)){
				sql =  "select t.uids,t.pid,t.user_num,t.dept_id," +
					"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
					"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
					",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
					"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
					"from RZGL_KQGL_KQ_IMPORT t " +
					"where "+str+" and t.user_id='"+userid+"' order by t.kq_date desc";
			}
		}else{
			sql = "select t.uids,t.pid,t.user_num,t.dept_id," +
				"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
				"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
				",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
				"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
				"from RZGL_KQGL_KQ_IMPORT t order by t.kq_date desc";
			if(!"".equals(parameter)){
				if(!"".equals(str)){
					sql =  "select t.uids,t.pid,t.user_num,t.dept_id," +
						"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
						"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
						",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
						"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
						"from RZGL_KQGL_KQ_IMPORT t " +
						"where "+parameter+" and "+str+" order by t.kq_date desc";
					
				}else{
					sql =  "select t.uids,t.pid,t.user_num,t.dept_id," +
						"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
						"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
						",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
						"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
						"from RZGL_KQGL_KQ_IMPORT t " +
						"where "+parameter+" order by t.kq_date desc";
				}
			}else{
				if(!"".equals(str)){
					sql =  "select t.uids,t.pid,t.user_num,t.dept_id," +
						"t.user_id,t.kq_date,t.kq_situation_am,t.kq_starttime_am," +
						"t.kq_endtime_am,'' qingjia_am,'' chuchai_am,t.is_mod_am " +
						",t.kq_situation_pm,t.kq_starttime_pm,t.kq_endtime_pm, " +
						"'' qingjia_pm,'' chuchai_pm,t.is_mod_pm " +
						"from RZGL_KQGL_KQ_IMPORT t " +
						"where "+str+" order by t.kq_date desc";
				}
			}
			
		}
		class GridBehavior extends ConnectorBehavior{
			
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "kq_date","yyyy-MM-dd");
				DhxUtil.transConnectorQueryDateTime(data, "kq_starttime_am","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_endtime_am","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_starttime_pm","yyyy-MM-dd HH:mm");
				DhxUtil.transConnectorQueryDateTime(data, "kq_endtime_pm","yyyy-MM-dd HH:mm");
				String kqdate = data.get_value("kq_date");
				String userid = data.get_value("user_id");
				if("0".equals(data.get_value("is_mod_am"))){
					data.set_value("is_mod_am", "√");
				}
				if("0".equals(data.get_value("is_mod_pm"))){
					data.set_value("is_mod_pm", "√");
				}
				//判断某天是否有出差
				setIsOnbusiness(data,kqdate,userid);
				//判断某天是否有请假
				setIsLeave(data,kqdate,userid);
			}
			
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_pm", null,
						null, "datetime");
			}
			public void beforeUpdate(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "kq_date", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_am", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_starttime_pm", null,
						null, "datetime");
				DhxUtil.transConnectorModifyDateTime(action, "kq_endtime_pm", null,
						null, "datetime");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("user_id", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("dept_id", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("kq_situation_am", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code","type_name=(select t.uids " +
				"from property_type t where t.type_name='考勤类别') and detail_type='1'"));
		gridConnector.set_options("kq_situation_pm", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code","type_name=(select t.uids " +
				"from view_property_type t where t.type_name='考勤类别') and detail_type='1'"));
		gridConnector.render_sql(sql, "uids", "uids,pid,user_num,dept_id,user_id,kq_date,kq_situation_am,kq_starttime_am,kq_endtime_am,qingjia_am,chuchai_am,is_mod_am,kq_situation_pm,kq_starttime_pm,kq_endtime_pm,qingjia_pm,chuchai_pm,is_mod_pm");
	}
	/**
	 * 汇总查询出差状态设置
	 */
	public void setIsOnbusiness(DataItem data,String kqdate,String userid){
		String kq_situation_am = data.get_value("kq_situation_am");
		String kq_situation_pm = data.get_value("kq_situation_pm");
		if("001004".equals(kq_situation_am)){
			data.set_value("chuchai_am", "√");
		}
		if("001004".equals(kq_situation_pm)){
			data.set_value("chuchai_pm", "√");
		}
	} 
	/**
	 * 汇总查询请假状态设置
	 */
	public void setIsLeave(DataItem data,String kqdate,String userid){
		String[] arrQj = {"001003008","001003009","001003010","001003001","001003002","001003003","001003004","001003005"};
		String kq_situation_am = data.get_value("kq_situation_am");
		String kq_situation_pm = data.get_value("kq_situation_pm");
		for(int i=0;i<arrQj.length;i++){
			if(arrQj[i].equals(kq_situation_am)){
				data.set_value("qingjia_am", "√");
			}
			if(arrQj[i].equals(kq_situation_pm)){
				data.set_value("qingjia_pm", "√");
			}
		}
	}
	/**
	 * 考勤统计查询
	 */
	public void getKqtj(Map<String,String> map,GridConnector gridConnector){
		String filter = map.get("filter");
		String sql = "select t.userid,t.realname,t.deptid,t.chuchai,t.chuqin,t.chidao,t.zaotui," +
				"t.shijia,t.bingjia,t.nianxiujia,t.tenqinjia,t.chanjia,t.hunjia,t.sangjia," +
				"t.gongshangjia,t.kqtiaozheng,t.kuanggong " +
				"from RZGL_KQGL_KQTJ_VIEW t where "+filter+" order by t.kqdate desc";
		System.out.println(sql);
		class GridBehavior extends ConnectorBehavior{
			public void beforeRender(DataItem data) {
				if(!"0".equals(data.get_value("chuchai"))){
					data.set_value("chuchai", DhxUtil.renderLinkValue(data.get_value("chuchai"), "openDetail", data.get_id(),"001004"));
				}
				if(!"0".equals(data.get_value("chuqin"))){
					data.set_value("chuqin", DhxUtil.renderLinkValue(data.get_value("chuqin"), "openDetail", data.get_id(),"001001"));
				}
				if(!"0".equals(data.get_value("chidao"))){
					data.set_value("chidao", DhxUtil.renderLinkValue(data.get_value("chidao"), "openDetail", data.get_id(),"001003011"));
				}
				if(!"0".equals(data.get_value("zaotui"))){
					data.set_value("zaotui", DhxUtil.renderLinkValue(data.get_value("zaotui"), "openDetail", data.get_id(),"001003012"));
				}
				if(!"0".equals(data.get_value("shijia"))){
					data.set_value("shijia", DhxUtil.renderLinkValue(data.get_value("shijia"), "openDetail", data.get_id(),"001003001"));
				}
				if(!"0".equals(data.get_value("bingjia"))){
					data.set_value("bingjia", DhxUtil.renderLinkValue(data.get_value("bingjia"), "openDetail", data.get_id(),"001003002"));
				}
				if(!"0".equals(data.get_value("nianxiujia"))){
					data.set_value("nianxiujia", DhxUtil.renderLinkValue(data.get_value("nianxiujia"), "openDetail", data.get_id(),"001003003"));
				}
				if(!"0".equals(data.get_value("tenqinjia"))){
					data.set_value("tenqinjia", DhxUtil.renderLinkValue(data.get_value("tenqinjia"), "openDetail", data.get_id(),"001003010"));
				}
				if(!"0".equals(data.get_value("chanjia"))){
					data.set_value("chanjia", DhxUtil.renderLinkValue(data.get_value("chanjia"), "openDetail", data.get_id(),"001003005"));
				}
				if(!"0".equals(data.get_value("hunjia"))){
					data.set_value("hunjia", DhxUtil.renderLinkValue(data.get_value("hunjia"), "openDetail", data.get_id(),"001003004"));
				}
				if(!"0".equals(data.get_value("sangjia"))){
					data.set_value("sangjia", DhxUtil.renderLinkValue(data.get_value("sangjia"), "openDetail", data.get_id(),"001003008"));
				}
				if(!"0".equals(data.get_value("gongshangjia"))){
					data.set_value("gongshangjia", DhxUtil.renderLinkValue(data.get_value("gongshangjia"), "openDetail", data.get_id(),"001003009"));
				}
				if(!"0".equals(data.get_value("kqtiaozheng"))){
					data.set_value("kqtiaozheng", DhxUtil.renderLinkValue(data.get_value("kqtiaozheng"), "openDetail", data.get_id(),"mod"));
				}
				if(!"0".equals(data.get_value("kuanggong"))){
					data.set_value("kuanggong", DhxUtil.renderLinkValue(data.get_value("kuanggong"), "openDetail", data.get_id(),"001003006"));
				}
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("deptid", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		
		gridConnector.render_sql(sql, "userid", "realname,deptid,chuqin,chidao,zaotui,,chuchai,shijia,bingjia,nianxiujia,tenqinjia,chanjia,hunjia,sangjia," +
					"gongshangjia,kqtiaozheng,kuanggong");
	}
	/**
	 * 获取每日上下午工作时间
	 */
	public List getWorkTime(String sql){
		List list = null;
    	Session ses = null;
    	if (sql != null && !sql.equals("") )
		{
	    	try {		    		
		    		ses = HibernateSessionFactory.getSession();			    	
		    		Query q = ses.createSQLQuery(sql);
		    		list = q.list();		    		
		    		
		    	} catch (Exception e) {
		    		e.printStackTrace();
		    	} finally {
		    		ses.close();
	    	}
		}
		return list;
	} 
	/**
	 * 返回随机主键32位
	 * @return
	 */
	public String getUuidValue() {
		return java.util.UUID.randomUUID().toString().replaceAll("-", "");
	}
	//qiupy
	/**
	 * 出差数据读取
	 */
	@Override
	public void getOnBusiness(Map<String, String> map,
			GridConnector gridConnector) {
		String params=map.get("params");
		String dept=map.get("dept");
		String userName=map.get("userName");
		if(userName!=null&&userName.length()>0){
			params+=" and EMPLOYEE_ID in(select i.userid from HR_MAN_INFO i where i.REALNAME like '%"+userName+"%')";
		}
		if(dept!=null&&dept.length()>0){
			params+=" and DEPT_ID='"+dept+"'";
		}
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_ON_BUSINESS t where "+params+" order by PLAN_START_DATE desc";
		class GridBehavior extends ConnectorBehavior{
			
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_START_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_FINISH_DATE","yyyy-MM-dd HH:mm:ss");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("EMPLOYEE_ID", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("DEPT_ID", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("BILL_STATE", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
		"from view_property_type t where t.type_name='流程状态')"));
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}else{
			gridConnector.render_table("RZGL_KQGL_ON_BUSINESS", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}
	}
	/**
	 * 
	* @Title: loadBillStateComo
	* @Description: 加载审批状态下拉框数据
	* @param comboConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	@Override
	public void loadBillStateComo(ComboConnector comboConnector) {
		String sql = "select property_code,property_name from view_property_code where type_name=(select t.uids " +
				"from view_property_type t where t.type_name='流程状态')";
		class deptComboBehavior extends ConnectorBehavior{
			@Override
			public void beforeSort(ArrayList<SortingRule> sorters){
				SortingRule sr = new SortingRule("property_code", "asc");
				sorters.add(sr);
			}
		}
		comboConnector.event.attach(new deptComboBehavior());
		comboConnector.render_sql("select * from ("+sql+")", "property_code", "property_name");
	}
	/**
	 * 
	* @Title: loadOnBusinessForm
	* @Description: 加载出差数据表单
	* @param map
	* @param formConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	@Override
	public void loadOnBusinessForm(Map<String, String> map,
			FormConnector formConnector) {
		String uids=map.get("uids");
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_ON_BUSINESS t where uids='"+uids+"'";
        class FormBehavior extends ConnectorBehavior{
			@Override
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_START_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_FINISH_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
			}
		
			@Override
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void beforeUpdate(DataAction action) {
				
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void afterDBError(DataAction action, Throwable e) {
				String message = e.getMessage();
				action.set_response_text(message);
			}
		};
		formConnector.event.attach(new FormBehavior());
		if (formConnector.is_select_mode()){
			formConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}else{
			formConnector.render_table("RZGL_KQGL_ON_BUSINESS", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}
	}
	/**
	 * 
	* @Title: loadUserComo
	* @Description: 加载用户下拉框数据
	* @param comboConnector   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	@Override
	public void loadUserComo(ComboConnector comboConnector) {
		String sql = "select t.USERID,t.REALNAME from HR_MAN_INFO t";
		class deptComboBehavior extends ConnectorBehavior{
			@Override
			public void beforeSort(ArrayList<SortingRule> sorters){
				SortingRule sr = new SortingRule("USERID", "asc");
				sorters.add(sr);
			}
		}
		comboConnector.event.attach(new deptComboBehavior());
		comboConnector.render_sql("select * from ("+sql+")", "USERID", "REALNAME");
	}
	/**
	 * 当前模块是否包含流程
	 */
	@Override
	public String hasContainsFlow(String unitId, String modId) {
		return rzglMgm.containsFlow(unitId, modId);
	}
	
	@Override
	public void doOnBusinessInfo(String uids) {
		System.out.println(">");
		if(uids!=null){
			try {
				RzglKqglOnBusiness rzglKqglOnBusiness = (RzglKqglOnBusiness) rzglMainDao.findById(
						RzglKqglOnBusiness.class.getName(), uids);
				if (rzglKqglOnBusiness != null) {
					SimpleDateFormat kqdateFormat = new SimpleDateFormat(
							"yyyy-MM-dd");
					SimpleDateFormat kqtimeFormat = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm:ss");
					SimpleDateFormat worktimeFormat = new SimpleDateFormat(
					     "HH:mm:ss");
					String userid = rzglKqglOnBusiness.getEmployeeId();
					Date actualStartDate = rzglKqglOnBusiness
							.getActualStartDate();
					Date actualFinishDate = rzglKqglOnBusiness
							.getActualFinishDate();
					int daysNum = daysBetween(actualStartDate, actualFinishDate);
					RzglKqglKqImport kq =null;
					for(int i=0;i<=daysNum;i++){
						Calendar cal = Calendar.getInstance();     
				        cal.setTime(actualStartDate); 
				        cal.add(cal.DATE,i);
				        String actualStartDateStr=kqdateFormat.format(cal.getTime());
				        String actualStartDateStr1=kqtimeFormat.format(cal.getTime());
				        List<RzglKqglKqImport> rzglKqglKqImportList=rzglMainDao.findByWhere(RzglKqglKqImport.class.getName(), "userId='"+userid+"' and kqDate=to_date('"+actualStartDateStr+"','yyyy-MM-dd')");
				        if(rzglKqglKqImportList!=null&&rzglKqglKqImportList.size()>0){
				        	kq=rzglKqglKqImportList.get(0);
				        }else{
				        	kq = new RzglKqglKqImport();
				        	
				        	kq.setPid(rzglKqglOnBusiness.getPid());
				        	List<Object[]> users = this.rzglMainDao
							.getDataAutoCloseSes("select t.USERNUM,t.USERID from HR_MAN_INFO t where  t.userid='"+userid+"'");
				        	if (users.size() > 0&&users.get(0)[0]!=null) {
				        		kq.setUserNum(users.get(0)[0].toString());
							}else{
								kq.setUserNum("");
							}
				        	kq.setDeptId(rzglKqglOnBusiness.getDeptId());
				        	kq.setUserId(userid);
				        	kq.setKqDate(cal.getTime());
				        }
				        if(i==0){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime<=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
				        		if(actualStartDate.getTime()<off_worktime_am.getTime()){
				        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
										kq.setKqStarttimePm(actualStartDate);
										kq.setKqEndtimePm(actualFinishDate);
										kq.setKqSituationPm("001004");
				        			}
				        			kq.setKqStarttimeAm(actualStartDate);
									kq.setKqEndtimeAm(actualFinishDate);
									kq.setKqSituationAm("001004");
				        		}else{
				        			kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm("001004");
				        		}
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm("001004");
								kq.setKqSituationPm("001004");
				        	}
				        }else if(i==daysNum){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime <=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
			        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
									kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm("001004");
			        			}
			        			kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqSituationAm("001004");
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm("001004");
								kq.setKqSituationPm("001004");
				        	}
				        }else{
				        	kq.setKqStarttimeAm(actualStartDate);
							kq.setKqEndtimeAm(actualFinishDate);
							kq.setKqStarttimePm(actualStartDate);
							kq.setKqEndtimePm(actualFinishDate);
							kq.setKqSituationAm("001004");
							kq.setKqSituationPm("001004");
				        }
				        rzglMainDao.saveOrUpdate(kq);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	/**   
     * 计算两个日期之间相差的天数   
     * @param smdate 较小的时间  
     * @param bdate  较大的时间  
     * @return 相差天数  
     * @throws ParseException   
     */     
    public int daysBetween(Date smdate,Date bdate) throws ParseException     
    {     
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");   
        smdate=sdf.parse(sdf.format(smdate));   
        bdate=sdf.parse(sdf.format(bdate));   
        Calendar cal = Calendar.getInstance();     
        cal.setTime(smdate);     
        long time1 = cal.getTimeInMillis();                  
        cal.setTime(bdate);     
        long time2 = cal.getTimeInMillis();          
        long between_days=(time2-time1)/(1000*3600*24);   
             
       return Integer.parseInt(String.valueOf(between_days));            
    }
	@Override
	public void doAskForLeaveInfo(String uids) {
		if(uids!=null){
			try {
				RzglKqglAskForLeave rzglKqglAskForLeave = (RzglKqglAskForLeave) rzglMainDao.findById(
						RzglKqglAskForLeave.class.getName(), uids);
				if (rzglKqglAskForLeave != null) {
					SimpleDateFormat kqdateFormat = new SimpleDateFormat(
							"yyyy-MM-dd");
					SimpleDateFormat kqtimeFormat = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm:ss");
					SimpleDateFormat worktimeFormat = new SimpleDateFormat(
					     "HH:mm:ss");
					String userid = rzglKqglAskForLeave.getEmployeeId();
					Date actualStartDate = rzglKqglAskForLeave
							.getActualStartDate();
					Date actualFinishDate = rzglKqglAskForLeave
							.getActualFinishDate();
					int daysNum = daysBetween(actualStartDate, actualFinishDate);
					RzglKqglKqImport kq =null;
					for(int i=0;i<=daysNum;i++){
						Calendar cal = Calendar.getInstance();     
				        cal.setTime(actualStartDate); 
				        cal.add(cal.DATE,i);
				        String actualStartDateStr=kqdateFormat.format(cal.getTime());
				        String actualStartDateStr1=kqtimeFormat.format(cal.getTime());
				        List<RzglKqglKqImport> rzglKqglKqImportList=rzglMainDao.findByWhere(RzglKqglKqImport.class.getName(), "userId='"+userid+"' and kqDate=to_date('"+actualStartDateStr+"','yyyy-MM-dd')");
				        if(rzglKqglKqImportList!=null&&rzglKqglKqImportList.size()>0){
				        	kq=rzglKqglKqImportList.get(0);
				        }else{
				        	kq = new RzglKqglKqImport();
				        	
				        	kq.setPid(rzglKqglAskForLeave.getPid());
				        	List<Object[]> users = this.rzglMainDao
							.getDataAutoCloseSes("select t.USERNUM,t.USERID from HR_MAN_INFO t where  t.userid='"+userid+"'");
				        	if (users.size() > 0&&users.get(0)[0]!=null) {
				        		kq.setUserNum(users.get(0)[0].toString());
							}else{
								kq.setUserNum("");
							}
				        	kq.setDeptId(rzglKqglAskForLeave.getDeptId());
				        	kq.setUserId(userid);
				        	kq.setKqDate(cal.getTime());
				        }
				        if(i==0){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime<=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
				        		if(actualStartDate.getTime()<off_worktime_am.getTime()){
				        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
										kq.setKqStarttimePm(actualStartDate);
										kq.setKqEndtimePm(actualFinishDate);
										kq.setKqSituationPm(rzglKqglAskForLeave.getType());
				        			}
				        			kq.setKqStarttimeAm(actualStartDate);
									kq.setKqEndtimeAm(actualFinishDate);
									kq.setKqSituationAm(rzglKqglAskForLeave.getType());
				        		}else{
				        			kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm(rzglKqglAskForLeave.getType());
				        		}
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm(rzglKqglAskForLeave.getType());
								kq.setKqSituationPm(rzglKqglAskForLeave.getType());
				        	}
				        }else if(i==daysNum){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime <=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
			        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
									kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm(rzglKqglAskForLeave.getType());
			        			}
			        			kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqSituationAm(rzglKqglAskForLeave.getType());
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm(rzglKqglAskForLeave.getType());
								kq.setKqSituationPm(rzglKqglAskForLeave.getType());
				        	}
				        }else{
				        	kq.setKqStarttimeAm(actualStartDate);
							kq.setKqEndtimeAm(actualFinishDate);
							kq.setKqStarttimePm(actualStartDate);
							kq.setKqEndtimePm(actualFinishDate);
							kq.setKqSituationAm(rzglKqglAskForLeave.getType());
							kq.setKqSituationPm(rzglKqglAskForLeave.getType());
				        }
				        rzglMainDao.saveOrUpdate(kq);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	@Override
	public void getAskForLeave(Map<String, String> map,
			GridConnector gridConnector) {
		String params=map.get("params");
		String dept=map.get("dept");
		String userName=map.get("userName");
		if(userName!=null&&userName.length()>0){
			params+=" and EMPLOYEE_ID in(select i.userid from HR_MAN_INFO i where i.REALNAME like '%"+userName+"%')";
		}
		if(dept!=null&&dept.length()>0){
			params+=" and DEPT_ID='"+dept+"'";
		}
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_ASK_FOR_LEAVE t where "+params+" order by PLAN_START_DATE desc";
		class GridBehavior extends ConnectorBehavior{
			
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_START_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_FINISH_DATE","yyyy-MM-dd HH:mm:ss");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("EMPLOYEE_ID", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("DEPT_ID", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("BILL_STATE", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
		"from view_property_type t where t.type_name='流程状态')"));
		gridConnector.set_options("TYPE", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
		"from view_property_type t where t.type_name='请假类型')"));
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}else{
			gridConnector.render_table("RZGL_KQGL_ASK_FOR_LEAVE", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}
	}
	@Override
	public void loadAskForLeaveForm(Map<String, String> map,
			FormConnector formConnector) {
		String uids=map.get("uids");
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_ASK_FOR_LEAVE t where uids='"+uids+"'";
        class FormBehavior extends ConnectorBehavior{
			@Override
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_START_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "ACTUAL_FINISH_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
			}
		
			@Override
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void beforeUpdate(DataAction action) {
				
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "ACTUAL_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("ACTUAL_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void afterDBError(DataAction action, Throwable e) {
				String message = e.getMessage();
				action.set_response_text(message);
			}
		};
		formConnector.event.attach(new FormBehavior());
		if (formConnector.is_select_mode()){
			formConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}else{
			formConnector.render_table("RZGL_KQGL_ASK_FOR_LEAVE", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
		}
		
	}
	@Override
	public void doOvertimeInfo(String uids) {
		if(uids!=null){
			try {
				RzglKqglOvertime rzglKqglOvertime = (RzglKqglOvertime) rzglMainDao.findById(
						RzglKqglOvertime.class.getName(), uids);
				if (rzglKqglOvertime != null) {
					SimpleDateFormat kqdateFormat = new SimpleDateFormat(
							"yyyy-MM-dd");
					SimpleDateFormat kqtimeFormat = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm:ss");
					SimpleDateFormat worktimeFormat = new SimpleDateFormat(
					     "HH:mm:ss");
					String userid = rzglKqglOvertime.getEmployeeId();
					Date actualStartDate = rzglKqglOvertime
							.getPlanStartDate();
					Date actualFinishDate = rzglKqglOvertime
							.getPlanFinishDate();
					int daysNum = daysBetween(actualStartDate, actualFinishDate);
					RzglKqglKqImport kq =null;
					for(int i=0;i<=daysNum;i++){
						Calendar cal = Calendar.getInstance();     
				        cal.setTime(actualStartDate); 
				        cal.add(cal.DATE,i);
				        String actualStartDateStr=kqdateFormat.format(cal.getTime());
				        String actualStartDateStr1=kqtimeFormat.format(cal.getTime());
				        List<RzglKqglKqImport> rzglKqglKqImportList=rzglMainDao.findByWhere(RzglKqglKqImport.class.getName(), "userId='"+userid+"' and kqDate=to_date('"+actualStartDateStr+"','yyyy-MM-dd')");
				        if(rzglKqglKqImportList!=null&&rzglKqglKqImportList.size()>0){
				        	kq=rzglKqglKqImportList.get(0);
				        }else{
				        	kq = new RzglKqglKqImport();
				        	
				        	kq.setPid(rzglKqglOvertime.getPid());
				        	List<Object[]> users = this.rzglMainDao
							.getDataAutoCloseSes("select t.USERNUM,t.USERID from HR_MAN_INFO t where  t.userid='"+userid+"'");
				        	if (users.size() > 0&&users.get(0)[0]!=null) {
				        		kq.setUserNum(users.get(0)[0].toString());
							}else{
								kq.setUserNum("");
							}
				        	kq.setDeptId(rzglKqglOvertime.getDeptId());
				        	kq.setUserId(userid);
				        	kq.setKqDate(cal.getTime());
				        }
				        if(i==0){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime<=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
				        		if(actualStartDate.getTime()<off_worktime_am.getTime()){
				        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
										kq.setKqStarttimePm(actualStartDate);
										kq.setKqEndtimePm(actualFinishDate);
										kq.setKqSituationPm("001006");
				        			}
				        			kq.setKqStarttimeAm(actualStartDate);
									kq.setKqEndtimeAm(actualFinishDate);
									kq.setKqSituationAm("001006");
				        		}else{
				        			kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm("001006");
				        		}
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm("001006");
								kq.setKqSituationPm("001006");
				        	}
				        }else if(i==daysNum){
				        	List<RzglKqglWorktimeSet> rzglKqglWorktimeSetList=rzglMainDao.findByWhere(RzglKqglWorktimeSet.class.getName(), "startTime <=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd')) "
									+ "and endTime>=(to_date('"
									+ actualStartDateStr
									+ "','yyyy-MM-dd'))");
				        	if(rzglKqglWorktimeSetList!=null&&rzglKqglWorktimeSetList.size()>0){
				        		RzglKqglWorktimeSet rzglKqglWorktimeSet=rzglKqglWorktimeSetList.get(0);
				        		Date off_worktime_am = rzglKqglWorktimeSet.getOffWorktimeAm();
				        		Date on_worktime_pm = rzglKqglWorktimeSet.getOnWorktimePm();
				        		off_worktime_am=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(off_worktime_am));
				        		on_worktime_pm=kqtimeFormat.parse(actualStartDateStr+" "+worktimeFormat.format(on_worktime_pm));
			        			if(actualFinishDate.getTime()>on_worktime_pm.getTime()){
									kq.setKqStarttimePm(actualStartDate);
									kq.setKqEndtimePm(actualFinishDate);
									kq.setKqSituationPm("001006");
			        			}
			        			kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqSituationAm("001006");
				        	}else{
				        		kq.setKqStarttimeAm(actualStartDate);
								kq.setKqEndtimeAm(actualFinishDate);
								kq.setKqStarttimePm(actualStartDate);
								kq.setKqEndtimePm(actualFinishDate);
								kq.setKqSituationAm("001006");
								kq.setKqSituationPm("001006");
				        	}
				        }else{
				        	kq.setKqStarttimeAm(actualStartDate);
							kq.setKqEndtimeAm(actualFinishDate);
							kq.setKqStarttimePm(actualStartDate);
							kq.setKqEndtimePm(actualFinishDate);
							kq.setKqSituationAm("001006");
							kq.setKqSituationPm("001006");
				        }
				        rzglMainDao.saveOrUpdate(kq);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	@Override
	public void getOvertime(Map<String, String> map,
			GridConnector gridConnector) {
		String params=map.get("params");
		String dept=map.get("dept");
		String userName=map.get("userName");
		if(userName!=null&&userName.length()>0){
			params+=" and EMPLOYEE_ID in(select i.userid from HR_MAN_INFO i where i.REALNAME like '%"+userName+"%')";
		}
		if(dept!=null&&dept.length()>0){
			params+=" and DEPT_ID='"+dept+"'";
		}
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_OVERTIME t where "+params+" order by PLAN_START_DATE desc";
		class GridBehavior extends ConnectorBehavior{
			
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE","yyyy-MM-dd HH:mm:ss");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE","yyyy-MM-dd HH:mm:ss");
			}
		};
		gridConnector.event.attach(new GridBehavior());
		gridConnector.set_options("EMPLOYEE_ID", DhxUtil.getOptionsMap("USERID", "REALNAME", "HR_MAN_INFO", "1=1"));
		gridConnector.set_options("DEPT_ID", DhxUtil.getOptionsMap("UIDS", "REALNAME", "VIEW_UNIT", "1=1"));
		gridConnector.set_options("BILL_STATE", DhxUtil.getOptionsMap("property_code", "property_name", "view_property_code", "type_name=(select t.uids " +
		"from view_property_type t where t.type_name='流程状态')"));
		if (gridConnector.is_select_mode()){
			gridConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE");
		}else{
			gridConnector.render_table("RZGL_KQGL_OVERTIME", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE");
		}
		
	}
	@Override
	public void loadOvertimeForm(Map<String, String> map,
			FormConnector formConnector) {
		String uids=map.get("uids");
		String sql = "select UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER," +
				"PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE" +
				" from RZGL_KQGL_OVERTIME t where uids='"+uids+"'";
        class FormBehavior extends ConnectorBehavior{
			@Override
			public void beforeRender(DataItem data) {
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_START_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
				DhxUtil.transConnectorQueryDateTime(data, "PLAN_FINISH_DATE",
						"yyyy-MM-dd HH:mm:ss", null, "datetime");
			}
		
			@Override
			public void beforeInsert(DataAction action) {
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void beforeUpdate(DataAction action) {
				
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_START_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_START_DATE")),"yyyy-MM-dd HH:mm:ss"),
						"datetime");
				DhxUtil.transConnectorModifyDateTime(action, "PLAN_FINISH_DATE", null,
						DateUtil.getDateTimeStr(new Date(action.get_value("PLAN_FINISH_DATE")),"yyyy-MM-dd HH:mm:ss"),
				"datetime");
			}
		
			@Override
			public void afterDBError(DataAction action, Throwable e) {
				String message = e.getMessage();
				action.set_response_text(message);
			}
		};
		formConnector.event.attach(new FormBehavior());
		if (formConnector.is_select_mode()){
			formConnector.render_sql(sql, "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE");
		}else{
			formConnector.render_table("RZGL_KQGL_OVERTIME", "UIDS", "UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE");
		}
		
	}
	@Override
	public void loadAskForLeaveTypeComo(ComboConnector comboConnector) {
		String sql = "select property_code,property_name from view_property_code where type_name=(select t.uids " +
		"from view_property_type t where t.type_name='请假类型')";
		class AskForLeaveTypeComboBehavior extends ConnectorBehavior{
			@Override
			public void beforeSort(ArrayList<SortingRule> sorters){
				SortingRule sr = new SortingRule("property_code", "asc");
				sorters.add(sr);
			}
		}
		comboConnector.event.attach(new AskForLeaveTypeComboBehavior());
		comboConnector.render_sql("select * from ("+sql+")", "property_code", "property_name");
	} 
}
