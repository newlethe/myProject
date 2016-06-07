package com.sgepit.pcmis.dynamicview.service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.SQLQuery;
import org.hibernate.Session;

import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.dynamicview.hbm.PcAuditModuleScore;
import com.sgepit.pcmis.dynamicview.hbm.PcAuditWeightDistribute;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicIndex;
import com.sgepit.pcmis.dynamicview.hbm.PcStatements;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgmoneyapp;
import com.sgepit.pmis.common.BusinessConstants;

public class PcDynamicDataServiceImpl implements PcDynamicDataService {
	private BaseDAO  baseDAO;
	public BaseDAO getBaseDAO() {
		return baseDAO;
	}
	public void setBaseDAO(BaseDAO baseDAO) {
		this.baseDAO = baseDAO;
	}
	
	/* (non-Javadoc)
	 * @see com.sgepit.pcmis.dynamicview.service.PcDynamicDataService#getDynamicDataByTimeAndPid(java.lang.String, java.lang.Integer, java.lang.Integer, java.util.HashMap)
	 */
	@SuppressWarnings("unchecked")
	public List getDynamicDataByTimeAndPid(String orderBy,Integer start,Integer limit,HashMap map) {
		List<PcDynamicIndex> list = new ArrayList<PcDynamicIndex>();
		
		String sjTypeOfModeuleScore =(String)map.get("date");  //模块评分表的评分时间字段值
      	String unitid = (String)map.get("unitid");
      	StringBuffer unitSql= new StringBuffer("select * from ( select siu.unitid, siu.unitname,siu.unit_type_id ")
      						.append(" from sgcc_ini_unit siu")
      						.append(" start with siu.unitid = '"+unitid+"' ")
      						.append(" connect by prior siu.unitid = siu.upunit ) temp where temp.unit_type_id='A' ");
      	//获得该公司下所负责的所有项目单位或者只是取该项目单位
      	List sgccunitList = baseDAO.getDataAutoCloseSes(unitSql.toString());
      	
      	//获得最接近选择月份的模块权重值
      	String sql = "select sj_type from " +
      			"(select sj_type from pc_audit_weight_distribute where sj_type<='" + sjTypeOfModeuleScore +
      			"' order by sj_type desc) where rownum=1";
      	String sjTypeOfWeightValue = (String)this.baseDAO.getDataAutoCloseSes(sql).get(0); //模块权重值的创建日期
      	
		for(int i=0;i<sgccunitList.size();i++){
			Object[] objs =(Object[])sgccunitList.get(i);
			PcDynamicIndex  pdi = new PcDynamicIndex();
			String currentPid=(String)objs[0];
			String currentProName = (String)objs[1];
			pdi.setPid(currentPid);
			pdi.setProjectName(currentProName);
			
			//计算更新的基本信息
			String projectInfo=calculatePrjBaseInfo(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setProjectInfo(projectInfo);
			configureAuditsOfPcDynamicIndex("basic", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			//获得基本信息模块权重和审核评分
			
			//批文数据
//			String approvlInfo=calculateapprovlInfoInfo(currentPid,time);
//			pdi.setApprovalData(approvlInfo);
			
			//招投标
			String bidData=calculateBidInfo(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setBidData(bidData);
			configureAuditsOfPcDynamicIndex("bid", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			//合同数据
			String conInfo=calculateConOveInfo(currentPid, currentProName, sjTypeOfModeuleScore, i);
			pdi.setConoveData(conInfo);
			configureAuditsOfPcDynamicIndex("con", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			//概算数据
			String bdgInfo = calculateBdgInfo(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setBdgData(bdgInfo);
			configureAuditsOfPcDynamicIndex("bdg", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			//综合报表
			String statementsData = calculateStatmentsInfo(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setStatementsData(statementsData);
			configureAuditsOfPcDynamicIndex("statement", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			//安全管控
//			String securityInfo=calculateSecurityInfo(currentPid, currentProName, time);
//			pdi.setSecurityData(securityInfo);
//			configureAuditsOfPcDynamicIndex("security", sjType, currentPid, pdi);
			//质量管控
			String qualityInfo=calculateQualityInfo(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setQualityData(qualityInfo);
			configureAuditsOfPcDynamicIndex("quality", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
//			投资管理--新需求去掉该模块
//			String investInfo=calculateInvestInfo(currentPid,time);
//			pdi.setInvestData(investInfo);
			//进度管控
			String sche =calculateSchedule(currentPid, currentProName, sjTypeOfModeuleScore);
			pdi.setScheduleData(sche);
			configureAuditsOfPcDynamicIndex("schedule", sjTypeOfModeuleScore, sjTypeOfWeightValue, currentPid, pdi);
			list.add(pdi);
		}
      	return list;
	}
	
	public String checkLoginUserUnit(String unitid) {
		SgccIniUnit sgccIniUnit=(SgccIniUnit) baseDAO.findBeanByProperty(SgccIniUnit.class.getName(), "unitid",unitid);
	     if(sgccIniUnit!=null){
	    	 String unitTypeId=sgccIniUnit.getUnitTypeId();
	    	 if("0".equals(unitTypeId)||"1".equals(unitTypeId)||"2".equals(unitTypeId)||"3".equals(unitTypeId)){
	    		 //表示可以通过项目单位来进行查询
	    		 return "1";
	    	 }
	     }
	     //表示不能通过项目单位来进行查询
	return "0";
	}
	//计算合同信息展示
	@SuppressWarnings("all")
	public String calculateConOveInfo(String pid,String proName,String time, int m){
		//合同数据
	String conOveInfo="";
	StringBuffer winName = new StringBuffer();
	String conOveSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='V_CON' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";
	List conOveList=baseDAO.getDataAutoCloseSes(conOveSql);
	 if(conOveList.size()>0){
		 String conids="";
		 for(int i=0;i<conOveList.size();i++){
			 String uid=(String)conOveList.get(i);
			 conids+=uid;
			 if(i<conOveList.size()-1){
				 conids+=",";
			 }
		 }
		 winName.append(proName + "--更新信息查询--合同基本信息");
		 conOveInfo += "<li><a  href=\"javascript:void(0)\"  onclick=\"javascript:openDialog('"+
		 	DynamicDataUtil.CON_OVE_URL+"?optype=con&pid="+pid+"&proName="+proName+
		 	"&conids="+conids+"&dyView=true','"+winName.toString()+"');\">新增了"+conOveList.size()+"条合同信息</a></li>"; 
	 }
	 //合同付款信息
	 String con_paySql="select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_PAY' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";
	 List conPayList =baseDAO.getDataAutoCloseSes(con_paySql);
	 if(conPayList.size()>0){
		 String conpay="select distinct cp.conid from CON_PAY cp where cp.payid in ( select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_PAY' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"')";
		 List cpList = baseDAO.getDataAutoCloseSes(conpay);
		 String conids="";
		 for(int i=0;i<cpList.size();i++){
			 String uid =(String)cpList.get(i);
			 conids+=uid;
			 if(i<cpList.size()-1){
				 conids+=",";
			 }
		 }
		 String uids="";
		 for(int i=0;i<conPayList.size();i++){
			 String uid =(String)conPayList.get(i);
			 uids+=uid;
			 if(i<conPayList.size()-1){
				 uids+=",";
			 }
		 }
		 winName.replace(0, winName.length(), proName + "--更新信息查询--合同付款信息");
		 conOveInfo += "<li><a href=\"javascript:void(0)\"  onclick=\"openDialog('"+
		 	DynamicDataUtil.CON_PAY_URL+"?optype=conpay&pid="+pid+"&proName="+proName+
		 	"&uids="+uids+"&conids="+conids+"&dyView=true','"+winName.toString()+"')\">新增了"+conPayList.size()+"条合同付款信息</a></li>"; 	 
	 }
	 //合同变更
	 String con_chaSql="select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_CHA' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";;
	 List conChaList =baseDAO.getDataAutoCloseSes(con_chaSql);
	 if(conChaList.size()>0){
		 String conids ="";
		 String concha="select distinct cc.conid from con_cha cc where cc.chaid in (select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_CHA' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"')";
		 List conchaList = baseDAO.getDataAutoCloseSes(concha);
		 
		 for(int i=0;i<conchaList.size();i++){
			 String uid =(String) conchaList.get(i);
			  conids+=uid;
			 if(i<conchaList.size()-1){
				 conids+=",";
			 }
		 }
		 String uids="";
		 for(int i=0;i<conChaList.size();i++){
			 String uid =(String)conChaList.get(i);
			 uids+=uid;
			 if(i<conChaList.size()-1){
				 uids+=",";
			 }
		 }
		 winName.replace(0, winName.length(), proName + "--更新信息查询--合同变更信息");
		 conOveInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
		 	DynamicDataUtil.CON_CHANGE_URL+"?optype=concha&pid="+pid+"&proName="+proName+
		 	"&uids="+uids+"&conids="+conids+"&dyView=true','"+winName.toString()+"')\">新增了"+conChaList.size()+"条合同变更信息</a></li>"; 	 
	 }
	 //合同违约
	 String con_BreSql="select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_BRE' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";;
	 List conBreList =baseDAO.getDataAutoCloseSes(con_BreSql);
	 if(conBreList.size()>0){
		 String conbre = "select distinct cb.conid from con_bre cb where cb.breid in (select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_BRE' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"')";
		 List conbreList = baseDAO.getDataAutoCloseSes(conbre);
		 String conids="";
		 for(int i=0;i<conbreList.size();i++){
			 String uid=(String)conbreList.get(i);
			 conids+=uid;
			 if(i<conbreList.size()-1){
				 conids+=",";
			 }
		 }
		 String uids="";
		 for(int i=0;i<conBreList.size();i++){
			 String uid =(String)conBreList.get(i);
			 uids+=uid;
			 if(i<conBreList.size()-1){
				 uids+=",";
			 }
		 }
		 winName.replace(0, winName.length(), proName + "--更新信息查询--合同违约信息");
		 conOveInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
		 	DynamicDataUtil.CON_BRE_URL+"?optype=conbre&pid="+pid+"&proName="+proName+
		 	"&uids="+uids+"&conids="+conids+"&dyView=true','"+winName.toString()+"')\">新增了"+conBreList.size()+"条合同违约信息</a></li>"; 	 
	 }
	 //合同索赔
	 String con_ClaSql="select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_CLA' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";;
	 List conClaList =baseDAO.getDataAutoCloseSes(con_ClaSql);
	 if(conClaList.size()>0){
		 String conids ="";
		 String concla="select distinct cc.conid from  CON_CLA  cc where cc.claid in ("+con_ClaSql+")";
		 List conclaList = baseDAO.getDataAutoCloseSes(concla);
		 for(int i=0;i<conclaList.size();i++){
			 String uid =(String)conclaList.get(i);
			 conids+=uid;
			 if(i<conclaList.size()-1){
				 conids+=",";
			 }
		 }
		 String uids="";
		 for(int i=0;i<conClaList.size();i++){
			 String uid =(String)conClaList.get(i);
			 uids+=uid;
			 if(i<conClaList.size()-1){
				 uids+=",";
			 }
		 }
		 winName.replace(0, winName.length(), proName + "--更新信息查询--合同索赔信息");
		 conOveInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
		 	DynamicDataUtil.CON_CLA_URL+"?optype=concla&pid="+pid+"&proName="+proName+
		 	"&uids="+uids+"&conids="+conids+"&dyView=true','"+winName.toString()+"')\">新增了"+conClaList.size()+"条合同索赔信息</a></li>"; 	 
	 }
	 //合同结算
	 String con_BalSql="select distinct pdd.pc_table_uids from  pc_dynamic_data pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='CON_BAL' and pdd.pc_table_op_type='add' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";;
	 List conBalList =baseDAO.getDataAutoCloseSes(con_BalSql);
	 if(conBalList.size()>0){
		 String conids ="";
		 String conbal="select distinct cb.conid from con_bal cb where cb.balid in ("+con_BalSql+")";
		 List conbalList = baseDAO.getDataAutoCloseSes(conbal);
		 for(int i=0;i<conbalList.size();i++){
			 String uid =(String)conbalList.get(i);
			 conids+=uid;
			 if(i<conbalList.size()-1){
				 conids+=",";
			 }
		 }
		 String uids="";
		 for(int i=0;i<conBalList.size();i++){
			 String uid =(String)conBalList.get(i);
			 uids+=uid;
			 if(i<conBalList.size()-1){
				 uids+=",";
			 }
		 }
		 winName.replace(0, winName.length(), proName + "--更新信息查询--合同结算信息");
		 conOveInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
		 	DynamicDataUtil.CON_BAL_URL+"?optype=conbal&pid="+pid+"&proName="+proName+
		 	"&uids="+uids+"&conids="+conids+"','"+winName.toString()+"')\">新增了"+conBalList.size()+"条合同结算信息</a></li>"; 	 
	 }
	 if("".equals(conOveInfo)){
		 return "无更新";
	 }else {
		 return conOveInfo;
	 }
	}
	@SuppressWarnings("unchecked")
	public String calculateBdgInfo(String pid, String proName, String time){
		String bdgInfo="";
		StringBuffer winName = new StringBuffer();
		//概算结构
		String bdgInfoSql="select distinct pdd.pc_table_uids   from pc_dynamic_data  pdd where  pdd.pc_table_name='BDG_INFO'  and pdd.pid='"+pid+"' and pdd.pc_table_op_type='update' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'";
	   List bdgInfoList = baseDAO.getDataAutoCloseSes(bdgInfoSql);
		if(bdgInfoList.size()>0){
			winName.append(proName + "--更新信息查询--概算信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_INFO_URL+"?pid="+pid+"&proname="+proName+"&time="+time+"','"+winName.toString()+"')\">更新了概算结构</a></li>"; 	 
		}
		//合同分摊
		StringBuilder  sBuilder = new StringBuilder("select distinct app.conid from bdg_money_app app ");
		sBuilder.append("   where app.pid = '"+pid+"'  and app.appid in ");
		sBuilder.append(" (select distinct pdd.pc_table_uids   from pc_dynamic_data pdd ");
		sBuilder.append(" where pdd.pc_table_name = 'BDG_MONEY_APP'  and pdd.pid = '"+pid+"'");
		sBuilder.append("  and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"') ");
		 List conMoneyAppList = baseDAO.getDataAutoCloseSes(sBuilder.toString());
		 if(conMoneyAppList.size()>0){
			 String uids ="";
			 for(int i=0;i<conMoneyAppList.size();i++){
				 String uid=(String)conMoneyAppList.get(i);
				 uids+=uid;
				 if(i<conMoneyAppList.size()-1){
					 uids+=",";
				 } 
			 }
			 winName.replace(0, winName.length(), proName + "--更新信息查询--合同分摊数据");
			 bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
			 	DynamicDataUtil.BDG_MONEYAPP_URL+"?pid="+pid+"&proName="+proName+
			 	"&conids="+uids+"&optype=MONEYAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+conMoneyAppList.size()+"条合同分摊信息</a></li>"; 	 
		 }
		 
		 //变更分摊
		 StringBuilder chaBuilder = new StringBuilder(" select distinct app.cano ");
		 chaBuilder.append("   from bdg_chang_app app ");
		 chaBuilder.append("  where app.caid in ");
		 chaBuilder.append("  (select distinct pdd.pc_table_uids ");
		 chaBuilder.append("   from pc_dynamic_data pdd ");
		 chaBuilder.append(" where pdd.pc_table_name = 'BDG_CHANG_APP' ");
		 chaBuilder.append(" and pdd.pid = '"+pid+"' ");
		 chaBuilder.append("  and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')");
		List chaList = baseDAO.getDataAutoCloseSes(chaBuilder.toString());
		if(chaList.size()>0){
			StringBuilder concha = new StringBuilder(" select distinct app.conid ");
			concha.append("   from bdg_chang_app app ");
			concha.append("  where app.caid in ");
			concha.append("  (select distinct pdd.pc_table_uids ");
			concha.append("   from pc_dynamic_data pdd ");
			concha.append(" where pdd.pc_table_name = 'BDG_CHANG_APP' ");
			concha.append(" and pdd.pid = '"+pid+"' ");
			concha.append("  and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')");
			List conchaList = baseDAO.getDataAutoCloseSes(concha.toString());
			String conids="";
			for(int i=0;i<conchaList.size();i++){
				String uid=(String)conchaList.get(i);
				conids+=uid;
				if(i<conchaList.size()-1){
					conids+=",";
				}
			}
			String uids ="";
			for(int i=0;i<chaList.size();i++){
				String uid =(String)chaList.get(i);
				uids+=uid;
				if(i<chaList.size()-1){
					uids+=",";
				}
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同变更信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_CHANGEAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&uids="+uids+"&optype=CHANGEAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+chaList.size()+"条合同变更信息</a></li>"; 	 
		} 
		
		//索赔
		StringBuilder  claBuilder = new StringBuilder(" select distinct app.claid ");
		claBuilder.append("   from BDG_CLA_APP app ");
		claBuilder.append("  where app.claappid in ");
		claBuilder.append("  (select distinct pdd.pc_table_uids ");
		claBuilder.append(" from pc_dynamic_data pdd ");
		claBuilder.append("  where pdd.pid = '"+pid+"' ");
		claBuilder.append(" and pdd.pc_table_name = 'BDG_CLA_APP' ");
		claBuilder.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')");
		List claList = baseDAO.getDataAutoCloseSes(claBuilder.toString());
		if(claList.size()>0){
			StringBuilder  concla = new StringBuilder(" select distinct app.conid ");
			concla.append("   from BDG_CLA_APP app ");
			concla.append("  where app.claappid in ");
			concla.append("  (select distinct pdd.pc_table_uids ");
			concla.append(" from pc_dynamic_data pdd ");
			concla.append("  where pdd.pid = '"+pid+"' ");
			concla.append(" and pdd.pc_table_name = 'BDG_CLA_APP' ");
			concla.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')");
			List conclaList =baseDAO.getDataAutoCloseSes(concla.toString());
			String conids="";
			for(int i=0;i<conclaList.size();i++){
				String uid=(String)conclaList.get(i);
				conids+=uid;
				if(i<conclaList.size()-1){
					conids+=",";
				}
			}
			String uids="";
			for(int i=0;i<claList.size();i++){
				String uid =(String)claList.get(i);
				uids+=uid;
				if(i<claList.size()-1){
					uids+=",";
				}
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同索赔信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_CLAAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&uids="+uids+"&optype=CLAAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+claList.size()+"条合同索赔信息</a></li>"; 	 
		}
		//违约
		StringBuilder  breBuilder = new StringBuilder(" select distinct app.breappno ");
		breBuilder.append("   from bdg_breach_app app ");
		breBuilder.append("  where app.breappid in (select distinct pdd.pc_table_uids ");
		breBuilder.append("  from pc_dynamic_data pdd ");
		breBuilder.append("  where pdd.pc_table_name = 'BDG_BREACH_APP' " );
		breBuilder.append("  and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
		breBuilder.append(" and pdd.pid = '"+pid+"')");
		List breList = baseDAO.getDataAutoCloseSes(breBuilder.toString());
		if(breList.size()>0){
			StringBuilder  conbre = new StringBuilder(" select distinct app.conid ");
			conbre.append("   from bdg_breach_app app ");
			conbre.append("  where app.breappid in (select distinct pdd.pc_table_uids ");
			conbre.append("  from pc_dynamic_data pdd ");
			conbre.append("  where pdd.pc_table_name = 'BDG_BREACH_APP' " );
			conbre.append("  and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
			conbre.append(" and pdd.pid = '"+pid+"')");
			List conbreList = baseDAO.getDataAutoCloseSes(conbre.toString());
			String conids="";
				for(int i=0;i<conbreList.size();i++){
					String uid =(String)conbreList.get(i);
					conids+=uid;
					if(i<conbreList.size()-1){
						conids+=",";
					}
				}
			String uids ="";
			for(int i=0;i<breList.size();i++){
				String uid =(String)breList.get(i);
				uids+=uid;
				if(i<breList.size()-1){
					uids+=",";
				}
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同违约信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_BREAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&uids="+uids+"&optype=BREAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+breList.size()+"条合同违约信息</a></li>"; 	 	
		}
		//付款
		StringBuffer  payBuffer = new StringBuffer(" select distinct app.payappno ");
		payBuffer.append(" from BDG_PAY_APP app ");
		payBuffer.append(" where app.payappid in ");
		payBuffer.append("  (select distinct t.pc_table_uids ");
		payBuffer.append(" from pc_dynamic_data t ");
		payBuffer.append("  where pid = '"+pid+"' ");
		payBuffer.append(" and t.pc_table_name = 'BDG_PAY_APP'");
		payBuffer.append(" and to_char(t.pc_dynamic_date,'yyyyMM')='"+time+"')");
		List payList = baseDAO.getDataAutoCloseSes(payBuffer.toString());
		if(payList.size()>0){
			StringBuffer  conpay = new StringBuffer(" select distinct app.conid ");
			conpay.append(" from BDG_PAY_APP app ");
			conpay.append(" where app.payappid in ");
			conpay.append("  (select distinct t.pc_table_uids ");
			conpay.append(" from pc_dynamic_data t ");
			conpay.append("  where pid = '"+pid+"' ");
			conpay.append(" and t.pc_table_name = 'BDG_PAY_APP'");
			conpay.append(" and to_char(t.pc_dynamic_date,'yyyyMM')='"+time+"')");
			List conpayList=baseDAO.getDataAutoCloseSes(conpay.toString());
			String conids ="";
			for(int i=0;i<conpayList.size();i++){
				String uid =(String)conpayList.get(i);
				conids+=uid;
				if(i<conpayList.size()-1){
					conids+=",";
				}
			}
			String uids ="";
			for(int i=0;i<payList.size();i++){
				String uid =(String)payList.get(i);
				uids+=uid;
				if(i<payList.size()-1){
					uids+=",";
				}
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同付款信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_PAYAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&uids="+uids+"&optype=PAYAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+payList.size()+"条合同付款信息</a></li>"; 	 	
		}
		//结算
		StringBuilder  balBuilder = new StringBuilder("select distinct app.balid ");
		balBuilder.append("   from bdg_bal_app app ");
		balBuilder.append("  where app.balappid in (select distinct pdd.pc_table_uids ");
		balBuilder.append("   from pc_dynamic_data pdd ");
		balBuilder.append("where pdd.pc_table_name = 'BDG_BAL_APP' ");
		balBuilder.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
		balBuilder.append(" and pdd.pid = '"+pid+"')");
		List balList = baseDAO.getDataAutoCloseSes(balBuilder.toString());
		if(balList.size()>0){
			StringBuilder  conbal = new StringBuilder("select distinct app.conid ");
			conbal.append("   from bdg_bal_app app ");
			conbal.append("  where app.balappid in (select distinct pdd.pc_table_uids ");
			conbal.append("   from pc_dynamic_data pdd ");
			conbal.append("where pdd.pc_table_name = 'BDG_BAL_APP' ");
			conbal.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
			conbal.append(" and pdd.pid = '"+pid+"')");
			List conbalList =baseDAO.getDataAutoCloseSes(conbal.toString());
			String conids ="";
			for(int i=0;i<conbalList.size();i++){
				String uid = (String)conbalList.get(i);
				conids+=uid;
				if(i<conbalList.size()-1){
					conids+=",";
				}
			}
			String uids ="";
			for(int i=0;i<balList.size();i++){
				String uid = (String)balList.get(i);
				uids+=uid;
			 if(i<balList.size()-1){
				 uids+=",";
			 }
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同结算信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_BALAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&uids="+uids+"&optype=BALAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+balList.size()+"条合同结算信息</a></li>"; 	 	
		}
		
		//工程量分摊
		StringBuffer   bdgProject = new StringBuffer("select distinct t.conid ");
		bdgProject.append(" from bdg_project t ");
		bdgProject.append(" where t.proappid in ");
		bdgProject.append(" (select distinct pdd.pc_table_uids ");
		bdgProject.append(" from pc_dynamic_data pdd ");
		bdgProject.append(" where pdd.pc_table_name = 'BDG_PROJECT' ");
		bdgProject.append(" and pdd.pid = '"+pid+"' ");
		bdgProject.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"') ");
		List projectList =baseDAO.getDataAutoCloseSes(bdgProject.toString());
		if(projectList.size()>0){
			String conids="";
			for(int i=0;i<projectList.size();i++){
				String uid=(String)projectList.get(i);
				conids+=uid;
				if(i<projectList.size()-1){
					conids+=",";
				}
			}
			winName.replace(0, winName.length(), proName + "--更新信息查询--合同工程量分摊信息");
			bdgInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BDG_PROJECTAPP_URL+"?pid="+pid+"&proName="+proName+
				"&conids="+conids+"&optype=PROAPP&dydaView=true','"+winName.toString()+"')\">新增或修改了"+projectList.size()+"条合同工程量分摊信息</a></li>"; 	 	
			
		}
		if("".equals(bdgInfo)){
			return "无更新";
		}
		
		return bdgInfo;
	}
	@SuppressWarnings("unchecked")
	public List getEntryBeanInfoByParams(String primaryKey, String pid,
			String uids, String tableName) {
		Session session = baseDAO.getSessionFactory().openSession();
		List list = new ArrayList();
		  try {
			StringBuilder sBuilder = new StringBuilder("select * from ");
			sBuilder.append(DynamicDataUtil.getTableNameByEntry(tableName));
			sBuilder.append(" temp where temp.pid='" + pid + "' ");
			sBuilder.append(" and temp." + primaryKey + " in(" + uids + ")");
		    list=session.createSQLQuery(sBuilder.toString()).addEntity(
					Class.forName(tableName)).list();
		} catch (Exception e) {
			throw new RuntimeException("找不到类");
		}finally{
			session.close();
		}
		return list;
	}
	@SuppressWarnings("unchecked")
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode>  list = new ArrayList<ColumnTreeNode>();    
		if("bdgDynamicTree".equals(treeName)){
			String pid =((String[])params.get("pid"))[0];
			String time =((String [])params.get("time"))[0];
			String str = "parent = '%s' and pid = '%s' order by bdgid";
			str = String.format(str, parentId, pid);
			//获取有更新的内容
			List newBdg = baseDAO.getDataAutoCloseSes("select distinct pdd.pc_table_uids from pc_dynamic_data  pdd where pdd.pid='"+pid+"' and pdd.pc_table_name='BDG_INFO' and pdd.pc_table_op_type='update' and to_char(pdd.pc_dynamic_date,'yyyyMM')='"+time+"'");
			List<BdgInfo> objects = baseDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), str);
			Iterator<BdgInfo> itr = objects.iterator();
			while (itr.hasNext()) {
				BdgInfo temp = (BdgInfo) itr.next();
				boolean newFlag=false;
				for(int i=0;i<newBdg.size();i++){
					String newBdgId=(String)newBdg.get(i);
					if(newBdgId.equals(temp.getBdgid())){
						newFlag=true;
						break;
					}
				}
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				temp.setRemainder((temp.getBdgmoney()==null?0:temp.getBdgmoney()) - (temp.getContmoney() == null?0: temp.getContmoney()));
				int leaf = temp.getIsleaf().intValue();			
				n.setId(temp.getBdgid());
				if(newFlag){
					n.setText("<span style=\"color: red;\">"+temp.getBdgname()+"</span>");		// treenode.text
				}else {
					n.setText(temp.getBdgname());		// treenode.text
				}
				if (leaf == 1) {
					n.setLeaf(true);				
					n.setIconCls("task");			
				} else {
					n.setLeaf(false);				// treenode.leaf
					n.setCls("master-task");		// treenode.cls
					n.setIconCls("task-folder");	// treenode.iconCls
				}
				n.setIfcheck("none");
				cn.setTreenode(n);					// ColumnTreeNode.treenode
				JSONObject jo = JSONObject.fromObject(temp);
				cn.setColumns(jo);					// columns
				list.add(cn);
			}
		    }
		if("bdgMoneyTree".equals(treeName)){
			String conId =((String[])params.get("conid"))[0];
			String pid =((String[])params.get("pid"))[0];
			String time =((String[])params.get("time"))[0];
			String parent = parentId != null && !parentId.equals("") ? parentId: BusinessConstants.APPBudgetRootID;
			String str = "parent = '%s' and conid = '%s' order by bdgid";
			str = String.format(str, parent, conId);
			List<VBdgmoneyapp> objects = this.baseDAO.findByWhere(BusinessConstants.BDG_PACKAGE.concat("VBdgmoneyapp"), str);
			StringBuilder  stringBuilder= new StringBuilder("select distinct app.bdgid ");
			stringBuilder.append(" from bdg_money_app app ");
			stringBuilder.append(" where app.appid in ");
			stringBuilder.append(" (select distinct pdd.pc_table_uids ");
			stringBuilder.append("   from pc_dynamic_data pdd ");
			stringBuilder.append(" where pdd.pid = '"+pid+"' ");
			stringBuilder.append("   and pdd.pc_table_name = 'BDG_MONEY_APP' ");
			stringBuilder.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"') and app.pid='"+pid+"' and app.conid='"+conId+"'");
			List newMoneyApp = baseDAO.getDataAutoCloseSes(stringBuilder.toString());
			Iterator<VBdgmoneyapp> itr = objects.iterator();
			while (itr.hasNext()) {
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode n = new TreeNode();
				VBdgmoneyapp temp = (VBdgmoneyapp) itr.next();
				VBdgInfo bi = (VBdgInfo) this.baseDAO.findById(VBdgInfo.class.getName(), temp.getBdgid());
				if (bi ==null)	continue;
				temp.setBdgmoney(bi.getBdgmoney());
				temp.setRealmoney(bi.getConapp());
				temp.setBdgno(bi.getBdgno());
				temp.setBdgname(bi.getBdgname());
				temp.setSumrealmoney(bi.getConbdgappmoney());
				int leaf = temp.getIsleaf().intValue();	
				boolean newFlag=false;
				for(int i=0;i<newMoneyApp.size();i++){
					String newBdgId=(String)newMoneyApp.get(i);
					if(newBdgId.equals(temp.getBdgid())){
						newFlag=true;
						break;
					}
				}
				n.setId(temp.getBdgid());
				if(newFlag){
					n.setText("<span style=\"color: red;\">"+temp.getBdgname()+"</span>");		// treenode.text
				}else {
					n.setText(temp.getBdgname());
				}
				if (leaf == 1) {
					n.setLeaf(true);				
					n.setIconCls("task");			
				} else {
					n.setLeaf(false);				// treenode.leaf
					n.setCls("master-task");		// treenode.cls
					n.setIconCls("task-folder");	// treenode.iconCls
				}
				n.setIfcheck("none");
				cn.setTreenode(n);					// ColumnTreeNode.treenode
				JSONObject jo = JSONObject.fromObject(temp);
				cn.setColumns(jo);					// columns
				list.add(cn);
			}
		}
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public String calculatePrjBaseInfo(String pid, String proName, String time){
		String projectInfo="";
		StringBuffer winName = new StringBuffer(); //跳转页面标题
		
		//项目基本信息
		String  projectInfoSql="  select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_ZHXX_PRJ_INFO' and pdd.pc_table_op_type='update' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List ProjectInfoList =baseDAO.getDataAutoCloseSes(projectInfoSql);
		if(ProjectInfoList.size()>0){
			String uids="";
			 for(int i=0;i<ProjectInfoList.size();i++){
				 String uid =(String)ProjectInfoList.get(i);
				 uids += uid;
				 if(i<ProjectInfoList.size()-1){
					 uids+=",";
				 }
			 }
			
			winName.append(proName + "--更新信息查询--项目基本信息"); 
			projectInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.PROJECT_INFO_URL+"?pid="+pid+
				"&edit_add=false&dydaView=true','"+winName.toString()+"')\">更新了项目基本属性</a></li>";
		}
		
		//计算项目主要事件
		String  projectEventSql="select uids from com_file_info where to_char(file_createtime,'YYYYMM')='"+time+"' and pid='"+pid+"' and  report_status = 1 and  "+
		       "file_sort_id in (select uids from com_file_sort start with uids = 'big_event_root' connect by prior uids = parent_id)";
		List projectEventList =baseDAO.getDataAutoCloseSes(projectEventSql);
		if(projectEventList.size()>0){
			
			winName.replace(0, winName.length(), proName + "--更新信息查询--项目主要事件");
			projectInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.PROJECT_MAINTHING_URL+"?rootId=big_event_root&canReport=1&dydaView=true&pid="+pid+
				"&sjType="+time+"','"+winName.toString()+"')\">更新了项目主要事件</a></li>";
		}
		
		//计算项目组织机构
		String  projectOrgSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'SGCC_INI_UNIT' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";;
		List ProjectUnitList =baseDAO.getDataAutoCloseSes(projectOrgSql);
		if(ProjectUnitList.size()>0){
			String uids="";
			 for(int i=0;i<ProjectUnitList.size();i++){
				 String uid =(String)ProjectUnitList.get(i);
				 uids+="\\'"+uid+"\\'";
				 if(i<ProjectUnitList.size()-1){
					 uids+=",";
				 }
			 }
			 uids="(" + uids + ")";
			 
			 winName.replace(0, winName.length(), proName + "--更新信息查询--项目组织机构");
			 try {
				proName = java.net.URLEncoder.encode(proName,"utf-8");
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			 projectInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
			 	DynamicDataUtil.PROJECT_UNITSTRUCTURE_URL+"?currAppid="+pid+"&currAppName="+proName+"&edit=false"+
			 	"&outFilter="+uids+"&dydaView=true','"+winName.toString()+"')\">更新了组织机构</a></li>";
		}
		
		//计算项目合作单位
		String projectCoUnitSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_ZHXX_PRJ_PARTNER' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List ProjectCoUnitList =baseDAO.getDataAutoCloseSes(projectCoUnitSql);
		if(ProjectCoUnitList.size()>0){
			String uids="";
			 for(int i=0;i<ProjectCoUnitList.size();i++){
				 String uid =(String)ProjectCoUnitList.get(i);
				 uids+="\\'"+uid+"\\'";
				 if(i<ProjectCoUnitList.size()-1){
					 uids+=",";
				 }
			 }
			 uids="uids in ("+uids+")";
			 winName.replace(0, winName.length(), proName + "--更新信息查询--项目合作单位");
			 projectInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
			 	DynamicDataUtil.PROJECT_PARTNER_URL+"?pid="+pid+
			 	"&outFilter="+uids+"&dydaView=true','"+winName.toString()+"')\">更新了主要合作单位</a></li>";
		}
		
		if(projectInfo.equals("")){
			return "无更新";
		}
		return projectInfo;
	}
	
	String calculateBidInfo(String pid,String proName, String time){
		String bidInfo="";
		StringBuffer winName = new StringBuffer();
		//招标申请
		String bidApplySql="select distinct pdd.pc_table_op_type ,pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_BID_ZB_APPLY' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List bidApplyList =baseDAO.getDataAutoCloseSes(bidApplySql);
		if(bidApplyList.size()>0){
			int addNum=0;
			String addUids="";
			int updateNum=0;
			String updateUids="";
			for(int i=0;i<bidApplyList.size();i++){
				Object[] o=(Object[])bidApplyList.get(i);
				String opType=(String)o[0];
				if(opType.equals("add")){
					addNum+=1;
					String uids =(String)o[1];
					addUids+="\\'"+uids+"\\',";
				}else if(opType.equals("update")){
					updateNum+=1;
					String uids =(String)o[1];
					updateUids+="\\'"+uids+"\\',";
				}
			}
			if(addUids.length()>0){
				addUids=addUids.substring(0, addUids.length()-1);
				addUids="uids in ("+addUids+")";
			}
			if(updateUids.length()>0){
				updateUids=updateUids.substring(0, updateUids.length()-1);
				updateUids="uids in ("+updateUids+")";
			}
			
			winName.append(proName + "--更新信息查询--招标申请"); //跳转页面标题
			if(addNum>0){
				bidInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
					DynamicDataUtil.BID_APPLY_URL+"?dydaView=true&pid="+pid+
					"&outFilter="+addUids+"','"+winName.toString()+"')\">新增了"+addNum+"条招标申请</a></li>";
			}	
			if(updateNum>0){
				bidInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BID_APPLY_URL+"?dydaView=true&pid="+pid+
				"&outFilter="+updateUids+"','"+winName.toString()+"')\">更新了"+updateNum+"条招标申请</a></li>";
			}
		}
		
		//招标进度信息
		String bidScheduelSql="select distinct pdd.pc_table_op_type ,pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name in ('PC_BID_PROGRESS','PC_BID_ISSUE_WIN_DOC') and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List bidScheduelList =baseDAO.getDataAutoCloseSes(bidScheduelSql);
		
		if(bidScheduelList.size()>0){
			int addNum=0;
			String addUids="";
			int updateNum=0;
			String updateUids="";
			for(int i=0;i<bidScheduelList.size();i++){
				Object[] o = (Object[])bidScheduelList.get(i);
				String opType = (String)o[0];
				if(opType.equals("add")){
					addNum += 1;
					String uids = (String)o[1];
					addUids += uids;
					 if(i < bidScheduelList.size()-1){
						 addUids += ",";
					 }
				}else if(opType.equals("update")){
					updateNum += 1;
					String uids = (String)o[1];
					updateUids += uids;
					 if(i < bidScheduelList.size()-1){
						 updateUids += ",";
					 }
				}
			}
			
			if(addUids.length()>0){
				addUids=addUids.substring(0, addUids.length()-1);
				addUids="uids in ("+addUids+")";
			}
			
			if(updateUids.length()>0){
				updateUids=updateUids.substring(0, updateUids.length()-1);
				updateUids="uids in ("+updateUids+")";
			}
			
			winName.replace(0, winName.length(),proName + "--更新信息查询--招标进度信息"); //跳转页面标题
			if(addNum>0){
				bidInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BID_SCHEDULE_URL+"?dydaView=true&pid="+pid+
				"&time="+time+"&opType=add','"+winName.toString()+"')\">新增了"+addNum+"条招标进度信息</a></li>";
			}
			if(updateNum>0){
				bidInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.BID_SCHEDULE_URL+"?dydaView=true&pid="+pid+
				"&time="+time+"&opType=update','"+winName.toString()+"')\">更新了"+updateNum+"条招标进度信息</a></li>";
			}
		}
		
		//新需求去掉--招标合同月报
//		String reportSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_BID_SUPERVISEREPORT_M' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List reportList =baseDAO.getDataAutoCloseSes(reportSql);
//		if(reportList.size()>0){
//			String uids="";
//			 for(int i=0;i<reportList.size();i++){
//				 String uid =(String)reportList.get(i);
//				 uids+="\\'"+uid+"\\'";
//				 if(i<reportList.size()-1){
//					 uids+=",";
//				 }
//			 }
//			 uids="uids in ("+uids+")";
//			 bidInfo+="<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+DynamicDataUtil.BID_REPORT_URL+"?dydaView=true&pid="+pid+"&outFilter="+uids+"')\">更新了"+reportList.size()+"条招标（合同）月报信息</a></li>";
//		}
		
		if(bidInfo.equals("")){
			return "无更新";
		}
		return bidInfo;
	}
	
//	String calculateSecurityInfo(String pid, String proName, String time){
//		String securityInfo="";
//		//安全事故
//		String accidentSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_AQGK_ACCIDENR_INFO' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List accidentList =baseDAO.getDataAutoCloseSes(accidentSql);
//		if(accidentList.size()>0){
//			String uids="";
//			 for(int i=0;i<accidentList.size();i++){
//				 String uid =(String)accidentList.get(i);
//				 uids+="\\'"+uid+"\\'";
//				 if(i<accidentList.size()-1){
//					 uids+=",";
//				 }
//			 }
//			 uids="uids in ("+uids+")";
//			 securityInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
//			 	DynamicDataUtil.SECURITY_ACC_URL+"?dydaView=true&pid="+pid+"&proName="+proName+
//			 	"&outFilter="+uids+"')\">发生了"+accidentList.size()+"条安全事故</a></li>";
//		}
		
		//安全报告
//		String safetyMonthSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_AQGK_SAFETYMONTH_INFO' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List safetyMonthList =baseDAO.getDataAutoCloseSes(safetyMonthSql);
//		if(safetyMonthList.size()>0){
//			String uids="";
//			for(int i=0;i<safetyMonthList.size();i++){
//				String uid =(String)safetyMonthList.get(i);
//				 uids+="\\'"+uid+"\\'";
//				 if(i<safetyMonthList.size()-1){
//					 uids+=",";
//				 }
//			}
//			 uids="uids in ("+uids+")";
//			securityInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
//				DynamicDataUtil.SECURITY_REPORT_URL+"?dydaView=true&pid="+pid+"&proName="+proName+
//				"&outFilter="+uids+"')\">上报了"+safetyMonthList.size()+"条安全报告</a></li>";
//		}
//		
//		//安全培训
//		String safetyTrainSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_AQGK_SAFETYTRAIN_INFO' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List safetyTrainList =baseDAO.getDataAutoCloseSes(safetyTrainSql);
//		if(safetyTrainList.size()>0){
//			String uids="";
//			for(int i=0;i<safetyTrainList.size();i++){
//				String uid =(String)safetyTrainList.get(i);
//				uids+="\\'"+uid+"\\'";
//				if(i<safetyTrainList.size()-1){
//					uids+=",";
//				}
//			}
//			 uids="uids in ("+uids+")";
//			securityInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
//				DynamicDataUtil.SECURITY_TRAIN_URL+"?dydaView=true&pid="+pid+"&proName="+proName+
//				"&outFilter="+uids+"')\">上报了"+safetyTrainList.size()+"条安全培训</a></li>";
//		}
//		if(securityInfo.equals("")){
//			return "无更新";
//		}
//		return securityInfo;
//	}
	
	String calculateQualityInfo(String pid, String proName, String time){
		String qualityInfo="";
		StringBuffer winName = new StringBuffer();
		//监理报告
		String superReportSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_ZLGK_SUPERREPORT_INFO' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List superReportList =baseDAO.getDataAutoCloseSes(superReportSql);
		if(superReportList.size()>0){
			String uids="";
			 for(int i=0;i<superReportList.size();i++){
				 String uid =(String)superReportList.get(i);
				 uids+="\\'"+uid+"\\'";
				 if(i<superReportList.size()-1){
					 uids+=",";
				 }
			 }
			 uids="uids in ("+uids+")";
			 winName.append(proName + "--更新信息查询--监理报告");
			 qualityInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
			 	DynamicDataUtil.QUALITY_SUPER_URL+"?dydaView=true&pid="+pid+"&proName="+proName+
			 	"&outFilter="+uids+"','"+winName.toString()+"')\">上报了"+superReportList.size()+"条监理报告</a></li>";
		}
//  新需求去掉--验评月报情况
//		String assInfoSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_ZLGK_QUA_INFO' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List assInfoList =baseDAO.getDataAutoCloseSes(assInfoSql);
//		if(assInfoList.size()>0){
//			String uids="";
//			for(int i=0;i<assInfoList.size();i++){
//				String uid =(String)assInfoList.get(i);
//				 uids+="\\'"+uid+"\\'";
//				if(i<assInfoList.size()-1){
//					uids+=",";
//				}
//			}
//			uids="uids in ("+uids+")";
//			qualityInfo+="<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+DynamicDataUtil.QUALITY_ASS_URL+"?dydaView=true&pid="+pid+"&outFilter="+uids+"')\">上报了"+assInfoList.size()+"条验评信息</a></li>";
//		}
		
		if(qualityInfo.equals("")){
			return "无更新";
		}
		return qualityInfo;
	}
	
//	String calculateInvestInfo(String pid,String time){
//		String investInfo="";
//		//年度投资计划
//		String yearInvestSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'V_PC_TZGL_YEAR_PLAN_M' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List yearInvestList =baseDAO.getDataAutoCloseSes(yearInvestSql);
//		if(yearInvestList.size()>0){
//			String uids="";
//			 for(int i=0;i<yearInvestList.size();i++){
//				 String uid =(String)yearInvestList.get(i);
//				 uids+="\\'"+uid+"\\'";
//				 if(i<yearInvestList.size()-1){
//					 uids+=",";
//				 }
//			 }
//			 uids="uids in ("+uids+")";
//			 investInfo+="<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+DynamicDataUtil.INVEST_YEAR_URL+"?dydaView=true&pid="+pid+"&outFilter="+uids+"')\">上报了"+yearInvestList.size()+"条年度投资计划</a></li>";
//		}
//		//月度投资完成
//		String monthCompSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'V_PC_TZGL_MONTH_REPORT_M' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
//		List monthCompList =baseDAO.getDataAutoCloseSes(monthCompSql);
//		if(monthCompList.size()>0){
//			String uids="";
//			for(int i=0;i<monthCompList.size();i++){
//				String uid =(String)monthCompList.get(i);
//				uids+="\\'"+uid+"\\'";
//				if(i<monthCompList.size()-1){
//					uids+=",";
//				}
//			}
//			uids="uids in ("+uids+")";
//			investInfo+="<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+DynamicDataUtil.INVEST_MONTH_URL+"?dydaView=true&pid="+pid+"&outFilter="+uids+"')\">上报了"+monthCompList.size()+"条月度投资完成</a></li>";
//		}
//		
//		if(investInfo.equals("")){
//			return "无更新";
//		}
//		return investInfo;
//	}
//	
//	String calculateapprovlInfoInfo(String pid,String time){
//		String approvel="";
//		if(approvel.equals("")){
//			return "无更新";
//		}else {
//			return "有更新";
//		}
//	}
	
	//针对招投标中进度信息的 查询
	public List indexOfProgess(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params){
	   List<JSONObject> list = new ArrayList<JSONObject>();
	   String uids=params.get("uids");
	   String pid=params.get("pid");
	   
	   List<PcBidProgress> progessList=baseDAO.findByWhere(PcBidProgress.class.getName(), "uids in ("+uids+")");
	   for(int i=0; i<progessList.size();i++){
		   PcBidProgress porgessObj=(PcBidProgress)progessList.get(i);
		   PcBidZbContent contentObj=(PcBidZbContent)baseDAO.findBeanByProperty(PcBidZbContent.class.getName(), "uids",porgessObj.getContentUids());
		   PcBidZbApply applyObj=(PcBidZbApply)baseDAO.findBeanByProperty(PcBidZbApply.class.getName(), "uids",contentObj.getZbUids());
		   //招标进度类型
		   String progessType=porgessObj.getProgressType();
		   String progessName="";
		   if(progessType.equals("TbUnitInfo")){
			   progessName="投标人报名信息及预审结果";
		   }else if(progessType.equals("AcceptTbdoc")){
			   progessName="接受招标文件及投标保证金";
		   }else if(progessType.equals("AssessCouncil")){
			   progessName="评标委员会";
		   }else if(progessType.equals("BidAssess")){
			   progessName="评标";
		   }else if(progessType.equals("BidAssessPublish")){
			   progessName="评标结果公示";
		   }else if(progessType.equals("ClarificateZbdoc")){
			   progessName="招标文件澄清";
		   }else if(progessType.equals("OpenBidding")){
			   progessName="开标";
		   }else if(progessType.equals("TbSendZbDoc")){
			   progessName="发售招标文件";
		   }else {
			   progessName=progessType;
		   }
		   
		   JSONObject jo = new JSONObject();
		   jo.put("zbName",applyObj.getZbName());
		   jo.put("contentes",contentObj.getContentes());
		   jo.put("uids",porgessObj.getUids());
		   jo.put("pid",porgessObj.getPid());
		   jo.put("progessName",progessName);
		   jo.put("startDate",porgessObj.getStartDate());
		   jo.put("endDate",porgessObj.getEndDate());
		   jo.put("rateStatus",porgessObj.getRateStatus());
		   jo.put("respondDept",porgessObj.getRespondDept());
		   jo.put("respondUser",porgessObj.getRespondUser());
		   jo.put("isActive",porgessObj.getIsActive());
		   jo.put("memo",porgessObj.getMemo());
		   jo.put("kbPrice",porgessObj.getKbPrice());
		   jo.put("pbWays",porgessObj.getPbWays());
		   jo.put("pbWaysAppend",porgessObj.getPbWaysAppend());
		   
		   list.add(jo);
	   }
	   return list;
	}
	
	@SuppressWarnings("unchecked")
	public String calculateSchedule(String pid, String proName, String time){
		String schedule="";
		StringBuffer winName = new StringBuffer();
		//进度计划
//		StringBuilder  jinduBuilder= new StringBuilder(" select distinct peri.uids ");
//		jinduBuilder.append(" from PC_EDO_REPORT_INPUT peri ");
//		jinduBuilder.append(" where peri.uids in ");
//		jinduBuilder.append(" (select distinct pdd.pc_table_uids ");
//		jinduBuilder.append("  from pc_dynamic_data pdd ");
//		jinduBuilder.append(" where pdd.pc_table_name = 'V_PC_JDGK_REPORT' ");
//		jinduBuilder.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
//		jinduBuilder.append(" and pdd.pid = '"+pid+"') ");
//		jinduBuilder.append("  and peri.state = '1' ");
//		List jinReport=baseDAO.getDataAutoCloseSes(jinduBuilder.toString());
//		if(jinReport.size()>0){
//			String uids ="";
//			for(int i=0;i<jinReport.size();i++){
//				String uid =(String)jinReport.get(i);
//				uids+=uid;
//				if(i<jinReport.size()-1){
//					uids+=",";
//				}
//			}
//			schedule+="<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+DynamicDataUtil.SCHEDULE_PROGRESS_URL+"?pid="+pid+"&proname="+proname+"&uids="+uids+"')\">上报了"+jinReport.size()+"条进度进展报告</a></li>"; 	 
//		}
		//里程碑计划
		StringBuilder lichengbeiBuilder = new StringBuilder("select count(ep.uid_) ");
		lichengbeiBuilder.append(" from Edo_Project ep ");
		lichengbeiBuilder.append(" where ep.uid_ in (select distinct pdd.pc_table_uids ");
		lichengbeiBuilder.append("  from pc_dynamic_data pdd ");
		lichengbeiBuilder.append(" where pdd.pc_table_name = 'EDO_PROJECT' ");
		lichengbeiBuilder.append(" and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
		lichengbeiBuilder.append(" and pdd.pid = '"+pid+"')");
		lichengbeiBuilder.append(" and ep.name_ = '里程碑计划'");
		List  lichengBei = baseDAO.getDataAutoCloseSes(lichengbeiBuilder.toString());
		int result = ((BigDecimal)lichengBei.get(0)).intValue();
		if(result>0){
			winName.append(proName+"--更新了里程碑计划");
			schedule += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.SCHEDULE_LICHENGBEI_URL+"?plan=li&pid="+pid+"&proName="+proName+
				"&dydaView=true"+"','"+winName.toString()+"')\">更新了里程碑计划</a></li>"; 	 
		}
		//一级网络计划
		StringBuilder scheduleBuilder = new StringBuilder("select count(ep.uid_) ");
		scheduleBuilder.append(" from Edo_Project ep ");
		scheduleBuilder.append(" where ep.uid_ in (select distinct pdd.pc_table_uids ");
		scheduleBuilder.append("  from pc_dynamic_data pdd ");
		scheduleBuilder.append(" where pdd.pc_table_name = 'EDO_PROJECT' ");
		scheduleBuilder.append("and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'");
		scheduleBuilder.append("and pdd.pid = '"+pid+"')");
		scheduleBuilder.append(" and ep.name_ = '一级网络计划'");
		List yijiWang = baseDAO.getDataAutoCloseSes(scheduleBuilder.toString());
		int yijiResult = ((BigDecimal)yijiWang.get(0)).intValue();
		if(yijiResult>0){
			winName.replace(0, winName.length(), proName + "--更新了一级网络计划");
			schedule += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.SCHEDULE_YIJIWANGLUO_URL+"?plan=yi&pid="+pid+"&proName="+proName+
				"&dydaView=true"+"','"+winName.toString()+"')\">更新了一级网络计划</a></li>"; 	 
		}
		if("".equals(schedule)){
			return "无更新";
		}
		return schedule;
	}
	
	//综合报表(年度投资计划和月度报表)
	String calculateStatmentsInfo(String pid, String proName, String time){
		String statementsInfo = "";
		StringBuffer winName = new StringBuffer();
		
		//年度投资计划
		String yearInvestSql="select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'V_PC_TZGL_YEAR_PLAN_M' and pdd.pid = '"+pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"'";
		List yearInvestList =baseDAO.getDataAutoCloseSes(yearInvestSql);
		if(yearInvestList.size()>0){
			String uids="";
			 for(int i=0;i<yearInvestList.size();i++){
				 String uid =(String)yearInvestList.get(i);
				 uids += uid;
				 if(i<yearInvestList.size()-1){
					 uids+=",";
				 }
			 }
			 winName.append(proName + "--更新信息查询--年度投资计划");
			 statementsInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
			 	DynamicDataUtil.INVEST_YEAR_URL+"?dydaView=true&pid="+pid+
			 	"&dyUids="+uids+"','"+winName.toString()+"')\">上报了"+yearInvestList.size()+"条年度投资计划</a></li>";
		}
		
		//月度报表
		StringBuffer sqlBuffer = new StringBuffer();
		int count = 0; //记录本月上报月报条数
		
		sqlBuffer.append("select count(*) from (select distinct pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name in" +
				"('V_PC_TZGL_MONTH_REPORT_M', 'V_PC_JDGK_REPORT','PC_ZLGK_QUA_INFO'," +
				"'PC_BID_SUPERVISEREPORT_M','PC_TZGL_DYREPORT1_M','PC_TZGL_DYREPORT2_M'," +
				"'PC_TZGL_DYREPORT3_M') and pdd.pid = '" + pid +
				"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')");
		
		BigDecimal rs = (BigDecimal) (this.baseDAO.getDataAutoCloseSes(sqlBuffer.toString()).get(0));
		count = rs.intValue();
		
		if(count>0)
		{	
			winName.replace(0, winName.length(), proName + "--更新信息查询--月度报表");
			statementsInfo += "<li><a href=\"javascript:void(0)\" onclick=\"openDialog('"+
				DynamicDataUtil.ALL_MONTHLY_REPORT_URL+"?dydaView=true&pid="+pid+"&time="+time+
				"','"+winName.toString()+"')\">上报了"+ count +"条月度报表</a></li>";
		}
		if(statementsInfo.equals("")){
			return "无更新";
		}
		else{
			return statementsInfo;
		}
	}
	
	
	@SuppressWarnings("unchecked")
	public List getAllStatements(String orderby, Integer start, Integer limit, HashMap params) throws BusinessException
	{
		List list = new ArrayList<PcStatements>();
		
		String pid = (String) params.get("pid");
		String time = (String) params.get("time");
		if(null==pid || pid.equals("") || null==time|| time.equals(""))
			return null;
		
		String sql = "select * from view_month_report_m where uids in (select distinct pdd.pc_table_uids from " +
				"pc_dynamic_data pdd where pdd.pid='" + pid +
				"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"')"; 
		
		Session session = HibernateSessionFactory.getSession();
		SQLQuery q = session.createSQLQuery(sql).addEntity(PcStatements.class);
		int size = q.list().size();
		if(start!=null)
			q.setFirstResult(start);
		if(limit!=null)
			q.setMaxResults(limit);
		list = q.list();
		list.add(size);
		return list;
	}
	
	@SuppressWarnings("unchecked")
	private void configureAuditsOfPcDynamicIndex(String modName, String sjTypeS, String sjTypeW, 
																		String pid, PcDynamicIndex pdi)
	{
		String whereSql = null;
		whereSql = "sj_type='" + sjTypeW + "' and mod_name='" + modName +"'";
		List<PcAuditWeightDistribute> weightBeanList =
			(List<PcAuditWeightDistribute>)this.baseDAO.findByWhere(PcAuditWeightDistribute.class.getName(), whereSql);
		Double value = (0==weightBeanList.size()) ? new Double(0) : weightBeanList.get(0).getWeightValue();
		
		whereSql = "pid='" + pid + "' and sj_type='" + sjTypeS + "' and mod_name='" + modName +"'";
		List<PcAuditModuleScore> scoreBeanList = 
			(List<PcAuditModuleScore>)this.baseDAO.findByWhere(PcAuditModuleScore.class.getName(), whereSql);
		String state = (0==scoreBeanList.size()) ? new String("未审核"): scoreBeanList.get(0).getState();
		
		if(modName.equals("basic"))
		{
			pdi.setBasicValue(value);
			pdi.setBasicState(state);
		}
		else if(modName.equals("bid"))
		{
			pdi.setBidValue(value);
			pdi.setBidState(state);
		}
		else if(modName.equals("bdg"))
		{
			pdi.setBdgValue(value);
			pdi.setBdgState(state);
		}
		else if(modName.equals("con"))
		{
			pdi.setConValue(value);
			pdi.setConState(state);
		}
		else if(modName.equals("schedule"))
		{
			pdi.setScheduleValue(value);
			pdi.setScheduleState(state);
		}
		else if(modName.equals("statement"))
		{
			pdi.setStatementValue(value);
			pdi.setStatementState(state);
		}
		else if(modName.equals("quality"))
		{
			pdi.setQualityValue(value);
			pdi.setQualityState(state);
		}
		else if(modName.equals("security"))
		{
			pdi.setSecurityValue(value);
			pdi.setSecurityState(state);
		}
	}
	
	@SuppressWarnings("unchecked")
   public void saveOrUpdateAudit(String pid, String modName, String state, String sjType) throws BusinessException
   {
	   String whereSql = "pid='" + pid + "' and mod_name='" + modName + "' and sj_type='" + sjType + "'";
	   List<PcAuditModuleScore> oldBean = 
		   (List<PcAuditModuleScore>) this.baseDAO.findByWhere2(PcAuditModuleScore.class.getName(), whereSql);
	   PcAuditModuleScore bean;
	   if(oldBean.size()==0)
	   {
		   bean = new PcAuditModuleScore();
		   bean.setPid(pid);
		   bean.setModName(modName);
		   bean.setSjType(sjType);
		   bean.setState(state);
		   this.baseDAO.insert(bean);
	   }
	   else
	   {
		   bean = oldBean.get(0);
		   bean.setState(state);
		   this.baseDAO.saveOrUpdate(bean);
	   }
   }
	
    /**
     * 新增或者修改模块权重值
     * @param map  动态数据所有模块和权重值的集合
     * @param time 根据该字段判断是新增还是保存
     * @return ("1"--新增成功;"-1"--保存失败;"0"--修改成功)
     * @throws BusinessException
     */
	@SuppressWarnings("unchecked")
	public String saveOrUpdateWeights(HashMap map, String time) throws BusinessException
	{
		String flag = "-1";
		
		List<PcAuditWeightDistribute> oldList = 
				this.baseDAO.findByWhere2(PcAuditWeightDistribute.class.getName(), "sj_type='"+time+"'");
		Set set = map.keySet();
		boolean addFlag = (oldList.size()==0) ? true: false; //新增还是修改
		if(addFlag)
		{
			for(Iterator<String> itor = set.iterator(); itor.hasNext();)
			{
				String key = itor.next();
				PcAuditWeightDistribute weightBean = new PcAuditWeightDistribute();
				weightBean.setModName(key);
				weightBean.setSjType(time);
				weightBean.setWeightValue(Double.valueOf((String) map.get(key)));
				this.baseDAO.saveOrUpdate(weightBean);
			}
			
			flag = "1";
		}
		else
		{
			for(int i=0; i<oldList.size(); i++)
			{
				PcAuditWeightDistribute weightBean = oldList.get(i);
				String str = (String) map.get(weightBean.getModName());
				if(null==str)
					continue; //去掉安全
				Double value = str.equals("") ? new Double(0) : Double.valueOf(str);
				if(weightBean.getWeightValue() != map.get(weightBean.getModName()))
				{
					weightBean.setWeightValue(value);
				}
				
				this.baseDAO.saveOrUpdate(weightBean);
			}
			
			flag = "0";
		}
		
		return flag;
	}
	
    /*
     * 集团，集团二级公司可编辑用户修改所有模块审核状态后，通过数据交互将各模块审核状态，模块权重值发送到项目单位
     * cTime 月份
     * toUnit 接收目标的项目标号
     * fromUnit 发送放单位编号
     */
	@SuppressWarnings("unchecked")
	public void dateExchangeOfStateAndValue(String cTime, String toUnit, String fromUnit)
	{
		//根据年月和项目编号获得所有模块权审核状态
		String whereSql = "sj_type='"+ cTime + "' and pid='" + toUnit + "'";
		List<PcAuditModuleScore> stateList = 
								this.baseDAO.findByWhere2(PcAuditModuleScore.class.getName(), whereSql);
		
		//获取最接近用户选择日期的系统权重值
		String sj_type = (this.baseDAO.getDataAutoCloseSes("select max(sj_type) from pc_audit_weight_distribute where sj_type<='"+cTime+"'")).get(0).toString();
		whereSql = "sj_type='"+sj_type+"'";
		List<PcAuditWeightDistribute> valueList = 
								this.baseDAO.findByWhere2(PcAuditWeightDistribute.class.getName(), whereSql);
		
		if(stateList.size()>0 || valueList.size()>0)
		{
			List allData = new ArrayList();
			allData.addAll(stateList);
			allData.addAll(valueList);
			PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List<PcDataExchange> exchangeList = 
				excService.getExcDataList(allData, toUnit, fromUnit, null, null, "项目单位审核状态和模块权重值");
			excService.addExchangeListToQueue(exchangeList);
		}
	}
}
