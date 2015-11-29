package com.sgepit.pcmis.warn.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessResourceFailureException;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.warn.dao.PCWarnDAO;
import com.sgepit.pcmis.warn.hbm.MapKey;
import com.sgepit.pcmis.warn.hbm.PcWarnDowithInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRangeInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRoleInfo;
import com.sgepit.pcmis.warn.hbm.PcWarnRuleDutyperson;
import com.sgepit.pcmis.warn.hbm.PcWarnRules;
import com.sgepit.pcmis.warn.hbm.PcWarnSearchInfo;
import com.sgepit.pcmis.warn.hbm.UserBean;

public class PCWarnServiceImpl extends BaseMgmImpl implements PCWarnService {
private BaseDAO baseDAO;
private PCWarnDAO pcWarnDAO;

	public BaseDAO getBaseDAO() {
	return (BaseDAO)com.sgepit.frame.base.Constant.wact.getBean("baseDAO");
}

public PCWarnDAO getPcWarnDAO() {
		return (PCWarnDAO)com.sgepit.frame.base.Constant.wact.getBean("pcWarnDAO");
	}

public void setBaseDAO(BaseDAO baseDAO) {
	this.baseDAO = baseDAO;
}

public void setPcWarnDAO(PCWarnDAO pcWarnDAO) {
	this.pcWarnDAO = pcWarnDAO;
}
public static PCWarnServiceImpl getFromApplicationContext(ApplicationContext ctx) {
	return (PCWarnServiceImpl) ctx.getBean("PcWarnService");
}
	public List buildTree(String treeName, String parentId, Map params) {
		//此处如果需要多次构建树,则通过treeName来区分做判断,暂时不考虑做多次构建树
		List listNode =new ArrayList();
		if("buildUnitTree".equals(treeName)){
			List list =baseDAO.findByWhere(SgccIniUnit.class.getName(), "upunit='"+parentId+"' and unitTypeId in('0','1','2','3','4','5','A')");
			for(int i=0;i<list.size();i++){
				SgccIniUnit sg =(SgccIniUnit)list.get(i);
				TreeNode treeNode = new TreeNode();
				treeNode.setId(sg.getUnitid());
				treeNode.setText(sg.getUnitname());
				List list1 =baseDAO.findByWhere(SgccIniUnit.class.getName(), "upunit='"+sg.getUnitid()+"' and unitTypeId in('0','1','2','3','4','5','A')");
				 if(list1.size()>0){
					 treeNode.setCls("icon-cmp");
					 treeNode.setLeaf(false);
				 }else {
					 treeNode.setCls("cls");
					 treeNode.setLeaf(true);
				 }
				 listNode.add(treeNode);
			}
			
		}else  if("ModuleTree".equals(treeName)){
			String []values=(String[]) params.get("leaf"); 
			List list =baseDAO.findByWhere("com.sgepit.frame.sysman.hbm.RockPower", " parentid='"+parentId+"' and leaf="+Integer.parseInt(values[0]));
			for(int i=0;i<list.size();i++){
				RockPower rockPower = (RockPower)list.get(i);
				TreeNode  treeNode = new TreeNode();
				treeNode.setId(rockPower.getPowerpk());
				treeNode.setText(rockPower.getPowername());
				treeNode.setDescription("");
				treeNode.setCls("cls");
				treeNode.setLeaf(true);
				listNode.add(treeNode);
			}
		}
		 return listNode;
	}

	public String savePCRules(PcWarnRules warnRules) {
		//对前台填写的数据进行sql校验
		String sourceSql = buildSourceSql(warnRules);
		//以上为验证源数据项的Sql语句
		String comSql =buildComSql(warnRules, null);
		try{
			
			JdbcUtil.execute(sourceSql.toString());
			
		}catch (Exception e) {
			System.out.println("源数据查询异常");
			return "1";//源数据查询异常
		}
		if(!"null".equals(warnRules.getComdatatable())){
			try{
				
				JdbcUtil.execute(comSql.toString());
			}catch (Exception e) {
				System.out.println("比较数据查询异常");
				return "2";//比较数据查询异常
			}		
		}
		baseDAO.saveOrUpdate(warnRules);
		return "3";
	}
	public String updatePCRules(PcWarnRules warnRules) {
		//对前台填写的数据进行sql校验
		String sourceSql = buildSourceSql(warnRules);
		//以上为验证源数据项的Sql语句
		String comSql = buildComSql(warnRules,null);
		try{
			JdbcUtil.execute(sourceSql.toString());
			
		}catch (Exception e) {
			System.out.println("源数据查询异常");
			return "1";//源数据查询异常
		}
		if(!"null".equals(warnRules.getComdatatable())){
			try{
				JdbcUtil.execute(comSql.toString());
			}catch (Exception e) {
				System.out.println("比较数据查询异常");
				return "2";//比较数据查询异常
			}		
		}
		baseDAO.saveOrUpdate(warnRules);
		return "3";
	}
	public String deletePCRulesById(String uids){
		String str = "";
	    PcWarnRules  pcWarnRules=(PcWarnRules)baseDAO.findByCompId(PcWarnRules.class.getName(),uids);
	    if(pcWarnRules!=null){
	    	baseDAO.delete(pcWarnRules);
	    	str = "1";
	    List list =	baseDAO.findByProperty(PcWarnRoleInfo.class.getName(), "warnrulesid", uids);
	    baseDAO.deleteAll(list);
	    }
		return str;
	}

	public String deletePcWarnrole(PcWarnRoleInfo pcWarnRoleInfo) {
		    baseDAO.delete(pcWarnRoleInfo);
		return "";
	}

	public String insertPcWarnrole(PcWarnRoleInfo pcWarnRoleInfo) {
		if(pcWarnRoleInfo.getWarnrulesid()!=null&&!"".equals(pcWarnRoleInfo.getWarnrulesid())){
			    	baseDAO.insert(pcWarnRoleInfo);
		}
		return "";
	}

	public String updatePcWarnrole(PcWarnRoleInfo pcWarnRoleInfo) {
		    	baseDAO.saveOrUpdate(pcWarnRoleInfo);
		return "";
	}
	/**
	 * 生出安全预警信息
	 * 生成安全信息时 首先需要获取所有的项目单位PID 然后根据各个项目单位
	 * PID 对个项目单位PID进行事务预警处理
	 */
	@SuppressWarnings("unchecked")
	public void gengralWarnInfo(){
	
	// 1 获取所有已定义的预警规则
		Session session = baseDAO.getSessionFactory().openSession();
		session.beginTransaction();
//	List list = baseDAO.findByWhere(PcWarnRules.class.getName(), "1=1");
	List list = session.createQuery("select p  from PcWarnRules p").list();
	for(int i=0;i<list.size();i++){
		PcWarnRules  warnRule = (PcWarnRules) list.get(i);
		String warnRuleUids = warnRule.getUids();
		//获得预警规则匹配的预警范围，确定针对那些项目单位生成预警信息
		List rangeInfoList = 
			session.createQuery("select s from PcWarnRangeInfo s where s.warnrulesid='" + warnRuleUids +"'" ).list();
		for(int k =0 ;k<rangeInfoList.size();k++){
			PcWarnRangeInfo  warnRangeInfo = (PcWarnRangeInfo)rangeInfoList.get(k);
			String pid = warnRangeInfo.getProjectid();
			String sourceSql =buildSourceSql(warnRule);
			if(sourceSql.contains("where")){
				sourceSql +="  and pid='"+warnRangeInfo.getProjectid()+"'";
			}else {
				sourceSql+= " where pid='"+warnRangeInfo.getProjectid()+"'";
			}
			List sourceResults = session.createSQLQuery(sourceSql).list();
			//如果选择其他配置项 则表示可能有多条记录结果
			for(int m=0;m<sourceResults.size();m++){
				if("other".equals(warnRule.getScalculatemode())){
					otherDoWidth(warnRule, pid, sourceResults, m);
				}else {
					notOtherDoWidth(warnRule, pid, sourceResults, m);
				}
			}
		}
	 }
	session.close();
	List upList = baseDAO.findByWhere(PcWarnInfo.class.getName(), "1=1");
		for(int j=0;j<upList.size();j++){
			PcWarnInfo pcWarnInfo = (PcWarnInfo)upList.get(j);
			if(pcWarnInfo.getDutypersoninfo()==null||"".equals(pcWarnInfo.getDutypersoninfo())){
				String res =getDutyPersonAndUnitIdAndUnitName(pcWarnInfo.getUids());
				if(res!=null){
					pcWarnInfo.setDutypersoninfo(res);
				}
				baseDAO.saveOrUpdate(pcWarnInfo);
			}
		}
	}
	
