package com.sgepit.pcmis.zlgk.service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import oracle.sql.BLOB;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.fileAndPublish.FAPConstant;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.FileManagementService;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.bid.hbm.VPcBidZbApply;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;
import com.sgepit.pcmis.common.util.MultistageReportUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.zlgk.dao.PCzlgkDAO;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaDetail;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkRightSortDept;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkSuperreportInfo;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypRecord;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypReport;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypSortRightBean;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypStatisticsTree;
import com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree;
import com.sgepit.pcmis.zlgk.hbm.VPcZlgkQuaInfo;
import com.sgepit.pmis.document.hbm.ZlInfoBlobList;
import com.sgepit.pmis.document.hbm.ZlTree;
import com.sgepit.pmis.gczl.hbm.GczlJyxm;


public class PCZlgkServiceImpl extends BaseMgmImpl implements PCZlgkService  
{
	Log log = LogFactory.getLog(PCZlgkServiceImpl.class);
	private PCzlgkDAO zlgkDAO;
	
	
	public PCzlgkDAO getZlgkDAO(){
		return zlgkDAO;
	}

	public void setZlgkDAO(PCzlgkDAO zlgkDAO) {
		this.zlgkDAO = zlgkDAO;
	}
	
	/**
	 * 下面是自定义方法
	 */
	
