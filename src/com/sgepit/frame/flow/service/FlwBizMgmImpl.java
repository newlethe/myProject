package com.sgepit.frame.flow.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.ListOrderedMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwLog;
import com.sgepit.frame.flow.hbm.InsDataInfoView;
import com.sgepit.frame.flow.hbm.TaskView;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.XMLToExcel;
import com.sgepit.helps.webdynproService.export.ExcelPortException;

public class FlwBizMgmImpl extends BaseMgmImpl
	implements FlwBizMgmFacade {
	private FlowDAO flowDAO;
	private FlwFrameMgmFacade flwFrameMgm;
	
	private String insDataInfoViewBean;
	private String logBean;
	private String faceParamsInsBean;
	
	Log log = LogFactory.getLog(FlwBizMgmImpl.class);
	
	public FlwBizMgmImpl()
	{
        logBean = "com.sgepit.frame.flow.hbm.".concat("FlwLog");
        insDataInfoViewBean = "com.sgepit.frame.flow.hbm.".concat("InsDataInfoView");
        faceParamsInsBean = "com.sgepit.frame.flow.hbm.".concat("FlwFaceParamsIns");
	}
	
	
	public void setFlowDAO(FlowDAO flowDAO) {
		this.flowDAO = flowDAO;
	}
	
	public void setFlwFrameMgm(FlwFrameMgmFacade flwFrameMgm) {
		this.flwFrameMgm = flwFrameMgm;
	}
	
	/**
	 * 获取打印数据
	 * @param tabName 业务表名
	 * @param where   过滤条件
	 * @return
	 */
	public ListOrderedMap getBizData(String tabName, String where) {
		try{   
    		if(false){
    			Object obj = this.invokeBizMethod(null, null, null);
    			if(obj==null){//抛出异常
    				return new ListOrderedMap();
    			}else{
    				return (ListOrderedMap)obj;
    			}
    		}
			
			tabName = tabName.toUpperCase();
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
	        String sql = (new StringBuilder("select * from ")).append(tabName).append(",dual where ").append(where).toString();
	        List list = jdbc.queryForList(sql);
	        ListOrderedMap map = list.size()>0?(ListOrderedMap)list.get(0):new ListOrderedMap();
	        if("EQU_GET_GOODS_VIEW".equals(tabName))
	        {
	            String ggid = (String)map.get("ggid");
	            List subData = jdbc.queryForList((new StringBuilder("select * from EQU_GET_GOODS_VIEW_SUB where wztype is not null and dh_id = '")).append(ggid).append("' and ").append(where).toString());
	            map.put("subdata", subData);
	        } 
	        else if("EQU_OPEN_BOX_VIEW".equals(tabName))
	        {
	            List subData = jdbc.queryForList(sql);
	            map.put("subdata", subData);
	        } 
	        else if("EQU_OPEN_BOX_SUB_VIEW".equals(tabName))
	        {
	            List subData = jdbc.queryForList(sql);
	            map.put("subdata", subData);
	        } 
	        else if("EQU_REC_VIEW".equals(tabName))
	        {
	            String recid = map.get("recid").toString();
	            List subData = jdbc.queryForList((new StringBuilder("select * from equ_rec_sub where recid='")).append(recid).append("'").toString());
	            map.put("subdata", subData);
	        }
	        else if("VIEW_PRO_ACM_MONTH_INFO".equals(tabName))
	        {
	        	String recid = map.get("mon_id").toString();
	        	List subData = jdbc.queryForList((new StringBuilder("select * from view_pro_acm_month_info where mon_id='")).append(recid).append("'").toString());
	        	map.put("subdata", subData);
	        }
	        else if("VIEW_WZ_CJSXB_PB".equals(tabName))//物资申请计划
	        {
	        	String recid = map.get("bh").toString();
	        	List subData = jdbc.queryForList((new StringBuilder("select * from wz_cjsxb where bh='")).append(recid).append("'").toString());
	        	map.put("subdata", subData);
	        }
	        else if("VIEW_WZ_CJHXB".equals(tabName))//采购计划
	        {
	        	String recid = map.get("bh").toString();
	        	List subData = jdbc.queryForList((new StringBuilder("select * from wz_cjhxb where bh='")).append(recid).append("'").toString());
	        	map.put("subdata", subData);
	        }
	        else if("VIEW_WZINPUT_WZCDJINPB".equals(tabName))
	        {
	        	String recid = map.get("bh").toString();
	        	List subData = jdbc.queryForList("select * from wz_input where pbbh='"+recid+"' and bill_state='N' and  bill_type='计划入库'");
	        	map.put("subdata", subData);
	        }
	        else if("WZ_OUTPUT".equals(tabName))
	        {
	        	String recid = map.get("bh").toString();
	        	List subData = jdbc.queryForList("select * from wz_output where bh='"+recid+"' and jhbh='计划外'");//计划外
	        	if(subData==null || subData.size()==0){
	        		subData = jdbc.queryForList("select * from wz_output where bh='"+recid+"' and jhbh<>'计划外'");//计划内
	        	}
	        	map.put("subdata", subData);
	        }
	        else if("MAT_STORE_OUT".equalsIgnoreCase(tabName)){//物资计划出(入)库
	        	String outUuid = map.get("uuid").toString();//出库单唯一约束
	        	List subData = jdbc.queryForList("select * from MAT_STORE_OUTSUB where out_id='"+outUuid+"'");//出库细表
	        	map.put("subdata", subData);
	        }
	        else if("MAT_STORE_IN".equalsIgnoreCase(tabName)){//物资入库
	        	String inUuid = map.get("uuid").toString();//入库单唯一约束
	        	List subData = jdbc.queryForList("select * from MAT_STORE_INSUB where in_id='"+inUuid+"'");//入库细表
	        	map.put("subdata", subData);
	        }
	        //2010-01-17 申请计划汇总
	        else if("WZ_CJSPB_HZ".equalsIgnoreCase(tabName)){
	        	String inUuid = map.get("uids").toString();	//申请计划汇总表
	        	List subData = jdbc.queryForList("select * from WZ_CJSPB_HZ_SUB where hzuids='"+inUuid+"'");//申请计划汇总细表
	        	map.put("subdata", subData);
	        }
	        //2011-1-25 质量验评统计
	        else if("VIW_GCZL_JY_STAT".equalsIgnoreCase(tabName)){
	        	String inUuid = map.get("uids").toString();	
	        	List subData = jdbc.queryForList("select * from VIW_GCZL_JY_DETAIL where jy_stat_id ='"+ inUuid +"' order by jyxm_bh");
	        	map.put("subdata", subData);
	        }
	        
	        map.put("error", false);
	        return map;
	   }catch(Exception ex){
		   ex.printStackTrace();
		  
		   StackTraceElement[] st = ex.getStackTrace();
		   StringBuffer msg = new StringBuffer("");
		   msg.append(ex);
		   msg.append("<br />");
		   for (int i = 0; i < st.length; i++) {
				if (st[i].getClassName().indexOf("com.sgepit") > -1) {
					msg.append("at\t");
					msg.append(st[i].getClassName());
					msg.append(".");
					msg.append(st[i].getMethodName());
					msg.append("(");
					msg.append(st[i].getFileName());
					msg.append(":");
					msg.append(st[i].getLineNumber());
					msg.append(")\n");
		    	}
		   }
		   
		   ListOrderedMap map = new ListOrderedMap();
		   map.put("error", true);
		   map.put("errormsg", msg.toString());
		   return map;
	   }
	}
	/**
	 * 删除流程实例时删除业务数据
	 * @param insid
	 * @return
	 */
	public boolean deleteBizIns(String insid) {
//		删除流程时，删除的所有业务数据（数据交互使用）
		String sqlForDataEx = "";
		
		 List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).
				 append(insid).append("'").toString());
         if(!dataInfoList.isEmpty())
         {
             for(int i = 0; i < dataInfoList.size(); i++)
             {
            	 InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
            	 String funname = datInfo.getFunname();
                 String strParams = datInfo.getParamvalues();
                 String params[] = strParams.split("`");
                 //删除业务数据
                 JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
                 String strWhere = "";
                 for(int p = 0; p < params.length; p++)
             	 {
             		String wheres[] = params[p].split(":");//参数形式：字段名:数值:字段类型
             		if(wheres.length==3){//满足格式
             			List colsList = jdbc.queryForList("select t.COLUMN_NAME from user_tab_columns t " +
             					"where t.TABLE_NAME = '"+datInfo.getTablename()+"' and t.COLUMN_NAME = " +
             					"'"+wheres[0].toUpperCase()+"'");
             			if(colsList.size()==0){//表中不包含参数定义的字段
             				continue;
             			}
             			if(wheres[2].equalsIgnoreCase("string"))//字符型
             			{
             				String str = (new StringBuilder("  "+wheres[0]+"='")).append(wheres[1]).append("'  ").toString();
             				strWhere+=strWhere.equals("")?str:(" and "+str);
             			}
             			else if(wheres[2].equalsIgnoreCase("float"))//数值型
             			{
             				String str = (new StringBuilder("  "+wheres[0]+"=")).append(wheres[1]).append("  ").toString();
             				strWhere+=strWhere.equals("")?str:(" and "+str);
             			}
             		}
             	}
                //删除业务数据
                if(!strWhere.equals("")){
                	String sql = "delete from "+datInfo.getTablename()+" where "+strWhere;
					sqlForDataEx += sql + ";";
                	System.out.println(sql);
                	try{
                		jdbc.execute(sql);
                	}catch(Exception ex){
                		ex.printStackTrace();
                		System.out.println("任务为【"+funname+"】的业务数据删除失败！");
                	}
                }
             }
             
             List faceParamsList = flowDAO.findByWhere2(faceParamsInsBean, (new StringBuilder("insid='")).append(insid).append("'").toString());
             if(!faceParamsList.isEmpty())
                 flowDAO.deleteAll(faceParamsList);
             
//             删除业务数据同步到集团		added by Liuay 2012年7月10日 13:43
             this.delBusinessDataExchange(sqlForDataEx, insid);
             
         }
		return true;
	}
	
	/**
	 * 重置流程处理状态
	 * 	使用位置，删除流程时，如果不删除流程业务数据，则设置业务数据的流程状态为新建(0);
	 * 
	 * @param logid			当前处理步骤的id
	 * @param billState		需要设置的流程状态
	 * @param pos			【暂时未用】需要更新的业务数据的位置； 0：全部；1：当前节点和已经处理节点；2：已经处理的节点不包括当前节点；
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-2-14
	 */
	public boolean resetDataBillstate(String logid, String billState, String pos) {
		FlwLog flwlog = (FlwLog) flowDAO.findById(FlwLog.class.getName(), logid);
		FlwInstance ins = flwlog.getFlwInstance();
		List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).append(ins.getInsid()).append("'").toString());
		if(!dataInfoList.isEmpty()) {
			for(int i = 0; i < dataInfoList.size(); i++)
			{
            	InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
                String strParams = datInfo.getParamvalues();
                String params[] = strParams.split("`");
                
                if(datInfo.getTablename()!=null&&!(datInfo.getTablename().equals("")))
                {
                	JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
                	String strWhere = "";
                    for(int p = 0; p < params.length; p++)
                	{
                		String wheres[] = params[p].split(":");//参数形式：字段名:数值:字段类型
                		if(wheres.length==3){//满足格式
                			List colsList = jdbc.queryForList("select t.COLUMN_NAME from user_tab_columns t " +
                					"where t.TABLE_NAME = '"+datInfo.getTablename()+"' and t.COLUMN_NAME = " +
                					"'"+wheres[0].toUpperCase()+"'");
                			if(colsList.size()==0){//表中不包含参数定义的字段
                				continue;
                			}
                			if(wheres[2].equalsIgnoreCase("string"))//字符型
                			{
                				String str = (new StringBuilder("  "+wheres[0]+"='")).append(wheres[1]).append("'  ").toString();
                				strWhere+=strWhere.equals("")?str:(" and "+str);
                			}
                			else if(wheres[2].equalsIgnoreCase("float"))//数值型
                			{
                				String str = (new StringBuilder("  "+wheres[0]+"=")).append(wheres[1]).append("  ").toString();
                				strWhere+=strWhere.equals("")?str:(" and "+str);
                			}
                			else if(wheres[2].equalsIgnoreCase("date"))//日期型
                			{
                				
                			}
                		}
                	}
                    if(!strWhere.equals("")){
                    	try{//更新字段bill_state
                    		String billstate_col = "bill_state";
                    		
                    		//合同付款的流程状态字段是 billstate
                    		if (datInfo.getTablename().equalsIgnoreCase("CON_PAY")) {
								billstate_col = "billstate";
							}
                    		
                    		String sql = "update "+datInfo.getTablename()+" set " + billstate_col + "='" + billState + "' where "+strWhere;
                    		log.info("流程状态更新(含bill_state)："+sql);
                    		jdbc.update(sql);
                    		
                    	}catch(Exception ex){//表datInfo.getTablename()没有bill_state字段,从属性配置表中读取设置
                    		log.info("流程状态更新：：" + ex.getMessage());
                    		List lt = jdbc.queryForList("select t.PROPERTY_NAME from property_code t " +
                					"where upper(property_Code)='"+datInfo.getTablename().toUpperCase()+"' and module_Name='流程字段'");
                    		if(lt.size()>0){
                    			Map map = (Map) lt.get(0);
                    			if(map.get("PROPERTY_NAME")!=null&&!(map.get("PROPERTY_NAME").toString().equals(""))){
                    				try{
                    					String sql = "update "+datInfo.getTablename()+" set "+map.get("PROPERTY_NAME").toString()+"='" + billState + "' where "+strWhere;
                    					log.info("流程状态更新(不含bill_state)："+sql);
        	                    		jdbc.update(sql);
                    				}catch(Exception ex1){
                    					ex1.printStackTrace();
                    					return false;
                    				}
                    			}
                    		} else {
                    			log.error("流程状态更新:: 未找到业务表的流程状态字段");
                    			return false;
                    		}
                    	}
                    }//end if(!strWhere.equals("")) 
                }
            }//end dataInfoList loop
        }
		return true;
	}
	
	/**
	 * 流程处理完毕时处理相关业务数据
	 * @param logid
	 * @return
	 */
	public boolean finishBizData(String logid) {
		if(false){
			Object obj = invokeBizMethod(null, null, null);
			if(obj==null){//业务处理失败,抛出异常
				return false;
			}else{
				return (Boolean)obj;
			}
		}
		
		FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
		List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).
				append(log.getFlwInstance().getInsid()).append("'").toString());
        if(!dataInfoList.isEmpty())
        {
            for(int i = 0; i < dataInfoList.size(); i++)
            {
            	InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
            	String funname = datInfo.getFunname();
                String strParams = datInfo.getParamvalues();
                String params[] = strParams.split("`");
            }
        }
		return true;
	}
	/**
	 * 任务参数默认值获取
	 * @param businessName
	 * @param methodName
	 * @param param1
	 * @param param2
	 * @param param3
	 * @param param4
	 * @param param5
	 * @return
	 */
	public String getTaskParamValue(String businessName, String methodName,
			String param1, String param2, String param3, String param4,
			String param5) {
		Object obj = invokeBizMethod(businessName, methodName, null);
		if(obj==null){//抛出异常
			return "";
		}else{
			return (String)obj;
		}
	}
	/**
	 * 业务处理入口方法，
	 * @param businessName 业务处理类
	 * @param methodName   业务处理方法 
	 * @param paramsMap    参数集
	 * @return
	 */
	private Object invokeBizMethod(String businessName, String methodName,Map paramsMap) {
		Object rtnobj = null;
		try {
			Object businessObj = getWac().getBean(businessName);
			if (businessObj != null) {
				Class partypes[] = new Class[1];
				partypes[0] = Map.class; // 参数集
				Method findMethod = businessObj.getClass().getDeclaredMethod(methodName, partypes);
				rtnobj = (Boolean) findMethod.invoke(businessObj,paramsMap);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return rtnobj;
	}
	
	 /**
	 * 流程结束是：流程中更新的业务数据状态，通过数据交换功能同步数据；
	 * 此种情况只存在:项目单位->集团的数据交互
	 * @param logid	
	 * @param sql	业务数据更新sql
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-14
	 */
	public String businessDataExchange(String logid, String sql) {
		//山西基建项目暂时屏蔽流程数据交互 zhangh 2014-03-24
    	if(true)return "OK";
    	
		if(Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A") && sql!=null && sql.trim().length()>0){
			List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			String txGroup = SnUtil.getNewID("tx-");
			String bizInfo = "流程业务数据状态更新";
			FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
			List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).append(log.getFlwInstance().getInsid()).append("'").toString());
			
			if(!dataInfoList.isEmpty()){
				for(int i = 0; i < dataInfoList.size(); i++){
					InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
					String funname = datInfo.getFunname();
	                String strParams = datInfo.getParamvalues();
	                String params[] = strParams.split("`");
					
	                if(datInfo.getTablename()!=null&&!(datInfo.getTablename().equals(""))){
	                	JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
	                	String strWhere = "";
	                    for(int p = 0; p < params.length; p++){
	                		String wheres[] = params[p].split(":");//参数形式：字段名:数值:字段类型
	                		if(wheres.length==3){//满足格式
	                			List colsList = jdbc.queryForList("select t.COLUMN_NAME from user_tab_columns t " +
	                					"where t.TABLE_NAME = '"+datInfo.getTablename()+"' and t.COLUMN_NAME = " +
	                					"'"+wheres[0].toUpperCase()+"'");
	                			if(colsList.size()==0){//表中不包含参数定义的字段
	                				continue;
	                			}
	                			if(wheres[2].equalsIgnoreCase("string"))//字符型
	                			{
	                				String str = (new StringBuilder("  "+wheres[0]+"='")).append(wheres[1]).append("'  ").toString();
	                				strWhere+=strWhere.equals("")?str:(" and "+str);
	                			}
	                			else if(wheres[2].equalsIgnoreCase("float"))//数值型
	                			{
	                				String str = (new StringBuilder("  "+wheres[0]+"=")).append(wheres[1]).append("  ").toString();
	                				strWhere+=strWhere.equals("")?str:(" and "+str);
	                			}
	                			else if(wheres[2].equalsIgnoreCase("date"))//日期型
	                			{
	                				
	                			}
	                		}
	                	}
//	                    TODO:找到处理的业务数据，然后进行数据交换，包括动态数据；
	                    String sql1 = "update "+datInfo.getTablename()+" set bill_state='1' where "+strWhere;
	                    jdbc.update(sql1);
	                }
					
					
//        		TODO:判断哪些业务操作需要进行这样的业务处理，然后把改变状态的内容进行数据交换
					if (funname.equals("合同新增") || funname.equals("合同会签录入")
	        				|| funname.equals("付款申请")|| funname.equals("付款批准")|| funname.equals("付款实际")
	        				|| funname.equals("合同变更")
	        				|| funname.equals("合同分摊")
	        				|| funname.equals("合同变更分摊")) {
						
						PcDataExchange dataExchange = new PcDataExchange();
        	        	dataExchange.setSqlData(sql);
        	        	dataExchange.setTxGroup(txGroup);
        	        	dataExchange.setBizInfo(bizInfo);
        	        	dataExchange.setPid(Constant.DefaultOrgRootID);
        	        	sendDataList.add(dataExchange);
					}
					
					dataExchangeService.addExchangeListToQueue(sendDataList);
				}
			}
		}
		return "OK";
	}
	
	/**
	 * 删除流程时，通过数据交换功能实现集团的业务数据删除；
	 * 此种情况只存在:项目单位->集团的数据交互
	 * TODO:动态数据信息未删除
	 * @param sql	业务数据更新sql
	 * @param insid	流程实例ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-14
	 */
	private String delBusinessDataExchange(String sql, String insid) {
		//山西基建项目暂时屏蔽流程数据交互 zhangh 2014-03-24
    	if(true)return "OK";
    	
		if(Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A") && sql!=null && sql.length()>0){
			String [] sqlArr = sql.split(";");
			boolean dataExFlag = false;
			String tableName = "";
			List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).
					 append(insid).append("'").toString());
	        if(!dataInfoList.isEmpty()) {
	        	for(int i = 0; i < dataInfoList.size(); i++) {
	        		InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
	        		String funname = datInfo.getFunname();
	        		tableName = datInfo.getTablename();
	        		if (funname.equals("合同新增") || funname.equals("合同会签录入")
	        				|| funname.equals("付款申请")|| funname.equals("付款批准")|| funname.equals("付款实际")
	        				|| funname.equals("合同变更")
	        				|| funname.equals("合同分摊")
	        				|| funname.equals("合同变更分摊")) {
	        			dataExFlag = true;
					} else {
						dataExFlag = false ;
						break;
					}
	        	}
	        }
	             	
			if (dataExFlag) {
				List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
				PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				
				String txGroup = SnUtil.getNewID("tx-");
				String bizInfo = "流程业务数据删除";
				
				for (int i = 0; i < sqlArr.length; i++) {
					String sqlTemp = sqlArr[i];
					if (sqlTemp.trim().length()>0) {
						PcDataExchange dataExchange = new PcDataExchange();
						dataExchange.setSqlData(sqlTemp);
						dataExchange.setTxGroup(txGroup);
						dataExchange.setBizInfo(bizInfo);
						dataExchange.setPid(Constant.DefaultOrgRootID);
						dataExchange.setTableName(tableName);
						dataExchange.setXh(dataExchangeService.getNewExchangeXh(Constant.DefaultOrgRootID));
						dataExchange.setSuccessFlag("0");
						sendDataList.add(dataExchange);
					}
				}
				
				String rtn = dataExchangeService.addExchangeListToQueue(sendDataList);
				if (rtn.equals("0")) {
					return "Error";
				}
			}
		}
		
		return "OK";
	}
	
	
	/**
	 * 向流程综合查询数据模板写入数据
	 * @param wb 工作簿
	 * @param orderBy 排序
	 * @param map1 查询条件
	 * @return Excel输出流
	 * @author pengy 2015-01-14
	 */
	public ByteArrayOutputStream fillDataToTaskViewExcel(Workbook wb, String orderBy, HashMap<String, String> map1) throws DbPropertyException, SQLException, IOException, ExcelPortException{
		if(wb!=null) {
			HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>();//样式map，存放各种样式
			Sheet sheet = wb.getSheetAt(0);
			//获取一个maxSize的最大值，即taskView的总数
			List<BigDecimal> size = this.flowDAO.getDataAutoCloseSes("SELECT COUNT(*) FROM TASK_VIEW"); 
			//获取流程综合查询的数据
			List taskViews = flwFrameMgm.getFlwInsBySearchRoles(orderBy, 0, size.get(0).intValue(), map1);
			if(taskViews != null && taskViews.size()>1) {
				int rownum = 3;
				for(int j=0; j<taskViews.size()-1; j++) {
					TaskView taskView = (TaskView) taskViews.get(j);
					Row hssfRow = sheet.getRow(rownum);
					if(hssfRow==null) {
						hssfRow = sheet.createRow(rownum);
					}
					for(int k=2; k<7; k++) {
						Cell hssfCell = hssfRow.getCell(k);
						if(hssfCell==null) {
							hssfCell = hssfRow.createCell(k);
						}
						Short dataFormat = null;
						String value = "";
						if (k==2){
							value = (rownum - 2) + "" ;
						} else if (k==3){
							value = taskView.getTitle();
						} else if (k==4){
							SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
							value = sdf.format(taskView.getFtime()); 
						} else if (k==5){
							value = taskView.getFromname();
						} else if (k==6){
							value = "2".equals(taskView.getStatus()) ? "处理完毕！" : "处理中...";
						}
						dataFormat = setCellValue(hssfCell, "varchar", value);
						Map<String,String> ctstyleMap = new HashMap<String, String>();
						if(dataFormat!=null) {
							ctstyleMap.put("dataFormat", dataFormat+"");
						}
						//设置单元格样式
						hssfCell.setCellStyle(XMLToExcel.getConfigStyle(wb,stylesMap,ctstyleMap));
					}
					rownum ++;
				}
			}
			
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			wb.write(bos);
			bos.flush();
			bos.close();
			return bos;
		}else{
			throw new ExcelPortException("模板文件读取异常！");
		}
	}
	
	/**
	 * 根据单元格类型给单元格赋值
	 * 目前仅处理了以下几种类型：boolean，calendar，date，number。其他都以文本型处理
	 * @param hfcell poi的HSSFCell对象
	 * @param cellType 单元格类型
	 * @param cellValue 单元格值
	 */
	private static Short setCellValue(Cell hfcell, String cellType, Object cellValue) {
		if(cellValue==null){
			return null;
		}
		Short dataFormat = null ; 
		String cell = cellType.trim() ;
		if(cell.equalsIgnoreCase("timestamp")){
			java.sql.Timestamp val = (Timestamp) cellValue ;
			hfcell.setCellValue(val) ;
			dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy h:mm") ;
		} else if(cell.equalsIgnoreCase("date")){
			java.sql.Date val = (java.sql.Date) cellValue ;
			Date value = new Date(val.getTime());
			hfcell.setCellValue(value) ;
			
			DateFormat format = new SimpleDateFormat("yyyy-MM-dd");   
			format.format(value) ;
			dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy") ;
		} else if(cell.equalsIgnoreCase("number")){
			if(cellValue instanceof Integer) {
				hfcell.setCellValue((Integer)cellValue) ;
			}else if(cellValue instanceof BigDecimal) {
				hfcell.setCellValue(((BigDecimal)cellValue).doubleValue()) ;
			}
		} else {
			RichTextString value = new HSSFRichTextString(com.sgepit.helps.util.StringUtil.objectToString(cellValue)) ;
			hfcell.setCellValue(value) ;
		}
		return dataFormat;
	}
}