	/**
	 * 
	 * @param pcWarnRules 预警规则
	 * @param sgccIniUnit 项目单位bean
	 * @param sourceResults 结果集合
	 * @param m 根据m取得结果集合中某条bean 
	 */
	private void otherDoWidth(PcWarnRules pcWarnRules, String pid, List sourceResults, int m) 
	{
		Session sess = baseDAO.getSessionFactory().openSession();
		sess.beginTransaction();
		Object [] objs =(Object[]) sourceResults.get(m);
		java.math.BigDecimal sourceNum =(java.math.BigDecimal)objs[0];
		String relate="";
		String businessData="";
		boolean reaFlag= false;
		//如果有关联字段则关联字段的值也需要查出 及关联业务的主键值
		if(pcWarnRules.getSourcerelateitem()!=null&&!"".equals(pcWarnRules.getSourcerelateitem())){
			relate =(String)objs[1];
			businessData =(String)objs[2];
		}else {
			businessData =(String)objs[1];
			reaFlag= true;
		}
		String comSql = buildComSql(pcWarnRules,relate);
		java.math.BigDecimal comNum = null;
		if(comSql.contains("where")){
			comSql+="  and pid='"+ pid +"'";
		}else {
			comSql+= " where pid='"+ pid +"'";
		}
		double results =0d;
		boolean resultFlag = false;
		if("null".equals(pcWarnRules.getComdatatable())){
			comNum = new java.math.BigDecimal(0d);
		}else {
		 List comNumList = sess.createSQLQuery(comSql).list();
		 for(int n=0;n<comNumList.size();n++){
			 comNum =(java.math.BigDecimal)comNumList.get(n);
		 }
		}
		
		if("-".equals(pcWarnRules.getCalculatetype())){
			BigDecimal  bd =sourceNum.subtract(comNum);
			if(bd.doubleValue()<0){
				results=0;
			}else {
				results =bd.doubleValue();
			}
			resultFlag =true;
		}else if("/".equals(pcWarnRules.getCalculatetype())){
			if(comNum.doubleValue()==0){
			}else {
				resultFlag =true;
				BigDecimal  bd =sourceNum.subtract(comNum);
				if(bd.doubleValue()<0){
					results=0;
				}else {
					results =bd.divide(comNum,3,BigDecimal.ROUND_HALF_UP).doubleValue();
				}
			}
		}else if("%".equals(pcWarnRules.getCalculatetype())){
			
			if(comNum.doubleValue()==0)
			{
				//do nothing
			}
			else 
			{
				resultFlag =true;
				if(sourceNum.doubleValue()<0){
					results=0;
				}else {
					results =sourceNum.divide(comNum,3,BigDecimal.ROUND_HALF_UP).doubleValue();
				}
			}
		}
		
		List listPcRange=sess.createQuery("select p from PcWarnRangeInfo p where p.warnrulesid='"+pcWarnRules.getUids()+"' and p.projectid='"+ pid +"'").list();
		PcWarnRangeInfo pcWarnRangeInfo = null;
		for(int a=0;a<listPcRange.size();a++){
			pcWarnRangeInfo = (PcWarnRangeInfo)listPcRange.get(a);
			break;
		}
		
		//判断源数据是视图还是表
		String sourceType = this.getObjType(pcWarnRules.getSourcedatatable());
		String businessKey = null;
		if(sourceType.equals("VIEW"))
		{
			businessKey = "";
		}
		else
		{
			String sql = "select  a.column_name from user_cons_columns a, user_constraints b where a.constraint_name = b.constraint_name"
				+" and a.table_name = '"+pcWarnRules.getSourcedatatable()+"'"
				+" and b.constraint_type = 'P'";
			
			List listkey= sess.createSQLQuery(sql).list();
			if(listkey.isEmpty()){
				businessKey="UIDS";
			}else {
				 businessKey =(String)listkey.get(0);
			}
		}

		if(pcWarnRangeInfo==null){
			  otherInserPcWarnInfoF(pcWarnRules, pid, objs, businessData,
					reaFlag, results, resultFlag, businessKey);
		}else {
			otherInsertPcWarnInfoS(pcWarnRules, pid, objs,
					businessData, reaFlag, results, resultFlag,
					pcWarnRangeInfo, businessKey);
			
		}
		sess.getTransaction().commit();
		sess.close();
	}

