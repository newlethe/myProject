package com.sgepit.pmis.contract.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.hbm.BdgProject;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConPartyb;

public class ConPartybMgmImpl extends BaseMgmImpl implements ConPartybMgmFacade {
	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConPartybMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConPartybMgmImpl) ctx.getBean("conpartybMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	@SuppressWarnings("unchecked")
	public void insertConPartyb(ConPartyb conPartyb) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(conPartyb);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List dataList = new ArrayList();
			dataList.add(conPartyb);	
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conPartyb.getPid(),"","","新增或修改乙方单位");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	public void updateConPartyb(ConPartyb conPartyb) throws SQLException, BusinessException {
		this.contractDAO.saveOrUpdate(conPartyb);
		if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
			List dataList = new ArrayList();
			dataList.add(conPartyb);	
			//获取PCDataExchangeService实例
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,conPartyb.getPid(),"","","新增或修改乙方单位");
			dataExchangeService.addExchangeListToQueue(ExchangeList);		
		}
	}
	
	public List getPartyB() throws SQLException, BusinessException{
		List list = contractDAO.findOrderBy2(BusinessConstants.CON_PACKAGE.concat(BusinessConstants.CON_PARTYB), "partyb");
		return list;
	}
	
	public ConPartyb getPartyBBean(String cpid) throws SQLException, BusinessException{
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_PARTYB;
		String strWhere = "cpid = '" + cpid + "'";
		List list = contractDAO.findByWhere(beanName, strWhere);
		if (list.isEmpty()) return new ConPartyb();
		return (ConPartyb)list.get(0);
	}
	
	public boolean checkPartyb(String partybno, String partyb, String cpid){
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_PARTYB;
		String strWhere = " (partybno = '" + partybno + "' or partyb = '" + partyb + "')";
		List list = this.contractDAO.findByWhere(beanName, strWhere);
		for(int i=0;i<list.size();i++){
			ConPartyb conPartyb = (ConPartyb)list.get(i);
			if(cpid.equals(conPartyb.getCpid())){
				return true;
			}else {
				return false;
			}
		}
		return true;
	}
	
	public String getPartyBNo(){
		String sql = "select max(nvl(to_number(partybno),0))+1 from con_partyb";
		JdbcTemplate jdbctemp = JdbcUtil.getJdbcTemplate();
		String no = "";
		try {
			no = (String) jdbctemp.queryForObject(sql, String.class);
		} catch (DataAccessException e) {
			no = "0";
			e.printStackTrace();
		}
		return no;
	}
	public String getyfdwmc(String cpid){
		String mc="";
		String beanName = BusinessConstants.CON_PACKAGE + BusinessConstants.CON_PARTYB;
		if(cpid!= null){
			Object obj = this.contractDAO.findById(beanName, cpid);
			if(obj != null){
				ConPartyb conpartyb=(ConPartyb)obj;			
				mc=conpartyb.getPartyb();			
			}		
		}
		return mc;
	}

	public void immediatelySendPartybDel(String ids, String beanName) {
		   List delPartybList = new ArrayList<ConPartyb>();
		   if(ids!=null&&!"".equals(ids)){
			   String [] Ids =ids.split(",");
			   if("com.sgepit.pmis.contract.hbm.ConPartyb".equals(beanName)){
				   for(int i = 0;i<Ids.length;i++){
					   ConPartyb con = new ConPartyb();
					   con.setCpid(Ids[i]);
					   delPartybList.add(con);
				   }
			   }
			   if("com.sgepit.pmis.budget.hbm.BdgProject".equals(beanName)){
				   for(int i = 0;i<Ids.length;i++){
					   BdgProject bdgProject = new BdgProject();
					   bdgProject.setProappid(Ids[i]);
					   delPartybList.add(bdgProject);
				   }
			   }
		   }
			HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
		   if(!delPartybList.isEmpty()){
			   //查寻是否有数据交互的PID
			   if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
				   PCDataExchangeService dataExchangeService = 
					   (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				   List ExchangeList = dataExchangeService.getExcDataList(delPartybList, Constant.DefaultOrgRootID,pid,"","","新增或修改乙方单位或工程量");
				   dataExchangeService.addExchangeListToQueue(ExchangeList);				
			   }
		   }
	}

	@SuppressWarnings("unchecked")
	public void immediatelySendPartybSave(String insertIds, String updateids,
			String beanName) {
		List dataList = new ArrayList<ConPartyb>();
	     if(insertIds!=null&&!"".equals(insertIds)){
	    	 String [] ids = insertIds.split(",");
	    	 if("com.sgepit.pmis.contract.hbm.ConPartyb".equals(beanName)){
	    	 for(int i=0;i<ids.length;i++){
	    			 ConPartyb con = new ConPartyb();
	    			 con.setCpid(ids[i]);
	    			 dataList.add(con);
	    		 }
	    	 }
	    	 if("com.sgepit.pmis.budget.hbm.BdgProject".equals(beanName)){
	    		 for(int i=0;i<ids.length;i++){
	    			 BdgProject  bdgProject = new BdgProject();
	    			 bdgProject.setProappid(ids[i]);
	    			 dataList.add(bdgProject);
	    		 }
	    	 }
	     }
	     if(updateids!=null&&!"".equals(updateids)){
	    	 String []upIds = updateids.split(",");
	    	 if("com.sgepit.pmis.contract.hbm.ConPartyb".equals(beanName)){
	    	 for(int k=0;k<upIds.length;k++){
	    			 ConPartyb con = new ConPartyb();
	    			 con.setCpid(upIds[k]);
	    			 dataList.add(con);
	    		 }
	    	 }
	    	 if("com.sgepit.pmis.budget.hbm.BdgProject".equals(beanName)){
	    		 for(int i=0;i<upIds.length;i++){
	    			 BdgProject  bdgProject = new BdgProject();
	    			 bdgProject.setProappid(upIds[i]);
	    			 dataList.add(bdgProject);
	    		 }
	    	 }
	     }
	        HttpSession  session =WebContextFactory.get().getSession();
			String pid=(String)session.getAttribute(Constant.CURRENTAPPPID);
			//获取PCDataExchangeService实例
			if(!dataList.isEmpty()){
				if("A".equals(Constant.propsMap.get("DEPLOY_UNITTYPE"))){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					List ExchangeList = dataExchangeService.getExcDataList(dataList, Constant.DefaultOrgRootID,pid,"","","新增或修改乙方单位或新增修改工程量信息【"+pid+"】");
					dataExchangeService.addExchangeListToQueue(ExchangeList);
				}
			}
	}
}
