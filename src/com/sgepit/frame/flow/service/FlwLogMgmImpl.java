package com.sgepit.frame.flow.service;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwAdjunctIns;
import com.sgepit.frame.flow.hbm.FlwCommonNode;
import com.sgepit.frame.flow.hbm.FlwCommonNodePath;
import com.sgepit.frame.flow.hbm.FlwCommonNodePathLink;
import com.sgepit.frame.flow.hbm.FlwDwrRtnLog;
import com.sgepit.frame.flow.hbm.FlwFiles;
import com.sgepit.frame.flow.hbm.FlwFilesIns;
import com.sgepit.frame.flow.hbm.FlwInstance;
import com.sgepit.frame.flow.hbm.FlwLog;
import com.sgepit.frame.flow.hbm.FlwMaterialRemove;
import com.sgepit.frame.flow.hbm.FlwNode;
import com.sgepit.frame.flow.hbm.FlwNodePathView;
import com.sgepit.frame.flow.hbm.FlwNodeView;
import com.sgepit.frame.flow.hbm.InsDataInfoView;
import com.sgepit.frame.flow.hbm.InsFileAdjunctInfoView;
import com.sgepit.frame.flow.hbm.TaskView;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.frame.util.sms.service.SmsCommonServiceFacade;

public class FlwLogMgmImpl extends BaseMgmImpl
    implements FlwLogMgmFacade
{
	private FlowDAO flowDAO;
	private FlwBizMgmFacade flwBizMgm;
    private String insBean;
    private String logBean;
    private String nodeBean;
    private String nodeViewBean;
    private String pathViewBean;
    private String userBean;
    private String cnodeBean;
    private String cpathBean;
    private String insDataInfoViewBean;
    private String fileBean;
    private String insFilesBean;
    private String cpathlinkBean;
    private SimpleDateFormat sdf;
    private String materialView;
    //流程短信发送Service pengy 2013-10-25
    private SmsCommonServiceFacade smsCommonSer;

	public FlwLogMgmImpl()
    {
        insBean = "com.sgepit.frame.flow.hbm.".concat("FlwInstance");
        logBean = "com.sgepit.frame.flow.hbm.".concat("FlwLog");
        nodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwNode");
        nodeViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodeView");
        pathViewBean = "com.sgepit.frame.flow.hbm.".concat("FlwNodePathView");
        userBean = "com.sgepit.frame.sysman.hbm.".concat("RockUser");
        cnodeBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNode");
        cpathBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePath");
        insDataInfoViewBean = "com.sgepit.frame.flow.hbm.".concat("InsDataInfoView");
        fileBean = "com.sgepit.frame.flow.hbm.".concat("FlwFiles");
        insFilesBean = "com.sgepit.frame.flow.hbm.".concat("FlwFilesIns");
        cpathlinkBean = "com.sgepit.frame.flow.hbm.".concat("FlwCommonNodePathLink");
        materialView = "com.sgepit.frame.flow.hbm.".concat("InsFileAdjunctInfoView");
        sdf = new SimpleDateFormat("yyyyMMddHHmmss");
    }
	
	public static FlwLogMgmImpl getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlwLogMgmImpl)ctx.getBean("flwLogMgm");
    }
    
    public void setFlowDAO(FlowDAO flowDAO)
    {
        this.flowDAO = flowDAO;
    }
    public void setFlwBizMgm(FlwBizMgmFacade flwBizMgm) {
		this.flwBizMgm = flwBizMgm;
	}
	public void setSmsCommonSer(SmsCommonServiceFacade smsCommonSer) {
		this.smsCommonSer = smsCommonSer;
	}

	public boolean checkSignature(FlwLog flwLog, String insid)
    {
        String times = (new SimpleDateFormat("yyyy-MM-dd kk:mm:ss")).format(flwLog.getFtime());
        StringBuffer sbf = new StringBuffer("flag = '0'");
        sbf.append((new StringBuilder(" and insid = '")).append(insid).append("'").toString());
        sbf.append((new StringBuilder(" and ftime = to_date('")).append(times).append("','yyyy-mm-dd hh24:mi:ss')").toString());
        sbf.append((new StringBuilder(" and fromnode = '")).append(flwLog.getFromnode()).append("'").toString());
        sbf.append((new StringBuilder(" and logid <> '")).append(flwLog.getLogid()).append("'").toString());
        List list = flowDAO.findByWhere(logBean, sbf.toString());
        return list.isEmpty();
    }
    /**
	 * 检查退回上一步按钮
	 * @param logid
	 * @return
	 */
    public FlwDwrRtnLog checkToBackPrev(String logid){
    	FlwDwrRtnLog bean = new FlwDwrRtnLog();
    	try{
	    	FlwLog log = (FlwLog) flowDAO.findById(logBean, logid);
	    	String cnodeid = log.getNodeid();
	    	String insid = log.getFlwInstance().getInsid();
	    	
	    	Object object = flowDAO.findById(cnodeBean, cnodeid);
	    	if(object!=null){//普通节点
	    		FlwCommonNode commonNode = (FlwCommonNode)object;
	    		String currentStateNode = commonNode.getNodeid();
	    		if(log.getFlwInstance().getWorklog().endsWith(currentStateNode)){//实例的流程还没有发送到下一个状态节点
	    			//首先判断该普通节点是不是第一个普通节点
	    			List lt1 = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(currentStateNode).
	    						append("' and starttype='0'").toString());
	    			if(lt1.size()==0){//没有找到该业务流程下的开始审批节点，说明流程定义有误
	    				bean.setFlag(false);
	    				bean.setMessage("没有找到所在业务节点下的开始审批节点，请先检查该业务节点下的审批节点定义是否正确?");
	    			}else if(lt1.size()>1){
	    				bean.setFlag(false);
	    				bean.setMessage("该流程不支持业务节点的分裂与合并，请先检查该业务节点下的审批节点定义是否正确?");
	    			}else{
	    				FlwCommonNodePath cnodepath = (FlwCommonNodePath) lt1.get(0);
	    				if(cnodeid.equals(cnodepath.getEndid())){//当前节点是第一个普通节点，不能退回上一节点
	    					bean.setFlag(false);
	        				bean.setMessage("上一个普通审批节点不存在，您可以选择【退回本业务发起人】退回到其所在的业务节点！");
	    				}else{
	    					String splitnode = this.lastSplitCnodeid(cnodeid);
	    					if(splitnode.equals("")){
	    						bean.setFlag(true);
	    					}else{
		    						//查询位于当前节点之后的合并节点
		    						String mergeNode = "";
		    						String mergeType = MAND;
		    						String tmpnodeid = cnodeid;
		    						while(true){
		    							List lt2 = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(currentStateNode).
		    								     append("'and startid='").append(tmpnodeid).append("'").toString());
		    							if(lt2.size()>0){
		    								FlwCommonNodePath _path = (FlwCommonNodePath) lt2.get(0);
		    		    					Object obj = flowDAO.findById(cnodeBean, _path.getEndid());
		    		    					if(obj==null) break;
		    								FlwCommonNode _hbm = (FlwCommonNode) obj;
		    								if(!(_hbm.getMerge().equalsIgnoreCase(DEFUAL))){
		    									mergeNode = _hbm.getCnodeid();
		    									mergeType = _hbm.getMerge();
		    									break;
		    								}else{
		    									tmpnodeid = _path.getEndid();
		    								}
		    							}else{
		    								break;
		    							}
		    						}
		    						if(mergeNode.equals("")||mergeType.equals(MAND)||mergeType.equals(DEFUAL)){
		    							bean.setFlag(true);
		    						}else{
		    							//分裂节点最后一次的日志记录
		    							List lt3 = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("insid='")).append(insid).
		    									append("' and nodeid='").append(splitnode).append("' and isresend='0'").toString(),"ftime desc");
		    							FlwLog fg = (FlwLog)lt3.get(0);
		    							String[] splitToNodes = fg.getTocnodes().split("[`]");//分裂到的节点
		    							boolean flag = false;
		    							
		    							for(String cnid:splitToNodes){
		    								List lt4 = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(commonNode.getNodeid()).
		    			        					append("' and linkpath like '%").append(cnid).append("`%").append(mergeNode).
		    			        					append("%'").toString());
		    								FlwCommonNodePathLink linkhbm = (FlwCommonNodePathLink) lt4.get(0);
		    								String pathlink = linkhbm.getLinkpath();
		    								pathlink = pathlink.substring(pathlink.indexOf(cnid), pathlink.indexOf(mergeNode)-1);
		    								
		    								if(pathlink.indexOf(cnodeid)>-1) continue;//剔除当前支路
		    								if(this.isAllPassByPathAndFtime(insid, pathlink, fg.getFtime())){
		    									flag = true;
		    									break;
		    								}
		    							}
		    							if(flag){
		    								bean.setFlag(false);
		    								bean.setMessage("已有位于此审批点后的审批节点通过审批，不能再进行退回！");
		    							}else{
		    								bean.setFlag(true);
		    							}
		    						}
		    					}
	    				}
	    			}
	    		}else{//实例的流程发送到下一个状态节点
	    			bean.setFlag(false);
	    			bean.setMessage("流程已发送到其它业务节点，不能进行退回操作！");
	    		};
	    	}
    	}catch(RuntimeException e){
    		bean.setSuccess(false);
    		bean.setErrormsg("抛出异常："+e.getMessage());
    		e.printStackTrace();
    	}	
    	return bean;
    };
    /**
     * 检查退回本业务发起人按钮
     * @param logid
     * @return
     */
    public FlwDwrRtnLog checkToBackNode(String logid){
    	FlwDwrRtnLog bean = new FlwDwrRtnLog();
    	try{
    		FlwLog log = (FlwLog) flowDAO.findById(logBean, logid);
    		String cnodeid = log.getNodeid();
    		FlwInstance insbean = log.getFlwInstance();
    		String worklog = insbean.getWorklog();
    		if(worklog==null){
    			bean.setFlag(false);
    			bean.setMessage("业务节点不存在，不能进行退回操作！");
    		}else{
    			Object object = flowDAO.findById(cnodeBean, cnodeid);
        		if(object!=null){//普通节点
        			FlwCommonNode commonnode =  (FlwCommonNode)object;
        			if(worklog.endsWith(commonnode.getNodeid())){//同处于一个状态节点
        				String splitnode = this.lastSplitCnodeid(cnodeid);
    					if(splitnode.equals("")){//分裂節點不存在
    						bean.setFlag(true);
    					}else{
    						//查询位于当前节点之后的合并节点
    						String mergeNode = "";
    						String mergeType = MAND;
    						String tmpnodeid = cnodeid;
    						while(true){
    							List lt2 = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(commonnode.getNodeid()).
    								     append("'and startid='").append(tmpnodeid).append("'").toString());
    							if(lt2.size()>0){
    								FlwCommonNodePath _path = (FlwCommonNodePath) lt2.get(0);
    		    					Object obj = flowDAO.findById(cnodeBean, _path.getEndid());
    		    					if(obj==null) break;
    								FlwCommonNode _hbm = (FlwCommonNode) obj;
    								if(!(_hbm.getMerge().equalsIgnoreCase(DEFUAL))){
    									mergeNode = _hbm.getCnodeid();
    									mergeType = _hbm.getMerge();
    									break;
    								}else{
    									tmpnodeid = _path.getEndid();
    								}
    							}else{
    								break;
    							}
    						}
	    						if(mergeNode.equals("")||mergeType.equals(MAND)||mergeType.equals(DEFUAL)){
	    							bean.setFlag(true);
	    						}else{
	    							//分裂节点最后一次的日志记录
	    							List lt3 = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("insid='")).append(insbean.getInsid()).
	    									append("' and nodeid='").append(splitnode).append("' and isresend='0'").toString(),"ftime desc");
	    							FlwLog fg = (FlwLog)lt3.get(0);
	    							String[] splitToNodes = fg.getTocnodes().split("[`]");//分裂到的节点
	    							boolean flag = false;
	    							
	    							for(String cnid:splitToNodes){
	    								List lt4 = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(commonnode.getNodeid()).
	    			        					append("' and linkpath like '%").append(cnid).append("`%").append(mergeNode).
	    			        					append("%'").toString());
	    								FlwCommonNodePathLink linkhbm = (FlwCommonNodePathLink) lt4.get(0);
	    								String pathlink = linkhbm.getLinkpath();
	    								pathlink = pathlink.substring(pathlink.indexOf(cnid), pathlink.indexOf(mergeNode)-1);
	    								
	    								if(pathlink.indexOf(cnodeid)>-1) continue;//剔除当前支路
	    								if(this.isAllPassByPathAndFtime(insbean.getInsid(), pathlink, fg.getFtime())){
	    									flag = true;
	    									break;
	    								}
	    							}
	    							if(flag){
	    								bean.setFlag(false);
	    								bean.setMessage("已有位于此审批点后的审批节点通过审批，不能再进行退回！");
	    							}else{
	    								bean.setFlag(true);
	    							}
	    						}
	    					}
        			}else{
        				bean.setFlag(false);
        				bean.setMessage("流程已经处于业务节点，不能进行退回操作！");
        			}
        		}else{
        			bean.setFlag(false);
        			bean.setMessage("流程已经处于业务节点，不能进行退回操作！");
        		};
    		}
    	}catch(RuntimeException e){
    		bean.setSuccess(false);
    		bean.setErrormsg("执行错误："+e.getMessage());
    		e.printStackTrace();
    	}
    	return bean;
    };
    /**
     * 检查退回发起人按钮
     * @param logid
     * @return
     */
    public FlwDwrRtnLog checkToBackBegin(String logid){
    	FlwDwrRtnLog bean = new FlwDwrRtnLog();
    	try{
    		FlwLog log = (FlwLog) flowDAO.findById(logBean, logid);
    		String cnodeid = log.getNodeid();
    		FlwInstance insbean = log.getFlwInstance();
    		String worklog = insbean.getWorklog();
    		if(worklog==null){
    			bean.setFlag(false);
    			bean.setMessage("业务节点不存在，不能进行退回操作！");
    		}else{
    			Object object = flowDAO.findById(cnodeBean, cnodeid);
    			if(object!=null){//普通节点
    				FlwCommonNode commonnode = (FlwCommonNode)object;
    				if(worklog.endsWith(commonnode.getNodeid())){//同处于一个状态节点
    					String splitnode = this.lastSplitCnodeid(cnodeid);
    					if(splitnode.equals("")){//分裂節點不存在
    						bean.setFlag(true);
    					}else{
    						//查询位于当前节点之后的合并节点
    						String mergeNode = "";
    						String mergeType = MAND;
    						String tmpnodeid = cnodeid;
    						while(true){
    							List lt2 = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(commonnode.getNodeid()).
    								     append("'and startid='").append(tmpnodeid).append("'").toString());
    							if(lt2.size()>0){
    								FlwCommonNodePath _path = (FlwCommonNodePath) lt2.get(0);
    		    					Object obj = flowDAO.findById(cnodeBean, _path.getEndid());
    		    					if(obj==null) break;
    								FlwCommonNode _hbm = (FlwCommonNode) obj;
    								if(!(_hbm.getMerge().equalsIgnoreCase(DEFUAL))){
    									mergeNode = _hbm.getCnodeid();
    									mergeType = _hbm.getMerge();
    									break;
    								}else{
    									tmpnodeid = _path.getEndid();
    								}
    							}else{
    								break;
    							}
    						}
    						if(mergeNode.equals("")||mergeType.equals(MAND)||mergeType.equals(DEFUAL)){
    							bean.setFlag(true);
    						}else{
    							//分裂节点最后一次的日志记录
    							List lt3 = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("insid='")).append(insbean.getInsid()).
    									append("' and nodeid='").append(splitnode).append("' and isresend='0'").toString(),"ftime desc");
    							FlwLog fg = (FlwLog)lt3.get(0);
    							String[] splitToNodes = fg.getTocnodes().split("[`]");//分裂到的节点
    							boolean flag = false;
    							
    							for(String cnid:splitToNodes){
    								List lt4 = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(commonnode.getNodeid()).
    			        					append("' and linkpath like '%").append(cnid).append("`%").append(mergeNode).
    			        					append("%'").toString());
    								FlwCommonNodePathLink linkhbm = (FlwCommonNodePathLink) lt4.get(0);
    								String pathlink = linkhbm.getLinkpath();
    								pathlink = pathlink.substring(pathlink.indexOf(cnid), pathlink.indexOf(mergeNode)-1);
    								
    								if(pathlink.indexOf(cnodeid)>-1) continue;//剔除当前支路
    								if(this.isAllPassByPathAndFtime(insbean.getInsid(), pathlink, fg.getFtime())){
    									flag = true;
    									break;
    								}
    							}
    							if(flag){
    								bean.setFlag(false);
    								bean.setMessage("已有位于此审批点后的审批节点通过审批，不能再进行退回！");
    							}else{
    								bean.setFlag(true);
    							}
    						}
    					}
    				}else{
    					bean.setFlag(false);
    					bean.setMessage("流程已经处于业务节点，不能进行退回操作！");
    				}
    			}else{
    				int len = flowDAO.findByWhere(pathViewBean, "startid = '"+cnodeid+"' and starttype = '0'").size();
    				if(len==1){//该节点本身就是开始节点
    					bean.setFlag(false);
    					bean.setMessage("当前节点已是开始节点！");
    				}else{
    					bean.setFlag(true);
    				}
    			};
    		}
    	}catch(RuntimeException e){
    		bean.setSuccess(false);
    		bean.setErrormsg("执行错误："+e.getMessage());
    		e.printStackTrace();
    	}
    	return bean;
    };
    
    public void addSysFlwLog(FlwInstance ins, Date fTime, String toNode, String type)
    {
        FlwLog endLog = new FlwLog();
        endLog.setFlwInstance(ins);
        endLog.setFromnode("systemuserid");
        endLog.setFtime(fTime);
        endLog.setFtype("0");
        endLog.setNodename("普通节点");
        endLog.setNotes((new StringBuilder("系统提示：完成")).append(type).toString());
        endLog.setTonode(toNode);
        endLog.setFlag("0");
        endLog.setIsresend("0");
        flowDAO.insert(endLog);
    }
    /**
	 * 流程状态节点改变时，系统自动产生日志
	 * @param logid
	 */
    public void addChangeStateLog(String logid)
    {
        FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
        FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
        FlwLog endLog = new FlwLog();
        endLog.setFlwInstance(ins);
        endLog.setFromnode("systemuserid");
        endLog.setFtime(new Date());
        endLog.setFtype("9");
        endLog.setNodename("状态节点");
        endLog.setNotes("系统提示：完成流程状态改变");
        endLog.setTonode("systemuserid");
        endLog.setFlag("1");
        endLog.setIsresend("0");
        flowDAO.insert(endLog);
    }

    public void addTaskFlwLog(FlwInstance ins, Date fTime, String toNode, String type)
    {
        FlwLog endLog = new FlwLog();
        endLog.setFlwInstance(ins);
        endLog.setFromnode("systemuserid");
        endLog.setFtime(fTime);
        endLog.setFtype("0");
        endLog.setNodename("普通节点");
        endLog.setNotes((new StringBuilder("系统提示：完成")).append(type).toString());
        endLog.setTonode(toNode);
        endLog.setFlag("1");
        endLog.setIsresend("0");
        flowDAO.insert(endLog);
    }
    /**
	 * 任务节点系统自动日志
	 * @param logid
	 */
    public void finishedTask(String logid)
    {
        FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
        FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
        FlwLog endLog = new FlwLog();
        endLog.setFlwInstance(ins);
        endLog.setFromnode("systemuserid");
        endLog.setFtime(new Date());
        endLog.setFtype("6");
        endLog.setNodename("任务节点");
        endLog.setNotes("系统提示：完成流程任务");
        endLog.setTonode("systemuserid");
        endLog.setFlag("1");
        flowDAO.insert(endLog);
    };
    public boolean finishFlow(String logid)
	    throws SQLException, BusinessException
	{
	    try
	    {
	        FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
	        FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
	        log.setFlag("1");
	        ins.setStatus("2");
	        flowDAO.saveOrUpdate(log);
	        flowDAO.saveOrUpdate(ins);
//	        改变跨系统处理结束节点任务的状态
//	        crossDomainUpdateState(log.getLogid());
	        
	        (new JdbcTemplate(Constant.DATASOURCE)).execute("delete from FLW_MATERIAL_REMOVE where insid='"+ins.getInsid()+"'");
	        List fileslist = flowDAO.findByWhere(materialView, (new StringBuilder()).append("insid='").
	        		append(ins.getInsid()).append("'").toString());
	        FlwMaterialRemove removehbm = new FlwMaterialRemove();
	        removehbm.setFlwInstance(ins);
	        if(fileslist.size()==0){
	        	removehbm.setRemoveinfo("2");//0未移交，-1部分移交，1全部移交完毕，2没有流程资料
	        }else{
	        	StringBuilder sbd = new StringBuilder();
	        	for(Iterator it=fileslist.iterator();it.hasNext();){
	        		InsFileAdjunctInfoView filehbm = (InsFileAdjunctInfoView) it.next();
	        		sbd.append(",").append(filehbm.getFileid());
	        	}
	        	removehbm.setRemoveinfo("0");
	        	removehbm.setUnremoveed(sbd.toString().substring(1));
	        }
	        flowDAO.insert(removehbm);
	        flwBizMgm.finishBizData(logid);
	        
	        List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, (new StringBuilder("insid='")).append(log.getFlwInstance().getInsid()).append("'").toString());
	        if(!dataInfoList.isEmpty())
	        {
	            for(int i = 0; i < dataInfoList.size(); i++)
	            {
	            	InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
	                String strParams = datInfo.getParamvalues();
	                String params[] = strParams.split("`");
	                //流程结束后把所有状态节点任务接口对应的表数据的流程字段置为1(已审批)
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
	                    		String sql = "update "+datInfo.getTablename()+" set bill_state='1' where "+strWhere;
	                    		jdbc.update(sql);
	                    		System.out.println("流程状态更新(含bill_state)："+sql);
//	                    		业务数据的改变进行数据交互
	                    		flwBizMgm.businessDataExchange(logid, sql);
	                    	}catch(Exception ex){//表datInfo.getTablename()没有bill_state字段,从属性配置表中读取设置
	                    		List lt = jdbc.queryForList("select t.PROPERTY_NAME from property_code t " +
	                					"where upper(property_Code)='"+datInfo.getTablename().toUpperCase()+"' and module_Name='流程字段'");
	                    		if(lt.size()>0){
	                    			Map map = (Map) lt.get(0);
	                    			if(map.get("PROPERTY_NAME")!=null&&!(map.get("PROPERTY_NAME").toString().equals(""))){
	                    				try{
	                    					String sql = "update "+datInfo.getTablename()+" set "+map.get("PROPERTY_NAME").toString()+"='1' where "+strWhere;
	        	                    		jdbc.update(sql);
	        	                    		System.out.println("流程状态更新(不含bill_state)："+sql);
//	        	                    		业务数据的改变进行数据交互
	        	                    		flwBizMgm.businessDataExchange(logid, sql);
	                    				}catch(Exception ex1){
	                    					ex1.printStackTrace();
	                    				}
	                    			}
	                    		}
	                    	}
	                    }//end if(!strWhere.equals("")) 
	                }	
	            }//end dataInfoList loop
	        }
	        
	      //跨系统流程处理的数据交互
	        WebContext webContext = WebContextFactory.get(); 
	        HttpServletRequest request = webContext.getHttpServletRequest();
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
	    }
	    catch(RuntimeException e)
	    {
	        e.printStackTrace();
	        return false;
	    }
	    return true;
	}
	
	public boolean finishSendFileLog(String logid)
	{
	    FlwLog flwLog = (FlwLog)flowDAO.findById(logBean, logid);
	    flwLog.setFlag("1");
	    flowDAO.saveOrUpdate(flwLog);
	    return true;
	};
	 /**
	 * 获取当前及下一个或多个状态节点
	 * @param insid
	 * @return
	 */
    public List<FlwNodeView> getNextFlowState(String insid)
    {
        FlwInstance flwIns = (FlwInstance)flowDAO.findById(insBean, insid);
        //System.out.println("111>>>>>>>>"+flwIns.getFlwLogs());
        //System.out.println("222>>>>>>>>"+flwIns.getFlwLogs().iterator().next());
        String flowid = flwIns.getFlwDefinition().getFlowid();//流程定义ID
        List<FlwNodeView> stateNodes = new ArrayList<FlwNodeView>();
        if(flwIns.getWorklog() == null){
            //状态节点表查询 type = '0'开始节点
        	FlwNodeView node = (FlwNodeView)flowDAO.findByWhere(nodeViewBean, (new StringBuilder("flowid = '")).append(flowid).append("' and type = '0'").toString()).get(0);
            stateNodes = new ArrayList<FlwNodeView>();
            
            FlwNodeView node1 = new FlwNodeView();
            node1.setNodeid(" ");
            node1.setName("待开始");

            stateNodes.add(node1);
            stateNodes.add(node);
        }else{
            String nodes[] = flwIns.getWorklog().split(",");
            String currentNode = nodes[nodes.length - 1];
            FlwNodeView cNode = (FlwNodeView)flowDAO.findById(nodeViewBean, currentNode);//当前状态节点
            stateNodes.add(cNode);

            List list = flowDAO.findByWhere(pathViewBean, (new StringBuilder("flowid = '")).
            		append(flowid).append("' and startid = '").append(currentNode).append("'").toString());
            for(int i = 0; i < list.size(); i++){
                FlwNodePathView pathView = (FlwNodePathView)list.get(i);
                if(pathView.getEndid().equals("0")){//结束节点
                	FlwNodeView node1 = new FlwNodeView();
                    node1.setNodeid("0");
                    node1.setName("结束节点");
                    stateNodes.add(node1);
                }else{
                	FlwNodeView node = (FlwNodeView)flowDAO.findById(nodeViewBean, pathView.getEndid());
                    stateNodes.add(node);
                }
            }
        }
        return stateNodes;
    }
    /**
	 * 获取下一个或多个普通节点
	 * @param flowid 当前流程id
	 * @param insid  当前流程实例id
	 * @param nodeid 当前状态节点id
	 * @param userid 当前登录用户
	 * @return
	 */
    public List<FlwCommonNode> getNextCommonState(String flowid, String insid,String logid, String nodeid, String userid)
    {
    	ArrayList<FlwCommonNode>  commonNodes = new ArrayList<FlwCommonNode>();
    	FlwLog flwlog = (FlwLog) flowDAO.findById(logBean, logid);
    	String nid = flwlog.getNodeid();//当前流程节点，可能是状态节点，也可能是普通节点
    	if(nid.equals(nodeid)){//当前节点时状态节点，需要发送到该状态节点下的普通节点
    		FlwCommonNode _cnode = new FlwCommonNode();
			_cnode.setCnodeid(nodeid);//当前状态节点id
			_cnode.setName("上一个状态节点");
			_cnode.setBifurcate(DEFUAL);
			_cnode.setMerge(DEFUAL);
    		commonNodes.add(_cnode);
    		//说明从状态节点发送到该状态节点下的普通节点
    		List list1 = flowDAO.findByWhere(cpathBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").
            		append(nodeid).append("' and starttype='0'").toString());
    		//如果list1大于1，说明状态节点下连接2个或2个以上的普通节点，这是不允许的，因为状态节点不支持合并和分裂
        	if(list1.size()==1){
        		FlwCommonNodePath cpath = (FlwCommonNodePath)list1.get(0);
        		FlwCommonNode cnode = (FlwCommonNode)flowDAO.findByWhere(cnodeBean, (new StringBuilder("cnodeid='")).
        				append(cpath.getEndid()).append("' and flowid='").append(cpath.getFlowid()).append("'").toString()).get(0);
        		commonNodes.add(cnode);
        	}
    	}else{
    		//说明从普通节点发送到普通节点或发送到下一个状态节点
            FlwCommonNode cur_cnode = (FlwCommonNode) flowDAO.findById(cnodeBean, nid);//当前普通节点
            commonNodes.add(cur_cnode);
            
            List list2 = flowDAO.findByWhere(cpathBean, (new StringBuilder("flowid='")).append(flowid).append("' and nodeid='").
            		append(cur_cnode.getNodeid()).append("' and startid='").append(nid).append("'").toString());
            for(int i = 0; i < list2.size(); i++)
            {
                FlwCommonNodePath cpath = (FlwCommonNodePath)list2.get(i);
                FlwCommonNode comNode = (FlwCommonNode) flowDAO.findById(cnodeBean, cpath.getEndid());
                if(comNode!=null)  commonNodes.add(comNode);
            }
    	}
        return commonNodes;
    }

    public RockUser getFlowActionPerson(String insid)
    {
        List list = flowDAO.findByWhere(logBean, (new StringBuilder("insid='")).append(insid).append("' and ftype like '%A'").toString());
        FlwLog log = (FlwLog)list.get(0);
        RockUser user = (RockUser)flowDAO.findById(userBean, log.getFromnode());
        return user;
    }
    /**
	 * 判断路由是否都已经通过审批
	 * @param insid 流程实例id
	 * @param path  路由
	 * @param limitFtime 时间限制
	 */
	public boolean isAllPassByPathAndFtime(String insid, String path, Date limitFtime){
		boolean isAllPass = false;
		try {
			if(limitFtime==null) limitFtime = sdf.parse("19700101000000");
			String   ftimeString = sdf.format(limitFtime);
			String[] cnodeArr = path.split("[`]");
			for(String cnodeid:cnodeArr){
				if(cnodeid.equals("")) continue;
				List tmp = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(cnodeid).
						append("' and insid='").append(insid).
						append("'and flag<>'-1' and to_char(ftime,'yyyymmddhh24miss')>='").append(ftimeString).
						append("'").toString(), "ftime desc");
				if(tmp.size()>0){
					FlwLog flwlog = (FlwLog) tmp.get(0);
					if(flwlog.getFlag().equals("1")){//已完成
						isAllPass = true;
						continue;
					}else{//未完成
						isAllPass = false;
						break;
					}
				}else{
					isAllPass = false;
					break;
				}
			};
		} catch (ParseException e) {
			isAllPass = false;
			e.printStackTrace();
		}
		return isAllPass;
	};
    /**
	 * 实例化状态节点下的普通节点的路由
	 * @param nodeid 状态节点
	 * @param reCreate 是否重新生成，reCreate=true,如果路由链表(Flw_Common_Node_Path_Link)中已经存
	 * 在该状态节点的路由集,则删除，重新生成，反之，有则不生成，没有则生成
	 */
    public void initCommonNodePathLink(String nodeid,boolean reCreate){
		
		List lt1 = flowDAO.findByWhere(cpathBean, (new StringBuilder("starttype='0' and nodeid='")).
				append(nodeid).append("'").toString());
		List lt2 = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
				append(nodeid).append("'").toString());
		
		if(reCreate){//需要重新生成
			JdbcUtil.execute("delete from flw_common_node_path_link where nodeid='"+nodeid+"'");
		}
		
		if(lt1.size()==1&&(reCreate||lt2.size()==0)){//状态节点连接1个普通节点并且路由没有被实例化
			Map<String,String> tmpMap = new HashMap<String,String>();//待解析的路径
			FlwCommonNodePath comNodePath = (FlwCommonNodePath) lt1.get(0);
			String flowid = comNodePath.getFlowid();//流程ID
			//和状态节点连接的第一个普通节点
			tmpMap.put(comNodePath.getEndid(), ((FlwCommonNode) flowDAO.findById(cnodeBean, comNodePath.getEndid())).getName());
			
			Object[] paths = tmpMap.keySet().toArray();
			int len = paths.length;
			int i=0;
			int count=0;//未防止意外的死循环，如果两状态节点间，所有可能路径总和超过10000条，则默认流程定义错误
			
			while(true){
				count++;
				String path = (String) paths[i++];
				String linkdec = tmpMap.get(path);
				String[] nodes = path.split("`");
				String endNode = nodes[nodes.length-1];//根据此节点查询，如果还是有后驱节点，说明路由还没完成
				
				List list = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(nodeid).
						append("' and startid='").append(endNode).append("'").toString());
				
				if(list.size()>0){//有后驱节点，说明路由还没完成
					for(int j=0;j<list.size();j++){
						FlwCommonNodePath _comNodePath = (FlwCommonNodePath) list.get(j);
						Object obj = flowDAO.findById(cnodeBean, _comNodePath.getEndid());
						String nodename = "结束";
						if(obj!=null){
							nodename = ((FlwCommonNode)obj).getName();
						}
						//添加新的待解析的路径
						tmpMap.put(path.concat("`").concat(_comNodePath.getEndid()),linkdec.concat("`").concat(nodename));
					}
				}else{//路由完成，添加到数据库
					FlwCommonNodePathLink linklist = new FlwCommonNodePathLink();
					linklist.setFlowid(flowid);
					linklist.setLinkpath(path);
					linklist.setNodeid(nodeid);
					linklist.setLinkdec(linkdec);
					
					flowDAO.saveOrUpdate(linklist);
				}
				//移除path路径，如果path路径已经连接到了下一个状态节点，则会保存到数据库路由链表，如果path路径没有连接到下一个状态节点，则继续解析
				tmpMap.remove(path);
				
				if(count>10000) break;
				
				if(i<=len){
					if(tmpMap.size()>0){//还存在待解析的路由
						paths = tmpMap.keySet().toArray();
						len = paths.length;
						i=0;
					}else{
						break;
					} 
				}else{
					break;
				}
			}
		}
    };
    /**
	 * 插入日志记录
	 * @param flwlog 新的日志对象
	 * @param logid 当前日志id
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
    public synchronized boolean insertFlwLog(FlwLog flwLog, String logid, HttpServletRequest request)
        throws SQLException, BusinessException
    {
        FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);//获取当前代办的日志对象
        flwLog.setFromnodeid(log.getNodeid());//设置发送节点
        flwLog.setIsresend("0");
        if(log.getFlag().equals("1"))
            return false;
        try
        {
        	
            if("7".equals(log.getFtype())||"7A".equals(log.getFtype())){//7A流程发起
            	addChangeStateLog(log.getLogid());//状态节点改变时系统日志
            }else if("3".equals(log.getFtype())){
            	finishedTask(log.getLogid());//任务节点系统日志
            }
            log.setFlag("1");//标记当前代办为完成状态
            flowDAO.saveOrUpdate(log);//更新当前代办记录
            
            FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
            flwLog.setFlwInstance(ins);

            if("0".equals(flwLog.getFtype()))//单向，目前系统的流程都用的是单向
            {
				flowDAO.insert(flwLog);
            }	
            else if("1".equals(flwLog.getFtype()))
            {
                String toNodes[] = flwLog.getTonode().split(":");
                for(int i = 0; i < toNodes.length; i++)
                {
                    flwLog.setTonode(toNodes[i]);
                    flowDAO.insert(flwLog);
                }
            } 
            else if("2".equals(flwLog.getFtype()))
            {
                String toNodes[] = flwLog.getTonode().split(":");
                for(int i = 0; i < toNodes.length; i++)
                {
                    flwLog.setTonode(toNodes[i]);
                    flowDAO.insert(flwLog);
                }

            } 
            else  if("3".equals(flwLog.getFtype()))
            {
				flowDAO.insert(flwLog);
            }
            else if("4".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
                if(checkSignature(log, log.getFlwInstance().getInsid()))
                    addSysFlwLog(ins, flwLog.getFtime(), log.getFromnode(), "会签");
            } 
            else if("5".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
                setOtherFlowLog(log, log.getFlwInstance().getInsid());
                addSysFlwLog(ins, flwLog.getFtime(), log.getFromnode(), "优先处理");
            } 
            else if("6".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
                addTaskFlwLog(ins, flwLog.getFtime(), log.getFromnode(), "任务");
            } 
            else if("7".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
            }	
            else
            if("8".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
                removeCommitState(ins);
            } else
            if("10".equals(flwLog.getFtype()))
            	flowDAO.insert(flwLog);
            else
            if("11".equals(flwLog.getFtype()))
            {
                flwLog.setFromnode(getFlowActionPerson(log.getFlwInstance().getInsid()).getUserid());
                flowDAO.insert(flwLog);
            } else
            if("12".equals(flwLog.getFtype()))
            {
            	flowDAO.insert(flwLog);
                removeCommitState(ins);
            } else
            if("13".equals(flwLog.getFtype()))
            {
                flwLog.setFromnode(getFlowActionPerson(log.getFlwInstance().getInsid()).getUserid());
                flowDAO.insert(flwLog);
                removeCommitState(ins);
            } else
            if("TA".equals(flwLog.getFtype()))
            {
                List l = flowDAO.findByWhere(nodeBean, "flowid='"+log.getFlwInstance().getFlwDefinition().getFlowid()+"' and type='0'");
            	flwLog.setTonode(getFlowActionPerson(log.getFlwInstance().getInsid()).getUserid());
            	flwLog.setNodeid(((FlwNode)l.get(0)).getNodeid());
            	flowDAO.insert(flwLog);
            }

//            crossDomainInsertFlwTask(flwLog, request);
          //跨系统流程处理的数据交互
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    };
	public FlwDwrRtnLog isToBackOk(String logid)
    {
        return null;
    };
    /**
	 * 查询经过节点普通节点cnodeid并且位于普通节点cnodeid之前的第一个分裂节点
	 * @param cnodeid 
	 * @return 如果没有查询到则放回 ""
	 */
	public String lastSplitCnodeid(String cnodeid) {
		String splitCnodeid = "";
		Object obj = flowDAO.findByCompId(cnodeBean, cnodeid);
		if(obj!=null){
			String nodeid = ((FlwCommonNode)obj).getNodeid();
			List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(nodeid).
					append("' and linkpath like '%").append(cnodeid).append("%'").toString());
			
			if(_linkList.size()>0){
				String pathStr = ((FlwCommonNodePathLink) _linkList.get(0)).getLinkpath();
				pathStr = pathStr.substring(0, pathStr.indexOf(cnodeid));
				String[] pathArr = pathStr.split("[`]");
				
				for(int len=pathArr.length,i=len-1;i>=0;i--){
					String _cnodeid = pathArr[i];
					if(cnodeid!=null&&!cnodeid.equals("")&&!_cnodeid.equals("")){
						int count = flowDAO.findByWhere(cpathBean, (new StringBuilder("nodeid='")).append(nodeid).
								append("' and startid = '").append(_cnodeid).append("'").toString()).size();
						if(count>1){
							splitCnodeid = _cnodeid;
							break;
						}
					}
				}
			}
		};
		
		return splitCnodeid;
	};
    /**
	 * 退回时删除状态节点路由（调整表FLW_INSTANCE的worklog字段）
	 * @param ins
	 */
    public void removeCommitState(FlwInstance ins)
    {
        String workLog = ins.getWorklog();
        int eIndex = workLog.lastIndexOf(",");
        if(eIndex < 0)
            workLog = "";
        else
            workLog = workLog.substring(0, eIndex);
        ins.setWorklog(workLog);
        flowDAO.saveOrUpdate(ins);
    }
    /**
	 * 重新发送
	 * @param logid
	 * @param insid
	 * @param nodeid
	 * @param log
	 * @return
	 */
    public FlwDwrRtnLog resendFlow(String logid, FlwLog newlog){
    	FlwDwrRtnLog rtnlog = new FlwDwrRtnLog();
    	try{
    		
	    	FlwLog log = (FlwLog) flowDAO.findById(logBean, logid);
	    	FlwInstance ins = (FlwInstance) flowDAO.findById(insBean,log.getFlwInstance().getInsid());
	    	FlwCommonNode comnode = (FlwCommonNode) flowDAO.findById(cnodeBean, log.getFromnodeid());

	    	newlog.setFlwInstance(ins);
	    	newlog.setFromnode(log.getTonode());
	    	newlog.setTonode(log.getFromnode());
	    	newlog.setFromnodeid(log.getNodeid());
	    	newlog.setNodeid(log.getFromnodeid());
	    	newlog.setNodename(comnode.getName());
	    	newlog.setFlag("0");
	    	newlog.setIsresend("0");
	    	newlog.setFtype("P");
	    	
	    	//从普通节点发送到普通节点
	    	if(flowDAO.findById(nodeBean, newlog.getFromnodeid())==null){
	    		//判断接受节点的合并类型
	    		FlwCommonNode cnodehbm = (FlwCommonNode) flowDAO.findById(cnodeBean, newlog.getNodeid());
	    		String cnodetype = cnodehbm.getMerge();//接受节点的类型
	    		String acceptCnodeid = newlog.getNodeid();
	    		String splitnode = this.lastSplitCnodeid(newlog.getNodeid());
	    		HashMap<String, String> pathMap = new HashMap<String, String>();
	    		
	    		if(cnodetype.equalsIgnoreCase(MOR)){//选择性合并
	    			boolean isExistAgree = false;
	    			List list = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(splitnode).
                			append("' and insid='").append(ins.getInsid()).append("' and flag='1' and isresend='0'").
                			toString(),"ftime desc");
                	FlwLog fg = (FlwLog) list.get(0);//最后一次发送到分裂节点的日志
                	String[] acnodes = fg.getTocnodes().split("[`]");//最近的分裂节点分裂到了哪些普通节点
            		
            		for(int i=0;i<acnodes.length;i++){
            			String tmpnode = acnodes[i];
            			if(tmpnode.equals("")) continue;
            			List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
            					append(cnodehbm.getNodeid()).append("' and linkpath like '%").append(tmpnode).append("`%").
            					append(acceptCnodeid).append("%'").toString());
            			
            			FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) _linkList.get(0);
        				String pathlink = linkHbm.getLinkpath();
        				pathlink = pathlink.substring(pathlink.indexOf(tmpnode), pathlink.indexOf(acceptCnodeid));
            			
        				pathMap.put(pathlink, null);
            		};
            		
            		for(Iterator<String> it=pathMap.keySet().iterator();it.hasNext();){
            			if(this.isAllPassByPathAndFtime(ins.getInsid(), it.next(), fg.getFtime())){//只要有一条通过，则不产生代办
            				isExistAgree = true;
            				break;
            			};
            		};
            		if(!isExistAgree){
            			flowDAO.insert(newlog);
            		};
	    		}else if(cnodetype.equalsIgnoreCase(MAND)){
	    			boolean isAllAgree = true;//是否所有指向给合并节点的路由都经过审批
	    			List list = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(splitnode).
                			append("' and insid='").append(ins.getInsid()).append("' and flag='1' and isresend='0'").toString(),"ftime desc");
                	FlwLog fg = (FlwLog) list.get(0);//最后一次发送到分裂节点的日志
                	String[] acnodes = fg.getTocnodes().split("[`]");//最近的分裂节点分裂到了哪些普通节点
                	
            		for(int i=0;i<acnodes.length;i++){
            			String tmpnode = acnodes[i];
            			if(tmpnode.equals("")) continue;
            			List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
            					append(cnodehbm.getNodeid()).append("' and linkpath like '%").append(tmpnode).append("`%").
            					append(acceptCnodeid).append("%'").toString());
            			FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) _linkList.get(0);
        				String pathlink = linkHbm.getLinkpath();
        				pathlink = pathlink.substring(pathlink.indexOf(tmpnode), pathlink.indexOf(acceptCnodeid));
        				
        				if(pathlink.indexOf(newlog.getFromnodeid())>-1) continue;//剔除现在处理的支路
        				pathMap.put(pathlink, null);
            		}
            		
            		for(Iterator<String> it=pathMap.keySet().iterator();it.hasNext();){
            			if(!(this.isAllPassByPathAndFtime(ins.getInsid(), it.next(), fg.getFtime()))){//只要有一条未通过，则不产生代办
            				isAllAgree = false;
            				break;
            			};
            		}
            		
        			if(isAllAgree){
        				flowDAO.insert(newlog);
        			}
	    		}else{
	    			flowDAO.insert(newlog);
	    		}
	    	}else{
	    		flowDAO.insert(newlog);
	    	}
	    	
	    	if(log.getMarks()!=null){
		    	String[] logidArr = log.getMarks().split("[`]");
		    	for(int i=0,j=logidArr.length;i<j;i++){
		    		String _logid = logidArr[i];
		    		if(!_logid.equals("")){
		    			Object obj = flowDAO.findById(logBean, _logid);
		    			if(obj!=null){
		    				FlwLog _log = (FlwLog) obj;
		    				_log.setFlag("0");
		    				flowDAO.saveOrUpdate(_log);
		    			}
		    		}
		    	}
	    	}
	    	
	    	log.setFlag("1");
	    	log.setIsresend("1");//重新发送到退回节点
	    	flowDAO.saveOrUpdate(log);
	    	
	    	rtnlog.setFlag(true);
	    	
	    	//跨系统流程处理的数据交互	added by Liuay 2011-10-31
	    	WebContext webContext = WebContextFactory.get(); 
		    HttpServletRequest request = webContext.getHttpServletRequest();
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
    	}catch(RuntimeException ex){
    		ex.printStackTrace();
    		rtnlog.setSuccess(false);
    		rtnlog.setErrormsg("抛出异常："+ex.getMessage());
    	}
    	return rtnlog;
    };
    public void setOtherFlowLog(FlwLog flwLog, String insid)
    {
        String times = (new SimpleDateFormat("yyyy-MM-dd kk:mm:ss")).format(flwLog.getFtime());
        StringBuffer sbf = new StringBuffer("flag = '0'");
        sbf.append((new StringBuilder(" and insid = '")).append(insid).append("'").toString());
        sbf.append((new StringBuilder(" and ftime = to_date('")).append(times).append("','yyyy-mm-dd hh24:mi:ss')").toString());
        sbf.append((new StringBuilder(" and fromnode = '")).append(flwLog.getFromnode()).append("'").toString());
        sbf.append((new StringBuilder(" and logid <> '")).append(flwLog.getLogid()).append("'").toString());
        List list = flowDAO.findByWhere(logBean, sbf.toString());
        if(list.isEmpty())
            return;
        FlwLog obj_flwLog;
        for(Iterator iterator = list.iterator(); iterator.hasNext(); flowDAO.saveOrUpdate(obj_flwLog))
        {
            obj_flwLog = (FlwLog)iterator.next();
            obj_flwLog.setFlag("1");
        }

    }
    /**
	 * 功能描述：当前节点为状态节点，接受节点为普通节点时，添加状态改变系统提示，把该节点下所有普通节点保存到普通节点路由实例
	 * 		   当前节点为普通节点，则删除普通节点实例代办（删除表FLW_COMMON_CURRENT_NODE_INS中相关记录）
	 * @param flowid
	 * @param logid
	 * @param insid
	 * @param nodeid
	 * @param cnodeid
	 */
    public void setFinishPrev(String flowid, String logid, String insid, String nodeid, String cnodeid)
    {
        FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
        if("7".equals(log.getFtype()) || "7A".equals(log.getFtype()) || "7T".equals(log.getFtype()))
        {
            addChangeStateLog(log.getLogid());//状态改变系统提示
        } 
        log.setFlag("1");
        flowDAO.saveOrUpdate(log);
    };
    /**
     * 
    * @Description: 判断当前节点是否是多节点汇总中的最后一个被处理的节点
    * @param logid 当前日志ID
    * @param insid  实例ID
    * @param nodeid  当前状态节点
    * @param currentCnodeid  当前普通节点
    * @param nextNodeid  当前普通节点的下一普通节点id
    * @return boolean    
     */
    public boolean isLastSender(String logid, String insid, String nodeid, String currentCnodeid,String nextNodeid){
    	//判断接收节点的合并类型
    	FlwCommonNode nCommonNode = (FlwCommonNode)flowDAO.findById(cnodeBean, nextNodeid);
        String nodeType = nCommonNode.getMerge();//节点的合并类型;
        if(nodeType.equals(MAND)){//无条件合并
	    	this.initCommonNodePathLink(nodeid, true);//两相邻状态节点的所有路由线路
			//查询上一个分裂节点，然后从日志中查询它发送的最近的记录，从记录中可以得知发送到了那些分支，判断这些分支的完成情况
			String splitnode = this.lastSplitCnodeid(nextNodeid);
			if(splitnode.length()==0){//如果splitnode为空字符串，则不存在分裂和汇总节点
				return false;
			}
			List list = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(splitnode).append("' and insid='").append(insid).append("' and flag='1' and isresend='0'").toString(), "ftime desc");
			FlwLog fg = (FlwLog)list.get(0);//最后一次发送到分裂节点的日志
			String acnodes[] = fg.getTocnodes().split("[`]");//最近的分裂节点分裂到了哪些普通节点
			HashMap<String,String> pathMap = new HashMap();
			boolean isAllAgree = true;//是否所有指向给合并节点的路由都经过审批
			for (int i = 0; i < acnodes.length; i++)
			{
				String tmpnode = acnodes[i];
				if(tmpnode.equals("")) continue;
				List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
						append(nCommonNode.getNodeid()).append("' and linkpath like '%").append(tmpnode).append("`%").
						append(nextNodeid).append("%'").toString());
				FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) _linkList.get(0);
				String pathlink = linkHbm.getLinkpath();
				pathlink = pathlink.substring(pathlink.indexOf(tmpnode), pathlink.indexOf(nextNodeid)-1);
				
				if(pathlink.indexOf(currentCnodeid)>-1) continue;//剔除现在处理的支路
				
				pathMap.put(pathlink, null);
			}
			for (Iterator<String> it = pathMap.keySet().iterator(); it.hasNext();){
				if (!(this.isAllPassByPathAndFtime(insid, it.next(), fg.getFtime())))//只要有一条未通过，则不能选择下一步处理人
				{
					isAllAgree = false;
					break;
				}
			}
			if(isAllAgree){
				return false;
			}
        }else{
        	return false;
        }
		return true;
	}
    /**
	 * 发送到普通节点
	 * @param logid 当前ID
	 * @param insid 实例ID
	 * @param nodeid 当前状态节点
	 * @param currentCnodeid 当前普通节点 
	 * @param logList 日志集(当要发送到多个人时，会有多条记录)
	 * @return
	 */
    public boolean sendToCommonFlow(String logid,String insid, String nodeid, String currentCnodeid, String logListStr)
    {
    	WebContext webContext = WebContextFactory.get(); 
        HttpServletRequest request = webContext.getHttpServletRequest();
        
    	Date date = new Date();
    	JSONArray ja = JSONArray.fromObject(logListStr);
	    List logList = JSONArray.toList(ja, FlwLog.class);
        try{
        	this.initCommonNodePathLink(nodeid,true);//两相邻状态节点的所有路由线路
        	FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
            
        	//如果当前节点是分裂节点，无论是无条件分裂还是选择性分裂，都要记录它分裂到了那些节点，记录形式 节点1`节点2`节点3
        	String tocnodes = "";//发送到的节点 用"`"分割
        	
            for(int x = 0; x < logList.size(); x++){
                FlwLog flwLog = (FlwLog)logList.get(x);
                flwLog.setIsresend("0");//按照路由发送
                flwLog.setFromnodeid(log.getNodeid());//设置发送节点
                flwLog.setFtime(date);//发送到多个节点时，统一发送时间，这样可以通过时间来判断，分裂节点第一次发送到了那些分支
                flwLog.setFlwInstance(((FlwInstance)flowDAO.findById(insBean, insid)));
                
                String acceptCnodeid = flwLog.getNodeid();//要发送到的普通节点
                if(tocnodes.equals("")){
                	tocnodes += acceptCnodeid;
                }else{
                	tocnodes += "`"+acceptCnodeid;
                }
                
                //判断接收节点的合并类型
                FlwCommonNode commonNode = (FlwCommonNode) flowDAO.findById(cnodeBean, acceptCnodeid);
                String nodeType = commonNode.getMerge();//节点的合并类型;
                
                if(nodeType.equals(DEFUAL)){
                	//接收节点的合并特性是普通，发送后需要有代办提醒
                	flwLog.setFlag("0");
					flowDAO.insert(flwLog);

                    //	发送跨系统的代办事项
//                    crossDomainInsertFlwTask(flwLog, request);
                }else{
                	//查询上一个分裂节点，然后从日志中查询它发送的最近的记录，从记录中可以得知发送到了那些分支，判断这些分支的完成情况
                	String splitnode = this.lastSplitCnodeid(acceptCnodeid);
                	List list = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(splitnode).
                			append("' and insid='").append(insid).append("' and flag='1' and isresend='0'").toString(),"ftime desc");
                	FlwLog fg = (FlwLog) list.get(0);//最后一次发送到分裂节点的日志
                	String[] acnodes = fg.getTocnodes().split("[`]");//最近的分裂节点分裂到了哪些普通节点
                	HashMap<String,String> pathMap  = new HashMap();

                	if(nodeType.equals(MOR)){//接受节点的合并特性是选择性合并
                		boolean isExistAgree = false;
                		for(int i=0;i<acnodes.length;i++){
                			String tmpnode = acnodes[i];
                			if(tmpnode.equals("")) continue;
                			List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
                					append(commonNode.getNodeid()).append("' and linkpath like '%").append(tmpnode).append("`%").
                					append(acceptCnodeid).append("%'").toString());
                			
                			FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) _linkList.get(0);
            				String pathlink = linkHbm.getLinkpath();
            				pathlink = pathlink.substring(pathlink.indexOf(tmpnode), pathlink.indexOf(acceptCnodeid));
                			
            				pathMap.put(pathlink, null);
                		};
                		
                		for(Iterator<String> it=pathMap.keySet().iterator();it.hasNext();){
                			if(this.isAllPassByPathAndFtime(insid, it.next(), fg.getFtime())){//只要有一条通过，则不产生代办
                				isExistAgree = true;
                				break;
                			};
                		};
                		
                		if(!isExistAgree){
                			flwLog.setFlag("0");
        					flowDAO.insert(flwLog);

                			//【C】
                			boolean lastNode = this.isLastSender(logid, insid, nodeid, currentCnodeid, flwLog.getNodeid());
                			//lastNode = true 则不是最后一个发送的节点
                			if(!lastNode){
                				List<FlwLog> flwLogList = this.flowDAO.findByWhere(logBean, 
                						(new StringBuilder("insid='")).append(flwLog.getFlwInstance().getInsid()).
            							append("' and nodeid='").append(flwLog.getNodeid()).append("'").toString());
                				for (int i = 0; i < flwLogList.size(); i++) {
                					FlwLog beforeFlwLog = flwLogList.get(i);
                					beforeFlwLog.setTonode(flwLog.getTonode());
                					flowDAO.saveOrUpdate(beforeFlwLog);
								}
                			}
                			
                			 //	发送跨系统的代办事项
//                            crossDomainInsertFlwTask(flwLog, request);
                		}
                	}else{
                		//无条件合并，只有当所有节点通过审批后，才能发送到此节点
                		boolean isAllAgree = true;//是否所有指向给合并节点的路由都经过审批
                		for(int i=0;i<acnodes.length;i++){
                			String tmpnode = acnodes[i];
                			if(tmpnode.equals("")) continue;
                			List _linkList = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).
                					append(commonNode.getNodeid()).append("' and linkpath like '%").append(tmpnode).append("`%").
                					append(acceptCnodeid).append("%'").toString());
                			FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) _linkList.get(0);
            				String pathlink = linkHbm.getLinkpath();
            				pathlink = pathlink.substring(pathlink.indexOf(tmpnode), pathlink.indexOf(acceptCnodeid)-1);
            				
            				if(pathlink.indexOf(currentCnodeid)>-1) continue;//剔除现在处理的支路
            				
            				pathMap.put(pathlink, null);
                		}
                		
                		for(Iterator<String> it=pathMap.keySet().iterator();it.hasNext();){
                			if(!(this.isAllPassByPathAndFtime(insid, it.next(), fg.getFtime()))){//只要有一条未通过，则不产生代办
                				isAllAgree = false;
                				break;
                			};
                		}
                		
                		
            			if(isAllAgree){//完成会签
                			flwLog.setFlag("0");
        					flowDAO.insert(flwLog);
                			
                			//【B】.
                			//分裂的节点无条件合并时，需要记录所有节点的处理日志，
                			//最后一个节点，选择窗口中接受人为节点配置，但也可以手动修改，
                			//因此在最后一个节点保存时，需要同步修改其他节点的接受人
                			boolean lastNode = this.isLastSender(logid, insid, nodeid, currentCnodeid, flwLog.getNodeid());
                			//lastNode = true 则不是最后一个发送的节点
                			if(!lastNode){
                				List<FlwLog> flwLogList = this.flowDAO.findByWhere(logBean, 
                						(new StringBuilder("insid='")).append(flwLog.getFlwInstance().getInsid()).
            							append("' and nodeid='").append(flwLog.getNodeid()).append("'").toString());
                				for (int i = 0; i < flwLogList.size(); i++) {
                					FlwLog beforeFlwLog = flwLogList.get(i);
                					beforeFlwLog.setTonode(flwLog.getTonode());
                					flowDAO.saveOrUpdate(beforeFlwLog);
								}
                			}
                			
                			//	发送跨系统的代办事项
//                            crossDomainInsertFlwTask(flwLog, request);
                		} else {
                			//【A】.
                			//分裂的节点无条件合并时，需要记录所有节点的处理日志，
                			//非最后一个处理节点，接受人为该节点配置的默认接受人（ISTOPROMOTER=S）或流程发起人（ISTOPROMOTER=P），
                			//并且流程标识已完成（flag=1）
                			//flwLog.setFlag("0");
                			flowDAO.insert(flwLog);
                		}
                	}
                }
            }
            log.setTocnodes(null);
            log.setFlag("1");
            log.setIsresend("0");
            //如果是从状态节点发送到普通节点，那么当前的普通节点是不存在的
            FlwCommonNode comnode = (FlwCommonNode) flowDAO.findById(cnodeBean, log.getNodeid());
        	if(comnode!=null){//可以证明是从普通节点到普通节点
        		String cntype = comnode.getBifurcate();//分裂类型
        		if(!cntype.equalsIgnoreCase(DEFUAL)){
        			log.setTocnodes(tocnodes);
        		}
        	}else{
        		FlwNode node = (FlwNode) flowDAO.findById(nodeBean, log.getNodeid());
        		String strWhere = (new StringBuilder("insid='")).append(log.getFlwInstance().getInsid()).
        					append("' and nodeid='").append(node.getNodeid()).append("'").toString();
        		List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, strWhere);
            	for(int i = 0; i < dataInfoList.size(); i++)
                {        	
        			InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
                    String strParams = datInfo.getParamvalues();
                    String params[] = strParams.split("`");
                	if(datInfo.getTablename()!=null&&!(datInfo.getTablename().equals("")))
                    {
                    	JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
                    	strWhere = "";
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
                        if(!strWhere.equals("")){
                        	try{//更新字段bill_state
                        		String sql = "update "+datInfo.getTablename()+" set bill_state='-1' where "+strWhere;
                        		jdbc.update(sql);
                        	}catch(Exception ex){//表datInfo.getTablename()没有bill_state字段,从属性配置表中读取设置
                        		List lt = jdbc.queryForList("select t.PROPERTY_NAME from property_code t " +
                    					"where upper(property_Code)='"+datInfo.getTablename().toUpperCase()+"' and module_Name='流程字段'");
                        		if(lt.size()>0){
                        			Map map = (Map) lt.get(0);
                        			if(map.get("PROPERTY_NAME")!=null&&!(map.get("PROPERTY_NAME").toString().equals(""))){
                        				try{
                        					String sql = "update "+datInfo.getTablename()+" set "+map.get("PROPERTY_NAME").toString()+"='-1' where "+strWhere;
            	                    		jdbc.update(sql);
                        				}catch(Exception ex1){
                        					ex1.printStackTrace();
                        				}
                        			}
                        		}
                        	}
                        }
                    }
                }
        	}
        	
            flowDAO.saveOrUpdate(log);
            //当前待办log状态flag改为1的同时，同级别的无条件合并的log的状态-1修改为1
			String where = "insid = '" + log.getFlwInstance().getInsid()
					+ "' and nodeid = '" + log.getNodeid()
					+ "' and tonode = '" + log.getTonode()
					+ "' and ftype = 'P' and flag = '-1'";
			List listLog = this.flowDAO.findByWhere(logBean, where);
			for (int i = 0; i < listLog.size(); i++) {
				FlwLog log2 = (FlwLog) listLog.get(i);
				log2.setFlag("1");
				flowDAO.saveOrUpdate(log2);
			}
            
          //跨系统流程处理的数据交互	added by Liuay 2011-10-31
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
        }catch(RuntimeException e){
            e.printStackTrace();
            return false;
        }
        return true;
    };
    /**
	 * 发送到状态节点
	 * @param flwLog 新的日志对象
	 * @param logid  当前日志id
	 * @param nodeid 当前节点id
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
    public boolean sendToStateFlow(FlwLog flwLog, String logid, String nodeid)
        throws SQLException, BusinessException
    {
    	WebContext webContext = WebContextFactory.get(); 
        HttpServletRequest request = webContext.getHttpServletRequest();
        insertFlwLog(flwLog, logid, request);
        try
        {
            FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
            FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
            String worklog = ins.getWorklog() != null ? (new StringBuilder(String.valueOf(ins.getWorklog()))).append(",").append(nodeid).toString() : nodeid;
            ins.setWorklog(worklog);
            flowDAO.saveOrUpdate(ins);
            
            FlwNode node = (FlwNode) flowDAO.findById(nodeBean, log.getNodeid());
            if(node!=null)
            {
        		String strWhere = (new StringBuilder("insid='")).append(log.getFlwInstance().getInsid()).
        					append("' and nodeid='").append(node.getNodeid()).append("'").toString();
        		List dataInfoList = flowDAO.findByWhere2(insDataInfoViewBean, strWhere);
            	for(int i = 0; i < dataInfoList.size(); i++)
                {        	
        			InsDataInfoView datInfo = (InsDataInfoView)dataInfoList.get(i);
                    String strParams = datInfo.getParamvalues();
                    String params[] = strParams.split("`");
                	if(datInfo.getTablename()!=null&&!(datInfo.getTablename().equals("")))
                    {
                    	JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
                    	strWhere = "";
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
                        if(!strWhere.equals("")){
                        	try{//更新字段bill_state
                        		String sql = "update "+datInfo.getTablename()+" set bill_state='-1' where "+strWhere;
                        		jdbc.update(sql);
                        	}catch(Exception ex){//表datInfo.getTablename()没有bill_state字段,从属性配置表中读取设置
                        		List lt = jdbc.queryForList("select t.PROPERTY_NAME from property_code t " +
                    					"where upper(property_Code)='"+datInfo.getTablename().toUpperCase()+"' and module_Name='流程字段'");
                        		if(lt.size()>0){
                        			Map map = (Map) lt.get(0);
                        			if(map.get("PROPERTY_NAME")!=null&&!(map.get("PROPERTY_NAME").toString().equals(""))){
                        				try{
                        					String sql = "update "+datInfo.getTablename()+" set "+map.get("PROPERTY_NAME").toString()+"='-1' where "+strWhere;
            	                    		jdbc.update(sql);
                        				}catch(Exception ex1){
                        					ex1.printStackTrace();
                        				}
                        			}
                        		}
                        	}
                        }
                    }
                }
            }
            
          //跨系统流程处理的数据交互
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    
    public boolean sendFileToOthers(String insid, String list)
    {
    	String str[]=list.split("##");
    	for(int i=0;i<str.length;i++){
    		String strSub[] = str[i].split("`");
    		String fromnode =strSub[0];
    		String tonode = strSub[1];
    		Date ftime = new Date();
    		String ftype = strSub[3];
    		String notes =strSub[4];
    		String flag = strSub[5];
    		String nodename =strSub[6];
    		String nodeid = "";
    		FlwLog flwLog = new FlwLog();
    		flwLog.setFromnode(fromnode);
    		flwLog.setTonode(tonode);
    		flwLog.setFtime(ftime);
    		flwLog.setFtype(ftype);
    		flwLog.setNotes(notes);
    		flwLog.setFlag(flag);
    		flwLog.setNodename(nodename);
    		flwLog.setNodeid(nodeid);
    		flwLog.setIsresend("0");
			FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, insid);
    		flwLog.setFlwInstance(ins);
    		flwLog.setFtype("S");
    		flowDAO.insert(flwLog);
			
    	}
    /*	for(int i = 0; i < logList.size(); i++)
    	{
    		FlwLog flwLog = (FlwLog)logList.get(i);
    		FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, insid);
    		flwLog.setFlwInstance(ins);
    		flwLog.setFtype(DEFUAL);
    		flowDAO.insert(flwLog);
    	}*/
    	
    	return true;
    }
    /**
	 * 普通节点的退回，并且该节点不是第一个普通节点，也就是该退回节点的上一个节点必须满足是普通节点
	 * @param flowid 流程id
	 * @param insid  流程实例id
	 * @param nodeid 当前状态节点id
	 * @param cnodeid 当前普通节点id
	 * @param logid   当前日志id
	 * @param flwLog  退回日志对象
	 * @return
	 */
    public FlwDwrRtnLog toBackCommon(String flowid, String insid, String nodeid, String cnodeid, String logid, FlwLog flwLog)
    {
    	FlwDwrRtnLog rtnlog = new FlwDwrRtnLog();
    	try
        {
        	this.initCommonNodePathLink(nodeid, true);
        	FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
        	log.setFlag("1");
        	flowDAO.saveOrUpdate(log);
        	FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
        	String ftimestring = sdf.format(log.getFtime());
        	//判断当前普通节点的合并类型
        	FlwCommonNode currCnodeHbm = (FlwCommonNode) flowDAO.findById(cnodeBean, cnodeid);
        	String currCnodeMergeType = currCnodeHbm.getMerge();
        	List prevCnodesList = flowDAO.findByWhere(cpathBean, (new StringBuilder("endid='")).append(cnodeid).
        			append("' and nodeid='").append(nodeid).append("' and flowid='").append(flowid).append("'").toString());
        	
        	//当前节点普通节点的合并类型是普通
        	if(currCnodeMergeType.equals(DEFUAL)){
        		if(prevCnodesList.size()>0){
        			FlwCommonNode prevCnodeHbm = (FlwCommonNode) flowDAO.findById(cnodeBean, ((FlwCommonNodePath)prevCnodesList.get(0)).getStartid());
        			String prevCnodeid = prevCnodeHbm.getCnodeid();//要退回的普通节点id
        			List clt = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("insid='")).append(ins.getInsid()).
    						append("' and nodeid='").append(prevCnodeid).
    						append("' and flag='1' and ftype='P'").toString(),"ftime desc");
        			FlwLog log1 = new FlwLog();
        			if(clt.size()>0){
        				FlwLog cpreLog=(FlwLog) clt.get(0);
        				log1.setFlwInstance(ins);
        				log1.setFromnode(log.getTonode());//退回人
        				log1.setNodename(prevCnodeHbm.getName());//退回到节点的名称
        				log1.setNodeid(prevCnodeid);//退回到的节点id
        				log1.setFtime(flwLog.getFtime());
        				log1.setNotes(flwLog.getNotes());
        				log1.setFlag(flwLog.getFlag());
        				log1.setFtype(flwLog.getFtype());
        				log1.setFromnodeid(log.getNodeid());
        				log1.setIsresend("0");
        				log1.setTonode(cpreLog.getTonode());
        			}
        			
        			if(prevCnodeHbm.getBifurcate().equals(DEFUAL)){
        				flowDAO.insert(log1);
        			}else{
        				//含有分支，自动处理位于pCnodeid节点后的节点的代办事项（把flag置为-1，表示系统关系），当pCnodeid重新发送到退回给他的节点时再把（flag=0）
        				String marks = "";
        				Map<String,String> nodemap = new HashMap<String,String>();
        				List lt = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(nodeid).
        						append("' and linkpath like '%").append(prevCnodeid).append("%'").toString());
        				//位于上一个普通节点后的节点，剔除当前节点
        				for(Iterator it1=lt.iterator();it1.hasNext();){
        					FlwCommonNodePathLink linkhbm = (FlwCommonNodePathLink) it1.next(); 
        					String linkpath = linkhbm.getLinkpath();
        					linkpath = linkpath.substring(linkpath.indexOf(prevCnodeid)+prevCnodeid.length());
        					
        					String[] cnodeids = linkpath.split("[`]");
        					for(String _cnodeid : cnodeids){
        						if(!(_cnodeid.equals(""))&&!(_cnodeid.equals(log1.getFromnodeid()))&&!(_cnodeid.equals("0"))){
        							nodemap.put(_cnodeid, null);
        						}
        					}
        				}
        				//查找上一节点后的代办
        				for(Iterator<String> it2=nodemap.keySet().iterator();it2.hasNext();){
        					String _cnodeid = it2.next();
        					List _lt = flowDAO.findByWhere(logBean, (new StringBuilder("insid='")).append(ins.getInsid()).
        							append("' and nodeid='").append(_cnodeid).append("' and flag='0'").toString());
        					for(Iterator it3=_lt.iterator();it3.hasNext();){
        						FlwLog loghbm = (FlwLog) it3.next();
        						loghbm.setFlag("-1");
        						flowDAO.saveOrUpdate(loghbm);
        						
        						if(marks.equals("")){
        							marks+=loghbm.getLogid();
        						}else{
        							marks+="`"+loghbm.getLogid();
        						}
        					}
        				}
        				log1.setMarks(marks);
        				flowDAO.insert(log1);
        			}
        		}
        	}else{//有多个分支汇集到当前节点
        		String splitnode = this.lastSplitCnodeid(log.getNodeid());//位于当前节点之前的上一个分裂节点
        		//最后一次发送到分裂节点的日志，(不包含重新发送)
        		List lfg = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("nodeid='")).append(splitnode).
        				append("' and insid='").append(insid).append("' and flag='1' and isresend='0'").toString(),"ftime desc");
        		FlwLog fg = (FlwLog) lfg.get(0);
        		Date  ftime = fg.getFtime();//分裂节点最后一个发送时间(剔除重新发送情况，因为重新发送时并没有选择发送到哪些节点)
        		String[] splitToCnodes = fg.getTocnodes().split("[`]");//最近的分裂节点分裂到了哪些普通节点
        		
        		
        		for(String acnodeid : splitToCnodes){
        			List lt1 = flowDAO.findByWhere(cpathlinkBean, (new StringBuilder("nodeid='")).append(nodeid).
        					append("' and linkpath like '%").append(acnodeid).append("`%").append(log.getNodeid()).
        					append("%'").toString());
        			FlwCommonNodePathLink linkHbm = (FlwCommonNodePathLink) lt1.get(0);
        			String linkpath = linkHbm.getLinkpath();
        			linkpath = linkpath.substring(linkpath.indexOf(acnodeid), linkpath.indexOf(log.getNodeid())-1);
        			
        			if(this.isAllPassByPathAndFtime(insid, linkpath, ftime)){
        				String[] tmpArr = linkpath.split("[`]");
        				String prevCnodeid = tmpArr[tmpArr.length-1];
        				FlwCommonNode prevCnodeHbm = (FlwCommonNode) flowDAO.findById(cnodeBean, prevCnodeid);
        				List lt2 = flowDAO.queryWhereOrderBy(logBean, (new StringBuilder("insid='")).append(ins.getInsid()).
        						append("' and nodeid='").append(prevCnodeid).
        						append("' and flag='1' and ftype='P' and to_char(ftime,'yyyymmddhh24miss')>='").
        						append(sdf.format(ftime)).append("'").toString(), "ftime desc");
        				if(lt2.size()>0){
        					FlwLog preLog=(FlwLog) lt2.get(0);//最近的分裂节点的分裂日志
        					FlwLog logtmp = new FlwLog();
        					logtmp.setFlwInstance(ins);
        					logtmp.setFromnode(log.getTonode());//退回人
        					logtmp.setNodename(prevCnodeHbm.getName());//退回到节点的名称
        					logtmp.setNodeid(prevCnodeid);//退回到的节点id
        					logtmp.setFtime(flwLog.getFtime());
        					logtmp.setNotes(flwLog.getNotes());
        					logtmp.setFlag(flwLog.getFlag());
        					logtmp.setFtype(flwLog.getFtype());
        					logtmp.setFromnodeid(log.getNodeid());
        					logtmp.setIsresend("0");
        					logtmp.setTonode(preLog.getTonode());
        					
        					flowDAO.insert(logtmp);
        				}
        			};
        		}	
        	}
        	rtnlog.setFlag(true);
        	
        	//跨系统流程处理的数据交互
	        WebContext webContext = WebContextFactory.get(); 
	        HttpServletRequest request = webContext.getHttpServletRequest();
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
        }catch(RuntimeException e){
            e.printStackTrace();
            rtnlog.setSuccess(false);
            rtnlog.setErrormsg(e.getMessage());
        }
        return rtnlog;
    }
    /**
     * 普通节点退回到其所在的状态节点
     */
    public FlwDwrRtnLog toBackNode(String insid, String nodeid, String logid, FlwLog flwLog)
    {
    	FlwDwrRtnLog rtnlog = new FlwDwrRtnLog();
    	try
        {
        	FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
            log.setFlag("1");
            flowDAO.saveOrUpdate(log);
          
            //删除文件，这里不删除任务参数
            List flwFilesInsList = flowDAO.findByWhere(insFilesBean, (new StringBuilder("insid='")).append(insid).
            		append("' and nodeid='").append(nodeid).append("'").toString());
            if(!flwFilesInsList.isEmpty())
            {
                FlwFilesIns fileIns = (FlwFilesIns)flwFilesInsList.get(0);
                String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(fileIns.getFileid()).append("'").toString();
                (new JdbcTemplate(Constant.DATASOURCE)).execute(sql);
                
                FlwFiles file = (FlwFiles)flowDAO.findById(fileBean, fileIns.getFileid());
                flowDAO.delete(file);
                flowDAO.delete(fileIns);
            }
            
            String marks = "";
            List loglist = flowDAO.findByWhere(logBean, (new StringBuilder("flag='0' and insid = ( select insid from ")).
            				append(insBean).append(" where insid = '").append(log.getFlwInstance().getInsid()).append("')").
            				append(" and nodeid in (select cnodeid from ").append(cnodeBean).append(" where nodeid='").
            				append(nodeid).append("')").toString());
            for(Iterator it= loglist.iterator();it.hasNext();){
            	FlwLog _log = (FlwLog) it.next();
            	if(_log.getLogid().equals(logid)){
            		continue;
            	}else{
            		if(marks.equals("")){
            			marks+=_log.getLogid();
            		}else{
            			marks+="`"+_log.getLogid();
            		}
            		_log.setFlag("-1");
            		_log.setIsresend("0");
            		flowDAO.saveOrUpdate(_log);
            	}
            }
            
            //增加新的代办日志
            FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
            List lt = flowDAO.queryWhereOrderBy(logBean, "insid='"+ins.getInsid()+"' and nodeid='"+nodeid+"'", "ftime desc");
            FlwLog tmp = (FlwLog) lt.get(0);
            flwLog.setFlwInstance(ins);
            flwLog.setNodename(tmp.getNodename());
            flwLog.setNodeid(nodeid);
            flwLog.setFromnodeid(log.getNodeid());
            flwLog.setTonode(tmp.getTonode());
            flwLog.setMarks(marks);
            flwLog.setIsresend("0");
            flowDAO.insert(flwLog);
            
            rtnlog.setFlag(true);
            
          //跨系统流程处理的数据交互
	        WebContext webContext = WebContextFactory.get(); 
	        HttpServletRequest request = webContext.getHttpServletRequest();
            this.flwLogDataExchange(log.getFlwInstance().getInsid(), request);
        }
        catch(RuntimeException e)
        {
            e.printStackTrace();
            rtnlog.setSuccess(false);
            rtnlog.setErrormsg("抛出异常："+e.getMessage());
        }
        return rtnlog;
    }
    
    /**
     * 跨系统流程处理
     * 流程日志的流转信息数据同步
     * @param insid
     * @param request
     * @return
     * @author: Liuay
     * @createDate: 2011-10-31
     */
    public String flwLogDataExchange(String insid, HttpServletRequest request) {
    	//山西基建项目暂时屏蔽流程数据交互 zhangh 2014-03-24
    	if(true)return "OK";
    	
//    	当前系统的访问地址
    	String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";
    	SystemMgmFacade systemMgmImpl = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
    	
    	String toUserID = "";
    	RockUser toUser = null;
        SgccIniUnit toUserUnit = null;
        List<SgccIniUnit> toUnitList = new ArrayList<SgccIniUnit>();
        String toUnitIds = "";
        
        List<FlwLog> flwLogList = this.flowDAO.findByWhere(FlwLog.class.getName(), "insid='" + insid + "'");
        for (int i = 0; i < flwLogList.size(); i++) {
        	toUserID = flwLogList.get(i).getTonode();
        	if (toUserID.equalsIgnoreCase("systemuserid")) {
				continue;
			}
        	toUser = (RockUser) this.flowDAO.findById(RockUser.class.getName(), toUserID);
            toUserUnit = systemMgmImpl.getBelongUnit(toUser.getUnitid());

            /*	判断跨系统节点的方法：
             *	1. 流程接收人所属单位的APP_URL不同于不同于当前部署单位的程序地址[从system.properties文件中获取DOMAIN属性]；
            	2. 系统部署在项目单位，流程处理接收人不在3级单位和项目单位下；
            	3. 系统部署在集团， 流程处理接收人是3级单位或项目单位用户;
            	4. 如果流程接收人是系统管理员(system),则不进行数据交换；
             */
            String domainUrl = Constant.propsMap.get("DOMAIN");
            if (domainUrl!=null && domainUrl.trim().length()>0) {
				appUrl = domainUrl.trim();
			}
            if(!toUser.getUseraccount().equalsIgnoreCase("system")
            		&& toUnitIds.indexOf("`" + toUserUnit.getUnitid() + "`")==-1
            		&& toUserUnit.getAppUrl()!=null && 
            		(toUserUnit.getAppUrl().trim().toLowerCase().indexOf(appUrl)==-1
            				|| (Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A") && !toUserUnit.getUnitTypeId().equals("A") && !toUserUnit.getUnitTypeId().equals("3")) 
            				|| (Constant.propsMap.get("DEPLOY_UNITTYPE").equals("0") && (toUserUnit.getUnitTypeId().equals("A") || toUserUnit.getUnitTypeId().equals("3"))))) {
            	if(toUnitIds.length()==0) {
            		toUnitIds = "`" + toUserUnit.getUnitid() + "`";
            	} else {
            		toUnitIds += toUserUnit.getUnitid() + "`";
            	}
            	toUnitList.add(toUserUnit);
            }
		}
        System.out.println("----------------" + toUnitIds);
        
        if (toUnitList.size()>0) {
        	/*	组织跨系统流程处理需要交换的数据
        	 * FLW_INSTANCE 
        	 * FLW_LOG
        	 * FLW_ADJUNET_INS -- APP_BLOB
        	 * FLW_FILES_INS -- APP_BLOB
        	 * */
        	List sendBusinessData = new ArrayList();
        	List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
        	PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
        	
        	List<FlwInstance> flwInstanceList = this.flowDAO.findByWhere(FlwInstance.class.getName(), "insid='" + insid + "'");
        	sendBusinessData.addAll(flwInstanceList);
        	sendBusinessData.addAll(flwLogList);
        	List<FlwAdjunctIns> flwAdjunctInsList = this.flowDAO.findByWhere(FlwAdjunctIns.class.getName(), "insid='" + insid + "'");
        	sendBusinessData.addAll(flwAdjunctInsList);
        	List<FlwFilesIns> flwFilesInsList = this.flowDAO.findByWhere(FlwFilesIns.class.getName(), "insid='" + insid + "'");
        	sendBusinessData.addAll(flwFilesInsList);
        	String fileIds = "";
        	for (int i = 0; i < flwFilesInsList.size(); i++) {
				fileIds += "`" + flwFilesInsList.get(i).getFileid();
			}
        	if (fileIds.length()>0) {
				fileIds = fileIds.substring(1);
				List<FlwFiles> flwFilesList = this.flowDAO.findByWhere(FlwFiles.class.getName(), "fileid in (" + StringUtil.transStrToIn(fileIds, "`") + ")");
				sendBusinessData.addAll(flwFilesList);
			}
        	
    		//对需要流程日志同步的单位数据交换操作
        	for (int i = 0; i < toUnitList.size(); i++) {
        		String bizInfo = "流程日志跨系统处理";
        		sendDataList = dataExchangeService.getExchangeDataList(sendBusinessData, toUnitList.get(i).getUnitid(), bizInfo);
        		PcDataExchange lastBusinessData = sendDataList.get(sendDataList.size()-1); 
        		String curTxGroup = lastBusinessData.getTxGroup();
        		Long curXh = lastBusinessData.getXh();
        		// 手动生成所有app_blob的dataExchange记录
        		//流程附件的大对象
    			for (int j = 0; j < flwAdjunctInsList.size(); j++) {
    				FlwAdjunctIns tempAdjunctIns = flwAdjunctInsList.get(j);
    				PcDataExchange exchange = new PcDataExchange();
    				exchange.setTableName("APP_BLOB");
    				exchange.setBlobCol("BLOB");
    				JSONArray kvarr = new JSONArray();
    				JSONObject kv = new JSONObject();
    				kv.put("FILEID", tempAdjunctIns.getFileid());
    				kvarr.add(kv);
    				exchange.setKeyValue(kvarr.toString());
    				exchange.setSuccessFlag("0");
    				exchange.setXh(curXh + j + 1);
    				exchange.setPid(toUnitList.get(i).getUnitid());
    				exchange.setTxGroup(curTxGroup);
    				exchange.setBizInfo("流程附件信息");
    				sendDataList.add(exchange);
    			}
    			
    			//流程文档的大对象
    			for (int j = 0; j < flwFilesInsList.size(); j++) {
    				FlwFilesIns tempFilesIns = flwFilesInsList.get(j);
    				PcDataExchange exchange = new PcDataExchange();
    				exchange.setTableName("APP_BLOB");
    				exchange.setBlobCol("BLOB");
    				JSONArray kvarr = new JSONArray();
    				JSONObject kv = new JSONObject();
    				kv.put("FILEID", tempFilesIns.getFileid());
    				kvarr.add(kv);
    				exchange.setKeyValue(kvarr.toString());
    				exchange.setSuccessFlag("0");
    				exchange.setXh(curXh + j + 1);
    				exchange.setPid(toUnitList.get(i).getUnitid());
    				exchange.setTxGroup(curTxGroup);
    				exchange.setBizInfo("流程审批文件附件信息");
    				sendDataList.add(exchange);
    			}
        		Map<String, String> map = dataExchangeService.sendExchangeData(sendDataList);
        		
//        		如果数据交换失败，增加到数据交换队列中
        		if(map.get("result").equalsIgnoreCase("fail")) {
        			dataExchangeService.addExchangeListToQueue(sendDataList);
        			return "Error";
        		}
			}
		}
    	return "OK";
    }
    
    /**
     * 跨系统流程处理
     * 流程日志的流转信息数据同步【删除】
     * @param insid	需要删除的流程实例ID
     * @param toUnitList	需要进行数据同步的单位
     * @param toUnitList
     * @param request
     * @return
     * @author: Liuay
     * @createDate: 2011-11-1
     */
    public String flwLogDataDeleteExchange(String insid, List<SgccIniUnit> toUnitList, HttpServletRequest request){
    	//山西基建项目暂时屏蔽流程数据交互 zhangh 2014-03-24
    	if(true)return "OK";
    	
        if (toUnitList.size()>0) {
        	List<PcDataExchange> sendDataList = new ArrayList<PcDataExchange>();
        	PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");

        	String txGroup = SnUtil.getNewID("tx-");
        	String bizInfo = "流程日志跨系统处理(删除)";
        	String flwFileInsBlobDelSql = "delete from APP_BLOB WHERE fileid in ( select fileid from FLW_FILES_INS where insid='" + insid + "')";
        	String flwAdjunctInsBlobDelSql = "delete from APP_BLOB WHERE fileid in ( select fileid from FLW_ADJUNCT_INS where insid='" + insid + "')";
        	String flwMaterialRemoveDelSql = "delete from FLW_MATERIAL_REMOVE where insid ='" + insid + "'";
        	String flwFilesDelSql = "delete from FLW_FILES where FILEID IN ( SELECT FILEID FROM FLW_FILES_INS WHERE INSID='" + insid + "')";
        	String flwFilesInsDelSql = "delete from FLW_FILES_INS where insid ='" + insid + "'";
        	String flwAdjunctInsDelSql = "delete from FLW_ADJUNCT_INS where insid ='" + insid + "'";
        	String flwLogDelSql = "delete from FLW_LOG where insid ='" + insid + "'";
        	String flwInsDelSql = "delete from FLW_INSTANCE where insid ='" + insid + "'";
        	
        	PcDataExchange dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwFileInsBlobDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwAdjunctInsBlobDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwMaterialRemoveDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwFilesDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwFilesInsDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwAdjunctInsDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwLogDelSql);
        	sendDataList.add(dataExchange);
        	
        	dataExchange = new PcDataExchange();
        	dataExchange.setSqlData(flwInsDelSql);
        	sendDataList.add(dataExchange);
        	
        	
    		//对需要流程日志同步的单位数据交换操作
        	for (int i = 0; i < toUnitList.size(); i++) {
        		PcDataExchange temp = null;
        		for (int j = 0; j < sendDataList.size(); j++) {
        			temp = sendDataList.get(j);
        			temp.setTxGroup(txGroup);
        			temp.setBizInfo(bizInfo);
        			temp.setPid(toUnitList.get(i).getUnitid());
				}
        		Map<String, String> map = dataExchangeService.sendExchangeData(sendDataList);
//        		如果数据交换失败，增加到数据交换队列中
        		if(map.get("result").equalsIgnoreCase("fail")) {
        			dataExchangeService.addExchangeListToQueue(sendDataList);
        			return "Error";
        		}
			}
		}
    	return "OK";
    }
    
    
    /**
     * 状态节点退回到上一步的状态节点（不能退回到开始节点）
	 * @param flowid 流程id
	 * @param insid  流程实例id
	 * @param nodeid 当前状态节点id
	 * @param cnodeid 当前普通节点id
	 * @param logid   当前日志id
	 * @param flwLog  退回日志对象
	 * @return
     * @author: zhangh 2013-10-15
     */
    public FlwDwrRtnLog toBackStateNode(String flowid, String insid, String nodeid, String cnodeid, String logid, FlwLog flwLog){
    	FlwDwrRtnLog rtnlog = new FlwDwrRtnLog();
    	try {
    		FlwLog log = (FlwLog) this.flowDAO.findById(logBean, logid);
        	FlwInstance ins = (FlwInstance)flowDAO.findById(insBean, log.getFlwInstance().getInsid());
        	String nodes[] = ins.getWorklog().split(",");
        	//小于2，表示当前停留在开始节点
        	if(nodes.length < 2){
        		rtnlog.setSuccess(false);
				rtnlog.setErrormsg("当前节点已是开始节点！");
				return rtnlog;
        	}
        	//根据Worklog查找状态节点步骤，确认退回的节点
            String fromnodeid = nodes[nodes.length - 1];
            String tonodeid = nodes[nodes.length - 2];
        	//上一步的状态节点日志
			List list1 = this.flowDAO.findByWhere(logBean, "insid ='" + insid
					+ "' and nodeid = '" + tonodeid + "' and flag = '1' and ftype = '7'", "ftime desc");
			if(list1 == null || list1.size() == 0){
				rtnlog.setSuccess(false);
				rtnlog.setErrormsg("上一个状态审批节点不存在，您可以选择【退回本业务发起人】退回到其所在的业务节点！");
				return rtnlog;
			}
			
				log.setFlag("1");
				flowDAO.saveOrUpdate(log);
				removeCommitState(ins);
				
				FlwLog log1 = (FlwLog) list1.get(0);
				
				FlwNode node = (FlwNode) this.flowDAO.findById(nodeBean, tonodeid);
				
				FlwLog logtmp = new FlwLog();
				logtmp.setFlwInstance(ins);
				logtmp.setFromnode(flwLog.getFromnode());//退回操作的用户userid
				logtmp.setTonode(log1.getTonode());//退回接受的用户userid
				logtmp.setNodeid(tonodeid);//退回到的节点id
				logtmp.setNodename(node.getName());//退回到节点的名称
				logtmp.setFromnodeid(fromnodeid);//进行退回操作的节点id
				logtmp.setFtime(new Date());
				logtmp.setNotes(flwLog.getNotes());
				logtmp.setFlag(flwLog.getFlag());
				logtmp.setFtype(flwLog.getFtype());
				logtmp.setIsresend("0");
				flowDAO.insert(logtmp);
				
				rtnlog.setFlag(true);
        	
		} catch (Exception e) {
			e.printStackTrace();
            rtnlog.setSuccess(false);
            rtnlog.setErrormsg(e.getMessage());
		}
        
    	return rtnlog;
    }

    /**
	 * 找到需要发送短信的流程任务，加入到短信队列，发送短信
	 * @param insid 实例ID
	 * @param logid 当前日志ID
	 * @param logList 日志集(当要发送到多个人时，会有多条记录)
	 * @author pengy 2013-11-15
	 */
    public void sendMsgNow(String insid, String logid, String logListStr){
    	//获得发送节点ID
    	FlwLog log = (FlwLog)flowDAO.findById(logBean, logid);
    	String fromnodeid = log.getNodeid();
		JSONArray ja = JSONArray.fromObject(logListStr);
		List<FlwLog> logList = JSONArray.toList(ja, FlwLog.class);
		List<TaskView> flwTasks = new ArrayList<TaskView>();
		for (int i=0; i < logList.size(); i++){
			FlwLog flwLog = logList.get(i);
			String tonode = flwLog.getTonode();//接收人ID
			String nodeid = flwLog.getNodeid();//接收人流程节点ID
			//根据实例ID,接收人ID,接收人流程节点ID,发送人ID,发送节点ID,状态为待处理的,6个条件查找到唯一的需要发短信的流程任务
			List<FlwLog> flwLogNew = this.flowDAO.findByWhere(FlwLog.class.getName(),
					"insid='" + insid + "' and tonode='" + tonode + "' and nodeid='" + nodeid +
					"' and fromnode='" + flwLog.getFromnode() + "' and fromnodeid='" + fromnodeid + "' and flag='0'");
			if (flwLogNew == null || flwLogNew.size() == 0){
				//选择性合并时，若已经有人发送给下一个人，则不添加日志，所以这里查不到
				return;
			}
			List<TaskView> flwTask = this.flowDAO.findByWhere(TaskView.class.getName(),
					"logid='" + flwLogNew.get(0).getLogid() + "'");
			if (flwTask != null && flwTask.size()>0){
				flwTasks.add(flwTask.get(0));
			}
		}
		//判断是否在即时发送时间段内，若在，则加入短信队列，然后发送短信
		if (flwTasks != null && flwTasks.size()>0){
			smsCommonSer.isSendMsgNow(flwTasks);
		}
	}

}