	private void otherInsertPcWarnInfoS(PcWarnRules pcWarnRules, String pid, 
										Object[] objs, String businessData,boolean reaFlag, double results, 
										boolean resultFlag, PcWarnRangeInfo pcWarnRangeInfo, String businessKey) 
	{
		if(resultFlag==true&&(results>pcWarnRangeInfo.getRangemax()||results<pcWarnRangeInfo.getRangemin())){
			//此处定义发生异常处 需要往预警信息表中存入数据
			PcWarnInfo  pcWarnInfo = new PcWarnInfo();
			pcWarnInfo.setDetailinfo("详细信息关联到<br>具体业务数据");//关联到具体业务处
			pcWarnInfo.setPid(pid);//对某个具体的项目单位预警
			pcWarnInfo.setModuleid(pcWarnRules.getMid());//关联功能模块
			pcWarnInfo.setWarncompletion("");//完成情况描述
			String content = pcWarnRules.getWarnhelp();
			content=content.replace("{minValue}", pcWarnRangeInfo.getRangemin().toString());
			content=content.replace("{maxValue}", pcWarnRangeInfo.getRangemax().toString());
			content=content.replace("{resValue}", String.valueOf(results));
			  List dualList =calString(pcWarnRules.getWarnhelp());
			  for(int c=0;c<dualList.size();c++){
				  MapKey mpKey=(MapKey)dualList.get(c);
				  if("VARCHAR2".equals(mpKey.getV())){
					 content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", reaFlag ? (String)objs[1+c]:(String)objs[2+c]);
				  }else if("NUMBER".equals(mpKey.getV())){
					  content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", reaFlag ? ((java.math.BigDecimal)objs[1+c]).toString() : ((java.math.BigDecimal)objs[2+c]).toString());  
				  }else if("DATE".equals(mpKey.getV())){
					  content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.sql.Date)objs[1+c]:(java.sql.Date)objs[2+c])==null?"":(reaFlag?(java.sql.Date)objs[1+c]:(java.sql.Date)objs[2+c]).toString()); 
				  }
			  }
			pcWarnInfo.setWarncontent(content);//预警信息描述
			pcWarnInfo.setWarnlevel(pcWarnRules.getWarnlevel());//预警级别
			pcWarnInfo.setWarnstatus("1");//预警状态 1 未开始 2 处理中 3 已完成
			pcWarnInfo.setWarntime(new Date());
			pcWarnInfo.setResultdata(results);//验证结果
			pcWarnInfo.setWarnrulesid(pcWarnRules.getUids());//规则表ID
			pcWarnInfo.setBusinessdata(businessData);
			pcWarnInfo.setBusinesskey(businessKey);
			List listPwarn = baseDAO.findByWhere(PcWarnInfo.class.getName(), 
							" moduleid='"+pcWarnRules.getModuleid()+"' and pid ='"+ pid +
							"' and businessdata='"+businessData+"' and businesskey ='"+businessKey+"'");
			boolean sameFlag = false;
			boolean noStartFlag =false;
			boolean endFlag = false;
			PcWarnInfo p = null;
			if(listPwarn.isEmpty()){
				endFlag = true;
			}
			for(int q=0;q<listPwarn.size();q++){
				p =(PcWarnInfo)listPwarn.get(q);
				if(p.getResultdata()==results){
					sameFlag = true;
					break;
				}else if(p.getResultdata()!=results){
					if("1".equals(p.getWarnstatus())||"2".equals(p.getWarnstatus())){
						noStartFlag = true;
					}else if("3".equals(p.getWarnstatus())){
						endFlag = true;
					}	 	
				}
			} 
			if(!sameFlag&&noStartFlag){
				p.setResultdata(results);
				StringBuffer constr = new StringBuffer(p.getWarncontent());
				constr.append(",【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				String cont =constr.toString();
				  for(int c=0;c<dualList.size();c++){
					  MapKey mpKey=(MapKey)dualList.get(c);
					  if("VARCHAR2".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", reaFlag?(String)objs[2+c]:(String)objs[3+c]);
					  }else if("NUMBER".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[3+c])==null?"0":(reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[3+c]).toBigInteger().toString()); 
					  }else if("DATE".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c])==null?"":(reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c]).toString()); 
					  }
				  }
				p.setWarncontent(cont);
				baseDAO.saveOrUpdate(p);
			}else if(!sameFlag&&endFlag){
				StringBuffer constr = new StringBuffer(pcWarnInfo.getWarncontent());
				constr.append("【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				pcWarnInfo.setWarncontent(constr.toString());
				baseDAO.insert(pcWarnInfo);
			}
		}
	}

	private void otherInserPcWarnInfoF(PcWarnRules pcWarnRules,String pid, Object[] objs, String businessData,
			boolean reaFlag, double results, boolean resultFlag, String businessKey) 
	{
		if(resultFlag==true&&(results>pcWarnRules.getRangemax()||results<pcWarnRules.getRangemin())){
		  //此处定义发生异常处 需要往预警信息表中存入数据
		  PcWarnInfo  pcWarnInfo = new PcWarnInfo();
		  pcWarnInfo.setDetailinfo("详细信息关联到<br>具体业务数据");//关联到具体业务处
		  pcWarnInfo.setPid(pid);//对某个具体的项目单位预警
		  pcWarnInfo.setModuleid(pcWarnRules.getMid());//关联功能模块
		  pcWarnInfo.setWarncompletion("");//完成情况描述
		  String content = pcWarnRules.getWarnhelp();
		  content=content.replace("{minValue}", pcWarnRules.getRangemin().toString());
		  content=content.replace("{maxValue}", pcWarnRules.getRangemax().toString());
		  content=content.replace("{resValue}", String.valueOf(results));
		  List dualList =calString(pcWarnRules.getWarnhelp());
		  for(int c=0;c<dualList.size();c++){
			  MapKey mpKey=(MapKey)dualList.get(c);
			  if("VARCHAR2".equals(mpKey.getV().replaceAll(" ", ""))){
				 content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", reaFlag?(String)objs[1+c]:(String)objs[2+c]);
			  }else if("NUMBER".equals(mpKey.getV().replaceAll(" ", ""))){
				  content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[2+c])==null?"0":(reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[2+c]).toBigInteger().toString()); 
			  }else if("DATE".equals(mpKey.getV().replaceAll(" ", ""))){
				  content=content.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c])==null?"":(reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c]).toString()); 
			  }
		  }
		  pcWarnInfo.setWarncontent(content);//预警信息描述
		  pcWarnInfo.setWarnlevel(pcWarnRules.getWarnlevel());//预警级别
		  pcWarnInfo.setWarnstatus("1");//预警状态 1 未开始 2 处理中 3 已完成
		  pcWarnInfo.setWarntime(new Date());
		  pcWarnInfo.setResultdata(results);//验证结果
		  pcWarnInfo.setWarnrulesid(pcWarnRules.getUids());//规则表ID
		  pcWarnInfo.setBusinesskey(businessKey);
		  pcWarnInfo.setBusinessdata(businessData);
		  List listPwarn = baseDAO.findByWhere(PcWarnInfo.class.getName(), 
				  					" moduleid='"+pcWarnRules.getModuleid()+"' and pid ='"+ pid +
				  					"' and businessdata='"+businessData+"' and businesskey ='"+businessKey+"'");
		  boolean sameFlag = false;
		  boolean noStartFlag =false;
		  boolean endFlag = false;
		  PcWarnInfo p = null;
		  if(listPwarn.isEmpty()){
			  endFlag = true;
		  }
		  for(int q=0;q<listPwarn.size();q++){
			  p =(PcWarnInfo)listPwarn.get(q);
			 if(p.getResultdata()==results){
				 sameFlag = true;
				 break;
			 }else if(p.getResultdata()!=results){
			     if("1".equals(p.getWarnstatus())||"2".equals(p.getWarnstatus())){
			    	 noStartFlag = true;
			     }else if("3".equals(p.getWarnstatus())){
			    	 endFlag = true;
			     }	 	
			 }
		  } 
		     if(!sameFlag&&noStartFlag){
		    	 p.setResultdata(results);
		    	 StringBuffer constr = new StringBuffer(p.getWarncontent());
		    	 constr.append(",【");
		    	 SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
		    	 String time = sdf.format(new Date());
		    	 constr.append(time+" 检查结果:");
		    	 constr.append(results);
		    	 constr.append("】");
		    	 String cont = constr.toString();
		    	  for(int c=0;c<dualList.size();c++){
					  MapKey mpKey=(MapKey)dualList.get(c);
					  if("VARCHAR2".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", reaFlag?(String)objs[2+c]:(String)objs[3+c]);
					  }else if("NUMBER".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[3+c])==null?"0":(reaFlag?(java.math.BigDecimal)objs[2+c]:(java.math.BigDecimal)objs[3+c]).toBigInteger().toString()); 
					  }else if("DATE".equals(mpKey.getV())){
						  cont=cont.replace("["+mpKey.getK()+","+mpKey.getV()+"]", (reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c])==null?"":(reaFlag?(java.sql.Date)objs[2+c]:(java.sql.Date)objs[3+c]).toString()); 
					  }
				  }
		    	 p.setWarncontent(cont);
		    	 baseDAO.saveOrUpdate(p);
		     }else if(!sameFlag&&endFlag){
		    	 StringBuffer constr = new StringBuffer(pcWarnInfo.getWarncontent());
		    	 constr.append("【");
		    	 SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
		    	 String time = sdf.format(new Date());
		    	 constr.append(time+" 检查结果:");
		    	 constr.append(results);
		    	 constr.append("】");
		    	 pcWarnInfo.setWarncontent(constr.toString());
		    	 baseDAO.insert(pcWarnInfo);
		     }
  }
	}

	private void notOtherDoWidth(PcWarnRules pcWarnRules, String pid, List sourceResults, int m) {
		Session   s =baseDAO.getSessionFactory().openSession();
		s.beginTransaction();
		java.math.BigDecimal sourceNum= new BigDecimal(0d);
			 sourceNum =(java.math.BigDecimal)sourceResults.get(m);
		String comSql = buildComSql(pcWarnRules,null);
		java.math.BigDecimal comNum = null;
		if(comSql.contains("where")){
			comSql+="  and pid='"+ pid +"'";
		}else {
			comSql+= " where pid='"+ pid +"'";
		}
		double results =0d;
		boolean resultFlag =false;
		if("null".equals(pcWarnRules.getComdatatable())){
			comNum = new java.math.BigDecimal(0d);
		}else {
			List comNumList = s.createSQLQuery(comSql).list();
			for(int n=0;n<comNumList.size();n++){
				comNum =(java.math.BigDecimal)comNumList.get(n);
			}
		}
		if("-".equals(pcWarnRules.getCalculatetype())){
			BigDecimal bd =sourceNum.subtract(comNum);
			if(bd.doubleValue()<0){
				results=0;
			}else {
				results = sourceNum.subtract(comNum).doubleValue();
			}
			resultFlag =true;
		}else if("/".equals(pcWarnRules.getCalculatetype())){
			if(comNum.doubleValue()==0){
			}else {
				resultFlag =true;
				BigDecimal bd = sourceNum.subtract(comNum);
				if(bd.doubleValue()<0){
					results=0;
				}else {
					results =bd.divide(comNum,3,BigDecimal.ROUND_HALF_UP).doubleValue();
				}
			}
		}else {
			if(comNum.doubleValue()==0){
			}else {
				resultFlag =true;
				if(sourceNum.doubleValue()<0){
					results=0;
				}else {
					results =sourceNum.divide(comNum,3,BigDecimal.ROUND_HALF_UP).doubleValue();
				}
			}
		}
//		List listPcRange=baseDAO.findByWhere(PcWarnRangeInfo.class.getName(), " warnrulesid='"+pcWarnRules.getUids()+"' and projectid='"+sgccIniUnit.getUnitid()+"'");
		List listPcRange=s.createQuery("select p from PcWarnRangeInfo p where p.warnrulesid='"+pcWarnRules.getUids()+"' and p.projectid='"+ pid +"'").list();
		PcWarnRangeInfo pcWarnRangeInfo =null;
		for(int a=0;a<listPcRange.size();a++){
			pcWarnRangeInfo = (PcWarnRangeInfo)listPcRange.get(a);
			break;
		}
		
		String sql = "select  a.column_name from user_cons_columns a, user_constraints b where a.constraint_name = b.constraint_name"
			+" and a.table_name = '"+pcWarnRules.getSourcedatatable()+"'"
			+" and b.constraint_type = 'P'";
		List listkey= s.createSQLQuery(sql).list();
		String businessKey =(String)listkey.get(0);
		if(pcWarnRangeInfo == null){
			notOtherInsertPcWarnInfoF(pcWarnRules, pid, results,
					resultFlag);
		}else {
			notOtherInsertPcWarnInfoS(pcWarnRules, pid, results,
					resultFlag, pcWarnRangeInfo);
			
		}
		s.getTransaction().commit();
		s.close();
	}

	private void notOtherInsertPcWarnInfoS(PcWarnRules pcWarnRules,String pid, double results, 
											boolean resultFlag,PcWarnRangeInfo pcWarnRangeInfo) 
	{
		if(resultFlag==true&&(results>pcWarnRangeInfo.getRangemax()||results<pcWarnRangeInfo.getRangemin())){
			//此处定义发生异常处 需要往预警信息表中存入数据
			PcWarnInfo  pcWarnInfo = new PcWarnInfo();
			pcWarnInfo.setDetailinfo("详细信息关联到<br>具体业务数据");//关联到具体业务处
			pcWarnInfo.setPid(pid);//对某个具体的项目单位预警
			pcWarnInfo.setModuleid(pcWarnRules.getMid());//关联功能模块
			pcWarnInfo.setWarncompletion("");//完成情况描述
			String content = pcWarnRules.getWarnhelp();
			content=content.replace("{minValue}", pcWarnRangeInfo.getRangemin().toString());
			content=content.replace("{maxValue}", pcWarnRangeInfo.getRangemax().toString());
			content=content.replace("{resValue}", String.valueOf(results));
			pcWarnInfo.setWarncontent(content);//预警信息描述
			pcWarnInfo.setWarnlevel(pcWarnRules.getWarnlevel());//预警级别
			pcWarnInfo.setWarnstatus("1");//预警状态 1 未开始 2 处理中 3 已完成
			pcWarnInfo.setWarntime(new Date());
			pcWarnInfo.setResultdata(results);//验证结果
			pcWarnInfo.setWarnrulesid(pcWarnRules.getUids());//规则表ID
			List listPwarn = baseDAO.findByWhere(PcWarnInfo.class.getName(), 
												" moduleid='"+pcWarnRules.getModuleid()+"' and pid ='"+ pid +"'");
			boolean sameFlag = false;
			boolean noStartFlag =false;
			boolean endFlag = false;
			PcWarnInfo p = null;
			if(listPwarn.isEmpty()){
				endFlag = true;
			}
			for(int q=0;q<listPwarn.size();q++){
				p =(PcWarnInfo)listPwarn.get(q);
				if(p.getResultdata()==results){
					sameFlag = true;
					break;
				}else if(p.getResultdata()!=results){
					if("1".equals(p.getWarnstatus())||"2".equals(p.getWarnstatus())){
						noStartFlag = true;
					}else if("3".equals(p.getWarnstatus())){
						endFlag = true;
					}	 	
				}
			} 
			if(!sameFlag&&noStartFlag){
				p.setResultdata(results);
				StringBuffer constr = new StringBuffer(p.getWarncontent());
				constr.append(",【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				p.setWarncontent(constr.toString());
				baseDAO.saveOrUpdate(p);
			}else if(!sameFlag&&endFlag){
				StringBuffer constr = new StringBuffer(pcWarnInfo.getWarncontent());
				constr.append("【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				pcWarnInfo.setWarncontent(constr.toString());
				baseDAO.insert(pcWarnInfo);
			}
		}
	}

	private void notOtherInsertPcWarnInfoF(PcWarnRules pcWarnRules, String pid, double results, boolean resultFlag) 
	{
		if(resultFlag==true&&(results>pcWarnRules.getRangemax()||results<pcWarnRules.getRangemin())){
			//此处定义发生异常处 需要往预警信息表中存入数据
			PcWarnInfo  pcWarnInfo = new PcWarnInfo();
			pcWarnInfo.setDetailinfo("详细信息关联到<br>具体业务数据");//关联到具体业务处
			pcWarnInfo.setPid(pid);//对某个具体的项目单位预警
			pcWarnInfo.setModuleid(pcWarnRules.getMid());//关联功能模块
			pcWarnInfo.setWarncompletion("");//完成情况描述
			String content = pcWarnRules.getWarnhelp();
			content=content.replace("{minValue}", pcWarnRules.getRangemin().toString());
			content=content.replace("{maxValue}", pcWarnRules.getRangemax().toString());
			content=content.replace("{resValue}", String.valueOf(results));
			pcWarnInfo.setWarncontent(content);//预警信息描述
			pcWarnInfo.setWarnlevel(pcWarnRules.getWarnlevel());//预警级别
			pcWarnInfo.setWarnstatus("1");//预警状态 1 未开始 2 处理中 3 已完成
			pcWarnInfo.setWarntime(new Date());
			pcWarnInfo.setResultdata(results);//验证结果
			pcWarnInfo.setWarnrulesid(pcWarnRules.getUids());//规则表ID
			List listPwarn = baseDAO.findByWhere(PcWarnInfo.class.getName(), 
												" moduleid='"+pcWarnRules.getModuleid()+"' and pid ='"+ pid +"'");
			boolean sameFlag = false;
			boolean noStartFlag =false;
			boolean endFlag = false;
			PcWarnInfo p = null;
			if(listPwarn.isEmpty()){
				endFlag = true;
			}
			for(int q=0;q<listPwarn.size();q++){
				p =(PcWarnInfo)listPwarn.get(q);
				if(p.getResultdata()==results){
					sameFlag = true;
					break;
				}else if(p.getResultdata()!=results){
					if("1".equals(p.getWarnstatus())||"2".equals(p.getWarnstatus())){
						noStartFlag = true;
					}else if("3".equals(p.getWarnstatus())){
						endFlag = true;
					}	 	
				}
			} 
			if(!sameFlag&&noStartFlag){
				p.setResultdata(results);
				StringBuffer constr = new StringBuffer(p.getWarncontent());
				constr.append(",【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				p.setWarncontent(constr.toString());
				baseDAO.saveOrUpdate(p);
			}else if(!sameFlag&&endFlag){
				StringBuffer constr = new StringBuffer(pcWarnInfo.getWarncontent());
				constr.append("【");
				SimpleDateFormat  sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				String time = sdf.format(new Date());
				constr.append(time+" 检查结果:");
				constr.append(results);
				constr.append("】");
				pcWarnInfo.setWarncontent(constr.toString());
				baseDAO.insert(pcWarnInfo);
			}
		}
	}
	/**
	 * 构建源数据Sql语句
	 * @param pcWarnRules
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String buildSourceSql(PcWarnRules pcWarnRules){
		//对前台填写的数据进行sql校验
		StringBuffer sourceSql = new StringBuffer("select ");
		if("count".equals(pcWarnRules.getScalculatemode())){
			sourceSql.append(" count("+pcWarnRules.getSourcedataitem()+") ");
		}else 
		if("sum".equals(pcWarnRules.getScalculatemode())){
			sourceSql.append(" nvl(sum(nvl("+pcWarnRules.getSourcedataitem()+",0)),0) ");
		}else {
			sourceSql.append(pcWarnRules.getSourcedataitem());
			if(pcWarnRules.getSourcerelateitem()!=null&&!"".equals(pcWarnRules.getSourcerelateitem())){
				sourceSql.append(", "+pcWarnRules.getSourcerelateitem());
			}
			
			//如果数据源表选择的是视图
			String sourceObjType = getObjType(pcWarnRules.getSourcedatatable());
			if(sourceObjType.equals("VIEW"))
			{
				//do nothing; 拼接sql语句不需要加入主键约束
			}
			else  //默认为目标对象是表, 加入主键约束值
			{
				//如果数据源表选择的是表,判断表的主键值,默认为uids
				String sql = "select  a.column_name from user_cons_columns a, user_constraints b where a.constraint_name = b.constraint_name"
					+" and a.table_name = '"+pcWarnRules.getSourcedatatable()+"'"
					+" and b.constraint_type = 'P'";
				List list= baseDAO.getDataAutoCloseSes(sql);
				if(list.isEmpty())
				{
					sourceSql.append(" ,"+"UIDS");
				}else 
				{
					sourceSql.append(" ,"+(String)list.get(0));
				}
			}
			
			List list1 =calString(pcWarnRules.getWarnhelp());
			for(int m=0;m<list1.size();m++){
				MapKey mapKey=(MapKey)list1.get(m);
				sourceSql.append(","+mapKey.getK());
			}
		}
		sourceSql.append(" from "+pcWarnRules.getSourcedatatable());
		if(pcWarnRules.getSourcehidecon()!=null&&!"".equals(pcWarnRules.getSourcehidecon())){
			sourceSql.append(" where "+pcWarnRules.getSourcehidecon());
		}
		return sourceSql.toString();
	}
	
	public String buildComSql(PcWarnRules pcWarnRules,String re){
		if("null".equals(pcWarnRules.getComdatatable())){
			return "";
		}else {
			StringBuffer comSql = new StringBuffer(" select ");
			if("count".equals(pcWarnRules.getComcalculatemode())){
				comSql.append(" count("+pcWarnRules.getComdataitem()+") ");
			}
			if("sum".equals(pcWarnRules.getComcalculatemode())){
				comSql.append(" nvl(sum(nvl("+pcWarnRules.getComdataitem()+",0)),0)");
			}
			comSql.append(" from "+pcWarnRules.getComdatatable());
			if(pcWarnRules.getComhidecon()!=null&&!"".equals(pcWarnRules.getComhidecon())){
				comSql.append(" where "+pcWarnRules.getComhidecon());
				if(pcWarnRules.getComrelateitem()!=null&&!"".equals(pcWarnRules.getComrelateitem())&&re!=null&&!"".equals(re)){
					comSql.append("  and  "+pcWarnRules.getComrelateitem()+"='"+re+"'");
				}
			}else {
				if(pcWarnRules.getComrelateitem()!=null&&!"".equals(pcWarnRules.getComrelateitem())&&re!=null&&!"".equals(re)){
					comSql.append("  where  "+pcWarnRules.getComrelateitem()+"='"+re+"'");
				}
			}
			return comSql.toString();
		}
	}
    public List calString (String inputString){
    	//接收inpuptString: 合同变更编号为[CHANO,VARCHAR2]的变更金额为{resValue}，超过200万元；
    	List list = new ArrayList();
    	String result ="";
    	while(inputString.contains("[")&&inputString.contains("]")){
    		result+=inputString.substring(inputString.indexOf("["), inputString.indexOf("]")+1)+",";
    		//result: [CHANO,VARCHAR2]
    		inputString=inputString.substring(inputString.indexOf("]")+1);
    		//inputString: 的变更金额为{resValue}，超过200万元；
    	}
    	if(result!=null&&!"".equals(result)){
    		String [] res =result.split("],");
    		//res: [[CHANO,VARCHAR2]长度只为1
    		for(int k=0;k<res.length;k++){
    			String  tempStr=res[k];
    			//tempStr: [CHANO,VARCHAR2
    			String [] temp =tempStr.split(",");
    			String temp1=temp[0].substring(1);
    			//temp1: CHANO
    			String temp2 = temp[1];
    			//temp2: VARCHAR2
    			MapKey mapKey = new MapKey();
    			if(temp1!=null&&!"".equals(temp1)&&temp2!=null&&!"".equals(temp2)){
    				mapKey.setK(temp1);
    				mapKey.setV(temp2);
    			}
    			list.add(mapKey);
    			//list: {{"CHANO","VARCHAR2"}}
    		}
    	}
    	return list;
    }
	@SuppressWarnings("unchecked")
	public String vilidatePersonOnly(String moduleid,String userid,String uids) {
		if(uids!=null||!"".equals(uids)){
			StringBuffer buff = new StringBuffer("select p.moduleid,p.dutyperson,r.unitid from pc_warn_rule_dutyperson  p left join rock_user r on p.dutyperson=r.userid where p.uids='"+uids+"'");
			List list =baseDAO.getDataAutoCloseSes(buff.toString());
			String moduleId="";
			String unitid="";
			for(int i=0;i<list.size();i++){
				Object [] obj=(Object [])list.get(i);
				moduleId = (String)obj[0];
				unitid = (String)obj[2];
			}
			String sql = " select r.unitid from rock_user r where r.userid='"+userid+"'";
			String userUnitid="";
			List userUnitidList = baseDAO.getDataAutoCloseSes(sql);
			 for(int i=0;i<userUnitidList.size();i++){
				 userUnitid =(String)userUnitidList.get(i);
			 }
			 if(unitid.equals(userUnitid)&&moduleId.equals(moduleid)){
				 return "1";
			 }else{
				 StringBuffer  buffSql = new StringBuffer("select count(*) from pc_warn_rule_dutyperson pc left join rock_user r ");
					buffSql.append(" on pc.dutyperson = r.userid ");
					buffSql.append(" where pc.moduleid ='"+moduleid+"' ");
					buffSql.append(" and r.unitid =(select r.unitid from rock_user r where r.userid = '"+userid+"')");
					List	list1=baseDAO.getDataAutoCloseSes(buffSql.toString());
					for(int i=0;i<list1.size();i++){
						BigDecimal num = (BigDecimal)list1.get(i);
						if(num.intValue()==0){
							return "1";
						}
					}
					return "2";
			 }
		}else {
			StringBuffer  buffSql = new StringBuffer("select count(*) from pc_warn_rule_dutyperson pc left join rock_user r ");
			buffSql.append(" on pc.dutyperson = r.userid ");
			buffSql.append(" where pc.moduleid ='"+moduleid+"' ");
			buffSql.append(" and r.unitid =(select r.unitid from rock_user r where r.userid = '"+userid+"')");
			List	list=baseDAO.getDataAutoCloseSes(buffSql.toString());
			for(int i=0;i<list.size();i++){
				BigDecimal num = (BigDecimal)list.get(i);
				if(num.intValue()==0){
					return "1";
				}
			}
			return "2";
		}
	}

	public String addDutyPerson(PcWarnRuleDutyperson pcWarnRuleDutyperson) {
           baseDAO.saveOrUpdate(pcWarnRuleDutyperson);
		return "1";
	}

	public String deleteDutyPerson(String userid) {
	 PcWarnRuleDutyperson pcWarnRuleDutyperson = (PcWarnRuleDutyperson)baseDAO.findById(PcWarnRuleDutyperson.class.getName(), userid);
	  if(pcWarnRuleDutyperson!=null)   
	 baseDAO.delete(pcWarnRuleDutyperson);	
	 return "";
	}

	@SuppressWarnings("unchecked")
	public String addDoWithPersons(String dowithpersons, String searchpersons,String uids) {
		if(dowithpersons!=null&&!"".equals(dowithpersons)){
			String [] strdowith = dowithpersons.split(",");
			//添加处理人
			for(int i=0;i<strdowith.length;i++){
				String str =strdowith[i];
				//验证是否已经添加过该人
				String where = " dowithperson='"+str+"' and warninfoid='"+uids+"' and dowithtype='1'";
				List listdowithPersons = baseDAO.findByWhere(PcWarnDowithInfo.class.getName(), where);
				if(listdowithPersons.size()>0){
					break;
				}
				PcWarnDowithInfo  pcWarnDowithInfo = new PcWarnDowithInfo();
				pcWarnDowithInfo.setComments("");
				pcWarnDowithInfo.setDowithperson(str);
				pcWarnDowithInfo.setDowithtype("1");
				String sql = "select r.unitid,s.unitname from rock_user  r left join sgcc_ini_unit  s on r.unitid = s.unitid where r.realname='"+str+"'";
				List list = baseDAO.getDataAutoCloseSes(sql);
				for(int k=0;k<list.size();k++){
					Object []obj =(Object[])list.get(k);
					pcWarnDowithInfo.setPid((String)obj[0]);//处理人单位unitid
					pcWarnDowithInfo.setDowithunits((String)obj[1]);//处理人单位
					break;
				}
				pcWarnDowithInfo.setWarninfoid(uids);
				baseDAO.insert(pcWarnDowithInfo);
			}
			
		}
		//添加查询处理人
		if(searchpersons!=null&&!"".equals(searchpersons)){
			String []searchStr = searchpersons.split(",");
			for(int m=0; m<searchStr.length; m++){
				String search = searchStr[m];
				String where = " dowithperson='"+search+"' and warninfoid='"+uids+"' and dowithtype='2'";
				List listdowithPersons = baseDAO.findByWhere(PcWarnDowithInfo.class.getName(), where);
				if(listdowithPersons.size()>0){
					break;
				}
				PcWarnDowithInfo  pcWarnDowithInfo = new PcWarnDowithInfo();
				pcWarnDowithInfo.setComments("");
				pcWarnDowithInfo.setDowithperson(search);
				pcWarnDowithInfo.setDowithtype("2");
				String sql = "select r.unitid,s.unitname from rock_user  r left join sgcc_ini_unit  s on r.unitid = s.unitid where r.realname='"+search+"'";
				List list = baseDAO.getDataAutoCloseSes(sql);
				for(int k=0;k<list.size();k++){
					Object [] obj =(Object[]) list.get(k);
					pcWarnDowithInfo.setPid((String)obj[0]);//处理人单位unitid
					pcWarnDowithInfo.setDowithunits((String)obj[1]);//处理人单位
					break;
				}
				pcWarnDowithInfo.setWarninfoid(uids);
				baseDAO.insert(pcWarnDowithInfo);
			}
			
		}
		return "";
	}

	public String getDutyPersonAndTreeRootById(String uids) {
		String rtn = "";
		StringBuffer buffSql = new StringBuffer("select p.pid,r.roletype ,s.unitname "); 
		buffSql.append(" from pc_warn_info p ");
		buffSql.append(" left join pc_warn_role_info r ");
		buffSql.append(" on p.warnrulesid = r.warnrulesid  left join sgcc_ini_unit  s on p.pid=s.unitid");
		buffSql.append(" where  r.rolelevel='责任权限' and p.uids = '"+uids+"'");
	    List list = baseDAO.getDataAutoCloseSes(buffSql.toString());
		String pid="";
		String roleType = "";
		String unitName = "";
	    for(int i=0;i<list.size();i++){
			Object [] objs =(Object [])list.get(i);
			pid = (String)objs[0];
			roleType = (String)objs[1];
			unitName = (String)objs[2];
		}	
	    	if("2".equals(roleType)){
	    		String jiTuan =" select u.userid,u.realname,u.unitid,sg.unitname ";
	    		jiTuan+=" from pc_warn_rule_dutyperson wrd ";
	    		jiTuan+=" left join pc_warn__rules pwr on wrd.moduleid = pwr.mid ";
	    		jiTuan+= " left join pc_warn_info wi ";
	    		jiTuan+= " on pwr.uids = wi.warnrulesid ";
	    		jiTuan+= " left join rock_user u ";
	    		jiTuan+= " on wrd.dutyperson = u.userid ";      
	    		jiTuan+= " left join sgcc_ini_unit sg ";
	    		jiTuan+=" on u.unitid = sg.unitid";
	    		jiTuan+=" where sg.unit_type_id='"+roleType+"' and wi.uids = '"+uids+"'";
	    		List resultList = baseDAO.getDataAutoCloseSes(jiTuan);
	    		if(resultList.size()==0){
	    			String erJi=" select a.userid, a.realname, s.unitid, s.unitname ";
	    			erJi+="  from sgcc_ini_unit s, ";
	    			erJi+="  (select u.userid, u.realname, u.unitid, sg.unitname, sg.upunit ";
	    			erJi+=" from pc_warn_rule_dutyperson wrd";	
	    			erJi+=" left join pc_warn__rules pwr ";	
	    			erJi+=" on wrd.moduleid = pwr.mid ";	
	    			erJi+="  left join pc_warn_info wi ";	
	    			erJi+=" on pwr.uids = wi.warnrulesid ";	
	    			erJi+=" left join rock_user u ";	
	    			erJi+=" on wrd.dutyperson = u.userid ";	
	    			erJi+=" left join sgcc_ini_unit sg ";	
	    			erJi+=" on u.unitid = sg.unitid ";	
	    			erJi+="  where sg.unit_type_id = '1' ";	
	    			erJi+="  and wi.uids = '"+uids+"') a ";	
	    			erJi+="  where s.unitid = a.upunit ";	
	    			erJi+="  and s.unit_type_id = '"+roleType+"' ";	
	    			List resList = baseDAO.getDataAutoCloseSes(erJi);
	    			for(int m=0;m<resList.size();m++){
	    				Object [] objs =(Object[])resList.get(m);
	    				String userid =(String)objs[0];
	    				String userRealName =(String)objs[1];
	    				String unitid =(String)objs[2];
	    				String unitname =(String)objs[3];
	    				if(pid.startsWith(unitid)){
	    					rtn=userid+","+userRealName+","+unitid+","+unitname;
	    					break;
	    				}
	    			}
	    		}else {
	    			for(int i=0;i<resultList.size();i++){
	    				// 项目单位
	    				Object [] objs =(Object[])resultList.get(i);
	    				String userid =(String)objs[0];
	    				String userRealName =(String)objs[1];
	    				String unitid =(String)objs[2];
	    				String unitname =(String)objs[3];
	    				if(pid.startsWith(unitid)){
	    					rtn=userid+","+userRealName+","+unitid+","+unitname;
	    					break;
	    				}
	    			}
	    		}
	    		
	    	}else {
	    		String jiTuan =" select u.userid,u.realname,u.unitid,sg.unitname ";
	    		jiTuan+=" from pc_warn_rule_dutyperson wrd ";
	    		jiTuan+=" left join pc_warn__rules pwr on wrd.moduleid = pwr.mid ";
	    		jiTuan+= " left join pc_warn_info wi ";
	    		jiTuan+= " on pwr.uids = wi.warnrulesid ";
	    		jiTuan+= " left join rock_user u ";
	    		jiTuan+= " on wrd.dutyperson = u.userid ";      
	    		jiTuan+= " left join sgcc_ini_unit sg ";
	    		jiTuan+=" on u.unitid = sg.unitid";
	    		jiTuan+=" where sg.unit_type_id='"+roleType+"' and wi.uids = '"+uids+"'";
	    		List resultList = baseDAO.getDataAutoCloseSes(jiTuan);
	    		for(int k=0;k<resultList.size();k++){
	    			if("0".equals(roleType)){
	    				//表示是集团用户则
	    				Object [] objs =(Object[])resultList.get(k);
	    				String userid =(String)objs[0];
	    				String userRealName =(String)objs[1];
	    				String unitid =(String)objs[2];
	    				String unitname =(String)objs[3];
	    				rtn=userid+","+userRealName+","+unitid+","+unitname;
	    				break;
	    			} else  {
	    				// 项目单位
	    				Object [] objs =(Object[])resultList.get(k);
	    				String userid =(String)objs[0];
	    				String userRealName =(String)objs[1];
	    				String unitid =(String)objs[2];
	    				String unitname =(String)objs[3];
	    				if(pid.equals(unitid)){
	    					rtn=userid+","+userRealName+","+unitid+","+unitname;
	    					break;
	    				}
	    			}
	    		}
	    	}
	    	
	    return rtn;
	}

	public List getUserlistBySql(String orderBy, Integer start, Integer limit,HashMap params) {
		String warninfoId =(String)params.get("warninfoId");
		StringBuffer sbuff = new StringBuffer("select r.userid,r.useraccount,r.realname,r.sex,");
		 sbuff.append(" (select pc.dowithtype  from pc_warn_dowith_info pc  where pc.dowithperson = r.userid and pc.warninfoid = '"+warninfoId+"') as dowithbype, ");
		 sbuff.append("(select p.searchtype from pc_warn_search_info p where p.warninfoid = '"+warninfoId+"' and p.searchperson = r.userid) as searchtype ");
		 sbuff.append(" from rock_user r where");
		 String unitId =(String)params.get("unitid");
        String deptId =(String) params.get("deptId");
        if(deptId!=null&&!"".equals(deptId)){
        	sbuff.append(" r.dept_id='"+deptId+"'");
        }else {
        	sbuff.append(" r.unitid='"+unitId+"'");
        }
		List list =new ArrayList(); 
		try {
			list = pcWarnDAO.findBySql(orderBy, sbuff.toString(), start, limit);
				} catch (DataAccessResourceFailureException e) {
					e.printStackTrace();
				} catch (HibernateException e) {
					e.printStackTrace();
				} catch (IllegalStateException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		return list;
	}

	public String saveDoWithPersonAndSearchPerson(UserBean userBean) {
		String dowithPersons =userBean.getDowithperson();
		if(dowithPersons!=null&&!"".equals(dowithPersons)){
			String [] dowiths =dowithPersons.split(";");
			for(int i = 0;i<dowiths.length;i++){
				String [] dos =dowiths[i].split(",");
				String id =dos[0];
				if("true".equals(dos[1])){
					if(id!=null&&!"".equals(id)){
						String where = "warninfoid='"+userBean.getWarninfoid()+"' and pid='"+userBean.getPid()+"' and dowithperson='"+id+"' and dowithtype='1'";
						List list=	baseDAO.findByWhere(PcWarnDowithInfo.class.getName(), where);
						PcWarnDowithInfo  pwd = new PcWarnDowithInfo();
						pwd.setDowithperson(id);
						pwd.setDowithtype("1");//未处理
						pwd.setPid(userBean.getPid());
						pwd.setWarninfoid(userBean.getWarninfoid());
						pwd.setSendtime(new Date());
						pwd.setSenduserid(userBean.getUserid());
						if(userBean.getGuidecomments()!=null&&!"".equals(userBean.getGuidecomments()))
							pwd.setGuidecomments(userBean.getGuidecomments());//存储处理人意见
						if(list.size()==0){
							baseDAO.insert(pwd);
						}else {
							PcWarnDowithInfo pwd1  =(PcWarnDowithInfo)list.get(0);
							if(userBean.getGuidecomments()!=null&&!"".equals(userBean.getGuidecomments()))
								pwd1.setGuidecomments(userBean.getGuidecomments());//存储处理人意见
							baseDAO.saveOrUpdate(pwd1);
						}
					}
				}
				if("false".equals(dos[1])){
					String sql ="delete from pc_warn_dowith_info p where p.dowithtype='1' and p.dowithperson='"+id+"' and p.warninfoid='"+userBean.getWarninfoid()+"'";
					JdbcUtil.execute(sql);
				}
			}
		}
		String searchPersons = userBean.getSearchperson();
		if(searchPersons!=null&&!"".equals(searchPersons)){
			String [] searchs = searchPersons.split(";");
			for(int k =0;k<searchs.length;k++){
				String [] dis =searchs[k].split(",");
				String ids = dis[0];
				if(ids!=null&&!"".equals(ids)){
					if("true".equals(dis[1])){
						String where = "warninfoid='"+userBean.getWarninfoid()+"' and pid='"+userBean.getPid()+"' and searchperson='"+ids+"' and searchtype='1'";
						List list=baseDAO.findByWhere(PcWarnSearchInfo.class.getName(), where);
						PcWarnSearchInfo pws = new PcWarnSearchInfo();
						pws.setPid(userBean.getPid());
						pws.setSearchperson(ids);
						pws.setSearchtype("1");
						pws.setSendperson(userBean.getUserid());
						pws.setSendtime(new Date());
						pws.setWarninfoid(userBean.getWarninfoid());
						if(list.size()==0){
							baseDAO.insert(pws);
						}
					}
					if("false".equals(dis[1])){
						String sql  = "delete from pc_warn_search_info p where p.searchtype ='1' and p.searchperson='"+ids+"' and p.warninfoid='"+userBean.getWarninfoid()+"'";
						JdbcUtil.execute(sql);
					}
				}
			}
			
		}
		String sql ="update pc_warn_info pc set pc.warnstatus='2' where pc.uids='"+userBean.getWarninfoid()+"'";
		baseDAO.updateBySQL(sql);
		return "1";
	}

	@SuppressWarnings("unchecked")
	public List getPcWarnInfoByUserid(String orderBy, Integer start,
			Integer limit,HashMap params) {
		String userid =(String) params.get("userid");
		String type = (String)params.get("type");
		String otherType=(String)params.get("othertype");
		StringBuffer sBuffer= new StringBuffer();
		if("search".equals(type)){
			sBuffer.append("select pc.* from pc_warn_search_info p ");
			sBuffer.append("left join pc_warn_info pc on p.warninfoid=pc.uids where ");
			sBuffer.append(" p.searchperson='"+userid+"'");
			sBuffer.append("  and pc.uids is not null");
			if("1".equals(otherType)||"2".equals(otherType)){
				sBuffer.append(" and p.searchtype='"+otherType+"'");
			}
		}else if("dowith".equals(type)){
			sBuffer.append("select pc.* from pc_warn_dowith_info p ");
			sBuffer.append("left join pc_warn_info pc on p.warninfoid=pc.uids where");
			sBuffer.append("  p.dowithperson='"+userid+"'");
			sBuffer.append("  and pc.uids is not null");
			if("1".equals(otherType)||"2".equals(otherType)){
				sBuffer.append(" and p.dowithtype='"+otherType+"' ");
			}
		}else {
			return new ArrayList();
		}
	 List list=null;
	try {
		list = baseDAO.findBySql(PcWarnInfo.class.getName(), sBuffer.toString(), start, limit);
	} catch (DataAccessResourceFailureException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (HibernateException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IllegalStateException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (ClassNotFoundException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
		return list;
	}

	public String dowithCommentsBySelf(PcWarnDowithInfo pcWarnDowithInfo) {
        PcWarnDowithInfo pc =
        	(PcWarnDowithInfo)baseDAO.findById(PcWarnDowithInfo.class.getName(), pcWarnDowithInfo.getUids());
        pc.setComments(pcWarnDowithInfo.getComments());
        pc.setDowithtime(new Date());
        pc.setDowithtype("2");
        
        //修改对应预警信息的处理状态
        PcWarnInfo warnInfo = 
        			(PcWarnInfo)baseDAO.findById(PcWarnInfo.class.getName(), pc.getWarninfoid());
        warnInfo.setWarnstatus("3");
        baseDAO.saveOrUpdate(pc);
        baseDAO.saveOrUpdate(warnInfo);
		return "1";
	}

	public String calSendUserdoWithInfo(String userid) {
		String sql ="  select count(*) from sgcc_ini_unit  sg where "+
         " sg.upunit=(select r.unitid from rock_user r where r.userid='"+userid+  
       "')";
		List list= baseDAO.getDataAutoCloseSes(sql);
		BigDecimal num =new BigDecimal(0);
		for(int i =0;i<list.size();i++){
			 num =(BigDecimal)list.get(i);
		}
		//计算当前用户所的Uintid
		RockUser rockUser =(RockUser)baseDAO.findByCompId(RockUser.class.getName(), userid);
		SgccIniUnit  sgccIniUnit =(SgccIniUnit)baseDAO.findById(SgccIniUnit.class.getName(), rockUser.getUnitid());
		if("1".equals(sgccIniUnit.getUnitTypeId())){
			SgccIniUnit  siu =(SgccIniUnit)baseDAO.findById(SgccIniUnit.class.getName(), sgccIniUnit.getUpunit());
			String rtn =num+","+siu.getUnitid()+","+siu.getUnitname();
			return rtn;
		}else {
			String rtn =num+","+rockUser.getUnitid()+","+sgccIniUnit.getUnitname();
			return rtn;
		}
	}

	public String otherSaveDoWithPersonAndSearchPerson(UserBean userBean) throws BusinessException{
		String dowithPersons =userBean.getDowithperson();
		String [] dowiths =dowithPersons.split(";");
		for(int i = 0;i<dowiths.length;i++){
			String [] dos =dowiths[i].split(",");
			String id =dos[0];
			if("true".equals(dos[1])){
				if(id!=null&&!"".equals(id)){
					PcWarnDowithInfo  pwd = new PcWarnDowithInfo();
					pwd.setDowithperson(id);
					pwd.setDowithtype("1");//未处理
					pwd.setPid(userBean.getPid());
					pwd.setWarninfoid(userBean.getWarninfoid());
					pwd.setSendtime(new Date());
					pwd.setSenduserid(userBean.getUserid());
					if(userBean.getGuidecomments()!=null&&!"".equals(userBean.getGuidecomments()))
					pwd.setGuidecomments(userBean.getGuidecomments());//存储处理人意见
					baseDAO.insert(pwd);
				}
			}
			if("false".equals(dos[1])){
				String sql ="delete from pc_warn_dowith_info p where p.dowithtype='1' and p.dowithperson='"+id+"' and p.warninfoid='"+userBean.getWarninfoid()+"'";
				JdbcUtil.execute(sql);
			}
		}
		String searchPersons = userBean.getSearchperson();
		String [] searchs = searchPersons.split(";");
		for(int k =0;k<searchs.length;k++){
			String [] dis =searchs[k].split(",");
			String ids = dis[0];
			if(ids!=null&&!"".equals(ids)){
				if("true".equals(dis[1])){
					PcWarnSearchInfo pws = new PcWarnSearchInfo();
					pws.setPid(userBean.getPid());
					pws.setSearchperson(ids);
					pws.setSearchtype("1");
					pws.setSendperson(userBean.getUserid());
					pws.setSendtime(new Date());
					pws.setWarninfoid(userBean.getWarninfoid());
					baseDAO.insert(pws);
				}
				if("false".equals(dis[1])){
					String sql  = "delete from pc_warn_search_info p where p.searchtype ='1' and p.searchperson='"+ids+"' and p.warninfoid='"+userBean.getWarninfoid()+"'";
					JdbcUtil.execute(sql);
				}
			}
		}
	List list =	baseDAO.findByWhere(PcWarnDowithInfo.class.getName(), "warninfoid='"+userBean.getWarninfoid()+"' and dowithperson='"+userBean.getUserid()+"'");
	PcWarnDowithInfo pc =null;    
	for(int i=0;i<list.size();i++){
	    	pc = (PcWarnDowithInfo)list.get(i);
	    }
	 pc.setComments(userBean.getGuidecomments());
	 pc.setDowithtype("2");
	 pc.setDowithtime(new Date());
	 baseDAO.saveOrUpdate(pc);
	return "1";
	}

	public String searchCommentsBySelf(PcWarnSearchInfo pcWarnSearchInfo) {
		PcWarnSearchInfo pc =(PcWarnSearchInfo)baseDAO.findById(PcWarnSearchInfo.class.getName(), pcWarnSearchInfo.getUids());
		pc.setComments(pcWarnSearchInfo.getComments());
		pc.setSearchtime(new Date());
		pc.setSearchtype("2");
		if(pcWarnSearchInfo.getUids()!=null&&!"".equals(pcWarnSearchInfo.getUids())){
			baseDAO.saveOrUpdate(pc);
		}
		return null;
	}

	public List checkNotDoWithPersons(String warninfoid) {
		String where = "";
		String sql ="select r.realname from pc_warn_dowith_info pc left join rock_user r on pc.dowithperson=r.userid  where pc.dowithtype='1' and pc.warninfoid='"+warninfoid+"'";
		List list =baseDAO.getDataAutoCloseSes(sql);
		return list;
	}

	public String closePcWarnInfo(PcWarnInfo pcWarnInfo) {
		String sql = "update pc_warn_info   p set p.warncompletion='"+pcWarnInfo.getWarncompletion()+"', p.warnstatus='3' where p.uids='"+pcWarnInfo.getUids()+"'  ";
		baseDAO.updateBySQL(sql);
		return "1";
	}

	public String deletePcWarnRange(PcWarnRangeInfo pcWarnRangeInfo) {
		baseDAO.delete(pcWarnRangeInfo);
		return "1";
	}

	public String insertPcWarnRange(PcWarnRangeInfo pcWarnRangeInfo) {
		baseDAO.insert(pcWarnRangeInfo);
		return "1";
	}

	public String updatePcWarnRange(PcWarnRangeInfo pcWarnRangeInfo) {
		   baseDAO.saveOrUpdate(pcWarnRangeInfo);
		   return null;
	}

	public String checkPcWarnRangeExist(String uids, String projectid,String warnRulesId) {
		 if(uids==null||"".equals(uids)){
			List  list=baseDAO.findByWhere(PcWarnRangeInfo.class.getName(), " projectid='"+projectid+"' and warnrulesid='"+warnRulesId+"'" );
		    if(list.size()==0){
		    	return "1";
		    }
		    return "2";
		 }else {
			 List list = baseDAO.findByWhere(PcWarnRangeInfo.class.getName(), " projectid='"+projectid+"'and warnrulesid='"+warnRulesId+"'");
		     for(int i =0;i<list.size();i++){
		    	 PcWarnRangeInfo pc =(PcWarnRangeInfo)list.get(i);
		    	 if(!pc.getUids().equals(uids)){
		    		 return "2";
		    	 }
		     }
		 }
		return "1";
	}

	public void markRead(String uids, String userId) {
         if(uids!=null&&!"".equals(uids)){
        	 String [] warninfoIds = uids.split(",");
        	 for(int k=0;k<warninfoIds.length;k++){
        		 String sql ="update pc_warn_search_info set searchtype='2' , searchtime =sysdate where warninfoid='"+warninfoIds[k]+"' and searchperson='"+userId+"'";
        		 baseDAO.updateBySQL(sql);
        	 }
         }		
	}

	@SuppressWarnings("unchecked")
	public Map<String, String> findWarnInfoNum(String userid) {
		// 查询待处理人员数
		Map map = new HashMap();
		String dowithSql = "select count(*) from pc_warn_dowith_info p where p.dowithperson='"+userid+"' and p.dowithtype='1'";
		List doList= baseDAO.getDataAutoCloseSes(dowithSql);
		String dosearchSql ="select  count(*) from pc_warn_search_info p where p.searchperson='"+userid+"' and p.searchtype='1'";
		List searchList =baseDAO.getDataAutoCloseSes(dosearchSql);
		map.put("dowithNum", doList.get(0));
		map.put("searchNum", searchList.get(0));
		return map;
	}

	@SuppressWarnings("unchecked")
	public List getModuleNameByother(String moduleid) {
		List moduleList =new ArrayList();
		String where =" parentid='"+moduleid+"'";
	List list=baseDAO.findByWhere(RockPower.class.getName(), where);
	for(int i=0;i<list.size();i++){
		RockPower  rockPower =(RockPower)list.get(i);
		if("1".equals(rockPower.getModelflag())&&rockPower.getUrl()!=null&&rockPower.getUrl().contains("jsp")){
			moduleList.add(rockPower);
		}
		if(rockPower.getLeaf()==0){
			List subList = baseDAO.findByWhere(RockPower.class.getName(), "parentid='"+rockPower.getPowerpk()+"'");
			for(int k=0;k<subList.size();k++){
				RockPower  subRockPower =(RockPower)subList.get(k);
				if("1".equals(subRockPower.getModelflag())&&subRockPower.getUrl()!=null&&subRockPower.getUrl().contains(".jsp")){
					moduleList.add(subRockPower);
				}
				if(subRockPower.getLeaf()==0){
					List subbList =baseDAO.findByWhere(RockPower.class.getName(), "parentid='"+subRockPower.getPowerpk()+"'");
					for(int m=0;m<subbList.size();m++){
						RockPower  subbRockPower =(RockPower)subbList.get(m);
						if("1".equals(subbRockPower.getModelflag())&&subbRockPower.getUrl()!=null&&subbRockPower.getUrl().contains(".jsp")){
							moduleList.add(subbRockPower);
						}
					}
				}
			}
		}
	}
		return moduleList;
	}

	public String validateDataType(String tablename, String columnName) {
		String typeSql = "select column_name,data_type from all_tab_columns where table_name='"+tablename+"' and column_name= '"+columnName+"'";
	   List list=baseDAO.getDataAutoCloseSes(typeSql);
	   for(int i=0;i<list.size();i++){
		   Object [] objs =(Object [])list.get(i);
		   if("NUMBER".equals(objs[1])){
			   return "1";
		   }
	   }
		return "0";
	}

	public List findColumnNameBySql(String sql) {
		Session session = baseDAO.getSessionFactory().openSession();
		session.beginTransaction();
		List list =session.createSQLQuery(sql).list();
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public String getDutyPersonAndUnitIdAndUnitName(String uids){
		StringBuffer buffSql = new StringBuffer("select p.pid,r.roletype ,s.unitname "); 
		buffSql.append(" from pc_warn_info p ");
		buffSql.append(" left join pc_warn_role_info r ");
		buffSql.append(" on p.warnrulesid = r.warnrulesid  left join sgcc_ini_unit  s on p.pid=s.unitid");
		buffSql.append(" where  r.rolelevel='责任权限' and p.uids = '"+uids+"'");
	    List list = baseDAO.getDataAutoCloseSes(buffSql.toString());
		String pid="";
		String roleType = "";
		String unitName = "";
	    for(int i=0;i<list.size();i++){
			Object [] objs =(Object [])list.get(i);
			pid = (String)objs[0];
			roleType = (String)objs[1];
			unitName = (String)objs[2];
			break;
		}
	    //表示责任权限是二级单位
	    if("2".equals(roleType)){
	    	//二级企业下的都是本部不会选到其他部门
	    	StringBuilder  sbBuilder = new StringBuilder("select a.userid, a.realname, s.unitid, s.unitname ");
	    	sbBuilder.append("  from sgcc_ini_unit s,");
	    	sbBuilder.append(" (select u.userid, u.realname, u.unitid, sg.unitname, sg.upunit");
	    	sbBuilder.append("  from pc_warn_rule_dutyperson wrd");
	    	sbBuilder.append(" left join pc_warn__rules pwr");
	    	sbBuilder.append(" on wrd.moduleid = pwr.mid");
	    	sbBuilder.append(" left join pc_warn_info wi");
	    	sbBuilder.append(" on pwr.uids = wi.warnrulesid");
	    	sbBuilder.append(" left join rock_user u");
	    	sbBuilder.append(" on wrd.dutyperson = u.userid");
	    	sbBuilder.append(" left join sgcc_ini_unit sg");
	    	sbBuilder.append(" on u.unitid = sg.unitid");
	    	sbBuilder.append(" where sg.unit_type_id = '1'");
	    	sbBuilder.append(" and wi.uids = '"+uids+"') a");
	    	sbBuilder.append(" where s.unitid = a.upunit");
	    	sbBuilder.append(" and s.unit_type_id = '2'");
	    	 List erJiList = baseDAO.getDataAutoCloseSes(sbBuilder.toString());
	    	 if(erJiList.size()>0){
	    		 Object[] objs = (Object[])erJiList.get(0);
	    		 String erJiRes=(String)objs[0]+","+(String)objs[1]+","+(String)objs[2]+","+(String)objs[3];
	    		 return erJiRes;
	    	 }
	    }else if("0".equals(roleType)){
	    	//表示责任权限是集团单位
	      	StringBuilder  sbBuilder = new StringBuilder("select a.userid, a.realname, s.unitid, s.unitname ");
	    	sbBuilder.append("  from sgcc_ini_unit s,");
	    	sbBuilder.append(" (select u.userid, u.realname, u.unitid, sg.unitname, sg.upunit");
	    	sbBuilder.append("  from pc_warn_rule_dutyperson wrd");
	    	sbBuilder.append(" left join pc_warn__rules pwr");
	    	sbBuilder.append(" on wrd.moduleid = pwr.mid");
	    	sbBuilder.append(" left join pc_warn_info wi");
	    	sbBuilder.append(" on pwr.uids = wi.warnrulesid");
	    	sbBuilder.append(" left join rock_user u");
	    	sbBuilder.append(" on wrd.dutyperson = u.userid");
	    	sbBuilder.append(" left join sgcc_ini_unit sg");
	    	sbBuilder.append(" on u.unitid = sg.unitid");
	    	sbBuilder.append(" where sg.unit_type_id = '1'");
	    	sbBuilder.append(" and wi.uids = '"+uids+"') a");
	    	sbBuilder.append(" where s.unitid = a.upunit");
	    	sbBuilder.append(" and s.unit_type_id = '0'");
	    	 List jiTuanList = baseDAO.getDataAutoCloseSes(sbBuilder.toString());
	    	 if(jiTuanList.size()>0){
	    		 Object[] objs = (Object[])jiTuanList.get(0);
	    		 String jiTuanRes=(String)objs[0]+","+(String)objs[1]+","+(String)objs[2]+","+(String)objs[3];
	    		 return jiTuanRes;
	    	 }
	    }else if("3".equals(roleType)){
    		String sanJi =" select u.userid,u.realname,u.unitid,sg.unitname ";
    		sanJi+=" from pc_warn_rule_dutyperson wrd ";
    		sanJi+=" left join pc_warn__rules pwr on wrd.moduleid = pwr.mid ";
    		sanJi+= " left join pc_warn_info wi ";
    		sanJi+= " on pwr.uids = wi.warnrulesid ";
    		sanJi+= " left join rock_user u ";
    		sanJi+= " on wrd.dutyperson = u.userid ";      
    		sanJi+= " left join sgcc_ini_unit sg ";
    		sanJi+=" on u.unitid = sg.unitid";
    		sanJi+=" where sg.unit_type_id='"+roleType+"' and wi.uids = '"+uids+"'";
    		 List sanJiList = baseDAO.getDataAutoCloseSes(sanJi);
	    	 if(sanJiList.size()>0){
	    		 Object[] objs = (Object[])sanJiList.get(0);
	    		 String sanJiRes=(String)objs[0]+","+(String)objs[1]+","+(String)objs[2]+","+(String)objs[3];
	    		 return sanJiRes;
	    	 }
	    }
		return null;
	}
	
	/**
	 * 通过一个对象名称, 查询数据库判断该对象类型(表, 视图还是其他),返回该对象类型
	 * @param objName 对象名称
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getObjType(String objName)
	{
		String sql = "select object_type from user_objects where object_name='" + objName + "'";
		List<String> list = this.pcWarnDAO.getDataAutoCloseSes(sql);
		
		if(list.size()>0)
		{
			return list.get(0);
		}	
		
		return "";
	}
}