	//同时查询获得验评合格率的相关信息
	@SuppressWarnings("unchecked")
	public List getLastedReportName(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException
	{
		JdbcTemplate jt= new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		
		String unitid = params.get("unitid")==null?"":params.get("unitid").toString();
		String projName = params.get("projName")==null?"%":params.get("projName").toString();
		String month = params.get("sjType")==null?"%":params.get("sjType").toString();
		List pids = sys.getPidsByUnitid(unitid);
		
		List<JSONObject> rptnames = new ArrayList();
		
		if(pids.size()==0)
		{
			return new ArrayList();
		}
		
		for (Iterator it = pids.iterator(); it.hasNext();) {
			JSONObject json = new JSONObject();
			SgccIniUnit unit = (SgccIniUnit) it.next();
			String pid = unit.getUnitid();
			
			//点击"查询按钮的部分"
			List lt0 = this.zlgkDAO.findByWhere(com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo.class.getName(), 
						"pid='"+pid+"' and prj_Name like '%"+projName+"%'");
			if(lt0.size()==0) continue;
			
			String _SQL = "select uids,reportname from pc_zlgk_superreport_info " +
					"where createdate="+"(select max(createdate) from pc_zlgk_superreport_info " +
							"where pid='"+pid+"' and report_stat = '1' and to_char(createdate, 'yyyymm')<='"+month+"' and " +
									"uids in (select transaction_id from SGCC_ATTACH_LIST t where transaction_type = 'PCJianLiBaoGao' ))";
			LogFactory.getLog(PCZlgkServiceImpl.class).info("最新监理周报SQL:"+_SQL);
			//获得验评合格率的相关信息
			String sql = "select ljhgl,byhgl from pc_zlgk_qua_detail where pid='"+pid+"' and SJ_TYPE='"+month+"'";
			List list = jt.queryForList(_SQL);
			List list2 = jt.queryForList(sql);
			json.put("pid", pid);
			if(list.size()>0){
				ListOrderedMap map1 = new ListOrderedMap();
				map1  = (ListOrderedMap)list.get(0);
				String reportname = map1.get("REPORTNAME").toString();
				String reportuids = map1.get("UIDS").toString();
				json.put("reportname", reportname);
				json.put("reportuids", reportuids);
			}else{
				json.put("reportname", "");
				json.put("reportname", "");
			}
			
			if(list2.size()>0){
				ListOrderedMap map2 = new ListOrderedMap();
				map2  = (ListOrderedMap)list2.get(0);
				List valuelist = map2.valueList();
				java.math.BigDecimal ljhgl = (java.math.BigDecimal)valuelist.get(0);
				java.math.BigDecimal byhgl = (java.math.BigDecimal)valuelist.get(1);
//				json.put("ljhgl", ljhgl);
//				json.put("byhgl", byhgl);
				//质量管控一览页获取累计合格率，本月合格率 zhangh 2011-06-22
				json.put("ljhgl", this.getLjhgl(pid, month));
				json.put("byhgl", this.getByhgl(pid, month));
			}else{
				json.put("ljhgl", -1);
				json.put("byhgl", -1);
			}
			
			rptnames.add(json);
		}
		return rptnames;
	}
	
	@SuppressWarnings("unchecked")
	public List getSjtype(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException
	{
		List list = new ArrayList();
//		List sjtypes = new ArrayList();
//		JdbcTemplate jt= new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
//		String _SQL = "select sjType from pc_zlgk_qua_detail";
//		
//		list = jt.queryForList(_SQL);
//		for(Iterator it = list.iterator(); it.hasNext();)
//		{
//			ListOrderedMap map = (ListOrderedMap)it.next();
//			String sjtype = (String)map.getValue(0);
//			String local = sjtype.replace(oldChar, newChar)
//		}
		
		return list;
	}
	
	/**
	 * 对报表实体进行初始化，将质量验评树中对应的工程初始化到报表中
	 * @param uidsArr 单位项目主键
	 * @param sj 报表时间周期
	 * @param uids 报表主键uids
	 * @param pid
	 * @createDate 2011-06-16
	 * @author zhangh
	 * @return
	 */
	
	@SuppressWarnings("unchecked")
	public boolean initZlgkGczlJyxm(String[] uidsArr,String sj,String uids,String pid){
		//工程类别 
		//Jyxmlx 单位工程：1，分项工程：2，分部工程：3，检验批：4
		String sqlhg = "";
		String sqlbhg = "";
		String jyxmbh = "";
		Double ljhgs = 0d;
		Double ljbhgs = 0d;
		Double ljhgl = 0d;
		List<Map> listHgs = new ArrayList<Map>();
		List<Map> listBhgs = new ArrayList<Map>();
		for (int i = 0; i < uidsArr.length; i++) {
			for (int j = 1; j < 5; j++) {
				PcZlgkQuaDetail detail = new PcZlgkQuaDetail();
				detail.setSjType(sj);
				detail.setMasterId(uids);
				detail.setPid(pid);
				detail.setJyxmbh(uidsArr[i]);	//修改为存放检验项目主键，编号不唯一；
				detail.setJyxmlx(j+"");
				detail.setBybhgs(0d);
				detail.setByhgl(0d);
				detail.setByhgs(0d);
				//初始化时统计之前月份的累计合格数，累计不合格数
				jyxmbh = uidsArr[i];
				//累计合格数
				sqlhg = "select nvl(sum(byhgs),0) hgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+j+"' and pid='"+pid+"' and sj_type < '"+sj+"'";
				listHgs = JdbcUtil.query(sqlhg);
				ljhgs = listHgs.size()>0 ? ((BigDecimal) listHgs.get(0).get("HGS")).doubleValue():0;
				//累计不合格数
				sqlbhg = "select nvl(sum(bybhgs),0) bhgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+j+"' and pid='"+pid+"' and sj_type < '"+sj+"'";
				listBhgs = JdbcUtil.query(sqlbhg);
				ljbhgs = listBhgs.size()>0 ? ((BigDecimal) listBhgs.get(0).get("BHGS")).doubleValue():0;
				//累计合格率
				ljhgl = (ljhgs+ljbhgs)>0?ljhgs/(ljhgs+ljbhgs):0d;
				detail.setLjhgs(ljhgs);
				detail.setLjbhgs(ljbhgs);
				detail.setLjhgl(ljhgl);
				this.zlgkDAO.insert(detail);
			}
		}
		return true;
	}
	
	/**
	 * 获取时间期别
	 * @param pid
	 * @createDate 2011-06-16
	 * @author zhangh
	 * @return
	 */
	public String getSjTypeForZlgk(String pid){
		String jsonStr = "";
		Date date = new Date();
		int curYear = date.getYear()+1900;
		int curMonth = date.getMonth()+1;
		int lastYear = curYear - 2;
		int nextYear = curYear + 2;
		//从计划主表中获取已经存在的数据期别
		String yearInStr = "'"+String.valueOf(lastYear)+"',"+"'"+String.valueOf(curYear)+"',"+"'"+String.valueOf(nextYear)+"'"; 
		List<PcZlgkQuaInfo> list = this.zlgkDAO.findWhereOrderBy(PcZlgkQuaInfo.class.getName(), 
				"pid = '"+pid+"' and substr(sj_type,1,4) in("+yearInStr+")", "sj_type asc");
		String exsitSjType = "";
		for (int i =0;i<list.size();i++){
			exsitSjType = exsitSjType + "," + list.get(i).getSjType();
		}
		if(list.size()>0){
			exsitSjType = exsitSjType.substring(1);
		}
		for(int i = lastYear;i <= nextYear;i++){
			for(int j=1;j<=12;j++){
				String sjType = String.valueOf(i)+(j<10?"0"+String.valueOf(j):String.valueOf(j));
				String sjTypeDes = String.valueOf(i)+"年" + String.valueOf(j)+"月";
				if(exsitSjType.indexOf(sjType)==-1){
					jsonStr = jsonStr + ",['"+sjType+"','"+sjTypeDes+"']";
				}
			}
		}
		if(jsonStr.length()>0){
			jsonStr = "[" + jsonStr.substring(1)+"]";
		}else{
			jsonStr = "[]";
		}
		return jsonStr;		
	}
	
	/**
	 * 计算截止到当前月份以前的累计数（不含当前月份）
	 * @param pid
	 * @param uid 主表主键uids
	 * @param sj 当前检验期别
	 * @createDate 2011-06-20
	 * @author zhangh
	 * @return
	 */
	public String getLjhgsAndLjbhgs(String pid,String uid,String sj){
		PcZlgkQuaDetail detail = (PcZlgkQuaDetail) this.zlgkDAO.findById(PcZlgkQuaDetail.class.getName(), uid);
		String jyxmbh = detail.getJyxmbh();
		String jyxmlx = detail.getJyxmlx();
		//累计合格数
		String sqlhg = "select nvl(sum(byhgs),0) hgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+jyxmlx+"' and pid='"+pid+"' and sj_type < '"+sj+"'";
		List<Map> listHgs = JdbcUtil.query(sqlhg);
		Integer ljhgs = listHgs.size()>0 ? ((BigDecimal) listHgs.get(0).get("HGS")).intValue():0;
		//累计不合格数
		String sqlbhg = "select nvl(sum(bybhgs),0) bhgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+jyxmlx+"' and pid='"+pid+"' and sj_type < '"+sj+"'";
		List<Map> listBhgs = JdbcUtil.query(sqlbhg);
		Integer ljbhgs = listBhgs.size()>0 ? ((BigDecimal) listBhgs.get(0).get("BHGS")).intValue():0;
		return ljhgs+","+ljbhgs;
	}
	
	/**
	 * 修改某月份报表后更新该日期之后的累计数量。
	 * @param pid
	 * @param sj 当前修改保存检验期别
	 * @param lx 当前修改保存的检验项目类型
	 * @createDate 2011-06-20
	 * @author zhangh
	 */
	public void updateLjhgsAndLjbhgs(String pid,String sj,String lx){
		String where = "pid = '"+pid+"' and sj_type > '"+sj+"' and jyxmlx = '"+lx+"'";
		List<PcZlgkQuaDetail> list = this.zlgkDAO.findByWhere(PcZlgkQuaDetail.class.getName(), where);
		for (PcZlgkQuaDetail detail : list) {
			String jyxmbh = detail.getJyxmbh();
			String jyxmlx = detail.getJyxmlx();
			String sjType = detail.getSjType();
			//累计合格数
			String sqlhg = "select nvl(sum(byhgs),0) hgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+jyxmlx+"' and pid='"+pid+"' and sj_type <= '"+sjType+"'";
			List<Map> listHgs = JdbcUtil.query(sqlhg);
			//System.out.println("==="+sqlhg);
			Double ljhgs = listHgs.size()>0 ? ((BigDecimal) listHgs.get(0).get("HGS")).doubleValue():0;
			//累计不合格数
			String sqlbhg = "select nvl(sum(bybhgs),0) bhgs from pc_zlgk_qua_detail where jyxmbh='"+jyxmbh+"' and jyxmlx='"+jyxmlx+"' and pid='"+pid+"' and sj_type <= '"+sjType+"'";
			List<Map> listBhgs = JdbcUtil.query(sqlbhg);
			//System.out.println("==="+sqlbhg);
			Double ljbhgs = listBhgs.size()>0 ? ((BigDecimal) listBhgs.get(0).get("BHGS")).doubleValue():0;
			//累计合格率
			Double ljhgl = (ljhgs+ljbhgs)==0d ? 0d : ljhgs/(ljhgs+ljbhgs); 
			detail.setLjhgs(ljhgs);
			detail.setLjbhgs(ljbhgs);
			detail.setLjhgl(ljhgl);
			this.zlgkDAO.saveOrUpdate(detail);
		}
	}
	
	
	/**
	 * 删除验评信息，同时跟新累计合格数，累计不合格数，累计合格率
	 * @param uids 主表主键id
	 * @createDate 2011-06-20
	 * @author zhangh
	 */
	public boolean deletePcZlgkQuaInfoById(String uids){
		try {
			PcZlgkQuaInfo info = (PcZlgkQuaInfo) this.zlgkDAO.findById(PcZlgkQuaInfo.class.getName(), uids);
			//更新累计
			//删除附件记录
			FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
			List<SgccAttachList> listAttach = fileService.geAttachListByWhere("TRANSACTION_ID = '"+uids+"' and TRANSACTION_TYPE='PczlypReport'", null, null);
			for(int i=listAttach.size();i>0;i--){
				SgccAttachList obj=listAttach.get(i-1);
				fileService.deleteAttachBlob(obj);
				zlgkDAO.delete(obj);
			}
			//删除对应从表数据
			List<PcZlgkQuaDetail> list = this.zlgkDAO.findByWhere(PcZlgkQuaDetail.class.getName(), "masterId = '"+info.getUids()+"'");
			this.zlgkDAO.deleteAll(list);
			//删除主表数据
			this.zlgkDAO.delete(info);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 质量管控一览页调用累计合格率
	 * @param pid 
	 * @param sj
	 * @createDate 2011-06-22
	 * @author zhangh
	 */
	public String getLjhgl(String pid,String sj){
		//累计合格数
		String sqlhg = "select nvl(sum(byhgs),0) hgs from pc_zlgk_qua_detail where  pid='"+pid+"' and sj_type <= '"+sj+"'";
		List<Map> listHgs = JdbcUtil.query(sqlhg);
		Double ljhgs = listHgs.size()>0 ? ((BigDecimal) listHgs.get(0).get("HGS")).doubleValue():0;
		//累计不合格数
		String sqlbhg = "select nvl(sum(bybhgs),0) bhgs from pc_zlgk_qua_detail where  pid='"+pid+"' and sj_type <= '"+sj+"'";
		List<Map> listBhgs = JdbcUtil.query(sqlbhg);
		Double ljbhgs = listBhgs.size()>0 ? ((BigDecimal) listBhgs.get(0).get("BHGS")).doubleValue():0;
		//累计合格率
		Double ljhgl = (ljhgs+ljbhgs)>0 ? ljhgs/(ljhgs+ljbhgs):0;
		DecimalFormat df = new DecimalFormat("0.0000");
		String str = df.format(ljhgl);
		System.out.println("累计合格率"+str);
		return str;
	}
	
	/*
	 * 质量管控一览页调用本月合格率
	 * @param pid 
	 * @param sj
	 * @createDate 2011-06-22
	 * @author zhangh
	 */
	public String getByhgl(String pid,String sj){
		//本月合格数
		String sqlhg = "select nvl(sum(byhgs),0) hgs from pc_zlgk_qua_detail where  pid='"+pid+"' and sj_type = '"+sj+"'";
		List<Map> listHgs = JdbcUtil.query(sqlhg);
		Double ljhgs = listHgs.size()>0 ? ((BigDecimal) listHgs.get(0).get("HGS")).doubleValue():0;
		//本月不合格数
		String sqlbhg = "select nvl(sum(bybhgs),0) bhgs from pc_zlgk_qua_detail where  pid='"+pid+"' and sj_type = '"+sj+"'";
		List<Map> listBhgs = JdbcUtil.query(sqlbhg);
		Double ljbhgs = listBhgs.size()>0 ? ((BigDecimal) listBhgs.get(0).get("BHGS")).doubleValue():0;
		//本月合格率
		Double ljhgl = (ljhgs+ljbhgs)>0 ? ljhgs/(ljhgs+ljbhgs):0;
		
		DecimalFormat df = new DecimalFormat("0.0000");
		String str = df.format(ljhgl);
		System.out.println("本月合格率"+str);
		return str;
	}

	public Map<String, String> getProjectSheduleByPid(String pid) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
		String ljghl = this.getLjhgl(pid,sdf.format(new Date()));
		Double d = Double.parseDouble(ljghl);
		DecimalFormat df = new DecimalFormat("0.000");
		String str = df.format(d);
		Map map = new HashMap<String,String>();
		//累计合格率
		map.put("goodRage", String.valueOf(str));
		return map;
	}
	
	
	/**
	 * 数据交互：项目单位向上级公司提交监理报告
	 * @param unitid String 集团二级公司,集团三级公司或者集团公司编号
	 * @Param uids 某条监理报告唯一标识
	 * @return String 标识数据交互业务是否成功 
	 * @author xiaoz
	 * 
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public String submitSuperReport(String unitid, String uids)
	{
		String flag = "SUCESS"; 
		try{
			 PcZlgkSuperreportInfo report = (PcZlgkSuperreportInfo)zlgkDAO.findById(PcZlgkSuperreportInfo.class.getName(), uids);
			 if(report==null) return "failer";
			 
			 String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
			 if(deployType!=null&&deployType.equals("A")){//需要进行数据交互
				 SgccIniUnit unitBean = (SgccIniUnit) this.zlgkDAO.
				 		findBeanByProperty(SgccIniUnit.class.getName(),	"unitid", unitid);
				 //如果项目编号为PID的项目单位在sgcc_ini_unit表中找不到，立即返回交互失败
				 if(unitBean==null)
				 {
					 return "failer";
				 }	
				 //判断项目单位是否有数据交互的地址app_url，没有说明不需要进行数据交互，立即返回"unnecessary"
				 String appUrl = unitBean.getAppUrl();
				 if( appUrl == null || appUrl.equals("") )
				 {
					 return "unnecessary";
				 } 
			 
			 	 List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
				    
				 //对应附件大对象list
				 FileManagementService fileManagementServiceImp=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
				    
				 String attachSQL = "TRANSACTION_ID='"+uids+"'";
			    
				 try {
					attachList = fileManagementServiceImp.geAttachListByWhere(attachSQL, null, null);
				 } catch (BusinessException e) 
				 {
					e.printStackTrace();
				 }
				 
				 PcDynamicData dyda=new PcDynamicData();
				 dyda.setPid(report.getPid());
				 dyda.setPctablebean(PcZlgkSuperreportInfo.class.getName());
				 dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZlgkSuperreportInfo.class.getName()));
				 dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dyda.setPctableuids(report.getUids());
				 dyda.setPcdynamicdate(new Date());
				 dyda.setPcurl(DynamicDataUtil.QUALITY_SUPER_URL);
				
				 Session session =zlgkDAO.getSessionFactory().openSession();
				 session.beginTransaction();
				 session.save(dyda);
				 session.getTransaction().commit();
				 session.close();
				 
				 
				 List allDataList = new ArrayList();
			 	 allDataList.add(report);        //加入监理报告的beans
				 allDataList.addAll(attachList);	
				 allDataList.add(dyda);	
				 PCDataExchangeService exchangeServiceImp = (PCDataExchangeService)Constant.wact.getBean("PCDataExchangeService");
				 String afterSql = "update PC_ZLGK_SUPERREPORT_INFO set report_stat = '1' where uids = '"+report.getUids()+"'";
				 List listInQueue = exchangeServiceImp.getExcDataList(allDataList, unitid,
						 report.getPid(),null,afterSql,"上报监理报告【"+report.getPid()+"】");
				 
				 //加入大对象内容
				 if(attachList.size()>0&&listInQueue.size()>0){
					 PcDataExchange temp = (PcDataExchange)listInQueue.get(listInQueue.size()-1);
					 String txGroup = temp.getTxGroup();
					 long xh = temp.getXh();
					 for(int i=0;i<attachList.size();i++){
						 SgccAttachList attach = attachList.get(i);
						 
						 JSONArray kvarr = new JSONArray();
						 JSONObject kv = new JSONObject();
						 kv.put("FILE_LSH", attach.getFileLsh());
						 kvarr.add(kv);
						
						 PcDataExchange exchange = new PcDataExchange();
						 exchange.setTableName("SGCC_ATTACH_BLOB");
						 exchange.setBlobCol("FILE_NR");
						 exchange.setKeyValue(kvarr.toString());
						 exchange.setSuccessFlag("0");
						 exchange.setXh(++xh);
						 exchange.setSpareC5(report.getPid());
						 exchange.setPid(unitid);
						 exchange.setBizInfo("上报监理报告【"+report.getPid()+"】");
						 exchange.setTxGroup(txGroup);
						 
						 listInQueue.add(exchange);
					 }
				 }
				 //调试，加入待报送队列，查看数据是否完整
				 //exchangeServiceImp.addExchangeListToQueue(listInQueue);
				 Map<String, String> retVal = exchangeServiceImp.sendExchangeData(listInQueue);
				 String result = retVal.get("result");
			 
				 if(result.equalsIgnoreCase("success"))
				 {
					 report.setReportStat(1L);
					 zlgkDAO.saveOrUpdate(report);
				 }else{
					 flag = "failer";
				 }
			 }else{//不进行数据交互，直接修改报送状态即可
				 report.setReportStat(1L);
				 zlgkDAO.saveOrUpdate(report);
				 PcDynamicData dy=new PcDynamicData();
				 dy.setPid(report.getPid());
				 dy.setPctablebean(PcZlgkSuperreportInfo.class.getName());
				 dy.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZlgkSuperreportInfo.class.getName()));
				 dy.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dy.setPctableuids(report.getUids());
				 dy.setPcdynamicdate(new Date());
				 dy.setPcurl(DynamicDataUtil.QUALITY_SUPER_URL);
				 Session sess =zlgkDAO.getSessionFactory().openSession();
				 sess.beginTransaction();
				 sess.save(dy);
				 sess.getTransaction().commit();
				 sess.close();
			 }
			 return flag;
		 }catch(BusinessException ex){
			 ex.printStackTrace();
			 return "failer";
		 }   
	}
	/**
	 * 执行质量验评统计报表的数据交互
	 * @param uids
	 * @param pid
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String pcZlgkExchangeDataToQueue(String uids, String pid,String reportMan,String unitname){
		String str = "";
		String toUnitId="";
		try {
			//主表数据
			PcZlgkQuaInfo quaInfo = (PcZlgkQuaInfo) zlgkDAO.findById(com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo.class.getName(),uids);
			if(quaInfo==null){
				str = "数据不存在，上报失败！";
				return str;
			}
			//找到记录后, 查找该记录的二级公司, 如果没有二级公司merge="",
			 List lt = zlgkDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
				 		"connect by prior t.upunit = t.unitid start with t.unitid='"+quaInfo.getPid()+"' ");
			 String mergeSql = "";
			 if(lt.size()>0){
				 Object[] obj = (Object[]) lt.get(0);
				 String newUids = SnUtil.getNewID();
				 String unitid = (String) obj[0];//二级企业单位id
				 toUnitId = unitid;
				 String upunitname = (String) obj[1];//二级企业名称
				 String reportname = upunitname+quaInfo.getSjType().substring(0,4)+"年"+quaInfo.getSjType().substring(4,6)+"月"+"质量验评结果月度报表";
				 
				 mergeSql = "merge into pc_zlgk_qua_info tab1 using (select '"+unitid+"' as pid," +
			 		"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, '0' as report_status," +
			 		"'"+quaInfo.getSjType()+"' as sj_type from dual ) tab2 " +
			 		"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
			 		"insert (pid,uids,createdate,reportname,report_status,sj_type) values (tab2.pid,tab2.uids," +
			 		"tab2.createdate,tab2.reportname,tab2.report_status,tab2.sj_type) when matched then update set tab1.memo=''";
			 }
			
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				//获取PCDataExchangeService实例
				PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
				
				//修改上报状态字段
				String afterSql = "update PC_BID_ZB_APPLY set REPORT_STATUS=1 where UIDS = '"+uids+"'";
				//从表信息
				List<PcZlgkQuaDetail> listDetail = this.zlgkDAO.findByWhere(PcZlgkQuaDetail.class.getName(), "masterId = '"+uids+"'");
				//附件信息
				List<SgccAttachList> listAttach = fileService.geAttachListByWhere("TRANSACTION_ID = '"+uids+"'", null, null);
				//质量检验项目信息
				String sql = "select distinct t.jyxmbh from pc_zlgk_qua_detail t where t.master_id = '"+uids+"'";
				String jyxmUids = "";
				List<GczlJyxm> listJyxm = new ArrayList<GczlJyxm>();
				List<Map<String, String>> l = JdbcUtil.query(sql);
				if(l.size()>0){
					for (Map<String, String> map : l) {
						jyxmUids += ",'"+map.get("JYXMBH")+"'";
					}
					jyxmUids = jyxmUids.substring(1);
					String jyxmWhere = " uids in ("+jyxmUids+") and pid = '"+pid+"' ";
					listJyxm = this.zlgkDAO.findByWhere(GczlJyxm.class.getName(), jyxmWhere);
				}
				
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(quaInfo.getPid());
				bussBack.setBusniessId(quaInfo.getUids());
				bussBack.setBackUser(reportMan);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("质量验评月报上报【项目单位上报到二级企业】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(unitname);
				bussBack.setBackReason("  ");
				
				 PcDynamicData dyda=new PcDynamicData();
				 dyda.setPid(quaInfo.getPid());
				 dyda.setPctablebean(PcZlgkQuaInfo.class.getName());
				 dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZlgkQuaInfo.class.getName()));
				 dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dyda.setPctableuids(quaInfo.getUids());
				 dyda.setPcdynamicdate(new Date());
				 dyda.setPcurl(DynamicDataUtil.QUALITY_ASS_URL);
				
				 Session session =zlgkDAO.getSessionFactory().openSession();
				 session.beginTransaction();
				 session.save(dyda);
				 session.save(bussBack);
				 session.getTransaction().commit();
				 session.close();
				 
				List allDataList = new ArrayList();
				allDataList.add(quaInfo);//主表数据
				allDataList.addAll(listDetail);//从表数据
				allDataList.addAll(listAttach);//附件信息
				allDataList.addAll(listJyxm);//质量检验项目信息
				allDataList.add(dyda);
				allDataList.add(bussBack);
				
				//获取数据交换对象列表
				List<PcDataExchange> exchangeList = excService.getExcDataList(allDataList, toUnitId, 
						quaInfo.getPid(), mergeSql, afterSql, "上报质量验评【"+quaInfo.getPid()+"】");
				
				//加入大对象内容
				 if(listAttach.size()>0&&exchangeList.size()>0){
					 PcDataExchange temp = (PcDataExchange)exchangeList.get(exchangeList.size()-1);
					 String txGroup = temp.getTxGroup();
					 long xh = temp.getXh();
					 for(int i=0;i<listAttach.size();i++){
						 SgccAttachList attach = listAttach.get(i);
						 
						 JSONArray kvarr = new JSONArray();
						 JSONObject kv = new JSONObject();
						 kv.put("FILE_LSH", attach.getFileLsh());
						 kvarr.add(kv);
						
						 PcDataExchange exchange = new PcDataExchange();
						 exchange.setTableName("SGCC_ATTACH_BLOB");
						 exchange.setBlobCol("FILE_NR");
						 exchange.setKeyValue(kvarr.toString());
						 exchange.setSuccessFlag("0");
						 exchange.setXh(++xh);
						 exchange.setSpareC5(quaInfo.getPid());
						 exchange.setPid(Constant.DefaultOrgRootID);
						 exchange.setBizInfo("上报质量验评【"+quaInfo.getPid()+"】");
						 exchange.setTxGroup(txGroup);
						 
						 exchangeList.add(exchange);
					 }
				 }
				
				 //将数据加入队列
				 //excService.addExchangeListToQueue(exchangeList);
				 //直接发送
				 Map<String, String> rtnMap = excService.sendExchangeData(exchangeList);
				 if(rtnMap.get("result").equalsIgnoreCase("success")){
					 quaInfo.setCreateperson(reportMan);
					 quaInfo.setReportStatus(1D);
					 zlgkDAO.saveOrUpdate(quaInfo);
					 str = "上报成功！";
				 }else{
					 zlgkDAO.delete(bussBack);
					 str = "上报失败！";
				 }
			}else{
				quaInfo.setReportStatus(1D);
				quaInfo.setCreateperson(reportMan);
				zlgkDAO.saveOrUpdate(quaInfo);
				zlgkDAO.updateBySQL(mergeSql);
				 PcDynamicData dyda=new PcDynamicData();
				 dyda.setPid(quaInfo.getPid());
				 dyda.setPctablebean(PcZlgkQuaInfo.class.getName());
				 dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcZlgkQuaInfo.class.getName()));
				 dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dyda.setPctableuids(quaInfo.getUids());
				 dyda.setPcdynamicdate(new Date());
				 dyda.setPcurl(DynamicDataUtil.QUALITY_ASS_URL);
				
				 Session session =zlgkDAO.getSessionFactory().openSession();
				 session.beginTransaction();
				 session.save(dyda);
				 session.getTransaction().commit();
				 session.close();
				str = "上报成功！";
			}
		} catch (Exception e) {
			e.printStackTrace();
			str = "系统异常，上报失败！";
		}
		return str;
	}
	/**
	 * 执行招标申请信息上报的数据交互
	 * @param uids
	 * @param pid
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String pcZbsqxxExchangeDataToQueue(String uids, String pid,String reportMan,String unitname){
		String str = "";
		String toUnitId="";
		try {
			//主表数据
			PcBidZbApply quaInfo = (PcBidZbApply) zlgkDAO.findById(PcBidZbApply.class.getName(),uids);
			if(quaInfo==null){
				str = "数据不存在，上报失败！";
				return str;
			}
			//找到记录后, 查找该记录的二级公司, 如果没有二级公司merge="",
			 List lt = zlgkDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
				 		"connect by prior t.upunit = t.unitid start with t.unitid='"+quaInfo.getPid()+"' ");
			 String mergeSql = "";
			 if(lt.size()>0){
				 Object[] obj = (Object[]) lt.get(0);
				 String newUids = SnUtil.getNewID();
				 String unitid = (String) obj[0];//二级企业单位id
				 toUnitId = unitid;
				 String upunitname = (String) obj[1];//二级企业名称
				// String reportname = upunitname+quaInfo.getSjType().substring(0,4)+"年"+quaInfo.getSjType().substring(4,6)+"月"+"质量验评结果月度报表";
				 
				 mergeSql = "merge into pc_bid_zb_apply tab1 using (select '"+unitid+"' as pid," +
			 		"'"+newUids+"' as uids,'"+quaInfo.getZbType()+"' as zbtype,'"+quaInfo.getZbName()+"' as zbname,'"+quaInfo.getZbWay()+"' as zbway, '0' as report_status " +
			 		"from dual ) tab2 " +
			 		"on ( tab1.pid=tab2.pid ) when not matched then " +
			 		"insert (pid,uids,zb_type,zb_name,zb_way,report_status) values (tab2.pid,tab2.uids," +
			 		"tab2.zbtype,tab2.zbname,tab2.zbway,tab2.report_status) when matched then update set tab1.memo=''";
			 }
			PcBusniessBack bussBack1=new PcBusniessBack();
			bussBack1.setPid(quaInfo.getPid());
			bussBack1.setBusniessId(quaInfo.getUids());
			bussBack1.setBackUser(reportMan);
			bussBack1.setBackDate(new Date());
			bussBack1.setBusniessType("招标申请信息上报【项目单位上报到二级企业】");
			bussBack1.setSpareC1("上报");
			bussBack1.setSpareC2(unitname);
			bussBack1.setBackReason("  ");
			this.zlgkDAO.insert(bussBack1);
			if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				//获取PCDataExchangeService实例
				PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
				
				//修改上报状态字段
				String afterSql = "update pc_bid_zb_apply set REPORT_STATUS=1 where UIDS = '"+uids+"'";
				//从表信息
				List<PcZlgkQuaDetail> listDetail = this.zlgkDAO.findByWhere(PcBidZbContent.class.getName(), "zbUids = '"+uids+"'");
				//附件信息
				List<SgccAttachList> listAttach = fileService.geAttachListByWhere("TRANSACTION_ID = '"+uids+"'", null, null);
//				//质量检验项目信息
//				String sql = "select distinct t.jyxmbh from pc_zlgk_qua_detail t where t.master_id = '"+uids+"'";
//				String jyxmUids = "";
//				List<GczlJyxm> listJyxm = new ArrayList<GczlJyxm>();
//				List<Map<String, String>> l = JdbcUtil.query(sql);
//				if(l.size()>0){
//					for (Map<String, String> map : l) {
//						jyxmUids += ",'"+map.get("JYXMBH")+"'";
//					}
//					jyxmUids = jyxmUids.substring(1);
//					String jyxmWhere = " uids in ("+jyxmUids+") and pid = '"+pid+"' ";
//					listJyxm = this.zlgkDAO.findByWhere(GczlJyxm.class.getName(), jyxmWhere);
//				}
				
				PcBusniessBack bussBack=new PcBusniessBack();
				bussBack.setPid(quaInfo.getPid());
				bussBack.setBusniessId(quaInfo.getUids());
				bussBack.setBackUser(reportMan);
				bussBack.setBackDate(new Date());
				bussBack.setBusniessType("招标申请信息上报【项目单位上报到二级企业】");
				bussBack.setSpareC1("上报");
				bussBack.setSpareC2(unitname);
				bussBack.setBackReason("  ");
				 PcDynamicData dyda=new PcDynamicData();
				 dyda.setPid(quaInfo.getPid());
				 dyda.setPctablebean(PcBidZbApply.class.getName());
				 dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidZbApply.class.getName()));
				 dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dyda.setPctableuids(quaInfo.getUids());
				 dyda.setPcdynamicdate(new Date());
				 dyda.setPcurl(DynamicDataUtil.QUALITY_ASS_URL);
				
				 Session session =zlgkDAO.getSessionFactory().openSession();
				 session.beginTransaction();
				 session.save(dyda);
				 session.save(bussBack);
				 session.getTransaction().commit();
				 session.close();
				 
				List allDataList = new ArrayList();
				allDataList.add(quaInfo);//主表数据
				allDataList.addAll(listDetail);//从表数据
				allDataList.addAll(listAttach);//附件信息
				//allDataList.addAll(listJyxm);//质量检验项目信息
				allDataList.add(dyda);
				allDataList.add(bussBack);
				
				//获取数据交换对象列表
				List<PcDataExchange> exchangeList = excService.getExcDataList(allDataList, toUnitId, 
						quaInfo.getPid(), mergeSql, afterSql, "招标申请信息【"+quaInfo.getPid()+"】");
				
				//加入大对象内容
				 if(listAttach.size()>0&&exchangeList.size()>0){
					 PcDataExchange temp = (PcDataExchange)exchangeList.get(exchangeList.size()-1);
					 String txGroup = temp.getTxGroup();
					 long xh = temp.getXh();
					 for(int i=0;i<listAttach.size();i++){
						 SgccAttachList attach = listAttach.get(i);
						 
						 JSONArray kvarr = new JSONArray();
						 JSONObject kv = new JSONObject();
						 kv.put("FILE_LSH", attach.getFileLsh());
						 kvarr.add(kv);
						
						 PcDataExchange exchange = new PcDataExchange();
						 exchange.setTableName("SGCC_ATTACH_BLOB");
						 exchange.setBlobCol("FILE_NR");
						 exchange.setKeyValue(kvarr.toString());
						 exchange.setSuccessFlag("0");
						 exchange.setXh(++xh);
						 exchange.setSpareC5(quaInfo.getPid());
						 exchange.setPid(Constant.DefaultOrgRootID);
						 exchange.setBizInfo("招标申请信息【"+quaInfo.getPid()+"】");
						 exchange.setTxGroup(txGroup);
						 
						 exchangeList.add(exchange);
					 }
				 }
				
				 //将数据加入队列
				 //excService.addExchangeListToQueue(exchangeList);
				 //直接发送
				 Map<String, String> rtnMap = excService.sendExchangeData(exchangeList);
				 if(rtnMap.get("result").equalsIgnoreCase("success")){
					 //quaInfo.setCreateperson(reportMan);
					 quaInfo.setReportStatus(1D);
					 zlgkDAO.saveOrUpdate(quaInfo);
					 str = "上报成功！";
				 }else{
					 zlgkDAO.delete(bussBack);
					 str = "上报失败！";
				 }
			}else{
				quaInfo.setReportStatus(1D);
				//quaInfo.setCreateperson(reportMan);
				zlgkDAO.saveOrUpdate(quaInfo);
				zlgkDAO.updateBySQL(mergeSql);
				 PcDynamicData dyda=new PcDynamicData();
				 dyda.setPid(quaInfo.getPid());
				 dyda.setPctablebean(PcBidZbApply.class.getName());
				 dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidZbApply.class.getName()));
				 dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
				 dyda.setPctableuids(quaInfo.getUids());
				 dyda.setPcdynamicdate(new Date());
				 dyda.setPcurl(DynamicDataUtil.QUALITY_ASS_URL);
				
				 Session session =zlgkDAO.getSessionFactory().openSession();
				 session.beginTransaction();
				 session.save(dyda);
				 session.getTransaction().commit();
				 session.close();
				str = "上报成功！";
			}
		} catch (Exception e) {
			e.printStackTrace();
			str = "系统异常，上报失败！";
		}
		return str;
	}
	/**
	 * 删除  
	 * 		在记录中，同期别的数据，相应的检验项目不用的类型有4条数据，对于少于4条的检验项目，是在xgrid中做了删除，同时删除其他类型的项目；
	 * @param pid
	 * @param sjType
	 * @author: Liuay
	 * @createDate: 2011-12-9
	 */
	public void delDwgcFromQuaDetail(String pid, String sjType) {
		String whereStr = " sj_type='" + sjType + "' and pid = '" + pid + "'";
		String delSql = "delete  from pc_zlgk_qua_detail where jyxmbh in (" +
				"select jyxmbh from  pc_zlgk_qua_detail where " + whereStr +
				" group by pid, sj_type, jyxmbh" +
				" having count(jyxmbh)<4)" +
				" and " + whereStr;
		JdbcUtil.execute(delSql);
	}
	
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,long state){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			VPcZlgkQuaInfo reportHbmV = (VPcZlgkQuaInfo) zlgkDAO.findById(VPcZlgkQuaInfo.class.getName(), uids);
			if(reportHbmV!=null){
				PcZlgkQuaInfo reportHbm = (PcZlgkQuaInfo) zlgkDAO.findById(PcZlgkQuaInfo.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "质量验评月报"+op);
				String unitTypeId = reportHbmV.getUnitTypeId();
				Double oldState = reportHbm.getReportStatus();
				
				reportHbm.setReportStatus(Double.valueOf(state));
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "质量验评月报"+op);
				if(flag.equals("0")){
					reportHbm.setReportStatus(oldState);
					session.beginTransaction();
					session.update(reportHbm);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		if(flag=="1"&&state==2){
			FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
			List<SgccAttachList> listAttach = fileService.geAttachListByWhere("TRANSACTION_ID = '"+uids+"' and TRANSACTION_TYPE='PczlypReport'", null, null);
			for(int i=listAttach.size();i>0;i--){
				SgccAttachList obj=listAttach.get(i-1);
				fileService.deleteAttachBlob(obj);
				zlgkDAO.delete(obj);
			}
		}
		return flag;
	}
	/**
	 * 招标申请信息审核
	 */
	public String updateZbsqState(String uids,String backUser,String unitname,String reason,String fromUnit,long state){
		String flag = "1";
		String op="";
		if(state==2)op="退回";
		if(state==3)op="审核通过";
		try{
			VPcBidZbApply reportHbmV = (VPcBidZbApply) zlgkDAO.findById(com.sgepit.pcmis.bid.hbm.VPcBidZbApply.class.getName(), uids);
			if(reportHbmV!=null){
				PcBidZbApply reportHbm = (PcBidZbApply) zlgkDAO.findById(PcBidZbApply.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "招标申请信息上报"+op);
				String unitTypeId = reportHbmV.getUnitTypeId();
				Double oldState = reportHbm.getReportStatus();
				
				reportHbm.setReportStatus(Double.valueOf(state));
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "招标申请信息上报"+op);
				if(flag.equals("0")){
					reportHbm.setReportStatus(oldState);
					session.beginTransaction();
					session.update(reportHbm);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		if(flag=="1"&&state==2){
			FileManagementService fileService=(FileManagementService)Constant.wact.getBean("fileServiceImpl");
			List<SgccAttachList> listAttach = fileService.geAttachListByWhere("TRANSACTION_ID = '"+uids+"' and TRANSACTION_TYPE='PczlypReport'", null, null);
			for(int i=listAttach.size();i>0;i--){
				SgccAttachList obj=listAttach.get(i-1);
				fileService.deleteAttachBlob(obj);
				zlgkDAO.delete(obj);
			}
		}
		return flag;
	}
	public String assessmentReportTojt(String uids, String sendPerson,String unitname)
	{
		String flag = "1";
		String beanName = "com.sgepit.pcmis.zlgk.hbm.PcZlgkQuaInfo";
		try
		{
			PcZlgkQuaInfo compM = (PcZlgkQuaInfo)zlgkDAO.findById(beanName, uids);
			 List lt = zlgkDAO.getDataAutoCloseSes("select pid from v_pc_zlgk_qua_info t where t.sj_type='" + compM.getSjType() + "' " +
				 		"and report_status='3' and unit_type_id='A'");
			 if(lt.size()==0){
				 return "2";
			 }
			compM.setReportStatus(1D);
			compM.setCreateperson(sendPerson);
			zlgkDAO.saveOrUpdate(compM);
			
			PcBusniessBack bussBack=new PcBusniessBack();
			bussBack.setPid(compM.getPid());
			bussBack.setBusniessId(compM.getUids());
			bussBack.setBackUser(sendPerson);
			bussBack.setBackDate(new Date());
			bussBack.setBusniessType("质量验评上报【二级企业->集团】");
			bussBack.setSpareC1("上报");
			bussBack.setSpareC2(unitname);
			bussBack.setBackReason(" ");
			zlgkDAO.saveOrUpdate(bussBack);
		}
		catch(BusinessException ex)
		{
			 flag = "0";
			 log.debug(Constant.getTrace(ex));
			 ex.printStackTrace();
		}
		
		return flag;
	}
	/**
	 *累计验评定优良率--累计验评定合格率
	 * @param pid 
	 * @param sj
	 * @createDate 2011-08-02
	 * @author shangtw
	 */
	//累计验评定优良率--累计验评定合格率
	@SuppressWarnings("unchecked")
	public List getNewLastedReportName(String orderby, Integer start,Integer limit, HashMap params) throws SQLException, BusinessException
	{
		JdbcTemplate jt= new JdbcTemplate(HibernateSessionFactory.getConnectionFactory());
		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		
		String unitid = params.get("unitid")==null?"":params.get("unitid").toString();
		String projName = params.get("projName")==null?"%":params.get("projName").toString();
		String month = params.get("sjType")==null?"%":params.get("sjType").toString();
		List pids = sys.getPidsByUnitid(unitid);
		
		List<JSONObject> rptnames = new ArrayList();
		
		if(pids.size()==0)
		{
			return new ArrayList();
		}
		
		for (Iterator it = pids.iterator(); it.hasNext();) {
			JSONObject json = new JSONObject();
			SgccIniUnit unit = (SgccIniUnit) it.next();
			String pid = unit.getUnitid();
			
			//点击"查询按钮的部分"
			List lt0 = this.zlgkDAO.findByWhere(com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo.class.getName(), 
						"pid='"+pid+"' and prj_Name like '%"+projName+"%'");
			if(lt0.size()==0) continue;
			
			String _SQL = "select uids,reportname from pc_zlgk_superreport_info " +
					"where createdate="+"(select max(createdate) from pc_zlgk_superreport_info " +
							"where pid='"+pid+"' and report_stat = '1' and to_char(createdate, 'yyyymm')<='"+month+"' and " +
									"uids in (select transaction_id from SGCC_ATTACH_LIST t where transaction_type = 'PCJianLiBaoGao' ))";
			LogFactory.getLog(PCZlgkServiceImpl.class).info("最新监理周报SQL:"+_SQL);
			//获得验评合格率的相关信息
			String sql = "select t_dwgc_hg,t_dwgc_yl,t_fbgc_hg,t_fbgc_yl,t_fxgc_hg,t_fxgc_yl from pc_zlgk_qua_detail where unit_id='"+pid+"' and master_id in(select uids from  PC_ZLGK_QUA_INFO where report_status!=0 and pid='"+pid+"')";
			List list = jt.queryForList(_SQL);
			List list2 = jt.queryForList(sql);
			json.put("pid", pid);
			if(list.size()>0){
				ListOrderedMap map1 = new ListOrderedMap();
				map1  = (ListOrderedMap)list.get(0);
				String reportname = map1.get("REPORTNAME").toString();
				String reportuids = map1.get("UIDS").toString();
				json.put("reportname", reportname);
				json.put("reportuids", reportuids);
			}else{
				json.put("reportname", "");
				json.put("reportname", "");
			}
			
			if(list2.size()>0){
				ListOrderedMap map2 = new ListOrderedMap();
				map2  = (ListOrderedMap)list2.get(0);
				List valuelist = map2.valueList();
				System.out.println("pid="+pid+"---sj="+month);
				json.put("ljyll", this.getljyll(pid));//累计验评定优良率
				json.put("ljhgl", this.getljhgl(pid));//累计验评定合格率
			}else{
				json.put("ljhgl", -1);
				json.put("byhgl", -1);
			}
			
			rptnames.add(json);
		}
		return rptnames;
	}	
	/**
	 * 质量管控一累计验评定优良率
	 * @param pid 
	 * @createDate 2011-08-02
	 * @author shangtw
	 */
	public String getljyll(String pid){
		String sqlTotal = "select  nvl(sum(t_dwgc_hg),0) tdwgchg,nvl(sum(t_dwgc_yl),0) tdwgcyl,nvl(sum(t_fbgc_hg),0) tfbgchg,nvl(sum(t_fbgc_yl),0) tfbgcyl,nvl(sum(t_fxgc_hg),0) tfxgchg,nvl(sum(t_fxgc_yl),0) tfxgcyl from pc_zlgk_qua_detail where unit_id='"+pid+"' and  master_id in(select uids from  PC_ZLGK_QUA_INFO where report_status!=0 and pid='"+pid+"')";
		//自开工累计包括单位工程、分部工程、分项工程优良合格的总数
		List<Map> listTotal = JdbcUtil.query(sqlTotal);
		//单位工程合格，优良
		Double tdwgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tdwgchg")).doubleValue():0;
		Double tdwgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tdwgcyl")).doubleValue():0;
		//分部工程合格，优良
		Double tfbgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfbgchg")).doubleValue():0;
		Double tfbgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfbgcyl")).doubleValue():0;
		//分项工程合格，优良
		Double tfxgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfxgchg")).doubleValue():0;
		Double tfxgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfxgcyl")).doubleValue():0;
		Double ljyll = (tdwgcyl+tfbgcyl+tfxgcyl)>0 ? (tdwgcyl+tfbgcyl+tfxgcyl)/(tdwgcyl+tfbgcyl+tfxgcyl+tdwgchg+tfbgchg+tfxgchg):0;
		DecimalFormat df = new DecimalFormat("0.0000");
		String str = df.format(ljyll);
		System.out.println("累计验评定优良率"+str);
		return str;
	}	
	/**
	 * 质量管控一累计验评定合格率
	 * @param pid 
	 * @createDate 2011-08-02
	 * @author shangtw
	 */
	public String getljhgl(String pid){
		String sqlTotal = "select  nvl(sum(t_dwgc_hg),0) tdwgchg,nvl(sum(t_dwgc_yl),0) tdwgcyl,nvl(sum(t_fbgc_hg),0) tfbgchg,nvl(sum(t_fbgc_yl),0) tfbgcyl,nvl(sum(t_fxgc_hg),0) tfxgchg,nvl(sum(t_fxgc_yl),0) tfxgcyl from pc_zlgk_qua_detail where unit_id='"+pid+"' and master_id in(select uids from  PC_ZLGK_QUA_INFO where report_status!=0 and pid='"+pid+"')";
		//自开工累计包括单位工程、分部工程、分项工程优良合格的总数
		List<Map> listTotal = JdbcUtil.query(sqlTotal);
		//单位工程合格，优良
		Double tdwgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tdwgchg")).doubleValue():0;
		Double tdwgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tdwgcyl")).doubleValue():0;
		//分部工程合格，优良
		Double tfbgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfbgchg")).doubleValue():0;
		Double tfbgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfbgcyl")).doubleValue():0;
		//分项工程合格，优良
		Double tfxgchg = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfxgchg")).doubleValue():0;
		Double tfxgcyl = listTotal.size()>0 ? ((BigDecimal) listTotal.get(0).get("tfxgcyl")).doubleValue():0;
		Double ljhgl = (tdwgcyl+tfbgcyl+tfxgcyl+tdwgchg+tfbgchg+tfxgchg)>0 ? (tdwgcyl+tfbgcyl+tfxgcyl+tdwgchg+tfbgchg+tfxgchg)/(tdwgcyl+tfbgcyl+tfxgcyl+tdwgchg+tfbgchg+tfxgchg):0;
		DecimalFormat df = new DecimalFormat("0.0000");
		String str = df.format(ljhgl);
		System.out.println("累计验评定合格率"+str);
		return str;
	}

    /**
     * 质量验评分类树维护
     * @param orderBy
     * @param start
     * @param limit
     * @param map
     * @return
     * @date 2013-6-3
     */
	public List<ColumnTreeNode> pcZlgkZlypTree(String orderBy, Integer start,
			Integer limit, HashMap map) {
			List<PcZlgkZlypTree> list = new ArrayList();
		       //页面定义处的参数
			String  parent=(String)map.get("parent");
				       //页面定义处的参数
			String pid=(String)map.get("pid");
				       //拼装一般查询语句
			list =zlgkDAO.findByWhere(PcZlgkZlypTree.class.getName(), " parent_id='"+parent+"' and pid='"+pid+"'","tree_id");
//			if(list.size() == 0){
//				 list =	originalPcZlgkZlypTree(pid);
//				}			
			             //对查询语句的返回值进行处理，
						//其中isleaf是指数据库中返回给EntryBean是否有子节点的状态标志
						//isleaf是根据当前实体Bean 中的属性进行定义
						//如果需要显示是否被选中则需要在返回Bean 中设置ischeck属性不为空
						//如果没有设置也页面没有设置ischeck属性则不显示复选框如果设置且页面设置
						//则页面显示复选框及是否选中状态
			List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
			return newList;
		}
    /**
     * 初始化质量验评分类维护树
     * @param pid
     * @return
     * @author yanglh
     * @date 2013-6-3
     */	
	public List<PcZlgkZlypTree> originalPcZlgkZlypTree(String pid){
		List<SgccIniUnit> listUnit = this.zlgkDAO.findByWhere(SgccIniUnit.class.getName(), "unitid='"+pid+"'");
		SgccIniUnit sgccIniUnit = listUnit.get(0);
		//添加根节点
		PcZlgkZlypTree  root = new PcZlgkZlypTree();
		root.setPid(pid);//设置PID
		root.setEngineerName(sgccIniUnit.getUnitname());
		root.setEngineerNo("01");
		root.setEngineerType("01");//root 
		root.setParentNo("0");
		root.setIsleaf(Long.valueOf("1"));
		root.setMemo("");
		root.setTreeId("01");
		root.setParentId("0");
		this.zlgkDAO.insert(root);
		addPcZlgkRightSortDept(root.getUuid(),"",pid);
		String where  = " parent_id='"+root.getParentNo()+"' and pid='"+root.getPid()+"'";
		List<PcZlgkZlypTree> list =zlgkDAO.findByWhere(PcZlgkZlypTree.class.getName(), where,"tree_id");
        return list;
		
	}

    /**
     * 新增或者修改质量验评分类树
     * @param zlypTree
     * @return
     * @author yanglh
     * @date 2013-6-17
     */
	public String zlypAddOrUpdate(PcZlgkZlypTree zlypTree) {
	    if(zlypTree.getUuid().equals("")){
	    	this.zlgkDAO.insert(zlypTree);
	    	return "add'"+zlypTree.getUuid()+"'"+zlypTree.getTreeId();
	    }else{
	    	this.zlgkDAO.saveOrUpdate(zlypTree);
	    	return "update'"+zlypTree.getUuid()+"'"+zlypTree.getTreeId();
	    }
	}

    /**
     * 删除选择记录的质量验评分类树信息
     * @param uuid
     * @param pid
     * @param parentid
     * @return
     * @author yanglh
     * @date 2013-6-18
     */
	public String zlypDeleteDate(String uuid, String pid, String parentid,String engineerNo) {
		String returnStr = "";
		String delSql = "select * from (select * from pc_zlgk_zlyp_tree start with tree_id='"+engineerNo+"' " +
				        " and pid='"+pid+"' connect by prior tree_id =parent_id) where pid='"+pid+"'";
		String querySql = "select uuid from (select * from pc_zlgk_zlyp_tree start with tree_id='"+parentid+
		                  "' and pid='"+pid+"' connect by prior tree_id =parent_id ) where pid='"+pid+"'";
		//删除选择的节点（如何有子节点，也要删除）
		List list=JdbcUtil.query(delSql);
		//查询删除节点的父节点是否还有子节点，如果没有，修改节点状态
		List queryList=JdbcUtil.query(querySql);
		if(list.size()>0){
			for(int i = 0; i < list.size(); i ++){
				Map m = (Map) list.get(i);
				Object o = m.get("uuid");
				String getUuid=o.toString();
				PcZlgkZlypTree getDate = (PcZlgkZlypTree)this.zlgkDAO.findById(PcZlgkZlypTree.class.getName(), getUuid);
				this.zlgkDAO.delete(getDate);
				String delDeptSql = " fileSortId='"+getUuid+"'";
				List   sortdept = this.zlgkDAO.findByWhere(PcZlgkRightSortDept.class.getName(), delDeptSql);
				this.zlgkDAO.deleteAll(sortdept);
			}
			
			returnStr = String.valueOf(list.size());
		}else{
			returnStr = "";
		}
		if((queryList.size()- list.size()) == 1){
			Map updateM = (Map) queryList.get(0);
			Object updateO = updateM.get("uuid");
			String updateSql = "update pc_zlgk_zlyp_tree set isleaf='1' where uuid='"+updateO.toString()+"'";
			JdbcUtil.execute(updateSql);
		}			
	  return returnStr ;//返回删除节点的数目
	}

	

	/**
	 * 构造质量验评标准分类树
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if (treeName.equalsIgnoreCase("zlgkZlypTypeTree")) {	
			String parent = ((String[])params.get("parent"))[0];
			String pid = ((String[])params.get("pid"))[0];
			String whereStr =  ((String[])params.get("orgid"))[0];
			list = this.getZlgkZlypTreeList( parent,whereStr,pid);
		}
		return list;
	}
    //获取质量验评分类树
	private List<ColumnTreeNode> getZlgkZlypTreeList(String parent,
			String whereStr, String pid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String [] parentIf=parent.split("`");
		String treeIdIf="";
		if(parentIf.length>1){
			treeIdIf=parentIf[1];
		}
		parent=parentIf[0];
		StringBuffer str = new StringBuffer();
		
		if(parent!=null &&!"".equals(parent)){
		   str.append(" parentId='"+parent+"' and pid='"+pid+"'");
		}else {
			str.append(" start with t.parentId='01' and pid='"+pid+"' connect by prior treeId=parentId and pid='"+pid+"' ");
		}
		
		if(treeIdIf !=null &&!"".equals(treeIdIf)){
			str.append(" and treeId not in ('" + treeIdIf + "') and pid='"+pid+"'");
		}
		str.append(" and uuid in( select fileSortId from PcZlgkRightSortDept  where rightLvl='Write' "+whereStr+")");
		List<PcZlgkZlypTree> list1 = this.zlgkDAO.findByWhere(PcZlgkZlypTree.class.getName(),str.toString(),"treeId");
		for(int i=0;i<list1.size();i++){
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			PcZlgkZlypTree zlypTree = (PcZlgkZlypTree) list1.get(i);
			Long leaf = zlypTree.getIsleaf();			
			n.setId((zlypTree == null ?"sort":zlypTree.getUuid()));// 设置不同的tree id
			n.setText(zlypTree.getEngineerName());
			if (leaf == 1) {
				n.setLeaf(true);				
				n.setIconCls("icon-cmp");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("icon-pkg");	// treenode.iconCls   icon-pkg 文件夹样式    task-folder
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode
			JSONObject jo = JSONObject.fromObject(zlypTree);
			cn.setColumns(jo);					// columns
			list.add(cn);
		}
		return list;
	}

    /**
     * 质量验评记录管理新增或者修改
     * @param zlyprecord
     * @param getFielId  修改大对象相关表中附件的事物编号
     * @return
     * @author yanglh
	 * @date 2013-6-21
     */
	public String zlgkZlypRecordAddOrUpdate(PcZlgkZlypRecord zlyprecord,String getfileId) {
		if(zlyprecord.getUuid().equals("") || zlyprecord.getUuid() == null){
			this.zlgkDAO.insert(zlyprecord);
			//先上传附件在新增业务数据，对大对象相关表事务编号进行设置为业务数据的主键
			if(!getfileId.equals("")){
				String updateSql = "update sgcc_attach_list set transaction_id='"+zlyprecord.getUuid()+"' where file_lsh in ("+getfileId+")";
				this.zlgkDAO.updateBySQL(updateSql);			
			}
			return "add'"+zlyprecord.getTreeUuid();
		}else{
			this.zlgkDAO.saveOrUpdate(zlyprecord);
			//先上传附件在新增业务数据，对大对象相关表事务编号进行设置为业务数据的主键
			if(!getfileId.equals("")){
				String updateSql = "update sgcc_attach_list set transaction_id='"+zlyprecord.getUuid()+"' where file_lsh in ("+getfileId+")";
				this.zlgkDAO.updateBySQL(updateSql);			
			}
			return "update'"+zlyprecord.getTreeUuid();
		}
	}

	/**
	 * 点击上传附件是，删除以前的旧附件，可通用
	 * @param fileId  sgcc_attach_list相关的模块ID
	 * @param getFielId app_blob与APP_FILEINFO中的主键
     * @author yanglh
	 * @date 2013-6-21
	 */
	public void delAppFileinfoAndAppBlob(String fileId,String getFielId) {
        if(!fileId.equals("")){
        	String delAppFileinfo = "DELETE FROM AppFileinfo WHERE fileid='"+fileId+"'";
        	String delAppBlob = "DELETE FROM App_Blob WHERE fileid='"+fileId+"'";
        	String delSgccblob = "DELETE FROM SgccAttachBlob WHERE file_Lsh in ("+getFielId+")";
        	String delSgccList = "DELETE FROM SgccAttachList WHERE file_Lsh in ("+getFielId+")";
        	String delPcZlgkZlypRecord = "DELETE FROM PcZlgkZlypRecord WHERE uuid='"+fileId+"'";
        	this.zlgkDAO.executeHQL(delAppFileinfo);
        	this.zlgkDAO.executeHQL(delSgccblob);
        	this.zlgkDAO.executeHQL(delSgccList);
        	this.zlgkDAO.executeHQL(delPcZlgkZlypRecord);
        	JdbcUtil.execute(delAppBlob);
        }
	}

	/**
	 * 对上报数据进行新增
	 * @param obj
	 * @return
     * @author yanglh
	 * @date 2013-6-24
	 */
	public String addPcZlgkZlypReport(PcZlgkZlypReport obj) {
		if(obj != null){
			String whereSql = "select max(t.make_order) as makeOrder  from pc_zlgk_zlyp_report t where record_uuid ='"+obj.getRecordUuid()+"'";
			List list = JdbcUtil.query(whereSql);
			Map map = (Map) list.get(0);
			if(map.get("makeOrder") == null){
				obj.setMakeOrder("1");
			}else{
				obj.setMakeOrder(String.valueOf(Integer.valueOf(map.get("makeOrder").toString())+1));
			}
			this.zlgkDAO.insert(obj);
			return "success";
		}
		return "failse";
	}

	/**
	 * 质量验评附件移交
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrName
	 * @return
	 * @author yanglh 2013-6-25
	 */
	public String getJsonStrForTransToZlgkZlyp(String type, String fileId,
			String fileTypes, String yjrName, String uuid) {

		String fileIdSqlStr = StringUtil.transStrToIn(fileId, ",");
		List<SgccAttachList> list = this.zlgkDAO.findByWhere(SgccAttachList.class.getName(), "TRANSACTION_ID in (" + fileIdSqlStr
						+ ") and TRANSACTION_TYPE in ("
						+ StringUtil.transStrToIn(fileTypes, ",") + ") ");
		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		Map<String, String> zlTitleMap = new HashMap<String, String>();
		String inWhereStr = " uuid = '"+uuid+"'";
		List<PcZlgkZlypRecord> mainFile = null;
		if("zlMaterail".equals(type)){
			mainFile = this.zlgkDAO.findByWhere(PcZlgkZlypRecord.class.getName(), inWhereStr);
			for (PcZlgkZlypRecord zlypRecord : mainFile) {
				zlTitleMap.put(zlypRecord.getUuid(), zlypRecord.getFileName()+"质量验评文件");
			}
		}		
		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfoBlobList> zlList1 = this.zlgkDAO.findWhereOrderBy(
					ZlInfoBlobList.class.getName(), "filelsh = '" + sgccAttachList.getFileLsh() + "'", null);
			rtnStrBuf.append("{");

			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String fileTypeName = propertyDAO.getCodeNameByPropertyName(
					sgccAttachList.getTransactionType(), "文件类型");
			fileTypeName = fileTypeName == null ? type : fileTypeName;
			rtnStrBuf.append("fileType:'" + sgccAttachList.getTransactionType() + "',");
			rtnStrBuf.append("fileTypeName:'" + fileTypeName + "',");
			rtnStrBuf.append("fileId:'"	+ sgccAttachList.getId().getTransactionId() + "',");
			rtnStrBuf.append("mainFileName:'"  + mainFileNameMap.get(sgccAttachList.getId().getTransactionId()) + "',");
			rtnStrBuf.append("zlTitle:'"  + zlTitleMap.get(uuid) + "',");
			rtnStrBuf.append("fileLsh:'" + sgccAttachList.getFileLsh() + "',");
			rtnStrBuf.append("fileName:'" + sgccAttachList.getFileName() + "',");
			if (zlList1.size() == 1) {
				ZlInfo zlInfo = (ZlInfo) this.zlgkDAO.findById(ZlInfo.class.getName(), zlList1.get(0).getInfoid());
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.zlgkDAO.findByWhere(
						"com.sgepit.pmis.document.hbm.ZlTree", "indexId = '"
								+ zlInfo.getIndexid() + "'");
				ZlTree zlTree = zlTreeList.size() == 1 ? zlTreeList.get(0) : null;
				String yjStr = "";
				if (yjr != null) {
					if (yjr.equals(yjrName)) {
						yjStr = "已被 【我】 移交到 【" + zlTree.getMc() + "】 分类下";
					} else {
						yjStr = "已被 【" + yjr + "】 移交到 【" + zlTree.getMc() + "】 分类下";
					}
				} else {
					yjStr = "已移交到 【" + zlTree.getMc() + "】 分类下";
				}
				rtnStrBuf.append("isTrans:'1',");
				rtnStrBuf.append("transState:'" + zlInfo.getBillstate() + "',");
				rtnStrBuf.append("yjStr:'" + yjStr + "'");

			} else {
				rtnStrBuf.append("isTrans:'0',");
				rtnStrBuf.append("yjStr:'未移交'");
			}
			rtnStrBuf.append("},");
		}
		if (rtnStrBuf.lastIndexOf(",") == rtnStrBuf.length() - 1){
			rtnStrBuf.deleteCharAt(rtnStrBuf.length() - 1);
		}
		rtnStrBuf.append("]");
		return rtnStrBuf.toString();
	
	}

	/**
	 * 质量验评附件移交
	 * @param pid
	 * @param userdeptid
	 * @param username
	 * @param type
	 * @param fileLshs
	 * @param fileNames
	 * @param fileIds
	 * @param zlSortId
	 * @param flag
	 * @author yanglh 2013-6-25
	 */
	public boolean pcZlgkZlypTransToZLSByType(String pid, String userdeptid,
			String username, String type, String fileLshs, String fileNames,
			String fileIds, String zlSortId, boolean flag) {
		try{
			String tableName = "";
			if("zlMaterail".equals(type)){
				tableName = "EQU_GOODS_OPENBOX_SUB";
			}
			String zlType = PropertyCodeDAO.getInstence().getCodeValueByPropertyName("合同", "资料类型");
			if (zlType != null) {
				zlType = "2";
			}
			String[] fileLshArr = fileLshs.split(",");
			String tableAndId = tableName+"`" + fileIds;
			String ziInfoStr = "";
			if(flag){
					Long zlTypeNum = Long.valueOf(zlType);
					Date date = new Date();
					SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd"); 
					ZlInfo zlinfo = new ZlInfo();
					zlinfo.setBillstate(new Long(0));
					zlinfo.setIndexid(zlSortId);
					zlinfo.setPid(pid);
					zlinfo.setMaterialname(fileNames);
					zlinfo.setResponpeople(username);
					zlinfo.setYjr(username);
					zlinfo.setStockdate(sdf.parse(sdf.format(new Date())));
					zlinfo.setOrgid(userdeptid);
					// 资料类型、份数、责任人、单位；默认值分别为：资料，1，用户自己，页
					zlinfo.setWeavecompany(username);
					zlinfo.setBook(3L);
					zlinfo.setZltype(zlTypeNum);
					zlinfo.setPortion(1L);
					zlinfo.setQuantity(1L);
					zlinfo.setRkrq(new Date());
					zlinfo.setYjTableAndId(tableAndId);
					this.zlgkDAO.insert(zlinfo);
					ziInfoStr =  zlinfo.getInfoid();
	    	 }
				
				for (int i = 0; i < fileLshArr.length; i++) {
					String fileLsh = fileLshArr[i];
					List<SgccAttachList> list = this.zlgkDAO.findByWhere(SgccAttachList.class.getName(), "file_lsh = '" + fileLsh + "'");
	
					if (list.size() == 1) {
						//增加资料与大对象表的关联信息
					    if(ziInfoStr == null || ziInfoStr == ""){
					    	List<ZlInfo> getInfo = this.zlgkDAO.findByWhere(ZlInfo.class.getName(), "YJ_TABLEANDID='" + tableAndId + "' and materialname='"+fileNames+"'");
					    	ZlInfo zlInfo1 = getInfo.get(0);
					    	ziInfoStr = zlInfo1.getInfoid();
					    }
						ZlInfoBlobList blobList = new ZlInfoBlobList(ziInfoStr, "SGCC_ATTACH_BLOB", fileLsh);
						this.zlgkDAO.insert(blobList);
					}
					}
					return true;
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
	}

	/**
	 * 质量验评附件移交撤回
	 * @param filelsh
	 * @param fileIds
	 * @author yanglh 2012-12-05
	 */
	public boolean cancelPcZlgkTrans(String filelsh) {
		try {
			List<ZlInfoBlobList> blobLists = this.zlgkDAO.findByWhere(ZlInfoBlobList.class.getName(), "file_lsh='" + filelsh + "'");
			if (blobLists.size()>0) {
				ZlInfo zlInfo = (ZlInfo) this.zlgkDAO.findById(ZlInfo.class.getName(), blobLists.get(0).getInfoid());
				this.zlgkDAO.deleteAll(blobLists);
				
				if (zlInfo!=null) {
					List<ZlInfoBlobList> blobLists1 = this.zlgkDAO.findByWhere(ZlInfoBlobList.class.getName(), "infoid='" + zlInfo.getInfoid() + "'");
					if (blobLists1.size()==0) {
						this.zlgkDAO.delete(zlInfo);
					}
				}
			}
			return true;
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	/**
	 * 初始化根节点时或保存时设置权限
	 * @param uuid
	 * @param depId
	 * @param pid
	 * @return
	 */
	public String addPcZlgkRightSortDept(String uuid, String depId, String pid) {
      		//做根节点做所以权限控制，同时初始化权限控制关系表pc_zlgk_right_sort_dept
      		String whereSql = "select unitid from Sgcc_Ini_Unit start with unitid='"+pid+"' connect by prior  unitid=upunit";
      		List listRight = JdbcUtil.query(whereSql);
      		if(listRight.size()>0){
                  for(int i = 0; i <listRight.size(); i ++){
                	Map map = (Map) listRight.get(i);
                	String getDept = map.get("unitid").toString();
          			PcZlgkRightSortDept rightDept = new PcZlgkRightSortDept();
          			rightDept.setFileSortId(uuid);
          			rightDept.setDeptId(getDept);
          			rightDept.setRightLvl("None");
          			rightDept.setPid(pid);
          			this.zlgkDAO.insert(rightDept);
                  }
                  return "success";  
      		}else{
      			return "failre";  
      		}            	  
         
	}

	/**
	 * 从指定根节点开始获取节点权限树
	 * 
	 * @param nodeId
	 * @param rootId
	 * @return
	 */
	public List getComFileSortRightTree(String nodeId, String rootId,String fileStorId,
			Boolean excludeDept) {

		List<PcZlgkZlypSortRightBean> list = new ArrayList<PcZlgkZlypSortRightBean>();
		// 获取岗位的类型编号
		String posNum = PropertyCodeDAO.getInstence()
				.getCodeValueByPropertyName("岗位", "组织机构类型");
		if (posNum == null) {
			posNum = "9";
		} else if (posNum.equals("")) {
			posNum = "9";
		}
		DetachedCriteria criteria = DetachedCriteria
				.forClass(SgccIniUnit.class);
		String sql = "unit_type_id <> '" + posNum + "'";
/*		if (excludeDept) {
			sql += " and unit_type_id <> '8'";
		}*/
		String DEPLOY_UNITTYPE = Constant.propsMap.get("DEPLOY_UNITTYPE");
		if(DEPLOY_UNITTYPE.equals("0")){//集团过滤外部单位
			String outDept="7";//外部单位类型为7
			sql+="	and unit_type_id <> '" + outDept + "'";			
		}
		sql += " start with unitid = '%s' connect by prior unitid = upunit order siblings by view_order_num";
		sql = String.format(sql, rootId);
		criteria.add(Restrictions.sqlRestriction(sql));

		List<SgccIniUnit> unitList = zlgkDAO.getHibernateTemplate()
				.findByCriteria(criteria);

		for (int i = 0; i < unitList.size(); i++) {
			SgccIniUnit unit = unitList.get(i);
			PcZlgkZlypSortRightBean bean = new PcZlgkZlypSortRightBean();
			bean.setSortId(nodeId);
			bean.setUnitId(unit.getUnitid());
			bean.setUnitName(unit.getUnitname());
			bean.setUnitTypeId(unit.getUnitTypeId());
			bean.setParentUnitId(unit.getUpunit());
			if (unit.getLeaf() == 1) {
				bean.setLeaf(false);
			} else if (unit.getLeaf() == 0) {
				bean.setLeaf(true);
			}

			bean.setLeaf(isLeaf(unit.getUnitid(), posNum, excludeDept ? "prj"
					: "dept"));

			bean.setRead("false");
			bean.setWrite("false");
			List<PcZlgkRightSortDept> sortDeptList = this.zlgkDAO
					.findByWhere(PcZlgkRightSortDept.class.getName(),"file_sort_id='" + fileStorId + "' and dept_id = '"
							+ unit.getUnitid() + "'");
			if (sortDeptList.size() == 1
					&& sortDeptList.get(0).getRightLvl() != null) {
				String rightLvl = sortDeptList.get(0).getRightLvl();
				if (rightLvl.equals(FAPConstant.right_ReadOnly)) {
					bean.setRead("true");
					bean.setWrite("false");
				} else if (rightLvl.equals(FAPConstant.right_Write)) {
					bean.setRead("true");
					bean.setWrite("true");
				}
			}
			list.add(bean);
		}
		return list;
	}
	/**
	 * 判断是否为根节点（过滤掉岗位）
	 * 
	 * @param deptId
	 *            部门id
	 * @param posNo
	 *            岗位属性编码
	 * @return
	 */
	private boolean isLeaf(String deptId, String posNum, String type) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(SgccIniUnit.class);
		criteria.add(Restrictions.eq("upunit", deptId));
		criteria.add(Restrictions.ne("unitTypeId", posNum));
		if (type.equals("prj")) {
			criteria.add((Restrictions.ne("unitTypeId", "8")));
		}
		criteria.setProjection(Projections.rowCount());
		Integer result = (Integer) zlgkDAO.getHibernateTemplate()
				.findByCriteria(criteria, 0, 1).get(0);

		return result == 0;

	}

	/**
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAlone(String nodeId, String deptId,
			String rightType, String rightValue,String selectNode,String PID,String gerIsLeaf) {
		//查找以该节点为根节点的分类树
		List<Map> list = new ArrayList<Map>();
		String sql = "select unitid,unit_type_id from " +
				"(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"+deptId+"' connect by PRIOR unitid = upunit) " +
				"where unit_type_id <> '9'" ;
		list = JdbcUtil.query(sql);	
		String rightStr = "";
		if(rightType.equals(FAPConstant.right_ReadOnly) && rightValue.equals("false")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_None;
			}
			rightStr = rightStr.substring(1);
			
		}else if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("true")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_Write;
			}
			rightStr = rightStr.substring(1);
		}else{
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_ReadOnly;
			}
			rightStr = rightStr.substring(1);
		}
		
		List<Map> nodeList = this.getComFileSortTreeByParentId(nodeId, null,selectNode,PID,gerIsLeaf);	
		for(int i=0;i<nodeList.size();i++){
			this.setComFileSortNodeRight(nodeList.get(i).get("uids").toString(), rightStr);
		}
		return true;
		
	}

	/**
	 * 根据父节点查找以该父节点为根节点的所有节点，构成树结构
	 * @param parentId  父节点ID
	 * @param deptIds   访问分类树的部门，可以是多个部门，多个部门间用`进行分割
	 * @return Map List，map的key 与实体的属性对应
	 */
	public List<Map> getComFileSortTreeByParentId(String parentId,
			String deptIds,String selectNode,String PID,String gerIsLeaf) {
			List<Map> list = new ArrayList<Map>();
			String whereSql = "";
			if(gerIsLeaf.equals("1")){
				whereSql  = " parent_id = tree_id ";
			}else if(gerIsLeaf.equals("0")){
				whereSql  = " tree_id = parent_id ";
			}
			String sql = "select uuid as uids,  engineer_no  as sortBh, engineer_name  as sortName, parent_no as parentId, pid";
			if (deptIds != null) {
				sql += " and uuid in (select file_sort_id from pc_zlgk_right_sort_dept where right_lvl <> '"
						+ FAPConstant.right_None
						+ "'  and dept_id in "
						+ this.transStrForSqlIn(deptIds, FAPConstant.SPLITB)
						+ ")) as childNodeNum"
						+ " from pc_zlgk_zlyp_tree t "+  "where uuid in (select file_sort_id from pc_zlgk_right_sort_dept where right_lvl <> '"
						+ FAPConstant.right_None
						+ "'  and dept_id in "
						+ this.transStrForSqlIn(deptIds, FAPConstant.SPLITB) + ") start WITH tree_id = '"
						+ parentId
						+ "' and pid='"+PID+"' and tree_id<>'01' connect by PRIOR tree_id = parent_id and pid='"+PID+"' and tree_id<>'01' order siblings by tree_id)"
						;
			} else {
				sql += " from pc_zlgk_zlyp_tree t start WITH tree_id = (select tree_id from pc_zlgk_zlyp_tree where uuid='"+selectNode+"')" +
					   "   and pid='"+PID+"' and tree_id<>'01' connect by PRIOR "+whereSql+" and pid='"+PID+"' and tree_id<>'01' order siblings by tree_id";
			}
			list = JdbcUtil.query(sql);
			return list;
		}

	/**
	 * 设置节点权限
	 * @param nodeId  节点ID
	 * @param rightStr  格式示例：部门ID1`权限类型1|部门ID2`权限类型2|部门ID3`权限类型3|部门ID4`权限类型4
	 * @return
	 */
	public boolean setComFileSortNodeRight(String nodeId, String rightStr) {
		Map<String,String> rightMap = new HashMap<String,String>();
		String[] rightArr = rightStr.split("["+FAPConstant.SPLITA+"]");
		for(int i=0;i<rightArr.length;i++){
			String[] rightDetai = rightArr[i].split(FAPConstant.SPLITB);
			rightMap.put(rightDetai[0], rightDetai[1]);
		}
		
		return this.setComFileSortNodeRight(nodeId, rightMap);
	}
	/**
	 * 设置节点可访问的部门及权限
	 * 
	 * @param nodeId
	 * @param rightMap
	 * @return
	 */
	private boolean setComFileSortNodeRight(String nodeId,
			Map<String, String> rightMap) {
		try {
			Iterator it = rightMap.entrySet().iterator();
			while (it.hasNext()) {
				Entry entry = (Entry) it.next();
				String deptId = entry.getKey().toString();
				String rightLvl = entry.getValue() == null ? FAPConstant.right_ReadOnly
						: entry.getValue().toString();
				List<PcZlgkRightSortDept> list = this.zlgkDAO
						.findByWhere(PcZlgkRightSortDept.class.getName(),"file_sort_id = '" + nodeId
								+ "' and dept_id = '" + deptId + "'");
				if (list.size() == 1) {
					PcZlgkRightSortDept hbm = list.get(0);
					hbm.setRightLvl(rightLvl);
					this.zlgkDAO.saveOrUpdate(hbm);
				} else {
					PcZlgkRightSortDept hbm = new PcZlgkRightSortDept();
					hbm.setDeptId(deptId);
					hbm.setFileSortId(nodeId);
					hbm.setRightLvl(rightLvl);
					this.zlgkDAO.insert(hbm);
				}
			}
			return true;
		} catch (Exception e) {
			log.error("设置节点部门权限失败，具体原因：" + e.getMessage());
			return false;
		}
	}

	/**
	 * 将字符串转换成sql语句中in所需要的字符串
	 * 
	 * @param oriStr
	 *            原始串
	 * @param spStr
	 *            分隔符
	 * @return 返回需要的串
	 */
	private String transStrForSqlIn(String oriStr, String spStr) {
		String rtnStr = "(";
		String[] oriStrArr = oriStr.split(spStr);
		for (int i = 0; i < oriStrArr.length; i++) {
			rtnStr += "'" + oriStrArr[i] + "',";
		}
		return rtnStr.substring(0, rtnStr.length() - 1) + ")";
	}

	/**@param权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
	 * @param nodeId  节点ID
	 * @param deptId  部门ID
	 * @param rightType 权限类型 FAPConstant 中指定的类型
	 * @param rightValue 权限值
	 * @return
	 */
	public boolean setComFileSortNodeRightAll(String nodeId, String deptId,
			String rightType, String rightValue,String selectNode,String PID,String gerIsLeaf) {
		//查找以该节点为根节点的分类树
		List<Map> list = new ArrayList<Map>();
		String sql = "select unitid,unit_type_id from " +
				"(select unitid,unit_type_id from sgcc_ini_unit  start WITH unitid = '"+deptId+"' connect by PRIOR unitid = upunit) " +
				"where unit_type_id <> '9'" ;
		list = JdbcUtil.query(sql);	
		String rightStr = "";
		if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("false")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_None;
			}
			rightStr = rightStr.substring(1);
			
		}else if(rightType.equals(FAPConstant.right_Write) && rightValue.equals("true")){
			for(int i=0;i<list.size();i++){
				Map map = list.get(i);
				rightStr += FAPConstant.SPLITA + map.get("unitid").toString() + FAPConstant.SPLITB +FAPConstant.right_Write;
			}
			rightStr = rightStr.substring(1);
		}
		
		List<Map> nodeList = this.getComFileSortTreeByParentId(nodeId, null,selectNode,PID,gerIsLeaf);	
		for(int i=0;i<nodeList.size();i++){
			this.setComFileSortNodeRight(nodeList.get(i).get("uids").toString(), rightStr);
		}
		return true;
		
	}

	/**
	 * 质量验评统计
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> pcZlgkZlypStatisticsTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<PcZlgkZlypStatisticsTree> list1 = new ArrayList();
	    //页面定义处的参数
		String  parent=(String)map.get("parent");
		//页面定义处的参数
		String pid=(String)map.get("pid");
		//过滤条件查询
		String whereS = "  and pid='"+pid+"'";
		String startTime = (String)map.get("getStartTime");
		String endTime = (String)map.get("getEndTime");
		String unitSTr = (String)map.get("unitComValue");
		String billstateStr = (String)map.get("billstateComValue");
		if((startTime != null) && (endTime != null)){
			whereS += " and check_date between to_date('"+startTime+"', 'yyyymmdd') and  to_date('"+endTime+"', 'yyyymmdd')";
		}
		if(unitSTr != null){
			whereS += " and unit='"+unitSTr+"'";
		}
		if(billstateStr != null){
			whereS += " and billstategl='"+billstateStr+"'";
		}
		//拼装一般查询语句
        List<PcZlgkZlypTree> listTreeS =  this.zlgkDAO.findByWhere(PcZlgkZlypTree.class.getName(), " parent_id='"+parent+"' and pid='"+pid+"'","tree_id");
            	for(int k=0;k<listTreeS.size();k++){
            		PcZlgkZlypStatisticsTree  statisticsTree  = new PcZlgkZlypStatisticsTree(); 
            		PcZlgkZlypTree trees = listTreeS.get(k);
                	statisticsTree.setUuid(trees.getUuid());
                	statisticsTree.setEngineerName(trees.getEngineerName());
                	statisticsTree.setEngineerNo(trees.getEngineerNo());
                	statisticsTree.setParentNo(trees.getParentNo());
                	statisticsTree.setEngineerType(trees.getEngineerType());
                	statisticsTree.setIsleaf(trees.getIsleaf());
                	statisticsTree.setParentId(trees.getParentId());
                	statisticsTree.setTreeId(trees.getTreeId());
                	statisticsTree.setPid(trees.getPid());
                	for(int i=1;i<11;i++){
                		String types = "";
                		if(i<10){
                			types = "0"+String.valueOf(i);
                		}else{
                			types = String.valueOf(i);
                		}
                		String whereSql = "select count(*) as numbers from pc_zlgk_zlyp_record where tree_uuid in " +
                				" (select uuid from pc_zlgk_zlyp_tree r where tree_id like '"+trees.getTreeId()+"%'  and r.engineer_type='"+types+"') "+whereS;
            			List list = JdbcUtil.query(whereSql);
            			Map map1 = (Map) list.get(0);
            			if(i ==1){
            				statisticsTree.setTypeXm(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i == 2){
            				statisticsTree.setTypeZy(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==3){
            				statisticsTree.setTypeXt(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i == 4){
            				statisticsTree.setTypeDw(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==5){
            				statisticsTree.setTypeZdw(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==6){
            				statisticsTree.setTypeFb(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==7){
            				statisticsTree.setTypeZfb(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==8){
            				statisticsTree.setTypeFx(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==9){
            				statisticsTree.setTypeJy(Long.valueOf(map1.get("numbers").toString()));
            			}else if(i==10){
            				statisticsTree.setTypeJb(Long.valueOf(map1.get("numbers").toString()));
            			}
                	}
                	list1.add(statisticsTree);
            	}
				List newList = DynamicDataUtil.changeisLeaf(list1, "isleaf");
				return newList;			
	}

	public InputStream getExcelTemplate(String businessType) {
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}

    /**
     * 数据的导出通过拼接方式导出数据
     * @param pid
     * @param startTime
     * @param endTime
     * @param unitSTr
     * @param billstateStr
     * @author yanglh 2013-07-18
     */
	public HSSFWorkbook exportExcelByQuerySql(String pid, String startTime,
			String endTime, String unitSTr, String billstateStr) {
		String whereS = "";
		if((startTime != "") && (endTime != "")){
			whereS += " and check_date between to_date('"+startTime+"', 'yyyymmdd') and  to_date('"+endTime+"', 'yyyymmdd')";
		}
		if(unitSTr != ""){
			whereS += " and unit='"+unitSTr+"'";
		}
		if(billstateStr != ""){
			whereS += " and billstategl='"+billstateStr+"'";
		}
		List<PcZlgkZlypTree> listTreeS =  this.zlgkDAO.findByWhere(PcZlgkZlypTree.class.getName(), " parent_id like '0%' and pid='"+pid+"'","tree_id");
    	// 第一步，创建一个webbook，对应一个Excel文件
		HSSFWorkbook wb = new HSSFWorkbook();
		// 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
		HSSFSheet sheet = wb.createSheet("质量验评统计表");
		// 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
		HSSFRow row0 = sheet.createRow((int) 0);
		// 第四步，创建单元格，并设置值表头 设置表头居中
		HSSFCellStyle style0 = wb.createCellStyle();
		style0.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中     
		style0.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平居中    

		style0.setFillForegroundColor((short) 13);// 背景颜色
		style0.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
		style0.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
		style0.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
		style0.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
		HSSFFont font0 = wb.createFont();//设置字体

		HSSFFont font1 = wb.createFont();
		font1.setFontName("仿宋_GB2312");
		font1.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);//粗体显示
		font1.setFontHeightInPoints((short) 18);
		style0.setFont(font1);//选择需要用到的字体格式
		
		HSSFCell cell = row0.createCell((short) 0);//第二行表头
        sheet.addMergedRegion(new Region(0, (short) (0), 0,    
                (short) (10)));
        cell.setCellValue("质量验评统计表");
        cell.setCellStyle(style0);
        row0.setHeight((short) 800);
        //标题设置完成
        
        //标题设置开始
		HSSFCellStyle style = wb.createCellStyle();
		style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 垂直居中     
		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 水平居中    
		style.setFillForegroundColor((short) 13);// 背景颜色
		style.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
		style.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
		style.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
		style.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
		HSSFFont font = wb.createFont();//设置字体
		font.setFontName("黑体");
		font.setFontHeightInPoints((short) 10);//设置字体大小
		style.setFont(font);//选择需要用到的字体格式
		style.setWrapText(true);//设置自动换行
		
        HSSFRow row = sheet.createRow((int) 1);
        row.setHeight((short) 500);
		cell = row.createCell((short) 0);
		cell.setCellValue("工程编号");
		sheet.setColumnWidth(0, 5000);
		cell.setCellStyle(style);
		cell = row.createCell((short) 1);
		cell.setCellValue("工程名称");
		sheet.setColumnWidth(1, 7200);
		cell.setCellStyle(style);
		cell = row.createCell((short) 2);
		cell.setCellValue("工程类别");
		sheet.setColumnWidth(2, 6000);
		cell.setCellStyle(style);
		cell = row.createCell((short) 3);
		cell.setCellValue("系统验收数");
		sheet.setColumnWidth(3, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 4);
		cell.setCellValue("单位工程验收数");
		sheet.setColumnWidth(4, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 5);
		cell.setCellValue("子单位工程验收数");
		sheet.setColumnWidth(5, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 6);
		cell.setCellValue("分部工程验收数");
		sheet.setColumnWidth(6, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 7);
		cell.setCellValue("子分部工程验收数");
		sheet.setColumnWidth(7, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 8);
		cell.setCellValue("分项工程验收数");
		sheet.setColumnWidth(8, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 9);
		cell.setCellValue("检验批数");
		sheet.setColumnWidth(9, 2800);
		cell.setCellStyle(style);
		cell = row.createCell((short) 10);
		cell.setCellValue("隐蔽验收数");
		sheet.setColumnWidth(10, 2800);
		cell.setCellStyle(style);
    	for(int k=0;k<listTreeS.size();k++){
    		row = sheet.createRow((int) k + 2);
    		PcZlgkZlypTree trees = listTreeS.get(k);
			row.createCell((short) 0).setCellValue(trees.getEngineerNo());
			row.createCell((short) 1).setCellValue(trees.getEngineerName());
        	for(int i=1;i<11;i++){
        		String types = "";
        		if(i<10){
        			types = "0"+String.valueOf(i);
        		}else{
        			types = String.valueOf(i);
        		}
        		String whereSql = "select count(*) as numbers from pc_zlgk_zlyp_record where tree_uuid in " +
        				" (select uuid from pc_zlgk_zlyp_tree r where tree_id like '"+trees.getTreeId()+"%'  and r.engineer_type='"+types+"') "+whereS;
    			List list = JdbcUtil.query(whereSql);
    			Map map1 = (Map) list.get(0);
    			if(trees.getEngineerType().equals("01")){
    				row.createCell((short) 2).setCellValue("项目");
    			}
    			else if(trees.getEngineerType().equals("02")){
    				row.createCell((short) 2).setCellValue("专业");
    			}else if(trees.getEngineerType().equals("03")){
    				row.createCell((short) 2).setCellValue("系统");
    			}else if(trees.getEngineerType().equals("04")){
    				row.createCell((short) 2).setCellValue("单位工程");
    			}else if(trees.getEngineerType().equals("05")){
    				row.createCell((short) 2).setCellValue("子单位工程");
    			}else if(trees.getEngineerType().equals("06")){
    				row.createCell((short) 2).setCellValue("分部工程");
    			}else if(trees.getEngineerType().equals("07")){
    				row.createCell((short) 2).setCellValue("子分部工程");
    			}else if(trees.getEngineerType().equals("08")){
    				row.createCell((short) 2).setCellValue("分项工程");
    			}else if(trees.getEngineerType().equals("09")){
    				row.createCell((short) 2).setCellValue("检验批");
    			}else if(trees.getEngineerType().equals("10")){
    				row.createCell((short) 2).setCellValue("隐蔽验收");
    			}
//    			if(i ==1){
//    				row.createCell((short) 4).setCellValue(Long.valueOf(map1.get("numbers").toString()));
//    			}else if(i == 2){
//    				row.createCell((short) 5).setCellValue(Long.valueOf(map1.get("numbers").toString()));
//    			}else
    			if(i==3){
    				row.createCell((short) 3).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i == 4){
    				row.createCell((short) 4).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==5){
    				row.createCell((short) 5).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==6){
    				row.createCell((short) 6).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==7){
    				row.createCell((short) 7).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==8){
    				row.createCell((short) 8).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==9){
    				row.createCell((short) 9).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}else if(i==10){
    				row.createCell((short) 10).setCellValue(Long.valueOf(map1.get("numbers").toString()));
    			}
        	}
    	}
    	// 第六步，将文件存到指定位置
//		{
//			FileOutputStream fout = new FileOutputStream("C:/Users/Administrator/Desktop/质量验评统计表.xls");
//			wb.write(fout);
//			fout.close();
//		}
//		catch (Exception e)
//		{
//			e.printStackTrace();
//		}
       return wb;
	}
}