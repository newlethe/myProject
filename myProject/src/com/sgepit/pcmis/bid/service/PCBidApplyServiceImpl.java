package com.sgepit.pcmis.bid.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.pcmis.bid.dao.PCBidDAO;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.contract.hbm.ConOveView;


public class PCBidApplyServiceImpl implements PCBidApplyService{
	
	private PCBidDAO pcBidDAO;

	public PCBidDAO getPcBidDAO() {
		return pcBidDAO;
	}

	public void setPcBidDAO(PCBidDAO pcBidDAO) {
		this.pcBidDAO = pcBidDAO;
	}
	
	/**
	 * 如果是动态数据的请求, 根据outFilter提供的参数来获得符合要求的招标项目; 否则, 获得项目的所有招标项目
	 * @param pid
	 * @param outFilter 如果是动态数据请求数据附加参数
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<PcBidZbApply> getBidApplyForCurrentPrj(String[] outFilter,String pid){
		List<PcBidZbApply> bidApplyList = null;
		if(outFilter==null){
			bidApplyList = pcBidDAO.findByProperty(PcBidZbApply.class.getName(), "pid", pid);
		}else{
			String cpid=outFilter[0];
			String time=outFilter[1];
			String opType=outFilter[2];
			String progressType=outFilter[3];
			
			String progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_ISSUE_WIN_DOC' and pdd.pid = '"+
								cpid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			String contentSql="select distinct pbp.contentUids from  PcBidIssueWinDoc pbp where pbp.uids in ("+progressSql+")";
			if(progressType!=null)              
			{
				progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_PROGRESS' and pdd.pid = '"+
					cpid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
				contentSql = "select distinct pbp.contentUids from PcBidProgress pbp where pbp.uids in ("+progressSql+") and pbp.progressType='"+progressType+"'";
			}
			String applySql="select distinct pbc.zbUids from PcBidZbContent pbc where pbc.uids in ("+contentSql+")";
			String where="from PcBidZbApply pba where pba.uids in ("+applySql+")";
			bidApplyList=pcBidDAO.findByHql( where);
			
		}
		return bidApplyList;
	}
	
	/**
	 * 如果是动态数据的请求, 根据outFilter提供的参数来获得符合要求的招标内容; 否则, 获得项目的所有招标内容
	 * @param zbUids 招标项目主键值
	 * @param outFilter 动态数据请求数据的附加参数
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<PcBidZbContent> getContentForCurrentApply(String[] outFilter,String zbUids){
		List<PcBidZbContent> contentList=null;
		if(outFilter==null){
			contentList = pcBidDAO.findByProperty(PcBidZbContent.class.getName(), "zbUids", zbUids, "contentes");
		}else{
			String pid=outFilter[0];
			String time=outFilter[1];
			String opType=outFilter[2];
			String progressType=outFilter[3];
			
			String progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_PROGRESS' and pdd.pid = '"+
							pid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			String contentSql="select distinct pbp.contentUids from PcBidProgress pbp where pbp.uids in ("+progressSql+")";
			
			if(progressType==null)
			{
			     progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_ISSUE_WIN_DOC' and pdd.pid = '"+
			     	pid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			     contentSql="select distinct pbp.contentUids from PcBidIssueWinDoc pbp where pbp.uids in ("+progressSql+")";
			}
			String where="from PcBidZbContent pbc where pbc.uids in ("+contentSql+") and pbc.zbUids='"+zbUids+"'";
			contentList=pcBidDAO.findByHql( where);
		}
		return contentList;
	}
	
	/**
	 * 判断哪些子页面有动态数据更新
	 */
	public String [] filterBidDetailTreeNode(String[] outFilter){
		String pid=outFilter[0];
		String time=outFilter[1];
		String opType=outFilter[2];
		String progressSql="select pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_BID_PROGRESS' and pdd.pid = '"+
			pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"' and pdd.pc_table_op_type='"+opType+"'";
		String contentSql="select distinct pbp.progress_type from pc_bid_progress pbp where pbp.uids in ("+progressSql+")";
		List lt=pcBidDAO.getDataAutoCloseSes(contentSql);
		
		//发放中标通知书
		String sql = "select pdd.pc_table_uids from pc_dynamic_data pdd where pdd.pc_table_name = 'PC_BID_ISSUE_WIN_DOC' and pdd.pid = '"+
			pid+"' and to_char(pdd.pc_dynamic_date, 'yyyyMM') = '"+time+"' and pdd.pc_table_op_type='"+opType+"'";
		List lt2 = pcBidDAO.getDataAutoCloseSes(sql);
		if(lt2.size()>0)
			lt.add("issue");
		
		String[] result=new String[lt.size()];
		for(int i=0;i<lt.size();i++){
			result[i]=lt.get(i).toString();
		}
		return result;
	}
	

	public Map<String, String> getProjectScheduleByPid(String pid,String totalMoney) {
	      int zbpro=0;
	      double totalmoney=0;//签订合同金额
	      boolean flag= true;
	      boolean conFlag =false;
	      List zbPrjList = pcBidDAO.findByWhere(PcBidZbApply.class.getName()," pid='"+pid+"'");
	       for(int i=0;i<zbPrjList.size();i++){
	           PcBidZbApply  pcBidZbApply =(PcBidZbApply)zbPrjList.get(i);
	         List zbContentList = pcBidDAO.findByWhere(PcBidZbContent.class.getName()," zbUids='"+pcBidZbApply.getUids()+"' and pid='"+pid+"'");
	            for(int k=0;k<zbContentList.size();k++){
	               conFlag = true;
	               PcBidZbContent pcZbCon =(PcBidZbContent)zbContentList.get(k);
	               List money=pcBidDAO.findByWhere(ConOve.class.getName(),"bidtype='"+pcZbCon.getUids()+"'");
	                 for(int m=0;m<money.size();m++){
	                 ConOve conOve =(ConOve)money.get(m);
	                 totalmoney=totalmoney+conOve.getConmoney();
	                 }
	               if(pcZbCon.getRateStatus()!=1d){
	                   flag = false;
	               }
	            }
	            if(conFlag&&flag){
	                zbpro=zbpro+1;
	            }
	       }
	       double percent=0.00000d; 
	       if(totalmoney==0||totalMoney==null||"".equals(totalMoney)){
	    	   
	       }else {
	    	    percent=totalmoney/Double.valueOf(totalMoney);
	       }
	       
	       java.text.DecimalFormat fnum  = new java.text.DecimalFormat("0.00000");
	       String results = fnum.format(percent);
	       Map map =new HashMap<String, String>();
	       map.put("bidcompletePro", String.valueOf(zbpro));
	       map.put("bidsingedCon", String.valueOf(totalmoney));
	       map.put("bidpercentage", results);
		return map;
	}
	  /*
	   * 找出当前项目下所有的代理机构名称,去掉重复的名称
	   * */
	public List<PcBidZbAgency> getBidPcBidZbAgencyForCurrentPrj(String pid) {
		List<PcBidZbAgency> pcBidZbAgencyList = new ArrayList<PcBidZbAgency>();
		List list=pcBidDAO.getDataAutoCloseSes("select distinct(agency_name) from pc_bid_zb_agency where pid='"+pid+"'");
		if(null!=list&&list.size()>0){
			for(int i=0;i<list.size();i++){
				Object o =list.get(i);	
				PcBidZbAgency pa=new PcBidZbAgency();
				pa.setAgencyName(o.toString());
				pcBidZbAgencyList.add(pa);				
			}
		}
		return pcBidZbAgencyList;
	}

	/**
	 * 根据招标项目等条件找出符合条件的招标内容
	 * @param outFilter		外部动态参数
	 * @param whereStr		其他条件
	 * @param bean存在发放中标通知书并且中标通知书工作进度为100%的招标内容或选了招标内容的合同
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-7-30
	 */	
	@SuppressWarnings("unchecked")
	public List<PcBidZbContent> getContentForCurrentApplyByWhere(String bean,String outFilter[],String whereStr){
		List<PcBidZbContent> contentList=new ArrayList<PcBidZbContent>();
		if(outFilter==null){ 
			List<PcBidZbContent>tempContentList=pcBidDAO.findByWhere(PcBidZbContent.class.getName(), whereStr, "contentes");
			for(int i=0;i<tempContentList.size();i++){
				PcBidZbContent pcBidZbContent=tempContentList.get(i);
				if("PcBidIssueWinDoc".equalsIgnoreCase(bean)){
					List<PcBidIssueWinDoc>PcBidIssueWinDocList=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "contentUids='"+pcBidZbContent.getUids()+"' and rateStatus=100", "contentUids");
						if(PcBidIssueWinDocList!=null&&PcBidIssueWinDocList.size()>0){
							contentList.add(pcBidZbContent);
						}
				}else if("ConOve".equalsIgnoreCase(bean)){
					List<ConOve>conOveList=pcBidDAO.findByWhere(ConOve.class.getName(), "bidtype='"+pcBidZbContent.getUids()+"'", "conid");
					if(conOveList!=null&&conOveList.size()>0){
						contentList.add(pcBidZbContent);
					}
				}

			}
		}else{
			String pid=outFilter[0];
			String time=outFilter[1];
			String opType=outFilter[2];
			String progressType=outFilter[3];
			
			String progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_PROGRESS' and pdd.pid = '"+
							pid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			String contentSql="select distinct pbp.contentUids from PcBidProgress pbp where pbp.uids in ("+progressSql+")";
			
			if(progressType==null)
			{
			     progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_ISSUE_WIN_DOC' and pdd.pid = '"+
			     	pid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			     contentSql="select distinct pbp.contentUids from PcBidIssueWinDoc pbp where pbp.uids in ("+progressSql+")";
			}
			String where="from PcBidZbContent pbc where pbc.uids in ("+contentSql+") and "+whereStr;
			List<PcBidZbContent>tempContentList=pcBidDAO.findByHql( where);
			for(int i=0;i<tempContentList.size();i++){
				PcBidZbContent pcBidZbContent=tempContentList.get(i);
				if("PcBidIssueWinDoc".equalsIgnoreCase(bean)){
					List<PcBidIssueWinDoc>PcBidIssueWinDocList=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "contentUids='"+pcBidZbContent.getUids()+"' and rateStatus=100", "contentUids");
						if(PcBidIssueWinDocList!=null&&PcBidIssueWinDocList.size()>0){
							contentList.add(pcBidZbContent);
						}
				}else if("ConOve".equalsIgnoreCase(bean)){
					List<ConOve>conOveList=pcBidDAO.findByWhere(ConOve.class.getName(), "bidtype='"+pcBidZbContent.getUids()+"'", "conid");
					if(conOveList!=null&&conOveList.size()>0){
						contentList.add(pcBidZbContent);
					}
				}

			}			
		}
		return contentList;
	}
	/**
	 找出存在发放中标通知书或合同下的招标项目下的招标内容存在的记录的招标项目
	 *@param outFilter
	 * @param bean
	 * @param pid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<PcBidZbApply> getBidApplyForCurrentPrjByBean(String bean,String[] outFilter,String pid){
		List<PcBidZbApply> bidApplyList = new ArrayList<PcBidZbApply>();
		if(outFilter==null){
			List<PcBidZbApply> tempbidApplyList = pcBidDAO.findByProperty(PcBidZbApply.class.getName(), "pid", pid);
			for(int i=0;i<tempbidApplyList.size();i++){
				PcBidZbApply pcBidZbApply=tempbidApplyList.get(i);
				List<PcBidZbContent>tempContentList=pcBidDAO.findByWhere(PcBidZbContent.class.getName(), "zbUids='"+pcBidZbApply.getUids()+"'", "contentes");				
				for(int j=0;j<tempContentList.size();j++){
					PcBidZbContent pcBidZbContent=tempContentList.get(j);
					if("PcBidIssueWinDoc".equalsIgnoreCase(bean)){
						List<PcBidIssueWinDoc>PcBidIssueWinDocList=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "contentUids='"+pcBidZbContent.getUids()+"' and rateStatus=100", "contentUids");
							if(PcBidIssueWinDocList!=null&&PcBidIssueWinDocList.size()>0){
								bidApplyList.add(pcBidZbApply);
								break;
							}
					}else if("ConOve".equalsIgnoreCase(bean)){
						List<ConOveView>conOveList=pcBidDAO.findByWhere(ConOve.class.getName(), "bidtype='"+pcBidZbContent.getUids()+"'", "conid");
						if(conOveList!=null&&conOveList.size()>0){
							bidApplyList.add(pcBidZbApply);
							break;
						}
					}					
				}

			}			
		}else{
			String cpid=outFilter[0];
			String time=outFilter[1];
			String opType=outFilter[2];
			String progressType=outFilter[3];
			
			String progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_ISSUE_WIN_DOC' and pdd.pid = '"+
								cpid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
			String contentSql="select distinct pbp.contentUids from  PcBidIssueWinDoc pbp where pbp.uids in ("+progressSql+")";
			if(progressType!=null)              
			{
				progressSql="select pdd.pctableuids from PcDynamicData pdd where pdd.pctablename = 'PC_BID_PROGRESS' and pdd.pid = '"+
					cpid+"' and to_char(pdd.pcdynamicdate, 'yyyyMM') = '"+time+"' and pdd.pctableoptype='"+opType+"'";
				contentSql = "select distinct pbp.contentUids from PcBidProgress pbp where pbp.uids in ("+progressSql+") and pbp.progressType='"+progressType+"'";
			}
			String applySql="select distinct pbc.zbUids from PcBidZbContent pbc where pbc.uids in ("+contentSql+")";
			String where="from PcBidZbApply pba where pba.uids in ("+applySql+")";
			List<PcBidZbApply> tempbidApplyList=pcBidDAO.findByHql( where);
			for(int i=0;i<tempbidApplyList.size();i++){
				PcBidZbApply pcBidZbApply=tempbidApplyList.get(i);
				List<PcBidZbContent>tempContentList=pcBidDAO.findByWhere(PcBidZbContent.class.getName(), "zbUids='"+pcBidZbApply.getUids()+"'", "contentes");				
				for(int j=0;j<tempContentList.size();j++){
					PcBidZbContent pcBidZbContent=tempContentList.get(j);
					if("PcBidIssueWinDoc".equalsIgnoreCase(bean)){
						List<PcBidIssueWinDoc>PcBidIssueWinDocList=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "contentUids='"+pcBidZbContent.getUids()+"' and rateStatus=100", "contentUids");
							if(PcBidIssueWinDocList!=null&&PcBidIssueWinDocList.size()>0){
								bidApplyList.add(pcBidZbApply);
							}
					}else if("ConOve".equalsIgnoreCase(bean)){
						List<ConOveView>conOveList=pcBidDAO.findByWhere(ConOve.class.getName(), "bidtype='"+pcBidZbContent.getUids()+"'", "conid");
						if(conOveList!=null&&conOveList.size()>0){
							bidApplyList.add(pcBidZbApply);
						}
					}					
				}

			}			
			
		}
		return bidApplyList;
	}

}
